# Algorithm Visualizer — Refactor Plan

## Overview

Refactor the Algorithm Visualizer from a monolithic React SPA into a **frontend + lightweight backend** architecture. The backend serves as a content management layer (algorithm metadata, docs, code snippets) backed by SQLite. The frontend remains a React SPA that fetches content from the API. Algorithm execution logic stays on the frontend as pure functions.

**Goal**: After this refactor, the app must work exactly as it does now — same routes, same visualizations, same UI — but with cleaner architecture, lazy-loaded visualizers, TailwindCSS, and a content API.

---

## Current Repository

```
REPO_URL: https://github.com/AdelShalan/Algorithm-visualizer
```

The agent MUST create a new branch from `master` (or the default branch) before making any changes. Never commit to the default branch directly.

```bash
git checkout -b refactor/frontend-backend-split
```

---

## Target Architecture

```
algorithm-visualizer/
├── frontend/                    # React SPA → Vercel
│   ├── src/
│   │   ├── api/
│   │   │   └── client.ts        # fetch wrapper with error handling
│   │   ├── components/          # Nav, Home, Landing, Docs, Controls, etc.
│   │   ├── visualizers/         # lazy-loaded per algorithm
│   │   ├── algorithms/          # pure algorithm logic (generateSteps functions)
│   │   ├── contexts/            # AlgorithmContext (animation engine)
│   │   ├── hooks/               # useAlgorithmData, etc.
│   │   └── App.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── vitest.config.js
│   ├── playwright.config.ts
│   └── tests/
│       └── e2e/
│           ├── landing.spec.ts
│           ├── browse.spec.ts
│           └── visualize.spec.ts
│
├── backend/                     # Hono API → Railway
│   ├── src/
│   │   ├── index.ts             # Hono app entry
│   │   ├── routes/
│   │   │   ├── content.ts       # GET /api/algorithms, /api/docs
│   │   │   ├── content.test.ts  # endpoint tests
│   │   │   ├── admin.ts         # POST /api/admin/* (basic auth)
│   │   │   └── admin.test.ts
│   │   └── db/
│   │       ├── client.ts        # better-sqlite3 connection
│   │       ├── schema.sql       # CREATE TABLE statements
│   │       ├── seed.ts          # migrate current data → SQLite
│   │       └── seed.test.ts
│   ├── data/                    # SQLite file (gitignored)
│   ├── vitest.config.ts
│   └── package.json
│
├── shared/
│   └── types.ts                 # API response types
│
├── package.json                 # root workspace config
└── AGENTS.md
```

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Frontend framework | React 19 + Vite (keep existing) |
| Frontend routing | React Router 7 |
| Frontend styling | TailwindCSS 4 (replace inline styles) |
| Backend framework | Hono + @hono/node-server |
| Backend database | SQLite via better-sqlite3 |
| Backend validation | Zod |
| Testing (unit) | Vitest |
| Testing (components) | Vitest + @testing-library/react |
| Testing (E2E) | Playwright |
| Frontend deploy | Vercel |
| Backend deploy | Railway |

---

## Database Schema

```sql
CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT,
  difficulty TEXT
);

CREATE TABLE algorithms (
  id TEXT PRIMARY KEY,
  category_id TEXT NOT NULL REFERENCES categories(id),
  name TEXT NOT NULL,
  description TEXT,
  complexity TEXT,
  stability TEXT,
  insight TEXT
);

CREATE TABLE algorithm_steps (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  algorithm_id TEXT NOT NULL REFERENCES algorithms(id),
  step_order INTEGER NOT NULL,
  text TEXT NOT NULL
);

CREATE TABLE code_snippets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  algorithm_id TEXT NOT NULL REFERENCES algorithms(id),
  language TEXT NOT NULL,
  filename TEXT NOT NULL,
  code TEXT NOT NULL
);

CREATE TABLE docs (
  id TEXT PRIMARY KEY,
  tag TEXT,
  title TEXT NOT NULL,
  description TEXT,
  read_time TEXT,
  difficulty TEXT,
  updated TEXT,
  views TEXT
);

CREATE TABLE doc_sections (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  doc_id TEXT NOT NULL REFERENCES docs(id),
  section_id TEXT NOT NULL,
  title TEXT,
  type TEXT,
  content TEXT
);
```

---

## API Endpoints

### Public Content API

```
GET /api/algorithms                → { categories: [{ id, name, algorithms: [...] }] }
GET /api/algorithms/:category/:id  → { id, name, category, description, complexity, stability, insight, steps, code }
GET /api/docs                      → { docs: [{ id, tag, title, description, ... }] }
GET /api/docs/:id                  → { id, tag, title, description, sections: [...] }
```

### Admin API (Basic Auth)

```
POST /api/admin/algorithms/:id     → update algorithm content
POST /api/admin/docs/:id           → update doc content
```

All errors return: `{ error: { code: string, message: string } }`

---

## Environment Variables

### Frontend
```
VITE_API_URL=http://localhost:3001
```

### Backend
```
NODE_ENV=development
PORT=3001
DATABASE_PATH=./data/algorithms.db
ADMIN_PASSWORD=changeme
```

