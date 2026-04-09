# Project Spec

## Project name

`Catch up`

## Product / project summary

This repo appears to contain a mobile-first front-end prototype for a focused news catch-up experience. Instead of a generic feed, the product centers on one topic at a time and lets the user work through a finite queue of topic-relevant updates using swipe gestures or action buttons, then finish with an explicit sense of closure.

The implementation currently uses mocked local data only. Based on the code, the concept is intentionally demo-oriented and designed to be understandable quickly.

## Current goal

The current practical goal seems to be a polished, demo-ready prototype that can communicate the product idea end to end without requiring a backend or live news integration.

## Core user flow or system behavior

1. User lands on a topic selection screen.
2. User selects one of seven hardcoded topic chips.
3. User starts a catch-up session for that topic.
4. User moves through a queue of 10 mocked articles.
5. Each item can be processed as:
   - `Mark as read`
   - `Keep unread` / skip for now
6. User can tap the active card to open an in-app reader sheet.
7. User can undo processed actions in LIFO order.
8. User can refresh:
   - on the topic screen to reseed freshness cues
   - in the queue to restart the current topic session
   - on the done screen to start the topic again
9. After all 10 items are processed, the app shows a completion state with a small session summary.

Additional behavior currently implemented:
- keyboard support on queue screen
- stacked-card visual hint for the next item
- spring-based card and sheet motion

## In-scope

- Front-end prototype behavior
- Local mocked topics and articles
- Session logic for queue progression, undo, reader state, and refresh
- Mobile-first UI that still works on desktop in a centered frame
- Focused behavior tests around visible product behavior

## Out-of-scope

The current repo does not implement:
- backend or live feeds
- auth
- persistence
- settings
- source management
- routing / multi-page navigation
- user accounts or saved state

## Stack / architecture as currently inferred

- `React 19`
- `Vite`
- `TypeScript`
- `Tailwind CSS`
- `Framer Motion`
- `Vitest` + `React Testing Library`
- local static images in `public/images`

Architecture is intentionally simple:
- `src/data/*` holds typed mock content
- `src/hooks/useCatchUpSession.ts` owns session state and actions
- `src/components/*` holds presentational UI pieces
- `src/App.tsx` composes the screen states and keyboard interactions

## Key UX / behavior rules

Grounded in current code and tests:

- The app is single-flow and topic-focused, not feed-oriented.
- Only one active card is interactive at a time.
- Right action/swipe maps to read; left action/swipe maps to kept unread.
- Reader opens only from the active card and blocks queue actions while open.
- Undo is multi-step and restores the last processed item as the active card.
- Topic selection persists when going back from queue to topics.
- Refresh is a reseed/restart mechanism, not a live network fetch.
- Completion should feel explicit: the user sees both a done message and a short session summary.

Visual conventions currently visible:
- blue-toned shell
- white cards / sheets
- compact rounded corners
- mobile-frame layout on desktop

## Current implementation status

What already exists:
- working topic selection screen
- hardcoded topic list
- mocked article data for all seven topics
- active queue with 10 items per topic
- swipe/button processing
- reader sheet
- undo
- refresh behavior across screens
- done state with summary
- keyboard shortcuts
- tests covering the main flow

What is also true of the repo today:
- `README.md` is still the default Vite template and does not describe the product
- `dist/` is present in the repo, which suggests built artifacts are currently committed or at least not ignored here

## Known gaps / rough edges

Based on the current implementation:

- Product context was not previously documented in-repo; behavior lived mostly in code/tests.
- The mocked data is editorially varied but still synthetic.
- Local images are placeholder SVG illustrations, not real editorial thumbnails.
- No live data layer exists yet, though the current structure appears designed to allow one later.
- There is no browser E2E or visual regression coverage in-repo at the moment.
- The default README likely needs replacement or cleanup later.
- Because `dist/` exists in the repo, repository hygiene conventions may still need explicit clarification.

## Next likely milestones

Likely next steps, based on the current codebase shape:

1. Replace or augment mocked data with a live topic/article source while preserving the existing `Topic` / `Article` interfaces where practical.
2. Clarify repo hygiene:
   - whether `dist/` should remain committed
   - whether the default `README.md` should be replaced with product docs
3. Add deeper UX polish and QA around gestures and mobile-browser behavior.
4. Add broader test coverage if the app starts handling live data, errors, loading states, or more complex session behavior.
