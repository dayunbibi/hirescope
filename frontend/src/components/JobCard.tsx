"use client";

import Link from "next/link";
import type { Job } from "@/data/jobs";
import { formatPostedDate, formatSalaryRange } from "@/lib/format";
import {
  BookmarkToggle,
  CompanyAvatar,
  SkillTags,
  lineColor,
} from "@/components/JobRow";

// Mobile departures card: the same fields as JobRow, stacked
export default function JobCard({ job }: { job: Job }) {
  const hasSalary = job.salaryMin !== null || job.salaryMax !== null;

  return (
    <article className="flex flex-col gap-2.5 rounded-2xl bg-ink p-4 text-paper">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 font-mono text-[13px] font-semibold">
          <span
            aria-hidden="true"
            className={`size-2.5 rounded-full ${lineColor[job.workType] ?? "bg-board-faint"}`}
          />
          {job.workType} ·{" "}
          <span className="text-signal">
            {formatPostedDate(job.postedAt, false)}
          </span>
        </span>

        <div className="-my-2 -mr-2">
          <BookmarkToggle jobId={job.id} />
        </div>
      </div>

      <div className="flex items-start gap-3">
        <CompanyAvatar company={job.company} className="size-9 text-[15px]" />

        <div className="flex min-w-0 flex-col gap-0.5">
          <Link
            href={`/jobs/${job.id}`}
            className="text-[17px] font-bold leading-tight hover:underline focus-visible:outline-2 focus-visible:outline-signal"
          >
            {job.title}
          </Link>
          <span className="text-sm text-board-muted">
            {job.company} · {job.location || "Location unknown"} ·{" "}
            {job.experienceLevel}
          </span>
        </div>
      </div>

      <span
        className={`font-mono text-sm font-semibold ${
          hasSalary ? "text-paper" : "text-board-faint"
        }`}
      >
        {formatSalaryRange(job.salaryMin, job.salaryMax)}
      </span>

      <SkillTags skills={job.skills} />
    </article>
  );
}
