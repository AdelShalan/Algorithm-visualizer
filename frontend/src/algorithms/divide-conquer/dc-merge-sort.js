export function generateSteps(arr) {
  const steps = [];
  const log = [];
  const a = [...arr];
  function merge(left, mid, right) {
    const leftArr = a.slice(left, mid + 1);
    const rightArr = a.slice(mid + 1, right + 1);
    let i = 0, j = 0, k = left;
    log.push(`Merge [${left}..${mid}] and [${mid+1}..${right}]`);
    steps.push({ type: 'merge-start', range: [left, right], array: [...a], log: [...log] });
    while (i < leftArr.length && j < rightArr.length) {
      if (leftArr[i] <= rightArr[j]) { a[k] = leftArr[i]; i++; }
      else { a[k] = rightArr[j]; j++; }
      log.push(`Place ${a[k]} at index ${k}`);
      steps.push({ type: 'merge-element', index: k, array: [...a], log: [...log] });
      k++;
    }
    while (i < leftArr.length) { a[k] = leftArr[i]; log.push(`Copy ${a[k]} at index ${k}`); steps.push({ type: 'merge-element', index: k, array: [...a], log: [...log] }); i++; k++; }
    while (j < rightArr.length) { a[k] = rightArr[j]; log.push(`Copy ${a[k]} at index ${k}`); steps.push({ type: 'merge-element', index: k, array: [...a], log: [...log] }); j++; k++; }
  }
  function sort(left, right) {
    if (left < right) {
      const mid = Math.floor((left + right) / 2);
      log.push(`Split [${left}..${right}] at ${mid}`);
      steps.push({ type: 'split', range: [left, right], mid, array: [...a], log: [...log] });
      sort(left, mid); sort(mid + 1, right); merge(left, mid, right);
    }
  }
  sort(0, a.length - 1);
  log.push('Sort complete');
  steps.push({ type: 'complete', array: [...a], log: [...log] });
  return steps;
}
