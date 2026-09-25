"use client";

import { Suspense, useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { LoadingBlock, EmptyBlock, ErrorBlock } from "@/components/StateBlocks";
import type { Job } from "@/data/jobs";
import type { Company } from "@/data/companies";
import { getJobs, getCompanies } from "@/lib/api";
import { isSameCompany } from "@/lib/company";
import { annualSalaryMidpoint, isHourlyRate } from "@/lib/format";

const ranges = [
  { value: "all", label: "All time" },
  { value: "7", label: "7 days" },
  { value: "30", label: "30 days" },
  { value: "90", label: "90 days" },
];

const roles = ["All", "Frontend", "Backend", "Full Stack", "Data", "DevOps"];

const workTypes = [
  { type: "Hybrid", color: "bg-line-hybrid" },
  { type: "Remote", color: "bg-line-remote" },
  { type: "On-site", color: "bg-line-onsite" },
];

// Level colors used everywhere: Senior = ink, Mid = remote, Lead = hybrid, Entry = on-site
const levelColor: Record<string, string> = {
  Senior: "var(--color-ink)",
  "Mid-Level": "var(--color-line-remote)",
  Lead: "var(--color-line-hybrid)",
  Entry: "var(--color-line-onsite)",
};

// Averages based on fewer postings than this are drawn hatched
const MIN_RELIABLE_POSTINGS = 3;

const DAY_MS = 24 * 60 * 60 * 1000;

const percent = (count: number, total: number) =>
  total === 0 ? 0 : Math.round((count / total) * 100);

const toK = (salary: number) => `$${Math.round(salary / 1000)}k`;

const plural = (count: number, word: string) =>
  `${count} ${count === 1 ? word : `${word}s`}`;

const average = (values: number[]) =>
  values.length === 0 ? null : values.reduce((sum, value) => sum + value, 0) / values.length;

// Keyword rules for each role category; a job can match several
function matchesRole(job: Job, role: string) {
  const title = job.title.toLowerCase();
  const skills = job.skills.map((skill) => skill.toLowerCase());
  const titleHas = (...words: string[]) => words.some((word) => title.includes(word));
  const skillsHave = (...words: string[]) => words.some((word) => skills.includes(word));

  switch (role) {
    case "Frontend":
      return titleHas("frontend", "front-end") || skillsHave("react", "next.js");
    case "Backend":
      return titleHas("backend", "back-end") || skillsHave("java", "python", "spring");
    case "Full Stack":
      return titleHas("full stack", "fullstack", "full-stack");
    case "Data":
      return titleHas("data", "machine learning", "ml") || skillsHave("sql", "python");
    case "DevOps":
      return titleHas("devops", "site reliability", "sre") || skillsHave("docker", "aws");
    default:
      return true;
  }
}

// Every number on the page, computed from the filtered postings
function computeStats(jobs: Job[]) {
  const total = jobs.length;
  const salaries = jobs.map(annualSalaryMidpoint).filter((s): s is number => s !== null);

  const salaryByLevel = ["Lead", "Senior", "Mid-Level", "Entry"]
    .map((level) => {
      const levelSalaries = jobs
        .filter((job) => job.experienceLevel === level)
        .map(annualSalaryMidpoint)
        .filter((s): s is number => s !== null);
      return { level, average: average(levelSalaries), count: levelSalaries.length };
    })
    .filter((row): row is { level: string; average: number; count: number } => row.average !== null);

  const skillCounts = new Map<string, number>();
  const companyCounts = new Map<string, { name: string; count: number }>();
  for (const job of jobs) {
    for (const skill of job.skills) skillCounts.set(skill, (skillCounts.get(skill) ?? 0) + 1);

    const key = job.company.trim().toLowerCase();
    const entry = companyCounts.get(key) ?? { name: job.company.trim(), count: 0 };
    companyCounts.set(key, { ...entry, count: entry.count + 1 });
  }

  const byCountDesc = (first: { count: number }, second: { count: number }) =>
    second.count - first.count;

  return {
    total,
    companyCount: companyCounts.size,
    salaryCount: salaries.length,
    hourlyCount: jobs.filter(isHourlyRate).length,
    averageSalary: average(salaries),
    salaryByLevel,
    workTypes: workTypes.map((line) => ({
      ...line,
      count: jobs.filter((job) => job.workType === line.type).length,
    })),
    topSkills: [...skillCounts]
      .map(([name, count]) => ({ name, count }))
      .sort(byCountDesc)
      .slice(0, 10),
    topCompanies: [...companyCounts.values()].sort(byCountDesc).slice(0, 5),
    levelMix: ["Senior", "Mid-Level", "Lead", "Entry"].map((level) => ({
      level,
      count: jobs.filter((job) => job.experienceLevel === level).length,
    })),
  };
}

function ChartCard({
  title,
  description,
  aside,
  children,
  className = "",
}: {
  title: string;
  description: ReactNode;
  aside?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`flex min-w-0 flex-col gap-4 rounded-2xl border border-hairline bg-card p-[18px] md:p-6 ${className}`}
    >
      <div className="flex items-baseline justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold md:text-[21px]">{title}</h2>
          <p className="mt-1 text-sm leading-normal text-muted">{description}</p>
        </div>
        {aside}
      </div>
      {children}
    </section>
  );
}

