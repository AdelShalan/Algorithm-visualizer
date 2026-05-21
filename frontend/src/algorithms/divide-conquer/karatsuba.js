export function generateSteps(x, y) {
  const steps = [];
  const log = [];
  function karatsuba(a, b, depth = 0) {
    const sa = a.toString(); const sb = b.toString();
    const n = Math.max(sa.length, sb.length);
    log.push(`${'  '.repeat(depth)}karatsuba(${a}, ${b})`);
    steps.push({ type: 'call', a, b, depth, n, log: [...log] });
    if (n <= 2) { const result = a * b; log.push(`${'  '.repeat(depth)}Base: ${a} × ${b} = ${result}`); steps.push({ type: 'base', a, b, result, depth, log: [...log] }); return result; }
    const m = Math.ceil(n / 2);
    const high1 = Math.floor(a / Math.pow(10, m)); const low1 = a % Math.pow(10, m);
    const high2 = Math.floor(b / Math.pow(10, m)); const low2 = b % Math.pow(10, m);
    log.push(`${'  '.repeat(depth)}Split: ${a}→(${high1},${low1}), ${b}→(${high2},${low2})`);
    steps.push({ type: 'split', a, b, high1, low1, high2, low2, m, depth, log: [...log] });
    const z0 = karatsuba(low1, low2, depth + 1);
    const z1 = karatsuba(low1 + high1, low2 + high2, depth + 1);
    const z2 = karatsuba(high1, high2, depth + 1);
    const result = z2 * Math.pow(10, 2 * m) + (z1 - z2 - z0) * Math.pow(10, m) + z0;
    log.push(`${'  '.repeat(depth)}Combine: z0=${z0}, z1=${z1}, z2=${z2} → ${result}`);
    steps.push({ type: 'combine', z0, z1, z2, result, depth, log: [...log] });
    return result;
  }
  karatsuba(x, y);
  log.push(`Result: ${x * y}`);
  steps.push({ type: 'complete', result: x * y, log: [...log] });
  return steps;
}
