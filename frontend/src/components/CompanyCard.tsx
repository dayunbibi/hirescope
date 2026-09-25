import Link from "next/link";
import CompanyFacts, { knownValue } from "@/components/CompanyFacts";
import { SkillTags } from "@/components/JobRow";
import type { Company } from "@/data/companies";
import { formatAverageSalary, type CompanyStats } from "@/lib/company";

// One "terminal" in the companies directory
export default function CompanyCard({
  company,
  stats,
}: {
  company: Company;
  stats: CompanyStats;
}) {
  const industry = knownValue(company.industry);
  const href = `/companies/${company.id}`;

  return (
    <article className="flex flex-col overflow-hidden rounded-[18px] border border-hairline bg-card">
      <div className="flex items-start justify-between gap-3 px-4 pb-4 pt-5 md:px-[22px] md:pb-[18px] md:pt-[22px]">
        <div className="flex min-w-0 items-center gap-3.5">
          <span
            aria-hidden="true"
            className="grid size-[52px] shrink-0 place-items-center rounded-full bg-ink text-[22px] font-extrabold text-paper outline-2 outline-offset-[5px] outline-ink"
          >
            {company.name.trim().charAt(0).toUpperCase() || "?"}
          </span>
          <div className="min-w-0 pl-1.5">
            <Link
              href={href}
              className="break-words text-xl font-extrabold tracking-[-0.01em] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              {company.name}
            </Link>
            <p className={`mt-0.5 text-sm ${industry ? "text-muted" : "italic text-muted-2"}`}>
              {industry ?? "Industry unknown"}
            </p>
          </div>
        </div>

        <div className="shrink-0 text-right">
          <p className="font-mono text-[32px] font-extrabold leading-none tracking-[-0.04em]">
            {stats.openRoles}
          </p>
          <p className="mt-1 font-mono text-[11px] font-semibold tracking-[0.08em] text-muted">
            OPEN ROLES
          </p>
        </div>
      </div>

      <div className="flex flex-col px-4 pb-[18px] md:px-[22px]">
        <CompanyFacts company={company} fields={["location", "size"]} />
        <div className="flex items-center justify-between gap-4 border-t border-hairline-soft py-2.5 text-sm md:text-[15px]">
          <span className="text-muted">Avg salary</span>
          <span
            className={`font-mono text-sm ${
              stats.averageSalary === null ? "font-medium text-muted-2" : "font-bold"
            }`}
          >
            {formatAverageSalary(stats)}
          </span>
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between gap-2.5 border-t border-hairline-soft px-4 pb-5 pt-3.5 md:px-[22px]">
        <SkillTags
          skills={stats.technologies.slice(0, 4)}
          tagClassName="border-hairline-strong text-ink"
        />
        <Link
          href={href}
          aria-label={`Open ${company.name}`}
          className="ml-auto grid size-11 shrink-0 place-items-center rounded-full bg-ink text-lg font-bold text-white hover:bg-ink/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          →
        </Link>
      </div>
    </article>
  );
}
