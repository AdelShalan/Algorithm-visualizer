export const docsContent = {
  'bubble-sort': {
    tag: 'Sorting',
    title: 'Bubble sort',
    desc: 'A comparison-based algorithm that repeatedly walks the array, swapping adjacent elements that are out of order. Each pass "bubbles" the next largest element to its final position.',
    readTime: '5 min read',
    difficulty: 'Junior · Interview warmup',
    updated: 'May 2026',
    views: '3,847',
    sections: [
      {
        id: 'overview',
        title: 'Overview',
        type: 'text',
        content: `Bubble sort is the canonical introductory sorting algorithm — not because it's useful in production, but because its mechanics are completely legible. Every step is a single comparison and a possible swap. There are no pivots, no merges, no auxiliary arrays.

The name comes from how large values move through the array: after each pass, the largest unsorted element has "bubbled" all the way to its correct position at the right boundary. After k passes, the k rightmost elements are permanently sorted.`,
        callout: {
          type: 'info',
          title: 'When to use bubble sort',
          body: 'In practice: almost never. Its O(n²) average case is matched or beaten by insertion sort in every realistic scenario. Its value is pedagogical — the swap-by-swap animation makes comparison-based sorting intuitive before moving on to merge or quicksort.',
        },
      },
      {
        id: 'algorithm',
        title: 'How it works',
        type: 'text',
        content: `The algorithm runs an outer loop from i = 0 to n−2 (the passes), and an inner loop from j = 0 to n−i−2 (the comparisons within each pass). The inner bound shrinks by 1 each pass — the last i positions are already sorted and don't need re-checking.`,
        steps: [
          { title: 'Start pass i = 0', text: 'Walk from index 0 to n−2. Compare each adjacent pair arr[j] and arr[j+1].' },
          { title: 'Compare and conditionally swap', text: 'If arr[j] > arr[j+1], swap them. The larger element moves one position right. If arr[j] ≤ arr[j+1], no action — pointer just advances.' },
          { title: 'End of pass — largest element is locked', text: 'After traversing to n−i−2, the largest unsorted element is guaranteed to be at position n−i−1. It\'s now finalized and excluded from future passes.' },
          { title: 'Repeat or exit early', text: 'With early exit enabled: if a full pass completes with zero swaps, the array is sorted — stop immediately. Without it, always run n−1 passes.' },
        ],
      },
      {
        id: 'code',
        title: 'Implementation',
        type: 'code',
        languages: [
          {
            lang: 'JavaScript',
            filename: 'bubble-sort.js',
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

    // Early exit: no swaps means fully sorted
    if (!swapped) break;
  }

  return arr;
}`,
            highlightLines: [5, 6, 7, 8, 9],
          },
          {
            lang: 'Python',
            filename: 'bubble_sort.py',
            code: `def bubble_sort(arr: list) -> list:
    n = len(arr)
    for i in range(n - 1):
        swapped = False
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        if not swapped:
            break
    return arr`,
          },
          {
            lang: 'Java',
            filename: 'BubbleSort.java',
            code: `public class BubbleSort {
    public static void bubbleSort(int[] arr) {
        int n = arr.length;

        for (int i = 0; i < n - 1; i++) {
            boolean swapped = false;

            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                    swapped = true;
                }
            }

            if (!swapped) break;
        }
    }
}`,
          },
        ],
      },
      {
        id: 'complexity',
        title: 'Complexity',
        type: 'text',
        content: `The comparison count formula is exact, not just asymptotic. Without early exit, bubble sort always performs n(n−1)/2 comparisons regardless of input. For n=10 that's 45 comparisons. For n=100 it's 4,950.`,
        table: {
          headers: ['Case', 'Time', 'Comparisons (n=8)', 'Notes'],
          rows: [
            { cells: ['Best', 'O(n)', '7', 'Already sorted + early exit'], classes: ['good', 'mono', ''] },
            { cells: ['Average', 'O(n²)', '~20', 'Random input'], classes: ['bad', 'mono', ''] },
            { cells: ['Worst', 'O(n²)', '28', 'Reverse sorted'], classes: ['bad', 'mono', ''] },
            { cells: ['Space', 'O(1)', '—', 'In-place, no auxiliary array'], classes: ['good', 'mono', ''] },
          ],
        },
        callout: {
          type: 'warning',
          title: 'O(n²) is not just a ceiling',
          body: 'For random input, bubble sort performs approximately n²/4 swaps on average — not just n²/4 comparisons. Each swap is a 3-operation exchange. At n=1000, that\'s ~250,000 swaps. Insertion sort achieves the same O(n²) but with roughly half the writes, making it consistently faster in practice.',
        },
      },
      {
        id: 'variants',
        title: 'Variants',
        type: 'text',
        content: `Two variants are worth knowing — not because they change the asymptotic class, but because they illustrate different optimisation strategies:`,
        compareGrid: [
          {
            title: 'Cocktail shaker sort',
            tag: 'bidirectional',
            tagColor: '#ede9ff',
            tagTextColor: 'var(--purple)',
            pros: [
              'Traverses left-to-right then right-to-left alternately',
              'Moves both large and small elements faster toward their final positions',
              'Reduces the "turtle problem" — small values at the end are slow to migrate left in standard bubble sort',
            ],
          },
          {
            title: 'Odd-even sort',
            tag: 'parallel',
            tagColor: '#f0fdf4',
            tagTextColor: '#15803d',
            pros: [
              'Alternates between odd-indexed and even-indexed adjacent pairs',
              'Designed for parallel computation — all comparisons in a phase are independent',
              'Used in sorting networks and hardware implementations',
            ],
          },
        ],
      },
      {
        id: 'visualizer',
        title: 'Using the visualizer',
        type: 'text',
        content: `The bubble sort visualizer lets you step through the algorithm frame by frame. Here's what each element shows:`,
        tags: ['Comparing', 'Swapping', 'Sorted', 'Early exit', 'Pass history'],
        listItems: [
          '<strong>Purple highlight</strong> — the two elements currently being compared (arr[j] and arr[j+1])',
          '<strong>Red / amber highlight</strong> — a swap is occurring; red is the element moving left, amber moves right',
          '<strong>Green bars</strong> — permanently sorted elements at the right boundary',
          '<strong>Pass history bars</strong> — each column shows swap count for that pass; a zero-height bar means early exit triggered',
          '<strong>Comparison panel</strong> — shows the exact values being compared and whether a swap is needed',
        ],
        callout: {
          type: 'success',
          title: 'Pro tip',
          body: 'Try toggling <strong>Early exit</strong> on and off with an already-sorted array. With early exit: 1 pass, 7 comparisons, 0 swaps — done. Without it: 7 full passes, 28 comparisons. Same result, radically different work.',
        },
      },
      {
        id: 'related',
        title: 'Related algorithms',
        type: 'related',
        cards: [
          { name: 'Insertion sort', cx: 'O(n) best · O(n²) worst · O(1) space', tags: [{ text: 'Strictly better', bg: '#f0fdf4', color: '#15803d' }, { text: 'In-place', bg: '#ede9ff', color: 'var(--purple)' }] },
          { name: 'Selection sort', cx: 'O(n²) always · O(1) space', tags: [{ text: 'No early exit', bg: '#fff7ed', color: '#c2410c' }, { text: 'Fewer writes', bg: '#ede9ff', color: 'var(--purple)' }] },
          { name: 'Merge sort', cx: 'O(n log n) always · O(n) space', tags: [{ text: 'Production-ready', bg: '#f0fdf4', color: '#15803d' }, { text: 'Stable', bg: '#f0fdfa', color: '#0f766e' }] },
          { name: 'Quicksort', cx: 'O(n log n) avg · O(n²) worst', tags: [{ text: 'Not stable', bg: '#fff1f2', color: '#be123c' }, { text: 'Cache-friendly', bg: '#ede9ff', color: 'var(--purple)' }] },
        ],
      },
    ],
  },
  'selection-sort': {
    tag: 'Sorting',
    title: 'Selection sort',
    desc: 'Finds the minimum element in the unsorted portion and swaps it into its final position. Repeats until the entire array is sorted.',
    readTime: '4 min read',
    difficulty: 'Junior · Interview warmup',
    updated: 'May 2026',
    views: '2,103',
    sections: [
      {
        id: 'overview',
        title: 'Overview',
        type: 'text',
        content: `Selection sort takes a different approach from bubble sort: instead of bubbling elements one position at a time, it finds the absolute minimum in the unsorted portion and places it directly into its final position. Think of it like sorting a hand of playing cards by repeatedly finding the smallest card and moving it to the front.

The array is conceptually divided into two regions — a sorted prefix on the left and an unsorted suffix on the right — and the boundary between them moves rightward one element at a time.`,
      },
      {
        id: 'algorithm',
        title: 'How it works',
        type: 'text',
        content: `On iteration i (starting from 0), the algorithm scans the subarray from index i to n−1 to find the index of the minimum element. It then swaps that minimum element with the element at position i. This grows the sorted prefix by one.`,
        steps: [
          { title: 'Find the minimum', text: 'Scan the unsorted portion (indices i to n−1) to find the index of the smallest element.' },
          { title: 'Swap into position', text: 'Swap the minimum element with the element at position i. The sorted prefix now extends one element further.' },
          { title: 'Advance the boundary', text: 'Increment i. The unsorted portion shrinks by one. Repeat until only one element remains unsorted.' },
          { title: 'Terminate', text: 'After n−1 iterations, the array is fully sorted. The last element is automatically in place.' },
        ],
      },
      {
        id: 'complexity',
        title: 'Complexity',
        type: 'text',
        content: `Selection sort always performs exactly n(n−1)/2 comparisons regardless of input order — it never detects that the array is already sorted. However, it makes at most n−1 swaps, which is its distinguishing feature.`,
        table: {
          headers: ['Case', 'Time', 'Swaps', 'Notes'],
          rows: [
            { cells: ['Best', 'O(n²)', '0', 'Already sorted'], classes: ['bad', 'mono', ''] },
            { cells: ['Average', 'O(n²)', '~n/2', 'Random input'], classes: ['bad', 'mono', ''] },
            { cells: ['Worst', 'O(n²)', 'n−1', 'Reverse sorted'], classes: ['bad', 'mono', ''] },
            { cells: ['Space', 'O(1)', '—', 'In-place'], classes: ['good', 'mono', ''] },
          ],
        },
        callout: {
          type: 'info',
          title: 'Fewer writes matter',
          body: 'Selection sort\'s most distinctive property is that it makes at most n−1 swaps. For data structures where writing is expensive (like flash memory or EEPROM), this can be a genuine advantage over algorithms that perform O(n²) swaps.',
        },
      },
      {
        id: 'related',
        title: 'Related algorithms',
        type: 'related',
        cards: [
          { name: 'Bubble sort', cx: 'O(n) best · O(n²) worst · O(1) space', tags: [{ text: 'Early exit', bg: '#f0fdf4', color: '#15803d' }, { text: 'More swaps', bg: '#fff7ed', color: '#c2410c' }] },
          { name: 'Insertion sort', cx: 'O(n) best · O(n²) worst · O(1) space', tags: [{ text: 'Strictly better', bg: '#f0fdf4', color: '#15803d' }, { text: 'Adaptive', bg: '#ede9ff', color: 'var(--purple)' }] },
          { name: 'Heapsort', cx: 'O(n log n) always · O(1) space', tags: [{ text: 'Production-ready', bg: '#f0fdf4', color: '#15803d' }, { text: 'Fewer writes', bg: '#ede9ff', color: 'var(--purple)' }] },
        ],
      },
    ],
  },
  'insertion-sort': {
    tag: 'Sorting',
    title: 'Insertion sort',
    desc: 'Builds the sorted array incrementally by inserting each element into its correct position within the sorted prefix.',
    readTime: '5 min read',
    difficulty: 'Junior · Practical use',
    updated: 'May 2026',
    views: '4,521',
    sections: [
      {
        id: 'overview',
        title: 'Overview',
        type: 'text',
        content: `Insertion sort works the way most people naturally sort a hand of playing cards. You pick up one card at a time and insert it into the correct position among the cards you're already holding.

The algorithm maintains a sorted prefix of the array and, for each new element, shifts larger elements one position to the right to make room for it. This is an online algorithm — it can sort a stream of data as it arrives, without knowing the full dataset in advance.`,
      },
      {
        id: 'algorithm',
        title: 'How it works',
        type: 'text',
        content: `Starting from index 1, the algorithm takes the element at position i (the "key") and compares it with elements to its left, moving from right to left. Each element larger than the key is shifted one position to the right.`,
        steps: [
          { title: 'Pick the key', text: 'Take the element at position i as the "key" — this is the element we need to insert into the sorted prefix.' },
          { title: 'Scan leftward', text: 'Compare the key with elements to its left, starting from position i−1 and moving backward.' },
          { title: 'Shift larger elements', text: 'Each element larger than the key is shifted one position to the right, creating a gap.' },
          { title: 'Insert the key', text: 'When an element ≤ key is found (or the beginning is reached), place the key in the gap.' },
        ],
      },
      {
        id: 'complexity',
        title: 'Complexity',
        type: 'text',
        content: `Insertion sort is the most efficient simple sorting algorithm for small or nearly-sorted data. Its adaptive nature means it runs in O(n + d) time where d is the number of inversions.`,
        table: {
          headers: ['Case', 'Time', 'Inversions', 'Notes'],
          rows: [
            { cells: ['Best', 'O(n)', '0', 'Already sorted'], classes: ['good', 'mono', ''] },
            { cells: ['Average', 'O(n²)', 'n²/4', 'Random input'], classes: ['bad', 'mono', ''] },
            { cells: ['Worst', 'O(n²)', 'n(n−1)/2', 'Reverse sorted'], classes: ['bad', 'mono', ''] },
            { cells: ['Space', 'O(1)', '—', 'In-place, stable'], classes: ['good', 'mono', ''] },
          ],
        },
        callout: {
          type: 'success',
          title: 'Why it matters',
          body: 'Insertion sort is the algorithm of choice as a base case in hybrid sorts like Timsort (Python, Java) and Introsort (C++ STL), which switch to Insertion Sort for subarrays of size ≤ 16. It\'s stable, in-place, online, and adaptive.',
        },
      },
      {
        id: 'related',
        title: 'Related algorithms',
        type: 'related',
        cards: [
          { name: 'Bubble sort', cx: 'O(n) best · O(n²) worst · O(1) space', tags: [{ text: 'Slower in practice', bg: '#fff1f2', color: '#be123c' }, { text: 'Simpler code', bg: '#ede9ff', color: 'var(--purple)' }] },
          { name: 'Shell sort', cx: 'O(n log n) avg · O(n²) worst', tags: [{ text: 'Generalization', bg: '#ede9ff', color: 'var(--purple)' }, { text: 'Gap sequence', bg: '#f0fdf4', color: '#15803d' }] },
          { name: 'Timsort', cx: 'O(n log n) worst · O(n) space', tags: [{ text: 'Production standard', bg: '#f0fdf4', color: '#15803d' }, { text: 'Uses insertion sort', bg: '#ede9ff', color: 'var(--purple)' }] },
        ],
      },
    ],
  },
  'merge-sort': {
    tag: 'Sorting',
    title: 'Merge sort',
    desc: 'A divide-and-conquer algorithm that recursively splits the array in half, sorts each half, then merges them back together in sorted order.',
    readTime: '7 min read',
    difficulty: 'Intermediate · Core algorithm',
    updated: 'May 2026',
    views: '6,214',
    sections: [
      {
        id: 'overview',
        title: 'Overview',
        type: 'text',
        content: `Merge sort is the quintessential divide-and-conquer algorithm. The insight is deceptively simple: merging two already-sorted arrays is trivially easy — you just compare the front elements and pick the smaller one.

So instead of trying to sort a large array directly, we recursively split it in half until we reach arrays of size 1 (which are trivially sorted), then merge them back together in sorted order. This guarantees O(n log n) time in every case — best, average, and worst.`,
        callout: {
          type: 'info',
          title: 'When to use merge sort',
          body: 'Merge sort is the algorithm of choice when you need guaranteed O(n log n) performance and stability. It\'s the foundation of Timsort (Python\'s and Java\'s default sort). It\'s also essential for external sorting, linked list sorting, and parallel sorting.',
        },
      },
      {
        id: 'algorithm',
        title: 'How it works',
        type: 'text',
        content: `The algorithm has two phases. The divide phase recursively splits the array at its midpoint until each subarray contains a single element. The conquer phase then merges adjacent sorted subarrays.`,
        steps: [
          { title: 'Divide', text: 'Split the array at its midpoint into left and right halves.' },
          { title: 'Recurse', text: 'Sort each half independently. The base case is a single element — already sorted.' },
          { title: 'Merge', text: 'Walk through both sorted halves with two pointers, picking the smaller element each time and copying it into the output.' },
          { title: 'Copy back', text: 'Copy the merged result back into the original array. The combined segment is now sorted.' },
        ],
      },
      {
        id: 'code',
        title: 'Implementation',
        type: 'code',
        languages: [
          {
            lang: 'JavaScript',
            filename: 'merge-sort.js',
            code: `function mergeSort(arr, left = 0, right = arr.length - 1) {
  if (left < right) {
    const mid = Math.floor((left + right) / 2);
    mergeSort(arr, left, mid);
    mergeSort(arr, mid + 1, right);
    merge(arr, left, mid, right);
  }
  return arr;
}

function merge(arr, left, mid, right) {
  const leftArr = arr.slice(left, mid + 1);
  const rightArr = arr.slice(mid + 1, right + 1);
  let i = 0, j = 0, k = left;

  while (i < leftArr.length && j < rightArr.length) {
    if (leftArr[i] <= rightArr[j]) {
      arr[k++] = leftArr[i++];
    } else {
      arr[k++] = rightArr[j++];
    }
  }
  while (i < leftArr.length) arr[k++] = leftArr[i++];
   while (j < rightArr.length) arr[k++] = rightArr[j++];
}
`,
            highlightLines: [10, 11, 12, 13, 14, 15, 16, 17],
          },
          {
            lang: 'Python',
            filename: 'merge_sort.py',
            code: `def merge_sort(arr):
    if len(arr) > 1:
        mid = len(arr) // 2
        left = arr[:mid]
        right = arr[mid:]

        merge_sort(left)
        merge_sort(right)

        i = j = k = 0
        while i < len(left) and j < len(right):
            if left[i] <= right[j]:
                arr[k] = left[i]
                i += 1
            else:
                arr[k] = right[j]
                j += 1
            k += 1
        while i < len(left):
            arr[k] = left[i]
            i += 1; k += 1
        while j < len(right):
            arr[k] = right[j]
            j += 1; k += 1
`,
          },
          {
            lang: 'Java',
            filename: 'MergeSort.java',
            code: `public class MergeSort {
    public static void mergeSort(int[] arr) {
        if (arr.length > 1) {
            int mid = arr.length / 2;
            int[] left = java.util.Arrays.copyOfRange(arr, 0, mid);
            int[] right = java.util.Arrays.copyOfRange(arr, mid, arr.length);

            mergeSort(left);
            mergeSort(right);

            int i = 0, j = 0, k = 0;
            while (i < left.length && j < right.length) {
                if (left[i] <= right[j]) {
                    arr[k++] = left[i++];
                } else {
                    arr[k++] = right[j++];
                }
            }
            while (i < left.length) arr[k++] = left[i++];
            while (j < right.length) arr[k++] = right[j++];
        }
    }
}`,
          },
        ],
      },
      {
        id: 'complexity',
        title: 'Complexity',
        type: 'text',
        content: `Merge sort guarantees O(n log n) worst-case time while being stable — equal elements preserve their original order. The merge step requires O(n) auxiliary space.`,
        table: {
          headers: ['Case', 'Time', 'Space', 'Notes'],
          rows: [
            { cells: ['Best', 'O(n log n)', 'O(n)', 'Always splits evenly'], classes: ['ok', 'mono', ''] },
            { cells: ['Average', 'O(n log n)', 'O(n)', 'Random input'], classes: ['ok', 'mono', ''] },
            { cells: ['Worst', 'O(n log n)', 'O(n)', 'Guaranteed bound'], classes: ['ok', 'mono', ''] },
            { cells: ['Stable', 'Yes', '—', 'Preserves equal order'], classes: ['good', 'mono', ''] },
          ],
        },
      },
      {
        id: 'related',
        title: 'Related algorithms',
        type: 'related',
        cards: [
          { name: 'Quicksort', cx: 'O(n log n) avg · O(n²) worst · O(log n) space', tags: [{ text: 'Faster on average', bg: '#f0fdf4', color: '#15803d' }, { text: 'Not stable', bg: '#fff1f2', color: '#be123c' }] },
          { name: 'Heapsort', cx: 'O(n log n) always · O(1) space', tags: [{ text: 'Less space', bg: '#f0fdf4', color: '#15803d' }, { text: 'Not stable', bg: '#fff1f2', color: '#be123c' }] },
          { name: 'Timsort', cx: 'O(n log n) worst · O(n) space', tags: [{ text: 'Based on merge sort', bg: '#ede9ff', color: 'var(--purple)' }, { text: 'Python default', bg: '#f0fdf4', color: '#15803d' }] },
        ],
      },
    ],
  },
  'quick-sort': {
    tag: 'Sorting',
    title: 'Quicksort',
    desc: 'Selects a "pivot" element, partitions the array around it, then recursively sorts the left and right partitions.',
    readTime: '7 min read',
    difficulty: 'Intermediate · Core algorithm',
    updated: 'May 2026',
    views: '7,892',
    sections: [
      {
        id: 'overview',
        title: 'Overview',
        type: 'text',
        content: `Quicksort, invented by Tony Hoare in 1959, is arguably the most important sorting algorithm in practice. The idea is elegant: pick a "pivot" element, then rearrange the array so that all elements smaller than the pivot go to its left and all larger elements go to its right. The pivot is now in its final sorted position. Then recursively apply the same process to the left and right partitions.

Unlike merge sort, the hard work happens during the partition step — the recursive calls simply combine the results.`,
      },
      {
        id: 'algorithm',
        title: 'How it works',
        type: 'text',
        content: `The partition step (using the Lomuto scheme, which picks the last element as pivot) works as follows: maintain a pointer i that tracks the boundary between elements ≤ pivot and elements > pivot.`,
        steps: [
          { title: 'Choose a pivot', text: 'Select the last element as the pivot. (Other strategies: random, median-of-three.)' },
          { title: 'Partition', text: 'Walk through the array with pointer j. Whenever arr[j] ≤ pivot, increment i and swap arr[i] with arr[j].' },
          { title: 'Place the pivot', text: 'Swap the pivot with arr[i+1] — the pivot is now in its final sorted position.' },
          { title: 'Recurse', text: 'Recursively sort arr[low..pi−1] and arr[pi+1..high]. The base case is a subarray of size 0 or 1.' },
        ],
      },
      {
        id: 'code',
        title: 'Implementation',
        type: 'code',
        languages: [
          {
            lang: 'JavaScript',
            filename: 'quick-sort.js',
            code: `function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const pi = partition(arr, low, high);
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
  return arr;
}

function partition(arr, low, high) {
  const pivot = arr[high];
  let i = low - 1;

  for (let j = low; j < high; j++) {
    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}`,
            highlightLines: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
          },
          {
            lang: 'Python',
            filename: 'quick_sort.py',
            code: `def quick_sort(arr):
    def _quick_sort(arr, low, high):
        if low < high:
            pi = partition(arr, low, high)
            _quick_sort(arr, low, pi - 1)
            _quick_sort(arr, pi + 1, high)

    def partition(arr, low, high):
        pivot = arr[high]
        i = low - 1
        for j in range(low, high):
            if arr[j] <= pivot:
                i += 1
                arr[i], arr[j] = arr[j], arr[i]
        arr[i + 1], arr[high] = arr[high], arr[i + 1]
        return i + 1

    _quick_sort(arr, 0, len(arr) - 1)
    return arr
`,
          },
          {
            lang: 'Java',
            filename: 'QuickSort.java',
            code: `public class QuickSort {
    public static void quickSort(int[] arr) {
        quickSort(arr, 0, arr.length - 1);
    }

    private static void quickSort(int[] arr, int low, int high) {
        if (low < high) {
            int pi = partition(arr, low, high);
            quickSort(arr, low, pi - 1);
            quickSort(arr, pi + 1, high);
        }
    }

    private static int partition(int[] arr, int low, int high) {
        int pivot = arr[high];
        int i = low - 1;

        for (int j = low; j < high; j++) {
            if (arr[j] <= pivot) {
                i++;
                int temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }
        }
        int temp = arr[i + 1];
        arr[i + 1] = arr[high];
        arr[high] = temp;
        return i + 1;
    }
}`,
          },
        ],
      },
      {
        id: 'complexity',
        title: 'Complexity',
        type: 'text',
        content: `Quick sort's performance depends critically on pivot choice. If the pivot is always the median, the array is split evenly — O(n log n). If always the smallest or largest, it degrades to O(n²).`,
        table: {
          headers: ['Case', 'Time', 'Space', 'Notes'],
          rows: [
            { cells: ['Best', 'O(n log n)', 'O(log n)', 'Pivot always median'], classes: ['good', 'mono', ''] },
            { cells: ['Average', 'O(n log n)', 'O(log n)', 'Random input'], classes: ['good', 'mono', ''] },
            { cells: ['Worst', 'O(n²)', 'O(n)', 'Pivot always extreme'], classes: ['bad', 'mono', ''] },
            { cells: ['Stable', 'No', '—', 'Equal elements may reorder'], classes: ['bad', 'mono', ''] },
          ],
        },
        callout: {
          type: 'warning',
          title: 'The pivot problem',
          body: 'Quick sort\'s O(n²) worst case occurs on already-sorted input when using the last element as pivot. Practical implementations use randomized pivots or median-of-three to avoid this. Introsort (C++ std::sort) falls back to heapsort if recursion depth exceeds 2·log n.',
        },
      },
      {
        id: 'related',
        title: 'Related algorithms',
        type: 'related',
        cards: [
          { name: 'Merge sort', cx: 'O(n log n) always · O(n) space', tags: [{ text: 'Guaranteed bound', bg: '#f0fdf4', color: '#15803d' }, { text: 'Stable', bg: '#ede9ff', color: 'var(--purple)' }] },
          { name: 'Introsort', cx: 'O(n log n) worst · O(log n) space', tags: [{ text: 'Quick sort + heapsort', bg: '#ede9ff', color: 'var(--purple)' }, { text: 'C++ default', bg: '#f0fdf4', color: '#15803d' }] },
          { name: 'Heapsort', cx: 'O(n log n) always · O(1) space', tags: [{ text: 'Fallback for quicksort', bg: '#ede9ff', color: 'var(--purple)' }, { text: 'Not stable', bg: '#fff1f2', color: '#be123c' }] },
        ],
      },
    ],
  },
  'heap-sort': {
    tag: 'Sorting',
    title: 'Heapsort',
    desc: 'Builds a max-heap from the array, then repeatedly extracts the maximum and places it at the end. Guaranteed O(n log n) with O(1) space.',
    readTime: '7 min read',
    difficulty: 'Intermediate · Core algorithm',
    updated: 'May 2026',
    views: '3,456',
    sections: [
      {
        id: 'overview',
        title: 'Overview',
        type: 'text',
        content: `Heapsort combines the best properties of selection sort and tree-based data structures. Like selection sort, it repeatedly extracts the maximum element and places it at the end. But instead of scanning the entire unsorted portion to find the maximum (O(n) per extraction), it uses a max-heap — a complete binary tree where every parent is greater than or equal to its children — to find and extract the maximum in O(log n) time.

The result is O(n log n) worst-case time with O(1) extra space — the only comparison-based sort with both properties.`,
      },
      {
        id: 'algorithm',
        title: 'How it works',
        type: 'text',
        content: `Heapsort has two phases. Phase 1 builds a max-heap. Phase 2 repeatedly extracts the maximum.`,
        steps: [
          { title: 'Build the max-heap', text: 'Starting from the last non-leaf node, call heapify on each node working backward to the root. This builds a max-heap in O(n) time.' },
          { title: 'Extract the maximum', text: 'Swap the root (maximum) with the last element of the heap. The maximum is now in its final sorted position.' },
          { title: 'Restore the heap', text: 'Reduce the heap size by one and heapify the new root to restore the max-heap property.' },
          { title: 'Repeat', text: 'Continue extracting and heapifying until the heap size is 1. The array is now sorted.' },
        ],
      },
      {
        id: 'code',
        title: 'Implementation',
        type: 'code',
        languages: [
          {
            lang: 'JavaScript',
            filename: 'heap-sort.js',
            code: `function heapSort(arr) {
  const n = arr.length;

  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i);
  }

  // Extract elements one by one
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    heapify(arr, i, 0);
  }
  return arr;
}

function heapify(arr, size, i) {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;

  if (left < size && arr[left] > arr[largest]) largest = left;
  if (right < size && arr[right] > arr[largest]) largest = right;

  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    heapify(arr, size, largest);
  }
}`,
            highlightLines: [17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28],
          },
          {
            lang: 'Python',
            filename: 'heap_sort.py',
            code: `def heap_sort(arr):
    n = len(arr)

    # Build max heap
    for i in range(n // 2 - 1, -1, -1):
        heapify(arr, n, i)

    # Extract elements one by one
    for i in range(n - 1, 0, -1):
        arr[0], arr[i] = arr[i], arr[0]
        heapify(arr, i, 0)

    return arr

def heapify(arr, size, i):
    largest = i
    left = 2 * i + 1
    right = 2 * i + 2

    if left < size and arr[left] > arr[largest]:
        largest = left
    if right < size and arr[right] > arr[largest]:
        largest = right

    if largest != i:
        arr[i], arr[largest] = arr[largest], arr[i]
        heapify(arr, size, largest)
`,
          },
          {
            lang: 'Java',
            filename: 'HeapSort.java',
            code: `public class HeapSort {
    public static void heapSort(int[] arr) {
        int n = arr.length;

        // Build max heap
        for (int i = n / 2 - 1; i >= 0; i--) {
            heapify(arr, n, i);
        }

        // Extract elements one by one
        for (int i = n - 1; i > 0; i--) {
            int temp = arr[0];
            arr[0] = arr[i];
            arr[i] = temp;
            heapify(arr, i, 0);
        }
    }

    private static void heapify(int[] arr, int size, int i) {
        int largest = i;
        int left = 2 * i + 1;
        int right = 2 * i + 2;

        if (left < size && arr[left] > arr[largest]) largest = left;
        if (right < size && arr[right] > arr[largest]) largest = right;

        if (largest != i) {
            int temp = arr[i];
            arr[i] = arr[largest];
            arr[largest] = temp;
            heapify(arr, size, largest);
        }
    }
}`,
          },
        ],
      },
      {
        id: 'complexity',
        title: 'Complexity',
        type: 'text',
        content: `Heapsort guarantees O(n log n) worst-case time while using only O(1) auxiliary space. It is not stable and has poor cache performance due to tree-like memory access patterns.`,
        table: {
          headers: ['Case', 'Time', 'Space', 'Notes'],
          rows: [
            { cells: ['Best', 'O(n log n)', 'O(1)', 'Same as worst case'], classes: ['ok', 'mono', ''] },
            { cells: ['Average', 'O(n log n)', 'O(1)', 'Random input'], classes: ['ok', 'mono', ''] },
            { cells: ['Worst', 'O(n log n)', 'O(1)', 'Guaranteed bound'], classes: ['ok', 'mono', ''] },
            { cells: ['Stable', 'No', '—', 'Tree operations reorder equals'], classes: ['bad', 'mono', ''] },
          ],
        },
        callout: {
          type: 'success',
          title: 'The safety net',
          body: 'Heapsort is rarely used standalone, but it plays a critical role as a safety net. Introsort (C++ std::sort) starts with quicksort but monitors recursion depth; if it exceeds 2·log n, it switches to heapsort to guarantee O(n log n) worst-case time.',
        },
      },
      {
        id: 'related',
        title: 'Related algorithms',
        type: 'related',
        cards: [
          { name: 'Quicksort', cx: 'O(n log n) avg · O(n²) worst', tags: [{ text: 'Faster on average', bg: '#f0fdf4', color: '#15803d' }, { text: 'Not guaranteed', bg: '#fff1f2', color: '#be123c' }] },
          { name: 'Introsort', cx: 'O(n log n) worst · O(log n) space', tags: [{ text: 'Uses heapsort', bg: '#ede9ff', color: 'var(--purple)' }, { text: 'C++ default', bg: '#f0fdf4', color: '#15803d' }] },
          { name: 'Merge sort', cx: 'O(n log n) always · O(n) space', tags: [{ text: 'Stable', bg: '#f0fdf4', color: '#15803d' }, { text: 'More space', bg: '#fff7ed', color: '#c2410c' }] },
        ],
      },
    ],
  },
  'fib': {
    tag: 'Dynamic Programming',
    title: 'Fibonacci — memoized',
    desc: 'Computes the nth Fibonacci number using memoization to avoid redundant recursive calls, reducing time from O(2ⁿ) to O(n).',
    readTime: '5 min read',
    difficulty: 'Junior · Foundation concept',
    updated: 'May 2026',
    views: '8,124',
    sections: [
      {
        id: 'overview',
        title: 'Overview',
        type: 'text',
        content: `The Fibonacci sequence is defined by the recurrence F(n) = F(n−1) + F(n−2) with base cases F(0) = 0 and F(1) = 1. The naive recursive solution recalculates the same subproblems exponentially many times — for F(40), it makes over 300 million recursive calls.

Memoization solves this by caching the result of each subproblem the first time it's computed. Subsequent calls for the same input return the cached value in O(1) time.`,
        callout: {
          type: 'info',
          title: 'Why Fibonacci?',
          body: 'Fibonacci is the "Hello World" of dynamic programming. It\'s simple enough to understand the core idea — overlapping subproblems and optimal substructure — without the distraction of complex problem logic.',
        },
      },
      {
        id: 'algorithm',
        title: 'How it works',
        type: 'text',
        content: `The memoized approach uses a top-down recursive strategy with a cache (typically a hash map or array).`,
        steps: [
          { title: 'Check the cache', text: 'Before computing F(n), check if it\'s already in the cache. If yes, return the cached value immediately.' },
          { title: 'Base case', text: 'If n is 0 or 1, return n directly — these are the foundation values.' },
          { title: 'Recursive computation', text: 'Compute F(n) = F(n−1) + F(n−2) recursively. Each of these calls also checks the cache first.' },
          { title: 'Store and return', text: 'Store the result in the cache before returning. Future calls for this n will hit the cache.' },
        ],
      },
      {
        id: 'code',
        title: 'Implementation',
        type: 'code',
        languages: [
          {
            lang: 'JavaScript',
            filename: 'fibonacci-memo.js',
            code: `function fibonacci(n, memo = {}) {
  if (n in memo) return memo[n];
  if (n <= 1) return n;
  
  memo[n] = fibonacci(n - 1, memo) + fibonacci(n - 2, memo);
  return memo[n];
}

// Tabulation (bottom-up) alternative
function fibonacciTab(n) {
  if (n <= 1) return n;
  const dp = [0, 1];
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[n];
}`,
            highlightLines: [1, 2, 3, 4, 5, 6],
          },
          {
            lang: 'Python',
            filename: 'fibonacci.py',
            code: `def fibonacci(n, memo=None):
    if memo is None:
        memo = {}
    if n in memo:
        return memo[n]
    if n <= 1:
        return n
    memo[n] = fibonacci(n - 1, memo) + fibonacci(n - 2, memo)
    return memo[n]

# Tabulation (bottom-up) alternative
def fibonacci_tab(n):
    if n <= 1:
        return n
    dp = [0, 1]
    for i in range(2, n + 1):
        dp.append(dp[i - 1] + dp[i - 2])
    return dp[n]
`,
          },
          {
            lang: 'Java',
            filename: 'Fibonacci.java',
            code: `public class Fibonacci {
    // Memoized (top-down)
    public static int fibonacci(int n, int[] memo) {
        if (memo[n] != 0) return memo[n];
        if (n <= 1) return n;
        memo[n] = fibonacci(n - 1, memo) + fibonacci(n - 2, memo);
        return memo[n];
    }

    // Tabulation (bottom-up)
    public static int fibonacciTab(int n) {
        if (n <= 1) return n;
        int[] dp = new int[n + 1];
        dp[1] = 1;
        for (int i = 2; i <= n; i++) {
            dp[i] = dp[i - 1] + dp[i - 2];
        }
        return dp[n];
    }
}`,
          },
        ],
      },
      {
        id: 'complexity',
        title: 'Complexity',
        type: 'text',
        content: `Memoization transforms the exponential recursive solution into a linear one. Each value F(0) through F(n) is computed exactly once.`,
        table: {
          headers: ['Approach', 'Time', 'Space', 'Notes'],
          rows: [
            { cells: ['Naive recursive', 'O(2ⁿ)', 'O(n)', 'Exponential — unusable for n > 40'], classes: ['bad', 'mono', ''] },
            { cells: ['Memoized', 'O(n)', 'O(n)', 'Each value computed once'], classes: ['good', 'mono', ''] },
            { cells: ['Tabulation', 'O(n)', 'O(n)', 'Bottom-up, no recursion overhead'], classes: ['good', 'mono', ''] },
            { cells: ['Space-optimized', 'O(n)', 'O(1)', 'Only store last two values'], classes: ['good', 'mono', ''] },
          ],
        },
      },
      {
        id: 'related',
        title: 'Related algorithms',
        type: 'related',
        cards: [
          { name: '0/1 Knapsack', cx: 'O(n·W) time · O(n·W) space', tags: [{ text: 'Classic DP', bg: '#ede9ff', color: 'var(--purple)' }, { text: '2D table', bg: '#f0fdf4', color: '#15803d' }] },
          { name: 'LCS', cx: 'O(m·n) time · O(m·n) space', tags: [{ text: 'String DP', bg: '#ede9ff', color: 'var(--purple)' }, { text: 'Foundation', bg: '#f0fdf4', color: '#15803d' }] },
          { name: 'Edit distance', cx: 'O(m·n) time · O(m·n) space', tags: [{ text: 'Practical use', bg: '#f0fdf4', color: '#15803d' }, { text: 'Spell check', bg: '#ede9ff', color: 'var(--purple)' }] },
        ],
      },
    ],
  },
  'knap': {
    tag: 'Dynamic Programming',
    title: '0/1 Knapsack',
    desc: 'Maximizes the total value of items that fit in a knapsack of capacity W, where each item can be taken at most once.',
    readTime: '7 min read',
    difficulty: 'Intermediate · Interview staple',
    updated: 'May 2026',
    views: '5,673',
    sections: [
      {
        id: 'overview',
        title: 'Overview',
        type: 'text',
        content: `Given n items, each with a weight and a value, the 0/1 Knapsack problem asks: which items should you select to maximize total value without exceeding the knapsack's weight capacity W? The "0/1" means you either take an item whole (1) or leave it (0) — you can't take fractions.

This is a classic optimization problem with applications in resource allocation, budget management, and cargo loading.`,
      },
      {
        id: 'algorithm',
        title: 'How it works',
        type: 'text',
        content: `The DP approach builds a 2D table where dp[i][w] represents the maximum value achievable using the first i items with capacity w.`,
        steps: [
          { title: 'Define the state', text: 'dp[i][w] = maximum value using items 0..i−1 with capacity w.' },
          { title: 'Base case', text: 'dp[0][w] = 0 for all w (no items means no value).' },
          { title: 'Transition', text: 'For each item i and capacity w: if weight[i] ≤ w, choose max(dp[i−1][w], value[i] + dp[i−1][w−weight[i]]). Otherwise, dp[i][w] = dp[i−1][w].' },
          { title: 'Answer', text: 'The answer is dp[n][W] — the maximum value using all items with full capacity.' },
        ],
      },
      {
        id: 'code',
        title: 'Implementation',
        type: 'code',
        languages: [
          {
            lang: 'JavaScript',
            filename: 'knapsack.js',
            code: `function knapsack(weights, values, W) {
  const n = weights.length;
  const dp = Array(n + 1).fill(null)
    .map(() => Array(W + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= W; w++) {
      if (weights[i - 1] <= w) {
        dp[i][w] = Math.max(
          dp[i - 1][w],
          values[i - 1] + dp[i - 1][w - weights[i - 1]]
        );
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }

  return dp[n][W];
}`,
            highlightLines: [7, 8, 9, 10, 11, 12, 13, 14],
          },
          {
            lang: 'Python',
            filename: 'knapsack.py',
            code: `def knapsack(weights, values, W):
    n = len(weights)
    dp = [[0] * (W + 1) for _ in range(n + 1)]

    for i in range(1, n + 1):
        for w in range(W + 1):
            if weights[i - 1] <= w:
                dp[i][w] = max(
                    dp[i - 1][w],
                    values[i - 1] + dp[i - 1][w - weights[i - 1]]
                )
            else:
                dp[i][w] = dp[i - 1][w]

    return dp[n][W]
`,
          },
          {
            lang: 'Java',
            filename: 'Knapsack.java',
            code: `public class Knapsack {
    public static int knapsack(int[] weights, int[] values, int W) {
        int n = weights.length;
        int[][] dp = new int[n + 1][W + 1];

        for (int i = 1; i <= n; i++) {
            for (int w = 0; w <= W; w++) {
                if (weights[i - 1] <= w) {
                    dp[i][w] = Math.max(
                        dp[i - 1][w],
                        values[i - 1] + dp[i - 1][w - weights[i - 1]]
                    );
                } else {
                    dp[i][w] = dp[i - 1][w];
                }
            }
        }

        return dp[n][W];
    }
}`,
          },
        ],
      },
      {
        id: 'complexity',
        title: 'Complexity',
        type: 'text',
        content: `The algorithm fills an (n+1) × (W+1) table, computing each cell in O(1) time. Note that this is pseudo-polynomial — the runtime depends on the numeric value of W, not just the number of items.`,
        table: {
          headers: ['Case', 'Time', 'Space', 'Notes'],
          rows: [
            { cells: ['Standard', 'O(n·W)', 'O(n·W)', 'Full 2D table'], classes: ['ok', 'mono', ''] },
            { cells: ['Space-optimized', 'O(n·W)', 'O(W)', 'Two rows suffice'], classes: ['good', 'mono', ''] },
            { cells: ['Pseudo-poly', 'Depends on W', '—', 'Not truly polynomial in input size'], classes: ['bad', 'mono', ''] },
          ],
        },
        callout: {
          type: 'warning',
          title: 'Pseudo-polynomial time',
          body: 'O(n·W) looks polynomial, but W is a numeric value, not an input length. If W = 2²⁰, the table has over a million columns. The input size for W is only log W bits. This is why knapsack is NP-complete — the DP is efficient only when W is reasonably small.',
        },
      },
      {
        id: 'related',
        title: 'Related algorithms',
        type: 'related',
        cards: [
          { name: 'Unbounded knapsack', cx: 'O(n·W) time · O(W) space', tags: [{ text: 'Items repeatable', bg: '#ede9ff', color: 'var(--purple)' }, { text: 'Simpler', bg: '#f0fdf4', color: '#15803d' }] },
          { name: 'Subset sum', cx: 'O(n·W) time · O(W) space', tags: [{ text: 'Special case', bg: '#ede9ff', color: 'var(--purple)' }, { text: 'Decision problem', bg: '#f0fdf4', color: '#15803d' }] },
          { name: 'Coin change', cx: 'O(n·amount) time · O(amount) space', tags: [{ text: 'Unbounded variant', bg: '#f0fdf4', color: '#15803d' }, { text: 'Min coins', bg: '#ede9ff', color: 'var(--purple)' }] },
        ],
      },
    ],
  },
  'lcs': {
    tag: 'Dynamic Programming',
    title: 'Longest Common Subsequence',
    desc: 'Finds the longest subsequence common to two strings, where characters don\'t need to be consecutive but must appear in the same relative order.',
    readTime: '6 min read',
    difficulty: 'Intermediate · Interview staple',
    updated: 'May 2026',
    views: '4,891',
    sections: [
      {
        id: 'overview',
        title: 'Overview',
        type: 'text',
        content: `A subsequence is derived from a string by deleting zero or more characters without changing the order of the remaining characters. The LCS of two strings is the longest subsequence they share.

For example, LCS("ABCDGH", "AEDFHR") = "ADH" with length 3. Note that "ADH" is not a substring — the characters don't need to be consecutive.`,
        callout: {
          type: 'info',
          title: 'Real-world applications',
          body: 'LCS is the foundation of diff tools (git diff), spell checkers, DNA sequence alignment, and plagiarism detection. The git diff command uses a variant of LCS to show what changed between file versions.',
        },
      },
      {
        id: 'algorithm',
        title: 'How it works',
        type: 'text',
        content: `Build a 2D table where dp[i][j] represents the LCS length of the first i characters of string A and the first j characters of string B.`,
        steps: [
          { title: 'Initialize', text: 'Create a (m+1) × (n+1) table with all zeros. dp[i][j] = LCS length of A[0..i−1] and B[0..j−1].' },
          { title: 'Match', text: 'If A[i−1] == B[j−1], then dp[i][j] = 1 + dp[i−1][j−1]. The character extends the LCS.' },
          { title: 'Mismatch', text: 'If A[i−1] ≠ B[j−1], then dp[i][j] = max(dp[i−1][j], dp[i][j−1]). Take the best result from skipping a character in either string.' },
          { title: 'Reconstruct', text: 'Backtrack from dp[m][n] to recover the actual LCS string by following the decisions that led to each cell.' },
        ],
      },
      {
        id: 'code',
        title: 'Implementation',
        type: 'code',
        languages: [
          {
            lang: 'JavaScript',
            filename: 'lcs.js',
            code: `function lcs(A, B) {
  const m = A.length, n = B.length;
  const dp = Array(m + 1).fill(null)
    .map(() => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (A[i - 1] === B[j - 1]) {
        dp[i][j] = 1 + dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Reconstruct the LCS string
  let result = '';
  let i = m, j = n;
  while (i > 0 && j > 0) {
    if (A[i - 1] === B[j - 1]) {
      result = A[i - 1] + result;
      i--; j--;
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }

  return result;
}`,
            highlightLines: [7, 8, 9, 10, 11, 12],
          },
          {
            lang: 'Python',
            filename: 'lcs.py',
            code: `def lcs(A, B):
    m, n = len(A), len(B)
    dp = [[0] * (n + 1) for _ in range(m + 1)]

    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if A[i - 1] == B[j - 1]:
                dp[i][j] = 1 + dp[i - 1][j - 1]
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])

    # Reconstruct the LCS string
    result = []
    i, j = m, n
    while i > 0 and j > 0:
        if A[i - 1] == B[j - 1]:
            result.append(A[i - 1])
            i -= 1; j -= 1
        elif dp[i - 1][j] > dp[i][j - 1]:
            i -= 1
        else:
            j -= 1

    return ''.join(reversed(result))
`,
          },
          {
            lang: 'Java',
            filename: 'LCS.java',
            code: `public class LCS {
    public static String lcs(String A, String B) {
        int m = A.length(), n = B.length();
        int[][] dp = new int[m + 1][n + 1];

        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (A.charAt(i - 1) == B.charAt(j - 1)) {
                    dp[i][j] = 1 + dp[i - 1][j - 1];
                } else {
                    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
        }

        // Reconstruct the LCS string
        StringBuilder result = new StringBuilder();
        int i = m, j = n;
        while (i > 0 && j > 0) {
            if (A.charAt(i - 1) == B.charAt(j - 1)) {
                result.insert(0, A.charAt(i - 1));
                i--; j--;
            } else if (dp[i - 1][j] > dp[i][j - 1]) {
                i--;
            } else {
                j--;
            }
        }

        return result.toString();
    }
}`,
          },
        ],
      },
      {
        id: 'complexity',
        title: 'Complexity',
        type: 'text',
        content: `The DP table has (m+1) × (n+1) cells, each computed in O(1) time. Reconstruction takes O(m+n) time.`,
        table: {
          headers: ['Case', 'Time', 'Space', 'Notes'],
          rows: [
            { cells: ['Standard', 'O(m·n)', 'O(m·n)', 'Full table + reconstruction'], classes: ['ok', 'mono', ''] },
            { cells: ['Space-optimized', 'O(m·n)', 'O(min(m,n))', 'Two rows only'], classes: ['good', 'mono', ''] },
            { cells: ['Reconstruction', 'O(m+n)', 'O(m·n)', 'Requires full table'], classes: ['ok', 'mono', ''] },
          ],
        },
      },
      {
        id: 'related',
        title: 'Related algorithms',
        type: 'related',
        cards: [
          { name: 'Edit distance', cx: 'O(m·n) time · O(m·n) space', tags: [{ text: 'Similar DP', bg: '#ede9ff', color: 'var(--purple)' }, { text: 'Levenshtein', bg: '#f0fdf4', color: '#15803d' }] },
          { name: 'Longest increasing subsequence', cx: 'O(n log n) time · O(n) space', tags: [{ text: 'Optimized', bg: '#f0fdf4', color: '#15803d' }, { text: 'Binary search', bg: '#ede9ff', color: 'var(--purple)' }] },
          { name: 'Diff algorithm', cx: 'O(m·n) time', tags: [{ text: 'Based on LCS', bg: '#ede9ff', color: 'var(--purple)' }, { text: 'Git uses this', bg: '#f0fdf4', color: '#15803d' }] },
        ],
      },
    ],
  },
  'edit': {
    tag: 'Dynamic Programming',
    title: 'Edit distance',
    desc: 'Computes the minimum number of insertions, deletions, and substitutions to transform one string into another (Levenshtein distance).',
    readTime: '6 min read',
    difficulty: 'Intermediate · Practical use',
    updated: 'May 2026',
    views: '6,234',
    sections: [
      {
        id: 'overview',
        title: 'Overview',
        type: 'text',
        content: `Edit distance (Levenshtein distance) measures how different two strings are by counting the minimum number of single-character edits needed to transform one into the other. The allowed operations are insertion, deletion, and substitution.

This is one of the most practically useful DP algorithms — it powers spell checkers, autocorrect, DNA sequence analysis, and fuzzy string matching.`,
      },
      {
        id: 'algorithm',
        title: 'How it works',
        type: 'text',
        content: `Build a 2D table where dp[i][j] represents the edit distance between the first i characters of string A and the first j characters of string B.`,
        steps: [
          { title: 'Initialize', text: 'dp[i][0] = i (delete all characters from A) and dp[0][j] = j (insert all characters into empty string).' },
          { title: 'Match', text: 'If A[i−1] == B[j−1], no edit needed: dp[i][j] = dp[i−1][j−1].' },
          { title: 'Mismatch', text: 'If A[i−1] ≠ B[j−1], take the minimum of three options: deletion (dp[i−1][j] + 1), insertion (dp[i][j−1] + 1), or substitution (dp[i−1][j−1] + 1).' },
          { title: 'Answer', text: 'dp[m][n] is the minimum edit distance between the full strings.' },
        ],
      },
      {
        id: 'code',
        title: 'Implementation',
        type: 'code',
        languages: [
          {
            lang: 'JavaScript',
            filename: 'edit-distance.js',
            code: `function editDistance(A, B) {
  const m = A.length, n = B.length;
  const dp = Array(m + 1).fill(null)
    .map(() => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (A[i - 1] === B[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(
          dp[i - 1][j],     // deletion
          dp[i][j - 1],     // insertion
          dp[i - 1][j - 1]  // substitution
        );
      }
    }
  }

  return dp[m][n];
}`,
            highlightLines: [10, 11, 12, 13, 14, 15, 16, 17, 18],
          },
          {
            lang: 'Python',
            filename: 'edit_distance.py',
            code: `def edit_distance(A, B):
    m, n = len(A), len(B)
    dp = [[0] * (n + 1) for _ in range(m + 1)]

    for i in range(m + 1):
        dp[i][0] = i
    for j in range(n + 1):
        dp[0][j] = j

    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if A[i - 1] == B[j - 1]:
                dp[i][j] = dp[i - 1][j - 1]
            else:
                dp[i][j] = 1 + min(
                    dp[i - 1][j],     # deletion
                    dp[i][j - 1],     # insertion
                    dp[i - 1][j - 1]  # substitution
                )

    return dp[m][n]
`,
          },
          {
            lang: 'Java',
            filename: 'EditDistance.java',
            code: `public class EditDistance {
    public static int editDistance(String A, String B) {
        int m = A.length(), n = B.length();
        int[][] dp = new int[m + 1][n + 1];

        for (int i = 0; i <= m; i++) dp[i][0] = i;
        for (int j = 0; j <= n; j++) dp[0][j] = j;

        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (A.charAt(i - 1) == B.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1];
                } else {
                    dp[i][j] = 1 + Math.min(
                        Math.min(dp[i - 1][j],     // deletion
                                 dp[i][j - 1]),    // insertion
                        dp[i - 1][j - 1]           // substitution
                    );
                }
            }
        }

        return dp[m][n];
    }
}`,
          },
        ],
      },
      {
        id: 'complexity',
        title: 'Complexity',
        type: 'text',
        content: `The DP table has (m+1) × (n+1) cells, each computed in O(1) time. The algorithm is optimal for the general case.`,
        table: {
          headers: ['Case', 'Time', 'Space', 'Notes'],
          rows: [
            { cells: ['Standard', 'O(m·n)', 'O(m·n)', 'Full table'], classes: ['ok', 'mono', ''] },
            { cells: ['Space-optimized', 'O(m·n)', 'O(min(m,n))', 'Two rows'], classes: ['good', 'mono', ''] },
            { cells: ['Best case', 'O(m·n)', '—', 'No early termination possible'], classes: ['ok', 'mono', ''] },
          ],
        },
        callout: {
          type: 'success',
          title: 'Practical tip',
          body: 'For spell checking, you don\'t need to compare against every word in the dictionary. Use a BK-tree or trie to prune candidates whose edit distance exceeds a threshold (usually 2 for typos).',
        },
      },
      {
        id: 'related',
        title: 'Related algorithms',
        type: 'related',
        cards: [
          { name: 'LCS', cx: 'O(m·n) time · O(m·n) space', tags: [{ text: 'Similar structure', bg: '#ede9ff', color: 'var(--purple)' }, { text: 'Subsequence', bg: '#f0fdf4', color: '#15803d' }] },
          { name: 'Damerau-Levenshtein', cx: 'O(m·n) time', tags: [{ text: 'Adds transpositions', bg: '#ede9ff', color: 'var(--purple)' }, { text: 'Better for typos', bg: '#f0fdf4', color: '#15803d' }] },
          { name: 'Needleman-Wunsch', cx: 'O(m·n) time', tags: [{ text: 'Bioinformatics', bg: '#f0fdf4', color: '#15803d' }, { text: 'Gap penalties', bg: '#ede9ff', color: 'var(--purple)' }] },
        ],
      },
    ],
  },
  'bfs': {
    tag: 'Graph',
    title: 'Breadth-First Search',
    desc: 'Explores a graph level by level from a source node, visiting all neighbors before moving to the next level. Guarantees shortest paths in unweighted graphs.',
    readTime: '5 min read',
    difficulty: 'Junior · Foundation concept',
    updated: 'May 2026',
    views: '9,412',
    sections: [
      {
        id: 'overview',
        title: 'Overview',
        type: 'text',
        content: `BFS starts at a source node and explores all its neighbors first, then all neighbors of neighbors, and so on. It uses a queue to maintain the order of exploration — first in, first out.

The key property of BFS is that it discovers nodes in order of their distance from the source. In an unweighted graph, the first time BFS reaches a node, it has found the shortest path to that node.`,
        callout: {
          type: 'info',
          title: 'When to use BFS',
          body: 'Use BFS when you need the shortest path in an unweighted graph, when you need to find all nodes within k hops of a source, or when you need to check if a graph is bipartite.',
        },
      },
      {
        id: 'algorithm',
        title: 'How it works',
        type: 'text',
        content: `BFS maintains a queue of nodes to visit and a set of visited nodes to avoid cycles.`,
        steps: [
          { title: 'Initialize', text: 'Create a queue with the source node and mark it as visited.' },
          { title: 'Dequeue', text: 'Remove the front node from the queue. This is the current node to process.' },
          { title: 'Enqueue neighbors', text: 'For each unvisited neighbor of the current node, mark it as visited and add it to the queue.' },
          { title: 'Repeat', text: 'Continue until the queue is empty. All reachable nodes have been visited in order of their distance from the source.' },
        ],
      },
      {
        id: 'code',
        title: 'Implementation',
        type: 'code',
        languages: [
          {
            lang: 'JavaScript',
            filename: 'bfs.js',
            code: `function bfs(graph, start) {
  const visited = new Set([start]);
  const queue = [start];
  const order = [];

  while (queue.length > 0) {
    const node = queue.shift();
    order.push(node);

    for (const neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }

  return order;
}`,
            highlightLines: [6, 7, 8, 9, 10, 11, 12, 13, 14],
          },
          {
            lang: 'Python',
            filename: 'bfs.py',
            code: `from collections import deque

def bfs(graph, start):
    visited = {start}
    queue = deque([start])
    order = []

    while queue:
        node = queue.popleft()
        order.append(node)

        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)

    return order
`,
          },
          {
            lang: 'Java',
            filename: 'BFS.java',
            code: `import java.util.*;

public class BFS {
    public static List<Integer> bfs(Map<Integer, List<Integer>> graph, int start) {
        Set<Integer> visited = new HashSet<>();
        Queue<Integer> queue = new LinkedList<>();
        List<Integer> order = new ArrayList<>();

        visited.add(start);
        queue.offer(start);

        while (!queue.isEmpty()) {
            int node = queue.poll();
            order.add(node);

            for (int neighbor : graph.getOrDefault(node, Collections.emptyList())) {
                if (!visited.contains(neighbor)) {
                    visited.add(neighbor);
                    queue.offer(neighbor);
                }
            }
        }

        return order;
    }
}`,
          },
        ],
      },
      {
        id: 'complexity',
        title: 'Complexity',
        type: 'text',
        content: `BFS visits every node and edge at most once. The queue operations are O(1) each.`,
        table: {
          headers: ['Case', 'Time', 'Space', 'Notes'],
          rows: [
            { cells: ['Adjacency list', 'O(V + E)', 'O(V)', 'Standard representation'], classes: ['good', 'mono', ''] },
            { cells: ['Adjacency matrix', 'O(V²)', 'O(V)', 'Dense graphs'], classes: ['ok', 'mono', ''] },
            { cells: ['Space', 'O(V)', '—', 'Queue + visited set'], classes: ['good', 'mono', ''] },
          ],
        },
      },
      {
        id: 'related',
        title: 'Related algorithms',
        type: 'related',
        cards: [
          { name: 'DFS', cx: 'O(V + E) time · O(V) space', tags: [{ text: 'Depth-first', bg: '#ede9ff', color: 'var(--purple)' }, { text: 'Stack-based', bg: '#f0fdf4', color: '#15803d' }] },
          { name: 'Dijkstra\'s', cx: 'O((V+E) log V) time', tags: [{ text: 'Weighted graphs', bg: '#f0fdf4', color: '#15803d' }, { text: 'BFS extension', bg: '#ede9ff', color: 'var(--purple)' }] },
          { name: 'A* search', cx: 'O(E) time (heuristic)', tags: [{ text: 'Informed search', bg: '#f0fdf4', color: '#15803d' }, { text: 'Pathfinding', bg: '#ede9ff', color: 'var(--purple)' }] },
        ],
      },
    ],
  },
  'dfs': {
    tag: 'Graph',
    title: 'Depth-First Search',
    desc: 'Explores a graph by going as deep as possible along each branch before backtracking. Uses a stack (explicit or via recursion).',
    readTime: '5 min read',
    difficulty: 'Junior · Foundation concept',
    updated: 'May 2026',
    views: '7,856',
    sections: [
      {
        id: 'overview',
        title: 'Overview',
        type: 'text',
        content: `DFS explores a graph by following a path as far as it can go before backtracking. It's the graph equivalent of exploring a maze by always taking the first unexplored corridor and backtracking when you hit a dead end.

DFS can be implemented recursively (using the call stack) or iteratively (using an explicit stack). The recursive version is more intuitive; the iterative version avoids stack overflow on deep graphs.`,
      },
      {
        id: 'algorithm',
        title: 'How it works',
        type: 'text',
        content: `Starting from a source node, DFS visits the node, then recursively visits each unvisited neighbor.`,
        steps: [
          { title: 'Visit', text: 'Mark the current node as visited and process it (add to traversal order).' },
          { title: 'Explore', text: 'For each unvisited neighbor, recursively call DFS on that neighbor.' },
          { title: 'Backtrack', text: 'When all neighbors are visited (or there are none), return to the caller.' },
          { title: 'Repeat', text: 'If the graph is disconnected, start a new DFS from an unvisited node.' },
        ],
      },
      {
        id: 'code',
        title: 'Implementation',
        type: 'code',
        languages: [
          {
            lang: 'JavaScript',
            filename: 'dfs.js',
            code: `function dfs(graph, start, visited = new Set()) {
  visited.add(start);
  const order = [start];

  for (const neighbor of graph[start]) {
    if (!visited.has(neighbor)) {
      order.push(...dfs(graph, neighbor, visited));
    }
  }

  return order;
}

// Iterative version
function dfsIterative(graph, start) {
  const visited = new Set();
  const stack = [start];
  const order = [];

  while (stack.length > 0) {
    const node = stack.pop();
    if (!visited.has(node)) {
      visited.add(node);
      order.push(node);
      for (const neighbor of graph[node]) {
        if (!visited.has(neighbor)) stack.push(neighbor);
      }
    }
  }

  return order;
}`,
            highlightLines: [1, 2, 3, 4, 5, 6, 7, 8, 9],
          },
          {
            lang: 'Python',
            filename: 'dfs.py',
            code: `def dfs(graph, start, visited=None):
    if visited is None:
        visited = set()
    visited.add(start)
    order = [start]

    for neighbor in graph[start]:
        if neighbor not in visited:
            order.extend(dfs(graph, neighbor, visited))

    return order

# Iterative version
def dfs_iterative(graph, start):
    visited = set()
    stack = [start]
    order = []

    while stack:
        node = stack.pop()
        if node not in visited:
            visited.add(node)
            order.append(node)
            for neighbor in graph[node]:
                if neighbor not in visited:
                    stack.append(neighbor)

    return order
`,
          },
          {
            lang: 'Java',
            filename: 'DFS.java',
            code: `import java.util.*;

public class DFS {
    // Recursive version
    public static List<Integer> dfs(Map<Integer, List<Integer>> graph, int start) {
        Set<Integer> visited = new HashSet<>();
        List<Integer> order = new ArrayList<>();
        dfsRecursive(graph, start, visited, order);
        return order;
    }

    private static void dfsRecursive(Map<Integer, List<Integer>> graph, int node,
                                     Set<Integer> visited, List<Integer> order) {
        visited.add(node);
        order.add(node);
        for (int neighbor : graph.getOrDefault(node, Collections.emptyList())) {
            if (!visited.contains(neighbor)) {
                dfsRecursive(graph, neighbor, visited, order);
            }
        }
    }

    // Iterative version
    public static List<Integer> dfsIterative(Map<Integer, List<Integer>> graph, int start) {
        Set<Integer> visited = new HashSet<>();
        Deque<Integer> stack = new ArrayDeque<>();
        List<Integer> order = new ArrayList<>();

        stack.push(start);
        while (!stack.isEmpty()) {
            int node = stack.pop();
            if (!visited.contains(node)) {
                visited.add(node);
                order.add(node);
                for (int neighbor : graph.getOrDefault(node, Collections.emptyList())) {
                    if (!visited.contains(neighbor)) stack.push(neighbor);
                }
            }
        }
        return order;
    }
}`,
          },
        ],
      },
      {
        id: 'complexity',
        title: 'Complexity',
        type: 'text',
        content: `DFS visits every node and edge at most once. The recursion depth is bounded by the number of vertices.`,
        table: {
          headers: ['Case', 'Time', 'Space', 'Notes'],
          rows: [
            { cells: ['Adjacency list', 'O(V + E)', 'O(V)', 'Standard representation'], classes: ['good', 'mono', ''] },
            { cells: ['Adjacency matrix', 'O(V²)', 'O(V)', 'Dense graphs'], classes: ['ok', 'mono', ''] },
            { cells: ['Recursion depth', '—', 'O(V)', 'Worst case: linear chain'], classes: ['bad', 'mono', ''] },
          ],
        },
      },
      {
        id: 'related',
        title: 'Related algorithms',
        type: 'related',
        cards: [
          { name: 'BFS', cx: 'O(V + E) time · O(V) space', tags: [{ text: 'Breadth-first', bg: '#ede9ff', color: 'var(--purple)' }, { text: 'Queue-based', bg: '#f0fdf4', color: '#15803d' }] },
          { name: 'Topological sort', cx: 'O(V + E) time', tags: [{ text: 'Uses DFS', bg: '#ede9ff', color: 'var(--purple)' }, { text: 'DAGs only', bg: '#f0fdf4', color: '#15803d' }] },
          { name: 'Cycle detection', cx: 'O(V + E) time', tags: [{ text: 'DFS-based', bg: '#ede9ff', color: 'var(--purple)' }, { text: 'Directed/undirected', bg: '#f0fdf4', color: '#15803d' }] },
        ],
      },
    ],
  },
  'dijk': {
    tag: 'Graph',
    title: 'Dijkstra\'s algorithm',
    desc: 'Finds the shortest path from a source node to all other nodes in a weighted graph with non-negative edge weights.',
    readTime: '7 min read',
    difficulty: 'Intermediate · Core algorithm',
    updated: 'May 2026',
    views: '11,234',
    sections: [
      {
        id: 'overview',
        title: 'Overview',
        type: 'text',
        content: `Dijkstra's algorithm is essentially BFS with a priority queue. Instead of exploring nodes in FIFO order, it always explores the node with the smallest known distance from the source first. This greedy strategy guarantees that once a node is visited, its shortest distance is finalized.

The algorithm was invented by Edsger Dijkstra in 1956 and published in 1959. It's the foundation of routing protocols, GPS navigation, and network optimization.`,
        callout: {
          type: 'warning',
          title: 'Non-negative weights only',
          body: 'Dijkstra\'s algorithm fails with negative edge weights because a node\'s distance can decrease after it\'s been finalized. For graphs with negative weights, use Bellman-Ford instead.',
        },
      },
      {
        id: 'algorithm',
        title: 'How it works',
        type: 'text',
        content: `Maintain a priority queue of (distance, node) pairs and a distance array initialized to infinity except for the source.`,
        steps: [
          { title: 'Initialize', text: 'Set dist[source] = 0, all others = ∞. Add (0, source) to the priority queue.' },
          { title: 'Extract minimum', text: 'Remove the node with the smallest distance from the priority queue.' },
          { title: 'Relax neighbors', text: 'For each neighbor, if dist[current] + weight < dist[neighbor], update dist[neighbor] and add to the priority queue.' },
          { title: 'Repeat', text: 'Continue until the priority queue is empty. All reachable nodes have their shortest distances.' },
        ],
      },
      {
        id: 'code',
        title: 'Implementation',
        type: 'code',
        languages: [
          {
            lang: 'JavaScript',
            filename: 'dijkstra.js',
            code: `function dijkstra(graph, start) {
  const dist = {};
  const prev = {};
  const pq = new PriorityQueue();

  for (const node in graph) {
    dist[node] = Infinity;
    prev[node] = null;
  }
  dist[start] = 0;
  pq.push(start, 0);

  while (!pq.isEmpty()) {
    const current = pq.pop();

    for (const [neighbor, weight] of graph[current]) {
      const alt = dist[current] + weight;
      if (alt < dist[neighbor]) {
        dist[neighbor] = alt;
        prev[neighbor] = current;
        pq.push(neighbor, alt);
      }
    }
  }

  return { dist, prev };
}`,
            highlightLines: [13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
          },
          {
            lang: 'Python',
            filename: 'dijkstra.py',
            code: `import heapq

def dijkstra(graph, start):
    dist = {node: float('inf') for node in graph}
    prev = {node: None for node in graph}
    dist[start] = 0
    pq = [(0, start)]

    while pq:
        d, current = heapq.heappop(pq)

        if d > dist[current]:
            continue

        for neighbor, weight in graph[current]:
            alt = dist[current] + weight
            if alt < dist[neighbor]:
                dist[neighbor] = alt
                prev[neighbor] = current
                heapq.heappush(pq, (alt, neighbor))

    return dist, prev
`,
          },
          {
            lang: 'Java',
            filename: 'Dijkstra.java',
            code: `import java.util.*;

public class Dijkstra {
    static class Result {
        Map<Integer, Integer> dist;
        Map<Integer, Integer> prev;
        Result(Map<Integer, Integer> d, Map<Integer, Integer> p) {
            dist = d; prev = p;
        }
    }

    public static Result dijkstra(Map<Integer, List<int[]>> graph, int start) {
        Map<Integer, Integer> dist = new HashMap<>();
        Map<Integer, Integer> prev = new HashMap<>();
        PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a[1]));

        for (int node : graph.keySet()) {
            dist.put(node, Integer.MAX_VALUE);
            prev.put(node, null);
        }
        dist.put(start, 0);
        pq.offer(new int[]{start, 0});

        while (!pq.isEmpty()) {
            int[] current = pq.poll();
            int u = current[0];

            for (int[] edge : graph.getOrDefault(u, Collections.emptyList())) {
                int neighbor = edge[0], weight = edge[1];
                int alt = dist.get(u) + weight;
                if (alt < dist.get(neighbor)) {
                    dist.put(neighbor, alt);
                    prev.put(neighbor, u);
                    pq.offer(new int[]{neighbor, alt});
                }
            }
        }

        return new Result(dist, prev);
    }
}`,
          },
        ],
      },
      {
        id: 'complexity',
        title: 'Complexity',
        type: 'text',
        content: `The priority queue operations dominate the runtime. With a binary heap, each edge causes at most one push and one pop.`,
        table: {
          headers: ['Implementation', 'Time', 'Space', 'Notes'],
          rows: [
            { cells: ['Binary heap', 'O((V+E) log V)', 'O(V)', 'Standard'], classes: ['good', 'mono', ''] },
            { cells: ['Fibonacci heap', 'O(E + V log V)', 'O(V)', 'Theoretical optimum'], classes: ['good', 'mono', ''] },
            { cells: ['Array', 'O(V²)', 'O(V)', 'Dense graphs'], classes: ['ok', 'mono', ''] },
          ],
        },
      },
      {
        id: 'related',
        title: 'Related algorithms',
        type: 'related',
        cards: [
          { name: 'BFS', cx: 'O(V + E) time', tags: [{ text: 'Unweighted', bg: '#ede9ff', color: 'var(--purple)' }, { text: 'Special case', bg: '#f0fdf4', color: '#15803d' }] },
          { name: 'Bellman-Ford', cx: 'O(V·E) time', tags: [{ text: 'Negative weights', bg: '#f0fdf4', color: '#15803d' }, { text: 'Slower', bg: '#fff7ed', color: '#c2410c' }] },
          { name: 'A* search', cx: 'O(E) time (heuristic)', tags: [{ text: 'Informed search', bg: '#f0fdf4', color: '#15803d' }, { text: 'Faster with good heuristic', bg: '#ede9ff', color: 'var(--purple)' }] },
        ],
      },
    ],
  },
  'astar': {
    tag: 'Graph',
    title: 'A* search',
    desc: 'Combines Dijkstra\'s algorithm with a heuristic function to guide the search toward the goal, often finding the shortest path faster.',
    readTime: '7 min read',
    difficulty: 'Intermediate · Pathfinding standard',
    updated: 'May 2026',
    views: '8,901',
    sections: [
      {
        id: 'overview',
        title: 'Overview',
        type: 'text',
        content: `A* search is Dijkstra's algorithm with a twist: instead of prioritizing nodes by their distance from the source alone, it uses f(n) = g(n) + h(n), where g(n) is the actual cost from the source to n, and h(n) is a heuristic estimate of the cost from n to the goal.

When the heuristic is admissible (never overestimates), A* guarantees finding the optimal path. When the heuristic is also consistent, A* is optimally efficient — no optimal algorithm will expand fewer nodes.`,
      },
      {
        id: 'algorithm',
        title: 'How it works',
        type: 'text',
        content: `A* maintains two sets: open set (nodes to evaluate) and closed set (nodes already evaluated).`,
        steps: [
          { title: 'Initialize', text: 'Add the start node to the open set with g = 0 and f = h(start).' },
          { title: 'Select best', text: 'Pick the node with the lowest f value from the open set.' },
          { title: 'Evaluate', text: 'If it\'s the goal, reconstruct the path. Otherwise, move it to the closed set.' },
          { title: 'Expand', text: 'For each neighbor, calculate tentative g. If it\'s better than the known g, update g, f, and parent. Add to open set if not already there.' },
        ],
      },
      {
        id: 'code',
        title: 'Implementation',
        type: 'code',
        languages: [
          {
            lang: 'JavaScript',
            filename: 'astar.js',
            code: `function aStar(grid, start, goal, heuristic) {
  const openSet = [start];
  const gScore = { [start]: 0 };
  const fScore = { [start]: heuristic(start, goal) };
  const cameFrom = {};

  while (openSet.length > 0) {
    // Get node with lowest fScore
    let current = openSet.reduce((a, b) =>
      fScore[a] < fScore[b] ? a : b
    );

    if (current === goal) {
      return reconstructPath(cameFrom, current);
    }

    openSet.splice(openSet.indexOf(current), 1);

    for (const neighbor of getNeighbors(grid, current)) {
      const tentativeG = gScore[current] + 1;
      if (tentativeG < (gScore[neighbor] ?? Infinity)) {
        cameFrom[neighbor] = current;
        gScore[neighbor] = tentativeG;
        fScore[neighbor] = tentativeG + heuristic(neighbor, goal);
        if (!openSet.includes(neighbor)) {
          openSet.push(neighbor);
        }
      }
    }
  }

  return null; // No path found
}`,
            highlightLines: [7, 8, 9, 10, 11, 12, 13, 14, 15],
          },
          {
            lang: 'Python',
            filename: 'astar.py',
            code: `import heapq

def a_star(grid, start, goal):
    rows, cols = len(grid), len(grid[0])
    open_set = [(0, start)]
    g_score = {start: 0}
    came_from = {}

    while open_set:
        _, current = heapq.heappop(open_set)

        if current == goal:
            return reconstruct_path(came_from, current)

        for dx, dy in [(0,1),(1,0),(0,-1),(-1,0)]:
            nx, ny = current[0] + dx, current[1] + dy
            if 0 <= nx < rows and 0 <= ny < cols and grid[nx][ny] == 0:
                neighbor = (nx, ny)
                tentative_g = g_score[current] + 1
                if tentative_g < g_score.get(neighbor, float('inf')):
                    came_from[neighbor] = current
                    g_score[neighbor] = tentative_g
                    f = tentative_g + heuristic(neighbor, goal)
                    heapq.heappush(open_set, (f, neighbor))

    return None

def heuristic(a, b):
    return abs(a[0] - b[0]) + abs(a[1] - b[1])

def reconstruct_path(came_from, current):
    path = [current]
    while current in came_from:
        current = came_from[current]
        path.append(current)
    return path[::-1]
`,
          },
          {
            lang: 'Java',
            filename: 'AStar.java',
            code: `import java.util.*;

public class AStar {
    static class Node implements Comparable<Node> {
        int x, y, f, g;
        Node(int x, int y, int g, int f) {
            this.x = x; this.y = y; this.g = g; this.f = f;
        }
        public int compareTo(Node other) { return this.f - other.f; }
    }

    public static List<int[]> aStar(int[][] grid, int[] start, int[] goal) {
        int rows = grid.length, cols = grid[0].length;
        PriorityQueue<Node> openSet = new PriorityQueue<>();
        int[][] gScore = new int[rows][cols];
        for (int[] row : gScore) Arrays.fill(row, Integer.MAX_VALUE);
        Map<String, int[]> cameFrom = new HashMap<>();

        openSet.offer(new Node(start[0], start[1], 0, heuristic(start, goal)));
        gScore[start[0]][start[1]] = 0;

        int[][] dirs = {{0,1},{1,0},{0,-1},{-1,0}};

        while (!openSet.isEmpty()) {
            Node current = openSet.poll();

            if (current.x == goal[0] && current.y == goal[1]) {
                return reconstructPath(cameFrom, current);
            }

            for (int[] d : dirs) {
                int nx = current.x + d[0], ny = current.y + d[1];
                if (nx >= 0 && nx < rows && ny >= 0 && ny < cols && grid[nx][ny] == 0) {
                    int tentativeG = current.g + 1;
                    if (tentativeG < gScore[nx][ny]) {
                        cameFrom.put(nx + "," + ny, new int[]{current.x, current.y});
                        gScore[nx][ny] = tentativeG;
                        int f = tentativeG + heuristic(new int[]{nx, ny}, goal);
                        openSet.offer(new Node(nx, ny, tentativeG, f));
                    }
                }
            }
        }

        return null;
    }

    private static int heuristic(int[] a, int[] b) {
        return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
    }

    private static List<int[]> reconstructPath(Map<String, int[]> cameFrom, Node current) {
        List<int[]> path = new ArrayList<>();
        String key = current.x + "," + current.y;
        path.add(new int[]{current.x, current.y});
        while (cameFrom.containsKey(key)) {
            int[] parent = cameFrom.get(key);
            path.add(0, parent);
            key = parent[0] + "," + parent[1];
        }
        return path;
    }
}`,
          },
        ],
      },
      {
        id: 'complexity',
        title: 'Complexity',
        type: 'text',
        content: `A*'s performance depends heavily on the quality of the heuristic. In the worst case (h = 0), it degenerates to Dijkstra's.`,
        table: {
          headers: ['Heuristic', 'Time', 'Space', 'Notes'],
          rows: [
            { cells: ['h = 0', 'O((V+E) log V)', 'O(V)', 'Dijkstra\'s algorithm'], classes: ['ok', 'mono', ''] },
            { cells: ['Admissible', 'O(bᵈ)', 'O(bᵈ)', 'b = branching, d = depth'], classes: ['good', 'mono', ''] },
            { cells: ['Perfect', 'O(d)', 'O(d)', 'Follows optimal path directly'], classes: ['good', 'mono', ''] },
          ],
        },
        callout: {
          type: 'success',
          title: 'Choosing a heuristic',
          body: 'For grid-based pathfinding, Manhattan distance works for 4-directional movement, and Euclidean distance for 8-directional. The heuristic should never overestimate — if it does, A* may find suboptimal paths.',
        },
      },
      {
        id: 'related',
        title: 'Related algorithms',
        type: 'related',
        cards: [
          { name: 'Dijkstra\'s', cx: 'O((V+E) log V) time', tags: [{ text: 'No heuristic', bg: '#ede9ff', color: 'var(--purple)' }, { text: 'Guaranteed optimal', bg: '#f0fdf4', color: '#15803d' }] },
          { name: 'Greedy BFS', cx: 'O(bᵈ) time', tags: [{ text: 'h(n) only', bg: '#ede9ff', color: 'var(--purple)' }, { text: 'Not optimal', bg: '#fff1f2', color: '#be123c' }] },
          { name: 'Jump Point Search', cx: 'O(E) time (grid)', tags: [{ text: 'A* optimization', bg: '#f0fdf4', color: '#15803d' }, { text: 'Grid only', bg: '#ede9ff', color: 'var(--purple)' }] },
        ],
      },
    ],
  },
  'intro': {
    tag: 'Getting started',
    title: 'Introduction',
    desc: 'What is AlgoVis and how to get the most out of it.',
    readTime: '3 min read',
    difficulty: 'Beginner',
    updated: 'May 2026',
    views: '12,456',
    sections: [
      {
        id: 'overview',
        title: 'What is AlgoVis?',
        type: 'text',
        content: `AlgoVis is an interactive algorithm visualization platform built with React. It provides step-by-step animations for over 30 algorithms across sorting, searching, graph theory, dynamic programming, trees, and more.

The goal is to make abstract algorithm concepts concrete. Instead of reading pseudocode and imagining how it works, you can watch it execute in real time, step through each operation, and see the data structures change.`,
      },
      {
        id: 'features',
        title: 'Features',
        type: 'text',
        content: `Each algorithm visualizer includes:`,
        listItems: [
          '<strong>Step-by-step animation</strong> — watch the algorithm execute frame by frame',
          '<strong>Playback controls</strong> — play, pause, step forward/backward, reset',
          '<strong>Speed control</strong> — adjust animation speed from 0.5× to 4×',
          '<strong>Info panel</strong> — algorithm description, step-by-step explanation, and complexity analysis',
          '<strong>Code examples</strong> — implementations in Java, JavaScript and Python',
          '<strong>Custom input</strong> — generate random data or input your own (coming soon)',
        ],
      },
    ],
  },
  'quickstart': {
    tag: 'Getting started',
    title: 'Quick start',
    desc: 'Get up and running with AlgoVis in under 2 minutes.',
    readTime: '2 min read',
    difficulty: 'Beginner',
    updated: 'May 2026',
    views: '8,923',
    sections: [
      {
        id: 'overview',
        title: 'Getting started',
        type: 'text',
        content: `AlgoVis runs entirely in your browser — no installation required. Simply navigate to the algorithm you want to explore and start the animation.`,
        steps: [
          { title: 'Browse algorithms', text: 'Go to the Algorithms page and choose a category (Sorting, Graph, DP, etc.).' },
          { title: 'Select an algorithm', text: 'Click on any algorithm to open its visualizer.' },
          { title: 'Generate data', text: 'Click "New Graph" or "Generate" to create a random input, or input your own values.' },
          { title: 'Run the animation', text: 'Press Play to watch the algorithm execute, or use Step Forward to go through it one operation at a time.' },
        ],
      },
    ],
  },
  'howto': {
    tag: 'Getting started',
    title: 'How to use the visualizer',
    desc: 'A guide to all the controls and features available in each algorithm visualizer.',
    readTime: '4 min read',
    difficulty: 'Beginner',
    updated: 'May 2026',
    views: '6,234',
    sections: [
      {
        id: 'overview',
        title: 'Controls',
        type: 'text',
        content: `Every visualizer shares a common control bar:`,
        listItems: [
          '<strong>↺ Reset</strong> — clears the current animation and resets to initial state',
          '<strong>⏮ Step Back</strong> — goes back one step in the animation',
          '<strong>▶ / ⏸ Play / Pause</strong> — starts or pauses the animation',
          '<strong>⏭ Step Forward</strong> — advances one step',
          '<strong>Speed buttons</strong> — 0.5×, 1×, 2×, 4× animation speed',
          '<strong>Step counter</strong> — shows current step / total steps',
        ],
      },
      {
        id: 'tips',
        title: 'Tips',
        type: 'text',
        content: `Get the most out of the visualizers:`,
        listItems: [
          'Start with <strong>small arrays</strong> (5-10 elements) to understand the algorithm mechanics',
          'Use <strong>step-by-step</strong> mode to see exactly what happens at each operation',
          'Compare <strong>best and worst cases</strong> — try sorted vs reverse-sorted input',
          'Read the <strong>Info tab</strong> before running the animation to understand what to look for',
          'Check the <strong>Complexity tab</strong> to understand the theoretical performance',
        ],
      },
    ],
  },
  'roadmap': {
    tag: 'Getting started',
    title: 'Learning roadmap',
    desc: 'A suggested order for learning algorithms, from fundamentals to advanced topics.',
    readTime: '5 min read',
    difficulty: 'Beginner',
    updated: 'May 2026',
    views: '7,891',
    sections: [
      {
        id: 'overview',
        title: 'Phase 1: Foundations',
        type: 'text',
        content: `Start with the basics — these algorithms introduce fundamental concepts that appear everywhere:`,
        listItems: [
          '<strong>Bubble sort</strong> — introduces comparison-based sorting and the concept of passes',
          '<strong>Insertion sort</strong> — introduces the idea of building a solution incrementally',
          '<strong>Linear search</strong> — the simplest search; O(n) baseline',
          '<strong>Binary search</strong> — introduces divide-and-conquer and logarithmic time',
        ],
      },
      {
        id: 'phase2',
        title: 'Phase 2: Core algorithms',
        type: 'text',
        content: `Once you understand the basics, move to the algorithms that form the backbone of computer science:`,
        listItems: [
          '<strong>Merge sort</strong> — the canonical divide-and-conquer algorithm',
          '<strong>Quicksort</strong> — the most important sorting algorithm in practice',
          '<strong>BFS / DFS</strong> — the foundation of all graph algorithms',
          '<strong>Dijkstra\'s</strong> — shortest paths in weighted graphs',
        ],
      },
      {
        id: 'phase3',
        title: 'Phase 3: Advanced topics',
        type: 'text',
        content: `These require comfort with the earlier material but are essential for interviews and real-world problem solving:`,
        listItems: [
          '<strong>Dynamic programming</strong> — Fibonacci → Knapsack → LCS → Edit distance',
          '<strong>Graph algorithms</strong> — MST (Kruskal/Prim), Bellman-Ford, Floyd-Warshall',
          '<strong>Tree structures</strong> — BST → AVL → Red-Black → Trie',
          '<strong>String algorithms</strong> — KMP → Rabin-Karp → Z-algorithm',
        ],
      },
    ],
  },
  'bigO': {
    tag: 'Concepts',
    title: 'Big O notation',
    desc: 'Understanding how to describe algorithm efficiency in terms of input size growth.',
    readTime: '6 min read',
    difficulty: 'Junior · Essential concept',
    updated: 'May 2026',
    views: '15,234',
    sections: [
      {
        id: 'overview',
        title: 'What is Big O?',
        type: 'text',
        content: `Big O notation describes the upper bound of an algorithm's running time as the input size grows. It answers the question: "If I double the input size, how much longer will this take?"

Big O ignores constant factors and lower-order terms. O(2n + 5) simplifies to O(n). This is intentional — we care about growth rates, not exact timings.`,
        callout: {
          type: 'info',
          title: 'Big O is about growth, not speed',
          body: 'An O(n) algorithm isn\'t necessarily faster than an O(n²) algorithm for small inputs. Big O describes behavior as n → ∞. For small n, constant factors matter. Always measure before optimizing.',
        },
      },
      {
        id: 'common',
        title: 'Common complexities',
        type: 'text',
        content: `From fastest to slowest:`,
        table: {
          headers: ['Notation', 'Name', 'Example', 'n=1000'],
          rows: [
            { cells: ['O(1)', 'Constant', 'Hash table lookup', '1'], classes: ['good', 'mono', ''] },
            { cells: ['O(log n)', 'Logarithmic', 'Binary search', '~10'], classes: ['good', 'mono', ''] },
            { cells: ['O(n)', 'Linear', 'Linear search', '1,000'], classes: ['ok', 'mono', ''] },
            { cells: ['O(n log n)', 'Linearithmic', 'Merge sort', '~10,000'], classes: ['ok', 'mono', ''] },
            { cells: ['O(n²)', 'Quadratic', 'Bubble sort', '1,000,000'], classes: ['bad', 'mono', ''] },
            { cells: ['O(2ⁿ)', 'Exponential', 'Naive Fibonacci', '~10³⁰'], classes: ['bad', 'mono', ''] },
          ],
        },
      },
    ],
  },
  'space': {
    tag: 'Concepts',
    title: 'Space complexity',
    desc: 'How much memory an algorithm uses relative to input size, including auxiliary space and recursion stack.',
    readTime: '4 min read',
    difficulty: 'Junior · Essential concept',
    updated: 'May 2026',
    views: '5,678',
    sections: [
      {
        id: 'overview',
        title: 'What is space complexity?',
        type: 'text',
        content: `Space complexity measures the amount of memory an algorithm needs beyond the input itself. This includes:

<strong>Auxiliary space</strong> — extra memory allocated (arrays, hash maps, etc.)
<strong>Recursion stack</strong — memory used by the call stack in recursive algorithms

An algorithm that modifies the input in-place uses O(1) auxiliary space.`,
      },
      {
        id: 'examples',
        title: 'Examples',
        type: 'text',
        content: `Common space complexity patterns:`,
        table: {
          headers: ['Algorithm', 'Space', 'Why'],
          rows: [
            { cells: ['Bubble sort', 'O(1)', 'In-place swaps'], classes: ['good', 'mono', ''] },
            { cells: ['Merge sort', 'O(n)', 'Temporary arrays for merging'], classes: ['bad', 'mono', ''] },
            { cells: ['Quick sort', 'O(log n)', 'Recursion stack depth'], classes: ['ok', 'mono', ''] },
            { cells: ['BFS', 'O(V)', 'Queue + visited set'], classes: ['ok', 'mono', ''] },
          ],
        },
      },
    ],
  },
  'recur': {
    tag: 'Concepts',
    title: 'Recursion & call stack',
    desc: 'Understanding how recursive functions work, the call stack, and when to use recursion vs iteration.',
    readTime: '6 min read',
    difficulty: 'Junior · Foundation concept',
    updated: 'May 2026',
    views: '9,012',
    sections: [
      {
        id: 'overview',
        title: 'What is recursion?',
        type: 'text',
        content: `Recursion is when a function calls itself to solve a smaller version of the same problem. Every recursive function needs:

<strong>Base case</strong> — the condition that stops the recursion
<strong>Recursive case</strong> — the function calling itself with a smaller input

Without a base case, the function calls itself forever (stack overflow).`,
      },
      {
        id: 'callstack',
        title: 'The call stack',
        type: 'text',
        content: `Each recursive call creates a new frame on the call stack. When the base case is reached, frames are popped off in reverse order (last in, first out).`,
        steps: [
          { title: 'Push', text: 'Each recursive call adds a frame to the stack with its own local variables.' },
          { title: 'Base case', text: 'When the base case is reached, the function returns a value.' },
          { title: 'Pop', text: 'Each frame is popped off the stack, returning its result to the caller.' },
          { title: 'Unwind', text: 'The results propagate back up the chain until the original call returns.' },
        ],
        callout: {
          type: 'warning',
          title: 'Stack overflow',
          body: 'Deep recursion can exhaust the call stack. JavaScript engines typically allow ~10,000 recursive calls. For deeper recursion, use an iterative approach with an explicit stack.',
        },
      },
    ],
  },
  'stable': {
    tag: 'Concepts',
    title: 'Stability in sorting',
    desc: 'What it means for a sorting algorithm to be stable and why it matters in practice.',
    readTime: '4 min read',
    difficulty: 'Junior · Interview concept',
    updated: 'May 2026',
    views: '4,567',
    sections: [
      {
        id: 'overview',
        title: 'What is stability?',
        type: 'text',
        content: `A sorting algorithm is <strong>stable</strong> if it preserves the relative order of equal elements. If two elements have the same key, a stable sort keeps them in their original order.

For example, sorting [{name: "Alice", age: 25}, {name: "Bob", age: 25}] by age: a stable sort keeps Alice before Bob; an unstable sort might swap them.`,
        callout: {
          type: 'info',
          title: 'When stability matters',
          body: 'Stability matters when sorting by multiple keys. If you sort by name, then by age, a stable sort ensures that people with the same age remain in name order. This is called "radix sort" when applied digit by digit.',
        },
      },
      {
        id: 'comparison',
        title: 'Stable vs unstable sorts',
        type: 'text',
        content: `Common stability properties:`,
        table: {
          headers: ['Algorithm', 'Stable?', 'Why'],
          rows: [
            { cells: ['Bubble sort', 'Yes', 'Only swaps when strictly greater'], classes: ['good', 'mono', ''] },
            { cells: ['Insertion sort', 'Yes', 'Inserts equal elements after existing ones'], classes: ['good', 'mono', ''] },
            { cells: ['Merge sort', 'Yes', 'Uses ≤ comparison in merge step'], classes: ['good', 'mono', ''] },
            { cells: ['Quick sort', 'No', 'Partition swaps can reorder equals'], classes: ['bad', 'mono', ''] },
            { cells: ['Heap sort', 'No', 'Heap operations reorder equals'], classes: ['bad', 'mono', ''] },
            { cells: ['Selection sort', 'No', 'Swaps minimum with first unsorted'], classes: ['bad', 'mono', ''] },
          ],
        },
      },
    ],
  },
  'constraint-propagation': {
    tag: 'Concepts',
    title: 'Constraint propagation',
    desc: 'A problem-solving technique that eliminates impossible values before guessing, dramatically reducing the search space.',
    readTime: '8 min read',
    difficulty: 'Intermediate · Core concept',
    updated: 'May 2026',
    views: '3,412',
    sections: [
      {
        id: 'overview',
        title: 'What is constraint propagation?',
        type: 'text',
        content: `Constraint propagation is a technique used to solve constraint satisfaction problems (CSPs) by systematically eliminating impossible values before resorting to guessing.

In a CSP, you have variables, each with a domain of possible values, and constraints that restrict which combinations of values are allowed. The goal is to find an assignment of values to all variables that satisfies every constraint.

Instead of immediately guessing and backtracking, constraint propagation first deduces what values are impossible and removes them. This process repeats until no more deductions can be made — at which point, if the problem isn't solved, the solver makes an informed guess and recurses.`,
        callout: {
          type: 'info',
          title: 'The key insight',
          body: 'Every time you eliminate a value, you create new information. That information can trigger further eliminations. A single deduction can cascade into dozens more — like knocking down dominoes.',
        },
      },
      {
        id: 'naked-singles',
        title: 'Naked singles: the simplest propagation rule',
        type: 'text',
        content: `The most basic propagation rule is the <strong>naked single</strong>: if a cell has only one possible value left, that value must be correct.

Once you identify a naked single, you assign that value and eliminate it from all related cells (peers). This elimination might cause another cell to become a naked single, triggering a chain reaction.`,
        steps: [
          { title: 'Find a cell with one candidate', text: 'Scan all cells. If any cell has exactly one possible value, that value is the solution for that cell.' },
          { title: 'Assign the value', text: 'Lock in that value — it is now fixed and cannot change.' },
          { title: 'Eliminate from peers', text: 'Remove that value from the candidate sets of all cells that share a constraint (same row, column, or box in Sudoku).' },
          { title: 'Repeat', text: 'Go back to step 1. The elimination may have created new naked singles.' },
        ],
      },
      {
        id: 'comparison',
        title: 'Backtracking vs CP+BT: a side-by-side comparison',
        type: 'text',
        content: `The difference between pure backtracking and constraint propagation + backtracking is like the difference between brute-force searching and thinking before acting.`,
        compareGrid: [
          {
            title: 'Pure backtracking',
            tag: 'naive',
            tagColor: '#fff7ed',
            tagTextColor: '#c2410c',
            pros: [
              'Scans cells left-to-right, top-to-bottom',
              'Tries digits 1 through 9 in order',
              'Checks constraints only after placing a digit',
              'Backtracks only when a constraint is violated',
              'May explore thousands of dead-end branches',
            ],
          },
          {
            title: 'CP + Backtracking',
            tag: 'intelligent',
            tagColor: '#f0fdf4',
            tagTextColor: '#15803d',
            pros: [
              'Maintains candidate sets for every cell',
              'Eliminates impossible values before guessing',
              'Naked singles are solved automatically — no guessing needed',
              'Uses MRV heuristic: guesses the cell with fewest options first',
              'Prunes 90%+ of the search tree on hard puzzles',
            ],
          },
        ],
      },
      {
        id: 'mrv',
        title: 'MRV: the Minimum Remaining Values heuristic',
        type: 'text',
        content: `When propagation stalls (no more naked singles), the solver must guess. But which cell should it guess on?

The MRV heuristic picks the cell with the <strong>fewest remaining candidates</strong>. This is optimal because:

<strong>Higher chance of being right</strong> — a cell with 2 candidates has a 50% chance of being correct, while a cell with 9 candidates has only an 11% chance.
<strong>Faster failure detection</strong> — if the guess is wrong, you'll discover it sooner because there are fewer branches to explore.
<strong>Smaller search tree</strong> — guessing on the most constrained cell prunes more of the search space.`,
        callout: {
          type: 'success',
          title: 'Real-world analogy',
          body: 'Imagine you\'re filling out a crossword. You wouldn\'t start with the hardest clue — you\'d fill in the easy ones first, and the answers you discover will help you solve the harder clues. MRV is the algorithmic version of this intuition.',
        },
      },
      {
        id: 'code',
        title: 'Implementation',
        type: 'code',
        languages: [
          {
            lang: 'JavaScript',
            filename: 'sudoku-cp.js',
            code: `function solveSudoku(board) {
  const candidates = initCandidates(board);
  return search(candidates);
}

function search(candidates) {
  // Phase 1: propagate constraints
  propagate(candidates);
  if (isContradiction(candidates)) return null;
  if (isSolved(candidates)) return candidates;

  // Phase 2: MRV — pick cell with fewest candidates
  const cell = findMinCandidates(candidates);
  for (const val of candidates[cell]) {
    const copy = cloneCandidates(candidates);
    copy[cell] = new Set([val]);
    const result = search(copy);
    if (result) return result;
  }
  return null;
}

function propagate(candidates) {
  let changed = true;
  while (changed) {
    changed = false;
    for (const cell of cells) {
      if (candidates[cell].size === 1) {
        const val = [...candidates[cell]][0];
        for (const peer of getPeers(cell)) {
          if (candidates[peer].has(val)) {
            candidates[peer].delete(val);
            changed = true;
          }
        }
      }
    }
  }
}`,
            highlightLines: [20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
          },
          {
            lang: 'Python',
            filename: 'sudoku_cp.py',
            code: `def solve_sudoku(board):
    candidates = init_candidates(board)
    return search(candidates)

def search(candidates):
    # Phase 1: propagate constraints
    propagate(candidates)
    if is_contradiction(candidates):
        return None
    if is_solved(candidates):
        return candidates

    # Phase 2: MRV heuristic
    cell = find_min_candidates(candidates)
    for val in candidates[cell]:
        copy = clone_candidates(candidates)
        copy[cell] = {val}
        result = search(copy)
        if result:
            return result
    return None

def propagate(candidates):
    changed = True
    while changed:
        changed = False
        for cell in cells:
            if len(candidates[cell]) == 1:
                val = next(iter(candidates[cell]))
                for peer in get_peers(cell):
                    if val in candidates[peer]:
                        candidates[peer].discard(val)
                        changed = True
`,
          },
          {
            lang: 'Java',
            filename: 'SudokuCP.java',
            code: `public class SudokuCP {
    public static Set<Integer>[][] solve(int[][] board) {
        Set<Integer>[][] candidates = initCandidates(board);
        return search(candidates);
    }

    @SuppressWarnings("unchecked")
    private static Set<Integer>[][] search(Set<Integer>[][] cands) {
        propagate(cands);
        if (isContradiction(cands)) return null;
        if (isSolved(cands)) return cands;

        int[] cell = findMinCandidates(cands);
        for (int val : cands[cell[0]][cell[1]]) {
            Set<Integer>[][] copy = cloneCandidates(cands);
            copy[cell[0]][cell[1]] = new HashSet<>(Set.of(val));
            Set<Integer>[][] result = search(copy);
            if (result != null) return result;
        }
        return null;
    }

    private static void propagate(Set<Integer>[][] cands) {
        boolean changed = true;
        while (changed) {
            changed = false;
            for (int r = 0; r < 9; r++) {
                for (int c = 0; c < 9; c++) {
                    if (cands[r][c].size() == 1) {
                        int val = cands[r][c].iterator().next();
                        for (int[] peer : getPeers(r, c)) {
                            if (cands[peer[0]][peer[1]].remove(val)) {
                                changed = true;
                            }
                        }
                    }
                }
            }
        }
    }
}`,
          },
        ],
      },
      {
        id: 'related',
        title: 'Related algorithms',
        type: 'related',
        cards: [
          { name: 'Sudoku Solver (Backtracking)', cx: 'O(9^(n²)) time', tags: [{ text: 'Pure BT', bg: '#fff7ed', color: '#c2410c' }, { text: 'Simpler', bg: '#f0fdf4', color: '#15803d' }] },
          { name: 'Dancing Links', cx: 'O(n) time per solution', tags: [{ text: 'Exact cover', bg: '#ede9ff', color: 'var(--purple)' }, { text: 'Fastest', bg: '#f0fdf4', color: '#15803d' }] },
          { name: 'N-Queens', cx: 'O(n!) time', tags: [{ text: 'Backtracking', bg: '#ede9ff', color: 'var(--purple)' }, { text: 'Classic CSP', bg: '#f0fdf4', color: '#15803d' }] },
        ],
      },
    ],
  },
  'sudoku-cp': {
    tag: 'Constraint Propagation',
    title: 'Sudoku Solver (CP+BT)',
    desc: 'Solves Sudoku by combining constraint propagation with backtracking — eliminating impossible values before guessing, using the MRV heuristic for optimal search.',
    readTime: '10 min read',
    difficulty: 'Intermediate · Practical use',
    updated: 'May 2026',
    views: '2,187',
    sections: [
      {
        id: 'overview',
        title: 'Overview',
        type: 'text',
        content: `The CP+BT Sudoku solver maintains a set of possible candidates for each empty cell. Before making any guesses, it propagates constraints: when a cell is reduced to a single candidate (a "naked single"), that value is assigned and eliminated from all peer cells. This cascading elimination solves many cells automatically.

Only when propagation reaches a fixpoint (no more naked singles) does the solver resort to guessing. At that point, it uses the Minimum Remaining Values (MRV) heuristic to pick the cell with the fewest candidates, maximizing the chance of a correct guess and minimizing the search tree.`,
        callout: {
          type: 'info',
          title: 'How is this different from pure backtracking?',
          body: 'Pure backtracking tries digits 1-9 in order for each empty cell, checking constraints only after placing a digit. It may explore thousands of dead-end branches. CP+BT eliminates impossible values <em>before</em> guessing, solving easy cells automatically and pruning 90%+ of the search tree on hard puzzles.',
        },
      },
      {
        id: 'algorithm',
        title: 'How it works',
        type: 'text',
        content: `The algorithm alternates between two phases: propagation (deduction) and search (guessing).`,
        steps: [
          { title: 'Initialize candidates', text: 'Each empty cell starts with candidates {1, 2, ..., 9}. Given cells are fixed to their single value.' },
          { title: 'Propagate naked singles', text: 'Find cells with exactly one candidate. Assign that value and eliminate it from all peers (same row, column, or 3×3 box).' },
          { title: 'Repeat propagation', text: 'Continue until no more naked singles exist. Each elimination may create new naked singles — a chain reaction.' },
          { title: 'Check for contradiction', text: 'If any cell has zero candidates, the current path is invalid. Backtrack.' },
          { title: 'Check if solved', text: 'If all cells have exactly one candidate, the puzzle is solved.' },
          { title: 'MRV guess', text: 'Pick the unsolved cell with the fewest candidates. Try each candidate value recursively, returning to propagation after each guess.' },
          { title: 'Backtrack on failure', text: 'If all candidates for a cell lead to contradictions, restore the previous state and backtrack to the parent guess.' },
        ],
      },
      {
        id: 'code',
        title: 'Implementation',
        type: 'code',
        languages: [
          {
            lang: 'JavaScript',
            filename: 'sudoku-cp.js',
            code: `function solveSudoku(board) {
  const candidates = initCandidates(board);
  return search(candidates);
}

function search(candidates) {
  // Phase 1: propagate constraints
  propagate(candidates);
  if (isContradiction(candidates)) return null;
  if (isSolved(candidates)) return candidates;

  // Phase 2: MRV — pick cell with fewest candidates
  const cell = findMinCandidates(candidates);
  for (const val of candidates[cell]) {
    const copy = cloneCandidates(candidates);
    copy[cell] = new Set([val]);
    const result = search(copy);
    if (result) return result;
  }
  return null;
}

function propagate(candidates) {
  let changed = true;
  while (changed) {
    changed = false;
    for (const cell of cells) {
      if (candidates[cell].size === 1) {
        const val = [...candidates[cell]][0];
        for (const peer of getPeers(cell)) {
          if (candidates[peer].has(val)) {
            candidates[peer].delete(val);
            changed = true;
          }
        }
      }
    }
  }
}`,
            highlightLines: [20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
          },
          {
            lang: 'Python',
            filename: 'sudoku_cp.py',
            code: `def solve_sudoku(board):
    candidates = init_candidates(board)
    return search(candidates)

def search(candidates):
    # Phase 1: propagate constraints
    propagate(candidates)
    if is_contradiction(candidates):
        return None
    if is_solved(candidates):
        return candidates

    # Phase 2: MRV heuristic
    cell = find_min_candidates(candidates)
    for val in candidates[cell]:
        copy = clone_candidates(candidates)
        copy[cell] = {val}
        result = search(copy)
        if result:
            return result
    return None

def propagate(candidates):
    changed = True
    while changed:
        changed = False
        for cell in cells:
            if len(candidates[cell]) == 1:
                val = next(iter(candidates[cell]))
                for peer in get_peers(cell):
                    if val in candidates[peer]:
                        candidates[peer].discard(val)
                        changed = True
`,
          },
          {
            lang: 'Java',
            filename: 'SudokuCP.java',
            code: `public class SudokuCP {
    public static Set<Integer>[][] solve(int[][] board) {
        Set<Integer>[][] candidates = initCandidates(board);
        return search(candidates);
    }

    @SuppressWarnings("unchecked")
    private static Set<Integer>[][] search(Set<Integer>[][] cands) {
        propagate(cands);
        if (isContradiction(cands)) return null;
        if (isSolved(cands)) return cands;

        int[] cell = findMinCandidates(cands);
        for (int val : cands[cell[0]][cell[1]]) {
            Set<Integer>[][] copy = cloneCandidates(cands);
            copy[cell[0]][cell[1]] = new HashSet<>(Set.of(val));
            Set<Integer>[][] result = search(copy);
            if (result != null) return result;
        }
        return null;
    }

    private static void propagate(Set<Integer>[][] cands) {
        boolean changed = true;
        while (changed) {
            changed = false;
            for (int r = 0; r < 9; r++) {
                for (int c = 0; c < 9; c++) {
                    if (cands[r][c].size() == 1) {
                        int val = cands[r][c].iterator().next();
                        for (int[] peer : getPeers(r, c)) {
                            if (cands[peer[0]][peer[1]].remove(val)) {
                                changed = true;
                            }
                        }
                    }
                }
            }
        }
    }
}`,
          },
        ],
      },
      {
        id: 'complexity',
        title: 'Complexity comparison',
        type: 'text',
        content: `While both algorithms share the same worst-case theoretical bound, the practical difference is enormous.`,
        table: {
          headers: ['Metric', 'Pure Backtracking', 'CP + Backtracking'],
          rows: [
            { cells: ['Worst case', 'O(9^(n²))', 'O(9^(n²))'], classes: ['bad', 'mono', 'mono'] },
            { cells: ['Easy puzzle', '~50 steps', '~10 steps (all propagation)'], classes: ['', 'mono', 'mono'] },
            { cells: ['Hard puzzle', '~50,000 steps', '~2,000 steps'], classes: ['', 'mono', 'mono'] },
            { cells: ['Expert puzzle', '~500,000 steps', '~5,000 steps'], classes: ['', 'mono', 'mono'] },
            { cells: ['Space', 'O(n²)', 'O(n²)'], classes: ['', 'mono', 'mono'] },
          ],
        },
        callout: {
          type: 'warning',
          title: 'Same worst case, vastly different reality',
          body: 'Both algorithms are O(9^(n²)) in the worst case. But the worst case for CP+BT is a puzzle specifically designed to defeat constraint propagation — it almost never occurs in practice. On real Sudoku puzzles, CP+BT is typically 10-100× faster.',
        },
      },
      {
        id: 'visualizer',
        title: 'Using the visualizer',
        type: 'text',
        content: `The CP+BT visualizer shows both phases of the algorithm:`,
        listItems: [
          '<strong style="color: #fef3c7">Yellow cells</strong> — constraint propagation: a value is eliminated from a cell\'s candidates',
          '<strong style="color: #bfdbfe">Blue cells</strong> — MRV guess: the solver is trying a value on the most constrained cell',
          '<strong style="color: #86efac">Green cells</strong> — naked single or successful placement: a cell is solved',
          '<strong style="color: #fca5a5">Red cells</strong> — backtrack: a guess was wrong, the solver is undoing it',
          '<strong style="color: #fecaca">Dark red cells</strong> — contradiction: a cell has zero candidates left',
        ],
        tags: ['candidate sets', 'naked singles', 'MRV heuristic', 'constraint satisfaction', 'search tree pruning'],
      },
      {
        id: 'related',
        title: 'Related algorithms',
        type: 'related',
        cards: [
          { name: 'Sudoku Solver (Backtracking)', cx: 'O(9^(n²)) time · O(n²) space', tags: [{ text: 'Pure BT', bg: '#fff7ed', color: '#c2410c' }, { text: 'Simpler', bg: '#f0fdf4', color: '#15803d' }] },
          { name: 'Dancing Links', cx: 'O(n) time per solution', tags: [{ text: 'Exact cover', bg: '#ede9ff', color: 'var(--purple)' }, { text: 'Fastest', bg: '#f0fdf4', color: '#15803d' }] },
          { name: 'N-Queens', cx: 'O(n!) time', tags: [{ text: 'Backtracking', bg: '#ede9ff', color: 'var(--purple)' }, { text: 'Classic CSP', bg: '#f0fdf4', color: '#15803d' }] },
        ],
      },
    ],
  },
};

export const docsSidebar = {
  sections: [
    {
      label: 'Getting started',
      links: [
        { id: 'intro', label: 'Introduction' },
        { id: 'quickstart', label: 'Quick start' },
        { id: 'howto', label: 'How to use the visualizer' },
        { id: 'roadmap', label: 'Learning roadmap' },
      ],
    },
    {
      label: 'Sorting algorithms',
      links: [
        { id: 'bubble-sort', label: 'Bubble sort' },
        { id: 'selection-sort', label: 'Selection sort' },
        { id: 'insertion-sort', label: 'Insertion sort' },
        { id: 'merge-sort', label: 'Merge sort' },
        { id: 'quick-sort', label: 'Quicksort' },
        { id: 'heap-sort', label: 'Heapsort' },
      ],
    },
    {
      label: 'Dynamic programming',
      links: [
        { id: 'fib', label: 'Fibonacci — memoized' },
        { id: 'knap', label: '0/1 Knapsack' },
        { id: 'lcs', label: 'LCS' },
        { id: 'edit', label: 'Edit distance' },
      ],
      comingSoon: true,
    },
    {
      label: 'Graph algorithms',
      links: [
        { id: 'bfs', label: 'BFS' },
        { id: 'dfs', label: 'DFS' },
        { id: 'dijk', label: 'Dijkstra\'s' },
        { id: 'astar', label: 'A* search' },
      ],
      comingSoon: true,
    },
    {
      label: 'Constraint propagation',
      links: [
        { id: 'constraint-propagation', label: 'Constraint propagation' },
        { id: 'sudoku-cp', label: 'Sudoku Solver (CP+BT)' },
      ],
    },
    {
      label: 'Concepts',
      links: [
        { id: 'bigO', label: 'Big O notation' },
        { id: 'space', label: 'Space complexity' },
        { id: 'recur', label: 'Recursion & call stack' },
        { id: 'stable', label: 'Stability in sorting' },
      ],
      comingSoon: true,
    },
  ],
};
