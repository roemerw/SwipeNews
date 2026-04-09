# AGENTS.md

This repo is `Catch up`: a mobile-first React app for quickly reviewing one fast-moving news topic at a time through a swipeable queue, in-app reader sheet, undo, refresh, and a short completion summary.

The app fetches real articles from The Guardian via a Vercel serverless function (`api/guardian.ts`), with automatic fallback to local mock data if the API is unavailable.

Before editing, inspect the existing implementation and tests to understand current behavior. Preserve working code where possible, keep changes scoped to the task at hand, and prefer extending the existing structure over introducing new architectural layers.

## Commands
- `pnpm dev` — frontend only (uses mock data fallback since no API server)
- `pnpm dev:vercel` — frontend + serverless functions (needs `.env.local` with `GUARDIAN_API_KEY`)
- `pnpm build`
- `pnpm lint`
- `pnpm test`

## Architecture
- Stack: `React 19 + Vite + TypeScript + Tailwind CSS + Framer Motion`
- **API layer**: `api/guardian.ts` is a Vercel serverless function that proxies The Guardian Content API. Topic-to-query mapping is server-side. Env var: `GUARDIAN_API_KEY`.
- **Fetch layer**: `src/services/fetchArticles.ts` calls `/api/guardian` with fallback to `src/data/articles.ts` mock data
- **Session state**: `src/hooks/useCatchUpSession.ts` — async `start()`/`refresh()` with `isLoading`/`error` states
- **Queue**: `src/utils/mockQueue.ts` — `buildQueue(articles, refreshVersion)` is pure/synchronous, accepts pre-fetched articles
- **Data**: `src/data/articles.ts` (Article interface + mock seeds), `src/data/topics.ts` (hardcoded topics)
- **Components**: `src/components/` — presentational, including `CardSkeleton` for loading state
- **PWA**: `public/manifest.json` + meta tags in `index.html` — standalone mode on mobile
- **Deployment**: Vercel, auto-deploy from GitHub, `GUARDIAN_API_KEY` in Vercel env vars

## Conventions
- Tests cover user-visible behavior; they rely on mock data fallback (no fetch mocking). If behavior changes, update tests.
- The `Article` interface is shared between `api/guardian.ts` and all frontend code — keep it stable.
- Mock data in `src/data/articles.ts` is kept as fallback and for tests — do not remove it.

## Remaining work (if continuing)
See `docs/handoff.md` for current status and next tasks.
