// Formats a job posting date, falling back when the value is invalid.
// Uses a fixed time zone so server and client renders produce the same text.
export function formatPostedDate(postedAt: string) {
  const date = new Date(postedAt);

  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return date.toLocaleDateString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "America/Toronto",
  });
}