---

## Execution Phases

### Phase 1: Scaffold + Backend

#### Step 1.1: Create workspace root
- Create `package.json` at project root with `workspaces: ["frontend", "backend"]`
- Move existing project files into `frontend/` directory
- Update all import paths accordingly

#### Step 1.2: Scaffold backend
- `cd backend && npm init -y`
- Install: `hono @hono/node-server better-sqlite3 zod`
- Install dev: `vitest typescript @types/better-sqlite3 @types/node`
- Create `tsconfig.json`
- Create `vitest.config.ts`

#### Step 1.3: Database schema + seed
- Write `backend/src/db/schema.sql`
- Write `backend/src/db/client.ts` — better-sqlite3 connection
- Write `backend/src/db/seed.ts` — reads current `frontend/src/data/*` files, inserts into SQLite
- Write `backend/src/db/seed.test.ts` — run seed, verify counts match source data

#### Step 1.4: API routes
- Write `backend/src/routes/content.ts` — implement all GET endpoints
- Write `backend/src/routes/content.test.ts` — test each endpoint (happy path + 404s)
- Write `backend/src/routes/admin.ts` — basic auth protected POST endpoints
- Write `backend/src/routes/admin.test.ts` — test auth rejection + successful update

#### Step 1.5: Backend entry point
- Write `backend/src/index.ts` — Hono app, CORS, route mounting, error middleware
- Verify: `npm run dev` starts server, endpoints return correct data

---

### Phase 2: Frontend Restructure

#### Step 2.1: Move files into new structure
```
frontend/src/
├── api/client.ts              # NEW — fetch wrapper
├── algorithms/                # NEW — extracted from visualizers
│   ├── sorting/
│   │   ├── bubble-sort.ts
│   │   └── ...
│   └── index.ts
├── components/                # EXISTING — Nav, Home, Landing, Docs, etc.
├── visualizers/               # EXISTING — all visualizer components
├── contexts/                  # EXISTING — AlgorithmContext
├── hooks/                     # NEW — useAlgorithmData
└── App.jsx                    # MODIFIED — lazy-loaded visualizers
```

#### Step 2.2: API client
- Write `frontend/src/api/client.ts` — fetch wrapper with base URL from `VITE_API_URL`
- Functions: `fetchAlgorithms()`, `fetchAlgorithm(category, id)`, `fetchDocs()`, `fetchDoc(id)`
- Error handling: throw `APIError` with status + message

#### Step 2.3: Replace static data with API calls
- `Home.jsx`: replace `import { categories } from '../data/algorithms'` with `useAlgorithmData()` hook
- `Landing.jsx`: same pattern
- `Docs.jsx`: same pattern
- `AlgorithmPage.jsx`: same pattern
- Add loading states (skeleton UI) for each page

#### Step 2.4: Lazy-load visualizers
- Replace direct imports with `React.lazy()` + dynamic imports
- Add `<Suspense fallback={<LoadingSkeleton />}>` wrapper
- Visualizers only load when their route is visited

#### Step 2.5: Extract algorithm logic
- For each visualizer, extract the `generateSteps()` function into `frontend/src/algorithms/`
- Example: `BubbleSort.jsx` → `algorithms/sorting/bubble-sort.ts`
- Visualizer imports the pure function instead of defining it inline
- No React imports in algorithm files — pure functions only

#### Step 2.6: Replace inline styles with Tailwind
- One component at a time, starting with smallest
- Keep CSS custom properties for theme colors (already in `index.css`)
- Run app after each component to verify no visual regressions
- Priority order: Nav → Controls → AlgoCard → Home → Landing → Docs → Visualizers

---

### Phase 3: Testing

#### Step 3.1: Backend tests
- `backend/src/routes/content.test.ts` — all GET endpoints
- `backend/src/routes/admin.test.ts` — auth + POST endpoints
- `backend/src/db/seed.test.ts` — seed integrity

#### Step 3.2: Algorithm logic tests
- `frontend/src/algorithms/sorting/bubble-sort.test.ts` — known input → known output
- Test each algorithm's `generateSteps()` function
- Verify final sorted/searched state matches expected result

#### Step 3.3: Component tests
- `frontend/src/components/Controls.test.jsx` — play/pause/step/reset
- `frontend/src/components/Nav.test.jsx` — links, breadcrumb
- `frontend/src/components/Home.test.jsx` — category filter, search

#### Step 3.4: E2E tests
- `tests/e2e/landing.spec.ts` — page loads, hero visible, category cards render
- `tests/e2e/browse.spec.ts` — filter by category, navigate to algorithm
- `tests/e2e/visualize.spec.ts` — play, pause, step through animation

---

### Phase 4: Deployment Config

#### Step 4.1: Frontend (Vercel)
- Add `vercel.json` with SPA rewrite rule
- Add `.env.production` with `VITE_API_URL` pointing to Railway backend

#### Step 4.2: Backend (Railway)
- Add `Dockerfile` for Railway deployment
- Add `.env.production` template
- Ensure `data/` directory is created and SQLite file persists

