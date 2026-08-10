// Represents one company in the HireScope frontend
export type Company = {
  id: number;
  name: string;
  industry: string;
  location: string;
  size: "Startup" | "Mid-size" | "Enterprise" | "Unknown";
  description: string;
  technologies: string[];
  openJobs: number;
  averageSalary: number | null;
};