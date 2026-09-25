import type { Job } from "@/data/jobs";

// Formats a job posting date, falling back when the value is invalid.
// Uses a fixed time zone so server and client renders produce the same text.
// Pass withYear: false for the short "Sep 24" form used on the departures board.
export function formatPostedDate(postedAt: string, withYear = true) {
  const date = new Date(postedAt);

  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return date.toLocaleDateString("en-CA", {
    year: withYear ? "numeric" : undefined,
    month: "short",
    day: "numeric",
    timeZone: "America/Toronto",
  });
}

type Pay = Pick<Job, "salaryMin" | "salaryMax">;

// Midpoint of a posting's pay range, or the one end that is listed
function payMidpoint({ salaryMin, salaryMax }: Pay) {
  if (salaryMin !== null && salaryMax !== null) return (salaryMin + salaryMax) / 2;
  return salaryMin ?? salaryMax;
}

// ponytail: some postings store hourly contract rates (e.g. 41–52) as salary; a
// midpoint under $10k is treated as hourly until the backend normalizes pay periods
export const isHourlyRate = (job: Pay) => {
  const midpoint = payMidpoint(job);
  return midpoint !== null && midpoint < 10_000;
};

// Annual salary midpoint, or null when pay is missing or hourly
export const annualSalaryMidpoint = (job: Pay) =>
  isHourlyRate(job) ? null : payMidpoint(job);

// Formats a salary range as "$154k–$193k" (or "$41–$52/hr"), handling missing ends
export function formatSalaryRange(
  salaryMin: number | null,
  salaryMax: number | null
) {
  const hourly = isHourlyRate({ salaryMin, salaryMax });
  const format = (salary: number) =>
    hourly ? `$${Math.round(salary)}` : `$${Math.round(salary / 1000)}k`;
  const unit = hourly ? "/hr" : "";

  if (salaryMin === null && salaryMax === null) return "Salary not disclosed";
  if (salaryMin === null) return `Up to ${format(salaryMax!)}${unit}`;
  if (salaryMax === null) return `From ${format(salaryMin)}${unit}`;
  return `${format(salaryMin)}–${format(salaryMax)}${unit}`;
}
