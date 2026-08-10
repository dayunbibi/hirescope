"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EmptyState from "@/components/EmptyState";
import JobCard from "@/components/JobCard";
import LoadingCard from "@/components/LoadingCard";
import SearchBar from "@/components/SearchBar";
import StatCard from "@/components/StatCard";
import TechnologyDemand from "@/components/TechnologyDemand";
import WorkTypeChart from "@/components/WorkTypeChart";
import type { Job } from "@/data/jobs";
import { getJobs } from "@/lib/api";

export default function Home() {
  // Stores the jobs fetched from the backend API
  const [jobs, setJobs] = useState<Job[]>([]);

  // Tracks whether jobs are still being fetched
  const [isLoading, setIsLoading] = useState(true);

  // Tracks whether the job fetch failed
  const [hasError, setHasError] = useState(false);

  // Fetches jobs from the backend API on mount
  useEffect(() => {
    getJobs()
      .then(setJobs)
      .catch(() => setHasError(true))
      .finally(() => setIsLoading(false));
  }, []);

  // Stores the text entered in the search input
  const [searchTerm, setSearchTerm] = useState("");

  // Stores the selected work type filter
  const [selectedWorkType, setSelectedWorkType] = useState("All");

  // Available work type filter buttons
  const workTypes = ["All", "Remote", "Hybrid", "On-site"];

  // Filters jobs based on search text and selected work type
  const filteredJobs = jobs.filter((job) => {
    const keyword = searchTerm.toLowerCase();

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
              Explore developer jobs and hiring trends across Toronto.
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
              value="4,821"
              description="+12% this week"
            />

            <StatCard
              label="Remote Jobs"
              value="1,245"
              description="+5% this week"
            />

            <StatCard
              label="Companies Hiring"
              value="342"
              description="Steady this week"
            />

            <StatCard
              label="Top Skill"
              value="React"
              description="Required in 45% of frontend roles"
              highlighted
            />
          </section>

          {/* Main dashboard content */}
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Latest job listings */}
            <section className="lg:col-span-2">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Latest Job Postings
                  </h2>

                  <p className="mt-1 text-sm text-gray-600">
                    {filteredJobs.length} job
                    {filteredJobs.length !== 1 ? "s" : ""} found
                  </p>
                </div>

                <button
                  type="button"
                  className="text-sm font-medium text-[#800020] transition hover:text-[#570013]"
                >
                  View all
                </button>
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
                ) : (
                  <>
                    {/* Empty state shown when no jobs match */}
                    {filteredJobs.length === 0 && (
                      <div className="rounded-xl border border-[#E0BFBF] bg-white p-8 text-center text-gray-500 shadow-sm">
                        No jobs found.
                      </div>
                    )}

                    {/* Render each filtered job */}
                    {filteredJobs.map((job) => (
                      <JobCard key={job.id} job={job} />
                    ))}
                  </>
                )}
              </div>
            </section>

            {/* Analytics sidebar */}
            <aside className="grid gap-6">
              <TechnologyDemand />
              <WorkTypeChart />
            </aside>
          </div>
        </div>
      </main>

      {/* Global website footer */}
      <Footer />
    </>
  );
}