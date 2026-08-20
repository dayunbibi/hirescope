"use client";

import { useEffect, useMemo, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CompanyCard from "@/components/CompanyCard";
import EmptyState from "@/components/EmptyState";
import LoadingCard from "@/components/LoadingCard";
import type { Company } from "@/data/companies";
import { getCompanies } from "@/lib/api";

export default function CompaniesPage() {
  // Stores the companies fetched from the backend API
  const [companies, setCompanies] = useState<Company[]>([]);

  // Tracks whether companies are still being fetched
  const [isLoading, setIsLoading] = useState(true);

  // Tracks whether the company fetch failed
  const [hasError, setHasError] = useState(false);

  // Fetches companies from the backend API on mount
  useEffect(() => {
    getCompanies()
      .then((fetchedCompanies) => {
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

  // Stores the company name search
  const [searchTerm, setSearchTerm] = useState("");

  // Stores the selected industry filter
  const [selectedIndustry, setSelectedIndustry] = useState("All");

  // Stores the selected company size filter
  const [selectedSize, setSelectedSize] = useState("All");

  // Stores the selected sort option
  const [sortOption, setSortOption] = useState("jobs");

  // Stores how many companies are currently visible
  const [visibleCount, setVisibleCount] = useState(3);

  // Creates reusable industry filter options
  const industries = [
    "All",
    ...Array.from(
      new Set(
        companies
          .map((company) => company.industry)
          .filter(Boolean)
      )
    ),
  ];

  // Clears all company filters
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedIndustry("All");
    setSelectedSize("All");
    setSortOption("jobs");
    setVisibleCount(3);
  };

  // Filters and sorts the company directory
  const filteredCompanies = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    const results = companies.filter((company) => {
      const matchesSearch =
        company.name.toLowerCase().includes(keyword) ||
        company.industry.toLowerCase().includes(keyword) ||
        company.technologies.some((technology) =>
          technology.toLowerCase().includes(keyword)
        );

      const matchesIndustry =
        selectedIndustry === "All" ||
        company.industry === selectedIndustry;

      const matchesSize =
        selectedSize === "All" ||
        company.size === selectedSize;

      return matchesSearch && matchesIndustry && matchesSize;
    });

    return [...results].sort((firstCompany, secondCompany) => {
      // Sorts companies by highest available average salary
      if (sortOption === "salary") {
        const firstSalary =
          firstCompany.averageSalary ?? 0;

        const secondSalary =
          secondCompany.averageSalary ?? 0;

        return secondSalary - firstSalary;
      }

      // Sorts companies alphabetically
      if (sortOption === "alphabetical") {
        return firstCompany.name.localeCompare(
          secondCompany.name
        );
      }

      // Default sorting uses the number of open jobs
      return (
        secondCompany.openJobs -
        firstCompany.openJobs
      );
    });
  }, [
    companies,
    searchTerm,
    selectedIndustry,
    selectedSize,
    sortOption,
  ]);

  // Limits how many company cards are shown
  const visibleCompanies =
    filteredCompanies.slice(0, visibleCount);

  return (
    <>
      {/* Global website header */}
      <Header />

      <main className="min-h-screen bg-[#FBF9F7] px-5 py-10">
        <div className="mx-auto max-w-6xl">
          {/* Page heading */}
          <section>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Companies Directory
            </h1>

            <p className="mt-2 text-lg text-gray-600">
              Discover top tech employers in Toronto.
            </p>
          </section>

          {/* Search and filter controls */}
          <section className="mt-6 rounded-lg border border-[#E0BFBF] bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row">
              {/* Company search input */}
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => {
                  setSearchTerm(event.target.value);
                  setVisibleCount(3);
                }}
                placeholder="Search companies by name..."
                className="min-w-0 flex-1 rounded-lg border border-[#E0BFBF] px-4 py-3 text-gray-900 outline-none transition focus:border-[#800020]"
              />

              {/* Industry filter */}
              <select
                value={selectedIndustry}
                onChange={(event) => {
                  setSelectedIndustry(
                    event.target.value
                  );
                  setVisibleCount(3);
                }}
                className="rounded-lg border border-[#E0BFBF] bg-white px-4 py-3 text-gray-700 outline-none transition focus:border-[#800020]"
              >
                {industries.map((industry) => (
                  <option
                    key={industry}
                    value={industry}
                  >
                    {industry === "All"
                      ? "All Industries"
                      : industry}
                  </option>
                ))}
              </select>

              {/* Company size filter */}
              <select
                value={selectedSize}
                onChange={(event) => {
                  setSelectedSize(event.target.value);
                  setVisibleCount(3);
                }}
                className="rounded-lg border border-[#E0BFBF] bg-white px-4 py-3 text-gray-700 outline-none transition focus:border-[#800020]"
              >
                <option value="All">
                  Company Size
                </option>

                <option value="Startup">
                  Startup
                </option>

                <option value="Mid-size">
                  Mid-size
                </option>

                <option value="Enterprise">
                  Enterprise
                </option>

                <option value="Unknown">
                  Unknown
                </option>
              </select>

              {/* Clears all active filters */}
              <button
                type="button"
                onClick={clearFilters}
                className="rounded-lg bg-[#800020] px-8 py-3 font-medium text-white transition hover:bg-[#570013] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#800020]/30"
              >
                Clear Filters
              </button>
            </div>
          </section>

          {/* Result count and sorting */}
          <section className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-600">
              Showing {filteredCompanies.length}{" "}
              compan
              {filteredCompanies.length === 1
                ? "y"
                : "ies"}
            </p>

            <div className="flex items-center gap-2">
              <label
                htmlFor="company-sort"
                className="text-sm text-gray-500"
              >
                Sort by:
              </label>

              <select
                id="company-sort"
                value={sortOption}
                onChange={(event) =>
                  setSortOption(event.target.value)
                }
                className="rounded border-none bg-transparent text-sm font-medium text-[#800020] outline-none focus-visible:ring-2 focus-visible:ring-[#800020]/30"
              >
                <option value="jobs">
                  Most Open Jobs
                </option>

                <option value="salary">
                  Highest Average Salary
                </option>

                <option value="alphabetical">
                  Alphabetical
                </option>
              </select>
            </div>
          </section>

          {/* Company directory, loading skeletons, or empty/error state */}
          {isLoading ? (
            <section className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <LoadingCard />
              <LoadingCard />
              <LoadingCard />
            </section>
          ) : hasError ? (
            <div className="mt-6">
              <EmptyState
                icon="cloud_off"
                title="Couldn't load companies"
                description="We couldn't reach the HireScope API. Make sure the backend is running and try again."
              />
            </div>
          ) : filteredCompanies.length > 0 ? (
            <section className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {visibleCompanies.map((company) => (
                <CompanyCard
                  key={company.id}
                  company={company}
                />
              ))}
            </section>
          ) : (
            <div className="mt-6">
              <EmptyState
                icon="domain_disabled"
                title="No companies found"
                description="Try changing your company name, industry, or company size filters."
                actionLabel="Clear Filters"
                onAction={clearFilters}
              />
            </div>
          )}

          {/* Load more button */}
          {!isLoading &&
            !hasError &&
            visibleCount <
              filteredCompanies.length && (
              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  onClick={() =>
                    setVisibleCount(
                      (count) => count + 3
                    )
                  }
                  className="rounded-lg border border-[#E0BFBF] bg-white px-12 py-3 text-gray-600 transition hover:border-[#800020] hover:text-[#800020] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#800020]/30"
                >
                  Load More Companies
                </button>
              </div>
            )}
        </div>
      </main>

      {/* Global website footer */}
      <Footer />
    </>
  );
}