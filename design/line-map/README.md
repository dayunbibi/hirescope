# Handoff: HireScope — "Line Map" redesign

## Overview
HireScope collects developer job postings in Toronto / GTA (Greenhouse, Lever, RemoteOK, Jobicy) and helps job seekers explore jobs, companies, salaries, skills and hiring trends. This redesign ("2a Line Map") presents the GTA job market as a **transit map**:
- **Work types are lines**: Hybrid (yellow), Remote (red), On-site (green)
- **Areas are stations**: Downtown Toronto, Mississauga, North York, Markham, Vaughan, Oakville, Remote · Canada
- **Job lists are departure boards**: dark rows with the posted date in yellow
- **API errors are "Service disruption"**; empty results are "No departures"

Pages: Home, Jobs, Job Detail, Companies, Company Detail, Analytics, Bookmarks, plus the global nav, mobile menu and footer. Every page is designed at 1440px (desktop) and 390px (mobile).

## About the design files
The `.dc.html` files in this folder are **design references built in HTML**. They are prototypes that show the intended look and behavior, not production code. Recreate them in the target stack, **Next.js (App Router) + Tailwind CSS**, using normal React components. Open any file in a browser (keep `support.js` next to it). Each file is a canvas showing desktop and mobile side by side, with a **STATE / CASE** switcher above for loading, empty, error and edge cases.

## Fidelity
**High-fidelity.** Colors, type, spacing, radii and copy are final. Match them closely using Tailwind.

## Data honesty rules (important)
- Use only real API data. **Never invent trends.** There is no historical data, so there are no up/down arrows or trend lines.
- Items marked `SAMPLE` in the mocks are placeholders:
  - Per-station job counts (only Remote = 61 is real)
  - Jobs 4–10 on the Jobs page
  - The per-level split on Company Detail
  - Mozilla's open-role count
  In production, compute these from the API or hide them.
- **Station counts need a location → area mapping.** Normalize `location` strings, for example:
  - "Mississauga, ON" → `mississauga`
  - "Toronto" → `downtown`
  - "Anywhere" / "Canada" / "Remote" → `remote`
  - Anything unmatched → add an "Other GTA" station
- **Missing salary** shows "Salary not disclosed" in muted mono text. This is the common case: 93 of 149 postings.
- **Unknown company fields** show "Unknown" in muted italic. If industry, location and size are *all* unknown, collapse them into one line: "Industry, location and size not listed".

## Design tokens
### Colors
| Token | Value | Use |
|---|---|---|
| ink | `#16181a` | text, nav bar, departure board, primary buttons |
| paper | `#f5f4ef` | page background |
| card | `#ffffff` | cards, inputs |
| border | `#deddd6` | card borders |
| border-strong | `#cfcec7` | chip / secondary button borders |
| divider | `#eceae4` | rows inside cards |
| muted | `#4a4c49` | secondary text on paper |
| muted-2 | `#6a6c68` | labels, "Unknown" |
| board-divider | `#262927` / `#2c2f2d` | rows on dark board |
| board-muted | `#b4b6b1` | secondary text on dark |
| board-faint | `#8d908c` | column headers, "Salary not disclosed" on dark |
| line-hybrid | `oklch(0.8 0.15 85)` | Hybrid line; Lead level |
| line-remote / brand | `oklch(0.6 0.2 28)` | Remote line, logo, Mid-Level level |
| line-onsite | `oklch(0.6 0.14 155)` | On-site line; Entry level |
| signal-yellow | `oklch(0.85 0.15 85)` | posted dates on dark, bookmarked state, primary on dark |
| brand-text | `oklch(0.52 0.19 28)` | eyebrow labels on paper |
| error | `oklch(0.72 0.17 28)` text / `oklch(0.65 0.2 28)` dot | Service disruption |
| lake | `oklch(0.94 0.025 230)` | Lake Ontario band on the map |

Experience level colors, used consistently across pages: Senior = ink, Mid-Level = remote red, Lead = hybrid yellow, Entry = on-site green.

### Typography
- **Overpass** (400/600/700/800): all UI and headings
- **Overpass Mono** (400–700): numbers, dates, salaries, eyebrow labels, skill tags

