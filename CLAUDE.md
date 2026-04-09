# CLAUDE.md

This repo is `Catch up`, a mobile-first swipeable news catch-up app focused on one topic at a time. Read [docs/project-spec.md](docs/project-spec.md) first before major edits.

Inspect the current implementation and tests before changing behavior. Preserve working code where possible, prefer small scoped changes, and extend the existing data/session/component structure instead of rebuilding it.

## Commands
- `pnpm dev` — frontend only (mock data fallback)
- `pnpm dev:vercel` — frontend + API serverless functions (requires `.env.local` with `GUARDIAN_API_KEY`)
- `pnpm build`
- `pnpm lint`
- `pnpm test`

## Architecture

### Data flow
1. User selects a topic on the topic screen
2. `useCatchUpSession.start(topicId)` calls `fetchArticlesForTopic(topicId)` (in `src/services/fetchArticles.ts`)
3. `fetchArticlesForTopic` hits `/api/guardian?topicId=xxx` — a Vercel serverless function that proxies The Guardian's Content API
4. On API failure, falls back to local mock data in `src/data/articles.ts`
5. Articles are passed to `buildQueue(articles, refreshVersion)` for rotation/freshness
6. Queue is rendered as swipeable cards

### Key files
- `api/guardian.ts` — Vercel serverless function, maps topic IDs to Guardian search queries, transforms responses to `Article` interface
- `src/services/fetchArticles.ts` — async fetch with mock fallback
- `src/hooks/useCatchUpSession.ts` — session state machine (async `start`/`refresh`, `isLoading`/`error` states)
- `src/utils/mockQueue.ts` — pure function `buildQueue(articles, refreshVersion)` for rotation + freshness offset
- `src/data/articles.ts` — `Article` interface + mock data (used as fallback)
- `src/data/topics.ts` — hardcoded topic list

### Deployment
- Hosted on Vercel (free tier)
- `GUARDIAN_API_KEY` env var set in Vercel dashboard
- Auto-deploys from GitHub on push
- PWA manifest at `public/manifest.json` — can be added to home screen

## Notes
- The `Article` interface is the contract between API and UI — do not change it without updating both `api/guardian.ts` and the components
- Tests use mock data fallback (fetch fails in test env → `getArticlesForTopic` kicks in) — no fetch mocking needed
- Topic-to-Guardian-query mapping is server-side only (in `api/guardian.ts`)
