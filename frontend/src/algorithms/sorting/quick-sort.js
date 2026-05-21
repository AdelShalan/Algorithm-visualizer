export function generateSteps(arr) {
  const steps = [];
  const a = [...arr];
  const log = [];

  function partition(low, high) {
    const pivot = a[high];
    log.push(`partition(${low}, ${high}) — pivot = ${pivot}`);
    steps.push({ type: 'pivot', index: high, array: [...a], log: [...log] });
    let i = low - 1;
    for (let j = low; j < high; j++) {
      log.push(`Comparing arr[${j}] (${a[j]}) ≤ pivot (${pivot})`);
      if (a[j] <= pivot) {
        i++;
        if (i !== j) {
          [a[i], a[j]] = [a[j], a[i]];
          log.push(`Swapped arr[${i}] ↔ arr[${j}]`);
          steps.push({ type: 'swap', indices: [i, j], array: [...a], log: [...log] });
        } else {
          steps.push({ type: 'compare', indices: [j, high], array: [...a], log: [...log] });
        }
      } else {
        steps.push({ type: 'compare', indices: [j, high], array: [...a], log: [...log] });
      }
    }
    [a[i + 1], a[high]] = [a[high], a[i + 1]];
    log.push(`Pivot ${pivot} placed at index ${i + 1}`);
    steps.push({ type: 'swap', indices: [i + 1, high], array: [...a], log: [...log] });
    log.pop();
    return i + 1;
  }

  function sort(low, high) {
    if (low < high) {
      log.push(`quickSort(${low}, ${high})`);
      const pi = partition(low, high);
      log.push(`Partitioned at ${pi} — left(${low}, ${pi - 1}), right(${pi + 1}, ${high})`);
      steps.push({ type: 'partitioned', index: pi, array: [...a], log: [...log] });
      sort(low, pi - 1);
      sort(pi + 1, high);
      log.pop();
    }
  }

  sort(0, a.length - 1);
  log.push(`Array is fully sorted ✓`);
  steps.push({ type: 'complete', array: [...a], log: [...log] });
  return steps;
}
