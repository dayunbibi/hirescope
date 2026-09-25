"use client";

import { useEffect, useMemo, useState } from "react";
import CompanyCard from "@/components/CompanyCard";
import { LoadingBlock, EmptyBlock, ErrorBlock } from "@/components/StateBlocks";
import type { Company } from "@/data/companies";
import type { Job } from "@/data/jobs";
import { getCompanies, getJobs } from "@/lib/api";
import { companyStats, isSameCompany } from "@/lib/company";

// Cards shown before "Show all N companies"
const COLLAPSED_COUNT = 6;

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAll, setShowAll] = useState(false);

  // Companies give ids and profile fields; jobs give the real counts, skills and salaries
  useEffect(() => {
    Promise.all([getCompanies(), getJobs()])
      .then(([fetchedCompanies, fetchedJobs]) => {
        setCompanies(fetchedCompanies);
        setJobs(fetchedJobs);
      })
      .catch(() => setHasError(true))
      .finally(() => setIsLoading(false));
  }, []);

  // Every company with its stats, most open roles first
  const directory = useMemo(
    () =>
      companies
        .map((company) => ({
          company,
          stats: companyStats(jobs.filter((job) => isSameCompany(job.company, company.name))),
        }))
        .sort((first, second) => second.stats.openRoles - first.stats.openRoles),
    [companies, jobs]
  );

  const keyword = searchTerm.trim().toLowerCase();
  const matches = keyword
    ? directory.filter(({ company, stats }) =>
        [company.name, ...stats.technologies].some((text) =>
          text.toLowerCase().includes(keyword)
        )
      )
    : directory;

  const isCollapsed = !keyword && !showAll && matches.length > COLLAPSED_COUNT;
  const visible = isCollapsed ? matches.slice(0, COLLAPSED_COUNT) : matches;

  const countLabel = keyword
    ? `${matches.length} of ${directory.length} companies`
    : isCollapsed
      ? `Showing ${COLLAPSED_COUNT} of ${directory.length} companies`
      : `${directory.length} companies`;

  return (
    <main className="flex-1">
      <div className="flex flex-col gap-4 px-4 pb-5 pt-6 md:px-12 md:pb-7 md:pt-10 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
        <div className="flex flex-col gap-2">
          <p className="font-mono text-[11px] font-bold tracking-[0.1em] text-brand-text md:text-[13px]">
            TERMINALS · WHO’S HIRING
          </p>
          <h1 className="text-[34px] font-extrabold leading-none tracking-[-0.03em] md:text-5xl">
            Companies
          </h1>
          {!isLoading && !hasError && (
            <p className="text-base text-muted md:text-[17px]">
              {directory.length} companies with open postings, sorted by open roles.
            </p>
          )}
        </div>

        <label className="flex h-[52px] w-full items-center gap-2.5 rounded-full border-2 border-ink bg-card px-4 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ink md:h-14 md:px-5 lg:w-[520px]">
          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 20 20" fill="none" className="shrink-0 stroke-ink" strokeWidth="2.2">
            <circle cx="8.5" cy="8.5" r="6.5" />
            <path d="M13.5 13.5 19 19" />
          </svg>
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            aria-label="Search companies or technologies"
            placeholder="Search companies or technologies"
            className="min-w-0 flex-1 bg-transparent text-base font-medium outline-none placeholder:text-[#8a8c88] md:text-[17px]"
          />
        </label>
      </div>

      <div className="flex flex-col gap-4 px-4 md:px-12">
        {isLoading ? (
          <LoadingBlock rows={4} label="Loading companies" message="Checking every terminal for open roles…" />
        ) : hasError ? (
          <ErrorBlock description="Company data is temporarily unavailable. Try again in a moment." />
        ) : matches.length === 0 ? (
          <EmptyBlock
            eyebrow="NO TERMINAL FOUND"
            title={keyword ? `No companies match “${searchTerm.trim()}”.` : "No companies yet."}
            description={
              keyword
                ? "Check the spelling, or search a technology like Python or Go."
                : "No company data has been collected yet."
            }
            actionLabel={keyword ? "Clear search" : undefined}
            onAction={() => setSearchTerm("")}
          />
        ) : (
          <>
            <div className="flex min-h-11 items-center justify-between gap-4">
              <p className="text-lg font-extrabold">{countLabel}</p>
              <p className="hidden font-mono text-[13px] text-muted sm:block">Sorted by open roles</p>
            </div>

            <div className="grid gap-3 md:grid-cols-2 md:gap-5 xl:grid-cols-3">
              {visible.map(({ company, stats }) => (
                <CompanyCard key={company.id} company={company} stats={stats} />
              ))}
            </div>

            {isCollapsed && (
              <div className="flex justify-center py-3">
                <button
                  type="button"
                  onClick={() => setShowAll(true)}
                  className="h-12 rounded-full border-[1.5px] border-ink bg-card px-7 text-base font-bold hover:bg-ink hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                >
                  Show all {directory.length} companies
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
