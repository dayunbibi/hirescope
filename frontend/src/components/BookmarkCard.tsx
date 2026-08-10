"use client";

import Link from "next/link";
import type { Job } from "@/data/jobs";
import { useBookmarks } from "@/hooks/useBookmarks";

type BookmarkCardProps = {
  job: Job;
};

// Formats a salary number into a shorter display value
function formatSalary(salary: number | null) {
  if (salary === null) return "N/A";
  return `$${Math.round(salary / 1000)}k`;
}

// Displays one saved job card
export default function BookmarkCard({ job }: BookmarkCardProps) {
  // Loads bookmark state and toggle function
  const { toggleBookmark, isLoaded } = useBookmarks();

  return (
    <article className="relative flex h-full flex-col rounded-lg border border-[#E4E2E0] bg-white p-6 shadow-sm transition hover:shadow-md">
      {/* Removes this job from bookmarks */}
      <button
        type="button"
        disabled={!isLoaded}
        onClick={() => toggleBookmark(job.id)}
        aria-label="Remove bookmark"
        className="absolute right-5 top-5 text-[#800020] transition hover:text-[#570013] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span
          className="material-symbols-outlined text-[24px]"
          style={{
            fontVariationSettings:
              "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24",
          }}
        >
          bookmark
        </span>
      </button>

      {/* Company and job information */}
      <div className="flex items-center gap-4 pr-10">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#E0BFBF] bg-[#F5F3F1] font-bold text-[#800020]">
          {job.company.charAt(0)}
        </div>

        <div className="min-w-0">
          <h2 className="text-base font-semibold text-gray-900">
            {job.title}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {job.company} • {job.location} ({job.workType})
          </p>
        </div>
      </div>

      {/* Technology tags */}
      <div className="mt-5 flex flex-wrap gap-2">
        {job.skills.map((skill) => (
          <span
            key={skill}
            className="rounded bg-[#F0F0F0] px-2 py-1 text-xs font-medium text-gray-600"
          >
            {skill}
          </span>
        ))}
      </div>

      {/* Salary and action */}
      <div className="mt-auto flex items-center justify-between border-t border-[#E4E2E0] pt-5">
        <span className="text-sm font-medium text-gray-900">
          {formatSalary(job.salaryMin)} – {formatSalary(job.salaryMax)}
        </span>

        <Link
          href={`/jobs/${job.id}`}
          className="text-sm font-medium text-[#800020] transition hover:underline"
        >
          View Details
        </Link>
      </div>
    </article>
  );
}