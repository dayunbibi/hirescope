"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EmptyState from "@/components/EmptyState";
import JobCard from "@/components/JobCard";
import LoadingCard from "@/components/LoadingCard";
import SearchBar from "@/components/SearchBar";
import StatCard from "@/components/StatCard";
import type { Job } from "@/data/jobs";
import type { Company } from "@/data/companies";
import { getCompanies, getJobs } from "@/lib/api";

export default function Home() {
  // Stores jobs fetched from the backend API
  const [jobs, setJobs] = useState<Job[]>([]);

  // Stores companies fetched from the backend API
  const [companies, setCompanies] = useState<Company[]>([]);

  // Tracks whether dashboard data is still being fetched
  const [isLoading, setIsLoading] = useState(true);

  // Tracks whether the API request failed
  const [hasError, setHasError] = useState(false);

  // Stores the text entered in the search input
  const [searchTerm, setSearchTerm] = useState("");

  // Stores the selected work type filter
  const [selectedWorkType, setSelectedWorkType] = useState("All");

  // Available work type filter buttons
  const workTypes = ["All", "Remote", "Hybrid", "On-site"];

  // Fetches live jobs and company data
  useEffect(() => {
    Promise.all([getJobs(), getCompanies()])
      .then(([fetchedJobs, fetchedCompanies]) => {
        setJobs(fetchedJobs);
        setCompanies(fetchedCompanies);
        setHasError(false);
      })
      .catch(() => {
        setHasError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // Filters jobs based on search text and selected work type
  const filteredJobs = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    return jobs.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(keyword) ||
        job.company.toLowerCase().includes(keyword) ||
        job.location.toLowerCase().includes(keyword) ||
        job.workType.toLowerCase().includes(keyword) ||
        job.skills.some((skill) =>
          skill.toLowerCase().includes(keyword)
        );

      const matchesWorkType =
        selectedWorkType === "All" ||
        job.workType === selectedWorkType;

      return matchesSearch && matchesWorkType;
    });
  }, [jobs, searchTerm, selectedWorkType]);

  // Counts remote jobs
  const remoteJobs = jobs.filter(
    (job) => job.workType === "Remote"
  ).length;

  // Finds the most frequently requested technology
  const topSkill = useMemo(() => {
    const counts = new Map<string, number>();

    jobs.forEach((job) => {
      job.skills.forEach((skill) => {
        counts.set(
          skill,
          (counts.get(skill) ?? 0) + 1
        );
      });
    });

    const sortedSkills = Array.from(counts.entries()).sort(
      (firstSkill, secondSkill) =>
        secondSkill[1] - firstSkill[1]
    );

    if (sortedSkills.length === 0) {
      return {
        name: "N/A",
        count: 0,
      };
    }

    return {
      name: sortedSkills[0][0],
      count: sortedSkills[0][1],
    };
  }, [jobs]);

  // Calculates work type distribution
  const workTypeStats = useMemo(() => {
    const total = jobs.length;

    return ["Remote", "Hybrid", "On-site"].map(
      (workType) => {
        const count = jobs.filter(
          (job) => job.workType === workType
        ).length;

        return {
          label: workType,
          count,
          percentage:
            total === 0
              ? 0
              : Math.round((count / total) * 100),
        };
      }
    );
  }, [jobs]);

  // Calculates the most requested technologies
  const technologyStats = useMemo(() => {
    const counts = new Map<string, number>();

    jobs.forEach((job) => {
      job.skills.forEach((skill) => {
        counts.set(
          skill,
          (counts.get(skill) ?? 0) + 1
        );
      });
    });

    return Array.from(counts.entries())
      .map(([name, count]) => ({
        name,
        count,
      }))
      .sort(
        (firstTechnology, secondTechnology) =>
          secondTechnology.count -
          firstTechnology.count
      )
      .slice(0, 6);
  }, [jobs]);

  // Shows only a small number of jobs on the homepage
  const visibleJobs = filteredJobs.slice(0, 6);

  return (
    <>
      {/* Global website header */}
      <Header />

      <main className="min-h-screen bg-[#FBF9F7] px-6 py-10">
        <div className="mx-auto max-w-6xl">
          {/* Hero section */}
          <section className="mb-10 text-center">
            <h1 className="text-4xl font-bold text-gray-900">
              Data-Driven Tech Recruitment
            </h1>

            <p className="mx-auto mt-3 max-w-2xl text-gray-600">
              Explore live developer jobs and hiring trends across Toronto.
            </p>
          </section>

          {/* Search and work type filter controls */}
          <SearchBar
            searchTerm={searchTerm}
            selectedWorkType={selectedWorkType}
            workTypes={workTypes}
            onSearchChange={setSearchTerm}
            onWorkTypeChange={setSelectedWorkType}
          />

          {/* Summary statistics */}
          <section className="mb-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Total Jobs"
              value={
                isLoading
                  ? "..."
                  : jobs.length.toLocaleString()
              }
              description="Live jobs in the HireScope database"
            />

            <StatCard
              label="Remote Jobs"
              value={
                isLoading
                  ? "..."
                  : remoteJobs.toLocaleString()
              }
              description={
                jobs.length === 0
                  ? "No job data available"
                  : `${Math.round(
                      (remoteJobs / jobs.length) * 100
                    )}% of tracked roles`
              }
            />

            <StatCard
              label="Companies Hiring"
              value={
                isLoading
                  ? "..."
                  : companies.length.toLocaleString()
              }
              description="Companies currently tracked"
            />

            <StatCard
              label="Top Skill"
              value={
                isLoading ? "..." : topSkill.name
              }
              description={
                topSkill.count === 0
                  ? "No skill data available"
                  : `Found in ${topSkill.count} job postings`
              }
              highlighted
            />
          </section>

          {/* Main dashboard content */}
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Latest job listings */}
            <section className="lg:col-span-2">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Latest Job Postings
                  </h2>

                  <p className="mt-1 text-sm text-gray-600">
                    {filteredJobs.length} job
                    {filteredJobs.length !== 1 ? "s" : ""} found
                  </p>
                </div>

                <Link
                  href="/jobs"
                  className="shrink-0 text-sm font-medium text-[#800020] transition hover:text-[#570013]"
                >
                  View all
                </Link>
              </div>

              <div className="grid gap-5">
                {isLoading ? (
                  <>
                    <LoadingCard />
                    <LoadingCard />
                    <LoadingCard />
                  </>
                ) : hasError ? (
                  <EmptyState
                    icon="cloud_off"
                    title="Couldn't load jobs"
                    description="We couldn't reach the HireScope API. Make sure the backend is running and try again."
                  />
                ) : visibleJobs.length === 0 ? (
                  <EmptyState
                    icon="search_off"
                    title="No jobs found"
                    description="Try changing your search keyword or work type filter."
                  />
                ) : (
                  visibleJobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))
                )}
              </div>
            </section>

            {/* Analytics sidebar */}
            <aside className="grid gap-6">
              {/* Technology demand */}
              <article className="rounded-xl border border-[#E0BFBF] bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Technology Demand
                  </h2>

                  <Link
                    href="/analytics"
                    className="text-xs font-medium text-[#800020] hover:underline"
                  >
                    Analytics
                  </Link>
                </div>

                {technologyStats.length > 0 ? (
                  <div className="mt-5 space-y-4">
                    {technologyStats.map(
                      (technology, index) => {
                        const maximumCount =
                          technologyStats[0]?.count ?? 1;

                        const percentage = Math.max(
                          8,
                          Math.round(
                            (technology.count /
                              maximumCount) *
                              100
                          )
                        );

                        return (
                          <div key={technology.name}>
                            <div className="mb-2 flex items-center justify-between text-sm">
                              <span className="font-medium text-gray-700">
                                {technology.name}
                              </span>

                              <span className="text-xs text-gray-500">
                                {technology.count}
                              </span>
                            </div>

                            <div className="h-2 overflow-hidden rounded-full bg-[#EAE8E6]">
                              <div
                                className={
                                  index === 0
                                    ? "h-full rounded-full bg-[#800020]"
                                    : "h-full rounded-full bg-[#C8939D]"
                                }
                                style={{
                                  width: `${percentage}%`,
                                }}
                              />
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-gray-500">
                    No technology data available.
                  </p>
                )}
              </article>

              {/* Work type distribution */}
              <article className="rounded-xl border border-[#E0BFBF] bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900">
                  Work Type
                </h2>

                <div className="mt-5 space-y-5">
                  {workTypeStats.map(
                    (workType, index) => (
                      <div key={workType.label}>
                        <div className="mb-2 flex items-center justify-between text-sm">
                          <span className="font-medium text-gray-700">
                            {workType.label}
                          </span>

                          <span className="text-xs text-gray-500">
                            {workType.percentage}% (
                            {workType.count})
                          </span>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-[#EAE8E6]">
                          <div
                            className={
                              index === 0
                                ? "h-full rounded-full bg-[#800020]"
                                : index === 1
                                  ? "h-full rounded-full bg-[#B46A78]"
                                  : "h-full rounded-full bg-[#D5A8AF]"
                            }
                            style={{
                              width: `${workType.percentage}%`,
                            }}
                          />
                        </div>
                      </div>
                    )
                  )}
                </div>
              </article>
            </aside>
          </div>
        </div>
      </main>

      {/* Global website footer */}
      <Footer />
    </>
  );
}