# AlgoVis — Algorithm Visualizer

An interactive, real-time algorithm visualization platform built with React and Vite. Explore how algorithms work step-by-step with beautiful, animated visualizations.

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

### Backtracking
- **N-Queens** — Place N queens on an N×N board with conflict detection and constraint propagation visualization
- **Sudoku Solver** — Lazy-generated backtracking with pause/resume and live speed control
- **Sudoku Constraint Propagation** — Hybrid CP+BT solver showing domain reduction before backtracking

### Graph Algorithms
- **Dijkstra's Algorithm** — Shortest path with priority queue visualization
- **A* Pathfinding** — Heuristic-guided search on a grid with obstacle placement
- **BFS & DFS** — Breadth-first and depth-first graph traversal with layer/depth coloring
- **Kruskal's MST** — Minimum spanning tree with union-find and cycle detection
- **Prim's MST** — Greedy MST construction from a starting vertex

### Dynamic Programming
- **Knapsack Problem** — 0/1 knapsack with DP table visualization
- **Longest Common Subsequence** — LCS computation with table backtracking
- **Matrix Chain Multiplication** — Optimal parenthesization with cost table

### Additional Algorithms
- **Binary Search** — Iterative and recursive search on sorted arrays
- **Linear Search** — Sequential scan visualization
- **Fibonacci** — Recursive, memoized, and iterative approaches compared
- **Euclidean GCD** — Step-by-step greatest common divisor computation

## Documentation

Every algorithm includes a dedicated documentation page with:
- Conceptual explanation and step-by-step breakdown
- Code implementations in **JavaScript**, **Python**, and **Java**
- Time and space complexity analysis
- Related algorithm links

## Tech Stack

- **React 19** — UI framework
- **Vite** — Build tool and dev server
- **React Router** — Client-side routing
- **CSS Variables** — Theme system with custom properties
- **SVG** — Inline vector graphics for tree and graph visualizations

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to explore.

## Project Structure

```
src/
├── components/          # Pages and UI components
│   ├── Landing.jsx      # Homepage with auto-rotating demo carousel
│   ├── AlgorithmPage.jsx # Algorithm detail page with tabs
│   ├── Docs.jsx         # Documentation with fixed sidebars
│   └── Home.jsx         # Category navigation
├── contexts/
│   └── AlgorithmContext.jsx  # Animation engine with generator mode
├── visualizers/         # Algorithm-specific visualizations
│   ├── tree/            # BST, AVL, Red-Black, Trie
│   ├── sorting/         # Bubble, Selection, Insertion, Merge, Quick
│   ├── backtracking/    # N-Queens, Sudoku, Sudoku CP
│   ├── graph/           # Dijkstra, A*, BFS, DFS, Kruskal, Prim
│   └── dp/              # Knapsack, LCS, MCM
├── data/
│   ├── algorithms.js    # Algorithm registry and metadata
│   ├── docsContent.js   # Documentation content with code snippets
│   └── algorithmCodeSnippets.js  # Multi-language code blocks
└── contexts/
    └── AlgorithmContext.jsx  # Central animation state management
```

## Key Architecture

- **Generator Mode** — Deep backtracking searches use JS generators (`function*`) to yield steps lazily, preventing OOM crashes on large search spaces
- **Live Speed Control** — `delayRef` updated via `useEffect` allows speed changes mid-animation without resetting
- **Pause/Resume** — Generator state is preserved across play/pause cycles
- **Dynamic ViewBox** — Tree visualizations compute exact bounds via two-pass layout (collect positions → compute bounds → render), ensuring trees always fit their container without scrolling
- **Fixed Sidebars** — Docs page uses CSS `position: fixed` for left navigation and right table of contents while main content scrolls independently
