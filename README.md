# Cook.io

A recipe discovery web app built with the Next.js App Router, React, and TypeScript, powered by the [Edamam Recipe API](https://developer.edamam.com/edamam-recipe-api).

**[Live Demo](https://cook.billalbenz.com)** · **[Repository](https://github.com/billalben/cook.io-recipe-next)**

---

## Overview

Cook.io lets users search and browse thousands of recipes by meal type, cuisine, diet, health preference, cooking time, calorie range, and ingredient count. It is a server-rendered, fully responsive application with saved recipes, dark mode, infinite scrolling, and a small set of dependency-free UI primitives.

The Edamam credentials live exclusively on the server. Every browser request is routed through internal API route handlers, so the upstream API key is never shipped to the client — one of several deliberate engineering decisions covered in [Technical Highlights](#technical-highlights).

## Key Features

- **Search** — full-text recipe search from the home hero or the filter sidebar.
- **Meal-type tabs** — breakfast, lunch, dinner, snack, and teatime tabs with per-tab lazy loading and client-side caching.
- **Cuisine carousels** — horizontally scrollable Asian and French recipe sections with drag/swipe support and arrow navigation.
- **Health-preference browsing** — quick links for 40+ health tags (vegan, gluten-free, keto-friendly, etc.).
- **Faceted filtering** — sidebar filters for cooking time, ingredient count, and calories (single-select) plus diet, health, meal type, dish type, and cuisine (multi-select), all reflected in the URL.
- **Infinite scroll** — paginated results loaded via `IntersectionObserver`, with deduplication and inline retry on failure.
- **Recipe detail pages** — server-rendered details with ingredient list, nutrition/time stats, tag links, and per-recipe OpenGraph metadata.
- **Saved recipes** — bookmark recipes to a dedicated page; state is persisted in `localStorage` and synchronised across components.
- **Light / dark theme** — toggle with system-preference detection and session persistence.
- **Responsive layout** — desktop header with a mobile bottom navigation bar and an off-canvas mobile filter drawer.
- **Resilient UX** — skeleton loading states, empty states, dedicated 404 pages, and friendly handling of API rate limits.

## Tech Stack

| Category | Technology |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org) (App Router, Server Components, Route Handlers) |
| UI | [React 19](https://react.dev) |
| Language | [TypeScript 5](https://www.typescriptlang.org) (strict mode) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) (CSS-first `@theme` tokens) |
| Validation | [Zod v4](https://zod.dev) |
| Icons | [lucide-react](https://lucide.dev) |
| Tooling | ESLint 9 (flat config), pnpm |

## Architecture

```
Browser ──▶ /api/recipes[/:id]  ──▶  lib/edamam.ts  ──▶  Edamam Recipe API
             (Route Handlers)          (fetch + Zod)      (credentials server-side)
```

The client never talks to Edamam directly. Next.js Route Handlers under `app/api/recipes` proxy requests, attach the API credentials, validate upstream responses, and return sanitised JSON. Pagination links returned by Edamam are rewritten into internal `/api/recipes` URLs, so `app_id` / `app_key` never leak into the browser.

## Project Structure

```
app/
  api/recipes/route.ts          # Recipe list proxy (search, filters, pagination)
  api/recipes/[id]/route.ts     # Recipe detail proxy
  detail/[id]/                  # Server-rendered recipe page + metadata, loading, not-found
  recipes/                      # Filterable results page with client-side infinite scroll
  saved/                        # Saved recipes page
  layout.tsx                    # Root layout: fonts, theme, header, snackbar
  page.tsx                      # Home page
  globals.css                   # Tailwind theme tokens, dark mode, animations
components/                     # UI: header, hero, tabs, carousels, filter bar, cards, etc.
hooks/                          # useSavedRecipes, useInfiniteScroll
lib/
  api.ts                        # Edamam URL builder
  edamam.ts                     # Fetch layer, error mapping, cache headers
  schemas.ts                    # Zod schemas and inferred types
  filter-data.ts                # Filter definitions and constants
  filter-validation.ts          # Input sanitisation and allowlisting
  types.ts / utils.ts           # Shared types and helpers
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) 20 or later
- [pnpm](https://pnpm.io)

### Setup

```bash
git clone https://github.com/billalben/cook.io-recipe-next.git
cd cook.io-recipe-next
pnpm install
cp .env.example .env
```

Add your Edamam credentials to `.env` (see below), then start the dev server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Create a `.env` file in the project root. Free credentials are available from the [Edamam Developer Portal](https://developer.edamam.com/).

| Variable | Description |
| --- | --- |
| `EDAMAM_APP_ID` | Your Edamam application ID |
| `EDAMAM_APP_KEY` | Your Edamam application key |
| `EDAMAM_BASE_URL` | Edamam Recipe API base URL, e.g. `https://api.edamam.com/api/recipes/v2` |

## Available Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the development server |
| `pnpm build` | Create a production build |
| `pnpm start` | Run the production build |
| `pnpm lint` | Run ESLint |

## Technical Highlights

- **Credential isolation** — Edamam keys are server-only; all client traffic goes through Route Handlers. Pagination URLs are rewritten to strip credentials before reaching the browser.
- **End-to-end input sanitisation** — `lib/filter-validation.ts` allowlists every filter value, caps query length, enforces single-select semantics for radio filters, validates recipe IDs, and bounds pagination tokens and request field lists.
- **Resilient upstream parsing** — Zod `safeParse` with `.loose()` objects and `.catch()` defaults tolerates Edamam schema drift, while malformed hits are silently dropped instead of breaking a page.
- **Two-layer caching** — `fetch` uses Next.js `revalidate` with a cache tag, and responses set `Cache-Control: public, s-maxage=86400, stale-while-revalidate=604800`.
- **Client-side pagination** — infinite scroll via `IntersectionObserver` with request de-duplication, merge-time deduping by recipe URI, and per-section retry handling.
- **Zero-dependency UI primitives** — the carousel (drag, swipe, arrow step, resize-aware), accordion, and snackbar are custom-built, keeping the dependency footprint minimal.
- **Strict typing throughout** — TypeScript strict mode with no `any`, API response types inferred from the Zod schemas.

## Future Improvements

- Automated testing (unit and end-to-end) for the API proxy and critical user flows.
- User accounts with server-side persistence for saved recipes.
- Pagination for the saved-recipes page.
- Accessibility audit and internationalisation.

## Acknowledgements

- Recipe data provided by [Edamam](https://www.edamam.com).
- Built by [Billal Ben](https://github.com/billalben).
