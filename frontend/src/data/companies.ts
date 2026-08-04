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

// Temporary company data used before connecting the backend API
export const companies: Company[] = [
  {
    id: 1,
    name: "StripeFlow",
    industry: "FinTech",
    location: "Toronto, ON",
    size: "Enterprise",
    description:
      "Building financial infrastructure for ambitious companies that want to scale globally.",
    openJobs: 12,
    averageSalary: 145000,
    technologies: ["Ruby", "React", "Go", "AWS"],
  },
  {
    id: 2,
    name: "MediAI",
    industry: "HealthTech",
    location: "Remote",
    size: "Mid-size",
    description:
      "Using machine learning to improve patient outcomes and optimize hospital resources.",
    openJobs: 8,
    averageSalary: 132000,
    technologies: ["Python", "TensorFlow", "Vue.js"],
  },
  {
    id: 3,
    name: "ShopCartel",
    industry: "E-Commerce",
    location: "Toronto, ON",
    size: "Startup",
    description:
      "Creating headless commerce APIs for modern brands and digital shopping experiences.",
    openJobs: 24,
    averageSalary: 138000,
    technologies: ["TypeScript", "Node.js", "GraphQL", "Redis"],
  },
  {
    id: 4,
    name: "CloudNorth",
    industry: "Cloud",
    location: "Toronto, ON",
    size: "Enterprise",
    description:
      "Helping Canadian companies modernize infrastructure using secure cloud platforms.",
    openJobs: 19,
    averageSalary: 154000,
    technologies: ["AWS", "Kubernetes", "Python", "Terraform"],
  },
  {
    id: 5,
    name: "DataBridge",
    industry: "Analytics",
    location: "Mississauga, ON",
    size: "Mid-size",
    description:
      "Developing data platforms that help companies make faster and more informed decisions.",
    openJobs: 11,
    averageSalary: 129000,
    technologies: ["Python", "SQL", "Spark", "React"],
  },
  {
    id: 6,
    name: "SecureLayer",
    industry: "Cybersecurity",
    location: "Toronto, ON",
    size: "Startup",
    description:
      "Protecting growing businesses with cloud-native security monitoring and automation.",
    openJobs: 6,
    averageSalary: 141000,
    technologies: ["Go", "Rust", "AWS", "Docker"],
  },
];