# AlgoVis — Algorithm Visualizer

An interactive, real-time algorithm visualization platform built with React, Vite, and a lightweight Hono + SQLite backend. Explore how algorithms work step-by-step with beautiful, animated visualizations.

## Features

### Tree Operations
- **Binary Search Tree (BST)** — Insert, search, and visualize traversal with step-by-step highlighting
- **AVL Tree** — Self-balancing tree with real-time rotation detection (left, right, left-right, right-left)
- **Red-Black Tree** — Color-balanced tree with violation detection and black-height validation
- **Trie (Prefix Tree)** — String insertion, search, and path highlighting with word storage

### Sorting Algorithms
- **Bubble Sort** — Classic comparison-based sort with adjacent swap visualization
- **Selection Sort** — Minimum-finding sort with selection highlighting
- **Insertion Sort** — Incremental build with insertion point visualization
- **Merge Sort** — Divide-and-conquer with recursive split/merge animation
- **Quick Sort** — Pivot-based partitioning with in-place swaps
- **Heap Sort** — Max-heap construction with extract-max visualization

### Backtracking & Constraint Propagation
- **N-Queens** — Place N queens on an N×N board with conflict detection
- **Permutations** — Generate all permutations with backtracking visualization
- **Sudoku Solver** — Lazy-generated backtracking with pause/resume and live speed control
- **Sudoku Constraint Propagation** — Hybrid CP+BT solver showing domain reduction before backtracking

### Graph Algorithms
- **Dijkstra's Algorithm** — Shortest path with priority queue visualization
- **A* Pathfinding** — Heuristic-guided search on a grid with obstacle placement
- **Bellman-Ford** — Shortest path with negative edge weight support
- **Floyd-Warshall** — All-pairs shortest paths
- **BFS & DFS** — Breadth-first and depth-first graph traversal with layer/depth coloring
- **Kruskal's MST** — Minimum spanning tree with union-find and cycle detection
- **Prim's MST** — Greedy MST construction from a starting vertex

### Dynamic Programming
- **Knapsack Problem** — 0/1 knapsack with DP table visualization
- **Longest Common Subsequence** — LCS computation with table backtracking
- **Edit Distance** — Levenshtein distance with DP table
- **Fibonacci** — Recursive, memoized, and iterative approaches compared

### Searching Algorithms
- **Binary Search** — Iterative and recursive search on sorted arrays
- **Linear Search** — Sequential scan visualization
- **BFS & DFS** — Graph traversal visualization

### String Algorithms
- **KMP** — Knuth-Morris-Pratt pattern matching with failure function
- **Rabin-Karp** — Rolling hash pattern matching
- **Z-Algorithm** — Z-array computation with pattern matching

### Sliding Window
- **Max Sum Subarray** — Maximum sum of contiguous subarray of size k
- **Longest Unique Substring** — Longest substring without repeating characters
- **Two Sum (Sorted)** — Two-pointer approach on sorted arrays

### Divide & Conquer
- **DC Merge Sort** — Divide-and-conquer merge sort visualization
- **Closest Pair** — Closest pair of points with divide-and-conquer
- **Karatsuba** — Fast multiplication algorithm

### Hashing
- **Hash Chaining** — Separate chaining collision resolution
- **Hash Open Addressing** — Linear/quadratic probing
- **Hash Load Factor** — Load factor and rehashing visualization

## Documentation

Every algorithm includes a dedicated documentation page with:
- Conceptual explanation and step-by-step breakdown
- Code implementations in **JavaScript**, **Python**, and **Java**
- Time and space complexity analysis
- Related algorithm links

## Tech Stack

### Frontend
- **React 19** — UI framework
- **Vite** — Build tool and dev server
- **React Router 7** — Client-side routing
- **TailwindCSS 4** — Utility-first styling with custom theme
- **SVG** — Inline vector graphics for tree and graph visualizations

### Backend
- **Hono** — Lightweight Node.js API framework
- **SQLite (sql.js)** — Embedded database for content storage
- **TypeScript** — Type-safe backend code

### Testing
- **Vitest** — Unit tests for algorithms and API routes
- **Playwright** — End-to-end browser tests

## Getting Started

### Prerequisites
- Node.js 18+

### Install & Run

```bash
# Install dependencies for both workspaces
npm install

# Start both frontend and backend
npm run dev
```

Or start them separately:

```bash
# Backend only (API server on port 3001)
cd backend && npm run dev

# Frontend only (Vite dev server on port 5173)
cd frontend && npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to explore.

### Seed the Database

```bash
cd backend && npm run seed
```

### Run Tests

```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test

