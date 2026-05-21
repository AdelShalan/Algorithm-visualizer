export function generateSteps(num) {
  const steps = [];
  const log = [];
  const memo = {};
  function fib(i, depth = 0) {
    log.push(`${'  '.repeat(depth)}fib(${i}) called`);
    steps.push({ type: 'call', i, depth, inMemo: i in memo, memo: { ...memo }, log: [...log] });
    if (i in memo) { log.push(`${'  '.repeat(depth)}→ memo hit: ${memo[i]}`); steps.push({ type: 'memo-hit', i, depth, value: memo[i], memo: { ...memo }, log: [...log] }); return memo[i]; }
    if (i <= 1) { memo[i] = i; log.push(`${'  '.repeat(depth)}→ base case: ${i}`); steps.push({ type: 'base', i, depth, value: i, memo: { ...memo }, log: [...log] }); return i; }
    const result = fib(i - 1, depth + 1) + fib(i - 2, depth + 1);
    memo[i] = result;
    log.push(`${'  '.repeat(depth)}→ computed fib(${i}) = ${result}`);
    steps.push({ type: 'compute', i, depth, value: result, memo: { ...memo }, log: [...log] });
    return result;
  }
  const result = fib(num);
  log.push(`Result: fib(${num}) = ${result}`);
  steps.push({ type: 'complete', result, memo: { ...memo }, log: [...log] });
  return steps;
}
