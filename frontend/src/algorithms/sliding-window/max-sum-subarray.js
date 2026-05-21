export function generateSteps(a) {
  const steps = []; const log = []; let maxSum = -Infinity; let currentSum = 0; let start = 0; let bestStart = 0; let bestEnd = 0;
  log.push('Initialize: maxSum = -∞, currentSum = 0');
  steps.push({ type: 'init', array: [...a], maxSum, currentSum, window: [0, 0], log: [...log] });
  for (let i = 0; i < a.length; i++) {
    currentSum += a[i];
    log.push(`Add a[${i}]=${a[i]}, currentSum = ${currentSum}`);
    steps.push({ type: 'add', index: i, array: [...a], maxSum, currentSum, window: [start, i], log: [...log] });
    if (currentSum > maxSum) { maxSum = currentSum; bestStart = start; bestEnd = i; log.push(`New max: ${maxSum} (window [${bestStart}..${bestEnd}])`); steps.push({ type: 'new-max', index: i, array: [...a], maxSum, currentSum, window: [bestStart, bestEnd], log: [...log] }); }
    if (currentSum < 0) { log.push(`currentSum < 0, reset at ${i}`); steps.push({ type: 'reset', index: i, array: [...a], maxSum, currentSum: 0, window: [i + 1, i], log: [...log] }); currentSum = 0; start = i + 1; }
  }
  log.push(`Maximum sum: ${maxSum}`);
  steps.push({ type: 'complete', array: [...a], maxSum, window: [bestStart, bestEnd], log: [...log] });
  return steps;
}
