export function generateSteps(a, b) {
  const steps = [];
  const log = [];
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, (_, i) => Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)));
  log.push('Initialize DP table');
  steps.push({ type: 'init', dp: dp.map(r => [...r]), log: [...log] });
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      steps.push({ type: 'check', i, j, dp: dp.map(r => [...r]), cell: { row: i, col: j }, log: [...log] });
      if (a[i - 1] === b[j - 1]) { dp[i][j] = dp[i - 1][j - 1]; log.push(`'${a[i-1]}' === '${b[j-1]}' → match, dp[${i}][${j}] = ${dp[i][j]}`); steps.push({ type: 'match', i, j, char: a[i - 1], dp: dp.map(r => [...r]), cell: { row: i, col: j }, log: [...log] }); }
      else {
        const insert = dp[i][j - 1] + 1; const del = dp[i - 1][j] + 1; const replace = dp[i - 1][j - 1] + 1;
        dp[i][j] = Math.min(insert, del, replace);
        const op = dp[i][j] === insert ? 'insert' : dp[i][j] === del ? 'delete' : 'replace';
        log.push(`'${a[i-1]}' !== '${b[j-1]}' → ${op}, dp[${i}][${j}] = ${dp[i][j]}`);
        steps.push({ type: 'op', i, j, op, dp: dp.map(r => [...r]), cell: { row: i, col: j }, log: [...log] });
      }
    }
  }
  log.push(`Edit distance: ${dp[m][n]}`);
  steps.push({ type: 'complete', dp: dp.map(r => [...r]), result: dp[m][n], log: [...log] });
  return steps;
}
