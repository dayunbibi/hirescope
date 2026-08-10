from datetime import datetime, timezone

from sqlalchemy import DateTime, ForeignKey, Integer, JSON, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Company(Base):
    __tablename__ = "companies"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String, unique=True, index=True)
    industry: Mapped[str] = mapped_column(String, default="Unknown")
    location: Mapped[str] = mapped_column(String, default="Unknown")
    size: Mapped[str] = mapped_column(String, default="Unknown")
    description: Mapped[str] = mapped_column(String, default="")
    technologies: Mapped[list[str]] = mapped_column(JSON, default=list)

    jobs: Mapped[list["Job"]] = relationship(back_populates="company")


class Job(Base):
    __tablename__ = "jobs"
    __table_args__ = (UniqueConstraint("source", "external_id", name="uq_job_source_external_id"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    company_id: Mapped[int] = mapped_column(ForeignKey("companies.id"))
    title: Mapped[str] = mapped_column(String)
    location: Mapped[str] = mapped_column(String)
    work_type: Mapped[str] = mapped_column(String)
    experience_level: Mapped[str] = mapped_column(String)
    skills: Mapped[list[str]] = mapped_column(JSON, default=list)
    salary_min: Mapped[int | None] = mapped_column(Integer, nullable=True)
    salary_max: Mapped[int | None] = mapped_column(Integer, nullable=True)
    posted_at: Mapped[datetime] = mapped_column(DateTime)
    source: Mapped[str] = mapped_column(String)
    source_url: Mapped[str] = mapped_column(String)
    external_id: Mapped[str] = mapped_column(String)
    scraped_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))

    company: Mapped["Company"] = relationship(back_populates="jobs")
