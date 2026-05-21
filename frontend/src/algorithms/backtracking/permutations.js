export function generateSteps(size) {
  const steps = [];
  const log = [];
  const arr = Array.from({ length: size }, (_, i) => i + 1);
  const perms = [];
  function generate(current, remaining) {
    log.push(`Build: [${current.join(',')}] remaining: [${remaining.join(',')}]`);
    steps.push({ type: 'build', current: [...current], remaining: [...remaining], perms: [...perms], log: [...log] });
    if (remaining.length === 0) { perms.push([...current]); log.push(`Found permutation: [${current.join(',')}]`); steps.push({ type: 'complete-perm', perm: [...current], perms: [...perms], log: [...log] }); return; }
    for (let i = 0; i < remaining.length; i++) {
      const next = [...current, remaining[i]];
      const rest = [...remaining.slice(0, i), ...remaining.slice(i + 1)];
      log.push(`Pick ${remaining[i]}`);
      generate(next, rest);
      log.push(`Backtrack, restore [${remaining.join(',')}]`);
      steps.push({ type: 'backtrack', current: [...current], remaining: [...remaining], perms: [...perms], log: [...log] });
    }
  }
  generate([], arr);
  log.push(`Done: ${perms.length} permutations`);
  steps.push({ type: 'done', perms: [...perms], log: [...log] });
  return steps;
}
