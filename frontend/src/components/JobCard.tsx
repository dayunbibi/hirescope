"use client";

import Link from "next/link";
import type { Job } from "@/data/jobs";
import { useBookmarks } from "@/hooks/useBookmarks";

type JobCardProps = {
  job: Job;
};

// Formats a numeric salary as a short Canadian dollar value
function formatSalary(salary: number | null) {
  if (salary === null) return "N/A";
  return `$${Math.round(salary / 1000)}k`;
}

// Formats the full salary range safely
function formatSalaryRange(
  salaryMin: number | null,
  salaryMax: number | null
) {
  // No salary information available
  if (salaryMin === null && salaryMax === null) {
    return "Salary not disclosed";
  }

  // Only maximum salary is available
  if (salaryMin === null) {
    return `Up to ${formatSalary(salaryMax)}`;
  }

  // Only minimum salary is available
  if (salaryMax === null) {
    return `From ${formatSalary(salaryMin)}`;
  }

  // Full salary range is available
  return `${formatSalary(salaryMin)} – ${formatSalary(salaryMax)}`;
}

// Displays one detailed and reusable job posting card
export default function JobCard({ job }: JobCardProps) {
  // Loads bookmark state and toggle function from localStorage
  const { isBookmarked, toggleBookmark, isLoaded } = useBookmarks();

  // Checks whether this specific job is bookmarked
  const bookmarked = isBookmarked(job.id);

  return (
    <article
      className={`relative overflow-hidden rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-md ${
        bookmarked
          ? "border-[#800020]/40"
          : "border-[#E0BFBF]"
      }`}
    >
      {/* Burgundy indicator shown for bookmarked jobs */}
      {bookmarked && (
        <div className="absolute bottom-0 left-0 top-0 w-1 bg-[#800020]" />
      )}

      <div className="flex flex-col gap-4 sm:flex-row">
        {/* Temporary company logo */}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-[#E0BFBF] bg-[#F5F0EE] text-lg font-bold text-[#800020]">
          {job.company.charAt(0)}
        </div>

        <div className="min-w-0 flex-1">
          {/* Job title and bookmark button */}
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className="text-xl font-semibold text-gray-900 transition hover:text-[#800020]">
                {job.title}
              </h3>

              <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm text-gray-600">
                <span className="font-medium text-gray-800">
                  {job.company}
                </span>

                <span>{job.location}</span>

                <span>
                  {formatSalaryRange(
                    job.salaryMin,
                    job.salaryMax
                  )}
                </span>
              </div>
            </div>

            {/* Interactive bookmark button */}
            <button
              type="button"
              disabled={!isLoaded}
              onClick={() => toggleBookmark(job.id)}
              aria-label={
                bookmarked
                  ? "Remove bookmark"
                  : "Add bookmark"
              }
              className={`shrink-0 transition disabled:cursor-not-allowed disabled:opacity-50 ${
                bookmarked
                  ? "text-[#800020]"
                  : "text-gray-400 hover:text-[#800020]"
              }`}
            >
              <span
                className="material-symbols-outlined text-[24px]"
                style={{
                  fontVariationSettings: bookmarked
                    ? "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24"
                    : "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
                }}
              >
                bookmark
              </span>
            </button>
          </div>

          {/* Skills and action controls */}
          <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-md bg-[#F0F0F0] px-2 py-1 text-xs font-medium text-gray-700"
                >
                  {skill}
                </span>
              ))}

              <span className="rounded-md border border-[#E0BFBF] px-2 py-1 text-xs font-medium text-gray-600">
                {job.workType}
              </span>

              <span className="rounded-md border border-[#E0BFBF] px-2 py-1 text-xs font-medium text-gray-600">
                {job.experienceLevel}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 lg:justify-end">
              <span className="text-xs text-gray-500">
                {job.postedAt}
              </span>

              <Link
                href={`/jobs/${job.id}`}
                className="rounded-lg bg-[#800020] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#570013]"
              >
                View Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}