import { useState, useCallback, useEffect, useRef } from 'react';
import { useAlgorithm } from '../../contexts/AlgorithmContext';

const NODE_COUNT = 6;
const CANVAS_SIZE = 400;

function generateWeightedGraph() {
  const nodes = []; const edges = []; const positions = [];
  for (let i = 0; i < NODE_COUNT; i++) {
    const angle = (2 * Math.PI * i) / NODE_COUNT;
    positions.push({ x: CANVAS_SIZE / 2 + Math.cos(angle) * 120, y: CANVAS_SIZE / 2 + Math.sin(angle) * 120 });
  }
  for (let i = 0; i < NODE_COUNT; i++) nodes.push({ id: i, x: positions[i].x, y: positions[i].y });
  for (let i = 0; i < NODE_COUNT; i++) {
    for (let j = i + 1; j < NODE_COUNT; j++) {
      if (Math.random() < 0.5) edges.push({ from: i, to: j, weight: Math.floor(Math.random() * 10) - 3 });
    }
  }
  for (let i = 0; i < NODE_COUNT - 1; i++) {
    if (!edges.some(e => (e.from === i && e.to === i + 1))) edges.push({ from: i, to: i + 1, weight: Math.floor(Math.random() * 8) + 1 });
  }
  return { nodes, edges };
}

export default function BellmanFord() {
  const { startAnimation, setGenerator, resetAnimation } = useAlgorithm();
  const [graph, setGraph] = useState(generateWeightedGraph);
  const [source, setSource] = useState(0);

  const generateSteps = useCallback((g, src) => {
    const steps = [];
    const dist = Array(g.nodes.length).fill(Infinity);
    dist[src] = 0;
    const log = [];
    log.push(`Initialize: dist[${src}] = 0, all others = ∞`);
    steps.push({ type: 'init', dist: [...dist], log: [...log] });
    for (let i = 0; i < g.nodes.length - 1; i++) {
      log.push(`Iteration ${i + 1} / ${g.nodes.length - 1} — relaxing all edges`);
      steps.push({ type: 'iteration', iteration: i + 1, dist: [...dist], log: [...log] });
      for (const edge of g.edges) {
        const { from, to, weight } = edge;
        if (dist[from] !== Infinity && dist[from] + weight < dist[to]) {
          log.push(`Relax edge ${from} → ${to}: ${dist[from]} + (${weight}) = ${dist[from] + weight} < ${dist[to] === Infinity ? '∞' : dist[to]}`);
          steps.push({ type: 'relax', from, to, weight, newDist: dist[from] + weight, dist: [...dist], log: [...log] });
          dist[to] = dist[from] + weight;
          log.push(`Updated dist[${to}] = ${dist[to]}`);
          steps.push({ type: 'update', dist: [...dist], updated: to, log: [...log] });
        }
      }
    }
    for (const edge of g.edges) {
      if (dist[edge.from] !== Infinity && dist[edge.from] + edge.weight < dist[edge.to]) {
        log.push(`Negative cycle detected on edge ${edge.from} → ${edge.to}`);
        steps.push({ type: 'negative-cycle', from: edge.from, to: edge.to, dist: [...dist], log: [...log] });
        return steps;
      }
    }
    log.push(`Bellman-Ford complete ✓`);
    steps.push({ type: 'complete', dist: [...dist], log: [...log] });
    return steps;
  }, []);

  const handleRun = useCallback(() => { startAnimation(generateSteps(graph, source)); }, [graph, source, generateSteps, startAnimation]);
  useEffect(() => { setGenerator(handleRun); }, [handleRun, setGenerator]);
  const handleNewGraph = useCallback(() => { resetAnimation(); setGraph(generateWeightedGraph()); setSource(0); }, [resetAnimation]);

  const { currentStep, steps } = useAlgorithm();
  const defaultDist = Array(NODE_COUNT).fill(Infinity);
  const currentData = steps?.[currentStep] || { type: 'idle', dist: defaultDist, log: [] };
  const dist = currentData.dist || defaultDist;
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
                const isRelaxing = currentData.type === 'relax' && currentData.from === edge.from && currentData.to === edge.to;
                const isUpdated = currentData.type === 'update' && currentData.updated === edge.to;
                return (
                  <g key={i}>
                    <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={isRelaxing ? 'var(--amber)' : isUpdated ? '#22c55e' : 'var(--border)'} strokeWidth={isRelaxing || isUpdated ? 2 : 1} style={{ transition: 'all 0.3s' }} />
                    <text x={(from.x + to.x) / 2} y={(from.y + to.y) / 2 - 3} textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="7" fill={isRelaxing ? 'var(--amber)' : 'var(--muted)'} style={{ pointerEvents: 'none' }}>{edge.weight}</text>
                  </g>
                );
              })}
              {graph.nodes.map(node => {
                const isSource = node.id === source;
                const isUpdated = currentData.type === 'update' && currentData.updated === node.id;
                return (
                  <g key={node.id}>
                    <circle cx={node.x} cy={node.y} r={15} fill={isUpdated ? '#22c55e' : isSource ? '#a78bfa' : 'var(--white)'} stroke={isSource ? '#a78bfa' : 'var(--border)'} strokeWidth={isSource ? 2 : 1} style={{ transition: 'all 0.3s' }} />
                    <text x={node.x} y={node.y} textAnchor="middle" dominantBaseline="central" fontFamily="IBM Plex Mono, monospace" fontSize="8" fontWeight="500" fill={isSource ? '#fff' : 'var(--ink2)'} style={{ pointerEvents: 'none' }}>{node.id}</text>
                    {dist[node.id] !== Infinity && <text x={node.x} y={node.y + 22} textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="7" fill={isUpdated ? '#16a34a' : 'var(--muted)'} style={{ pointerEvents: 'none' }}>d={dist[node.id]}</text>}
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
            {currentData.iteration !== undefined && <div style={{ marginTop: '.5rem', fontFamily: 'IBM Plex Mono, monospace', fontSize: '.625rem', color: 'var(--muted)' }}>Iteration {currentData.iteration} / {NODE_COUNT - 1}</div>}
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
