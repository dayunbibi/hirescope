from pydantic import BaseModel


class JobOut(BaseModel):
    id: int
    company: str
    title: str
    location: str
    workType: str
    experienceLevel: str
    skills: list[str]
    salaryMin: int | None
    salaryMax: int | None
    postedAt: str


class CompanyOut(BaseModel):
    id: int
    name: str
    industry: str
    location: str
    size: str
    description: str
    openJobs: int
    averageSalary: int
    technologies: list[str]
