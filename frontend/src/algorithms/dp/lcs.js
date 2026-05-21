export function generateSteps(a, b) {
  const steps = [];
  const log = [];
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  log.push('Initialize DP table');
  steps.push({ type: 'init', dp: dp.map(r => [...r]), cell: null, log: [...log] });
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      steps.push({ type: 'check', i, j, dp: dp.map(r => [...r]), cell: { row: i, col: j }, log: [...log] });
      if (a[i - 1] === b[j - 1]) { dp[i][j] = dp[i - 1][j - 1] + 1; log.push(`'${a[i-1]}' === '${b[j-1]}' → match, dp[${i}][${j}] = ${dp[i][j]}`); steps.push({ type: 'match', i, j, char: a[i - 1], dp: dp.map(r => [...r]), cell: { row: i, col: j }, log: [...log] }); }
      else { dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]); log.push(`'${a[i-1]}' !== '${b[j-1]}' → max(${dp[i-1][j]}, ${dp[i][j-1]}) = ${dp[i][j]}`); steps.push({ type: 'max', i, j, dp: dp.map(r => [...r]), cell: { row: i, col: j }, log: [...log] }); }
    }
  }
  const lcs = [];
  let i = m, j = n;
  while (i > 0 && j > 0) {
    if (a[i - 1] === b[j - 1]) { lcs.unshift(a[i - 1]); log.push(`Backtrack: '${a[i-1]}' matched`); steps.push({ type: 'backtrack', i, j, char: a[i - 1], lcs: [...lcs], dp: dp.map(r => [...r]), log: [...log] }); i--; j--; }
    else if (dp[i - 1][j] > dp[i][j - 1]) i--;
    else j--;
  }
  log.push(`LCS: "${lcs.join('')}"`);
  steps.push({ type: 'complete', dp: dp.map(r => [...r]), lcs: lcs.join(''), log: [...log] });
  return steps;
}
