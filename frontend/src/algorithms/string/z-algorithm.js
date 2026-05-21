export function generateSteps(txt, pat) {
  const steps = [];
  const log = [];
  const concat = pat + '$' + txt; const n = concat.length;
  const z = Array(n).fill(0); let l = 0, r = 0;
  log.push(`Concatenated: "${concat}"`);
  steps.push({ type: 'init', concat, z: [...z], l, r, log: [...log] });
  for (let i = 1; i < n; i++) {
    log.push(`Compute Z[${i}]`);
    steps.push({ type: 'compute', i, concat, z: [...z], l, r, log: [...log] });
    if (i < r) { z[i] = Math.min(r - i, z[i - l]); log.push(`In Z-box: z[${i}] = ${z[i]}`); steps.push({ type: 'z-box', i, z: z[i], concat, zArr: [...z], l, r, log: [...log] }); }
    while (i + z[i] < n && concat[z[i]] === concat[i + z[i]]) { z[i]++; log.push(`Match at z[${i}] = ${z[i]}`); steps.push({ type: 'match-char', i, z: z[i], concat, zArr: [...z], l, r, log: [...log] }); }
    if (i + z[i] > r) { l = i; r = i + z[i]; log.push(`Update Z-box: l=${l}, r=${r}`); steps.push({ type: 'update-box', i, l, r, concat, zArr: [...z], log: [...log] }); }
    if (z[i] === pat.length) { log.push(`Match at text position ${i - pat.length - 1}`); steps.push({ type: 'match', pos: i - pat.length - 1, z: [...z], log: [...log] }); }
  }
  log.push(`Z-array: [${z.join(',')}]`);
  steps.push({ type: 'done', z: [...z], log: [...log] });
  return steps;
}
