const NODE_COUNT = 12;
const CANVAS_SIZE = 400;

export function generateGraph() {
  const nodes = []; const edges = []; const positions = [];
  for (let i = 0; i < NODE_COUNT; i++) {
    const angle = (2 * Math.PI * i) / NODE_COUNT;
    const radius = 120 + Math.random() * 27;
    positions.push({ x: CANVAS_SIZE / 2 + Math.cos(angle) * radius, y: CANVAS_SIZE / 2 + Math.sin(angle) * radius });
  }
  for (let i = 0; i < NODE_COUNT; i++) {
    const numEdges = Math.floor(Math.random() * 3) + 1;
    for (let j = 0; j < numEdges; j++) {
      let target = Math.floor(Math.random() * NODE_COUNT);
      if (target !== i && !edges.some(e => (e.from === i && e.to === target) || (e.from === target && e.to === i))) {
        edges.push({ from: i, to: target });
      }
    }
  }
  for (let i = 0; i < NODE_COUNT; i++) nodes.push({ id: i, x: positions[i].x, y: positions[i].y });
  return { nodes, edges };
}

export function generateSteps(g, start) {
  const steps = [];
  const visited = new Set();
  const log = [];
  const stack = [];
  function dfs(node) {
    visited.add(node);
    stack.push(`dfs(${node})`);
    log.push(`Visiting node ${node}`);
    steps.push({ type: 'visit', node, visited: new Set(visited), log: [...log], stack: [...stack] });
    const neighbors = g.edges.filter(e => e.from === node || e.to === node).map(e => e.from === node ? e.to : e.from);
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        log.push(`Exploring edge ${node} → ${neighbor}`);
        steps.push({ type: 'explore', from: node, to: neighbor, visited: new Set(visited), log: [...log], stack: [...stack] });
        dfs(neighbor);
        log.push(`Backtracking from ${neighbor} to ${node}`);
        steps.push({ type: 'backtrack', from: neighbor, to: node, visited: new Set(visited), log: [...log], stack: [...stack] });
      }
    }
    stack.pop();
  }
  log.push(`DFS starting from node ${start}`);
  dfs(start);
  log.push(`DFS complete — visited ${visited.size} nodes ✓`);
  steps.push({ type: 'complete', visited: new Set(visited), log: [...log], stack: [] });
  return steps;
}
