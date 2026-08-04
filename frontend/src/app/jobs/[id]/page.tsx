import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { jobs } from "@/data/jobs";

type JobDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

// Displays the detail page for one selected job
export default async function JobDetailPage({
  params,
}: JobDetailPageProps) {
  // Reads the dynamic job ID from the URL
  const { id } = await params;

  // Finds the matching job from temporary mock data
  const job = jobs.find((item) => item.id === Number(id));

  // Displays a fallback page when no matching job exists
  if (!job) {
    return (
      <>
        <Header />

        <main className="min-h-screen bg-[#FBF9F7] px-6 py-20">
          <div className="mx-auto max-w-5xl">
            <h1 className="text-3xl font-bold text-gray-900">
              Job not found
            </h1>

            <Link
              href="/jobs"
              className="mt-8 inline-block rounded-lg bg-[#800020] px-5 py-3 text-white transition hover:bg-[#570013]"
            >
              Back to Jobs
            </Link>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#FBF9F7] px-6 py-10">
        <div className="mx-auto max-w-5xl">
          {/* Company name */}
          <p className="font-semibold text-[#800020]">
            {job.company}
          </p>

          {/* Job title */}
          <h1 className="mt-2 text-4xl font-bold text-gray-900 md:text-5xl">
            {job.title}
          </h1>

          {/* Main job information */}
          <div className="mt-6 flex flex-wrap gap-5 text-gray-600">
            <span>{job.location}</span>
            <span>{job.workType}</span>
            <span>{job.experienceLevel}</span>
            <span>
              ${job.salaryMin.toLocaleString()} – $
              {job.salaryMax.toLocaleString()}
            </span>
          </div>

          {/* Required skills */}
          <section className="mt-10">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">
              Required Skills
            </h2>

            <div className="flex flex-wrap gap-3">
              {job.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-[#F7EDEE] px-4 py-2 text-[#800020]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>

          {/* Temporary job description */}
          <section className="mt-12 rounded-xl border border-[#E0BFBF] bg-white p-8 shadow-sm">
            <h2 className="mb-5 text-2xl font-semibold text-gray-900">
              Job Description
            </h2>

            <p className="leading-8 text-gray-700">
              This is a temporary job description. This section will
              later receive real job information from the HireScope
              backend API.
            </p>
          </section>

          {/* Job action buttons */}
          <div className="mt-10 flex flex-wrap gap-4">
            <button
              type="button"
              className="rounded-lg bg-[#800020] px-8 py-4 text-white transition hover:bg-[#570013]"
            >
              Apply Now
            </button>

            <button
              type="button"
              className="rounded-lg border border-[#800020] px-8 py-4 text-[#800020] transition hover:bg-[#F7EDEE]"
            >
              Save Job
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}