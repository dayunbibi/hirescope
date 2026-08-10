"use client";

import { useEffect, useMemo, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EmptyState from "@/components/EmptyState";
import LoadingCard from "@/components/LoadingCard";
import type { Job } from "@/data/jobs";
import type { Company } from "@/data/companies";
import { getJobs, getCompanies } from "@/lib/api";

type RoleFilter =
  | "All"
  | "Frontend"
  | "Backend"
  | "Full Stack"
  | "Data"
  | "DevOps";

export default function AnalyticsPage() {
  // Stores jobs fetched from the backend API
  const [jobs, setJobs] = useState<Job[]>([]);

  // Stores companies fetched from the backend API
  const [companies, setCompanies] = useState<Company[]>([]);

  // Tracks whether analytics data is loading
  const [isLoading, setIsLoading] = useState(true);

  // Tracks whether API loading failed
  const [hasError, setHasError] = useState(false);

  // Stores the selected analytics date range
  const [dateRange, setDateRange] = useState("30");

  // Stores the selected role filter
  const [selectedRole, setSelectedRole] =
    useState<RoleFilter>("All");

  // Fetches jobs and companies from the backend API
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

  // Filters jobs by the selected developer role
  const filteredJobs = useMemo(() => {
    if (selectedRole === "All") {
      return jobs;
    }

    return jobs.filter((job) => {
      const title = job.title.toLowerCase();
      const skills = job.skills.map((skill) =>
        skill.toLowerCase()
      );

      if (selectedRole === "Frontend") {
        return (
          title.includes("frontend") ||
          title.includes("front-end") ||
          skills.includes("react") ||
          skills.includes("next.js")
        );
      }

      if (selectedRole === "Backend") {
        return (
          title.includes("backend") ||
          title.includes("back-end") ||
          skills.includes("java") ||
          skills.includes("python") ||
          skills.includes("spring")
        );
      }

      if (selectedRole === "Full Stack") {
        return (
          title.includes("full stack") ||
          title.includes("fullstack") ||
          title.includes("full-stack")
        );
      }

      if (selectedRole === "Data") {
        return (
          title.includes("data") ||
          title.includes("machine learning") ||
          title.includes("ml") ||
          skills.includes("sql") ||
          skills.includes("python")
        );
      }

      if (selectedRole === "DevOps") {
        return (
          title.includes("devops") ||
          title.includes("site reliability") ||
          title.includes("sre") ||
          skills.includes("docker") ||
          skills.includes("aws")
        );
      }

      return true;
    });
  }, [jobs, selectedRole]);

  // Calculates average salary using jobs with available salary values
  const averageSalary = useMemo(() => {
    const salaryValues = filteredJobs
      .map((job) => {
        if (
          job.salaryMin !== null &&
          job.salaryMax !== null
        ) {
          return (job.salaryMin + job.salaryMax) / 2;
        }

        if (job.salaryMin !== null) {
          return job.salaryMin;
        }

        if (job.salaryMax !== null) {
          return job.salaryMax;
        }

        return null;
      })
      .filter(
        (salary): salary is number =>
          salary !== null
      );

    if (salaryValues.length === 0) {
      return null;
    }

    return (
      salaryValues.reduce(
        (total, salary) => total + salary,
        0
      ) / salaryValues.length
    );
  }, [filteredJobs]);

  // Calculates work type percentages
  const workTypeStats = useMemo(() => {
    const total = filteredJobs.length;

    const labels = [
      "Remote",
      "Hybrid",
      "On-site",
    ] as const;

    return labels.map((label) => {
      const count = filteredJobs.filter(
        (job) => job.workType === label
      ).length;

      return {
        label,
        count,
        percentage:
          total === 0
            ? 0
            : Math.round((count / total) * 100),
      };
    });
  }, [filteredJobs]);

  // Calculates technology demand from all job skill tags
  const topTechnologies = useMemo(() => {
    const counts = new Map<string, number>();

    filteredJobs.forEach((job) => {
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
      .slice(0, 8);
  }, [filteredJobs]);

  // Calculates experience level demand
  const experienceStats = useMemo(() => {
    const levels = [
      "Entry",
      "Mid-Level",
      "Senior",
      "Lead",
    ] as const;

    const total = filteredJobs.length;

    return levels.map((level) => {
      const count = filteredJobs.filter(
        (job) =>
          job.experienceLevel === level
      ).length;

      return {
        level,
        count,
        percentage:
          total === 0
            ? 0
            : Math.round((count / total) * 100),
      };
    });
  }, [filteredJobs]);

  // Calculates average salary by experience level
  const salaryTrend = useMemo(() => {
    return experienceStats.map((experience) => {
      const matchingJobs = filteredJobs.filter(
        (job) =>
          job.experienceLevel === experience.level
      );

      const salaries = matchingJobs
        .map((job) => {
          if (
            job.salaryMin !== null &&
            job.salaryMax !== null
          ) {
            return (job.salaryMin + job.salaryMax) / 2;
          }

          return job.salaryMax ?? job.salaryMin;
        })
        .filter(
          (salary): salary is number =>
            salary !== null
        );

      const average =
        salaries.length === 0
          ? 0
          : salaries.reduce(
              (total, salary) => total + salary,
              0
            ) / salaries.length;

      return {
        label: experience.level,
        value: average,
      };
    });
  }, [filteredJobs, experienceStats]);

  // Determines the highest salary value for chart scaling
  const maxSalaryTrend = Math.max(
    ...salaryTrend.map((item) => item.value),
    1
  );

  // Creates the summary statistic cards
  const summaryStats = [
    {
      label: "Total Active Jobs",
      value: filteredJobs.length.toLocaleString(),
      comparison: "live jobs in database",
    },
    {
      label: "Hiring Companies",
      value: companies.length.toLocaleString(),
      comparison: "companies tracked",
    },
    {
      label: "Jobs With Salary",
      value: filteredJobs
        .filter(
          (job) =>
            job.salaryMin !== null ||
            job.salaryMax !== null
        )
        .length.toLocaleString(),
      comparison: "salary data available",
    },
    {
      label: "Avg. Salary Offered",
      value:
        averageSalary === null
          ? "N/A"
          : `$${Math.round(
              averageSalary / 1000
            )}k`,
      comparison: "estimated from disclosed salaries",
    },
  ];

  // Handles temporary analytics export
  const handleExport = () => {
    window.alert(
      "CSV export will be added in a later frontend update."
    );
  };

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#FBF9F7] px-5 py-10">
        <div className="mx-auto max-w-6xl">
          {/* Analytics page heading */}
          <section className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                Market Insights Overview
              </h1>

              <p className="mt-2 text-gray-600">
                Analyze live hiring trends from the
                HireScope job database.
              </p>
            </div>

            {/* Dashboard controls */}
            <div className="flex flex-wrap gap-3">
              <select
                aria-label="Select analytics date range"
                value={dateRange}
                onChange={(event) =>
                  setDateRange(event.target.value)
                }
                className="rounded-lg border border-[#E0BFBF] bg-white px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#800020]"
              >
                <option value="7">
                  Last 7 Days
                </option>

                <option value="30">
                  Last 30 Days
                </option>

                <option value="90">
                  Last 90 Days
                </option>

                <option value="365">
                  Last Year
                </option>
              </select>

              <select
                aria-label="Select developer role"
                value={selectedRole}
                onChange={(event) =>
                  setSelectedRole(
                    event.target.value as RoleFilter
                  )
                }
                className="rounded-lg border border-[#E0BFBF] bg-white px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#800020]"
              >
                <option value="All">
                  All Roles
                </option>

                <option value="Frontend">
                  Frontend
                </option>

                <option value="Backend">
                  Backend
                </option>

                <option value="Full Stack">
                  Full Stack
                </option>

                <option value="Data">
                  Data
                </option>

                <option value="DevOps">
                  DevOps
                </option>
              </select>

              <button
                type="button"
                onClick={handleExport}
                className="rounded-lg bg-[#800020] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#570013]"
              >
                Export
              </button>
            </div>
          </section>

          {isLoading ? (
            <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <LoadingCard />
              <LoadingCard />
              <LoadingCard />
              <LoadingCard />
            </section>
          ) : hasError ? (
            <div className="mt-8">
              <EmptyState
                icon="cloud_off"
                title="Couldn't load analytics"
                description="We couldn't reach the HireScope API. Make sure the backend is running and try again."
              />
            </div>
          ) : (
            <>
              {/* Summary statistic cards */}
              <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {summaryStats.map((stat) => (
                  <article
                    key={stat.label}
                    className="rounded-xl border border-[#E0BFBF] bg-white p-6 shadow-sm"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">
                      {stat.label}
                    </p>

                    <p className="mt-5 text-4xl font-bold text-gray-900">
                      {stat.value}
                    </p>

                    <p className="mt-4 text-xs text-gray-500">
                      {stat.comparison}
                    </p>
                  </article>
                ))}
              </section>

              {/* Main analytics grid */}
              <section className="mt-6 grid gap-6 lg:grid-cols-3">
                {/* Salary distribution */}
                <article className="rounded-xl border border-[#E0BFBF] bg-white p-6 shadow-sm lg:col-span-2">
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Salary by Experience Level
                  </h2>

                  <p className="mt-2 text-sm text-gray-500">
                    Estimated average salary from
                    disclosed job postings
                  </p>

                  <div className="mt-6 rounded-lg bg-[#F5F3F1] px-4 pb-4 pt-8">
                    <div className="flex h-48 items-end gap-3 sm:gap-5">
                      {salaryTrend.map(
                        (item, index) => {
                          const height =
                            item.value === 0
                              ? 0
                              : Math.max(
                                  8,
                                  (item.value /
                                    maxSalaryTrend) *
                                    100
                                );

                          return (
                            <div
                              key={item.label}
                              className="flex h-full flex-1 flex-col justify-end"
                            >
                              <div
                                className={
                                  index ===
                                  salaryTrend.length - 1
                                    ? "w-full rounded-t-sm bg-[#800020]"
                                    : "w-full rounded-t-sm bg-[#C8939D]"
                                }
                                style={{
                                  height: `${height}%`,
                                }}
                                title={
                                  item.value === 0
                                    ? "No salary data"
                                    : `$${Math.round(
                                        item.value /
                                          1000
                                      )}k`
                                }
                              />

                              <span className="mt-3 text-center text-xs text-gray-500">
                                {item.label}
                              </span>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>
                </article>

                {/* Work type distribution */}
                <article className="rounded-xl border border-[#E0BFBF] bg-white p-6 shadow-sm">
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Work Type
                  </h2>

                  <div className="mt-10 space-y-7">
                    {workTypeStats.map(
                      (workType, index) => (
                        <div key={workType.label}>
                          <div className="mb-2 flex items-center justify-between text-sm">
                            <span className="font-medium text-gray-700">
                              {workType.label}
                            </span>

                            <span className="text-gray-500">
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
              </section>

              {/* Secondary analytics grid */}
              <section className="mt-6 grid gap-6 lg:grid-cols-2">
                {/* Technology ranking */}
                <article className="rounded-xl border border-[#E0BFBF] bg-white p-6 shadow-sm">
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Top Technologies
                  </h2>

                  {topTechnologies.length >
                  0 ? (
                    <div className="mt-6 flex flex-wrap gap-3">
                      {topTechnologies.map(
                        (technology) => (
                          <div
                            key={technology.name}
                            className="flex items-center gap-2 rounded-md bg-[#F0F0F0] px-3 py-2"
                          >
                            <span className="text-sm font-medium text-gray-800">
                              {technology.name}
                            </span>

                            <span className="text-xs text-gray-500">
                              {technology.count}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <p className="mt-5 text-sm text-gray-500">
                      No technology data available.
                    </p>
                  )}
                </article>

                {/* Experience demand distribution */}
                <article className="rounded-xl border border-[#E0BFBF] bg-white p-6 shadow-sm">
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Experience Demand
                  </h2>

                  <div className="mt-7 flex min-h-12 overflow-hidden rounded-lg bg-[#EAE8E6]">
                    {experienceStats.map(
                      (experience, index) =>
                        experience.percentage >
                          0 && (
                          <div
                            key={
                              experience.level
                            }
                            className={`flex items-center justify-center px-2 text-xs font-medium ${
                              index === 0
                                ? "bg-[#F1DADC] text-gray-700"
                                : index === 1
                                  ? "bg-[#C8939D] text-white"
                                  : index === 2
                                    ? "bg-[#800020] text-white"
                                    : "bg-[#570013] text-white"
                            }`}
                            style={{
                              width: `${experience.percentage}%`,
                            }}
                          >
                            {experience.level}
                          </div>
                        )
                    )}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-5 text-xs text-gray-500">
                    {experienceStats.map(
                      (experience) => (
                        <span
                          key={experience.level}
                        >
                          {experience.level}:{" "}
                          {experience.count} (
                          {experience.percentage}%)
                        </span>
                      )
                    )}
                  </div>
                </article>
              </section>
            </>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}