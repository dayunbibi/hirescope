"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import FilterSidebar, {
  experienceLevels,
  workTypes,
  type FilterCounts,
  type JobFilters,
} from "@/components/FilterSidebar";
import JobBoard from "@/components/JobRow";
import Pagination from "@/components/Pagination";
import SearchBar, { LineChips } from "@/components/SearchBar";
import { LoadingBlock, EmptyBlock, ErrorBlock } from "@/components/StateBlocks";
import type { Job } from "@/data/jobs";
import { getJobs } from "@/lib/api";
import { getStation, getStationName, stations } from "@/lib/area";
import { annualSalaryMidpoint } from "@/lib/format";

const PAGE_SIZE = 10;

const sortOptions = [
  { value: "relevant", label: "Most Relevant" },
  { value: "newest", label: "Newest" },
  { value: "salary", label: "Highest Salary" },
];

type JobsQuery = JobFilters & { sort: string; page: number };

const defaultQuery: JobsQuery = {
  q: "",
  area: "all",
  workType: "All",
  minSalary: 0,
  includeNoSalary: true,
  levels: [],
  sort: "relevant",
  page: 1,
};

// Reads filters, sort and page from the URL, ignoring invalid values
function readQuery(params: URLSearchParams): JobsQuery {
  const area = params.get("area") ?? "";
  const workType = params.get("type") ?? "";
  const sort = params.get("sort") ?? "";
  const minSalary = Math.round(Number(params.get("min")) / 10) * 10;
  const page = Math.floor(Number(params.get("page")));

  return {
    q: params.get("q")?.trim() ?? "",
    area: stations.some((station) => station.id === area) ? area : "all",
    workType: workTypes.includes(workType) ? workType : "All",
    minSalary: minSalary > 0 ? Math.min(minSalary, 200) : 0,
    includeNoSalary: params.get("nosalary") !== "0",
    levels: (params.get("level") ?? "")
      .split(",")
      .filter((level) => experienceLevels.includes(level)),
    sort: sortOptions.some((option) => option.value === sort) ? sort : "relevant",
    page: page > 1 ? page : 1,
  };
}

// Writes only non-default values so shared URLs stay short
function writeQuery(query: JobsQuery) {
  const params = new URLSearchParams();

  if (query.q) params.set("q", query.q);
  if (query.area !== "all") params.set("area", query.area);
  if (query.workType !== "All") params.set("type", query.workType);
  if (query.minSalary > 0) params.set("min", String(query.minSalary));
  if (!query.includeNoSalary) params.set("nosalary", "0");
  if (query.levels.length > 0) params.set("level", query.levels.join(","));
  if (query.sort !== "relevant") params.set("sort", query.sort);
  if (query.page > 1) params.set("page", String(query.page));

  return params.toString();
}

// Hourly contract rates count as "no annual salary" for the salary filter and sort
const hasSalary = (job: Job) => annualSalaryMidpoint(job) !== null;
const annualSalaryTop = (job: Job) =>
  hasSalary(job) ? (job.salaryMax ?? job.salaryMin ?? 0) : null;
const postedTime = (job: Job) => Date.parse(job.postedAt) || 0;

// Title matches rank above skill matches, which rank above company matches
function relevance(job: Job, keyword: string) {
  if (!keyword) return 0;

  return (
    (job.title.toLowerCase().includes(keyword) ? 3 : 0) +
    (job.skills.some((skill) => skill.toLowerCase().includes(keyword)) ? 2 : 0) +
    (job.company.toLowerCase().includes(keyword) ? 1 : 0)
  );
}

function JobsPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const paramString = searchParams.toString();

  const query = useMemo(
    () => readQuery(new URLSearchParams(paramString)),
    [paramString]
  );

  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [fetchAttempt, setFetchAttempt] = useState(0);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // The keyword input updates immediately; the URL follows after a short pause
  const [keyword, setKeyword] = useState(query.q);
  const [lastUrlKeyword, setLastUrlKeyword] = useState(query.q);

  // Keeps the input in sync when the URL changes elsewhere (back button, chips)
  if (query.q !== lastUrlKeyword) {
    setLastUrlKeyword(query.q);
    if (query.q !== keyword.trim()) setKeyword(query.q);
  }

  useEffect(() => {
    getJobs()
      .then((fetchedJobs) => {
        setJobs(fetchedJobs);
        setHasError(false);
      })
      .catch(() => setHasError(true))
      .finally(() => setIsLoading(false));
  }, [fetchAttempt]);

  // Changing any filter returns to page 1 unless a page is given
  const updateQuery = useCallback(
    (patch: Partial<JobsQuery>) => {
      const nextQuery = { ...query, page: 1, ...patch };
      const queryString = writeQuery(nextQuery);
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      });
    },
    [query, pathname, router]
  );

  useEffect(() => {
    const trimmedKeyword = keyword.trim();
    if (trimmedKeyword === query.q) return;

    const timer = setTimeout(() => updateQuery({ q: trimmedKeyword }), 250);
    return () => clearTimeout(timer);
  }, [keyword, query.q, updateQuery]);

  // Closes the mobile filter sheet with the Escape key
  useEffect(() => {
    if (!isSheetOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsSheetOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isSheetOpen]);

  // Counts shown next to each filter option, computed from every job
  const counts = useMemo<FilterCounts>(() => {
    const tally = (values: string[]) =>
      values.reduce<Record<string, number>>((result, value) => {
        result[value] = (result[value] ?? 0) + 1;
        return result;
      }, {});

    return {
      total: jobs.length,
      noSalary: jobs.filter((job) => !hasSalary(job)).length,
      byArea: tally(jobs.map((job) => getStation(job.location))),
      byWorkType: tally(jobs.map((job) => job.workType)),
      byLevel: tally(jobs.map((job) => job.experienceLevel)),
    };
  }, [jobs]);

  const companyCount = useMemo(
    () => new Set(jobs.map((job) => job.company)).size,
    [jobs]
  );

  const filteredJobs = useMemo(() => {
    const searchKeyword = query.q.toLowerCase();

    const matchingJobs = jobs.filter((job) => {
      if (query.area !== "all" && getStation(job.location) !== query.area) return false;
      if (query.workType !== "All" && job.workType !== query.workType) return false;
      if (query.levels.length > 0 && !query.levels.includes(job.experienceLevel)) return false;

      if (query.minSalary > 0) {
        const salary = annualSalaryTop(job);
        if (salary !== null) {
          if (salary < query.minSalary * 1000) return false;
        } else if (!query.includeNoSalary) {
          return false;
        }
      }

      return (
        !searchKeyword ||
        `${job.title} ${job.company} ${job.skills.join(" ")}`
          .toLowerCase()
          .includes(searchKeyword)
      );
    });

    return matchingJobs.sort((first, second) => {
      const newestFirst = postedTime(second) - postedTime(first);

      if (query.sort === "newest") return newestFirst;

      // Salaried jobs first, highest top of range first
      if (query.sort === "salary") {
        const salaryOf = (job: Job) => annualSalaryTop(job) ?? -1;
        return salaryOf(second) - salaryOf(first) || newestFirst;
      }

      return (
        relevance(second, searchKeyword) - relevance(first, searchKeyword) ||
        newestFirst
      );
    });
  }, [jobs, query]);

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / PAGE_SIZE));
  const currentPage = Math.min(query.page, totalPages);
  const visibleJobs = filteredJobs.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const resetFilters = () => {
    setKeyword("");
    updateQuery({ ...defaultQuery, sort: query.sort });
  };

  // Removable chips for every active filter
  const activeChips = [
    query.q && {
      label: `“${query.q}”`,
      remove: () => {
        setKeyword("");
        updateQuery({ q: "" });
      },
    },
    query.area !== "all" && {
      label: getStationName(query.area),
      remove: () => updateQuery({ area: "all" }),
    },
    query.workType !== "All" && {
      label: `${query.workType} Line`,
      remove: () => updateQuery({ workType: "All" }),
    },
    query.minSalary > 0 && {
      label: `≥ $${query.minSalary}k`,
      remove: () => updateQuery({ minSalary: 0 }),
    },
    query.minSalary > 0 &&
      !query.includeNoSalary && {
        label: "Salary listed only",
        remove: () => updateQuery({ includeNoSalary: true }),
      },
    ...query.levels.map((level) => ({
      label: level,
      remove: () =>
        updateQuery({ levels: query.levels.filter((item) => item !== level) }),
    })),
  ].filter((chip): chip is { label: string; remove: () => void } => Boolean(chip));

  const isReady = !isLoading && !hasError;
  const countLabel = isReady
    ? `${filteredJobs.length} ${filteredJobs.length === 1 ? "job" : "jobs"}`
    : "— jobs";

  const sortSelectClassName =
    "h-11 border-[1.5px] border-ink bg-card px-3.5 text-[15px] font-bold text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";

  const filterPanelProps = {
    jobs,
    filters: query,
    counts,
    onChange: (patch: Partial<JobFilters>) => updateQuery(patch),
    onReset: resetFilters,
  };

  return (
    <main className="flex-1">
      {/* Page header */}
      <div className="flex flex-col gap-3.5 px-4 pb-3.5 pt-[22px] md:px-12 md:pb-7 md:pt-10 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
        <div className="flex flex-col gap-2">
          <p className="hidden font-mono text-[13px] font-bold tracking-[0.1em] text-brand-text md:block">
            ALL DEPARTURES · TORONTO / GTA
          </p>

          <div className="flex items-baseline justify-between">
            <h1 className="text-[34px] font-extrabold leading-none tracking-[-0.03em] md:text-5xl">
              Jobs
            </h1>
            <span className="font-mono text-sm font-semibold text-muted lg:hidden">
              {countLabel}
            </span>
          </div>

          <p className="hidden text-[17px] text-muted md:block">
            {isReady
              ? `${jobs.length} developer postings from ${companyCount} companies. Pick a station, a line or a skill.`
              : "Developer postings from Toronto and the GTA."}
          </p>
        </div>

        <SearchBar
          searchTerm={keyword}
          onSearchChange={setKeyword}
          className="w-full lg:w-[600px] lg:shrink-0"
        />
      </div>

      <div className="grid items-start gap-8 px-4 md:px-12 lg:grid-cols-[340px_minmax(0,1fr)]">
        {/* Desktop filter aside */}
        <aside
          aria-label="Job filters"
          className="hidden overflow-hidden rounded-2xl border border-hairline bg-card lg:block"
        >
          <FilterSidebar {...filterPanelProps} />
        </aside>

        <section aria-label="Job results" className="flex min-w-0 flex-col gap-3.5">
          {/* Mobile and tablet controls */}
          <div className="flex flex-col gap-3.5 lg:hidden">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsSheetOpen(true)}
                aria-haspopup="dialog"
                className="flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-ink text-[15px] font-bold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              >
                Filters
                {activeChips.length > 0 && (
                  <span className="grid h-5 min-w-5 place-items-center rounded-[10px] bg-signal px-[5px] font-mono text-xs font-bold text-ink">
                    {activeChips.length}
                  </span>
                )}
              </button>

              <select
                value={query.sort}
                onChange={(event) => updateQuery({ sort: event.target.value })}
                aria-label="Sort"
                className={`${sortSelectClassName} flex-1 rounded-full`}
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <LineChips
              workTypes={["All", ...workTypes]}
              selectedWorkType={query.workType}
              onWorkTypeChange={(workType) => updateQuery({ workType })}
            />
          </div>

          {/* Desktop toolbar */}
          <div className="hidden min-h-11 items-center justify-between gap-4 lg:flex">
            <div className="flex flex-wrap items-center gap-2.5">
              <p aria-live="polite" className="text-xl font-extrabold">
                {countLabel}
              </p>

              {activeChips.map((chip) => (
                <button
                  key={chip.label}
                  type="button"
                  onClick={chip.remove}
                  aria-label={`Remove filter ${chip.label}`}
                  className="flex h-8 items-center gap-1.5 rounded-full border border-hairline-strong bg-card pl-3 pr-1.5 text-[13px] font-semibold hover:border-ink focus-visible:outline-2 focus-visible:outline-ink"
                >
                  {chip.label}
                  <span
                    aria-hidden="true"
                    className="grid size-5 place-items-center rounded-full bg-[#efeee8] text-[13px]"
                  >
                    ×
                  </span>
                </button>
              ))}
            </div>

            <label className="flex shrink-0 items-center gap-2.5 text-sm font-semibold text-muted">
              Sort
              <select
                value={query.sort}
                onChange={(event) => updateQuery({ sort: event.target.value })}
                className={`${sortSelectClassName} rounded-[10px]`}
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {/* Results */}
          {isLoading ? (
            <LoadingBlock rows={6} label="Loading jobs" />
          ) : hasError ? (
            <ErrorBlock
              onRetry={() => {
                setIsLoading(true);
                setHasError(false);
                setFetchAttempt((attempt) => attempt + 1);
              }}
            />
          ) : visibleJobs.length === 0 ? (
            jobs.length === 0 ? (
              <EmptyBlock
                title="No postings collected yet."
                description="The scrapers haven't stored any jobs. Check back after the next update."
              />
            ) : (
              <EmptyBlock
                title="No jobs match these filters."
                description="Try another station, lower the minimum salary, or include jobs without a listed salary. Most postings don’t list one."
                actionLabel="Clear all filters"
                onAction={resetFilters}
              />
            )
          ) : (
            <>
              <JobBoard jobs={visibleJobs} />
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredJobs.length}
                pageSize={PAGE_SIZE}
                onPageChange={(page) => {
                  updateQuery({ page });
                  window.scrollTo({ top: 0 });
                }}
              />
            </>
          )}
        </section>
      </div>

      {/* Mobile filter bottom sheet */}
      {isSheetOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Filters"
          className="fixed inset-0 z-50 lg:hidden"
        >
          <div
            aria-hidden="true"
            onClick={() => setIsSheetOpen(false)}
            className="absolute inset-0 bg-ink/60"
          />

          <div className="absolute inset-x-0 bottom-0 top-14 flex flex-col overflow-hidden rounded-t-3xl bg-card">
            <div className="flex-1 overflow-y-auto">
              <FilterSidebar
                {...filterPanelProps}
                onClose={() => setIsSheetOpen(false)}
              />
            </div>

            <div className="border-t border-hairline px-5 pb-6 pt-3">
              <button
                type="button"
                onClick={() => setIsSheetOpen(false)}
                className="h-[52px] w-full rounded-full bg-ink text-base font-extrabold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              >
                Show {countLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

// useSearchParams needs a Suspense boundary for the static build
export default function JobsPage() {
  return (
    <Suspense
      fallback={
        <main className="flex-1 px-4 pt-10 md:px-12">
          <LoadingBlock rows={6} label="Loading jobs" />
        </main>
      }
    >
      <JobsPageContent />
    </Suspense>
  );
}
