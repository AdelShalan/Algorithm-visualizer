function dist(a, b) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

export function generateSteps(pts) {
  const steps = [];
  const log = [];
  const sorted = [...pts].sort((a, b) => a.x - b.x);
  function bruteForce(arr) {
    let minD = Infinity; let minPair = null;
    for (let i = 0; i < arr.length; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        const d = dist(arr[i], arr[j]);
        log.push(`Check (${arr[i].x.toFixed(0)},${arr[i].y.toFixed(0)})-(${arr[j].x.toFixed(0)},${arr[j].y.toFixed(0)}) = ${d.toFixed(2)}`);
        steps.push({ type: 'check', a: arr[i], b: arr[j], dist: d, points: pts, log: [...log] });
        if (d < minD) { minD = d; minPair = [arr[i], arr[j]]; log.push(`New min: ${d.toFixed(2)}`); steps.push({ type: 'new-min', a: arr[i], b: arr[j], dist: d, points: pts, log: [...log] }); }
      }
    }
    return { dist: minD, pair: minPair };
  }
  function closestPair(arr) {
    if (arr.length <= 3) return bruteForce(arr);
    const mid = Math.floor(arr.length / 2); const midPoint = arr[mid];
    log.push(`Split at x=${midPoint.x.toFixed(0)}`);
    steps.push({ type: 'split', midPoint, points: pts, log: [...log] });
    const left = closestPair(arr.slice(0, mid)); const right = closestPair(arr.slice(mid));
    let d = Math.min(left.dist, right.dist); let pair = left.dist < right.dist ? left.pair : right.pair;
    log.push(`Min of halves: ${d.toFixed(2)}`);
    steps.push({ type: 'min', dist: d, pair, points: pts, log: [...log] });
    const strip = arr.filter(p => Math.abs(p.x - midPoint.x) < d);
    strip.sort((a, b) => a.y - b.y);
    for (let i = 0; i < strip.length; i++) {
      for (let j = i + 1; j < strip.length && strip[j].y - strip[i].y < d; j++) {
        const newD = dist(strip[i], strip[j]);
        log.push(`Strip check: ${newD.toFixed(2)}`);
        steps.push({ type: 'strip-check', a: strip[i], b: strip[j], dist: newD, points: pts, log: [...log] });
        if (newD < d) { d = newD; pair = [strip[i], strip[j]]; log.push(`New strip min: ${d.toFixed(2)}`); steps.push({ type: 'strip-min', a: strip[i], b: strip[j], dist: d, points: pts, log: [...log] }); }
      }
    }
    return { dist: d, pair };
  }
  const result = closestPair(sorted);
  log.push(`Closest distance: ${result.dist.toFixed(2)}`);
  steps.push({ type: 'complete', dist: result.dist, pair: result.pair, points: pts, log: [...log] });
  return steps;
}
