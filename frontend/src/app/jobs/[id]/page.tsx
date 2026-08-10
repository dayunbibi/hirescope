import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Job } from "@/data/jobs";
import { getJob, getJobs } from "@/lib/api";

type JobDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

// Formats a salary number into a short display value
function formatSalary(salary: number | null) {
  if (salary === null) return "N/A";
  return `$${Math.round(salary / 1000)}k`;
}

// Temporary detailed content used before the backend API is connected
const jobDetails = {
  description:
    "We are seeking a highly skilled developer to help build modern, accessible, and data-driven products. You will collaborate with designers, backend developers, and product stakeholders to deliver reliable user experiences.",

  responsibilities: [
    "Develop responsive and interactive frontend applications.",
    "Build reusable components using React, Next.js, and TypeScript.",
    "Collaborate with designers to create accurate and accessible interfaces.",
    "Improve application performance and maintain code quality.",
    "Participate in code reviews and technical planning.",
  ],

  qualifications: [
    "Professional experience in software or frontend development.",
    "Strong knowledge of React, TypeScript, and modern JavaScript.",
    "Experience building responsive and accessible interfaces.",
    "Understanding of API integration and version control.",
    "Strong communication and problem-solving skills.",
  ],

  benefits: [
    "Health and dental benefits.",
    "Flexible work arrangements.",
    "Professional development support.",
    "Paid vacation and personal days.",
    "Modern collaborative work environment.",
  ],
};

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
    [job, allJobs] = await Promise.all([getJob(Number(id)), getJobs()]);
  } catch {
    job = null;
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
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#800020] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#570013]"
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
          item.skills.some((skill) => job.skills.includes(skill)))
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
                <div>
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
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-[#800020]">
                    location_on
                  </span>

                  <span>
                    {job.location} ({job.workType})
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-[#800020]">
                    payments
                  </span>

                  <span>
                    {formatSalary(job.salaryMin)} –{" "}
                    {formatSalary(job.salaryMax)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-[#800020]">
                    work
                  </span>

                  <span>Full-time</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-[#800020]">
                    monitoring
                  </span>

                  <span>{job.experienceLevel}</span>
                </div>
              </div>

              {/* Main job actions */}
              <div className="mt-7 flex flex-wrap gap-3">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#800020] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#570013]"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    open_in_new
                  </span>
                  Apply Now
                </button>

                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-lg border border-[#800020] px-6 py-3 text-sm font-medium text-[#800020] transition hover:bg-[#F7EDEE]"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    bookmark_border
                  </span>
                  Save Job
                </button>
              </div>
            </article>

            {/* Full job description */}
            <article className="rounded-xl border border-[#E0BFBF] bg-white p-6 shadow-sm">
              <h2 className="border-b border-[#E4E2E0] pb-4 text-2xl font-semibold text-gray-900">
                Job Description
              </h2>

              <div className="mt-6 space-y-7 text-gray-700">
                {/* Overview description */}
                <p className="leading-7">{jobDetails.description}</p>

                {/* Responsibilities section */}
                <section>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Responsibilities
                  </h3>

                  <ul className="mt-3 list-disc space-y-2 pl-5 leading-7">
                    {jobDetails.responsibilities.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>

                {/* Qualifications section */}
                <section>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Qualifications
                  </h3>

                  <ul className="mt-3 list-disc space-y-2 pl-5 leading-7">
                    {jobDetails.qualifications.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>

                {/* Benefits section */}
                <section>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Benefits
                  </h3>

                  <ul className="mt-3 list-disc space-y-2 pl-5 leading-7">
                    {jobDetails.benefits.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>
              </div>

              {/* Technology stack */}
              <section className="mt-8 border-t border-[#E4E2E0] pt-6">
                <h3 className="text-base font-semibold text-gray-900">
                  Tech Stack
                </h3>

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
              </section>
            </article>
          </section>

          {/* Job detail sidebar */}
          <aside className="flex flex-col gap-6 lg:col-span-4">
            {/* Company information card */}
            <article className="rounded-xl border border-[#E0BFBF] bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900">
                About {job.company}
              </h2>

              <p className="mt-4 leading-7 text-gray-600">
                {job.company} is a technology-focused organization
                building modern digital products and services. This
                temporary company description will later come from the
                HireScope backend API.
              </p>

              <Link
                href="/companies"
                className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[#800020] transition hover:underline"
              >
                View Company Profile
                <span className="material-symbols-outlined text-[18px]">
                  arrow_forward
                </span>
              </Link>
            </article>

            {/* Related job recommendations */}
            <article className="rounded-xl border border-[#E0BFBF] bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900">
                Related Jobs
              </h2>

              <div className="mt-5 space-y-3">
                {relatedJobs.length > 0 ? (
                  relatedJobs.map((relatedJob) => (
                    <Link
                      key={relatedJob.id}
                      href={`/jobs/${relatedJob.id}`}
                      className="block rounded-lg border border-transparent p-4 transition hover:border-[#E0BFBF] hover:bg-[#FBF9F7]"
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
                      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
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
                            {formatSalary(relatedJob.salaryMin)} –{" "}
                            {formatSalary(relatedJob.salaryMax)}
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