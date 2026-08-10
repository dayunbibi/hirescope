// Represents one job posting in the HireScope frontend
export type Job = {
  id: number;
  company: string;
  title: string;
  location: string;
  workType: "Remote" | "Hybrid" | "On-site";
  experienceLevel: "Entry" | "Mid-Level" | "Senior" | "Lead";
  skills: string[];
  salaryMin: number | null;
  salaryMax: number | null;
  postedAt: string;
  sourceUrl: string | null;
  bookmarked?: boolean;
};