# HireScope — Claude Code Instructions

## Project Overview

HireScope is a Toronto-focused developer job market analytics platform.

It collects software and developer job postings and allows users to explore jobs, companies, salaries, technologies, work arrangements, and hiring trends.

The application already has working frontend and backend functionality.

This is NOT a greenfield project.

Always inspect the existing implementation before making changes.

---

## Tech Stack

### Frontend

- Next.js App Router
- React
- TypeScript
- Tailwind CSS

### Backend

- Python
- FastAPI
- SQLAlchemy
- PostgreSQL / development database

### Deployment

- Vercel
- Railway
- GitHub

---

# Core Development Principle

Make the smallest reasonable change that correctly solves the requested problem.

Do not rewrite working code unnecessarily.

Prefer:

- modifying existing components
- reusing existing utilities
- reusing existing API functions
- reusing existing types
- extending existing patterns

Avoid:

- unnecessary abstractions
- unnecessary components
- unnecessary dependencies
- duplicated logic
- large refactors without a clear reason
- replacing working implementations simply because another approach looks cleaner

If existing code already solves part of the problem, build on it.

---

# Existing Functionality Must Be Protected

Do not break existing functionality while improving the application.

Preserve:

- backend API integration
- job fetching
- company fetching
- job search
- job filters
- company filters
- job detail routes
- company detail routes
- bookmarks
- analytics
- responsive behavior
- existing navigation
- existing routes

Important routes include:

- /
- /jobs
- /jobs/[id]
- /companies
- /companies/[id]
- /analytics
- /bookmarks

Do not rename or restructure these routes unless explicitly requested.

---

# Backend Rules

Do not modify backend code unless the requested task actually requires backend changes.

Do not change existing API contracts simply to make frontend development easier.

Existing frontend integrations should continue to work.

Before modifying:

- database models
- API response formats
- scrapers
- SQLAlchemy models
- FastAPI routes

explain why the backend change is necessary.

---

# Frontend Rules

Use the existing Next.js App Router architecture.

Use TypeScript.

Use Tailwind CSS for styling.

Prefer existing components over creating new components.

Before creating a new component, check whether an existing component can reasonably be extended.

Keep components readable and focused.

Avoid unnecessary state.

Avoid unnecessary useEffect calls.

Use useMemo only when it improves clarity or avoids meaningful repeated computation.

Do not introduce another state-management library unless explicitly requested.

---

# API Data

Real backend data should be preferred over mock data.

Do not introduce fake statistics when the application already has real data available.

Handle incomplete API data safely.

Examples:

- null salary
- missing technologies
- missing company information
- unknown location
- unknown industry
- empty arrays
- API failures

The UI should fail gracefully instead of crashing.

Never display misleading statistics simply to make the dashboard look populated.

---

# HireScope Design System

The application should feel like a polished professional recruitment analytics product.

The design should communicate:

- professionalism
- clarity
- trust
- data intelligence
- modern software
- restrained visual sophistication

The interface should not look like a generic Tailwind template.

---

## Primary Visual Identity

Primary accent:

#800020

Dark burgundy:

#570013

Warm background:

#FBF9F7

Soft border:

#E0BFBF

Use burgundy intentionally.

Do not make every element burgundy.

The accent should primarily emphasize:

- primary actions
- selected states
- important statistics
- links
- chart highlights
- interactive focus states

---

# UI Design Direction

Improve the visual hierarchy using:

- better typography
- intentional whitespace
- consistent spacing
- refined card proportions
- subtle borders
- subtle shadows
- strong alignment
- clear grouping
- restrained use of accent colors

The design should feel premium but not decorative.

Prefer clean surfaces and hierarchy over adding more visual elements.

---

# Cards

Avoid making every section look like an identical card.

Use cards when they create meaningful grouping.

Cards should generally have:

- subtle borders
- restrained shadows
- consistent padding
- clear hierarchy

Avoid excessive:

- rounded corners
- large shadows
- nested cards
- decorative containers

---

# Typography

Maintain a clear hierarchy between:

- page titles
- section headings
- card titles
- statistics
- body text
- metadata

Important numbers should be visually prominent.

Secondary metadata should remain visually quiet.

Avoid excessive font weights.

---

# Dashboard and Analytics

