import Link from "next/link";
import type { Company } from "@/data/companies";

type CompanyCardProps = {
  company: Company;
};

// Displays one company in the company directory
export default function CompanyCard({ company }: CompanyCardProps) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-[#E0BFBF] bg-white p-6 shadow-sm transition hover:shadow-lg">
      {/* Burgundy hover indicator */}
      <div className="absolute left-0 top-0 h-1 w-full bg-[#800020] opacity-0 transition group-hover:opacity-100" />

      {/* Company identity */}
      <div className="flex items-start gap-4">
        {/* Temporary company logo */}
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-md border border-[#E0BFBF] bg-[#F5F0EE] text-2xl font-bold text-[#800020]">
          {company.name.charAt(0)}
        </div>

        <div className="min-w-0">
          <h2 className="text-2xl font-semibold text-gray-900 transition group-hover:text-[#800020]">
            {company.name}
          </h2>

          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-500">
            <span>{company.industry}</span>
            <span>•</span>
            <span>{company.location}</span>
          </div>
        </div>
      </div>

      {/* Company description */}
      <p className="mt-5 line-clamp-2 text-sm leading-6 text-gray-600">
        {company.description}
      </p>

      {/* Technology tags */}
      <div className="mt-4 flex flex-wrap gap-2">
        {company.technologies.map((technology) => (
          <span
            key={technology}
            className="rounded bg-[#F0F0F0] px-2 py-1 text-xs font-medium text-gray-600"
          >
            {technology}
          </span>
        ))}
      </div>

      {/* Company actions */}
      <div className="mt-auto flex items-end justify-between border-t border-gray-200 pt-5">
        <div>
          <p className="text-2xl font-semibold text-[#800020]">
            {company.openJobs}
          </p>

          <p className="text-xs text-gray-500">Open Jobs</p>
        </div>

        <Link
          href={`/companies/${company.id}`}
          className="rounded-md border border-[#800020] px-4 py-2 text-sm font-medium text-[#800020] transition hover:bg-[#F7EDEE]"
        >
          View Profile
        </Link>
      </div>
    </article>
  );
}