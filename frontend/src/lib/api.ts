import type { Company } from "@/data/companies";
import type { Job } from "@/data/jobs";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function getJobs(): Promise<Job[]> {
  const response = await fetch(`${API_URL}/jobs`, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Failed to load jobs (${response.status})`);
  }

  return response.json();
}

export async function getJob(id: number): Promise<Job | null> {
  const response = await fetch(`${API_URL}/jobs/${id}`, { cache: "no-store" });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Failed to load job ${id} (${response.status})`);
  }

  return response.json();
}

export async function getCompanies(): Promise<Company[]> {
  const response = await fetch(`${API_URL}/companies`, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Failed to load companies (${response.status})`);
  }

  return response.json();
}