HireScope is a data-oriented product.

Analytics should prioritize readability over decoration.

Charts and statistics should:

- clearly communicate what is being measured
- use real backend data when available
- handle empty datasets
- handle null salary data
- remain readable on mobile
- avoid misleading scales

Avoid fake trends.

If historical data is unavailable, do not invent historical statistics.

---

# Responsive Design

HireScope must work well on mobile, tablet, and desktop.

Do not design exclusively for desktop.

Check layouts around:

- 375px mobile
- tablet widths
- desktop widths

Avoid:

- horizontal overflow
- clipped text
- unusable filter controls
- oversized headings on mobile
- cramped cards
- tiny interactive targets

Filters and actions should remain usable on mobile.

---

# Accessibility

Use semantic HTML whenever practical.

Buttons must use button elements.

Navigation should use links.

Inputs should have labels or accessible names.

Interactive elements should have clear hover and focus states.

Do not rely only on color to communicate important information.

---

# Icons

Continue using Material Symbols where appropriate.

Do not introduce a new icon library unless necessary.

Avoid emojis as interface icons.

---

# Animation

Animations should be subtle and functional.

Good examples:

- hover transitions
- focus transitions
- small state changes

Avoid:

- excessive motion
- dramatic entrance animations
- bouncing elements
- decorative animation

---

# Dependencies

Do not install packages automatically unless they are clearly necessary.

Before adding a dependency:

1. Check whether the existing stack can solve the problem.
2. Explain why the dependency is necessary.
3. Prefer small and established packages.

Do not replace existing libraries without a strong reason.

---

# Code Quality

Prefer straightforward code over clever code.

Names should clearly communicate intent.

Avoid premature abstraction.

Do not create utility functions for logic used only once unless doing so materially improves readability.

Remove dead code when directly related to the requested change.

Do not perform unrelated cleanup.

---

# Scope Control

Stay focused on the requested task.

Do not modify unrelated files.

Do not redesign unrelated pages.

Do not restructure the project unless explicitly requested.

A request to improve one page does not authorize redesigning the entire application.

---

# Required Workflow Before Editing

Before making significant changes:

1. Inspect the relevant existing files.
2. Understand how the feature currently works.
3. Identify dependencies and shared components.
4. Determine the smallest reasonable set of files that need modification.
5. Briefly explain the proposed changes.
6. Then implement them.

Do not immediately rewrite a file without understanding its current role.

---

# Required Workflow After Editing

After completing a frontend change:

1. Check for TypeScript errors.
2. Check for obvious runtime issues.
3. Preserve existing API behavior.
4. Run the appropriate validation.

For meaningful frontend changes, run:

npm run build

If the build fails, investigate the failure before considering the task complete.

---

# Git Rules

Do not automatically commit.

Do not automatically push.

Do not create branches unless explicitly requested.

After completing a meaningful task, tell the user that the changes are ready to be reviewed.

The user decides when to:

git add .
git commit
git push

---

# Design Improvement Requests

When asked to make a page "more modern", "more polished", "more premium", or similar:

Do NOT interpret that as permission to completely redesign the application.

Instead:

1. Inspect the existing design.
2. Preserve the HireScope identity.
3. Identify the weakest visual areas.
4. Improve typography.
5. Improve spacing.
6. Improve hierarchy.
7. Improve responsive behavior.
8. Improve states and interactions.
9. Remove unnecessary visual clutter.
10. Preserve functionality.

Prefer refinement over replacement.

---

# When Requirements Are Ambiguous

Do not make large assumptions.

For small implementation details, choose the safest option consistent with the existing project.

For decisions that could significantly change:

- architecture
- backend behavior
- database schema
- navigation
- product functionality

ask before proceeding.

---

# Current Priority

HireScope already has a functioning application foundation.

The current priority is:

1. stabilize existing functionality
2. replace remaining mock data with real data
3. improve UI consistency
4. improve responsive design
5. improve loading and error states
6. improve overall product polish
7. prepare the application for deployment

Do not prematurely implement large planned features such as authentication or AI features unless explicitly requested.

---

# Final Principle

HireScope should become better through careful iteration.

Do not confuse more code with better code.

Preserve what works.

Improve what is weak.

Keep changes focused, maintainable, and visually consistent.