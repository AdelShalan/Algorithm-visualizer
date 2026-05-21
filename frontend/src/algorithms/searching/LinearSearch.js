export function generateSteps(arr, tgt) {
  const steps = [];
  const log = [];
  log.push(`Searching for ${tgt} in array of ${arr.length} elements`);
  for (let i = 0; i < arr.length; i++) {
    log.push(`Checking arr[${i}] = ${arr[i]} — ${arr[i] === tgt ? 'found!' : 'not a match'}`);
    steps.push({ type: 'check', index: i, array: [...arr], found: arr[i] === tgt, log: [...log] });
    if (arr[i] === tgt) {
      log.push(`Target ${tgt} found at index ${i} ✓`);
      steps.push({ type: 'found', index: i, array: [...arr], log: [...log] });
      return steps;
    }
  }
  log.push(`Target ${tgt} not found in array`);
  steps.push({ type: 'not-found', array: [...arr], log: [...log] });
  return steps;
}
