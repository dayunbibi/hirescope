"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookmarkCard from "@/components/BookmarkCard";
import { jobs } from "@/data/jobs";

export default function BookmarksPage() {
  // Stores the selected work type filter
  const [selectedWorkType, setSelectedWorkType] = useState("All");

  // Stores the selected sorting option
  const [sortOption, setSortOption] = useState("newest");

  // Filters and sorts bookmarked jobs
  const bookmarkedJobs = useMemo(() => {
    const savedJobs = jobs.filter((job) => job.bookmarked);

    const filteredJobs =
      selectedWorkType === "All"
        ? savedJobs
        : savedJobs.filter(
            (job) => job.workType === selectedWorkType
          );

    return [...filteredJobs].sort((firstJob, secondJob) => {
      if (sortOption === "salary") {
        return secondJob.salaryMax - firstJob.salaryMax;
      }

      if (sortOption === "company") {
        return firstJob.company.localeCompare(secondJob.company);
      }

      return secondJob.id - firstJob.id;
    });
  }, [selectedWorkType, sortOption]);

  return (
    <>
      {/* Global website header */}
      <Header />

      <main className="min-h-screen bg-[#FBF9F7] px-5 pb-16 pt-10">
        <div className="mx-auto max-w-6xl">
          {/* Page heading and controls */}
          <section className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                Saved Jobs
              </h1>

              <p className="mt-2 text-lg text-gray-600">
                You have{" "}
                <span className="font-bold text-[#800020]">
                  {bookmarkedJobs.length}
                </span>{" "}
                saved job
                {bookmarkedJobs.length !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Filter and sort controls */}
            <div className="flex flex-wrap gap-3">
              <select
                value={selectedWorkType}
                onChange={(event) =>
                  setSelectedWorkType(event.target.value)
                }
                className="rounded-lg border border-[#E0BFBF] bg-white px-4 py-2 text-sm text-gray-700 outline-none focus:border-[#800020]"
              >
                <option value="All">All Work Types</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
              </select>

              <select
                value={sortOption}
                onChange={(event) =>
                  setSortOption(event.target.value)
                }
                className="rounded-lg border border-[#E0BFBF] bg-white px-4 py-2 text-sm text-gray-700 outline-none focus:border-[#800020]"
              >
                <option value="newest">Newest</option>
                <option value="salary">Highest Salary</option>
                <option value="company">Company Name</option>
              </select>
            </div>
          </section>

          {/* Saved job cards */}
          {bookmarkedJobs.length > 0 ? (
            <section className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {bookmarkedJobs.map((job) => (
                <BookmarkCard key={job.id} job={job} />
              ))}
            </section>
          ) : (
            /* Empty state */
            <section className="mt-10 flex flex-col items-center justify-center rounded-xl border border-[#E0BFBF] bg-white px-6 py-16 text-center shadow-sm">
              <div className="flex h-20 w-20 items-center justify-center rounded-full border border-[#E0BFBF] bg-[#F5F3F1] text-3xl text-[#800020]">
                ☆
              </div>

              <h2 className="mt-6 text-2xl font-semibold text-gray-900">
                No saved jobs yet
              </h2>

              <p className="mt-2 max-w-md text-gray-500">
                Jobs you bookmark while browsing will appear here so
                you can easily find them later.
              </p>

              <Link
                href="/jobs"
                className="mt-6 rounded-lg bg-[#800020] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#570013]"
              >
                Browse Jobs
              </Link>
            </section>
          )}
        </div>
      </main>

      {/* Global website footer */}
      <Footer />
    </>
  );
}