import Link from "next/link";
import type { Job } from "@/data/jobs";

type JobCardProps = {
  job: Job;
};

// Formats a numeric salary as a short Canadian dollar value
function formatSalary(salary: number) {
  return `$${Math.round(salary / 1000)}k`;
}

// Displays one detailed and reusable job posting card
export default function JobCard({ job }: JobCardProps) {
  return (
    <article
      className={`relative overflow-hidden rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-md ${
        job.bookmarked
          ? "border-[#800020]/40"
          : "border-[#E0BFBF]"
      }`}
    >
      {/* Bookmark indicator for saved jobs */}
      {job.bookmarked && (
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
            <div>
              <h3 className="text-xl font-semibold text-gray-900 transition hover:text-[#800020]">
                {job.title}
              </h3>

              <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm text-gray-600">
                <span className="font-medium text-gray-800">
                  {job.company}
                </span>

                <span>{job.location}</span>

                <span>
                  {formatSalary(job.salaryMin)} –{" "}
                  {formatSalary(job.salaryMax)}
                </span>
              </div>
            </div>

            <button
              type="button"
              aria-label={
                job.bookmarked ? "Remove bookmark" : "Add bookmark"
              }
              className={`text-xl transition ${
                job.bookmarked
                  ? "text-[#800020]"
                  : "text-gray-400 hover:text-[#800020]"
              }`}
            >
              {job.bookmarked ? "★" : "☆"}
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
              <span className="text-xs text-gray-500">{job.postedAt}</span>

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