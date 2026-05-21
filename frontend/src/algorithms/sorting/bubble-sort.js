export function generateSteps(arr) {
  const steps = [];
  const a = [...arr];
  const n = a.length;
  const log = [];
  for (let i = 0; i < n - 1; i++) {
    log.push(`Pass ${i + 1} / ${n - 1} — bubbling largest to end`);
    steps.push({ type: 'pass-start', pass: i + 1, total: n - 1, array: [...a], log: [...log] });
    for (let j = 0; j < n - i - 1; j++) {
      log.push(`Comparing arr[${j}] (${a[j]}) and arr[${j + 1}] (${a[j + 1]})`);
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        log.push(`Swapped arr[${j}] ↔ arr[${j + 1}]`);
        steps.push({ type: 'swap', indices: [j, j + 1], array: [...a], log: [...log] });
      } else {
        steps.push({ type: 'compare', indices: [j, j + 1], array: [...a], log: [...log] });
      }
    }
    log.push(`arr[${n - i - 1}] = ${a[n - i - 1]} is now in place ✓`);
    steps.push({ type: 'sorted', index: n - i - 1, array: [...a], log: [...log] });
  }
  log.push(`Array is fully sorted ✓`);
  steps.push({ type: 'complete', array: [...a], log: [...log] });
  return steps;
}
