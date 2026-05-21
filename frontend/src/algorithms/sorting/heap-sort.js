export function generateSteps(arr) {
  const steps = [];
  const a = [...arr];
  const n = a.length;
  const log = [];

  function heapify(size, i) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    log.push(`heapify(${i}, size=${size})`);
    steps.push({ type: 'heapify', index: i, array: [...a], log: [...log] });
    if (left < size) {
      log.push(`Comparing arr[${largest}] (${a[largest]}) and arr[${left}] (${a[left]})`);
      if (a[left] > a[largest]) largest = left;
    }
    if (right < size) {
      log.push(`Comparing arr[${largest}] (${a[largest]}) and arr[${right}] (${a[right]})`);
      if (a[right] > a[largest]) largest = right;
    }
    if (largest !== i) {
      [a[i], a[largest]] = [a[largest], a[i]];
      log.push(`Swapped arr[${i}] ↔ arr[${largest}]`);
      steps.push({ type: 'swap', indices: [i, largest], array: [...a], log: [...log] });
      heapify(size, largest);
    }
    log.pop();
  }

  log.push('Building max heap');
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) heapify(n, i);
  log.pop();
  log.push(`Max heap built ✓`);
  steps.push({ type: 'heap-built', array: [...a], log: [...log] });

  for (let i = n - 1; i > 0; i--) {
    [a[0], a[i]] = [a[i], a[0]];
    log.push(`Extracted max ${a[i]} → arr[${i}]`);
    steps.push({ type: 'swap', indices: [0, i], array: [...a], log: [...log] });
    log.push(`arr[${i}] = ${a[i]} is sorted ✓`);
    steps.push({ type: 'sorted', index: i, array: [...a], log: [...log] });
    heapify(i, 0);
  }
  log.push(`Array is fully sorted ✓`);
  steps.push({ type: 'sorted', index: 0, array: [...a], log: [...log] });
  steps.push({ type: 'complete', array: [...a], log: [...log] });
  return steps;
}
