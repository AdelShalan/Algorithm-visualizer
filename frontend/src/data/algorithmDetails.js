export const algorithmDetails = {
  // ─── Sorting ───
  'bubble-sort': {
    overview: 'Bubble sort repeatedly scans the array, comparing adjacent pairs and swapping them if out of order. Each full pass "bubbles" the largest unsorted element to its final position at the end. The algorithm stops early if a pass completes with no swaps, detecting that the array is already sorted.',
    steps: [
      'Compare adjacent elements arr[j] and arr[j+1].',
      'If arr[j] > arr[j+1], swap them — the larger value moves right.',
      'After each full pass, the largest remaining element settles at its correct position.',
      'An optimized flag tracks whether any swap occurred; if none did, the array is sorted and we exit early.',
    ],
  },
  'selection-sort': {
    overview: 'Selection sort divides the array into a sorted prefix and an unsorted suffix. On each iteration it scans the entire unsorted portion to find the minimum element, then swaps it into the first unsorted position. It always performs exactly n−1 swaps regardless of input order.',
    steps: [
      'Scan the unsorted portion to find the index of the minimum element.',
      'Swap the minimum with the first unsorted element.',
      'The sorted prefix grows by one; the unsorted suffix shrinks by one.',
      'Repeat until the unsorted portion is empty.',
    ],
  },
  'insertion-sort': {
    overview: 'Insertion sort builds the sorted array incrementally. It takes each element from the unsorted portion and inserts it into the correct position within the sorted prefix by shifting larger elements one slot to the right. It is adaptive — nearly-sorted input runs in near-linear time.',
    steps: [
      'Take the next unsorted element (the "key").',
      'Compare it with elements in the sorted prefix, moving from right to left.',
      'Shift each larger element one position to the right.',
      'Insert the key into the gap where it belongs.',
    ],
  },
  'merge-sort': {
    overview: 'Merge sort follows the divide-and-conquer paradigm: split the array in half recursively until each subarray has one element, then merge pairs of sorted subarrays back together. Merging two sorted arrays is a linear operation, and the recursion tree has log n levels, giving O(n log n) guaranteed.',
    steps: [
      'Divide: split the array at its midpoint into left and right halves.',
      'Recurse: sort each half independently (the base case is a single element).',
      'Merge: walk through both sorted halves with two pointers, picking the smaller element each time.',
      'Copy the merged result back into the original array.',
    ],
  },
  'quick-sort': {
    overview: 'Quicksort picks a "pivot" element and partitions the array so that all smaller elements go to the left and all larger elements go to the right. It then recursively sorts the two partitions. With a good pivot choice, the array is halved each level, yielding O(n log n) average time.',
    steps: [
      'Pick a pivot (commonly the last element).',
      'Partition: rearrange the array so elements ≤ pivot are on the left, and > pivot on the right.',
      'Place the pivot in its final sorted position between the two partitions.',
      'Recursively sort the left and right partitions.',
    ],
  },
  'heap-sort': {
    overview: 'Heap sort first builds a max-heap from the array (a complete binary tree where each parent is ≥ its children). It then repeatedly extracts the maximum (the root), swaps it to the end of the array, and restores the heap property. This guarantees O(n log n) worst-case with O(1) extra space.',
    steps: [
      'Build a max-heap by calling heapify on each non-leaf node from bottom to top.',
      'Swap the root (maximum) with the last element of the heap.',
      'Reduce the heap size by one (the last element is now in its final position).',
      'Heapify the new root to restore the max-heap property; repeat.',
    ],
  },

  // ─── Searching ───
  'linear-search': {
    overview: 'Linear search examines each element of the array sequentially, comparing it with the target value. It works on any data — sorted or unsorted — and requires no preprocessing. While simple, its O(n) time makes it impractical for large datasets when faster alternatives exist.',
    steps: [
      'Start at the first element (index 0).',
      'Compare the current element with the target.',
      'If they match, return the current index.',
      'If the end of the array is reached without a match, return −1 (not found).',
    ],
  },
  'binary-search': {
    overview: 'Binary search works on sorted arrays by repeatedly halving the search space. It compares the target with the middle element; if they differ, it discards the half that cannot contain the target. This eliminates half the remaining candidates each step, achieving O(log n) time.',
    steps: [
      'Set low = 0 and high = last index.',
      'Compute mid = (low + high) / 2.',
      'If arr[mid] equals the target, return mid.',
      'If arr[mid] < target, discard the left half (low = mid + 1); otherwise discard the right half (high = mid − 1).',
      'Repeat until low > high (target not found).',
    ],
  },
  'bfs': {
    overview: 'Breadth-First Search explores a graph level by level, visiting all neighbors of the current node before going deeper. It uses a FIFO queue to ensure nodes are processed in order of increasing distance from the source. In unweighted graphs, BFS guarantees the shortest path.',
    steps: [
      'Enqueue the start node and mark it as visited.',
      'Dequeue the front node — this is the current node being explored.',
      'For each unvisited neighbor, mark it visited and enqueue it.',
      'Repeat until the queue is empty or the target is found.',
    ],
  },
  'dfs': {
    overview: 'Depth-First Search explores as far as possible along each branch before backtracking. It uses a stack (or recursion) to go deep into the graph. DFS is memory-efficient for deep trees and is the foundation for topological sorting, cycle detection, and connected-component analysis.',
    steps: [
      'Visit the current node and mark it as visited.',
      'For each unvisited neighbor, recursively call DFS on it.',
      'When all neighbors are visited (or none exist), backtrack to the previous node.',
      'Continue until all reachable nodes have been explored.',
    ],
  },

  // ─── Graph ───
  'dijkstra': {
    overview: "Dijkstra's algorithm finds the shortest path from a source node to all other nodes in a weighted graph with non-negative edge weights. It uses a priority queue to always expand the closest unvisited node next. Once a node is extracted from the queue, its shortest distance is final.",
    steps: [
      'Initialize all distances to ∞ except the source (distance 0).',
      'Extract the unvisited node with the smallest known distance.',
      'For each neighbor, check if going through the current node gives a shorter path.',
      'If so, update the neighbor\'s distance and record the current node as its predecessor.',
      'Repeat until all nodes are visited or the target is reached.',
    ],
  },
  'astar': {
    overview: "A* search finds the shortest path by combining Dijkstra's guarantee with a heuristic estimate of remaining distance. Each node's priority is f = g + h, where g is the actual cost from the start and h is the estimated cost to the goal. With an admissible heuristic (never overestimates), A* is optimal.",
    steps: [
      'Initialize the open set with the start node; set g(start) = 0.',
      'Select the node with the lowest f = g + h from the open set.',
      'If this node is the goal, reconstruct the path by following predecessors.',
      'For each neighbor, compute tentative g and update if it improves the known path.',
      'Repeat until the goal is reached or the open set is empty.',
    ],
  },
  'bellman-ford': {
    overview: 'Bellman-Ford computes shortest paths from a single source, handling negative edge weights. It relaxes all edges V−1 times, progressively improving distance estimates. After V−1 iterations, if any edge can still be relaxed, a negative-weight cycle exists.',
    steps: [
      'Initialize all distances to ∞ except the source (distance 0).',
      'For V−1 iterations, relax every edge: if dist[u] + weight < dist[v], update dist[v].',
      'Each iteration guarantees correct shortest paths for nodes up to i edges away from the source.',
      'After V−1 iterations, check all edges one more time — if any can still be relaxed, a negative cycle exists.',
    ],
  },
  'floyd-warshall': {
    overview: 'Floyd-Warshall computes shortest paths between all pairs of vertices using dynamic programming. It considers each vertex k as a potential intermediate point and checks whether routing through k improves the path from i to j. The algorithm is O(V³) but handles negative edges gracefully.',
    steps: [
      'Initialize the distance matrix with direct edge weights (∞ for no edge, 0 on the diagonal).',
      'For each intermediate vertex k, iterate over all pairs (i, j).',
      'If dist[i][k] + dist[k][j] < dist[i][j], update dist[i][j] with the shorter path.',
      'After all k values are processed, the matrix contains all-pairs shortest distances.',
    ],
  },
  'kruskal': {
    overview: "Kruskal's algorithm builds a Minimum Spanning Tree by sorting all edges by weight and greedily adding the smallest edge that doesn't create a cycle. It uses Union-Find (Disjoint Set Union) to efficiently detect whether two vertices are already in the same component.",
    steps: [
      'Sort all edges in ascending order of weight.',
      'For each edge, check if its endpoints belong to different components using Union-Find.',
      'If they are in different components, add the edge to the MST and union the two components.',
      'If they are in the same component, skip the edge (it would create a cycle).',
      'Stop when the MST has V−1 edges.',
    ],
  },
  'prim': {
    overview: "Prim's algorithm grows a Minimum Spanning Tree from a starting vertex by repeatedly adding the cheapest edge that connects a tree vertex to a non-tree vertex. Unlike Kruskal's, Prim's maintains a single connected component throughout.",
    steps: [
      'Initialize all key values to ∞ except the source (key 0).',
      'Select the unvisited vertex with the smallest key value.',
      'Add it to the MST and update the keys of all its neighbors.',
      'If a neighbor\'s edge weight is less than its current key, update the key and record the parent.',
      'Repeat until all vertices are included in the MST.',
    ],
  },

  // ─── Dynamic Programming ───
  'fibonacci': {
    overview: 'The Fibonacci sequence is defined as F(n) = F(n−1) + F(n−2) with base cases F(0)=0, F(1)=1. Naive recursion recomputes the same subproblems exponentially many times. Dynamic programming eliminates this redundancy by caching results (memoization) or building up from the bottom (tabulation), reducing time from O(2ⁿ) to O(n).',
    steps: [
      'Base cases: F(0) = 0, F(1) = 1 — these are known without computation.',
      'For each subsequent value, check if it is already in the memo table.',
      'If not, compute F(n) = F(n−1) + F(n−2) recursively (with memoization) or iteratively (with tabulation).',
      'Store the result so it is never recomputed.',
    ],
  },
  'knapsack': {
    overview: 'The 0/1 Knapsack problem maximizes total value of items placed in a bag of limited capacity, where each item can be taken at most once. The DP table dp[i][w] stores the maximum value achievable using the first i items with capacity w. The recurrence considers two choices: include the item or skip it.',
    steps: [
      'Initialize dp[0][w] = 0 for all w (no items → no value).',
      'For each item i and each capacity w, decide: skip the item (dp[i−1][w]) or take it (value[i] + dp[i−1][w−weight[i]]).',
      'Take the maximum of these two choices as dp[i][w].',
      'The answer is dp[n][W] — the best value using all items with full capacity.',
    ],
  },
  'lcs': {
    overview: 'The Longest Common Subsequence problem finds the longest sequence of characters that appears in both strings in the same relative order (not necessarily contiguous). The DP table compares characters: if they match, extend the diagonal; if not, take the best of skipping a character from either string.',
    steps: [
      'Initialize dp[i][0] = 0 and dp[0][j] = 0 (empty string has no common subsequence).',
      'If characters match (a[i] == b[j]), set dp[i][j] = dp[i−1][j−1] + 1.',
      'If they differ, set dp[i][j] = max(dp[i−1][j], dp[i][j−1]).',
      'Backtrack from dp[m][n] to reconstruct the actual subsequence.',
    ],
  },
  'edit-distance': {
    overview: 'Edit distance (Levenshtein distance) measures the minimum number of insertions, deletions, and replacements needed to transform one string into another. The DP table dp[i][j] stores the cost of converting the first i characters of string A into the first j characters of string B.',
    steps: [
      'Initialize dp[i][0] = i (delete all characters) and dp[0][j] = j (insert all characters).',
      'If characters match (a[i] == b[j]), the cost is dp[i−1][j−1] — no operation needed.',
      'If they differ, take the minimum of insert (dp[i][j−1]+1), delete (dp[i−1][j]+1), or replace (dp[i−1][j−1]+1).',
      'The answer is dp[m][n] — the total cost to transform the full strings.',
    ],
  },

  // ─── Tree ───
  'bst': {
    overview: 'A Binary Search Tree maintains the invariant that for every node, all values in the left subtree are smaller and all values in the right subtree are larger. This property enables efficient search, insertion, and deletion in O(log n) average time, though it degrades to O(n) on sorted input without balancing.',
    steps: [
      'Search: compare the target with the current node; go left if smaller, right if larger.',
      'Insert: follow the search path until reaching a null position, then place the new node there.',
      'Delete: if the node has two children, replace it with its in-order successor (smallest in right subtree), then delete the successor.',
      'Each operation traverses from root to a leaf, taking time proportional to the tree height.',
    ],
  },
  'avl': {
    overview: 'An AVL tree is a self-balancing BST that maintains the invariant: the heights of the left and right subtrees of every node differ by at most 1. After each insertion or deletion, the tree checks balance factors and performs rotations (single or double) to restore the invariant, guaranteeing O(log n) height.',
    steps: [
      'Insert the node as in a regular BST.',
      'Update heights from the inserted node back up to the root.',
      'Check the balance factor (left height − right height) at each ancestor.',
      'If the balance factor is ±2, perform the appropriate rotation (LL, RR, LR, or RL) to rebalance.',
    ],
  },
  'red-black': {
    overview: 'A Red-Black tree is a self-balancing BST that uses node colors (red/black) and five invariants to guarantee O(log n) height. It allows more imbalance than AVL trees but requires fewer rotations, making it faster for frequent insertions and deletions. It is the basis for many standard library map/set implementations.',
    steps: [
      'Insert the new node as red (to avoid breaking the black-height property).',
      'If the parent is black, we are done — no invariant is violated.',
      'If the parent is red and the uncle is red, recolor: parent and uncle become black, grandparent becomes red, then recurse up.',
      'If the parent is red and the uncle is black, perform rotations (left or right) and recolor to eliminate the red-red violation.',
      'Finally, ensure the root is always black.',
    ],
  },
  'trie': {
    overview: 'A Trie (prefix tree) stores strings as paths from the root, where each edge represents a character. Shared prefixes share the same path, making it space-efficient for large sets of similar strings. Tries excel at prefix queries, autocomplete, and dictionary lookups in O(L) time where L is the string length.',
    steps: [
      'Start at the root. For each character in the word, follow the corresponding edge.',
      'If an edge does not exist, create a new node for that character.',
      'After processing all characters, mark the final node as an end-of-word.',
      'To search, follow the path character by character; if the path exists and the final node is marked, the word is in the trie.',
    ],
  },

  // ─── Hashing ───
  'hash-chaining': {
    overview: 'Separate chaining resolves hash collisions by storing a linked list (or dynamic array) at each bucket. When multiple keys hash to the same index, they are appended to that bucket\'s list. This approach handles any load factor gracefully — performance degrades linearly but never fails.',
    steps: [
      'Compute the hash of the key and take modulo the table size to get the bucket index.',
      'Traverse the linked list at that bucket to check if the key already exists.',
      'If found, update the value; if not, append a new node to the list.',
      'To retrieve, compute the hash and search the corresponding list linearly.',
    ],
  },
  'hash-open-addressing': {
    overview: 'Open addressing stores all entries directly in the hash table array. When a collision occurs, it probes for the next available slot using a strategy like linear probing (check index+1, index+2, ...). This gives better cache locality than chaining but requires careful load factor management.',
    steps: [
      'Compute the hash of the key to get the initial index.',
      'If the slot is occupied, probe to the next slot (index+1, wrapping around).',
      'Continue probing until an empty slot is found, then insert the key-value pair.',
      'To retrieve, probe from the initial index until the key is found or an empty slot is encountered.',
    ],
  },
  'hash-load-factor': {
    overview: 'The load factor (α = n / table_size) measures how full a hash table is. When α exceeds a threshold (typically 0.7), the table is resized (usually doubled) and all entries are rehashed into the new, larger table. Rehashing is O(n) but amortized O(1) per insertion.',
    steps: [
      'After each insertion, compute the load factor α = number of entries / table size.',
      'If α exceeds the threshold (e.g., 0.7), allocate a new table of double the size.',
      'Rehash every existing entry into the new table using the new size for modulo.',
      'Replace the old table with the new one; the load factor drops to roughly α/2.',
    ],
  },

  // ─── Backtracking ───
  'n-queens': {
    overview: 'The N-Queens problem asks: place N queens on an N×N chessboard so that no two queens attack each other. A backtracking solver places queens row by row, checking column and diagonal constraints. When a conflict is detected, it backtracks to the previous row and tries the next column.',
    steps: [
      'Try placing a queen in each column of the current row.',
      'Check if the position is safe: no other queen in the same column or on either diagonal.',
      'If safe, place the queen and move to the next row.',
      'If no column works, backtrack: remove the queen from the previous row and try its next column.',
    ],
  },
  'sudoku': {
    overview: 'Sudoku is a constraint satisfaction problem: fill a 9×9 grid so each row, column, and 3×3 box contains all digits 1–9. This pure backtracking solver tries digits 1–9 in each empty cell sequentially, checking all three constraints. When a conflict arises, it backtracks to the previous cell and tries the next digit.',
    steps: [
      'Find the next empty cell (value 0) scanning left-to-right, top-to-bottom.',
      'Try digits 1 through 9 in that cell.',
      'For each digit, check row, column, and 3×3 box constraints.',
      'If valid, place the digit and recurse to the next empty cell.',
      'If no digit works, reset the cell to 0 and backtrack.',
    ],
  },
  'sudoku-cp': {
    overview: 'This solver combines constraint propagation with backtracking. Before guessing, it maintains a set of possible candidates for each cell and propagates constraints: when a cell is assigned a value, that value is eliminated from all peers (same row, column, or box). If a cell is reduced to one candidate, it is automatically assigned. Only when propagation stalls does the solver guess, using the Minimum Remaining Values (MRV) heuristic to pick the cell with fewest candidates.',
    steps: [
      'Initialize candidates: each empty cell starts with {1..9}, given cells are fixed.',
      'Propagate: when a cell has one candidate, eliminate it from all peers.',
      'Repeat propagation until no more changes (fixpoint).',
      'If any cell has zero candidates, a contradiction occurred — backtrack.',
      'If all cells have one candidate, the puzzle is solved.',
      'Otherwise, guess: pick the cell with fewest candidates (MRV heuristic) and try each value.',
      'Recurse with propagation after each guess. Backtrack on failure.',
    ],
  },
  'permutations': {
    overview: 'Generating all permutations of a set explores every possible ordering of its elements. The backtracking approach builds permutations incrementally: at each step, pick one remaining element, add it to the current path, and recurse. After returning, remove the element (backtrack) and try the next choice.',
    steps: [
      'Start with an empty path and all elements available.',
      'Pick one available element, add it to the path, and remove it from the available set.',
      'Recurse: repeat with the remaining elements.',
      'When no elements remain, the path is a complete permutation — record it.',
      'Backtrack: remove the last element from the path and restore it to the available set.',
    ],
  },

  // ─── Divide & Conquer ───
  'dc-merge-sort': {
    overview: 'This visualization shows the two distinct phases of merge sort: the recursive splitting (divide) and the iterative merging (conquer). The divide phase creates a binary tree of subarrays down to single elements. The conquer phase merges adjacent sorted subarrays, doubling the sorted segment size at each level.',
    steps: [
      'Divide phase: split the array at its midpoint recursively until each subarray has one element.',
      'The recursion tree has log n levels of splitting.',
      'Conquer phase: merge adjacent pairs of sorted subarrays into larger sorted subarrays.',
      'At each merge level, all elements are compared and rearranged — O(n) work per level.',
    ],
  },
  'karatsuba': {
    overview: 'Karatsuba multiplication is a divide-and-conquer algorithm that multiplies two n-digit numbers faster than the grade-school O(n²) method. It splits each number into high and low halves and computes the product using only 3 recursive multiplications instead of 4, reducing the recurrence to T(n) = 3T(n/2) + O(n).',
    steps: [
      'Split each number into high and low halves: x = high1·10^m + low1, y = high2·10^m + low2.',
      'Compute three products recursively: z2 = high1·high2, z0 = low1·low2, z1 = (high1+low1)·(high2+low2).',
      'The middle term is derived: (z1 − z2 − z0) replaces the two products that would normally be needed.',
      'Combine: result = z2·10^(2m) + (z1−z2−z0)·10^m + z0.',
    ],
  },
  'closest-pair': {
    overview: 'The closest pair problem finds the two points with minimum Euclidean distance among n points in 2D space. The divide-and-conquer approach splits points by x-coordinate, solves recursively on each half, then checks a narrow strip of width δ around the dividing line — only 7 points need checking per point in the strip.',
    steps: [
      'Sort points by x-coordinate.',
      'Split the set at the median x-coordinate into left and right halves.',
      'Recursively find the closest pair in each half; let δ be the minimum of the two distances.',
      'Check the strip of width δ around the dividing line: for each point, compare with at most 7 subsequent points sorted by y.',
    ],
  },

  // ─── String ───
  'kmp': {
    overview: 'The Knuth-Morris-Pratt (KMP) algorithm searches for a pattern in a text in O(n+m) time by precomputing an LPS (Longest Proper Prefix which is also Suffix) array. When a mismatch occurs, the LPS array tells us how far to shift the pattern without re-examining characters already matched in the text.',
    steps: [
      'Precompute the LPS array for the pattern: LPS[i] is the length of the longest proper prefix of pattern[0..i] that is also a suffix.',
      'Compare pattern[j] with text[i]. If they match, advance both pointers.',
      'On a mismatch, shift the pattern by setting j = LPS[j−1] (skip the already-matched prefix).',
      'When j reaches the pattern length, a match is found at position i−j.',
    ],
  },
  'rabin-karp': {
    overview: 'Rabin-Karp uses a rolling hash to find pattern occurrences in text. It computes a hash of the pattern and the first window of text, then slides the window one character at a time, updating the hash in O(1). When hashes match, it verifies character-by-character to rule out false positives.',
    steps: [
      'Compute the hash of the pattern and the first m characters of the text.',
      'Slide the window one position: subtract the contribution of the outgoing character and add the incoming character (rolling hash).',
      'If the window hash matches the pattern hash, verify character-by-character.',
      'If verification succeeds, report a match; otherwise, continue sliding.',
    ],
  },
  'z-algorithm': {
    overview: 'The Z-algorithm constructs a Z-array where Z[i] is the length of the longest common prefix between the string and its suffix starting at i. By concatenating pattern + "$" + text, Z-values equal to the pattern length indicate matches. The algorithm runs in O(n+m) using a clever interval-maintenance technique.',
    steps: [
      'Concatenate pattern + "$" + text into a single string S.',
      'Compute the Z-array: for each position i, find the longest prefix of S that matches a substring starting at i.',
      'Use the [L, R] interval (the rightmost Z-box found so far) to skip redundant comparisons.',
      'Any Z[i] equal to the pattern length indicates a match at position i − pattern_length − 1 in the text.',
    ],
  },

  // ─── Sliding Window ───
  'max-sum-subarray': {
    overview: "Kadane's algorithm finds the contiguous subarray with the maximum sum in O(n) time. It maintains a running sum that resets to zero whenever it goes negative — a negative prefix can never help maximize a future sum. The maximum value of this running sum across all positions is the answer.",
    steps: [
      'Initialize currentSum = 0 and maxSum = −∞.',
      'Add the current element to currentSum.',
      'Update maxSum = max(maxSum, currentSum).',
      'If currentSum goes negative, reset it to 0 (discard the negative prefix).',
    ],
  },
  'longest-unique-substring': {
    overview: 'The sliding window approach finds the longest substring without repeating characters. Two pointers (left and right) define a window that expands by moving right and contracts by moving left when a duplicate is found. A hash map tracks the last seen position of each character for O(1) lookups.',
    steps: [
      'Expand the window by moving the right pointer forward.',
      'If the new character is already in the window and its last position is ≥ left, move left to last_position + 1.',
      'Update the last-seen position of the current character.',
      'Track the maximum window size (right − left + 1) seen so far.',
    ],
  },
  'two-sum-sorted': {
    overview: 'On a sorted array, the two-sum problem can be solved in O(n) using two pointers starting at opposite ends. If the sum is too small, the left pointer moves right (increasing the sum). If too large, the right pointer moves left (decreasing the sum). This eliminates one candidate per step.',
    steps: [
      'Place left pointer at the start and right pointer at the end of the sorted array.',
      'Compute sum = arr[left] + arr[right].',
      'If sum equals the target, return the pair of indices.',
      'If sum is too small, increment left (we need a larger value).',
      'If sum is too large, decrement right (we need a smaller value).',
    ],
  },
};
