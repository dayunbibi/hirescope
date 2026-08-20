import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JobCard from "@/components/JobCard";
import type { Company } from "@/data/companies";
import type { Job } from "@/data/jobs";
import { getCompanies, getJobs } from "@/lib/api";

type CompanyDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

// Formats a salary value into a short display format
function formatSalary(salary: number | null) {
  if (salary === null) {
    return "Not disclosed";
  }

  return `$${Math.round(salary / 1000)}k`;
}

// Converts incomplete backend values into cleaner display text
function formatCompanyValue(
  value: string,
  fallback: string
) {
  if (!value || value === "Unknown") {
    return fallback;
  }

  return value;
}

// Displays detailed information about one selected company
export default async function CompanyDetailPage({
  params,
}: CompanyDetailPageProps) {
  // Reads the company ID from the dynamic URL
  const { id } = await params;

  // Fetches companies and jobs from the backend API
  let companies: Company[] = [];
  let allJobs: Job[] = [];

  try {
    [companies, allJobs] = await Promise.all([
      getCompanies(),
      getJobs(),
    ]);
  } catch {
    companies = [];
    allJobs = [];
  }

  // Finds the matching company from the fetched companies
  const company = companies.find(
    (item) => item.id === Number(id)
  );

  // Displays a fallback page when the company does not exist
  if (!company) {
    return (
      <>
        <Header />

        <main className="min-h-screen bg-[#FBF9F7] px-5 py-20">
          <section className="mx-auto max-w-5xl rounded-xl border border-[#E0BFBF] bg-white p-12 text-center shadow-sm">
            <h1 className="text-3xl font-bold text-gray-900">
              Company not found
            </h1>

            <p className="mt-3 text-gray-500">
              The requested company profile could not be found.
            </p>

            <Link
              href="/companies"
              className="mt-7 inline-flex items-center gap-2 rounded-lg bg-[#800020] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#570013] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#800020]/30"
            >
              <span className="material-symbols-outlined text-[18px]">
                arrow_back
              </span>

              Back to Companies
            </Link>
          </section>
        </main>

        <Footer />
      </>
    );
  }

  // Finds jobs connected to the selected company
  const companyJobs = allJobs.filter(
    (job) =>
      job.company.toLowerCase() ===
      company.name.toLowerCase()
  );

  // Temporary hiring trend values used before backend analytics integration
  const hiringTrend = [35, 50, 42, 68, 75, 90];

  const displayIndustry = formatCompanyValue(
    company.industry,
    "Industry not available"
  );

  const displayLocation = formatCompanyValue(
    company.location,
    "Location not available"
  );

  const displaySize = formatCompanyValue(
    company.size,
    "Size not available"
  );

  const displayDescription =
    company.description.trim() !== ""
      ? company.description
      : "A detailed company description is not currently available. More information will appear here as the HireScope backend collects additional company data.";

  return (
    <>
      {/* Global website header */}
      <Header />

      <main className="min-h-screen bg-[#FBF9F7] px-5 py-10">
        <div className="mx-auto max-w-6xl">
          {/* Back navigation */}
          <Link
            href="/companies"
            className="inline-flex items-center gap-2 rounded text-sm font-medium text-[#800020] transition hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#800020]/30"
          >
            <span className="material-symbols-outlined text-[18px]">
              arrow_back
            </span>

            All Companies
          </Link>

          {/* Company summary card */}
          <section className="mt-6 rounded-xl border border-[#E0BFBF] bg-white p-6 shadow-sm md:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div className="flex items-start gap-5">
                {/* Temporary company logo */}
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl border border-[#E0BFBF] bg-[#F5F3F1] text-3xl font-bold text-[#800020]">
                  {company.name.charAt(0)}
                </div>

                <div>
                  {/* Company name */}
                  <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                    {company.name}
                  </h1>

                  {/* Company metadata */}
                  <div className="mt-4 flex flex-wrap gap-x-6 gap-y-3 text-sm text-gray-600">
                    {/* Industry */}
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-[#800020]">
                        domain
                      </span>

                      <span>{displayIndustry}</span>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-[#800020]">
                        location_on
                      </span>

                      <span>{displayLocation}</span>
                    </div>

                    {/* Company size */}
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-[#800020]">
                        groups
                      </span>

                      <span>{displaySize}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Temporary company action button */}
              <button
                type="button"
                disabled
                className="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-lg bg-gray-200 px-6 py-3 text-sm font-medium text-gray-500"
              >
                <span className="material-symbols-outlined text-[18px]">
                  open_in_new
                </span>

                Website unavailable
              </button>
            </div>
          </section>

          {/* Main company content */}
          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            {/* Main information column */}
            <section className="space-y-6 lg:col-span-2">
              {/* Company overview */}
              <article className="rounded-xl border border-[#E0BFBF] bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold tracking-tight text-gray-900">
                  Company Overview
                </h2>

                <p className="mt-4 leading-7 text-gray-600">
                  {displayDescription}
                </p>
              </article>

              {/* Technology stack */}
              <article className="rounded-xl border border-[#E0BFBF] bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold tracking-tight text-gray-900">
                  Popular Technologies
                </h2>

                {company.technologies.length > 0 ? (
                  <div className="mt-5 flex flex-wrap gap-3">
                    {company.technologies.map(
                      (technology) => (
                        <span
                          key={technology}
                          className="rounded-lg bg-[#F7EDEE] px-4 py-2 text-sm font-medium text-[#800020]"
                        >
                          {technology}
                        </span>
                      )
                    )}
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-gray-500">
                    Technology information is not currently available.
                  </p>
                )}
              </article>

              {/* Hiring trend */}
              <article className="rounded-xl border border-[#E0BFBF] bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold tracking-tight text-gray-900">
                  Hiring Trend
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  Temporary hiring activity visualization
                </p>

                {/* Temporary hiring trend chart */}
                <div className="mt-8 flex h-52 items-end gap-3 rounded-lg bg-[#F5F3F1] p-5">
                  {hiringTrend.map(
                    (height, index) => (
                      <div
                        key={index}
                        className="flex h-full flex-1 items-end"
                      >
                        <div
                          className="w-full rounded-t-md bg-[#800020] transition hover:bg-[#570013]"
                          style={{
                            height: `${height}%`,
                          }}
                          title={`Month ${
                            index + 1
                          }: ${height}%`}
                        />
                      </div>
                    )
                  )}
                </div>

                <div className="mt-3 flex justify-between text-xs text-gray-500">
                  <span>6 months ago</span>
                  <span>Current</span>
                </div>
              </article>
            </section>

            {/* Company statistics sidebar */}
            <aside className="space-y-6">
              {/* Company statistics */}
              <article className="rounded-xl border border-[#E0BFBF] bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold tracking-tight text-gray-900">
                  Company Statistics
                </h2>

                <div className="mt-6 space-y-5">
                  {/* Open jobs */}
                  <div className="flex items-center justify-between border-b border-[#E4E2E0] pb-4">
                    <span className="text-sm text-gray-500">
                      Open Jobs
                    </span>

                    <span className="text-xl font-bold text-[#800020]">
                      {company.openJobs}
                    </span>
                  </div>

                  {/* Average salary */}
                  <div className="flex items-center justify-between border-b border-[#E4E2E0] pb-4">
                    <span className="text-sm text-gray-500">
                      Average Salary
                    </span>

                    <span className="text-xl font-bold text-gray-900">
                      {formatSalary(
                        company.averageSalary
                      )}
                    </span>
                  </div>

                  {/* Company size */}
                  <div className="flex items-center justify-between gap-5">
                    <span className="text-sm text-gray-500">
                      Company Size
                    </span>

                    <span className="text-right font-semibold text-gray-900">
                      {displaySize}
                    </span>
                  </div>
                </div>
              </article>

              {/* Company location */}
              <article className="rounded-xl border border-[#E0BFBF] bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold tracking-tight text-gray-900">
                  Location
                </h2>

                <div className="mt-5 flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#800020]">
                    location_on
                  </span>

                  <div>
                    <p className="font-medium text-gray-900">
                      {displayLocation}
                    </p>

                    {company.location !==
                      "Unknown" && (
                      <p className="mt-1 text-sm text-gray-500">
                        Toronto and Greater Toronto Area
                      </p>
                    )}
                  </div>
                </div>
              </article>
            </aside>
          </div>

          {/* Company job listings */}
          <section className="mt-10">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold tracking-tight text-gray-900">
                  Open Positions
                </h2>

                <p className="mt-2 text-gray-600">
                  {companyJobs.length} matching job
                  {companyJobs.length !== 1
                    ? "s"
                    : ""}{" "}
                  currently available
                </p>
              </div>

              <Link
                href="/jobs"
                className="inline-flex items-center gap-2 rounded text-sm font-medium text-[#800020] transition hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#800020]/30"
              >
                Browse All Jobs

                <span className="material-symbols-outlined text-[18px]">
                  arrow_forward
                </span>
              </Link>
            </div>

            {companyJobs.length > 0 ? (
              <div className="mt-6 grid gap-5">
                {companyJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                  />
                ))}
              </div>
            ) : (
              <div className="mt-6 rounded-xl border border-[#E0BFBF] bg-white p-10 text-center shadow-sm">
                <span className="material-symbols-outlined text-[40px] text-[#800020]">
                  work_off
                </span>

                <h3 className="mt-4 text-xl font-semibold text-gray-900">
                  No matching positions yet
                </h3>

                <p className="mt-2 text-gray-500">
                  No current jobs from this company were found in the
                  HireScope database.
                </p>

                <Link
                  href="/jobs"
                  className="mt-6 inline-block rounded-lg bg-[#800020] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#570013] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#800020]/30"
                >
                  Explore Other Jobs
                </Link>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Global website footer */}
      <Footer />
    </>
  );
}