| Role | Desktop | Mobile |
|---|---|---|
| Home H1 | 800 50px / 1.02, -0.03em | 800 36px |
| Page H1 | 800 48px / 1, -0.03em | 800 34px |
| Job Detail H1 | 800 52px / 1.02 | 800 30px |
| Section H2 | 800 20–28px | 800 18–22px |
| Body | 400 17–18px / 1.5 | 15–16px |
| Row title | 700 17px / 1.25 | 700 17px |
| Eyebrow | Mono 700 13px, 0.1em tracking, uppercase | Mono 11px |
| Column header | Mono 600 11px, 0.1em tracking | — |
| Stat number | 800 38–48px (sans or mono) | 28–30px |
| Tag | Mono 500 12px | same |

### Radius, spacing and sizes
- **Radius:** pills `9999px` (buttons, inputs, chips); cards `16px`; company cards `18px`; small tiles `10–12px`; mobile frame `28px` (mock only)
- **Page padding:** 48px on desktop, 16px on mobile (cards 12px)
- **Grid gaps:** 24–32px
- **Nav height:** 68px on desktop, 60px on mobile
- **Touch targets:** at least **44px** everywhere (buttons, chips, bookmark, pagination, station rows)
- **Shadows:** none, apart from focus rings on selected stations (`0 0 0 6px rgba(22,24,26,.18)`)

### Suggested `tailwind.config` extension
```js
colors: {
  ink: '#16181a', paper: '#f5f4ef', line: { hybrid: 'oklch(0.8 0.15 85)', remote: 'oklch(0.6 0.2 28)', onsite: 'oklch(0.6 0.14 155)' },
  signal: 'oklch(0.85 0.15 85)', brand: { DEFAULT: 'oklch(0.6 0.2 28)', text: 'oklch(0.52 0.19 28)' },
  muted: { DEFAULT: '#4a4c49', 2: '#6a6c68' }, hairline: { DEFAULT: '#deddd6', strong: '#cfcec7', soft: '#eceae4' },
},
fontFamily: { sans: ['Overpass', 'sans-serif'], mono: ['"Overpass Mono"', 'monospace'] },
```
Load both fonts with `next/font/google`.

## Global components
- **TopNav** (desktop): ink bar, 68px, padding 0 48px.
  - Left: logo roundel (28px circle, 5px red border, with a 36×7px red bar through it) and "HireScope" (800 20px).
  - Center: links Home / Jobs / Analytics / Companies / Bookmarks (600 15px, `#c9c8c2`, padding 10px 16px). The active link is a paper-colored pill with ink text and `aria-current="page"`. Bookmarks shows its saved count.
  - Right: "Updated Sep 24, 2026" in mono 13px.
- **MobileNav**: 60px ink bar with logo and a 44px hamburger button. The open menu is full-screen ink, drawn as a vertical red line with a 32px station circle per link (64px rows, 700 22px). The current page has a filled circle and a "YOU ARE HERE" label. The sources line sits at the bottom.
- **Footer**: 1px top border; mono 13px `#4a4c49`. Content: "Sources: Greenhouse, Lever, RemoteOK, Jobicy · Updated {date}" plus GitHub and "About the data" links.
- **JobRow** (desktop board): 6-column grid `72px 100px 1fr 88px 196px 44px`, padding 16px 24px, `#262927` top border.
  - Columns: posted (mono yellow) · line dot + work type · avatar (40px paper circle with initial) + title + "Company · Location" + skill tags · level · salary · bookmark (44px circle).
  - Bookmarked state: yellow fill with ink icon.
- **JobCard** (mobile): ink card, radius 16, padding 16, containing the same fields stacked. The bookmark button is 44px, top right.
- **StateBlocks**: the same markup on every page.
  - Loading: skeleton bars `#2c2f2d` / `#34373a` on dark, `#e2e1db` / `#eceae4` on light; set `aria-busy`.
  - Empty: yellow eyebrow "NO DEPARTURES", 800 28px heading, help text, and a yellow "Clear all filters" pill.
  - Error: red dot + "SERVICE DISRUPTION", heading, reassurance that filters and bookmarks are kept, and a paper "Retry" pill; set `role="alert"`.

