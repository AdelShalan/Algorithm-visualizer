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

export default function Dijkstra() {
  const { startAnimation, setGenerator, resetAnimation } = useAlgorithm();
  const [graph, setGraph] = useState(generateWeightedGraph);
  const [source, setSource] = useState(0);

  const generateSteps = useCallback((g, src) => {
    const steps = [];
    const dist = Array(g.nodes.length).fill(Infinity);
    const prev = Array(g.nodes.length).fill(null);
    const visited = new Set();
    const log = [];
    dist[src] = 0;
    log.push(`Initialize: dist[${src}] = 0, all others = ∞`);
    steps.push({ type: 'init', dist: [...dist], prev: [...prev], visited: new Set(visited), current: src, log: [...log] });
    while (visited.size < g.nodes.length) {
      let u = -1, minDist = Infinity;
      for (let i = 0; i < g.nodes.length; i++) {
        if (!visited.has(i) && dist[i] < minDist) { minDist = dist[i]; u = i; }
      }
      if (u === -1) break;
      visited.add(u);
      log.push(`Select node ${u} (min dist = ${dist[u]})`);
      steps.push({ type: 'visit', dist: [...dist], prev: [...prev], visited: new Set(visited), current: u, log: [...log] });
      const neighbors = g.edges.filter(e => e.from === u || e.to === u);
      for (const edge of neighbors) {
        const v = edge.from === u ? edge.to : edge.from;
        if (!visited.has(v)) {
          const alt = dist[u] + edge.weight;
          log.push(`Relax edge ${u} → ${v}: ${dist[u]} + ${edge.weight} = ${alt} vs ${dist[v] === Infinity ? '∞' : dist[v]}`);
          steps.push({ type: 'relax', from: u, to: v, weight: edge.weight, newDist: alt, oldDist: dist[v], dist: [...dist], prev: [...prev], visited: new Set(visited), current: u, log: [...log] });
          if (alt < dist[v]) { dist[v] = alt; prev[v] = u; log.push(`Updated dist[${v}] = ${alt}`); steps.push({ type: 'update', dist: [...dist], prev: [...prev], visited: new Set(visited), current: u, updated: v, log: [...log] }); }
        }
      }
    }
    log.push(`Dijkstra complete ✓`);
    steps.push({ type: 'complete', dist: [...dist], prev: [...prev], visited: new Set(visited), log: [...log] });
    return steps;
  }, []);

  const handleRun = useCallback(() => { startAnimation(generateSteps(graph, source)); }, [graph, source, generateSteps, startAnimation]);
  useEffect(() => { setGenerator(handleRun); }, [handleRun, setGenerator]);
  const handleNewGraph = useCallback(() => { resetAnimation(); setGraph(generateWeightedGraph()); setSource(0); }, [resetAnimation]);

  const { currentStep, steps } = useAlgorithm();
  const defaultDist = Array(NODE_COUNT).fill(Infinity);
  const defaultPrev = Array(NODE_COUNT).fill(null);
  const currentData = steps?.[currentStep] || { type: 'idle', dist: defaultDist, prev: defaultPrev, visited: new Set(), log: [] };
  const dist = currentData.dist || defaultDist;
  const prev = currentData.prev || defaultPrev;
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
            <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '.8125rem', color: 'var(--ink2)' }}>Source:</span>
            <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '1rem', fontWeight: 500, color: 'var(--purple)' }}>{source}</span>
          </div>
          <div style={{ flex: 1 }} />
          <button onClick={handleNewGraph} style={{ padding: '.3rem .75rem', fontSize: '.6875rem', borderRadius: '5px', border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer', color: 'var(--ink2)', fontFamily: 'Instrument Sans, sans-serif' }}>New Graph</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '1.25rem', flex: 1, minHeight: 0 }}>
        <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '10px', padding: '1.25rem', display: 'flex', gap: '1.5rem', overflow: 'hidden' }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox={`0 0 ${CANVAS_SIZE} ${CANVAS_SIZE}`} style={{ width: '100%', height: '100%' }}>
              {graph.edges.map((edge, i) => {
                const from = graph.nodes[edge.from]; const to = graph.nodes[edge.to];
                const isShortest = currentData.type === 'complete' && (prev[edge.to] === edge.from || prev[edge.from] === edge.to);
                const isRelaxing = currentData.type === 'relax' && ((currentData.from === edge.from && currentData.to === edge.to) || (currentData.from === edge.to && currentData.to === edge.from));
                const isVisited = currentData.visited?.has(edge.from) && currentData.visited?.has(edge.to);
                return (
                  <g key={i}>
                    <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={isShortest ? '#22c55e' : isRelaxing ? 'var(--amber)' : isVisited ? 'var(--purple)' : 'var(--border)'} strokeWidth={isShortest || isRelaxing ? 2 : 1} style={{ transition: 'all 0.3s' }} />
                    <text x={(from.x + to.x) / 2} y={(from.y + to.y) / 2 - 3} textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="7" fill={isRelaxing ? 'var(--amber)' : 'var(--muted)'} style={{ pointerEvents: 'none' }}>{edge.weight}</text>
                  </g>
                );
              })}
              {graph.nodes.map(node => {
                const isVisited = currentData.visited?.has(node.id);
                const isCurrent = currentData.current === node.id;
                const isSource = node.id === source;
                const isComplete = currentData.type === 'complete';
                const fill = isComplete && isVisited ? 'var(--purple)' : isCurrent ? 'var(--amber)' : isSource ? '#a78bfa' : 'var(--white)';
                return (
                  <g key={node.id}>
                    <circle cx={node.x} cy={node.y} r={15} fill={fill} stroke={isSource ? '#a78bfa' : 'var(--border)'} strokeWidth={isSource ? 2 : 1} style={{ transition: 'all 0.3s' }} />
                    <text x={node.x} y={node.y} textAnchor="middle" dominantBaseline="central" fontFamily="IBM Plex Mono, monospace" fontSize="8" fontWeight="500" fill={isVisited || isSource ? '#fff' : 'var(--ink2)'} style={{ pointerEvents: 'none' }}>{node.id}</text>
                    {dist[node.id] !== Infinity && <text x={node.x} y={node.y + 22} textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="7" fill={isComplete ? '#16a34a' : 'var(--muted)'} style={{ pointerEvents: 'none' }}>d={dist[node.id]}</text>}
                  </g>
                );
              })}
            </svg>
          </div>

          <div style={{ width: 180, display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto' }}>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '.8125rem', color: 'var(--ink)', marginBottom: '.5rem' }}>Distances</div>
            {dist.map((d, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '.375rem .5rem', borderRadius: '6px', background: 'var(--bg)' }}>
                <span style={{ fontSize: '.75rem', color: 'var(--ink2)' }}>Node {i}</span>
                <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '.75rem', fontWeight: 500, color: d === Infinity ? 'var(--muted)' : 'var(--purple)' }}>{d === Infinity ? '∞' : d}</span>
              </div>
            ))}
          </div>
        </div>

        {currentData.log && (
          <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '10px', padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '.5625rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '.5rem', flexShrink: 0 }}>Execution trace</div>
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
