import type { Job } from "@/data/jobs";

type JobCardProps = {
  job: Job;
};

// Displays one job posting card
export default function JobCard({ job }: JobCardProps) {
  return (
    <article className="rounded-xl border border-[#E0BFBF] bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="flex flex-col justify-between gap-4 md:flex-row">
        {/* Job information */}
        <div>
          <p className="text-sm font-medium text-[#800020]">
            {job.company}
          </p>

          <h2 className="mt-1 text-xl font-semibold text-gray-900">
            {job.title}
          </h2>

          <p className="mt-2 text-gray-600">
            {job.location} · {job.workType}
          </p>

          {/* Technology skill tags */}
          <div className="mt-4 flex flex-wrap gap-2">
            {job.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-[#F7EDEE] px-3 py-1 text-sm text-[#570013]"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Future job detail page button */}
        <button
          type="button"
          className="h-fit rounded-lg bg-[#800020] px-5 py-3 text-white transition hover:bg-[#570013]"
        >
          View Job
        </button>
      </div>
    </article>
  );
}