"use client";

import Link from "next/link";
import type { Job } from "@/data/jobs";
import { useBookmarks } from "@/hooks/useBookmarks";
import { formatPostedDate, formatSalaryRange } from "@/lib/format";
import JobCard from "@/components/JobCard";

// Line color for each work type
export const lineColor: Record<string, string> = {
  Hybrid: "bg-line-hybrid",
  Remote: "bg-line-remote",
  "On-site": "bg-line-onsite",
};

const boardColumns =
  "grid-cols-[72px_100px_minmax(0,1fr)_88px_196px_44px] gap-4 px-6";

// Round bookmark toggle; yellow when saved
export function BookmarkToggle({ jobId }: { jobId: number }) {
  const { isBookmarked, toggleBookmark, isLoaded } = useBookmarks();
  const bookmarked = isBookmarked(jobId);

  return (
    <button
      type="button"
      disabled={!isLoaded}
      onClick={() => toggleBookmark(jobId)}
      aria-label={bookmarked ? "Remove bookmark" : "Bookmark job"}
      aria-pressed={bookmarked}
      className={`grid size-11 shrink-0 place-items-center rounded-full border border-board-edge transition-colors focus-visible:outline-2 focus-visible:outline-signal disabled:opacity-50 ${
        bookmarked ? "bg-signal" : "hover:border-board-text"
      }`}
    >
      <svg
        aria-hidden="true"
        width="13"
        height="16"
        viewBox="0 0 14 16"
        strokeWidth="1.6"
        className={
          bookmarked
            ? "fill-ink stroke-ink"
            : "fill-none stroke-board-text"
        }
      >
        <path d="M2 1h10v14l-5-4-5 4z" />
      </svg>
    </button>
  );
}

// Company initial on a paper circle
export function CompanyAvatar({
  company,
  className,
}: {
  company: string;
  className: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`grid shrink-0 place-items-center rounded-full bg-paper font-extrabold text-ink ${className}`}
    >
      {company.trim().charAt(0).toUpperCase() || "?"}
    </span>
  );
}

// Skill tags in mono pills
export function SkillTags({ skills }: { skills: string[] }) {
  if (skills.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-[5px]">
      {skills.map((skill) => (
        <span
          key={skill}
          className="rounded-full border border-board-edge px-2 py-0.5 font-mono text-xs font-medium text-board-text"
        >
          {skill}
        </span>
      ))}
    </div>
  );
}

// One desktop row on the dark departures board
export function JobRow({ job }: { job: Job }) {
  const hasSalary = job.salaryMin !== null || job.salaryMax !== null;

  return (
    <div
      className={`grid items-center border-t border-board-divider py-4 ${boardColumns}`}
    >
      <span className="font-mono text-[15px] font-semibold text-signal">
        {formatPostedDate(job.postedAt, false)}
      </span>

      <span className="flex items-center gap-2 text-[15px] font-semibold">
        <span
          aria-hidden="true"
          className={`size-3 shrink-0 rounded-full ${lineColor[job.workType] ?? "bg-board-faint"}`}
        />
        {job.workType}
      </span>

      <div className="flex min-w-0 items-start gap-3.5">
        <CompanyAvatar company={job.company} className="size-10 text-base" />

        <div className="flex min-w-0 flex-col gap-1.5">
          <Link
            href={`/jobs/${job.id}`}
            className="text-[17px] font-bold leading-tight hover:underline focus-visible:outline-2 focus-visible:outline-signal"
          >
            {job.title}
          </Link>
          <span className="text-sm text-board-muted">
            {job.company} · {job.location || "Location unknown"}
          </span>
          <SkillTags skills={job.skills} />
        </div>
      </div>

      <span className="text-[15px] text-board-text">{job.experienceLevel}</span>

      <span
        className={`font-mono text-sm font-semibold ${
          hasSalary ? "text-paper" : "text-board-faint"
        }`}
      >
        {formatSalaryRange(job.salaryMin, job.salaryMax)}
      </span>

      <BookmarkToggle jobId={job.id} />
    </div>
  );
}

// Departures board: dark rows when the container is wide, mobile cards otherwise
export default function JobBoard({ jobs }: { jobs: Job[] }) {
  return (
    <div className="@container">
      <div className="hidden overflow-hidden rounded-2xl bg-ink text-paper @3xl:block">
        <div
          aria-hidden="true"
          className={`grid border-b border-board-divider-2 py-3.5 font-mono text-[11px] font-semibold tracking-[0.1em] text-board-faint ${boardColumns}`}
        >
          <span>POSTED</span>
          <span>LINE</span>
          <span>ROLE · COMPANY · STACK</span>
          <span>LEVEL</span>
          <span>SALARY (CAD)</span>
          <span />
        </div>

        {jobs.map((job) => (
          <JobRow key={job.id} job={job} />
        ))}
      </div>

      <div className="grid gap-2.5 @3xl:hidden">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
}
