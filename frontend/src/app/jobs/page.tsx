"use client";

import { useEffect, useMemo, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FilterSidebar from "@/components/FilterSidebar";
import JobCard from "@/components/JobCard";
import LoadingCard from "@/components/LoadingCard";
import Pagination from "@/components/Pagination";
import EmptyState from "@/components/EmptyState";
import type { Job } from "@/data/jobs";
import { getJobs } from "@/lib/api";

const jobsPerPage = 3;

export default function JobsPage() {
  // Stores the jobs fetched from the backend API
  const [jobs, setJobs] = useState<Job[]>([]);

  // Tracks whether jobs are still being fetched
  const [isLoading, setIsLoading] = useState(true);

  // Tracks whether the job fetch failed
  const [hasError, setHasError] = useState(false);

  // Fetches jobs from the backend API on mount
  useEffect(() => {
    getJobs()
      .then((fetchedJobs) => {
        setJobs(fetchedJobs);
        setHasError(false);
      })
      .catch(() => {
        setHasError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

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

      // Jobs without salary data are still shown instead of being removed
      const matchesSalary =
        job.salaryMax === null ||
        job.salaryMax >= minimumSalary;

      return (
        matchesKeyword &&
        matchesLocation &&
        matchesWorkType &&
        matchesExperience &&
        matchesSalary
      );
    });

    return [...matchingJobs].sort((firstJob, secondJob) => {
      // Sorts jobs from highest to lowest available maximum salary
      if (sortOption === "salary") {
        const firstSalary = firstJob.salaryMax ?? 0;
        const secondSalary = secondJob.salaryMax ?? 0;

        return secondSalary - firstSalary;
      }

      // Temporary newest sorting based on job ID
      if (sortOption === "newest") {
        return secondJob.id - firstJob.id;
      }

      // Default temporary relevance sorting
      return firstJob.id - secondJob.id;
    });
  }, [
    jobs,
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

            {/* Job cards, loading skeletons, or empty/error state */}
            <div className="space-y-4">
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
            {!isLoading &&
              !hasError &&
              filteredJobs.length > jobsPerPage && (
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