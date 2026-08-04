// Represents one job posting in the HireScope frontend
export type Job = {
  id: number;
  company: string;
  title: string;
  location: string;
  workType: "Remote" | "Hybrid" | "On-site";
  skills: string[];
};

// Temporary mock data used before connecting the backend API
export const jobs: Job[] = [
  {
    id: 1,
    company: "Shopify",
    title: "Frontend Developer",
    location: "Toronto, ON",
    workType: "Remote",
    skills: ["React", "TypeScript", "Next.js"],
  },
  {
    id: 2,
    company: "RBC",
    title: "Software Developer",
    location: "Toronto, ON",
    workType: "Hybrid",
    skills: ["Java", "Spring", "SQL"],
  },
  {
    id: 3,
    company: "Amazon",
    title: "Junior Software Engineer",
    location: "Toronto, ON",
    workType: "On-site",
    skills: ["Python", "AWS", "Docker"],
  },
];