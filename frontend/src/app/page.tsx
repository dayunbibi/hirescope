"use client";

import { useState } from "react";

const jobs = [
  {
    id: 1,
    company: "Shopify",
    title: "Frontend Developer",
    location: "Toronto, ON",
    workType: "Remote",
    skills: ["React", "TypeScript", "Next.js"],
  },
  {
    id: 2,
    company: "RBC",
    title: "Software Developer",
    location: "Toronto, ON",
    workType: "Hybrid",
    skills: ["Java", "Spring", "SQL"],
  },
  {
    id: 3,
    company: "Amazon",
    title: "Junior Software Engineer",
    location: "Toronto, ON",
    workType: "On-site",
    skills: ["Python", "AWS", "Docker"],
  },
];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWorkType, setSelectedWorkType] = useState("All");

  const filteredJobs = jobs.filter((job) => {
    const keyword = searchTerm.toLowerCase();

    const matchesSearch =
      job.title.toLowerCase().includes(keyword) ||
      job.company.toLowerCase().includes(keyword) ||
      job.location.toLowerCase().includes(keyword) ||
      job.workType.toLowerCase().includes(keyword) ||
      job.skills.some((skill) => skill.toLowerCase().includes(keyword));

    const matchesWorkType =
      selectedWorkType === "All" || job.workType === selectedWorkType;

    return matchesSearch && matchesWorkType;
  });

  const workTypes = ["All", "Remote", "Hybrid", "On-site"];

  return (
    <main className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900">HireScope</h1>

          <p className="mt-2 text-gray-600">
            Explore developer jobs and hiring trends in Toronto.
          </p>
        </header>

        <section className="mb-8 rounded-xl bg-white p-6 shadow-sm">
          <input
            type="text"
            placeholder="Search by job title, company, or skill"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-gray-900"
          />

          <div className="mt-4 flex flex-wrap gap-3">
            {workTypes.map((workType) => {
              const isSelected = selectedWorkType === workType;

              return (
                <button
                  key={workType}
                  type="button"
                  onClick={() => setSelectedWorkType(workType)}
                  className={`rounded-lg border px-4 py-2 transition ${
                    isSelected
                      ? "border-black bg-black text-white"
                      : "border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {workType}
                </button>
              );
            })}
          </div>
        </section>

        <div className="mb-4 text-sm text-gray-600">
          {filteredJobs.length} job{filteredJobs.length !== 1 ? "s" : ""} found
        </div>

        <section className="grid gap-5">
          {filteredJobs.length === 0 && (
            <div className="rounded-xl bg-white p-8 text-center text-gray-500 shadow-sm">
              No jobs found.
            </div>
          )}

          {filteredJobs.map((job) => (
            <article
              key={job.id}
              className="rounded-xl bg-white p-6 shadow-sm"
            >
              <div className="flex flex-col justify-between gap-4 md:flex-row">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {job.company}
                  </p>

                  <h2 className="mt-1 text-xl font-semibold text-gray-900">
                    {job.title}
                  </h2>

                  <p className="mt-2 text-gray-600">
                    {job.location} · {job.workType}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {job.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <button className="h-fit rounded-lg bg-black px-5 py-3 text-white hover:bg-gray-800">
                  View Job
                </button>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}