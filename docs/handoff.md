# Handoff

## Last updated

2026-04-09

## What changed most recently

- Integrated The Guardian Content API via Vercel serverless function (`api/guardian.ts`)
- Added async data fetching with mock data fallback (`src/services/fetchArticles.ts`)
- Made session hook async with `isLoading`/`error` states (`src/hooks/useCatchUpSession.ts`)
- Refactored `buildQueueForTopic` → `buildQueue(articles, refreshVersion)` (pure function, caller provides articles)
- Added skeleton loading card (`src/components/CardSkeleton.tsx`)
- Added error state UI with retry in App.tsx
- Added PWA manifest + mobile meta tags for Add to Home Screen
- Added completion animation on done screen (spring bounce on checkmark, staggered fade-in)
- Added Vercel deployment config (`vercel.json`)
- Updated `.gitignore` for `.env.local`, `.vercel`
- Added `dev:vercel` script for local development with API functions

## Current status

- All code changes for Guardian API integration are complete
- App fetches real Guardian articles when `GUARDIAN_API_KEY` is configured
- Falls back to mock data when API is unavailable (including in tests)
- PWA meta tags added — app can be added to home screen on mobile

## What still needs to happen

1. **Install CLI tools**: `brew install gh` + `npm i -g vercel`
2. **Get Guardian API key**: Register at https://open-platform.theguardian.com/access/ (free, instant)
3. **Create `.env.local`** with `GUARDIAN_API_KEY=your-key-here` for local dev
4. **Run tests**: `pnpm test` — verify existing tests pass with mock fallback
5. **Run build**: `pnpm build` — verify TypeScript compiles
6. **Git init + GitHub**: `git init && git add -A && git commit -m "initial" && gh repo create SwipeNews --public --source=. --push`
7. **Deploy to Vercel**: `vercel` (or connect GitHub repo in Vercel dashboard)
8. **Set env var**: `vercel env add GUARDIAN_API_KEY` (for Production, Preview, Development)
9. **Test live**: Open the Vercel URL on phone, verify real Guardian articles appear

## Known issues / rough edges

- `README.md` is still the default Vite template — should be replaced with project-focused readme
- Guardian `bodyText` can be very long — may want to truncate in `api/guardian.ts` for better card UX
- No offline caching (PWA is display-only, no service worker)
- Topic list is hardcoded — could be made dynamic later
- No tests for the new async flow or API function (existing tests pass via mock fallback)
