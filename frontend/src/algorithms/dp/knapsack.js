export function generateSteps(items, cap) {
  const steps = [];
  const log = [];
  const n = items.length;
  const dp = Array.from({ length: n + 1 }, () => Array(cap + 1).fill(0));
  log.push('Initialize DP table');
  steps.push({ type: 'init', dp: dp.map(r => [...r]), cell: null, log: [...log] });
  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= cap; w++) {
      steps.push({ type: 'check', i, w, dp: dp.map(r => [...r]), cell: { row: i, col: w }, log: [...log] });
      if (items[i - 1].weight <= w) {
        const include = items[i - 1].value + dp[i - 1][w - items[i - 1].weight];
        const exclude = dp[i - 1][w];
        dp[i][w] = Math.max(include, exclude);
        log.push(`Item ${i} (w:${items[i-1].weight}, v:${items[i-1].value}), cap ${w}: max(${include}, ${exclude}) = ${dp[i][w]}`);
        steps.push({ type: 'compute', i, w, value: dp[i][w], include, exclude, dp: dp.map(r => [...r]), cell: { row: i, col: w }, log: [...log] });
      } else {
        dp[i][w] = dp[i - 1][w];
        log.push(`Item ${i} too heavy for cap ${w}, copy from above: ${dp[i][w]}`);
        steps.push({ type: 'skip', i, w, dp: dp.map(r => [...r]), cell: { row: i, col: w }, log: [...log] });
      }
    }
  }
  log.push(`Maximum value: ${dp[n][cap]}`);
  steps.push({ type: 'complete', dp: dp.map(r => [...r]), result: dp[n][cap], log: [...log] });
  return steps;
}
