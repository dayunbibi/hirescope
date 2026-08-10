// Represents one company displayed in the HireScope directory
export type Company = {
  id: number;
  name: string;
  industry: string;
  location: string;
  size: "Startup" | "Mid-size" | "Enterprise";
  description: string;
  openJobs: number;
  averageSalary: number;
  technologies: string[];
};
