const PRIME = 101;
const BASE = 256;

export function generateSteps(txt, pat) {
  const steps = [];
  const log = [];
  const m = pat.length; const n = txt.length;
  let hashPat = 0; let hashTxt = 0; let h = 1;
  for (let i = 0; i < m - 1; i++) h = (h * BASE) % PRIME;
  for (let i = 0; i < m; i++) { hashPat = (BASE * hashPat + pat.charCodeAt(i)) % PRIME; hashTxt = (BASE * hashTxt + txt.charCodeAt(i)) % PRIME; }
  log.push(`Pattern hash: ${hashPat}, Initial window hash: ${hashTxt}`);
  steps.push({ type: 'init', hashPat, hashTxt, textHash: hashTxt, log: [...log] });
  for (let i = 0; i <= n - m; i++) {
    log.push(`Slide window to index ${i}, hash=${hashTxt}`);
    steps.push({ type: 'slide', start: i, hashPat, hashTxt, textHash: hashTxt, log: [...log] });
    if (hashPat === hashTxt) {
      let match = true;
      for (let j = 0; j < m; j++) {
        steps.push({ type: 'verify', start: i, j, hashPat, hashTxt, log: [...log] });
        if (txt[i + j] !== pat[j]) { match = false; log.push(`Hash match but char mismatch at ${j}`); steps.push({ type: 'hash-collision', start: i, j, hashPat, hashTxt, log: [...log] }); break; }
      }
      if (match) { log.push(`Match found at index ${i}!`); steps.push({ type: 'match', start: i, hashPat, hashTxt, log: [...log] }); }
    }
    if (i < n - m) { hashTxt = (BASE * (hashTxt - txt.charCodeAt(i) * h) + txt.charCodeAt(i + m)) % PRIME; if (hashTxt < 0) hashTxt += PRIME; log.push(`Rehash to index ${i + 1}: ${hashTxt}`); steps.push({ type: 'rehash', start: i + 1, hashPat, hashTxt, log: [...log] }); }
  }
  log.push('Search complete');
  steps.push({ type: 'done', log: [...log] });
  return steps;
}
