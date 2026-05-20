import { useState, useCallback, useEffect, useRef } from 'react';
import { useAlgorithm } from '../../contexts/AlgorithmContext';

const NODE_COUNT = 8;
const CANVAS_SIZE = 400;

function generateWeightedGraph() {
  const nodes = []; const edges = []; const positions = [];
  for (let i = 0; i < NODE_COUNT; i++) {
    const angle = (2 * Math.PI * i) / NODE_COUNT;
    const radius = 120 + Math.random() * 27;
    positions.push({ x: CANVAS_SIZE / 2 + Math.cos(angle) * radius, y: CANVAS_SIZE / 2 + Math.sin(angle) * radius });
  }
  for (let i = 0; i < NODE_COUNT; i++) nodes.push({ id: i, x: positions[i].x, y: positions[i].y });
  for (let i = 0; i < NODE_COUNT; i++) {
    for (let j = i + 1; j < NODE_COUNT; j++) {
      if (Math.random() < 0.4) edges.push({ from: i, to: j, weight: Math.floor(Math.random() * 15) + 1 });
    }
  }
  if (edges.length < NODE_COUNT - 1) {
    for (let i = 0; i < NODE_COUNT - 1; i++) {
      if (!edges.some(e => (e.from === i && e.to === i + 1) || (e.from === i + 1 && e.to === i))) {
        edges.push({ from: i, to: i + 1, weight: Math.floor(Math.random() * 10) + 1 });
      }
    }
  }
  return { nodes, edges };
}

