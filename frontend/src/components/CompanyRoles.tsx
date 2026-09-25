"use client";

import Link from "next/link";
import { useState } from "react";
import JobBoard from "@/components/JobRow";
import { EmptyBlock } from "@/components/StateBlocks";
import type { Job } from "@/data/jobs";
import { companyStats, formatAverageSalary } from "@/lib/company";

type Level = Job["experienceLevel"];

// Level colors shared across HireScope (see CLAUDE.md)
const levels: { level: Level; color: string }[] = [
  { level: "Senior", color: "bg-ink" },
  { level: "Mid-Level", color: "bg-line-remote" },
  { level: "Lead", color: "bg-line-hybrid" },
  { level: "Entry", color: "bg-line-onsite" },
];

// Company Detail body: level breakdown + technologies on the left,
// that company's departures board on the right, filtered by the chosen level
export default function CompanyRoles({
  companyName,
  jobs,
}: {
  companyName: string;
  jobs: Job[];
}) {
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);

  const stats = companyStats(jobs);
  const levelCounts = levels.map((item) => ({
    ...item,
    count: jobs.filter((job) => job.experienceLevel === item.level).length,
  }));
  const visibleJobs = selectedLevel
    ? jobs.filter((job) => job.experienceLevel === selectedLevel)
    : jobs;

  return (
    <div className="grid items-start gap-4 px-4 md:gap-8 md:px-12 lg:grid-cols-[400px_minmax(0,1fr)]">
      <div className="flex flex-col gap-4 md:gap-5">
        {/* Open roles by level */}
        <section className="flex flex-col gap-3.5 rounded-2xl border border-hairline bg-card p-4 md:p-[22px]">
          <h2 className="text-lg font-extrabold md:text-xl">Open roles by level</h2>
          <p className="font-mono text-[32px] font-extrabold leading-none tracking-[-0.04em] md:text-[44px]">
            {stats.openRoles}{" "}
            <span className="text-sm font-medium tracking-normal text-muted">
              open {stats.openRoles === 1 ? "role" : "roles"}
            </span>
          </p>

          {stats.openRoles > 0 && (
            <>
              <div aria-hidden="true" className="flex h-3.5 gap-0.5 overflow-hidden rounded-[7px]">
                {levelCounts.map(
                  ({ level, color, count }) =>
                    count > 0 && <span key={level} className={color} style={{ flex: count }} />
                )}
              </div>

              <div className="flex flex-col gap-1">
                {levelCounts.map(({ level, color, count }) => {
                  const isSelected = selectedLevel === level;
                  return (
                    <button
                      key={level}
                      type="button"
                      disabled={count === 0}
                      aria-pressed={isSelected}
                      onClick={() => setSelectedLevel(isSelected ? null : level)}
                      className={`grid h-11 grid-cols-[14px_1fr_auto] items-center gap-3 rounded-[10px] border-[1.5px] px-3 text-left text-[15px] font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:cursor-not-allowed disabled:opacity-45 ${
                        isSelected
                          ? "border-ink bg-[#efeee8]"
                          : "border-transparent enabled:hover:border-hairline-strong"
                      }`}
                    >
                      <span aria-hidden="true" className={`size-3 rounded-[3px] ${color}`} />
                      {level}
                      <span className="font-mono text-sm font-semibold">{count}</span>
                    </button>
                  );
                })}
              </div>
              <p className="text-[13px] text-muted">Tap a level to filter the departures.</p>
            </>
          )}
        </section>

        {/* Technologies and average salary */}
        <section className="flex flex-col gap-3 rounded-2xl border border-hairline bg-card p-4 md:p-[22px]">
          <h2 className="text-lg font-extrabold md:text-xl">Technologies</h2>
          {stats.technologies.length > 0 ? (
            <ul className="flex flex-wrap gap-1.5">
              {stats.technologies.slice(0, 10).map((skill) => (
                <li key={skill}>
                  <Link
                    href={`/jobs?q=${encodeURIComponent(skill)}`}
                    className="flex h-11 items-center rounded-full border-[1.5px] border-ink px-3.5 text-sm font-bold hover:bg-ink hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                  >
                    {skill}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[15px] italic text-muted-2">
              No technologies listed in these postings.
            </p>
          )}
          <div className="flex items-center justify-between gap-4 border-t border-hairline-soft pt-3 text-[15px]">
            <span className="text-muted">Avg salary</span>
            <span
              className={`font-mono text-sm ${
                stats.averageSalary === null ? "font-medium text-muted-2" : "font-bold"
              }`}
            >
              {formatAverageSalary(stats)}
            </span>
          </div>
        </section>
      </div>

      {/* Departures board */}
      <section className="flex min-w-0 flex-col gap-3.5">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h2 className="text-lg font-extrabold md:text-[22px]">
            {selectedLevel ?? "All"} roles at {companyName}
          </h2>
          <Link
            href={`/jobs?q=${encodeURIComponent(companyName)}`}
            className="text-[15px] font-bold underline-offset-[3px] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            Open in Jobs →
          </Link>
        </div>

        {visibleJobs.length > 0 ? (
          <JobBoard jobs={visibleJobs} />
        ) : (
          <EmptyBlock
            title="No open roles right now"
            description={`We aren’t tracking any current postings from ${companyName}.`}
            actionLabel="Browse all jobs"
            actionHref="/jobs"
          />
        )}
      </section>
    </div>
  );
}