## Screens
### Home (`HireScope Home.dc.html`)
- **Hero** (desktop grid `420px 880px`, gap 44).
  - Left column: eyebrow, H1 "Toronto's developer jobs, mapped like the subway.", subheadline, pill search (56px, 2px ink border), then the **work type = line** toggles (4 rows, 44px each, with line swatch, label and count). These act as the All / Remote / Hybrid / On-site filter.
  - Right column: **LineMap**, 880×500 on a white card with radius 20. It is an SVG with lines drawn as 10px polylines. The stations are 44px buttons: interchanges are 28px white circles with ink borders, single-line stations are 22px circles with the line color. Each label shows name and job count, plus a `SAMPLE` chip where needed.
  - Selecting a work type dims the other lines to 15% opacity and their stations to 25%. Clicking a station fills the departures board.
- **Stat strip**: 4 columns — Total Jobs 149, Remote Jobs 61, Companies Hiring 26, Top Skill Python (45 jobs).
- **Departures board** = latest postings for the selected station, with a "View all jobs →" link to /jobs. Typing a search overrides the station filter.
- **How it works**: 3 stops on a horizontal line — Collect / Extract / Explore, one sentence each.
- **Mobile**: the map becomes a vertical station list (48px rows on a 6px line) and the line toggles become scrolling chips.
- No popups, modals or onboarding overlays.

### Jobs (`HireScope Jobs.dc.html`)
- **Header**: H1 "Jobs", subline, and a 600px keyword search on the right with a clear (×) button.
- **Layout**: 340px filter aside plus the results column.
- **Filters**:
  - **Location**: a mini line map (298×170, same SVG `viewBox 0 0 880 500`) and a station radio list (36px rows).
  - **Work type**: the line toggles.
  - **Minimum salary**: range 0–200k in 10k steps, labelled "Any" or "$Nk+". A checkbox "Include jobs without a listed salary" is checked by default. Unchecking it hides undisclosed jobs whenever a minimum is set.
  - **Experience level**: 2×2 multi-select chips (Entry 6 / Mid-Level 42 / Senior 66 / Lead 35).
  - A "Reset all" link.
- **Toolbar**: result count ("149 jobs"), removable active-filter chips, and a Sort select (Most Relevant / Newest / Highest Salary). Highest Salary puts salaried jobs first; relevance scores title > skill > company matches.
- **Results**: the departures board, then pagination (10 per page, "Showing 1–10 of 149", Prev / 1 2 3 … 15 / Next; Prev is disabled on page 1).
- **States**: loading, empty (with "Clear all filters" and "Show all stations") and error.
- **Mobile**: search, a "Filters (n)" button that opens a bottom sheet (reset, close, filters, and a sticky "Show N jobs" button), a sort select, line chips, cards, and a compact pager ("Page 1 of 15").
- Sync filters to URL search params so results are shareable.

### Job Detail (`HireScope Job Detail.dc.html`)
- Header: line swatch + "HYBRID LINE · MISSISSAUGA", H1 title, and the company (link) with location.
- Right-hand actions (340px):
  - **View original posting ↗**: 56px ink pill that opens the source in a new tab.
  - **No link**: a disabled dashed grey button "Original posting unavailable" with explanation text (`aria-describedby`).
  - **Bookmark**: toggle, labelled "Bookmark this job" / "Saved to bookmarks".
- **Overview ticket**: ink card with 4 cells — Work type, Experience, Salary ("Not disclosed" plus the note "62% of GTA postings don't list pay"), Posted.
- **Tech stack**: 44px skill pills linking to /jobs?skill=…, with the market count for top-10 skills.
- **Info note**: explains that only key fields are stored and the full description is on the original posting.
- **Company card**: open roles, then Industry / HQ / Size (Unknown handling), then a "Company page →" link.
- **Mobile**: stacked layout with a sticky bottom action bar (52px bookmark circle + primary button).
- **States**: loading, error.