function StatCell({
  label,
  value,
  unit,
  note,
  highlight = false,
}: {
  label: string;
  value: string;
  unit?: string;
  note?: string;
  highlight?: boolean;
}) {
  return (
    <div className="border-board-divider-2 p-4 odd:border-r [&:nth-child(-n+2)]:border-b md:border-b-0! md:border-r md:p-6 md:last:border-r-0">
      <p className="font-mono text-[10px] font-semibold tracking-[0.1em] text-board-muted md:text-xs">
        {label}
      </p>
      <p
        className={`mt-1 font-mono text-[30px] font-extrabold leading-tight tracking-[-0.04em] md:mt-2 md:text-5xl ${
          highlight ? "text-signal" : ""
        }`}
      >
        {value}
        {unit && (
          <span className="ml-1.5 text-[13px] font-semibold tracking-normal text-board-muted md:text-base">
            {unit}
          </span>
        )}
      </p>
      {note && <p className="mt-1 text-xs text-board-muted md:text-[13px]">{note}</p>}
    </div>
  );
}

function AnalyticsContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const rangeParam = searchParams.get("range") ?? "all";
  const range = ranges.some((option) => option.value === rangeParam) ? rangeParam : "all";
  const roleParam = searchParams.get("role") ?? "All";
  const role = roles.includes(roleParam) ? roleParam : "All";

  const [jobs, setJobs] = useState<Job[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [fetchAttempt, setFetchAttempt] = useState(0);
  // Taken when the data arrives, so date ranges are measured from load time
  const [loadedAt, setLoadedAt] = useState(0);

  useEffect(() => {
    Promise.all([getJobs(), getCompanies()])
      .then(([fetchedJobs, fetchedCompanies]) => {
        setJobs(fetchedJobs);
        setCompanies(fetchedCompanies);
        setLoadedAt(Date.now());
        setHasError(false);
      })
      .catch(() => setHasError(true))
      .finally(() => setIsLoading(false));
  }, [fetchAttempt]);

  // Writes only non-default values so shared URLs stay short
  const updateFilters = (nextRange: string, nextRole: string) => {
    const params = new URLSearchParams();
    if (nextRange !== "all") params.set("range", nextRange);
    if (nextRole !== "All") params.set("role", nextRole);
    const queryString = params.toString();
    router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
  };

  const resetFilters = () => updateFilters("all", "All");

  const stats = useMemo(() => {
    const cutoff = range === "all" ? null : loadedAt - Number(range) * DAY_MS;

    return computeStats(
      jobs.filter(
        (job) =>
          (cutoff === null || Date.parse(job.postedAt) >= cutoff) && matchesRole(job, role)
      )
    );
  }, [jobs, range, role, loadedAt]);

  const isFiltered = range !== "all" || role !== "All";
  const filterLabel = [
    range !== "all" && `Last ${range} days`,
    role !== "All" && role,
  ]
    .filter(Boolean)
    .join(" · ");

  const maxLevelSalary = Math.max(...stats.salaryByLevel.map((row) => row.average), 1);
  const lowCountLevels = stats.salaryByLevel.filter(
    (row) => row.count < MIN_RELIABLE_POSTINGS
  );
  const maxSkillCount = stats.topSkills[0]?.count ?? 1;
  const maxCompanyCount = stats.topCompanies[0]?.count ?? 1;
  const topCompanyShare = percent(
    stats.topCompanies.reduce((sum, company) => sum + company.count, 0),
    stats.total
  );
  const largestLevel = [...stats.levelMix].sort((a, b) => b.count - a.count)[0];
  const entryCount = stats.levelMix.find((row) => row.level === "Entry")?.count ?? 0;

  const pillFocus =
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";

  return (
    <main className="flex-1 px-4 md:px-12">
      {/* Page header and filters */}
      <div className="flex flex-col gap-3.5 pb-5 pt-[22px] md:pb-6 md:pt-10 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
        <div className="flex flex-col gap-2">
          <p className="font-mono text-[11px] font-bold tracking-[0.1em] text-brand-text md:text-[13px]">
            NETWORK STATUS · TORONTO / GTA
          </p>
          <h1 className="text-[34px] font-extrabold leading-none tracking-[-0.03em] md:text-5xl">
            Analytics
          </h1>
          <p className="max-w-[640px] text-[15px] leading-normal text-muted md:text-[17px]">
            A snapshot of the GTA developer job market today. We don’t have history yet, so
            there are no trend lines.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div
            role="group"
            aria-label="Posted within"
            className="flex w-full rounded-full border-[1.5px] border-ink bg-card p-[3px] sm:w-auto"
          >
            {ranges.map((option) => (
              <button
                key={option.value}
                type="button"
                aria-pressed={range === option.value}
                onClick={() => updateFilters(option.value, role)}
                className={`h-10 flex-1 whitespace-nowrap rounded-full px-3 text-sm font-bold transition-colors sm:flex-none sm:px-4 ${pillFocus} ${
                  range === option.value ? "bg-ink text-paper" : "text-ink hover:bg-paper"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <select
            aria-label="Role"
            value={role}
            onChange={(event) => updateFilters(range, event.target.value)}
            className={`h-12 rounded-full border-[1.5px] border-ink bg-card px-4 text-[15px] font-bold text-ink ${pillFocus}`}
          >
            {roles.map((option) => (
              <option key={option} value={option}>
                {option === "All" ? "All roles" : option}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isFiltered && !isLoading && !hasError && (
        <div className="mb-5 flex flex-col gap-3 rounded-xl border-[1.5px] border-dashed border-[#b5b4ad] px-[18px] py-3 text-[15px] text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            Filtered by <b className="text-ink">{filterLabel}</b>. Every number below is
            recalculated for this filter.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className={`h-10 shrink-0 self-start rounded-full border-[1.5px] border-ink bg-card px-4 text-sm font-bold text-ink hover:bg-paper sm:self-auto ${pillFocus}`}
          >
            Reset
          </button>
        </div>
      )}

      {isLoading ? (
        <LoadingBlock rows={4} label="Loading analytics" message="Checking the network status…" />
      ) : hasError ? (
        <ErrorBlock
          title="Network status is unavailable."
          description="We can’t reach the HireScope API, so the charts can’t load. Nothing is shown rather than stale or made-up numbers."
          onRetry={() => {
            setIsLoading(true);
            setHasError(false);
            setFetchAttempt((attempt) => attempt + 1);
          }}
        />
      ) : jobs.length === 0 ? (
        <EmptyBlock
          title="No postings collected yet."
          description="The scrapers haven't stored any jobs. Check back after the next update."
        />
      ) : stats.total === 0 ? (
        <EmptyBlock
          title="No jobs match these filters."
          description="No postings were found for this date range and role. Try a longer range or another role."
          actionLabel="Clear all filters"
          onAction={resetFilters}
        />
      ) : (
        <div className="flex flex-col gap-4 md:gap-6">
          {/* Stats strip */}
          <section
            aria-label="Summary"
            className="grid grid-cols-2 rounded-2xl bg-ink text-paper md:grid-cols-4"
          >
            <StatCell label="TOTAL ACTIVE JOBS" value={String(stats.total)} />
            <StatCell label="HIRING COMPANIES" value={String(stats.companyCount)} />
            <StatCell
              label="JOBS WITH SALARY"
              value={String(stats.salaryCount)}
              unit={`${percent(stats.salaryCount, stats.total)}%`}
              note={
                stats.hourlyCount > 0
                  ? `${plural(stats.hourlyCount, "hourly rate")} not counted`
                  : undefined
              }
            />
            <StatCell
              label="AVERAGE SALARY · CAD"
              value={stats.averageSalary === null ? "—" : `~${toK(stats.averageSalary)}`}
              note={
                stats.averageSalary === null
                  ? "No postings list annual pay"
                  : `Midpoint, of ${plural(stats.salaryCount, "posting")}`
              }
              highlight
            />
          </section>

          <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
            {/* 1. Salary by experience level */}
            <ChartCard
              title="Salary by experience level"
              description="Average midpoint, CAD. Only postings that list annual pay."
            >
              {stats.salaryByLevel.length === 0 ? (
                <p className="text-sm text-muted">No postings in this view list annual pay.</p>
              ) : (
                <ul className="flex flex-col gap-3.5">
                  {stats.salaryByLevel.map((row) => {
                    const isLowCount = row.count < MIN_RELIABLE_POSTINGS;
                    const color = levelColor[row.level];

                    return (
                      <li
                        key={row.level}
                        className="grid grid-cols-[78px_minmax(0,1fr)_72px] items-center gap-2.5 md:grid-cols-[96px_minmax(0,1fr)_84px] md:gap-3.5"
                      >
                        <span className="text-sm font-bold md:text-[15px]">{row.level}</span>
                        <span className="h-[18px] rounded-md bg-[#f0efe9] md:h-[26px]">
                          <span
                            className={`block h-full rounded-md ${
                              isLowCount ? "border-2 border-dashed" : ""
                            }`}
                            style={{
                              width: `${(row.average / maxLevelSalary) * 100}%`,
                              ...(isLowCount
                                ? {
                                    borderColor: color,
                                    background: `repeating-linear-gradient(135deg, color-mix(in oklch, ${color} 35%, white) 0 6px, white 6px 12px)`,
                                  }
                                : { background: color }),
                            }}
                          />
                        </span>
                        <span className="text-right">
                          <span className="block font-mono text-sm font-bold md:text-[15px]">
                            {toK(row.average)}
                          </span>
                          <span className="block font-mono text-[11px] text-muted-2">
                            {plural(row.count, "posting")}
                          </span>
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}

              {lowCountLevels.length > 0 && (
                <div className="border-t border-hairline-soft pt-3 text-[13px] text-muted">
                  {lowCountLevels.map((row) => (
                    <p key={row.level}>
                      {row.level} is based on <b>{plural(row.count, "posting")}</b>, so read it
                      as a rough signal, not a reliable average.
                    </p>
                  ))}
                </div>
              )}
            </ChartCard>

            {/* 2. Work type breakdown */}
            <ChartCard
              title="Work type breakdown"
              description={`Each line’s length is its share of ${plural(stats.total, "job")}.`}
            >
              <ul className="flex flex-col gap-[22px] pt-1.5">
                {stats.workTypes.map((line) => {
                  const share = (line.count / stats.total) * 100;

                  return (
                    <li key={line.type}>
                      <Link
                        href={`/jobs?type=${encodeURIComponent(line.type)}`}
                        className="group flex flex-col gap-2 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
                      >
                        <span className="flex justify-between text-[15px] font-bold md:text-base">
                          <span className="group-hover:underline">{line.type} Line</span>
                          <span className="font-mono">
                            {line.count} · {percent(line.count, stats.total)}%
                          </span>
                        </span>
                        <span className="relative h-3">
                          <span
                            className={`absolute inset-y-0 left-0 rounded-md ${line.color}`}
                            style={{ width: `${share}%` }}
                          />
                          <span
                            aria-hidden="true"
                            className="absolute -top-1 size-5 rounded-full border-4 border-ink bg-card"
                            style={{ left: `max(0px, calc(${share}% - 10px))` }}
                          />
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </ChartCard>
          </div>

          <div className="grid gap-4 md:gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            {/* 3. Top technologies */}
            <ChartCard
              title="Most requested technologies"
              description="Jobs mentioning each skill. One job can list several."
              aside={
                <span className="shrink-0 font-mono text-[13px] text-muted">
                  Top {stats.topSkills.length}
                </span>
              }
            >
              {stats.topSkills.length === 0 ? (
                <p className="text-sm text-muted">No skill tags in this view.</p>
              ) : (
                <ol className="flex flex-col gap-1.5">
                  {stats.topSkills.map((skill, index) => (
                    <li key={skill.name}>
                      <Link
                        href={`/jobs?q=${encodeURIComponent(skill.name)}`}
                        className="group grid min-h-8 grid-cols-[24px_minmax(0,110px)_minmax(0,1fr)_36px] items-center gap-2.5 rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink md:grid-cols-[28px_minmax(0,150px)_minmax(0,1fr)_44px] md:gap-3"
                      >
                        <span className="font-mono text-[13px] text-muted-2">{index + 1}</span>
                        <span className="truncate text-sm font-bold group-hover:underline md:text-[15px]">
                          {skill.name}
                        </span>
                        <span className="h-3.5 rounded bg-[#f0efe9]">
                          <span
                            className={`block h-full rounded ${index === 0 ? "bg-brand" : "bg-ink"}`}
                            style={{ width: `${(skill.count / maxSkillCount) * 100}%` }}
                          />
                        </span>
                        <span className="text-right font-mono text-sm font-bold">{skill.count}</span>
                      </Link>
                    </li>
                  ))}
                </ol>
              )}
            </ChartCard>

            {/* 4. Top hiring companies */}
            <ChartCard
              title="Top hiring companies"
              description={`Open roles. ${
                stats.topCompanies.length === 1
                  ? "This company makes"
                  : `These ${stats.topCompanies.length} make`
              } up ${topCompanyShare}% of ${plural(stats.total, "job")}.`}
            >
              <ol className="flex flex-col gap-1">
                {stats.topCompanies.map((company) => {
                  const companyId = companies.find((item) =>
                    isSameCompany(item.name, company.name)
                  )?.id;
                  const content = (
                    <>
                      <span
                        aria-hidden="true"
                        className="grid size-9 place-items-center rounded-full bg-ink text-[15px] font-extrabold text-paper"
                      >
                        {company.name.charAt(0).toUpperCase() || "?"}
                      </span>
                      <span className="flex min-w-0 flex-col gap-[5px]">
                        <span className="truncate text-[15px] font-bold group-hover:underline">
                          {company.name}
                        </span>
                        <span className="h-2 rounded bg-[#f0efe9]">
                          <span
                            className="block h-full rounded bg-ink"
                            style={{ width: `${(company.count / maxCompanyCount) * 100}%` }}
                          />
                        </span>
                      </span>
                      <span className="text-right font-mono text-[17px] font-extrabold">
                        {company.count}
                      </span>
                    </>
                  );
                  const rowClassName =
                    "group grid min-h-[52px] grid-cols-[40px_minmax(0,1fr)_44px] items-center gap-3 rounded-md";

                  return (
                    <li key={company.name}>
                      {companyId === undefined ? (
                        <div className={rowClassName}>{content}</div>
                      ) : (
                        <Link
                          href={`/companies/${companyId}`}
                          className={`${rowClassName} focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink`}
                        >
                          {content}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ol>

              {companies.length > 0 && (
                <Link
                  href="/companies"
                  className="mt-auto self-start rounded text-[15px] font-bold text-brand-text hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                >
                  All {companies.length} companies →
                </Link>
              )}
            </ChartCard>
          </div>

          {/* 5. Experience level mix */}
          <ChartCard
            title="Experience level mix"
            description={`${largestLevel.level} is the largest group at ${percent(
              largestLevel.count,
              stats.total
            )}%. ${entryCount} of ${plural(stats.total, "role")} ${
              entryCount === 1 ? "is" : "are"
            } entry-level.`}
            className="lg:grid lg:grid-cols-[300px_minmax(0,1fr)] lg:items-center lg:gap-10"
          >
            <div className="flex flex-col gap-3.5">
              <div aria-hidden="true" className="flex h-10 gap-[3px] overflow-hidden rounded-[10px]">
                {stats.levelMix
                  .filter((row) => row.count > 0)
                  .map((row) => (
                    <span
                      key={row.level}
                      style={{ flex: row.count, background: levelColor[row.level] }}
                    />
                  ))}
              </div>
              <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {stats.levelMix.map((row) => (
                  <li key={row.level} className="flex items-start gap-2.5">
                    <span
                      aria-hidden="true"
                      className="mt-[3px] size-3.5 shrink-0 rounded-[3px]"
                      style={{ background: levelColor[row.level] }}
                    />
                    <span>
                      <span className="block text-[15px] font-bold">{row.level}</span>
                      <span className="block font-mono text-sm font-semibold text-muted">
                        {row.count} · {percent(row.count, stats.total)}%
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </ChartCard>
        </div>
      )}
    </main>
  );
}

// useSearchParams needs a Suspense boundary for the static build
export default function AnalyticsPage() {
  return (
    <Suspense
      fallback={
        <main className="flex-1 px-4 pt-10 md:px-12">
          <LoadingBlock rows={4} label="Loading analytics" />
        </main>
      }
    >
      <AnalyticsContent />
    </Suspense>
  );
}