#### Step 4.3: Root scripts
```json
{
  "scripts": {
    "dev:frontend": "cd frontend && npm run dev",
    "dev:backend": "cd backend && npm run dev",
    "dev": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\"",
    "test:backend": "cd backend && npm test",
    "test:frontend": "cd frontend && npm test",
    "test:e2e": "cd frontend && npx playwright test",
    "test": "npm run test:backend && npm run test:frontend",
    "build:frontend": "cd frontend && npm run build",
    "build:backend": "cd backend && npm run build",
    "seed": "cd backend && npm run seed"
  }
}
```

---

## Sub-Agent Delegation Strategy

The main agent should delegate parallelizable work to sub-agents. Here's the breakdown:

### Parallel Group 1: Backend Foundation
```
Sub-agent A: Scaffold backend + database
  - Create backend/ directory structure
  - Install dependencies
  - Write tsconfig.json, vitest.config.ts
  - Write schema.sql
  - Write client.ts
  - Write seed.ts

Sub-agent B: Shared types + API client
  - Create shared/types.ts
  - Create frontend/src/api/client.ts
  - Write client tests
```

### Parallel Group 2: Backend Routes
```
Sub-agent C: Content API routes
  - Write routes/content.ts
  - Write routes/content.test.ts

Sub-agent D: Admin API routes
  - Write routes/admin.ts
  - Write routes/admin.test.ts
```

### Parallel Group 3: Frontend Components (Tailwind migration)
```
Sub-agent E: Migrate small components
  - Nav.jsx → Tailwind
  - Controls.jsx → Tailwind
  - AlgoCard → Tailwind

Sub-agent F: Migrate page components
  - Home.jsx → Tailwind
  - Landing.jsx → Tailwind
  - Docs.jsx → Tailwind
```

### Parallel Group 4: Algorithm Extraction + Tests
```
Sub-agent G: Extract sorting algorithms
  - Extract all sorting/ visualizers' generateSteps() into algorithms/sorting/
  - Write tests for each

Sub-agent H: Extract searching/graph/dp algorithms
  - Same pattern for remaining categories
```

### Sequential Steps (main agent handles)
1. Phase 1.1 — Move files into frontend/ (must happen first)
2. Phase 2.3 — Wire up API calls (depends on backend being complete)
3. Phase 2.4 — Lazy-load visualizers (depends on restructure)
4. Phase 4 — Deployment config (depends on everything else)
5. Final verification — run full test suite, manual smoke test

---

## Verification Checklist

After all phases are complete, verify:

- [ ] `npm run dev` starts both frontend and backend
- [ ] Frontend loads at `http://localhost:5173`
- [ ] Landing page renders hero, category cards, how-it-works section
- [ ] `/algorithms` page shows all categories and algorithm cards
- [ ] Category filter works (click category → only shows those algorithms)
- [ ] Search filter works (type → filters algorithm cards)
- [ ] Click any algorithm card → navigates to visualization page
- [ ] Visualization page loads with controls (play, pause, step, reset, speed)
- [ ] Play animation works — steps advance, visual updates
- [ ] Pause/resume works
- [ ] Step forward/backward works
- [ ] Speed slider works
- [ ] Shuffle/regenerate input works
- [ ] `/docs` page loads with sidebar and content
- [ ] Doc navigation works (sidebar → different docs)
- [ ] All routes from the original app still work
- [ ] `npm test` passes (backend + frontend unit tests)
- [ ] `npm run test:e2e` passes (Playwright)
- [ ] No console errors in browser dev tools
- [ ] Page load is faster than before (lazy loading)
- [ ] `npm run build:frontend` produces a valid build
- [ ] `npm run build:backend` produces valid output

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Seed script loses data | Verify row counts match source data files after seed |
| Tailwind migration breaks UI | One component at a time, visually verify after each |
| Lazy loading breaks routes | Keep Suspense fallback, test every route |
| API not ready when frontend needs it | Backend routes are completed before frontend wiring |
| Tests pass but app broken | Manual smoke test checklist above is mandatory |

---

## Important Constraints

1. **Never modify the default branch** — always work on `refactor/fe-be-split`
2. **Never lose existing functionality** — every route, every visualizer, every feature must work after refactor
3. **Never introduce breaking changes to the UI** — visual appearance should be identical or improved
4. **Test before committing** — run relevant tests after each phase
5. **Commit incrementally** — one commit per logical step, not one massive commit at the end
6. **If stuck, ask** — don't guess on ambiguous decisions

---

## Quick Reference: Current Data Files to Migrate

These files contain all the static data that needs to be seeded into SQLite:

| Source File | Target Table(s) |
|-------------|-----------------|
| `src/data/algorithms.js` | `categories`, `algorithms` |
| `src/data/algorithmDetails.js` | `algorithms` (insight, steps), `algorithm_steps` |
| `src/data/algorithmCodeSnippets.js` | `code_snippets` |
| `src/data/docsContent.js` | `docs`, `doc_sections` |

The seed script must read these files, parse their exports, and insert matching rows. Verify counts after seeding.
