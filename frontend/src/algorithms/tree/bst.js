export class TreeNode {
  constructor(val) { this.val = val; this.left = null; this.right = null; }
}

export function generateSearchSteps(root, target) {
  const steps = [];
  const log = [];
  function search(n) {
    if (!n) { log.push(`Not found: ${target}`); steps.push({ type: 'not-found', target, log: [...log] }); return; }
    log.push(`Visit node ${n.val}`);
    steps.push({ type: 'visit', node: n.val, target, log: [...log] });
    if (n.val === target) { log.push(`Found ${target}!`); steps.push({ type: 'found', node: n.val, log: [...log] }); }
    else if (target < n.val) { log.push(`${target} < ${n.val}, go left`); search(n.left); }
    else { log.push(`${target} > ${n.val}, go right`); search(n.right); }
  }
  search(root);
  return steps;
}
