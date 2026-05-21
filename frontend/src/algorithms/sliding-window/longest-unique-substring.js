export function generateSteps(txt) {
  const steps = []; const log = []; const seen = {}; let left = 0; let maxLen = 0; let maxStart = 0;
  log.push('Initialize: left=0, maxLen=0');
  steps.push({ type: 'init', text: txt, left, right: 0, seen: {}, maxLen, window: '', log: [...log] });
  for (let right = 0; right < txt.length; right++) {
    const ch = txt[right];
    log.push(`Expand: add '${ch}' at ${right}`);
    steps.push({ type: 'expand', right, ch, text: txt, left, seen: { ...seen }, maxLen, window: txt.slice(left, right + 1), log: [...log] });
    if (ch in seen && seen[ch] >= left) { log.push(`Duplicate '${ch}' at ${seen[ch]}, shrink left to ${seen[ch] + 1}`); steps.push({ type: 'duplicate', right, ch, prevIdx: seen[ch], text: txt, left, seen: { ...seen }, maxLen, log: [...log] }); left = seen[ch] + 1; steps.push({ type: 'shrink', right, ch, left, text: txt, seen: { ...seen }, maxLen, window: txt.slice(left, right + 1), log: [...log] }); }
    seen[ch] = right; const currentLen = right - left + 1;
    steps.push({ type: 'update', right, left, text: txt, seen: { ...seen }, maxLen: Math.max(maxLen, currentLen), window: txt.slice(left, right + 1), log: [...log] });
    if (currentLen > maxLen) { maxLen = currentLen; maxStart = left; log.push(`New max: "${txt.slice(maxStart, maxStart + maxLen)}" (${maxLen} chars)`); steps.push({ type: 'new-max', right, left, maxLen, text: txt, window: txt.slice(left, right + 1), log: [...log] }); }
  }
  log.push(`Result: "${txt.slice(maxStart, maxStart + maxLen)}" (${maxLen} chars)`);
  steps.push({ type: 'complete', maxLen, maxStart, result: txt.slice(maxStart, maxStart + maxLen), log: [...log] });
  return steps;
}
