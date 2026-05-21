export function generateSteps(a, t) {
  const steps = []; const log = []; let left = 0; let right = a.length - 1;
  log.push(`Initialize: left=0, right=${right}, target=${t}`);
  steps.push({ type: 'init', array: [...a], left, right, target: t, log: [...log] });
  while (left < right) {
    const sum = a[left] + a[right];
    log.push(`Check a[${left}]+a[${right}] = ${a[left]}+${a[right]} = ${sum}`);
    steps.push({ type: 'check', array: [...a], left, right, sum, target: t, log: [...log] });
    if (sum === t) { log.push(`Found: ${a[left]} + ${a[right]} = ${t}`); steps.push({ type: 'found', array: [...a], left, right, sum: t, log: [...log] }); return steps; }
    else if (sum < t) { log.push(`${sum} < ${t}, move left right`); steps.push({ type: 'too-small', array: [...a], left, right, sum, log: [...log] }); left++; }
    else { log.push(`${sum} > ${t}, move right left`); steps.push({ type: 'too-large', array: [...a], left, right, sum, log: [...log] }); right--; }
  }
  log.push('No pair found');
  steps.push({ type: 'not-found', array: [...a], log: [...log] });
  return steps;
}
