import Link from "next/link";
import CompanyFacts from "@/components/CompanyFacts";
import JobBoard, { lineColor } from "@/components/JobRow";
import JobBookmarkButton from "@/components/JobBookmarkButton";
import { ErrorBlock } from "@/components/StateBlocks";
import type { Company } from "@/data/companies";
import type { Job } from "@/data/jobs";
import { getCompanies, getJob, getJobs } from "@/lib/api";
import { getStation, getStationName } from "@/lib/area";
import { formatPostedDate, formatSalaryRange } from "@/lib/format";

type JobDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const hasSalary = (job: Job) => job.salaryMin !== null || job.salaryMax !== null;

// Hostname of the original posting, e.g. "boards.greenhouse.io"
function sourceHost(sourceUrl: string) {
  try {
    return new URL(sourceUrl).hostname.replace(/^www\./, "");
  } catch {
    return "the original site";
  }
}

// Ticket cell dividers: a 2×2 grid on mobile, one row of 4 from md up
const overviewBorders = [
  "border-b border-r md:border-b-0",
  "border-b md:border-b-0 md:border-r",
  "border-r",
  "",
];

const backLinkClassName =
  "inline-flex h-11 items-center rounded-full border-[1.5px] border-hairline-strong bg-card px-4 text-sm font-semibold text-ink hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";

function BackToJobs() {
  return (
    <div className="px-4 pt-5 md:px-12">
      <Link href="/jobs" className={backLinkClassName}>
        ← Back to jobs
      </Link>
    </div>
  );
}

// "View original posting ↗", or a disabled dashed button when there is no link
function OriginalPostingAction({ job, className }: { job: Job; className: string }) {
  if (job.sourceUrl) {
    return (
      <a
        href={job.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`flex items-center justify-center gap-2.5 rounded-full bg-ink font-extrabold text-white hover:bg-ink/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${className}`}
      >
        View original posting <span aria-hidden="true">↗</span>
      </a>
    );
  }

  return (
    <button
      type="button"
      disabled
      aria-describedby="no-link-note"
      className={`flex cursor-not-allowed items-center justify-center rounded-full border-[1.5px] border-dashed border-[#b5b4ad] bg-[#e2e1db] font-extrabold text-muted-2 ${className}`}
    >
      Original posting unavailable
    </button>
  );
}

