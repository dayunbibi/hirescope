# HireScope

HireScope is a Toronto-focused developer job market analytics platform.

It collects software and developer job postings and lets users explore jobs, companies, salaries, technologies, work arrangements, and hiring activity across Toronto and the Greater Toronto Area.

## Project Status

HireScope is a working application. The Next.js frontend has seven pages, all connected to a FastAPI backend that serves real job data collected by a scraping pipeline (Greenhouse, Lever, RemoteOK, Jobicy).

Current focus: replacing the remaining placeholder content, improving UI consistency and responsive behavior, and preparing for deployment. See [Known Limitations](#known-limitations) and [Roadmap](#roadmap).

## Features

### Home (`/`)

- Summary statistics: total jobs, remote jobs, companies hiring, top skill
- Keyword search and work type filter
- Latest job listings
- Technology demand and work type distribution computed from current postings

### Jobs (`/jobs`)

- Filter by keyword, location, minimum salary, work type, and experience level
- Sort by relevance (title matches first), newest (posting date), or salary
- Paginated results
- Collapsible filter panel on mobile

### Job Detail (`/jobs/[id]`)

- Title, company, location, salary range, work type, and experience level
- Technology stack
- Job overview: work type, experience level, salary, and posted date
- "View Original Posting" link when a source URL is available
- Bookmark button
- Company summary and related jobs

### Companies (`/companies`)

- Search by name, filter by industry and company size
- Sort by open jobs, average salary, or name
- Incremental "Load more" listing

### Company Detail (`/companies/[id]`)

- Company overview, industry, location, and size
- Technology stack
- Open job count and average salary
- Open roles by experience level
- Current job listings for the company

### Analytics (`/analytics`)

- Summary statistics
- Salary distribution
- Work type distribution
- Technology ranking
- Experience level demand
- Date range (by posting date) and role filters applied across all charts

### Bookmarks (`/bookmarks`)

- Saved jobs stored in the browser (`localStorage`), synced across open tabs
- Filter by work type, sort by newest, salary, or company

All pages include loading, empty, and error states, and handle missing data such as null salaries, empty skill lists, and unknown company details.

## Tech Stack

### Frontend

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- Material Symbols (icons)

Charts are built with plain HTML elements styled with Tailwind CSS (proportional bars sized with inline widths and heights). No charting library is installed.

### Backend

- Python
- FastAPI
- SQLAlchemy 2
- Pydantic Settings (configuration via `.env`)
- httpx (scrapers)

### Database

- **Development:** SQLite by default (`backend/hirescope.db`), used when `DATABASE_URL` in `backend/.env` is empty.
- **Production:** PostgreSQL is planned. Set `DATABASE_URL` to a PostgreSQL connection string. A PostgreSQL driver (e.g. `psycopg2-binary`) is not yet in `requirements.txt` and must be added.

Tables are created automatically on API startup and on each scraper run. There is no migration tool yet.

### Deployment (planned)

- Vercel (frontend)
- Railway (backend and database)

## Data Pipeline

The scraper (`backend/scripts/run_scraper.py`) collects postings from four sources:

| Source     | Method                                                                 |
| ---------- | ---------------------------------------------------------------------- |
| Greenhouse | Public board API for GTA tech companies found by auto-discovery        |
| Lever      | Public postings API for GTA tech companies found by auto-discovery     |
| RemoteOK   | Public API, filtered for Toronto relevance                             |
| Jobicy     | Public API, Canadian developer roles                                   |

Greenhouse and Lever boards are discovered by probing likely board names for a seed list of GTA tech companies (`backend/app/scrapers/discovery.py`). Results are cached for seven days in `discovery_cache.json`.

Each posting is normalized (work type, experience level, skills, salary) and upserted by source and external ID, so re-running the scraper updates existing jobs instead of duplicating them.

## API

Base URL (local): `http://localhost:8000`. Interactive docs are available at `/docs`.

| Method | Endpoint     | Description                                                     |
| ------ | ------------ | --------------------------------------------------------------- |
| GET    | `/`          | Health check                                                    |
| GET    | `/jobs`      | All jobs, newest first, including the original posting URL      |
| GET    | `/jobs/{id}` | One job, or 404 if not found                                    |
| GET    | `/companies` | All companies with open job count and average salary            |

Filtering, search, sorting, and bookmarks are handled on the frontend. The company detail page uses `/companies` and `/jobs`.

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 20+

### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate            # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env                # leave DATABASE_URL empty to use SQLite

python -m scripts.run_scraper       # populate the database
uvicorn main:app --reload           # http://localhost:8000
```

Run these commands from the `backend` directory. The scraper needs network access and may take a few minutes on the first run while it discovers job boards.

### Frontend

In a second terminal:

```bash
cd frontend
npm install
cp .env.local.example .env.local    # sets NEXT_PUBLIC_API_URL=http://localhost:8000
npm run dev                         # http://localhost:3000
```

The backend only allows CORS requests from `http://localhost:3000`, so run the frontend on that port during local development.

Other frontend scripts: `npm run build`, `npm run start`, `npm run lint`.

## Project Structure

```
backend/
  main.py              FastAPI app and routes
  app/
    config.py          Settings (DATABASE_URL)
    database.py        SQLAlchemy engine and session
    models.py          Company and Job models
    schemas.py         API response schemas
    normalize.py       Work type, experience, skill, and salary parsing
    pipeline.py        Runs all scrapers and upserts results
    scrapers/          Greenhouse, Lever, RemoteOK, Jobicy, discovery
  scripts/
    run_scraper.py     Scraper entry point
frontend/
  src/
    app/               Pages (App Router)
    components/        Shared UI components
    hooks/             useBookmarks
    lib/api.ts         Backend API client
    data/              Job and Company types
```

## Screenshots

<!-- Replace these paths with real screenshots. -->

| Page           | Screenshot                                                  |
| -------------- | ----------------------------------------------------------- |
| Home           | ![Home](docs/screenshots/home.png)                          |
| Jobs           | ![Jobs](docs/screenshots/jobs.png)                          |
| Job Detail     | ![Job Detail](docs/screenshots/job-detail.png)              |
| Companies      | ![Companies](docs/screenshots/companies.png)                |
| Company Detail | ![Company Detail](docs/screenshots/company-detail.png)      |
| Analytics      | ![Analytics](docs/screenshots/analytics.png)                |
| Bookmarks      | ![Bookmarks](docs/screenshots/bookmarks.png)                |
| Mobile         | ![Mobile](docs/screenshots/mobile.png)                      |

## Known Limitations

- **Job descriptions** are not stored. The job detail page shows the collected fields (work type, experience level, salary, posted date, skills) and links to the original posting for the full description.
- **Company details:** the scraper creates companies by name only. Industry, size, location, description, and technologies default to "Unknown" or empty.
- **No historical data** is collected yet, so there are no hiring trends over time. The company detail page shows current open roles by experience level instead.
- **Bookmarks** are stored per browser and are not synced across devices.

## Roadmap

### Near term

- Store and display full job descriptions
- Enrich company data (industry, size, location, technologies)
- Collect job history to support real hiring trends
- Add a PostgreSQL driver and deploy (Vercel and Railway)
- Scheduled scraper runs

### Planned API

- `GET /companies/{id}`
- `GET /skills`
- `GET /stats`
- `POST /bookmarks` (server-side bookmarks, requires authentication)

### Later

- User authentication
- Email notifications
- AI resume matching
- AI skill gap analysis
- Interview question generator
- Salary trend analytics
- Job market heatmap

## Team Responsibilities

### Frontend

- UI and layout
- Search and filters
- Job listing page
- Job detail page
- Dashboard
- Charts
- Bookmark interface
- Responsive design

### Backend

- Job data collection
- Data parser
- Database
- REST API
- Scheduler
- Statistics
- Notifications

### Shared Responsibilities

- Project planning
- Database schema
- API design
- GitHub workflow
- Testing
- Deployment
- Final presentation
