"use client";

import { useState } from "react";
import Header from "@/components/Header";
import { jobs } from "@/data/jobs";

export default function Home() {
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

          {/* Search and filter section */}
          <section className="mb-8 rounded-xl border border-[#E0BFBF] bg-white p-6 shadow-sm">
            {/* Job search input */}
            <input
              type="text"
              placeholder="Search by job title, company, or skill"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="w-full rounded-lg border border-[#E0BFBF] px-4 py-3 text-gray-900 outline-none transition focus:border-[#800020]"
            />

            {/* Work type filter buttons */}
            <div className="mt-4 flex flex-wrap gap-3">
              {workTypes.map((workType) => {
                const isSelected =
                  selectedWorkType === workType;

                return (
                  <button
                    key={workType}
                    type="button"
                    onClick={() =>
                      setSelectedWorkType(workType)
                    }
                    className={`rounded-lg border px-4 py-2 transition ${
                      isSelected
                        ? "border-[#800020] bg-[#800020] text-white"
                        : "border-[#E0BFBF] bg-white text-gray-700 hover:bg-[#FFDADA]"
                    }`}
                  >
                    {workType}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Job result count */}
          <div className="mb-4 text-sm text-gray-600">
            {filteredJobs.length} job
            {filteredJobs.length !== 1 ? "s" : ""} found
          </div>

          {/* Job listing section */}
          <section className="grid gap-5">
            {/* Empty state shown when no jobs match */}
            {filteredJobs.length === 0 && (
              <div className="rounded-xl border border-[#E0BFBF] bg-white p-8 text-center text-gray-500 shadow-sm">
                No jobs found.
              </div>
            )}

            {/* Render each filtered job */}
            {filteredJobs.map((job) => (
              <article
                key={job.id}
                className="rounded-xl border border-[#E0BFBF] bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <div className="flex flex-col justify-between gap-4 md:flex-row">
                  {/* Job information */}
                  <div>
                    <p className="text-sm font-medium text-[#800020]">
                      {job.company}
                    </p>

                    <h2 className="mt-1 text-xl font-semibold text-gray-900">
                      {job.title}
                    </h2>

                    <p className="mt-2 text-gray-600">
                      {job.location} · {job.workType}
                    </p>

                    {/* Technology skill tags */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      {job.skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full bg-[#F7EDEE] px-3 py-1 text-sm text-[#570013]"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Future job detail page button */}
                  <button
                    type="button"
                    className="h-fit rounded-lg bg-[#800020] px-5 py-3 text-white transition hover:bg-[#570013]"
                  >
                    View Job
                  </button>
                </div>
              </article>
            ))}
          </section>
        </div>
      </main>
    </>
  );
}