// Displays the detailed page for one selected job
export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { id } = await params;
  const jobId = Number(id);

  // The job itself decides the page state; jobs and companies only add context
  const [jobResult, jobsResult, companiesResult] = await Promise.allSettled([
    Number.isInteger(jobId) && jobId > 0 ? getJob(jobId) : Promise.resolve(null),
    getJobs(),
    getCompanies(),
  ]);

  if (jobResult.status === "rejected") {
    return (
      <main className="flex-1">
        <BackToJobs />
        <div className="px-4 pt-6 md:px-12">
          <ErrorBlock
            title="We couldn’t load this job."
            description="The HireScope API isn’t responding. If you bookmarked it, it’s still saved."
          />
        </div>
      </main>
    );
  }

  const job = jobResult.value;

  if (!job) {
    return (
      <main className="flex-1">
        <BackToJobs />
        <section className="mx-4 mt-6 flex flex-col items-start gap-3 rounded-2xl bg-ink px-5 py-8 text-paper md:mx-12 md:px-8 md:py-14">
          <p className="font-mono text-xs font-bold tracking-[0.12em] text-signal md:text-[13px]">
            NOT IN SERVICE
          </p>
          <h1 className="text-[22px] font-extrabold tracking-[-0.02em] md:text-[28px]">
            Job not found
          </h1>
          <p className="max-w-[520px] text-[15px] leading-normal text-board-muted md:text-base">
            This posting may have been removed, or the link is wrong.
          </p>
          <Link
            href="/jobs"
            className="mt-2 inline-flex h-11 items-center rounded-full bg-signal px-5 text-[15px] font-bold text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
          >
            Browse all jobs
          </Link>
        </section>
      </main>
    );
  }

  const allJobs = jobsResult.status === "fulfilled" ? jobsResult.value : [];
  const companies: Company[] =
    companiesResult.status === "fulfilled" ? companiesResult.value : [];

  const station = getStation(job.location);
  const placeName =
    station === "other" ? job.location || "Location unknown" : getStationName(station);

  const company = companies.find(
    (item) => item.name.trim().toLowerCase() === job.company.trim().toLowerCase()
  );
  const openRoles = allJobs.filter((item) => item.company === job.company).length;

  // Real share of fetched postings without a salary
  const noSalaryShare =
    allJobs.length > 0
      ? Math.round(
          (allJobs.filter((item) => !hasSalary(item)).length / allJobs.length) * 100
        )
      : null;

  // Market counts for the 10 most requested skills
  const skillCounts = new Map<string, number>();
  for (const item of allJobs) {
    for (const skill of item.skills) {
      skillCounts.set(skill, (skillCounts.get(skill) ?? 0) + 1);
    }
  }
  const topSkillCounts = new Map(
    [...skillCounts].sort((first, second) => second[1] - first[1]).slice(0, 10)
  );

  // Related jobs: same line or a shared skill, excluding this job
  const relatedJobs = allJobs
    .filter(
      (item) =>
        item.id !== job.id &&
        (item.workType === job.workType ||
          item.skills.some((skill) => job.skills.includes(skill)))
    )
    .slice(0, 3);

  const lineSwatch = lineColor[job.workType] ?? "bg-board-faint";
  const companyName = job.company || "Unknown company";
  const companyInitial = companyName.trim().charAt(0).toUpperCase();

  const overview = [
    {
      label: "WORK TYPE",
      value: (
        <span className="flex items-center gap-2 md:gap-2.5">
          <span aria-hidden="true" className={`size-[11px] rounded-full md:size-3.5 ${lineSwatch}`} />
          {job.workType}
        </span>
      ),
      className: "text-lg font-extrabold md:text-2xl",
    },
    {
      label: "EXPERIENCE",
      value: job.experienceLevel,
      className: "text-lg font-extrabold md:text-2xl",
    },
    {
      label: "SALARY · CAD",
      value: hasSalary(job) ? (
        formatSalaryRange(job.salaryMin, job.salaryMax)
      ) : (
        <>
          Not disclosed
          {noSalaryShare !== null && (
            <span className="mt-2.5 block font-sans text-[13px] font-normal leading-snug text-[#a9aba6]">
              {noSalaryShare}% of postings we track don’t list pay.
            </span>
          )}
        </>
      ),
      className: `font-mono text-[15px] font-bold md:text-[22px] ${
        hasSalary(job) ? "text-paper" : "text-[#a9aba6] md:text-xl"
      }`,
    },
    {
      label: "POSTED",
      value: formatPostedDate(job.postedAt, false),
      className: "font-mono text-lg font-bold text-signal md:text-2xl",
    },
  ];

  return (
    <main className="flex-1">
      <BackToJobs />

      {/* Header and desktop actions */}
      <div className="grid gap-4 px-4 pt-6 md:px-12 md:pt-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-end lg:gap-12">
        <div className="flex flex-col gap-4 lg:gap-3.5">
          <p className="flex items-center gap-2 font-mono text-xs font-bold tracking-[0.08em] md:gap-2.5 md:text-[13px]">
            <span aria-hidden="true" className={`h-[7px] w-8 rounded-full md:h-2 md:w-11 ${lineSwatch}`} />
            {job.workType.toUpperCase()} LINE · {placeName.toUpperCase()}
          </p>

          <h1 className="max-w-[900px] text-balance text-[30px] font-extrabold leading-[1.08] tracking-[-0.02em] md:text-[52px] md:leading-[1.02] md:tracking-[-0.03em]">
            {job.title}
          </h1>

          <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1 text-base md:text-lg">
            <span
              aria-hidden="true"
              className="grid size-9 place-items-center rounded-full bg-ink text-[15px] font-extrabold text-paper md:size-11 md:text-lg"
            >
              {companyInitial || "?"}
            </span>
            {company ? (
              <Link
                href={`/companies/${company.id}`}
                className="font-bold underline underline-offset-[3px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              >
                {companyName}
              </Link>
            ) : (
              <span className="font-bold">{companyName}</span>
            )}
            <span className="text-muted">{job.location || "Location unknown"}</span>
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          <div className="hidden lg:block">
            <OriginalPostingAction job={job} className="h-14 w-full text-[17px]" />
          </div>
          {job.sourceUrl ? (
            <p className="hidden text-center font-mono text-xs text-muted lg:block">
              Opens {sourceHost(job.sourceUrl)} in a new tab
            </p>
          ) : (
            <p id="no-link-note" className="font-mono text-xs leading-normal text-muted lg:text-center">
              The source didn’t include a link. Search {companyName}’s careers page.
            </p>
          )}
          <div className="hidden lg:block">
            <JobBookmarkButton jobId={job.id} />
          </div>
        </div>
      </div>

      <div className="grid gap-4 px-4 pt-4 md:px-12 md:pt-9 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-12">
        <div className="flex min-w-0 flex-col gap-4 md:gap-6">
          {/* Overview ticket */}
          <dl className="grid grid-cols-2 rounded-2xl bg-ink text-paper md:grid-cols-4">
            {overview.map((cell, index) => (
              <div
                key={cell.label}
                className={`flex flex-col gap-1.5 border-board-divider-2 p-4 md:gap-2.5 md:p-6 ${overviewBorders[index]}`}
              >
                <dt className="font-mono text-[10px] font-semibold tracking-[0.12em] text-[#a9aba6] md:text-[11px]">
                  {cell.label}
                </dt>
                <dd className={cell.className}>{cell.value}</dd>
              </div>
            ))}
          </dl>

          {/* Tech stack */}
          <section className="flex flex-col gap-2.5 md:gap-4 md:rounded-2xl md:border md:border-hairline md:bg-card md:p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-lg font-extrabold md:text-[22px]">Tech stack</h2>
              {job.skills.length > 0 && (
                <span className="hidden font-mono text-[13px] text-muted md:inline">
                  Tap a skill to see every job that asks for it
                </span>
              )}
            </div>

            {job.skills.length > 0 ? (
              <ul className="flex flex-wrap gap-1.5 md:gap-2">
                {job.skills.map((skill) => (
                  <li key={skill}>
                    <Link
                      href={`/jobs?q=${encodeURIComponent(skill)}`}
                      className="flex h-11 items-center gap-2 rounded-full border-[1.5px] border-ink px-4 text-[15px] font-bold hover:bg-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink md:gap-2.5 md:px-[18px] md:text-base"
                    >
                      {skill}
                      {topSkillCounts.has(skill) && (
                        <span className="font-mono text-xs font-medium text-muted md:text-[13px]">
                          {topSkillCounts.get(skill)} jobs
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[15px] text-muted">
                This posting didn’t list any technologies.
              </p>
            )}
          </section>

          {/* Info note */}
          <div className="flex items-start gap-4 rounded-[14px] border-[1.5px] border-dashed border-[#b5b4ad] p-3.5 text-sm leading-normal text-muted md:rounded-2xl md:px-6 md:py-5 md:text-[15px]">
            <span
              aria-hidden="true"
              className="hidden size-7 shrink-0 place-items-center rounded-full border-2 border-muted font-mono text-sm font-bold md:grid"
            >
              i
            </span>
            <p>
              HireScope stores the key fields of each posting: title, company, location, work
              type, level, salary, skills and date.{" "}
              <b className="text-ink">The full job description lives on the original posting.</b>
            </p>
          </div>
        </div>

        {/* Company card */}
        <aside className="flex flex-col gap-4 lg:row-span-2">
          <section className="flex flex-col gap-4 rounded-2xl border border-hairline bg-card p-4 md:p-[22px]">
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="grid size-11 shrink-0 place-items-center rounded-full bg-ink text-lg font-extrabold text-paper"
              >
                {companyInitial || "?"}
              </span>
              <div className="min-w-0">
                <h2 className="text-lg font-extrabold">{companyName}</h2>
                <p className="font-mono text-[13px] text-muted">
                  {allJobs.length > 0
                    ? `${openRoles} open ${openRoles === 1 ? "role" : "roles"}`
                    : "Open roles: —"}
                </p>
              </div>
            </div>

            <CompanyFacts
              company={company}
              labels={{ location: "Headquarters", size: "Company size" }}
            />

            {company && (
              <Link
                href={`/companies/${company.id}`}
                className="flex h-11 items-center justify-center rounded-full border-[1.5px] border-ink text-[15px] font-bold hover:bg-ink hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              >
                Company page →
              </Link>
            )}
          </section>

          {job.sourceUrl && (
            <p className="px-1 font-mono text-xs leading-relaxed text-muted">
              Source: {sourceHost(job.sourceUrl)} · posted {formatPostedDate(job.postedAt)}
            </p>
          )}
        </aside>

        {/* Related jobs */}
        {relatedJobs.length > 0 && (
          <section className="flex min-w-0 flex-col gap-3.5 pt-4 md:pt-6">
            <h2 className="text-lg font-extrabold md:text-[22px]">Related jobs</h2>
            <JobBoard jobs={relatedJobs} />
          </section>
        )}
      </div>

      {/* Mobile sticky action bar */}
      <div className="sticky bottom-0 z-10 mt-6 flex gap-2 border-t border-hairline bg-paper px-4 pb-[22px] pt-3 lg:hidden">
        <JobBookmarkButton jobId={job.id} compact />
        <OriginalPostingAction job={job} className="h-[52px] flex-1 text-[15px] md:text-base" />
      </div>
    </main>
  );
}
