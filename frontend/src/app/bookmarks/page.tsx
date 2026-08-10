"use client";

import { useEffect, useMemo, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookmarkCard from "@/components/BookmarkCard";
import EmptyState from "@/components/EmptyState";
import LoadingCard from "@/components/LoadingCard";
import type { Job } from "@/data/jobs";
import { getJobs } from "@/lib/api";
import { useBookmarks } from "@/hooks/useBookmarks";

export default function BookmarksPage() {
  // Loads bookmarked job IDs from localStorage
  const { bookmarkedJobIds, isLoaded } = useBookmarks();

  // Stores the jobs fetched from the backend API
  const [jobs, setJobs] = useState<Job[]>([]);

  // Tracks whether jobs are still being fetched
  const [isJobsLoading, setIsJobsLoading] = useState(true);

  // Tracks whether the job fetch failed
  const [hasError, setHasError] = useState(false);

  // Fetches jobs from the backend API on mount
  useEffect(() => {
    getJobs()
      .then(setJobs)
      .catch(() => setHasError(true))
      .finally(() => setIsJobsLoading(false));
  }, []);

  // Stores the selected work type filter
  const [selectedWorkType, setSelectedWorkType] = useState("All");

  // Stores the selected sorting option
  const [sortOption, setSortOption] = useState("newest");

  // Finds bookmarked jobs and applies filtering and sorting
  const bookmarkedJobs = useMemo(() => {
    const savedJobs = jobs.filter((job) =>
      bookmarkedJobIds.includes(job.id)
    );

    const filteredJobs =
      selectedWorkType === "All"
        ? savedJobs
        : savedJobs.filter(
            (job) => job.workType === selectedWorkType
          );

    return [...filteredJobs].sort((firstJob, secondJob) => {
      if (sortOption === "salary") {
        return secondJob.salaryMax - firstJob.salaryMax;
      }

      if (sortOption === "company") {
        return firstJob.company.localeCompare(secondJob.company);
      }

      return secondJob.id - firstJob.id;
    });
  }, [jobs, bookmarkedJobIds, selectedWorkType, sortOption]);

  // Combined loading state: bookmarks from localStorage and jobs from the API
  const isLoading = !isLoaded || isJobsLoading;

  return (
    <>
      {/* Global website header */}
      <Header />

      <main className="min-h-screen bg-[#FBF9F7] px-5 pb-16 pt-10">
        <div className="mx-auto max-w-6xl">
          {/* Page heading and controls */}
          <section className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                Saved Jobs
              </h1>

              <p className="mt-2 text-lg text-gray-600">
                You have{" "}
                <span className="font-bold text-[#800020]">
                  {bookmarkedJobs.length}
                </span>{" "}
                saved job
                {bookmarkedJobs.length !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Filter and sort controls */}
            <div className="flex flex-wrap gap-3">
              <select
                value={selectedWorkType}
                onChange={(event) =>
                  setSelectedWorkType(event.target.value)
                }
                className="rounded-lg border border-[#E0BFBF] bg-white px-4 py-2 text-sm text-gray-700 outline-none focus:border-[#800020]"
              >
                <option value="All">All Work Types</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
              </select>

              <select
                value={sortOption}
                onChange={(event) =>
                  setSortOption(event.target.value)
                }
                className="rounded-lg border border-[#E0BFBF] bg-white px-4 py-2 text-sm text-gray-700 outline-none focus:border-[#800020]"
              >
                <option value="newest">Newest</option>
                <option value="salary">Highest Salary</option>
                <option value="company">Company Name</option>
              </select>
            </div>
          </section>

          {/* Loading, error, or content state */}
          {isLoading ? (
            <section className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <LoadingCard key={item} />
              ))}
            </section>
          ) : hasError ? (
            <div className="mt-10">
              <EmptyState
                icon="cloud_off"
                title="Couldn't load saved jobs"
                description="We couldn't reach the HireScope API. Make sure the backend is running and try again."
              />
            </div>
          ) : bookmarkedJobs.length > 0 ? (
            /* Saved job cards */
            <section className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {bookmarkedJobs.map((job) => (
                <BookmarkCard key={job.id} job={job} />
              ))}
            </section>
          ) : (
            /* Empty bookmarked job state */
            <div className="mt-10">
              <EmptyState
                icon="bookmark_border"
                title="No saved jobs yet"
                description="Jobs you bookmark while browsing will appear here so you can easily find them later."
                actionLabel="Browse Jobs"
                actionHref="/jobs"
              />
            </div>
          )}
        </div>
      </main>

      {/* Global website footer */}
      <Footer />
    </>
  );
}