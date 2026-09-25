"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import JobBoard from "@/components/JobRow";
import { LoadingBlock, ErrorBlock } from "@/components/StateBlocks";
import type { Job } from "@/data/jobs";
import { getJobs } from "@/lib/api";
import { useBookmarks } from "@/hooks/useBookmarks";

const postedTime = (job: Job) => Date.parse(job.postedAt) || 0;

export default function BookmarksPage() {
  // Bookmarked job IDs live in localStorage
  const { bookmarkedJobIds, isBookmarked, toggleBookmark, isLoaded } = useBookmarks();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [isJobsLoading, setIsJobsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [fetchAttempt, setFetchAttempt] = useState(0);

  // The last removed job, kept so the status bar can undo it
  const [removedJob, setRemovedJob] = useState<Job | null>(null);

  useEffect(() => {
    getJobs()
      .then((fetchedJobs) => {
        setJobs(fetchedJobs);
        setHasError(false);
      })
      .catch(() => setHasError(true))
      .finally(() => setIsJobsLoading(false));
  }, [fetchAttempt]);

  // Saved jobs that still exist in the API, newest first
  const bookmarkedJobs = useMemo(
    () =>
      jobs
        .filter((job) => bookmarkedJobIds.includes(job.id))
        .sort((first, second) => postedTime(second) - postedTime(first)),
    [jobs, bookmarkedJobIds]
  );

  const removeJob = (job: Job) => {
    toggleBookmark(job.id);
    setRemovedJob(job);
  };

  const undoRemove = () => {
    if (removedJob && !isBookmarked(removedJob.id)) toggleBookmark(removedJob.id);
    setRemovedJob(null);
  };

  const savedCount = bookmarkedJobIds.length;
  const isLoading = !isLoaded || (savedCount > 0 && isJobsLoading);
  const shownCount = bookmarkedJobs.length;

  return (
    <main className="flex-1">
      {/* Page header */}
      <div className="flex flex-col gap-3.5 px-4 pb-3.5 pt-[22px] md:flex-row md:items-end md:justify-between md:px-12 md:pb-6 md:pt-10">
        <div className="flex flex-col gap-2">
          <p className="hidden font-mono text-[13px] font-bold tracking-[0.1em] text-brand-text md:block">
            YOUR SAVED ROUTE
          </p>

          <div className="flex items-baseline justify-between">
            <h1 className="text-[34px] font-extrabold leading-none tracking-[-0.03em] md:text-5xl">
              Bookmarks
            </h1>
            <span className="font-mono text-sm font-semibold text-muted md:hidden">
              {isLoaded ? `${savedCount} saved` : "— saved"}
            </span>
          </div>

          <p className="hidden text-[17px] text-muted md:block">
            {!isLoaded
              ? "Jobs saved in this browser."
              : savedCount > 0
                ? `${savedCount} ${savedCount === 1 ? "job" : "jobs"} saved in this browser`
                : "Nothing saved yet"}
          </p>
        </div>

        <Link
          href="/jobs"
          className="hidden h-12 items-center rounded-full border-[1.5px] border-ink bg-card px-[22px] text-[15px] font-bold hover:bg-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink md:flex"
        >
          Browse all jobs →
        </Link>
      </div>

      <div className="flex flex-col gap-2.5 px-3 md:gap-3.5 md:px-12">
        {/* Undo status bar */}
        <div role="status">
          {removedJob && (
            <div className="flex items-center justify-between gap-3 rounded-xl border-[1.5px] border-ink bg-card py-1.5 pl-3.5 pr-1.5 text-sm md:py-2 md:pl-[18px] md:pr-2 md:text-[15px]">
              <span className="min-w-0 truncate">
                Removed <b>{removedJob.title}</b>
                <span className="hidden sm:inline"> from bookmarks</span>.
              </span>
              <button
                type="button"
                onClick={undoRemove}
                className="h-11 shrink-0 rounded-full bg-ink px-4 text-sm font-bold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink md:px-[18px]"
              >
                Undo
              </button>
            </div>
          )}
        </div>

        {isLoading ? (
          <LoadingBlock rows={3} label="Loading bookmarks" />
        ) : savedCount === 0 ? (
          /* Empty state: no bookmarks at all */
          <section className="grid items-center gap-10 rounded-2xl border border-hairline bg-card px-5 py-7 md:grid-cols-[minmax(0,1fr)_360px] md:px-10 md:py-16">
            <div className="flex flex-col items-start gap-2.5 md:gap-3">
              <p className="font-mono text-xs font-bold tracking-[0.12em] text-brand-text md:text-[13px]">
                NO SAVED STOPS
              </p>
              <h2 className="text-[22px] font-extrabold leading-[1.15] tracking-[-0.02em] md:text-[32px] md:leading-[1.1]">
                You haven’t bookmarked any jobs yet.
              </h2>
              <p className="max-w-[520px] text-[15px] leading-normal text-muted md:text-base">
                Tap the bookmark on any job to save it here. Bookmarks stay in this browser.
              </p>
              <Link
                href="/jobs"
                className="mt-1.5 flex h-12 w-full items-center justify-center rounded-full bg-ink px-6 text-[15px] font-extrabold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink md:mt-2 md:w-auto md:text-base"
              >
                Find jobs to save →
              </Link>
            </div>

            {/* A route with one filled stop and two empty ones */}
            <div aria-hidden="true" className="relative hidden h-[120px] md:block">
              <span className="absolute inset-x-0 top-[54px] h-2.5 rounded-[5px] bg-[repeating-linear-gradient(90deg,var(--color-hairline-strong)_0_18px,transparent_18px_30px)]" />
              <span className="absolute left-0 top-11 size-[30px] rounded-full border-[6px] border-ink bg-card" />
              <span className="absolute left-[calc(50%-15px)] top-11 size-[30px] rounded-full border-[3px] border-dashed border-[#9a9c98] bg-card" />
              <span className="absolute right-0 top-11 size-[30px] rounded-full border-[3px] border-dashed border-[#9a9c98] bg-card" />
            </div>
          </section>
        ) : hasError ? (
          <ErrorBlock
            title={`Your ${savedCount} ${savedCount === 1 ? "bookmark is" : "bookmarks are"} safe, but we can’t load their details.`}
            description="The HireScope API isn’t responding. Try again in a moment."
            onRetry={() => {
              setIsJobsLoading(true);
              setHasError(false);
              setFetchAttempt((attempt) => attempt + 1);
            }}
          />
        ) : shownCount > 0 ? (
          <>
            <JobBoard jobs={bookmarkedJobs} onRemove={removeJob} />
            {shownCount < savedCount && (
              <p className="font-mono text-[13px] text-muted">
                {savedCount - shownCount} saved {savedCount - shownCount === 1 ? "job is" : "jobs are"} no
                longer listed.
              </p>
            )}
          </>
        ) : (
          <section className="flex flex-col items-start gap-3 rounded-2xl border border-hairline bg-card px-5 py-7 md:px-10 md:py-12">
            <h2 className="text-[22px] font-extrabold tracking-[-0.02em]">
              Your saved jobs are no longer listed.
            </h2>
            <p className="text-[15px] text-muted">
              These postings were removed from the sources we collect.
            </p>
            <Link
              href="/jobs"
              className="mt-1.5 flex h-12 items-center rounded-full bg-ink px-6 text-[15px] font-extrabold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              Find jobs to save →
            </Link>
          </section>
        )}
      </div>
    </main>
  );
}
