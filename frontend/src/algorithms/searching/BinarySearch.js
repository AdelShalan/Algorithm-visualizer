export function generateSortedArray(size, min, max) {
  const arr = [];
  for (let i = 0; i < size; i++) {
    arr.push(min + Math.floor((max - min) * (i / size)) + Math.floor(Math.random() * 5));
  }
  return [...new Set(arr)].slice(0, size);
}

export function generateSteps(arr, tgt) {
  const steps = [];
  const log = [];
  let low = 0, high = arr.length - 1;
  log.push(`Searching for ${tgt} in sorted array of ${arr.length} elements`);
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    log.push(`low=${low}, high=${high}, mid=${mid} → arr[${mid}] = ${arr[mid]}`);
    steps.push({ type: 'check-mid', low, high, mid, array: [...arr], found: arr[mid] === tgt, log: [...log] });
    if (arr[mid] === tgt) {
      log.push(`Target ${tgt} found at index ${mid} ✓`);
      steps.push({ type: 'found', index: mid, low, high, array: [...arr], log: [...log] });
      return steps;
    } else if (arr[mid] < tgt) {
      log.push(`${arr[mid]} < ${tgt} — searching right half [${mid + 1}, ${high}]`);
      low = mid + 1;
    } else {
      log.push(`${arr[mid]} > ${tgt} — searching left half [${low}, ${mid - 1}]`);
      high = mid - 1;
    }
  }
  log.push(`Target ${tgt} not found in array`);
  steps.push({ type: 'not-found', low, high, array: [...arr], log: [...log] });
  return steps;
}
