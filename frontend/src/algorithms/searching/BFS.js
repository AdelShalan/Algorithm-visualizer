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
  const queue = [start];
  const log = [];
  visited.add(start);
  log.push(`BFS starting from node ${start}`);
  log.push(`Enqueue ${start} — queue: [${queue.join(', ')}]`);
  steps.push({ type: 'visit', node: start, visited: new Set(visited), queue: [...queue], log: [...log] });
  while (queue.length > 0) {
    const current = queue.shift();
    log.push(`Dequeue ${current}`);
    const neighbors = g.edges.filter(e => e.from === current || e.to === current).map(e => e.from === current ? e.to : e.from);
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
        log.push(`Exploring edge ${current} → ${neighbor} — enqueue ${neighbor}`);
        steps.push({ type: 'explore', from: current, to: neighbor, visited: new Set(visited), queue: [...queue], log: [...log] });
      }
    }
  }
  log.push(`BFS complete — visited ${visited.size} nodes ✓`);
  steps.push({ type: 'complete', visited: new Set(visited), log: [...log] });
  return steps;
}
