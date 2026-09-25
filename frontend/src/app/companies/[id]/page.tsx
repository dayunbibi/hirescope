import Link from "next/link";
import CompanyFacts, { knownValue } from "@/components/CompanyFacts";
import CompanyRoles from "@/components/CompanyRoles";
import { ErrorBlock } from "@/components/StateBlocks";
import { getCompanies, getJobs } from "@/lib/api";
import { getStation, getStationName } from "@/lib/area";
import { isSameCompany } from "@/lib/company";

type CompanyDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const backLinkClassName =
  "inline-flex h-11 items-center rounded-full border-[1.5px] border-hairline-strong bg-card px-4 text-sm font-semibold text-ink hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";

function BackToCompanies() {
  return (
    <div className="px-4 pt-5 md:px-12">
      <Link href="/companies" className={backLinkClassName}>
        ← All companies
      </Link>
    </div>
  );
}

// Human place name for a location string: a Line Map station, or the raw text
function placeName(location: string) {
  const station = getStation(location);
  return station === "other" ? location : getStationName(station);
}

// Displays one company "terminal" and its open roles
export default async function CompanyDetailPage({ params }: CompanyDetailPageProps) {
  const { id } = await params;

  const [companiesResult, jobsResult] = await Promise.allSettled([getCompanies(), getJobs()]);

  if (companiesResult.status === "rejected" || jobsResult.status === "rejected") {
    return (
      <main className="flex-1">
        <BackToCompanies />
        <div className="px-4 pt-6 md:px-12">
          <ErrorBlock description="Company data is temporarily unavailable. Try again in a moment." />
        </div>
      </main>
    );
  }

  const company = companiesResult.value.find((item) => item.id === Number(id));

  if (!company) {
    return (
      <main className="flex-1">
        <BackToCompanies />
        <section className="mx-4 mt-6 flex flex-col items-start gap-3 rounded-2xl bg-ink px-5 py-8 text-paper md:mx-12 md:px-8 md:py-14">
          <p className="font-mono text-xs font-bold tracking-[0.12em] text-signal md:text-[13px]">
            NOT IN SERVICE
          </p>
          <h1 className="text-[22px] font-extrabold tracking-[-0.02em] md:text-[28px]">
            Company not found
          </h1>
          <p className="max-w-[520px] text-[15px] leading-normal text-board-muted md:text-base">
            This company may no longer be hiring, or the link is wrong.
          </p>
          <Link
            href="/companies"
            className="mt-2 inline-flex h-11 items-center rounded-full bg-signal px-5 text-[15px] font-bold text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
          >
            Browse all companies
          </Link>
        </section>
      </main>
    );
  }

  const allJobs = jobsResult.value;
  const companyJobs = allJobs.filter((job) => isSameCompany(job.company, company.name));

  // Rank among companies by open roles, for the one-line fact
  const openRolesByCompany = new Map<string, number>();
  for (const job of allJobs) {
    const key = job.company.trim().toLowerCase();
    openRolesByCompany.set(key, (openRolesByCompany.get(key) ?? 0) + 1);
  }
  const isTopHirer =
    companyJobs.length > 0 && companyJobs.length === Math.max(...openRolesByCompany.values());

  const fact =
    companyJobs.length === 0
      ? "No open postings in the data right now."
      : `${companyJobs.length} of ${allJobs.length} postings we track${
          isTopHirer ? ", the most of any company" : ""
        }.`;

  // The company location when known, otherwise the station most of its postings list
  let terminal = knownValue(company.location);
  if (terminal) {
    terminal = placeName(terminal);
  } else if (companyJobs.length > 0) {
    const stationCounts = new Map<string, number>();
    for (const job of companyJobs) {
      const station = getStation(job.location);
      stationCounts.set(station, (stationCounts.get(station) ?? 0) + 1);
    }
    const [topStation] = [...stationCounts].sort((first, second) => second[1] - first[1])[0];
    terminal = topStation === "other" ? null : getStationName(topStation);
  }

  return (
    <main className="flex-1">
      <BackToCompanies />

      {/* Header and info strip */}
      <div className="grid gap-4 px-4 pb-5 pt-6 md:gap-6 md:px-12 md:pb-9 md:pt-7 xl:grid-cols-[minmax(0,1fr)_520px] xl:items-end xl:gap-12">
        <div className="flex items-center gap-4 md:gap-6">
          <span
            aria-hidden="true"
            className="grid size-16 shrink-0 place-items-center rounded-full bg-ink text-[28px] font-extrabold text-paper outline-2 outline-offset-[5px] outline-ink md:size-24 md:text-[42px] md:outline-[3px] md:outline-offset-8"
          >
            {company.name.trim().charAt(0).toUpperCase() || "?"}
          </span>
          <div className="flex min-w-0 flex-col gap-1 pl-1.5 md:gap-2 md:pl-3">
            <p className="font-mono text-[11px] font-bold tracking-[0.1em] text-brand-text md:text-[13px]">
              TERMINAL{terminal ? ` · ${terminal.toUpperCase()}` : ""}
            </p>
            <h1 className="break-words text-[28px] font-extrabold leading-[1.05] tracking-[-0.02em] md:text-[52px] md:leading-none md:tracking-[-0.03em]">
              {company.name}
            </h1>
            <p className="text-[15px] text-muted md:text-[17px]">{fact}</p>
          </div>
        </div>

        <CompanyFacts company={company} strip />
      </div>

      <CompanyRoles companyName={company.name} jobs={companyJobs} />
    </main>
  );
}
