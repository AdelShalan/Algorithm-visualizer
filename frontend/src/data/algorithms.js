export const categories = [
  {
    id: 'sorting',
    name: 'Sorting',
    icon: 'bar-chart-3',
    difficulty: 'Junior',
    algorithms: [
      {
        id: 'bubble-sort', name: 'Bubble sort',
        complexity: { best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
        stability: 'Stable',
        description: 'Repeatedly swaps adjacent elements if they are in wrong order. The simplest sorting algorithm — and the slowest.',
        insight: 'Bubble sort is rarely used in practice but teaches the fundamental concept of comparison-based sorting. Its only advantage: it can detect a sorted array in O(n) with the optimized flag.',
        code: `function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }
    if (!swapped) break;
  }
  return arr;
}`,
        related: [
          { name: 'Selection sort', hint: 'O(n²) in-place →' },
          { name: 'Insertion sort', hint: 'adaptive O(n) →' },
        ],
      },
      {
        id: 'selection-sort', name: 'Selection sort',
        complexity: { best: 'O(n²)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
        stability: 'Unstable',
        description: 'Finds the minimum element and places it at the beginning. Makes the minimum number of swaps.',
        insight: 'Selection sort always performs exactly n−1 swaps regardless of input order, making it useful when write operations are expensive (e.g., flash memory).',
        code: `function selectionSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) minIdx = j;
    }
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
    }
  }
  return arr;
}`,
        related: [
          { name: 'Bubble sort', hint: 'O(n²) stable →' },
          { name: 'Heap sort', hint: 'O(n log n) →' },
        ],
      },
      {
        id: 'insertion-sort', name: 'Insertion sort',
        complexity: { best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
        stability: 'Stable',
        description: 'Builds the sorted array one element at a time by inserting each element into its correct position.',
        insight: 'Insertion sort is adaptive — it runs in O(n) on nearly-sorted data. This makes it the algorithm of choice for small arrays (n < 15) and as the base case in hybrid sorts like Timsort.',
        code: `function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    const key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
  return arr;
}`,
        related: [
          { name: 'Shell sort', hint: 'gap insertion →' },
          { name: 'Timsort', hint: 'hybrid sort →' },
        ],
      },
      {
        id: 'merge-sort', name: 'Merge sort',
        complexity: { best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)' },
        stability: 'Stable',
        description: 'Divides the array in half, sorts recursively, then merges the sorted halves.',
        insight: 'Merging two sorted arrays is O(n). Do this log n times (the depth of the recursion tree) and you get O(n log n) — guaranteed, regardless of input order.',
        code: `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) result.push(left[i++]);
    else result.push(right[j++]);
  }
  return [...result, ...left.slice(i), ...right.slice(j)];
}`,
        related: [
          { name: 'Quicksort', hint: 'O(n log n) avg →' },
          { name: 'Timsort', hint: 'merge + insertion →' },
        ],
      },
      {
        id: 'quick-sort', name: 'Quicksort',
        complexity: { best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n²)', space: 'O(log n)' },
        stability: 'Unstable',
        description: 'Partitions around a pivot and sorts sub-arrays recursively. The workhorse of practical sorting.',
        insight: 'Quicksort is typically faster in practice than other O(n log n) algorithms due to excellent cache locality and small constant factors. The worst case O(n²) is avoided with randomized pivots.',
        code: `function quickSort(arr, lo = 0, hi = arr.length - 1) {
  if (lo < hi) {
    const p = partition(arr, lo, hi);
    quickSort(arr, lo, p - 1);
    quickSort(arr, p + 1, hi);
  }
  return arr;
}

function partition(arr, lo, hi) {
  const pivot = arr[hi];
  let i = lo - 1;
  for (let j = lo; j < hi; j++) {
    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  [arr[i + 1], arr[hi]] = [arr[hi], arr[i + 1]];
  return i + 1;
}`,
        related: [
          { name: 'Merge sort', hint: 'guaranteed O(n log n) →' },
          { name: 'Introsort', hint: 'hybrid →' },
        ],
      },
      {
        id: 'heap-sort', name: 'Heap sort',
        complexity: { best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)', space: 'O(1)' },
        stability: 'Unstable',
        description: 'Uses a binary heap to repeatedly extract the maximum element.',
        insight: 'Heap sort combines the best of both worlds: O(n log n) worst-case like merge sort, and in-place like quicksort. However, poor cache locality makes it slower in practice.',
        code: `function heapSort(arr) {
  const n = arr.length;
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--)
    heapify(arr, n, i);
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    heapify(arr, i, 0);
  }
  return arr;
}

function heapify(arr, n, i) {
  let largest = i;
  const l = 2 * i + 1, r = 2 * i + 2;
  if (l < n && arr[l] > arr[largest]) largest = l;
  if (r < n && arr[r] > arr[largest]) largest = r;
  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    heapify(arr, n, largest);
  }
}`,
        related: [
          { name: 'Selection sort', hint: 'heap-based →' },
          { name: 'Smoothsort', hint: 'adaptive →' },
        ],
      },
    ],
  },
  {
    id: 'searching',
    name: 'Searching',
    icon: 'search',
    difficulty: 'Junior',
    algorithms: [
      {
        id: 'linear-search', name: 'Linear search',
        complexity: { best: 'O(1)', avg: 'O(n)', worst: 'O(n)', space: 'O(1)' },
        stability: '—',
        description: 'Sequentially checks each element until the target is found.',
        insight: 'Linear search is the only option for unsorted data. On sorted data, binary search is exponentially faster — but linear search has zero preprocessing cost.',
        code: `function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}`,
        related: [
          { name: 'Binary search', hint: 'O(log n) sorted →' },
          { name: 'Sentinel search', hint: 'optimized →' },
        ],
      },
      {
        id: 'binary-search', name: 'Binary search',
        complexity: { best: 'O(1)', avg: 'O(log n)', worst: 'O(log n)', space: 'O(1)' },
        stability: '—',
        description: 'Repeatedly divides a sorted array in half to find the target.',
        insight: 'Binary search is one of the most important algorithms in computer science. It finds an element among 1 million items in just 20 comparisons.',
        code: `function binarySearch(arr, target) {
  let lo = 0, hi = arr.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}`,
        related: [
          { name: 'Linear search', hint: 'O(n) unsorted →' },
          { name: 'Interpolation search', hint: 'O(log log n) →' },
        ],
      },
      {
        id: 'bfs', name: 'BFS',
        complexity: { best: 'O(V + E)', avg: 'O(V + E)', worst: 'O(V + E)', space: 'O(V)' },
        stability: '—',
        description: 'Explores all neighbors at current depth before going deeper.',
        insight: 'BFS guarantees the shortest path in unweighted graphs. The queue ensures nodes are visited in order of increasing distance from the source.',
        code: `function bfs(graph, start) {
  const visited = new Set([start]);
  const queue = [start];
  while (queue.length) {
    const node = queue.shift();
    for (const neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  return visited;
}`,
        related: [
          { name: 'DFS', hint: 'depth-first →' },
          { name: "Dijkstra's", hint: 'weighted shortest →' },
        ],
      },
      {
        id: 'dfs', name: 'DFS',
        complexity: { best: 'O(V + E)', avg: 'O(V + E)', worst: 'O(V + E)', space: 'O(V)' },
        stability: '—',
        description: 'Explores as far as possible along each branch before backtracking.',
        insight: 'DFS uses less memory than BFS for deep trees. It is essential for topological sorting, cycle detection, and solving puzzles like mazes.',
        code: `function dfs(graph, node, visited = new Set()) {
  visited.add(node);
  for (const neighbor of graph[node]) {
    if (!visited.has(neighbor)) {
      dfs(graph, neighbor, visited);
    }
  }
  return visited;
}`,
        related: [
          { name: 'BFS', hint: 'breadth-first →' },
          { name: 'Topological sort', hint: 'DFS-based →' },
        ],
      },
    ],
  },
  {
    id: 'graph',
    name: 'Graph Algorithms',
    icon: 'network',
    difficulty: 'Mid-level',
    algorithms: [
      {
        id: 'dijkstra', name: "Dijkstra's algorithm",
        complexity: { best: 'O((V+E) log V)', avg: 'O((V+E) log V)', worst: 'O((V+E) log V)', space: 'O(V)' },
        stability: '—',
        description: 'Finds shortest paths from source to all vertices with non-negative edge weights.',
        insight: "Dijkstra's greedy approach works because once a node is extracted from the priority queue, its shortest distance is final — no future path can be shorter.",
        code: `function dijkstra(graph, source) {
  const dist = new Map();
  const pq = new PriorityQueue();
  dist.set(source, 0);
  pq.push(source, 0);
  while (!pq.isEmpty()) {
    const [u, d] = pq.pop();
    if (d > dist.get(u)) continue;
    for (const [v, w] of graph[u]) {
      if (dist.get(u) + w < (dist.get(v) ?? Infinity)) {
        dist.set(v, dist.get(u) + w);
        pq.push(v, dist.get(v));
      }
    }
  }
  return dist;
}`,
        related: [
          { name: 'A* search', hint: 'heuristic-guided →' },
          { name: 'Bellman-Ford', hint: 'handles negatives →' },
        ],
      },
      {
        id: 'astar', name: 'A* search',
        complexity: { best: 'O(E)', avg: 'O(E)', worst: 'O(E)', space: 'O(V)' },
        stability: '—',
        description: 'Heuristic-guided shortest path algorithm for grid graphs.',
        insight: "A* combines Dijkstra's guarantee of optimality with greedy best-first search's speed. The heuristic must be admissible (never overestimate) for A* to find the optimal path.",
        code: `function aStar(grid, start, goal) {
  const open = new PriorityQueue();
  open.push(start, heuristic(start, goal));
  const gScore = new Map();
  gScore.set(start, 0);
  while (!open.isEmpty()) {
    const current = open.pop();
    if (current === goal) return reconstructPath(current);
    for (const neighbor of neighbors(current)) {
      const tentative = gScore.get(current) + 1;
      if (tentative < (gScore.get(neighbor) ?? Infinity)) {
        gScore.set(neighbor, tentative);
        open.push(neighbor, tentative + heuristic(neighbor, goal));
      }
    }
  }
}`,
        related: [
          { name: "Dijkstra's", hint: 'no heuristic →' },
          { name: 'Jump Point Search', hint: 'grid optimized →' },
        ],
      },
      {
        id: 'bellman-ford', name: 'Bellman-Ford',
        complexity: { best: 'O(VE)', avg: 'O(VE)', worst: 'O(VE)', space: 'O(V)' },
        stability: '—',
        description: 'Handles negative edge weights and detects negative cycles.',
        insight: 'Bellman-Ford relaxes all edges V−1 times. If any edge can still be relaxed after V−1 iterations, a negative cycle exists. This makes it the only single-source algorithm that can detect negative cycles.',
        code: `function bellmanFord(graph, source) {
  const dist = new Map();
  dist.set(source, 0);
  for (let i = 0; i < V - 1; i++) {
    for (const [u, v, w] of graph.edges) {
      if (dist.get(u) + w < (dist.get(v) ?? Infinity)) {
        dist.set(v, dist.get(u) + w);
      }
    }
  }
  // Check for negative cycles
  for (const [u, v, w] of graph.edges) {
    if (dist.get(u) + w < dist.get(v)) return null;
  }
  return dist;
}`,
        related: [
          { name: "Dijkstra's", hint: 'faster, no negatives →' },
          { name: 'SPFA', hint: 'queue optimized →' },
        ],
      },
      {
        id: 'floyd-warshall', name: 'Floyd-Warshall',
        complexity: { best: 'O(V³)', avg: 'O(V³)', worst: 'O(V³)', space: 'O(V²)' },
        stability: '—',
        description: 'Computes all-pairs shortest paths using dynamic programming.',
        insight: 'Floyd-Warshall is elegantly simple: three nested loops. For each intermediate vertex k, check if going through k improves the path from i to j. It works with negative edges (but not negative cycles).',
        code: `function floydWarshall(graph) {
  const dist = graph.map(row => [...row]);
  for (let k = 0; k < V; k++) {
    for (let i = 0; i < V; i++) {
      for (let j = 0; j < V; j++) {
        dist[i][j] = Math.min(
          dist[i][j],
          dist[i][k] + dist[k][j]
        );
      }
    }
  }
  return dist;
}`,
        related: [
          { name: "Dijkstra's (all pairs)", hint: 'O(V² log V) →' },
          { name: 'Johnson\'s', hint: 'sparse graphs →' },
        ],
      },
      {
        id: 'kruskal', name: "Kruskal's algorithm",
        complexity: { best: 'O(E log E)', avg: 'O(E log E)', worst: 'O(E log E)', space: 'O(V)' },
        stability: '—',
        description: 'Builds MST by greedily adding smallest edges without creating cycles.',
        insight: 'Kruskal uses Union-Find to detect cycles efficiently. Sorting edges by weight ensures the greedy choice is always optimal for MST construction.',
        code: `function kruskal(edges, V) {
  edges.sort((a, b) => a.w - b.w);
  const parent = Array.from({length: V}, (_, i) => i);
  const find = i => parent[i] === i ? i : (parent[i] = find(parent[i]));
  const union = (i, j) => parent[find(i)] = find(j);
  const mst = [];
  for (const {u, v, w} of edges) {
    if (find(u) !== find(v)) {
      union(u, v);
      mst.push({u, v, w});
    }
  }
  return mst;
}`,
        related: [
          { name: "Prim's", hint: 'vertex-based MST →' },
          { name: 'Boruvka\'s', hint: 'parallel MST →' },
        ],
      },
      {
        id: 'prim', name: "Prim's algorithm",
        complexity: { best: 'O((V+E) log V)', avg: 'O((V+E) log V)', worst: 'O((V+E) log V)', space: 'O(V)' },
        stability: '—',
        description: 'Builds MST by growing a single tree from a starting vertex.',
        insight: "Prim's grows one connected component, while Kruskal's can merge many. Prim's is better for dense graphs (O(V²) with array), Kruskal's for sparse ones.",
        code: `function prim(graph, start) {
  const visited = new Set();
  const pq = new PriorityQueue();
  pq.push(start, 0);
  const mst = [];
  while (!pq.isEmpty()) {
    const [u, w] = pq.pop();
    if (visited.has(u)) continue;
    visited.add(u);
    mst.push({u, w});
    for (const [v, weight] of graph[u]) {
      if (!visited.has(v)) pq.push(v, weight);
    }
  }
  return mst;
}`,
        related: [
          { name: "Kruskal's", hint: 'edge-based MST →' },
          { name: "Dijkstra's", hint: 'similar structure →' },
        ],
      },
    ],
  },
  {
    id: 'dp',
    name: 'Dynamic Programming',
    icon: 'table',
    difficulty: 'Mid-level',
    algorithms: [
      {
        id: 'fibonacci', name: 'Fibonacci',
        complexity: { best: 'O(n)', avg: 'O(n)', worst: 'O(n)', space: 'O(n)', naive: 'O(2ⁿ)' },
        stability: '—',
        description: 'Compare naive recursion vs memoized vs tabulated approaches.',
        insight: 'Memoization is top-down DP. You compute recursively as usual, but cache every result. This single change turns O(2ⁿ) into O(n).',
        code: `// Memoized (top-down)
function fib(n, memo = {}) {
  if (n in memo) return memo[n];
  if (n <= 1) return n;
  memo[n] = fib(n - 1, memo) + fib(n - 2, memo);
  return memo[n];
}

// Tabulation (bottom-up)
function fibTab(n) {
  const dp = [0, 1];
  for (let i = 2; i <= n; i++)
    dp[i] = dp[i - 1] + dp[i - 2];
  return dp[n];
}`,
        related: [
          { name: 'Coin change', hint: 'DP table →' },
          { name: '0/1 Knapsack', hint: '2D DP →' },
        ],
      },
      {
        id: 'knapsack', name: '0/1 Knapsack',
        complexity: { best: 'O(nW)', avg: 'O(nW)', worst: 'O(nW)', space: 'O(nW)' },
        stability: '—',
        description: 'Maximize value in a knapsack with weight constraints.',
        insight: 'Each item is either taken or left. The DP table dp[i][w] stores the max value using items 0..i with capacity w. The recurrence: max(take item, skip item).',
        code: `function knapsack(weights, values, W) {
  const n = weights.length;
  const dp = Array.from({length: n + 1},
    () => Array(W + 1).fill(0));
  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= W; w++) {
      if (weights[i-1] <= w)
        dp[i][w] = Math.max(
          dp[i-1][w],
          values[i-1] + dp[i-1][w - weights[i-1]]
        );
      else dp[i][w] = dp[i-1][w];
    }
  }
  return dp[n][W];
}`,
        related: [
          { name: 'Unbounded knapsack', hint: 'reusable items →' },
          { name: 'LCS', hint: '2D DP →' },
        ],
      },
      {
        id: 'lcs', name: 'Longest Common Subsequence',
        complexity: { best: 'O(mn)', avg: 'O(mn)', worst: 'O(mn)', space: 'O(mn)' },
        stability: '—',
        description: 'Find the longest subsequence common to two sequences.',
        insight: 'If characters match, add 1 to the diagonal. If not, take the max of skipping a character from either string. Backtracking through the table reconstructs the actual subsequence.',
        code: `function lcs(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({length: m + 1},
    () => Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i-1] === b[j-1])
        dp[i][j] = dp[i-1][j-1] + 1;
      else
        dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
    }
  }
  return dp[m][n];
}`,
        related: [
          { name: 'Edit distance', hint: 'similar DP →' },
          { name: 'Longest increasing subseq', hint: 'O(n log n) →' },
        ],
      },
      {
        id: 'edit-distance', name: 'Edit Distance',
        complexity: { best: 'O(mn)', avg: 'O(mn)', worst: 'O(mn)', space: 'O(mn)' },
        stability: '—',
        description: 'Minimum operations to transform one string into another.',
        insight: 'Three operations: insert, delete, replace. If characters match, cost is 0. Otherwise, take the minimum of all three operations plus 1.',
        code: `function editDistance(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({length: m + 1}, (_, i) =>
    Array.from({length: n + 1}, (_, j) =>
      i === 0 ? j : j === 0 ? i : 0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i-1] === b[j-1])
        dp[i][j] = dp[i-1][j-1];
      else
        dp[i][j] = 1 + Math.min(
          dp[i][j-1],    // insert
          dp[i-1][j],    // delete
          dp[i-1][j-1]   // replace
        );
    }
  }
  return dp[m][n];
}`,
        related: [
          { name: 'LCS', hint: 'subsequence →' },
          { name: 'Levenshtein automaton', hint: 'fast matching →' },
        ],
      },
    ],
  },
  {
    id: 'tree',
    name: 'Tree Operations',
    icon: 'git-branch',
    difficulty: 'Mid-level',
    algorithms: [
      {
        id: 'bst', name: 'BST Operations',
        complexity: { best: 'O(log n)', avg: 'O(log n)', worst: 'O(n)', space: 'O(log n)' },
        stability: '—',
        description: 'Insert, delete, and search in a Binary Search Tree.',
        insight: 'BST operations are O(log n) on average but degrade to O(n) on sorted input. Self-balancing trees (AVL, Red-Black) guarantee O(log n) worst case.',
        code: `class Node {
  constructor(val) {
    this.val = val;
    this.left = this.right = null;
  }
}

function insert(root, val) {
  if (!root) return new Node(val);
  if (val < root.val) root.left = insert(root.left, val);
  else if (val > root.val) root.right = insert(root.right, val);
  return root;
}

function search(root, val) {
  if (!root || root.val === val) return root;
  return val < root.val
    ? search(root.left, val)
    : search(root.right, val);
}`,
        related: [
          { name: 'AVL Tree', hint: 'self-balancing →' },
          { name: 'Red-Black Tree', hint: 'color-balanced →' },
        ],
      },
      {
        id: 'avl', name: 'AVL Tree',
        complexity: { best: 'O(log n)', avg: 'O(log n)', worst: 'O(log n)', space: 'O(log n)' },
        stability: '—',
        description: 'Self-balancing BST with rotation-based rebalancing.',
        insight: 'AVL trees maintain height balance: the heights of left and right subtrees differ by at most 1. After every insertion or deletion, rotations restore this invariant.',
        code: `function rotateRight(y) {
  const x = y.left;
  const T2 = x.right;
  x.right = y;
  y.left = T2;
  updateHeight(y); updateHeight(x);
  return x;
}

function rotateLeft(x) {
  const y = x.right;
  const T2 = y.left;
  y.left = x;
  x.right = T2;
  updateHeight(x); updateHeight(y);
  return y;
}`,
        related: [
          { name: 'Red-Black Tree', hint: 'looser balance →' },
          { name: 'Splay Tree', hint: 'self-adjusting →' },
        ],
      },
      {
        id: 'red-black', name: 'Red-Black Tree',
        complexity: { best: 'O(log n)', avg: 'O(log n)', worst: 'O(log n)', space: 'O(log n)' },
        stability: '—',
        description: 'Self-balancing BST with color-based invariants.',
        insight: 'Red-Black trees guarantee O(log n) height with fewer rotations than AVL. The rules: root is black, red nodes have black children, every path has the same number of black nodes.',
        code: `// Red-Black Tree properties:
// 1. Every node is red or black
// 2. Root is black
// 3. Red nodes have black children
// 4. Every path has equal black nodes

function fixInsert(node) {
  while (node.parent?.color === 'red') {
    // Handle cases with rotations
    // and recoloring...
  }
  root.color = 'black';
}`,
        related: [
          { name: 'AVL Tree', hint: 'stricter balance →' },
          { name: 'B-Tree', hint: 'disk-optimized →' },
        ],
      },
      {
        id: 'trie', name: 'Trie',
        complexity: { best: 'O(L)', avg: 'O(L)', worst: 'O(L)', space: 'O(ALPHABET × N × L)' },
        stability: '—',
        description: 'Prefix tree for efficient string storage and lookup.',
        insight: 'Tries excel at prefix queries. Finding all words with prefix "app" is O(L + output), while a hash table would need to scan every key.',
        code: `class TrieNode {
  constructor() {
    this.children = {};
    this.isEnd = false;
  }
}

function insert(root, word) {
  let node = root;
  for (const ch of word) {
    if (!node.children[ch])
      node.children[ch] = new TrieNode();
    node = node.children[ch];
  }
  node.isEnd = true;
}

function search(root, word) {
  let node = root;
  for (const ch of word) {
    if (!node.children[ch]) return false;
    node = node.children[ch];
  }
  return node.isEnd;
}`,
        related: [
          { name: 'Radix Tree', hint: 'compressed →' },
          { name: 'Suffix Tree', hint: 'all substrings →' },
        ],
      },
    ],
  },
  {
    id: 'hashing',
    name: 'Hashing',
    icon: 'hash',
    difficulty: 'Junior',
    algorithms: [
      {
        id: 'hash-chaining', name: 'Chaining',
        complexity: { best: 'O(1)', avg: 'O(1)', worst: 'O(n)', space: 'O(n)' },
        stability: '—',
        description: 'Resolve collisions with linked lists at each bucket.',
        insight: 'Chaining is simple and handles any load factor gracefully. Performance degrades linearly as the load factor increases, but never fails.',
        code: `class HashTable {
  constructor(size = 16) {
    this.table = Array.from({length: size}, () => []);
  }
  hash(key) {
    let h = 0;
    for (const c of key) h = ((h << 5) - h) + c.charCodeAt(0);
    return Math.abs(h) % this.table.length;
  }
  insert(key, val) {
    const idx = this.hash(key);
    this.table[idx].push([key, val]);
  }
  get(key) {
    const idx = this.hash(key);
    for (const [k, v] of this.table[idx])
      if (k === key) return v;
    return undefined;
  }
}`,
        related: [
          { name: 'Open addressing', hint: 'probing →' },
          { name: 'Robin Hood hashing', hint: 'fair probing →' },
        ],
      },
      {
        id: 'hash-open-addressing', name: 'Open Addressing',
        complexity: { best: 'O(1)', avg: 'O(1)', worst: 'O(n)', space: 'O(n)' },
        stability: '—',
        description: 'Resolve collisions by probing for the next available slot.',
        insight: 'Open addressing has better cache locality than chaining since all data is in one array. But it requires careful load factor management — performance collapses above 0.7.',
        code: `class OpenAddressing {
  constructor(size = 16) {
    this.table = Array(size).fill(null);
  }
  hash(key) { /* ... */ }
  insert(key, val) {
    let idx = this.hash(key);
    while (this.table[idx] !== null)
      idx = (idx + 1) % this.table.length;
    this.table[idx] = [key, val];
  }
}`,
        related: [
          { name: 'Chaining', hint: 'linked lists →' },
          { name: 'Double hashing', hint: 'better probing →' },
        ],
      },
      {
        id: 'hash-load-factor', name: 'Load Factor & Rehashing',
        complexity: { best: 'O(1)', avg: 'O(1)', worst: 'O(n)', space: 'O(n)' },
        stability: '—',
        description: 'Visualize how load factor triggers rehashing to a larger table.',
        insight: 'Rehashing doubles the table size and reinserts all elements. It is O(n) but amortized over many insertions, the average cost per insert remains O(1).',
        code: `class DynamicHash {
  constructor() {
    this.table = Array(8).fill(null);
    this.size = 0;
  }
  get loadFactor() { return this.size / this.table.length; }

  insert(key, val) {
    if (this.loadFactor > 0.7) this.rehash();
    // ... insert normally
  }

  rehash() {
    const old = this.table;
    this.table = Array(old.length * 2 + 1).fill(null);
    this.size = 0;
    for (const bucket of old)
      if (bucket) this.insert(bucket[0], bucket[1]);
  }
}`,
        related: [
          { name: 'Chaining', hint: 'no rehash needed →' },
          { name: 'Cuckoo hashing', hint: 'guaranteed O(1) →' },
        ],
      },
    ],
  },
  {
    id: 'backtracking',
    name: 'Backtracking',
    icon: 'corner-down-left',
    difficulty: 'Mid-level',
    algorithms: [
      {
        id: 'n-queens', name: 'N-Queens',
        complexity: { best: 'O(n!)', avg: 'O(n!)', worst: 'O(n!)', space: 'O(n)' },
        stability: '—',
        description: 'Place N queens on an N×N board so none attack each other.',
        insight: 'Backtracking prunes the search space dramatically. For N=8, brute force checks 8⁸ = 16M placements, but backtracking only explores ~2K nodes.',
        code: `function solveNQueens(n) {
  const board = Array(n).fill(-1);
  const solutions = [];

  function isValid(row, col) {
    for (let r = 0; r < row; r++) {
      const c = board[r];
      if (c === col || Math.abs(c - col) === Math.abs(r - row))
        return false;
    }
    return true;
  }

  function solve(row) {
    if (row === n) { solutions.push([...board]); return; }
    for (let col = 0; col < n; col++) {
      if (isValid(row, col)) {
        board[row] = col;
        solve(row + 1);
        board[row] = -1; // backtrack
      }
    }
  }
  solve(0);
  return solutions;
}`,
        related: [
          { name: 'Sudoku solver', hint: 'constraint satisfaction →' },
          { name: 'Graph coloring', hint: 'similar backtracking →' },
        ],
      },
      {
        id: 'sudoku', name: 'Sudoku Solver (Backtracking)',
        complexity: { best: 'O(9^(n²))', avg: 'O(9^(n²))', worst: 'O(9^(n²))', space: 'O(n²)' },
        stability: '—',
        description: 'Fill a 9×9 grid using pure backtracking — try digits 1-9 and backtrack on conflict.',
        insight: 'Sudoku is a constraint satisfaction problem. The backtracking solver tries digits 1-9 in each empty cell sequentially, backtracking when a constraint is violated. Simple but can explore many dead ends on hard puzzles.',
        code: `function solveSudoku(board) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (isValid(board, row, col, num)) {
            board[row][col] = num;
            if (solveSudoku(board)) return true;
            board[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}`,
        related: [
          { name: 'N-Queens', hint: 'classic backtracking →' },
          { name: 'Sudoku Solver (CP+BT)', hint: 'constraint propagation →' },
        ],
      },
      {
        id: 'permutations', name: 'Permutations',
        complexity: { best: 'O(n!)', avg: 'O(n!)', worst: 'O(n!)', space: 'O(n)' },
        stability: '—',
        description: 'Generate all permutations of a set of elements.',
        insight: 'The recursion tree has n! leaves. At each level, we choose one remaining element and recurse. Backtracking restores the state for the next choice.',
        code: `function permute(nums) {
  const result = [];
  function backtrack(path, remaining) {
    if (remaining.length === 0) {
      result.push([...path]);
      return;
    }
    for (let i = 0; i < remaining.length; i++) {
      path.push(remaining[i]);
      backtrack(path, [
        ...remaining.slice(0, i),
        ...remaining.slice(i + 1)
      ]);
      path.pop(); // backtrack
    }
  }
  backtrack([], nums);
  return result;
}`,
        related: [
          { name: 'Combinations', hint: 'choose k →' },
          { name: 'Subsets', hint: 'power set →' },
        ],
      },
    ],
  },
  {
    id: 'divide-conquer',
    name: 'Divide & Conquer',
    icon: 'split',
    difficulty: 'Mid-level',
    algorithms: [
      {
        id: 'dc-merge-sort', name: 'Merge Sort Phases',
        complexity: { best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)' },
        stability: 'Stable',
        description: 'Visualize the split and merge phases of merge sort.',
        insight: 'The recursion tree has log n levels. At each level, merging all subarrays takes O(n) total. Hence O(n log n) overall.',
        code: `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}`,
        related: [
          { name: 'Quicksort', hint: 'partition-based →' },
          { name: 'Karatsuba', hint: 'fast multiplication →' },
        ],
      },
      {
        id: 'karatsuba', name: 'Karatsuba Multiplication',
        complexity: { best: 'O(n^1.585)', avg: 'O(n^1.585)', worst: 'O(n^1.585)', space: 'O(log n)' },
        stability: '—',
        description: 'Fast multiplication using divide and conquer.',
        insight: 'Instead of 4 multiplications of n/2-digit numbers, Karatsuba needs only 3. This reduces the recurrence from T(n) = 4T(n/2) to T(n) = 3T(n/2), giving O(n^log₂3) ≈ O(n^1.585).',
        code: `function karatsuba(x, y) {
  if (x < 10 || y < 10) return x * y;
  const n = Math.max(x.toString().length, y.toString().length);
  const m = Math.ceil(n / 2);
  const high1 = Math.floor(x / 10**m);
  const low1 = x % 10**m;
  const high2 = Math.floor(y / 10**m);
  const low2 = y % 10**m;
  const z0 = karatsuba(low1, low2);
  const z1 = karatsuba(low1 + high1, low2 + high2);
  const z2 = karatsuba(high1, high2);
  return z2 * 10**(2*m) + (z1 - z2 - z0) * 10**m + z0;
}`,
        related: [
          { name: 'FFT multiplication', hint: 'O(n log n) →' },
          { name: 'Strassen', hint: 'fast matrix →' },
        ],
      },
      {
        id: 'closest-pair', name: 'Closest Pair',
        complexity: { best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)' },
        stability: '—',
        description: 'Find the closest pair of points in 2D space.',
        insight: 'The divide-and-conquer approach splits points by x-coordinate, solves recursively, then checks a narrow strip of width δ around the dividing line. Only 7 points need to be checked per point in the strip.',
        code: `function closestPair(points) {
  points.sort((a, b) => a.x - b.x);
  return rec(points);
}

function rec(pts) {
  if (pts.length <= 3) return bruteForce(pts);
  const mid = Math.floor(pts.length / 2);
  const dl = rec(pts.slice(0, mid));
  const dr = rec(pts.slice(mid));
  let d = Math.min(dl, dr);
  // Check strip of width d
  const strip = pts.filter(p =>
    Math.abs(p.x - pts[mid].x) < d);
  return Math.min(d, stripClosest(strip, d));
}`,
        related: [
          { name: 'Brute force', hint: 'O(n²) →' },
          { name: 'Convex hull', hint: 'divide & conquer →' },
        ],
      },
    ],
  },
  {
    id: 'string',
    name: 'String Algorithms',
    icon: 'type',
    difficulty: 'Senior',
    algorithms: [
      {
        id: 'kmp', name: 'KMP Algorithm',
        complexity: { best: 'O(n + m)', avg: 'O(n + m)', worst: 'O(n + m)', space: 'O(m)' },
        stability: '—',
        description: 'Knuth-Morris-Pratt pattern matching with failure function.',
        insight: 'The LPS (Longest Proper Prefix which is also Suffix) array tells us how much to skip when a mismatch occurs. This avoids re-examining characters in the text.',
        code: `function kmp(text, pattern) {
  const m = pattern.length;
  const lps = computeLPS(pattern);
  let i = 0, j = 0;
  while (i < text.length) {
    if (pattern[j] === text[i]) { i++; j++; }
    if (j === m) { /* found at i-j */ j = lps[j-1]; }
    else if (i < text.length && pattern[j] !== text[i]) {
      j = j > 0 ? lps[j-1] : i++;
    }
  }
}

function computeLPS(pat) {
  const lps = [0];
  let len = 0, i = 1;
  while (i < pat.length) {
    if (pat[i] === pat[len]) lps[i++] = ++len;
    else len > 0 ? len = lps[len-1] : (lps[i++] = 0);
  }
  return lps;
}`,
        related: [
          { name: 'Rabin-Karp', hint: 'hash-based →' },
          { name: 'Boyer-Moore', hint: 'skip ahead →' },
        ],
      },
      {
        id: 'rabin-karp', name: 'Rabin-Karp',
        complexity: { best: 'O(n + m)', avg: 'O(n + m)', worst: 'O(nm)', space: 'O(1)' },
        stability: '—',
        description: 'Pattern matching using rolling hash functions.',
        insight: 'Rabin-Karp computes a hash of the pattern and each window of the text. When hashes match, it verifies character by character. The rolling hash allows O(1) hash updates.',
        code: `function rabinKarp(text, pattern) {
  const d = 256, q = 101;
  const m = pattern.length, n = text.length;
  let h = 1, pHash = 0, tHash = 0;
  for (let i = 0; i < m - 1; i++) h = (h * d) % q;
  for (let i = 0; i < m; i++) {
    pHash = (d * pHash + pattern[i]) % q;
    tHash = (d * tHash + text[i]) % q;
  }
  for (let i = 0; i <= n - m; i++) {
    if (pHash === tHash && text.slice(i, i+m) === pattern)
      return i;
    if (i < n - m)
      tHash = (d * (tHash - text[i] * h) + text[i+m]) % q;
    if (tHash < 0) tHash += q;
  }
}`,
        related: [
          { name: 'KMP', hint: 'LPS-based →' },
          { name: 'Z-Algorithm', hint: 'Z-array →' },
        ],
      },
      {
        id: 'z-algorithm', name: 'Z-Algorithm',
        complexity: { best: 'O(n + m)', avg: 'O(n + m)', worst: 'O(n + m)', space: 'O(n + m)' },
        stability: '—',
        description: 'Pattern matching using Z-array construction.',
        insight: 'The Z-array stores the length of the longest common prefix between the string and each of its suffixes. When concatenated as P$T, Z-values equal to |P| indicate matches.',
        code: `function zAlgorithm(text, pattern) {
  const s = pattern + '$' + text;
  const z = zFunction(s);
  const matches = [];
  for (let i = pattern.length + 1; i < s.length; i++) {
    if (z[i] === pattern.length)
      matches.push(i - pattern.length - 1);
  }
  return matches;
}

function zFunction(s) {
  const z = Array(s.length).fill(0);
  let l = 0, r = 0;
  for (let i = 1; i < s.length; i++) {
    if (i < r) z[i] = Math.min(r - i, z[i - l]);
    while (i + z[i] < s.length && s[z[i]] === s[i + z[i]]) z[i]++;
    if (i + z[i] > r) { l = i; r = i + z[i]; }
  }
  return z;
}`,
        related: [
          { name: 'KMP', hint: 'failure function →' },
          { name: 'Suffix array', hint: 'all substrings →' },
        ],
      },
    ],
  },
  {
    id: 'sliding-window',
    name: 'Two Pointers / Sliding Window',
    icon: 'move',
    difficulty: 'Junior',
    algorithms: [
      {
        id: 'max-sum-subarray', name: 'Max Sum Subarray',
        complexity: { best: 'O(n)', avg: 'O(n)', worst: 'O(n)', space: 'O(1)' },
        stability: '—',
        description: 'Find contiguous subarray with maximum sum using Kadane\'s algorithm.',
        insight: 'Kadane\'s algorithm maintains a running sum. If it goes negative, reset to 0 — a negative prefix can never help maximize a future sum.',
        code: `function maxSubArray(nums) {
  let maxSum = -Infinity, currentSum = 0;
  for (const num of nums) {
    currentSum += num;
    maxSum = Math.max(maxSum, currentSum);
    if (currentSum < 0) currentSum = 0;
  }
  return maxSum;
}`,
        related: [
          { name: 'Longest unique substring', hint: 'sliding window →' },
          { name: 'Minimum window substring', hint: 'two pointers →' },
        ],
      },
      {
        id: 'longest-unique-substring', name: 'Longest Unique Substring',
        complexity: { best: 'O(n)', avg: 'O(n)', worst: 'O(n)', space: 'O(min(n, m))' },
        stability: '—',
        description: 'Find the longest substring without repeating characters.',
        insight: 'The sliding window expands with the right pointer and contracts the left pointer when a duplicate is found. A hash map tracks the last seen position of each character.',
        code: `function lengthOfLongestSubstring(s) {
  const seen = new Map();
  let maxLen = 0, left = 0;
  for (let right = 0; right < s.length; right++) {
    if (seen.has(s[right]) && seen.get(s[right]) >= left)
      left = seen.get(s[right]) + 1;
    seen.set(s[right], right);
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}`,
        related: [
          { name: 'Max sum subarray', hint: 'Kadane\'s →' },
          { name: 'Minimum window', hint: 'variable window →' },
        ],
      },
      {
        id: 'two-sum-sorted', name: 'Two Sum (Sorted)',
        complexity: { best: 'O(n)', avg: 'O(n)', worst: 'O(n)', space: 'O(1)' },
        stability: '—',
        description: 'Find two numbers that sum to target using two pointers.',
        insight: 'On a sorted array, start with pointers at both ends. If the sum is too small, move left right. If too large, move right left. This eliminates one element per step.',
        code: `function twoSumSorted(nums, target) {
  let left = 0, right = nums.length - 1;
  while (left < right) {
    const sum = nums[left] + nums[right];
    if (sum === target) return [left, right];
    if (sum < target) left++;
    else right--;
  }
  return null;
}`,
        related: [
          { name: 'Three sum', hint: 'extend to 3 →' },
          { name: 'Container with most water', hint: 'two pointers →' },
        ],
      },
    ],
  },
  {
    id: 'constraint-propagation',
    name: 'Constraint Propagation',
    icon: 'filter',
    difficulty: 'Mid-level',
    algorithms: [
      {
        id: 'sudoku-cp', name: 'Sudoku Solver (CP+BT)',
        complexity: { best: 'O(n⁴)', avg: 'O(n⁴)', worst: 'O(9^(n²))', space: 'O(n²)' },
        stability: '—',
        description: 'Constraint propagation eliminates impossible values before backtracking — 10× faster on hard puzzles.',
        insight: 'Before guessing, eliminate impossible candidates from peers. When a cell has only one candidate, propagate that constraint. This prunes the search tree dramatically, reducing backtracking steps by 90%+ on expert puzzles.',
        code: `function solveSudoku(board) {
  const peers = buildPeers();
  const candidates = initCandidates(board);

  function propagate(cands) {
    let changed = true;
    while (changed) {
      changed = false;
      for (const cell of cells) {
        if (cands[cell].size === 1) {
          const val = [...cands[cell]][0];
          for (const peer of peers[cell]) {
            if (cands[peer].has(val)) {
              cands[peer].delete(val);
              changed = true;
            }
          }
        }
      }
    }
  }

  function search(cands) {
    propagate(cands);
    if (isSolved(cands)) return cands;
    const cell = findMinCandidates(cands);
    for (const val of cands[cell]) {
      const copy = cloneCandidates(cands);
      copy[cell] = new Set([val]);
      const result = search(copy);
      if (result) return result;
    }
    return null;
  }

  return search(candidates);
}`,
        related: [
          { name: 'Sudoku Solver (Backtracking)', hint: 'pure backtracking →' },
          { name: 'Dancing Links', hint: 'exact cover →' },
        ],
      },
    ],
  },
];

export function getAlgorithm(categoryId, algorithmId) {
  const category = categories.find(c => c.id === categoryId);
  if (!category) return null;
  const algorithm = category.algorithms.find(a => a.id === algorithmId);
  return algorithm ? { ...algorithm, category } : null;
}