### Companies (`HireScope Companies.dc.html`)
- **Directory**: H1, search (by company or technology), and a 3-column grid of company cards.
  - Each card: 52px initial avatar with a double ring, name, industry (or "Industry unknown"), the open-roles number (mono 800 32px), Location and Size rows (or the collapsed all-unknown line), and Avg salary. Avg salary shows as "$174k · 1 posting", or "No salary data yet" when there is none.
  - Card footer: technology tags and a 44px → link.
  - "Show all 26 companies" button; states for loading, no results and error.
- **Company Detail**: 96px avatar, "TERMINAL · {LOCATION}", H1, a one-line fact, and an info strip (Industry / Location / Size).
  - Left column: **Open roles by level**. A stacked bar plus 4 buttons that filter the job list, then a Technologies card and Avg salary.
  - Right column: a departures board of that company's jobs.

### Analytics (`HireScope Analytics.dc.html`)
- **Filters**:
  - Date range: segmented All time / Last 7 / 30 / 90 days, filtered by posted date.
  - Role: select with All / Backend / Frontend / Full stack / ML / Data / Platform / DevOps.
  - When filtered, show a dashed notice bar with a Reset button.
- **Stats**: an ink strip with Total active jobs 149, Hiring companies 26, Jobs with salary 56 (38%), and Average salary ~$120k (midpoint of 56 postings).
- **Charts** (plain HTML/CSS bars; no chart library needed):
  1. **Salary by level**: horizontal bars scaled to the max. Entry ($75k) has hatched/dashed styling with the note "based on 1 posting".
  2. **Work type breakdown**: three "lines" whose length is their share of jobs, each ending in a station dot.
  3. **Top 10 technologies**: bar rows. The #1 bar is red; each row links to /jobs?skill=.
  4. **Top hiring companies**: the top 5 with bars (the note "76% of all jobs" is computed).
  5. **Experience level mix**: a 40px segmented bar plus a 4-column legend with counts and percentages.
- The error state shows nothing rather than stale numbers.

### Bookmarks (`HireScope Bookmarks.dc.html`)
- Same JobRow / JobCard, with a yellow "Remove" pill in place of the bookmark toggle.
- Removing a job shows an inline status bar: "Removed … · Undo".
- **Empty state**: "You haven't bookmarked any jobs yet." with a "Find jobs to save →" CTA and a dashed-line illustration made from simple circles.
- **Error state**: "Your 3 bookmarks are safe, but we can't load their details."
- Store bookmarks as job IDs in localStorage; fetch the job details by ID.

## State management
- **Global:** `bookmarks: string[]` (localStorage-backed, exposed through a context or Zustand). The nav badge shows the count.
- **Jobs:** `q, area, workType, minSalary, includeNoSalary, levels[], sort, page`, all mirrored in URL params. Debounce the keyword search by about 250ms.
- **Home:** `q, workType, station`. Submitting the search navigates to `/jobs?q=`.
- **Analytics:** `range, role`, reflected in the URL.
- **Fetching:** every page needs loading, error (API unreachable → Service disruption + Retry) and empty states.

## Suggested API needs
- `GET /jobs?…filters` returns `{ items, total }`. Each item: `id, title, company, location, area, workType, level, salaryMin, salaryMax, skills[], postedAt, sourceUrl|null, source`.
- `GET /companies` → `{ name, industry|null, location|null, size|null, openJobs, avgSalary|null, salaryCount, technologies[] }`.
- `GET /stats?range&role` returns the totals, `byLevelSalary`, `workType`, `topSkills`, `topCompanies`, `levelMix`, and `areaCounts` (for the stations).

## Assets
No images. The only icons are inline SVGs (search magnifier, bookmark shape). The logo roundel is two CSS shapes. Company avatars are initials. The map is an SVG made of straight/45° polylines.

## Files
- `HireScope Home.dc.html` — Home, desktop + mobile
- `HireScope Jobs.dc.html` — Jobs, desktop + mobile results + filter sheet + mobile menu; states
- `HireScope Job Detail.dc.html` — 3 cases (salary / no salary / no link) + loading + error
- `HireScope Companies.dc.html` — directory + detail, desktop + mobile; states
- `HireScope Analytics.dc.html` — desktop + mobile; states
- `HireScope Bookmarks.dc.html` — saved / empty / error, with undo
- `support.js` — runtime needed to open the HTML references locally
