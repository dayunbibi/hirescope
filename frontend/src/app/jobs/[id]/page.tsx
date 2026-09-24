import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JobBookmarkButton from "@/components/JobBookmarkButton";
import type { Job } from "@/data/jobs";
import { getJob, getJobs } from "@/lib/api";
import { formatPostedDate } from "@/lib/format";

type JobDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

// Formats one salary value
function formatSalary(salary: number | null) {
  if (salary === null) {
    return "N/A";
  }

  return `$${Math.round(salary / 1000)}k`;
}

// Formats the full salary range safely
function formatSalaryRange(
  salaryMin: number | null,
  salaryMax: number | null
) {
  // No salary information is available
  if (salaryMin === null && salaryMax === null) {
    return "Salary not disclosed";
  }

  // Only the maximum salary is available
  if (salaryMin === null) {
    return `Up to ${formatSalary(salaryMax)}`;
  }

  // Only the minimum salary is available
  if (salaryMax === null) {
    return `From ${formatSalary(salaryMin)}`;
  }

  // Full salary range is available
  return `${formatSalary(salaryMin)} – ${formatSalary(salaryMax)}`;
}

// Displays the detailed page for one selected job
export default async function JobDetailPage({
  params,
}: JobDetailPageProps) {
  // Reads the job ID from the dynamic URL
  const { id } = await params;

  // Fetches the selected job and full job list from the backend API
  let job: Job | null = null;
  let allJobs: Job[] = [];

  try {
    [job, allJobs] = await Promise.all([
      getJob(Number(id)),
      getJobs(),
    ]);
  } catch {
    job = null;
    allJobs = [];
  }

  // Displays a fallback page when the job does not exist
  if (!job) {
    return (
      <>
        <Header />

        <main className="min-h-screen bg-[#FBF9F7] px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <section className="rounded-xl border border-[#E0BFBF] bg-white p-10 text-center shadow-sm">
              <h1 className="text-3xl font-bold text-gray-900">
                Job not found
              </h1>

              <p className="mt-3 text-gray-500">
                The requested job posting could not be found.
              </p>

              <Link
                href="/jobs"
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#800020] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#570013] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#800020]/30"
              >
                <span className="material-symbols-outlined text-[18px]">
                  arrow_back
                </span>

                Back to Jobs
              </Link>
            </section>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  // Finds related jobs while excluding the current job
  const relatedJobs = allJobs
    .filter(
      (item) =>
        item.id !== job.id &&
        (item.workType === job.workType ||
          item.skills.some((skill) =>
            job.skills.includes(skill)
          ))
    )
    .slice(0, 3);

  return (
    <>
      {/* Global website header */}
      <Header />

      <main className="min-h-screen bg-[#FBF9F7] px-5 py-10">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-12">
          {/* Main job detail column */}
          <section className="flex flex-col gap-6 lg:col-span-8">
            {/* Job summary card */}
            <article className="rounded-xl border border-[#E0BFBF] bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-5">
                <div className="min-w-0">
                  {/* Job title */}
                  <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
                    {job.title}
                  </h1>

                  {/* Company name */}
                  <p className="mt-2 text-lg text-gray-600">
                    {job.company}
                  </p>
                </div>

                {/* Temporary company logo */}
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border border-[#E0BFBF] bg-[#F5F3F1] text-2xl font-bold text-[#800020]">
                  {job.company.charAt(0)}
                </div>
              </div>

              {/* Main job metadata */}
              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm text-gray-600">
                {/* Location */}
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-[#800020]">
                    location_on
                  </span>

                  <span>
                    {job.location} ({job.workType})
                  </span>
                </div>

                {/* Salary */}
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-[#800020]">
                    payments
                  </span>

                  <span>
                    {formatSalaryRange(
                      job.salaryMin,
                      job.salaryMax
                    )}
                  </span>
                </div>

                {/* Experience level */}
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-[#800020]">
                    monitoring
                  </span>

                  <span>{job.experienceLevel}</span>
                </div>
              </div>

              {/* Main job actions */}
              <div className="mt-7 flex flex-wrap gap-3">
                {/* Opens the original job posting */}
                {job.sourceUrl ? (
                  <a
                    href={job.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-[#800020] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#570013] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#800020]/30"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      open_in_new
                    </span>

                    View Original Posting
                  </a>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="inline-flex cursor-not-allowed items-center gap-2 rounded-lg bg-gray-300 px-6 py-3 text-sm font-medium text-gray-600"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      open_in_new
                    </span>

                    Original posting unavailable
                  </button>
                )}

                {/* Interactive bookmark button */}
                <JobBookmarkButton jobId={job.id} />
              </div>
            </article>

            {/* Job overview built from collected posting data */}
            <article className="rounded-xl border border-[#E0BFBF] bg-white p-6 shadow-sm">
              <h2 className="border-b border-[#E4E2E0] pb-4 text-lg font-semibold tracking-tight text-gray-900">
                Job Overview
              </h2>

              <dl className="mt-6 grid gap-5 sm:grid-cols-2">
                {[
                  { label: "Work Type", value: job.workType },
                  { label: "Experience Level", value: job.experienceLevel },
                  {
                    label: "Salary",
                    value: formatSalaryRange(job.salaryMin, job.salaryMax),
                  },
                  { label: "Posted", value: formatPostedDate(job.postedAt) },
                ].map((detail) => (
                  <div key={detail.label}>
                    <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      {detail.label}
                    </dt>

                    <dd className="mt-1 text-base font-medium text-gray-900">
                      {detail.value}
                    </dd>
                  </div>
                ))}
              </dl>

              <p className="mt-6 text-sm leading-6 text-gray-500">
                {job.sourceUrl
                  ? "The full job description, responsibilities, and benefits are available on the original posting."
                  : "A full job description is not available for this posting."}
              </p>

              {/* Technology stack */}
              <section className="mt-8 border-t border-[#E4E2E0] pt-6">
                <h3 className="text-base font-semibold text-gray-900">
                  Tech Stack
                </h3>

                {job.skills.length > 0 ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {job.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-md bg-[#E4E2E0] px-3 py-1.5 text-sm text-gray-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-gray-500">
                    No technology stack information available.
                  </p>
                )}
              </section>
            </article>
          </section>

          {/* Job detail sidebar */}
          <aside className="flex flex-col gap-6 lg:col-span-4">
            {/* Company information card */}
            <article className="rounded-xl border border-[#E0BFBF] bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold tracking-tight text-gray-900">
                About {job.company}
              </h2>

              <p className="mt-4 leading-7 text-gray-600">
                Company profile information will be expanded when
                additional company data is available from the backend.
              </p>

              <Link
                href="/companies"
                className="mt-5 inline-flex items-center gap-2 rounded text-sm font-medium text-[#800020] transition hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#800020]/30"
              >
                View Companies

                <span className="material-symbols-outlined text-[18px]">
                  arrow_forward
                </span>
              </Link>
            </article>

            {/* Related jobs */}
            <article className="rounded-xl border border-[#E0BFBF] bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold tracking-tight text-gray-900">
                Related Jobs
              </h2>

              <div className="mt-5 space-y-3">
                {relatedJobs.length > 0 ? (
                  relatedJobs.map((relatedJob) => (
                    <Link
                      key={relatedJob.id}
                      href={`/jobs/${relatedJob.id}`}
                      className="block rounded-lg border border-transparent p-4 transition hover:border-[#E0BFBF] hover:bg-[#FBF9F7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#800020]/30"
                    >
                      {/* Related job title */}
                      <h3 className="font-semibold text-gray-900 transition hover:text-[#800020]">
                        {relatedJob.title}
                      </h3>

                      {/* Related company */}
                      <p className="mt-1 text-sm text-gray-500">
                        {relatedJob.company}
                      </p>

                      {/* Related job metadata */}
                      <div className="mt-3 flex flex-col gap-2 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[15px]">
                            location_on
                          </span>

                          <span>{relatedJob.location}</span>
                        </div>

                        <div className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[15px]">
                            payments
                          </span>

                          <span>
                            {formatSalaryRange(
                              relatedJob.salaryMin,
                              relatedJob.salaryMax
                            )}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">
                    No related jobs are currently available.
                  </p>
                )}
              </div>
            </article>
          </aside>
        </div>
      </main>

      {/* Global website footer */}
      <Footer />
    </>
  );
}