import type { Job } from "@/data/jobs";

// Company names from /companies and /jobs are matched case-insensitively
export const isSameCompany = (first: string, second: string) =>
  first.trim().toLowerCase() === second.trim().toLowerCase();

// Midpoint of a posting's salary range, or the one end that is listed
function salaryMidpoint(job: Job) {
  if (job.salaryMin !== null && job.salaryMax !== null) {
    return (job.salaryMin + job.salaryMax) / 2;
  }
  return job.salaryMin ?? job.salaryMax;
}

// Stats for one company, computed from its postings because the /companies
// fields (technologies, averageSalary) are empty or 0 in the current data
export function companyStats(jobs: Job[]) {
  const skillCounts = new Map<string, number>();
  for (const job of jobs) {
    for (const skill of job.skills) {
      skillCounts.set(skill, (skillCounts.get(skill) ?? 0) + 1);
    }
  }

  // ponytail: values under $10k are hourly contract rates stored as salary; skipped
  // here until the backend normalizes pay periods
  const salaries = jobs
    .map(salaryMidpoint)
    .filter((salary): salary is number => salary !== null && salary >= 10_000);

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
