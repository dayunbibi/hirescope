import re
from datetime import datetime, timezone

TECH_KEYWORDS = [
    "React", "Next.js", "Vue.js", "Angular", "Svelte", "TypeScript", "JavaScript",
    "Node.js", "Python", "Django", "Flask", "FastAPI", "Java", "Spring", "Go",
    "Rust", "C++", "C#", ".NET", "Ruby", "Rails", "PHP", "Kotlin", "Swift",
    "GraphQL", "REST", "SQL", "PostgreSQL", "MySQL", "MongoDB", "Redis",
    "Elasticsearch", "Kafka", "Spark", "AWS", "Azure", "GCP", "Docker",
    "Kubernetes", "Terraform", "CI/CD", "Jenkins", "TensorFlow", "PyTorch",
    "Machine Learning", "Figma", "Tailwind CSS", "HTML", "CSS", "Scala",
]

_SKILL_PATTERNS = [
    (kw, re.compile(r"(?<![\w.+#-])" + re.escape(kw).replace(r"\.", r"\.?") + r"(?![\w-])", re.IGNORECASE))
    for kw in TECH_KEYWORDS
]

_SENIOR_KEYWORDS = ["senior", "sr.", "sr ", "staff"]
_LEAD_KEYWORDS = ["lead", "principal", "director", "head of", "manager", "vp "]
_ENTRY_KEYWORDS = ["intern", "junior", "jr.", "jr ", "entry", "associate", "co-op", "new grad"]

_HYBRID_KEYWORDS = ["hybrid"]
_REMOTE_KEYWORDS = ["remote", "work from home", "wfh", "anywhere"]

_GTA_KEYWORDS = [
    "toronto", "gta", "greater toronto area", "mississauga", "markham", "vaughan",
    "brampton", "scarborough", "north york", "etobicoke", "richmond hill",
    "oakville", "burlington", "ontario",
]
# Matches the "ON" province abbreviation as a standalone, uppercase token (e.g.
# "Toronto, ON") -- deliberately case-sensitive so it doesn't match the common
# English word "on" inside free-text job descriptions.
_ON_ABBREVIATION_PATTERN = re.compile(r"\bON\b")


def detect_work_type(text: str) -> str:
    lowered = (text or "").lower()
    if any(kw in lowered for kw in _HYBRID_KEYWORDS):
        return "Hybrid"
    if any(kw in lowered for kw in _REMOTE_KEYWORDS):
        return "Remote"
    return "On-site"


def detect_experience_level(title: str) -> str:
    lowered = (title or "").lower()
    if any(kw in lowered for kw in _ENTRY_KEYWORDS):
        return "Entry"
    if any(kw in lowered for kw in _LEAD_KEYWORDS):
        return "Lead"
    if any(kw in lowered for kw in _SENIOR_KEYWORDS):
        return "Senior"
    return "Mid-Level"


def extract_skills(text: str) -> list[str]:
    if not text:
        return []
    found: list[str] = []
    for canonical, pattern in _SKILL_PATTERNS:
        if pattern.search(text) and canonical not in found:
            found.append(canonical)
    return found


def is_toronto_relevant(*texts: str) -> bool:
    raw = " ".join(t or "" for t in texts)
    if _ON_ABBREVIATION_PATTERN.search(raw):
        return True
    lowered = raw.lower()
    return any(kw in lowered for kw in _GTA_KEYWORDS)


def parse_iso_datetime(value: str | None) -> datetime:
    if not value:
        return datetime.now(timezone.utc)
    try:
        return datetime.fromisoformat(str(value).replace("Z", "+00:00"))
    except ValueError:
        return datetime.now(timezone.utc)


def to_int(value) -> int | None:
    if value is None:
        return None
    try:
        return int(round(float(value)))
    except (TypeError, ValueError):
        return None


def parse_epoch_ms_datetime(value) -> datetime:
    if not value:
        return datetime.now(timezone.utc)
    try:
        return datetime.fromtimestamp(int(value) / 1000, tz=timezone.utc)
    except (ValueError, TypeError, OverflowError):
        return datetime.now(timezone.utc)
