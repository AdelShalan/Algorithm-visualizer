export function generateSteps(arr) {
  const steps = [];
  const a = [...arr];
  const n = a.length;
  const log = [];
  log.push(`Element 0 is trivially sorted`);
  steps.push({ type: 'sorted', indices: [0], array: [...a], log: [...log] });
  for (let i = 1; i < n; i++) {
    const key = a[i];
    let j = i - 1;
    log.push(`Inserting element ${i} = ${key}`);
    steps.push({ type: 'pick', index: i, array: [...a], log: [...log] });
    while (j >= 0 && a[j] > key) {
      log.push(`arr[${j}] = ${a[j]} > ${key} — shifting right`);
      steps.push({ type: 'compare', indices: [j, i], array: [...a], log: [...log] });
      a[j + 1] = a[j];
      log.push(`Shifted arr[${j}] → arr[${j + 1}]`);
      steps.push({ type: 'shift', index: j + 1, array: [...a], log: [...log] });
      j--;
    }
    a[j + 1] = key;
    log.push(`Placed ${key} at index ${j + 1}`);
    steps.push({ type: 'insert', index: j + 1, array: [...a], log: [...log] });
    log.push(`Elements 0..${i} are sorted ✓`);
    const sortedIndices = Array.from({ length: i + 1 }, (_, k) => k);
    steps.push({ type: 'sorted', indices: sortedIndices, array: [...a], log: [...log] });
  }
  log.push(`Array is fully sorted ✓`);
  steps.push({ type: 'complete', array: [...a], log: [...log] });
  return steps;
}
