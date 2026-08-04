// Represents one job posting in the HireScope frontend
export type Job = {
  id: number;
  company: string;
  title: string;
  location: string;
  workType: "Remote" | "Hybrid" | "On-site";
  experienceLevel: "Entry" | "Mid-Level" | "Senior" | "Lead";
  skills: string[];
  salaryMin: number;
  salaryMax: number;
  postedAt: string;
  bookmarked?: boolean;
};

// Temporary mock data used before connecting the backend API
export const jobs: Job[] = [
  {
    id: 1,
    company: "TechFlow Systems",
    title: "Senior Frontend Developer",
    location: "Toronto, ON",
    workType: "Hybrid",
    experienceLevel: "Senior",
    skills: ["React", "TypeScript", "Next.js"],
    salaryMin: 140000,
    salaryMax: 160000,
    postedAt: "2 hours ago",
  },
  {
    id: 2,
    company: "FinServ Analytics",
    title: "Full Stack Engineer",
    location: "Remote, Canada",
    workType: "Remote",
    experienceLevel: "Mid-Level",
    skills: ["Node.js", "React", "PostgreSQL"],
    salaryMin: 130000,
    salaryMax: 170000,
    postedAt: "5 hours ago",
  },
  {
    id: 3,
    company: "BankCorp Digital",
    title: "Lead UI/UX Designer",
    location: "Toronto, ON",
    workType: "On-site",
    experienceLevel: "Lead",
    skills: ["Figma", "Design Systems", "Prototyping"],
    salaryMin: 150000,
    salaryMax: 180000,
    postedAt: "1 day ago",
    bookmarked: true,
  },
  {
    id: 4,
    company: "Shopify",
    title: "Frontend Developer",
    location: "Toronto, ON",
    workType: "Remote",
    experienceLevel: "Mid-Level",
    skills: ["React", "TypeScript", "GraphQL"],
    salaryMin: 110000,
    salaryMax: 145000,
    postedAt: "1 day ago",
  },
  {
    id: 5,
    company: "RBC",
    title: "Junior Software Developer",
    location: "Toronto, ON",
    workType: "Hybrid",
    experienceLevel: "Entry",
    skills: ["Java", "Spring", "SQL"],
    salaryMin: 70000,
    salaryMax: 90000,
    postedAt: "2 days ago",
  },
];