import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JobCard from "@/components/JobCard";
import { jobs } from "@/data/jobs";

// Displays all jobs currently marked as bookmarked
export default function BookmarksPage() {
  // Filters temporary mock data to show only bookmarked jobs
  const bookmarkedJobs = jobs.filter((job) => job.bookmarked);

  return (
    <>
      {/* Global website header */}
      <Header />

      <main className="min-h-screen bg-[#FBF9F7] px-6 py-10">
        <div className="mx-auto max-w-6xl">
          {/* Page heading */}
          <section className="mb-8">
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-[#800020]">
              Saved Opportunities
            </p>

            <h1 className="mt-2 text-4xl font-bold text-gray-900">
              Bookmarked Jobs
            </h1>

            <p className="mt-3 max-w-2xl text-gray-600">
              Review the job opportunities you saved for later.
            </p>
          </section>

          {/* Bookmarked job count */}
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                Saved Jobs
              </h2>

              <p className="mt-1 text-sm text-gray-600">
                {bookmarkedJobs.length} saved job
                {bookmarkedJobs.length !== 1 ? "s" : ""}
              </p>
            </div>

            <a
              href="/jobs"
              className="rounded-lg border border-[#800020] px-4 py-2 text-sm font-medium text-[#800020] transition hover:bg-[#F7EDEE]"
            >
              Browse Jobs
            </a>
          </div>

          {/* Bookmarked job list */}
          <section className="grid gap-5">
            {bookmarkedJobs.length === 0 ? (
              /* Empty state shown when no jobs are bookmarked */
              <div className="rounded-xl border border-[#E0BFBF] bg-white p-12 text-center shadow-sm">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F7EDEE] text-2xl text-[#800020]">
                  ☆
                </div>

                <h2 className="mt-5 text-2xl font-semibold text-gray-900">
                  No bookmarked jobs yet
                </h2>

                <p className="mx-auto mt-2 max-w-md text-gray-500">
                  Save interesting job opportunities and return to them
                  later from this page.
                </p>

                <a
                  href="/jobs"
                  className="mt-6 inline-block rounded-lg bg-[#800020] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#570013]"
                >
                  Explore Jobs
                </a>
              </div>
            ) : (
              /* Renders each bookmarked job */
              bookmarkedJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))
            )}
          </section>
        </div>
      </main>

      {/* Global website footer */}
      <Footer />
    </>
  );
}