export function generateSteps(arr) {
  const steps = [];
  const a = [...arr];
  const n = a.length;
  const log = [];
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    log.push(`Pass ${i + 1} / ${n - 1} — finding minimum from index ${i} to ${n - 1}`);
    steps.push({ type: 'select', index: i, array: [...a], log: [...log] });
    for (let j = i + 1; j < n; j++) {
      log.push(`Comparing arr[${minIdx}] (${a[minIdx]}) and arr[${j}] (${a[j]})`);
      if (a[j] < a[minIdx]) {
        minIdx = j;
        log.push(`New minimum found at index ${j} = ${a[j]}`);
        steps.push({ type: 'new-min', index: j, array: [...a], log: [...log] });
      } else {
        steps.push({ type: 'compare', indices: [minIdx, j], array: [...a], log: [...log] });
      }
    }
    if (minIdx !== i) {
      [a[i], a[minIdx]] = [a[minIdx], a[i]];
      log.push(`Swapped arr[${i}] ↔ arr[${minIdx}]`);
      steps.push({ type: 'swap', indices: [i, minIdx], array: [...a], log: [...log] });
    }
    log.push(`arr[${i}] = ${a[i]} is now in place ✓`);
    steps.push({ type: 'sorted', index: i, array: [...a], log: [...log] });
  }
  log.push(`Array is fully sorted ✓`);
  steps.push({ type: 'complete', array: [...a], log: [...log] });
  return steps;
}
