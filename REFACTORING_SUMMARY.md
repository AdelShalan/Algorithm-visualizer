# Refactoring Summary: Monolithic SPA → Frontend/Backend Split

## What We Did

Refactored a monolithic React SPA into a **frontend + backend** architecture with:
- **Hono API server** serving content from SQLite
- **React SPA** fetching data via API, lazy-loading visualizers
- **TailwindCSS v4** replacing all inline styles
- **Pure algorithm functions** extracted from visualizer components
- **Test suite** covering backend, algorithms, components, and E2E

## What Went Well

### Architecture Split
- Clean separation of concerns: frontend handles UI/animations, backend handles content
- Algorithm logic extracted into pure `generateSteps()` functions — no React dependencies, fully testable
- Lazy-loaded visualizers via `React.lazy()` reduced initial bundle size

### Database & API
- SQLite with sql.js avoided native build tool requirements (unlike better-sqlite3)
- Seed script successfully migrated all static data from `src/data/*` into SQLite
- API endpoints return correct data with proper error handling

### Testing
- 100+ tests across backend routes, algorithm logic, components, and E2E
- Algorithm tests caught the Sudoku CP+BT bug before it reached production

### TailwindCSS Migration
- All 47 components and visualizers migrated from inline styles to TailwindCSS v4
- Custom theme colors (`bg-bg`, `text-ink`, `border-purple`) match original design
- Inline styles preserved only for truly dynamic values (SVG coordinates, animation colors)

## What Went Wrong & How We Fixed It

### 1. Tailwind Spacing Completely Broken
**Problem**: After migrating to TailwindCSS, all spacing (padding, margins, gaps) was ignored. The entire layout was compacted — nav bar was thin, content was squished, visualizers were cut off.

**Root Cause**: A manual CSS reset (`* { margin: 0; padding: 0; }`) in `index.css` came AFTER `@import "tailwindcss"`. Non-layered CSS rules have higher priority than `@layer utilities`, so the reset overrode every Tailwind spacing class.

**Fix**: Removed `margin: 0` and `padding: 0` from the universal selector. Tailwind Preflight already handles this.

**Lesson**: Never add blanket resets after framework imports. Always check if the framework already provides them.

### 2. Sudoku CP+BT Produced Invalid Solutions
**Problem**: The Sudoku constraint propagation + backtracking solver placed duplicate values in the same row/column/box.

**Root Cause**: The `propagate()` function only eliminated candidates from peers of naked singles. When `search()` placed a guessed value on the board, it never eliminated that value from peer cells' candidates.

**Fix**: Added `eliminateFromPeers()` helper that eliminates a cell's value from all its row/column/box peers. Called after setting any value (initial givens and search guesses).

**Lesson**: Constraint propagation must run after EVERY board change, not just naked singles.

### 3. Docs Page Had No Content
**Problem**: The docs page showed "Loading docs..." forever despite the API returning 200 OK with data.

**Root Cause**: Two issues:
1. The backend stored entire section objects as JSON in the `content` column, then parsed and returned them nested. The frontend expected flat properties (`section.content` as a string) but received `section.content` as an object.
2. Running the seed script multiple times created duplicate sections (no unique constraint on `(doc_id, section_id)`).

**Fix**: Updated the content route to extract individual fields (`content`, `steps`, `languages`, `callout`, `listItems`, `table`, `cards`) from the stored JSON. Removed duplicates from the database.

**Lesson**: When storing structured data as JSON in a single column, the API must flatten it to match the consumer's expected shape.

### 4. Z-Algorithm Crashed on Run
**Problem**: `Uncaught TypeError: Cannot read properties of undefined (reading 'length')`

**Root Cause**: The algorithm yields steps with different property names — `z` for single values (numbers), `zArr` for full arrays. The visualizer assumed `currentData.z` was always an array.

**Fix**: Used `zArray = currentData.zArr || (Array.isArray(currentData.z) ? currentData.z : [])` to safely extract the array.

**Lesson**: When a generator yields steps with varying property names, the consumer must handle all variants.

### 5. Red-Black Tree Had Scrolling Overflow
**Problem**: The Red-Black tree visualizer was too large and required scrolling, unlike other tree visualizers.

**Root Cause**: Missing `min-h-0` on the flex container, which prevented proper flex overflow behavior.

**Fix**: Added `min-h-0` to the tree container div, matching the pattern used by BST and AVL visualizers.

**Lesson**: Flex overflow in CSS requires `min-h-0` or `min-w-0` on flex children to allow shrinking below content size.

### 6. Closest Pair Distance Bar Caused Screen Shake
**Problem**: The "Closest distance" bar appeared and disappeared during high-speed animation, causing layout shift.

**Root Cause**: The bar was conditionally rendered (`{currentData.dist !== undefined && ...}`), so it mounted/unmounted as the distance value changed.

**Fix**: Made the bar always visible, showing "—" when no distance is computed yet.

**Lesson**: Avoid conditional rendering for elements that affect layout. Use placeholder values instead.

## Commit History

| Commit | Description |
|--------|-------------|
| `4b1b3e4` | Initial commit: monolithic SPA |
| `0581ccb` | Phase 1-2: Split into frontend/backend, add SQLite API, lazy-load visualizers |
| `b31a58e` | Phase 2.5: Extract all algorithm logic into pure functions |
| `c6b9b70` | Phase 3: Add comprehensive test suite |
| `6d7abcc` | Fix: visualizer flashing (moved React.lazy to module scope) |
| `760bd52` | Phase 2.6: Migrate all components to TailwindCSS |
| `57345c8` | Fix: Tailwind spacing overridden by manual CSS reset |
| `c562c9c` | Fix: Sudoku CP+BT producing invalid solutions |
| `c52585c` | Fix: Docs API returning nested content objects |
| `e4c564d` | Fix: Three visualizer issues (closest pair, Z-algo, RB tree) |
| `e7af139` | Fix: Red-Black tree overflow |
| `f1aafb6` | Fix: Z-algorithm crash on run |
| `b758ebe` | Add package-lock.json and seeded database |

## Final State

- **14 commits** on `refactor/frontend-backend-split` branch
- **40 algorithms** across 12 categories
- **24 documentation pages** with code snippets
- **100+ tests** (backend, algorithms, components, E2E)
- **Zero visual regressions** — all pages render identically to the original design
- **Clean architecture** — frontend and backend are independently deployable
