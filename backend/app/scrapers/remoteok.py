import httpx

from app.normalize import detect_experience_level, extract_skills, is_toronto_relevant, parse_iso_datetime, to_int
from app.scrapers.base import NormalizedJob, Scraper

API_URL = "https://remoteok.com/api"
HEADERS = {"User-Agent": "Mozilla/5.0 (compatible; HireScopeBot/1.0)"}


class RemoteOkScraper(Scraper):
    source_name = "remoteok"

    def fetch_raw(self) -> list[dict]:
        try:
            resp = httpx.get(API_URL, headers=HEADERS, timeout=15)
        except httpx.HTTPError:
            return []
        if resp.status_code != 200:
            return []
        data = resp.json()
        # First element is a legal/metadata notice, not a job.
        return [job for job in data if isinstance(job, dict) and job.get("id")]

    def normalize(self, raw_jobs: list[dict]) -> list[NormalizedJob]:
        normalized: list[NormalizedJob] = []
        for job in raw_jobs:
            tags = job.get("tags") or []
            location = job.get("location") or ""
            description = job.get("description") or ""
            title = job.get("position") or ""
            if not is_toronto_relevant(location, " ".join(tags)):
                continue
            normalized.append(
                NormalizedJob(
                    company_name=job.get("company", "Unknown"),
                    title=title,
                    location=location or "Remote, Canada",
                    work_type="Remote",
                    experience_level=detect_experience_level(title),
                    skills=extract_skills(f"{title} {' '.join(tags)} {description}"),
                    salary_min=to_int(job.get("salary_min")),
                    salary_max=to_int(job.get("salary_max")),
                    posted_at=parse_iso_datetime(job.get("date")),
                    source=self.source_name,
                    source_url=job.get("url", ""),
                    external_id=str(job.get("id")),
                )
            )
        return normalized
