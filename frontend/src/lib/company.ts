import type { Job } from "@/data/jobs";
import { annualSalaryMidpoint } from "@/lib/format";

// Company names from /companies and /jobs are matched case-insensitively
export const isSameCompany = (first: string, second: string) =>
  first.trim().toLowerCase() === second.trim().toLowerCase();

// Stats for one company, computed from its postings because the /companies
// fields (technologies, averageSalary) are empty or 0 in the current data
export function companyStats(jobs: Job[]) {
  const skillCounts = new Map<string, number>();
  for (const job of jobs) {
    for (const skill of job.skills) {
      skillCounts.set(skill, (skillCounts.get(skill) ?? 0) + 1);
    }
  }

  const salaries = jobs
    .map(annualSalaryMidpoint)
    .filter((salary): salary is number => salary !== null);

  return {
    openRoles: jobs.length,
    // Most common skills first
    technologies: [...skillCounts]
      .sort((first, second) => second[1] - first[1])
      .map(([skill]) => skill),
    averageSalary:
      salaries.length > 0
        ? salaries.reduce((total, salary) => total + salary, 0) / salaries.length
        : null,
    salaryCount: salaries.length,
  };
}

export type CompanyStats = ReturnType<typeof companyStats>;

// "$174k · 1 posting", or "No salary data yet"; never "$0"
export function formatAverageSalary({ averageSalary, salaryCount }: CompanyStats) {
  if (averageSalary === null) return "No salary data yet";
  return `$${Math.round(averageSalary / 1000)}k · ${salaryCount} ${
    salaryCount === 1 ? "posting" : "postings"
  }`;
}
