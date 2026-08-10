"""Best-effort auto-discovery of Greenhouse/Lever job boards for GTA tech companies.

Neither Greenhouse nor Lever expose a "search by location" directory, so there is
no way to programmatically ask them "every company hiring in Toronto." Instead we
keep a seed list of known GTA tech employer names, guess likely board slugs for
each, and probe both platforms to see what resolves. Misses are silent (a 404 just
means that company doesn't use that platform, or the slug guess was wrong) -- this
is a heuristic, not a complete directory. Results are cached locally so repeated
pipeline runs don't re-probe everything every time.
"""

import json
import re
import time
from pathlib import Path

import httpx

GTA_COMPANY_SEEDS = [
    "1Password", "Wealthsimple", "Shopify", "FreshBooks", "Top Hat", "Ada",
    "Clearco", "Thinkific", "Borrowell", "Score Media and Gaming", "Ritual",
    "Nudge Rewards", "Vidyard", "League", "Klick Health", "Loblaw Digital",
    "Vena Solutions", "PointClickCare", "TouchBistro", "Kobo", "Wattpad",
    "Tulip Retail", "Xero", "ecobee", "Achievers", "Softchoice", "Plooto",
    "Wave", "Wagepoint", "Nesto", "Properly", "Certn", "Absolute Software",
    "Jane App", "Later", "Float", "SnapTravel", "Georgian Partners",
    "Real Ventures", "Faire", "BenchSci", "Deep Genomics", "Layer 6 AI",
    "Xanadu", "Integrate.ai", "Kira Systems", "VerticalScope", "Rangle.io",
    "Nulogy", "Zensurance", "Validere", "Symend", "Blueprint Software Systems",
]

CACHE_PATH = Path(__file__).parent / "discovery_cache.json"
CACHE_TTL_SECONDS = 7 * 24 * 60 * 60

_SUFFIXES = [
    "technologies", "technology", "software", "systems", "solutions",
    "inc", "corp", "corporation", "ltd", "llc", "co",
]


def slugify_candidates(name: str) -> list[str]:
    base = name.lower().replace("&", "and")
    base = re.sub(r"[^a-z0-9\s-]", "", base)
    words = re.split(r"[\s-]+", base.strip())
    words = [w for w in words if w]

    stripped = [w for w in words if w not in _SUFFIXES] or words

    candidates = []
    for word_list in (words, stripped):
        joined = "".join(word_list)
        hyphenated = "-".join(word_list)
        for cand in (joined, hyphenated):
            if cand and cand not in candidates:
                candidates.append(cand)
    return candidates


def _probe_greenhouse(client: httpx.Client, token: str) -> bool:
    try:
        resp = client.get(f"https://boards-api.greenhouse.io/v1/boards/{token}/jobs")
        return resp.status_code == 200 and "jobs" in resp.json()
    except (httpx.HTTPError, ValueError):
        return False


def _probe_lever(client: httpx.Client, slug: str) -> bool:
    try:
        resp = client.get(f"https://api.lever.co/v0/postings/{slug}", params={"mode": "json"})
        return resp.status_code == 200 and isinstance(resp.json(), list)
    except (httpx.HTTPError, ValueError):
        return False


def _load_cache() -> dict | None:
    if not CACHE_PATH.exists():
        return None
    try:
        data = json.loads(CACHE_PATH.read_text())
    except (json.JSONDecodeError, OSError):
        return None
    if time.time() - data.get("discovered_at", 0) > CACHE_TTL_SECONDS:
        return None
    return data


def discover_targets(force: bool = False) -> dict[str, list[tuple[str, str]]]:
    """Returns {"greenhouse": [(name, token), ...], "lever": [(name, slug), ...]}."""
    if not force:
        cached = _load_cache()
        if cached:
            return {
                "greenhouse": [tuple(pair) for pair in cached["greenhouse"]],
                "lever": [tuple(pair) for pair in cached["lever"]],
            }

    greenhouse_targets: list[tuple[str, str]] = []
    lever_targets: list[tuple[str, str]] = []

    with httpx.Client(timeout=10) as client:
        for name in GTA_COMPANY_SEEDS:
            found = False
            for cand in slugify_candidates(name):
                if _probe_greenhouse(client, cand):
                    greenhouse_targets.append((name, cand))
                    found = True
                    break
            if found:
                continue
            for cand in slugify_candidates(name):
                if _probe_lever(client, cand):
                    lever_targets.append((name, cand))
                    break

    CACHE_PATH.write_text(json.dumps({
        "discovered_at": time.time(),
        "greenhouse": greenhouse_targets,
        "lever": lever_targets,
    }))

    return {"greenhouse": greenhouse_targets, "lever": lever_targets}
