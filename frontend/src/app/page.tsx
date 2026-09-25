"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import JobBoard, { lineColor } from "@/components/JobRow";
import LineMap from "@/components/LineMap";
import SearchBar, { LineChips } from "@/components/SearchBar";
import { LoadingBlock, EmptyBlock, ErrorBlock } from "@/components/StateBlocks";
import type { Job } from "@/data/jobs";
import { getJobs } from "@/lib/api";
import { getStation, getStationName } from "@/lib/area";

const workTypes = ["All", "Remote", "Hybrid", "On-site"];
const BOARD_SIZE = 8;

const howItWorks = [
  { title: "Collect", text: "Postings from Greenhouse, Lever, RemoteOK and Jobicy." },
  { title: "Extract", text: "Skills, salary and work type, parsed automatically." },
  { title: "Explore", text: "Search jobs and explore hiring trends." },
];

const statLabel = "font-mono text-[10px] font-semibold tracking-[0.08em] text-muted-2 md:text-xs";
const statValue = "text-[28px] font-extrabold tracking-[-0.03em] md:text-[38px]";

export default function Home() {
  const router = useRouter();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWorkType, setSelectedWorkType] = useState("All");
  const [selectedStation, setSelectedStation] = useState<string | null>(null);

  useEffect(() => {
    getJobs()
      .then((fetchedJobs) => {
        setJobs(fetchedJobs);
        setHasError(false);
      })
      .catch(() => setHasError(true))
      .finally(() => setIsLoading(false));
  }, []);

  const isReady = !isLoading && !hasError;

  const stats = useMemo(() => {
    const workTypeCounts: Record<string, number> = { All: jobs.length };
    const skillCounts = new Map<string, number>();

    for (const job of jobs) {
      workTypeCounts[job.workType] = (workTypeCounts[job.workType] ?? 0) + 1;
      for (const skill of job.skills) {
        skillCounts.set(skill, (skillCounts.get(skill) ?? 0) + 1);
      }
    }

    const topSkill = [...skillCounts].sort((first, second) => second[1] - first[1])[0];

    return {
      workTypeCounts,
      companies: new Set(jobs.map((job) => job.company)).size,
      topSkill: topSkill ? { name: topSkill[0], count: topSkill[1] } : null,
    };
  }, [jobs]);

  // Latest postings for the selected station and line; a search overrides the station
  const keyword = searchTerm.trim().toLowerCase();

  const boardJobs = useMemo(
    () =>
      jobs
        .filter((job) => {
          if (selectedWorkType !== "All" && job.workType !== selectedWorkType) return false;

          if (keyword) {
            return (
              job.title.toLowerCase().includes(keyword) ||
              job.company.toLowerCase().includes(keyword) ||
              job.location.toLowerCase().includes(keyword) ||
              job.skills.some((skill) => skill.toLowerCase().includes(keyword))
            );
          }

          return !selectedStation || getStation(job.location) === selectedStation;
        })
        .sort((first, second) => (Date.parse(second.postedAt) || 0) - (Date.parse(first.postedAt) || 0)),
    [jobs, keyword, selectedStation, selectedWorkType]
  );

  const boardTitle = keyword
    ? `Results for “${searchTerm.trim()}”`
    : selectedStation
      ? `from ${getStationName(selectedStation)}`
      : "Latest from all stations";

  const viewAllParams = new URLSearchParams();
  if (keyword) viewAllParams.set("q", searchTerm.trim());
  else if (selectedStation) viewAllParams.set("area", selectedStation);
  if (selectedWorkType !== "All") viewAllParams.set("type", selectedWorkType);
  const viewAllHref = viewAllParams.size > 0 ? `/jobs?${viewAllParams}` : "/jobs";

  const searchJobs = () => {
    const query = searchTerm.trim();
    router.push(query ? `/jobs?q=${encodeURIComponent(query)}` : "/jobs");
  };

  const selectStation = (stationId: string | null) => {
    setSelectedStation(stationId);
    setSearchTerm("");
  };

  const count = (value: number) => (isReady ? value.toLocaleString() : "—");

  return (
    <main className="flex-1 pb-7 md:pb-14">
      {/* Hero: search and lines on the left, the map on the right */}
      <section className="grid grid-cols-1 gap-5 px-4 pb-2 pt-[26px] md:gap-11 md:px-12 md:pb-10 md:pt-12 xl:grid-cols-[420px_minmax(0,880px)]">
        <div className="flex flex-col gap-3.5 md:gap-[22px]">
          <p className="font-mono text-[11px] font-bold tracking-[0.1em] text-brand-text md:text-[13px]">
            DEVELOPER JOBS · TORONTO / GTA
          </p>

          <h1 className="text-balance text-4xl font-extrabold leading-[1.02] tracking-[-0.03em] md:text-[50px]">
            Toronto’s developer jobs, mapped like the subway.
          </h1>

          <p className="text-pretty text-base leading-normal text-muted md:text-lg">
            HireScope collects live developer postings across the GTA. Pick a
            station to see who’s hiring there, or just search.
          </p>

          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onSubmit={searchJobs}
          />

          {/* Work type lines: rows on desktop, scrolling chips on mobile */}
          <div role="group" aria-labelledby="line-toggles-label" className="hidden flex-col gap-1.5 md:flex">
            <p
              id="line-toggles-label"
              className="font-mono text-xs font-semibold tracking-[0.1em] text-muted-2"
            >
              WORK TYPE = LINE
            </p>

            {workTypes.map((workType) => {
              const isSelected = selectedWorkType === workType;

              return (
                <button
                  key={workType}
                  type="button"
                  onClick={() => setSelectedWorkType(workType)}
                  aria-pressed={isSelected}
                  className={`grid h-11 grid-cols-[44px_1fr_auto] items-center gap-3 rounded-[10px] px-3.5 text-left text-base font-bold focus-visible:outline-2 focus-visible:outline-ink ${
                    isSelected ? "bg-card" : "hover:bg-card/60"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`h-2 rounded ${lineColor[workType] ?? "bg-ink"}`}
                  />
                  <span>{workType === "All" ? "All lines" : `${workType} Line`}</span>
                  <span className="font-mono text-sm font-semibold text-muted">
                    {count(stats.workTypeCounts[workType] ?? 0)}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="md:hidden">
            <LineChips
              workTypes={workTypes}
              selectedWorkType={selectedWorkType}
              onWorkTypeChange={setSelectedWorkType}
              counts={isReady ? stats.workTypeCounts : undefined}
            />
          </div>
        </div>

        {isReady ? (
          <LineMap
            jobs={jobs}
            selectedWorkType={selectedWorkType}
            selectedStation={selectedStation}
            onSelectStation={selectStation}
          />
        ) : (
          <div
            aria-busy={isLoading}
            className={`grid h-80 place-items-center rounded-[20px] border border-hairline bg-card font-mono text-[13px] text-muted-2 md:h-auto md:aspect-[880/500] ${
              isLoading ? "animate-pulse" : ""
            }`}
          >
            {isLoading ? "Drawing the map…" : "Station counts are unavailable."}
          </div>
        )}
      </section>

      {/* Stat strip */}
      <section
        aria-label="Job market summary"
        className="mx-4 mt-3 grid grid-cols-2 rounded-2xl border border-hairline bg-card md:mx-12 md:mt-0 lg:grid-cols-4"
      >
        <div className="flex flex-col gap-1 border-b border-r border-hairline-soft px-4 py-3.5 md:px-6 md:py-5 lg:border-b-0">
          <p className={statLabel}>TOTAL JOBS</p>
          <p className={statValue}>{count(jobs.length)}</p>
        </div>
        <div className="flex flex-col gap-1 border-b border-hairline-soft px-4 py-3.5 md:px-6 md:py-5 lg:border-b-0 lg:border-r">
          <p className={statLabel}>REMOTE JOBS</p>
          <p className={statValue}>{count(stats.workTypeCounts.Remote ?? 0)}</p>
        </div>
        <div className="flex flex-col gap-1 border-r border-hairline-soft px-4 py-3.5 md:px-6 md:py-5">
          <p className={statLabel}>COMPANIES HIRING</p>
          <p className={statValue}>{count(stats.companies)}</p>
        </div>
        <div className="flex min-w-0 flex-col gap-1 px-4 py-3.5 md:px-6 md:py-5">
          <p className={statLabel}>TOP SKILL</p>
          <p className={`${statValue} truncate`}>
            {isReady && stats.topSkill ? stats.topSkill.name : "—"}
            {isReady && stats.topSkill && (
              <span className="ml-2 hidden font-mono text-base font-semibold tracking-normal text-muted-2 md:inline">
                {stats.topSkill.count} jobs
              </span>
            )}
          </p>
        </div>
      </section>

      {/* Departures board */}
      <section aria-labelledby="departures-title" className="mx-3 mt-5 flex flex-col gap-2.5 md:mx-12 md:mt-6 md:gap-4">
        <div className="flex items-end justify-between gap-4 px-1 md:px-0">
          <div>
            <p className="font-mono text-[11px] font-bold tracking-[0.14em] text-brand-text md:text-[13px]">
              DEPARTURES
            </p>
            <h2 id="departures-title" className="text-lg font-extrabold md:text-[22px]">
              {boardTitle}
            </h2>
          </div>

          <Link
            href={viewAllHref}
            className="flex min-h-11 shrink-0 items-center text-sm font-bold hover:underline focus-visible:outline-2 focus-visible:outline-ink md:text-[15px]"
          >
            View all jobs →
          </Link>
        </div>

        {isLoading ? (
          <LoadingBlock rows={4} />
        ) : hasError ? (
          <ErrorBlock />
        ) : boardJobs.length === 0 ? (
          <EmptyBlock
            title="No departures match."
            description={
              keyword
                ? "No postings match that search on this line. Try another keyword or line."
                : "No postings from this station on this line right now. Try another station or line."
            }
            actionLabel="Clear all filters"
            onAction={() => {
              setSearchTerm("");
              setSelectedStation(null);
              setSelectedWorkType("All");
            }}
          />
        ) : (
          <JobBoard jobs={boardJobs.slice(0, BOARD_SIZE)} />
        )}
      </section>

      {/* How it works: three stops on one line */}
      <section
        aria-labelledby="how-it-works-title"
        className="mx-4 mt-7 flex flex-col gap-3.5 md:mx-12 md:mt-14 md:grid md:grid-cols-[260px_1fr] md:items-center md:gap-10"
      >
        <h2 id="how-it-works-title" className="text-[22px] font-extrabold tracking-[-0.02em] md:text-[28px]">
          How it works
        </h2>

        <ol className="relative flex flex-col gap-4 pl-10 md:grid md:grid-cols-3 md:gap-6 md:pl-0">
          <span
            aria-hidden="true"
            className="absolute bottom-2.5 left-[13px] top-2.5 w-1.5 rounded-full bg-ink md:inset-x-3.5 md:bottom-auto md:top-[13px] md:h-1.5 md:w-auto"
          />

          {howItWorks.map((step, index) => (
            <li key={step.title} className="relative flex flex-col gap-1 md:gap-2.5">
              <span
                aria-hidden="true"
                className="absolute -left-10 top-0 size-8 rounded-full border-[6px] border-ink bg-card md:static"
              />
              <p className="text-[15px] font-bold md:text-base">
                {index + 1} · {step.title}
              </p>
              <p className="text-sm leading-[1.45] text-muted md:text-[15px]">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
