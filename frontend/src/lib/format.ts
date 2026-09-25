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

// Formats a salary range as "$154k–$193k", handling missing ends
export function formatSalaryRange(
  salaryMin: number | null,
  salaryMax: number | null
) {
  const toK = (salary: number) => `$${Math.round(salary / 1000)}k`;

  if (salaryMin === null && salaryMax === null) return "Salary not disclosed";
  if (salaryMin === null) return `Up to ${toK(salaryMax!)}`;
  if (salaryMax === null) return `From ${toK(salaryMin)}`;
  return `${toK(salaryMin)}–${toK(salaryMax)}`;
}
