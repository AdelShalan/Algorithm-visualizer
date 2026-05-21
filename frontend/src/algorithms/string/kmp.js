export function generateSteps(txt, pat) {
  const steps = [];
  const log = [];
  const m = pat.length;
  const lps = Array(m).fill(0);
  log.push('Building LPS array');
  steps.push({ type: 'build-lps', lps: [...lps], index: 0, log: [...log] });
  let len = 0; let i = 1;
  while (i < m) {
    steps.push({ type: 'lps-compare', i, len, lps: [...lps], log: [...log] });
    if (pat[i] === pat[len]) { len++; lps[i] = len; log.push(`lps[${i}] = ${len}`); steps.push({ type: 'lps-set', i, len, lps: [...lps], log: [...log] }); i++; }
    else { if (len !== 0) { len = lps[len - 1]; log.push(`lps mismatch, len = ${len}`); } else { lps[i] = 0; log.push(`lps[${i}] = 0`); i++; } }
  }
  log.push(`LPS: [${lps.join(',')}]`);
  steps.push({ type: 'lps-done', lps: [...lps], log: [...log] });
  let j = 0; i = 0;
  while (i < txt.length) {
    log.push(`Compare text[${i}]='${txt[i]}' with pat[${j}]='${pat[j]}'`);
    steps.push({ type: 'compare', textIdx: i, patIdx: j, lps: [...lps], log: [...log] });
    if (pat[j] === txt[i]) { j++; i++; }
    if (j === m) { log.push(`Match found at index ${i - m}!`); steps.push({ type: 'match', textIdx: i - m, lps: [...lps], log: [...log] }); j = lps[j - 1]; }
    else if (i < txt.length && pat[j] !== txt[i]) { if (j !== 0) { j = lps[j - 1]; log.push(`Shift pattern, j = ${j}`); steps.push({ type: 'shift', textIdx: i, patIdx: j, lps: [...lps], log: [...log] }); } else { i++; } }
  }
  log.push('Search complete');
  steps.push({ type: 'done', log: [...log] });
  return steps;
}
