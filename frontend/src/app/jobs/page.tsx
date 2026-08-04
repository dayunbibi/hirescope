"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JobCard from "@/components/JobCard";
import SearchBar from "@/components/SearchBar";
import { jobs } from "@/data/jobs";

export default function JobsPage() {
  // Stores the text entered in the search input
  const [searchTerm, setSearchTerm] = useState("");

  // Stores the selected work type filter
  const [selectedWorkType, setSelectedWorkType] = useState("All");

  // Available work type filter buttons
  const workTypes = ["All", "Remote", "Hybrid", "On-site"];

  // Filters jobs based on search text and selected work type
  const filteredJobs = jobs.filter((job) => {
    const keyword = searchTerm.trim().toLowerCase();

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
          {/* Page heading */}
          <section className="mb-8">
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-[#800020]">
              Toronto Tech Jobs
            </p>

            <h1 className="mt-2 text-4xl font-bold text-gray-900">
              Browse Developer Jobs
            </h1>

            <p className="mt-3 max-w-2xl text-gray-600">
              Search developer roles by job title, company, location,
              technology, or work arrangement.
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

          {/* Results heading */}
          <section className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                Available Positions
              </h2>

              <p className="mt-1 text-sm text-gray-600">
                {filteredJobs.length} job
                {filteredJobs.length !== 1 ? "s" : ""} found
              </p>
            </div>

            {/* Temporary sort control */}
            <select
              aria-label="Sort jobs"
              defaultValue="newest"
              className="rounded-lg border border-[#E0BFBF] bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-[#800020]"
            >
              <option value="newest">Newest</option>
              <option value="relevant">Most Relevant</option>
              <option value="salary">Highest Salary</option>
            </select>
          </section>

          {/* Job listing section */}
          <section className="grid gap-5">
            {/* Empty state shown when no jobs match */}
            {filteredJobs.length === 0 && (
              <div className="rounded-xl border border-[#E0BFBF] bg-white p-10 text-center shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900">
                  No jobs found
                </h3>

                <p className="mt-2 text-gray-500">
                  Try changing your search keyword or work type filter.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedWorkType("All");
                  }}
                  className="mt-5 rounded-lg bg-[#800020] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#570013]"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* Render each filtered job */}
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </section>
        </div>
      </main>

      {/* Global website footer */}
      <Footer />
    </>
  );
}