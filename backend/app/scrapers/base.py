from abc import ABC, abstractmethod
from dataclasses import dataclass
from datetime import datetime


@dataclass
class NormalizedJob:
    company_name: str
    title: str
    location: str
    work_type: str
    experience_level: str
    skills: list[str]
    salary_min: int | None
    salary_max: int | None
    posted_at: datetime
    source: str
    source_url: str
    external_id: str


class Scraper(ABC):
    source_name: str

    @abstractmethod
    def fetch_raw(self) -> list[dict]:
        ...

    @abstractmethod
    def normalize(self, raw_jobs: list[dict]) -> list[NormalizedJob]:
        ...

    def run(self) -> list[NormalizedJob]:
        return self.normalize(self.fetch_raw())
