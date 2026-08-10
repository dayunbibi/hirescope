import httpx

from app.normalize import detect_experience_level, detect_work_type, extract_skills, is_toronto_relevant, parse_epoch_ms_datetime, to_int
from app.scrapers.base import NormalizedJob, Scraper

BOARD_URL = "https://api.lever.co/v0/postings/{slug}"


class LeverScraper(Scraper):
    source_name = "lever"

    def __init__(self, targets: list[tuple[str, str]]):
        """targets: list of (company_display_name, lever_slug)."""
        self.targets = targets

    def fetch_raw(self) -> list[dict]:
        raw: list[dict] = []
        with httpx.Client(timeout=15) as client:
            for company_name, slug in self.targets:
                try:
                    resp = client.get(BOARD_URL.format(slug=slug), params={"mode": "json"})
                except httpx.HTTPError:
                    continue
                if resp.status_code != 200:
                    continue
                for job in resp.json():
                    job["_company_name"] = company_name
                    raw.append(job)
        return raw

    def normalize(self, raw_jobs: list[dict]) -> list[NormalizedJob]:
        normalized: list[NormalizedJob] = []
        for job in raw_jobs:
            categories = job.get("categories") or {}
            location = categories.get("location", "") or ""
            description = job.get("descriptionPlain") or job.get("description") or ""
            title = job.get("text", "") or ""
            if not is_toronto_relevant(location):
                continue
            salary = job.get("salaryRange") or {}
            normalized.append(
                NormalizedJob(
                    company_name=job["_company_name"],
                    title=title,
                    location=location or "Toronto, ON",
                    work_type=detect_work_type(f"{location} {description}"),
                    experience_level=detect_experience_level(title),
                    skills=extract_skills(f"{title} {description}"),
                    salary_min=to_int(salary.get("min")),
                    salary_max=to_int(salary.get("max")),
                    posted_at=parse_epoch_ms_datetime(job.get("createdAt")),
                    source=self.source_name,
                    source_url=job.get("hostedUrl", ""),
                    external_id=str(job.get("id")),
                )
            )
        return normalized
