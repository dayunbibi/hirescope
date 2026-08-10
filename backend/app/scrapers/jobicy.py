import httpx

from app.normalize import detect_experience_level, extract_skills, parse_iso_datetime, to_int
from app.scrapers.base import NormalizedJob, Scraper

API_URL = "https://jobicy.com/api/v2/remote-jobs"


class JobicyScraper(Scraper):
    source_name = "jobicy"

    def fetch_raw(self) -> list[dict]:
        try:
            resp = httpx.get(API_URL, params={"geo": "canada", "industry": "dev", "count": 50}, timeout=15)
        except httpx.HTTPError:
            return []
        if resp.status_code != 200:
            return []
        return resp.json().get("jobs", [])

    def normalize(self, raw_jobs: list[dict]) -> list[NormalizedJob]:
        normalized: list[NormalizedJob] = []
        for job in raw_jobs:
            title = job.get("jobTitle") or ""
            excerpt = job.get("jobExcerpt") or ""
            description = job.get("jobDescription") or excerpt
            industries = job.get("jobIndustry") or []
            experience_level = _map_job_level(job.get("jobLevel", "")) or detect_experience_level(title)
            normalized.append(
                NormalizedJob(
                    company_name=job.get("companyName", "Unknown"),
                    title=title,
                    location=job.get("jobGeo") or "Remote, Canada",
                    work_type="Remote",
                    experience_level=experience_level,
                    skills=extract_skills(f"{title} {' '.join(industries)} {description}"),
                    salary_min=to_int(job.get("annualSalaryMin")),
                    salary_max=to_int(job.get("annualSalaryMax")),
                    posted_at=parse_iso_datetime(job.get("pubDate")),
                    source=self.source_name,
                    source_url=job.get("url", ""),
                    external_id=str(job.get("id")),
                )
            )
        return normalized


def _map_job_level(level: str) -> str | None:
    lowered = level.lower()
    if "entry" in lowered or "junior" in lowered:
        return "Entry"
    if "senior" in lowered:
        return "Senior"
    if "lead" in lowered or "manager" in lowered or "director" in lowered:
        return "Lead"
    if "mid" in lowered:
        return "Mid-Level"
    return None
