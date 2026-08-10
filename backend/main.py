from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database import Base, engine, get_db
from app.models import Company, Job
from app.schemas import CompanyOut, JobOut


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(engine)
    yield


app = FastAPI(title="HireScope API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["GET"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "HireScope API is running"}


def _job_to_out(job: Job) -> JobOut:
    return JobOut(
        id=job.id,
        company=job.company.name,
        title=job.title,
        location=job.location,
        workType=job.work_type,
        experienceLevel=job.experience_level,
        skills=job.skills,
        salaryMin=job.salary_min,
        salaryMax=job.salary_max,
        postedAt=job.posted_at.isoformat(),
    )


@app.get("/jobs", response_model=list[JobOut])
def get_jobs(db: Session = Depends(get_db)):
    jobs = db.query(Job).order_by(Job.posted_at.desc()).all()
    return [_job_to_out(job) for job in jobs]


@app.get("/jobs/{job_id}", response_model=JobOut)
def get_job(job_id: int, db: Session = Depends(get_db)):
    job = db.get(Job, job_id)
    if job is None:
        raise HTTPException(status_code=404, detail="Job not found")
    return _job_to_out(job)


@app.get("/companies", response_model=list[CompanyOut])
def get_companies(db: Session = Depends(get_db)):
    rows = (
        db.query(
            Company,
            func.count(Job.id).label("open_jobs"),
            func.avg((Job.salary_min + Job.salary_max) / 2.0).label("avg_salary"),
        )
        .outerjoin(Job, Job.company_id == Company.id)
        .group_by(Company.id)
        .all()
    )
    return [
        CompanyOut(
            id=company.id,
            name=company.name,
            industry=company.industry,
            location=company.location,
            size=company.size,
            description=company.description,
            openJobs=open_jobs or 0,
            averageSalary=int(avg_salary) if avg_salary is not None else 0,
            technologies=company.technologies,
        )
        for company, open_jobs, avg_salary in rows
    ]
