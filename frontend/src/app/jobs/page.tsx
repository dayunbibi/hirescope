"use client";

import { useMemo, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FilterSidebar from "@/components/FilterSidebar";
import JobCard from "@/components/JobCard";
import Pagination from "@/components/Pagination";
import EmptyState from "@/components/EmptyState";
import { jobs } from "@/data/jobs";

const jobsPerPage = 3;

export default function JobsPage() {
  // Stores the current keyword search
  const [searchTerm, setSearchTerm] = useState("");

  // Stores the current location search
  const [location, setLocation] = useState("Toronto");

  // Stores selected work arrangements
  const [selectedWorkTypes, setSelectedWorkTypes] = useState<string[]>([]);

  // Stores selected experience levels
  const [selectedExperienceLevels, setSelectedExperienceLevels] =
    useState<string[]>([]);

  // Stores the minimum desired salary
  const [minimumSalary, setMinimumSalary] = useState(50000);

  // Stores the active sorting method
  const [sortOption, setSortOption] = useState("relevant");

  // Stores the currently selected result page
  const [currentPage, setCurrentPage] = useState(1);

  // Adds or removes one work type from the selected filters
  const toggleWorkType = (workType: string) => {
    setSelectedWorkTypes((currentTypes) =>
      currentTypes.includes(workType)
        ? currentTypes.filter((type) => type !== workType)
        : [...currentTypes, workType]
    );

    setCurrentPage(1);
  };

  // Adds or removes one experience level from the selected filters
  const toggleExperienceLevel = (experienceLevel: string) => {
    setSelectedExperienceLevels((currentLevels) =>
      currentLevels.includes(experienceLevel)
        ? currentLevels.filter((level) => level !== experienceLevel)
        : [...currentLevels, experienceLevel]
    );

    setCurrentPage(1);
  };

  // Clears every active job filter
  const clearFilters = () => {
    setSearchTerm("");
    setLocation("");
    setSelectedWorkTypes([]);
    setSelectedExperienceLevels([]);
    setMinimumSalary(50000);
    setSortOption("relevant");
    setCurrentPage(1);
  };

  // Filters and sorts jobs using the selected controls
  const filteredJobs = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    const locationKeyword = location.trim().toLowerCase();

    const matchingJobs = jobs.filter((job) => {
      const matchesKeyword =
        job.title.toLowerCase().includes(keyword) ||
        job.company.toLowerCase().includes(keyword) ||
        job.skills.some((skill) =>
          skill.toLowerCase().includes(keyword)
        );

      const matchesLocation =
        locationKeyword === "" ||
        job.location.toLowerCase().includes(locationKeyword) ||
        job.workType === "Remote";

      const matchesWorkType =
        selectedWorkTypes.length === 0 ||
        selectedWorkTypes.includes(job.workType);

      const matchesExperience =
        selectedExperienceLevels.length === 0 ||
        selectedExperienceLevels.includes(job.experienceLevel);

      const matchesSalary = job.salaryMax >= minimumSalary;

      return (
        matchesKeyword &&
        matchesLocation &&
        matchesWorkType &&
        matchesExperience &&
        matchesSalary
      );
    });

    return [...matchingJobs].sort((firstJob, secondJob) => {
      if (sortOption === "salary") {
        return secondJob.salaryMax - firstJob.salaryMax;
      }

      if (sortOption === "newest") {
        return secondJob.id - firstJob.id;
      }

      return firstJob.id - secondJob.id;
    });
  }, [
    searchTerm,
    location,
    selectedWorkTypes,
    selectedExperienceLevels,
    minimumSalary,
    sortOption,
  ]);

  // Calculates the total number of result pages
  const totalPages = Math.max(
    1,
    Math.ceil(filteredJobs.length / jobsPerPage)
  );

  // Calculates which jobs should be displayed on the current page
  const firstJobIndex = (currentPage - 1) * jobsPerPage;

  const visibleJobs = filteredJobs.slice(
    firstJobIndex,
    firstJobIndex + jobsPerPage
  );

  return (
    <>
      {/* Global website header */}
      <Header />

      <main className="min-h-screen bg-[#FBF9F7] px-5 py-10">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-12">
          {/* Desktop and mobile filter sidebar */}
          <div className="md:col-span-4 lg:col-span-3">
            <FilterSidebar
              searchTerm={searchTerm}
              location={location}
              selectedWorkTypes={selectedWorkTypes}
              selectedExperienceLevels={selectedExperienceLevels}
              minimumSalary={minimumSalary}
              onSearchChange={(value) => {
                setSearchTerm(value);
                setCurrentPage(1);
              }}
              onLocationChange={(value) => {
                setLocation(value);
                setCurrentPage(1);
              }}
              onWorkTypeToggle={toggleWorkType}
              onExperienceToggle={toggleExperienceLevel}
              onMinimumSalaryChange={(value) => {
                setMinimumSalary(value);
                setCurrentPage(1);
              }}
              onClearFilters={clearFilters}
            />
          </div>

          {/* Main job results area */}
          <section className="md:col-span-8 lg:col-span-9">
            {/* Results heading and sorting control */}
            <div className="mb-5 flex flex-col gap-4 border-b border-[#E0BFBF] pb-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Available Jobs in Toronto
                </h1>

                <p className="mt-1 text-gray-600">
                  Showing {filteredJobs.length} role
                  {filteredJobs.length !== 1 ? "s" : ""} matching your
                  criteria
                </p>
              </div>

              <div className="flex items-center gap-2">
                <label
                  htmlFor="sort-jobs"
                  className="text-sm text-gray-600"
                >
                  Sort by:
                </label>

                <select
                  id="sort-jobs"
                  value={sortOption}
                  onChange={(event) => {
                    setSortOption(event.target.value);
                    setCurrentPage(1);
                  }}
                  className="rounded-lg border border-[#E0BFBF] bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-[#800020]"
                >
                  <option value="relevant">Most Relevant</option>
                  <option value="newest">Date Posted</option>
                  <option value="salary">Highest Salary</option>
                </select>
              </div>
            </div>

            {/* Job cards or empty result state */}
            <div className="space-y-4">
              {visibleJobs.length === 0 ? (
                <EmptyState
                  icon="search_off"
                  title="No jobs found"
                  description="Try changing your keyword, location, work type, experience level, or minimum salary."
                  actionLabel="Clear Filters"
                  onAction={clearFilters}
                />
              ) : (
                visibleJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))
              )}
            </div>

            {/* Pagination controls */}
            {filteredJobs.length > jobsPerPage && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </section>
        </div>
      </main>

      {/* Global website footer */}
      <Footer />
    </>
  );
}