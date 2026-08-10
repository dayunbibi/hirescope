import httpx

from app.normalize import detect_experience_level, detect_work_type, extract_skills, is_toronto_relevant, parse_iso_datetime
from app.scrapers.base import NormalizedJob, Scraper

BOARD_URL = "https://boards-api.greenhouse.io/v1/boards/{token}/jobs"


class GreenhouseScraper(Scraper):
    source_name = "greenhouse"

    def __init__(self, targets: list[tuple[str, str]]):
        """targets: list of (company_display_name, board_token)."""
        self.targets = targets

    def fetch_raw(self) -> list[dict]:
        raw: list[dict] = []
        with httpx.Client(timeout=15) as client:
            for company_name, token in self.targets:
                try:
                    resp = client.get(BOARD_URL.format(token=token), params={"content": "true"})
                except httpx.HTTPError:
                    continue
                if resp.status_code != 200:
                    continue
                for job in resp.json().get("jobs", []):
                    job["_company_name"] = company_name
                    raw.append(job)
        return raw

    def normalize(self, raw_jobs: list[dict]) -> list[NormalizedJob]:
        normalized: list[NormalizedJob] = []
        for job in raw_jobs:
            location = (job.get("location") or {}).get("name", "") or ""
            content = job.get("content", "") or ""
            title = job.get("title", "") or ""
            if not is_toronto_relevant(location):
                continue
            normalized.append(
                NormalizedJob(
                    company_name=job["_company_name"],
                    title=title,
                    location=location or "Toronto, ON",
                    work_type=detect_work_type(f"{location} {content}"),
                    experience_level=detect_experience_level(title),
                    skills=extract_skills(f"{title} {content}"),
                    salary_min=None,
                    salary_max=None,
                    posted_at=parse_iso_datetime(job.get("updated_at") or job.get("first_published")),
                    source=self.source_name,
                    source_url=job.get("absolute_url", ""),
                    external_id=str(job.get("id")),
                )
            )
        return normalized
