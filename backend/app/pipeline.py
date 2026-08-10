from sqlalchemy.orm import Session

from app.database import Base, SessionLocal, engine
from app.models import Company, Job
from app.scrapers.base import NormalizedJob
from app.scrapers.discovery import discover_targets
from app.scrapers.greenhouse import GreenhouseScraper
from app.scrapers.jobicy import JobicyScraper
from app.scrapers.lever import LeverScraper
from app.scrapers.remoteok import RemoteOkScraper


def _get_or_create_company(db: Session, name: str) -> Company:
    company = db.query(Company).filter(Company.name == name).one_or_none()
    if company is None:
        company = Company(name=name)
        db.add(company)
        db.flush()
    return company


def _upsert_job(db: Session, normalized: NormalizedJob) -> bool:
    """Returns True if a new job row was created, False if an existing one was updated."""
    company = _get_or_create_company(db, normalized.company_name)
    existing = (
        db.query(Job)
        .filter(Job.source == normalized.source, Job.external_id == normalized.external_id)
        .one_or_none()
    )
    if existing:
        existing.title = normalized.title
        existing.location = normalized.location
        existing.work_type = normalized.work_type
        existing.experience_level = normalized.experience_level
        existing.skills = normalized.skills
        existing.salary_min = normalized.salary_min
        existing.salary_max = normalized.salary_max
        existing.posted_at = normalized.posted_at
        existing.source_url = normalized.source_url
        existing.company_id = company.id
        return False

    db.add(
        Job(
            company_id=company.id,
            title=normalized.title,
            location=normalized.location,
            work_type=normalized.work_type,
            experience_level=normalized.experience_level,
            skills=normalized.skills,
            salary_min=normalized.salary_min,
            salary_max=normalized.salary_max,
            posted_at=normalized.posted_at,
            source=normalized.source,
            source_url=normalized.source_url,
            external_id=normalized.external_id,
        )
    )
    return True


def run() -> dict[str, dict[str, int]]:
    Base.metadata.create_all(engine)

    targets = discover_targets()
    scrapers = [
        GreenhouseScraper(targets["greenhouse"]),
        LeverScraper(targets["lever"]),
        RemoteOkScraper(),
        JobicyScraper(),
    ]

    summary: dict[str, dict[str, int]] = {}
    db = SessionLocal()
    try:
        for scraper in scrapers:
            normalized_jobs = scraper.run()
            created = updated = 0
            for job in normalized_jobs:
                if _upsert_job(db, job):
                    created += 1
                else:
                    updated += 1
            db.commit()
            summary[scraper.source_name] = {
                "fetched": len(normalized_jobs),
                "created": created,
                "updated": updated,
            }
    finally:
        db.close()

    return summary