export default function AStar() {
  const { startAnimation, setGenerator, resetAnimation } = useAlgorithm();
  const [graph, setGraph] = useState(generateWeightedGraph);
  const [source, setSource] = useState(0);
  const [target, setTarget] = useState(7);

  const heuristic = (a, b) => {
    const na = graph.nodes[a], nb = graph.nodes[b];
    return Math.sqrt((na.x - nb.x) ** 2 + (na.y - nb.y) ** 2);
  };

  const generateSteps = useCallback((g, src, tgt) => {
    const steps = [];
    const log = [];
    const openSet = [{ row: src, col: src, g: 0, h: heuristic(src, tgt), f: heuristic(src, tgt) }];
    const cameFrom = {};
    const gScore = {};
    gScore[src] = 0;
    const closedSet = new Set();
    log.push(`A* starting from ${src} → ${tgt}`);
    steps.push({ type: 'init', openSet: [...openSet], closedSet: new Set(closedSet), path: [], log: [...log] });
    while (openSet.length > 0) {
      openSet.sort((a, b) => a.f - b.f);
      const current = openSet.shift();
      const key = current.row;
      closedSet.add(key);
      log.push(`Visit node ${key} (g=${current.g.toFixed(0)}, h=${current.h.toFixed(0)}, f=${current.f.toFixed(0)})`);
      steps.push({ type: 'visit', current, openSet: [...openSet], closedSet: new Set(closedSet), path: [], log: [...log] });
      if (current.row === tgt) {
        const path = []; let curr = key;
        while (curr !== undefined) { path.unshift(curr); curr = cameFrom[curr]; }
        log.push(`Path found: ${path.join(' → ')} ✓`);
        steps.push({ type: 'found', path, closedSet: new Set(closedSet), log: [...log] });
        return steps;
      }
      const neighbors = g.edges.filter(e => e.from === current.row || e.to === current.row).map(e => e.from === current.row ? e.to : e.from);
      for (const neighbor of neighbors) {
        const nKey = neighbor;
        if (!closedSet.has(nKey)) {
          const tentativeG = gScore[key] + heuristic(current.row, neighbor);
          if (tentativeG < (gScore[nKey] ?? Infinity)) {
            cameFrom[nKey] = key; gScore[nKey] = tentativeG;
            const h = heuristic(neighbor, tgt); const f = tentativeG + h;
            const existing = openSet.find(n => n.row === neighbor);
            if (!existing) openSet.push({ row: neighbor, col: neighbor, g: tentativeG, h, f });
            log.push(`Explore ${key} → ${neighbor} (g=${tentativeG.toFixed(0)})`);
            steps.push({ type: 'explore', from: { row: current.row, col: current.row }, to: { row: neighbor, col: neighbor }, openSet: [...openSet], closedSet: new Set(closedSet), path: [], log: [...log] });
          }
        }
      }
    }
    log.push(`No path found`);
    steps.push({ type: 'not-found', closedSet: new Set(closedSet), log: [...log] });
    return steps;
  }, [graph]);

  const handleRun = useCallback(() => { startAnimation(generateSteps(graph, source, target)); }, [graph, source, target, generateSteps, startAnimation]);
  useEffect(() => { setGenerator(handleRun); }, [handleRun, setGenerator]);
  const handleNewGraph = useCallback(() => { resetAnimation(); setGraph(generateWeightedGraph()); setSource(0); setTarget(NODE_COUNT - 1); }, [resetAnimation]);

  const { currentStep, steps } = useAlgorithm();
  const currentData = steps?.[currentStep] || { type: 'idle', closedSet: new Set(), openSet: [], path: [], log: [] };
  const logRef = useRef(null);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [currentData.log]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '10px', padding: '1rem 1.25rem' }}>
        <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '.5625rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '.75rem' }}>Graph</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
            <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '.8125rem', color: 'var(--ink2)' }}>Start:</span>
            <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '1rem', fontWeight: 500, color: 'var(--purple)' }}>{source}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
            <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '.8125rem', color: 'var(--ink2)' }}>End:</span>
            <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '1rem', fontWeight: 500, color: 'var(--purple)' }}>{target}</span>
          </div>
          <div style={{ flex: 1 }} />
          <button onClick={handleNewGraph} style={{ padding: '.3rem .75rem', fontSize: '.6875rem', borderRadius: '5px', border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer', color: 'var(--ink2)', fontFamily: 'Instrument Sans, sans-serif' }}>New Graph</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '1.25rem', flex: 1, minHeight: 0 }}>
        <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '10px', padding: '1.25rem', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '.5625rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '1rem', flexShrink: 0 }}>A* pathfinding</div>
          <div style={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox={`0 0 ${CANVAS_SIZE} ${CANVAS_SIZE}`} style={{ width: '100%', height: '100%' }}>
              {graph.edges.map((edge, i) => {
                const from = graph.nodes[edge.from]; const to = graph.nodes[edge.to];
                const isPath = currentData.path?.includes(edge.from) && currentData.path?.includes(edge.to);
                const isExplored = currentData.type === 'explore' && ((currentData.from === edge.from && currentData.to === edge.to) || (currentData.from === edge.to && currentData.to === edge.from));
                const isVisited = currentData.closedSet?.has(edge.from) && currentData.closedSet?.has(edge.to);
                return (
                  <g key={i}>
                    <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={isPath ? '#22c55e' : isExplored ? 'var(--amber)' : isVisited ? 'var(--purple)' : 'var(--border)'} strokeWidth={isPath || isExplored ? 2 : 1} style={{ transition: 'all 0.3s' }} />
                    <text x={(from.x + to.x) / 2} y={(from.y + to.y) / 2 - 3} textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="7" fill={isExplored ? 'var(--amber)' : 'var(--muted)'} style={{ pointerEvents: 'none' }}>{edge.weight}</text>
                  </g>
                );
              })}
              {graph.nodes.map(node => {
                const isVisited = currentData.closedSet?.has(node.id);
                const isCurrent = currentData.current?.row === node.id;
                const isSource = node.id === source;
                const isTarget = node.id === target;
                const isPath = currentData.path?.includes(node.id);
                const fill = isPath ? '#22c55e' : isTarget ? '#fca5a5' : isCurrent ? 'var(--amber)' : isSource ? '#a78bfa' : isVisited ? 'var(--purple)' : 'var(--white)';
                return (
                  <g key={node.id}>
                    <circle cx={node.x} cy={node.y} r={15} fill={fill} stroke={isSource || isTarget ? (isSource ? '#a78bfa' : '#fca5a5') : 'var(--border)'} strokeWidth={isSource || isTarget ? 2 : 1} style={{ transition: 'all 0.3s' }} />
                    <text x={node.x} y={node.y} textAnchor="middle" dominantBaseline="central" fontFamily="IBM Plex Mono, monospace" fontSize="8" fontWeight="500" fill={(isVisited || isSource || isTarget || isPath) ? '#fff' : 'var(--ink2)'} style={{ pointerEvents: 'none' }}>{node.id}</text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {currentData.log && (
          <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '10px', padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '.5625rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '.5rem', flexShrink: 0 }}>Pathfinding log</div>
            <div ref={logRef} style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '3px' }}>
              {currentData.log.map((entry, i) => {
                const isLast = i === currentData.log.length - 1;
                return (
                  <div key={i} style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '.625rem', padding: '.3rem .5rem', borderRadius: '4px', color: isLast ? 'var(--purple)' : 'var(--muted)', background: isLast ? 'var(--purple-light)' : 'transparent', fontWeight: isLast ? 500 : 400 }}>{entry}</div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