# E2E tests
cd frontend && npx playwright test
```

## Project Structure

```
algorithm-visualizer/
├── frontend/                          # React SPA
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js              # Fetch wrapper for backend API
│   │   ├── algorithms/                # Pure algorithm logic (generateSteps functions)
│   │   │   ├── backtracking/          # N-Queens, Sudoku, Permutations
│   │   │   ├── constraint-propagation/# Sudoku CP+BT
│   │   │   ├── divide-conquer/        # Closest Pair, DC Merge Sort, Karatsuba
│   │   │   ├── dp/                    # Knapsack, LCS, Edit Distance, Fibonacci
│   │   │   ├── graph/                 # Dijkstra, A*, BFS, DFS, Kruskal, Prim, Bellman-Ford, Floyd-Warshall
│   │   │   ├── hashing/               # Hash chaining, open addressing, load factor
│   │   │   ├── searching/             # Binary Search, Linear Search, BFS, DFS
│   │   │   ├── sliding-window/        # Max Sum Subarray, Longest Unique Substring, Two Sum
│   │   │   ├── sorting/               # Bubble, Selection, Insertion, Merge, Quick, Heap
│   │   │   ├── string/                # KMP, Rabin-Karp, Z-Algorithm
│   │   │   └── tree/                  # BST
│   │   ├── components/                # Pages and UI components
│   │   │   ├── Landing.jsx            # Homepage with hero and category cards
│   │   │   ├── AlgorithmPage.jsx      # Algorithm detail page with visualizer + tabs
│   │   │   ├── Docs.jsx               # Documentation with sidebar navigation
│   │   │   ├── Home.jsx               # Category-based algorithm browser
│   │   │   └── Nav.jsx                # Top navigation bar
│   │   ├── contexts/
│   │   │   └── AlgorithmContext.jsx   # Animation engine with generator mode
│   │   ├── hooks/
│   │   │   └── useAlgorithmData.js    # Data fetching hooks
│   │   ├── visualizers/               # React components for each algorithm
│   │   │   ├── backtracking/          # NQueens, Permutations, Sudoku
│   │   │   ├── constraint-propagation/# SudokuConstraintPropagation
│   │   │   ├── divide-conquer/        # ClosestPair, DCMergeSort, Karatsuba
│   │   │   ├── dp/                    # EditDistance, Fibonacci, Knapsack, LCS
│   │   │   ├── graph/                 # AStar, BellmanFord, Dijkstra, FloydWarshall, Kruskal, Prim
│   │   │   ├── hashing/               # HashChaining, HashLoadFactor, HashOpenAddressing
│   │   │   ├── searching/             # BFS, BinarySearch, DFS, LinearSearch
│   │   │   ├── sliding-window/        # LongestUniqueSubstring, MaxSumSubarray, TwoSumSorted
│   │   │   ├── sorting/               # BubbleSort, HeapSort, InsertionSort, MergeSort, QuickSort, SelectionSort
│   │   │   ├── string/                # KMP, RabinKarp, ZAlgorithm
│   │   │   └── tree/                  # AVL, BST, RedBlack, Trie
│   │   ├── data/
│   │   │   ├── algorithms.js          # Algorithm registry and metadata
│   │   │   ├── docsContent.js         # Documentation content with code snippets
│   │   │   └── algorithmCodeSnippets.js  # Multi-language code blocks
│   │   ├── utils/
│   │   │   └── visualizerMap.js       # Lazy-loaded visualizer registry
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── tests/
│   │   └── e2e/                       # Playwright end-to-end tests
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── backend/                           # Hono API server
│   ├── src/
│   │   ├── index.ts                   # Hono app entry point
│   │   ├── routes/
│   │   │   ├── content.ts             # GET /api/algorithms, /api/docs
│   │   │   ├── content.test.ts        # Content API tests
│   │   │   ├── admin.ts               # POST /api/admin/* (basic auth)
│   │   │   └── admin.test.ts          # Admin API tests
│   │   └── db/
│   │       ├── client.ts              # sql.js database connection
│   │       ├── schema.sql             # Database schema
│   │       └── seed.ts                # Seed script (reads frontend/src/data/*)
│   ├── data/
│   │   └── algorithms.db              # SQLite database (generated by seed)
│   └── package.json
│
├── package.json                       # Root workspace config
├── package-lock.json
└── README.md
```

## Key Architecture

- **Generator Mode** — Deep backtracking searches use JS generators (`function*`) to yield steps lazily, preventing OOM crashes on large search spaces
- **Live Speed Control** — `delayRef` updated via `useEffect` allows speed changes mid-animation without resetting
- **Pause/Resume** — Generator state is preserved across play/pause cycles
- **Dynamic ViewBox** — Tree visualizations compute exact bounds via two-pass layout (collect positions → compute bounds → render), ensuring trees always fit their container without scrolling
- **Lazy-Loaded Visualizers** — Visualizer components are loaded on-demand via `React.lazy()` + dynamic imports, reducing initial bundle size
- **Pure Algorithm Functions** — All algorithm logic is extracted into pure `generateSteps()` functions with no React dependencies, making them testable and reusable
- **SQLite Content API** — Algorithm metadata and documentation are served from a lightweight SQLite backend via Hono API endpoints

## API Endpoints

```
GET /api/algorithms                → All categories with algorithm metadata
GET /api/algorithms/:category/:id  → Single algorithm with full details
GET /api/docs                      → All documentation entries
GET /api/docs/:id                  → Single doc with sections
```
