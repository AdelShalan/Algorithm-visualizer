import { useState, useCallback, useEffect, useRef } from 'react';
import { useAlgorithm } from '../../contexts/AlgorithmContext';

const NODE_COUNT = 7;
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
      if (Math.random() < 0.45) edges.push({ from: i, to: j, weight: Math.floor(Math.random() * 20) + 1 });
    }
  }
  for (let i = 0; i < NODE_COUNT - 1; i++) {
    if (!edges.some(e => (e.from === i && e.to === i + 1))) edges.push({ from: i, to: i + 1, weight: Math.floor(Math.random() * 10) + 1 });
  }
  return { nodes, edges };
}

export default function Prim() {
  const { startAnimation, setGenerator, resetAnimation } = useAlgorithm();
  const [graph, setGraph] = useState(generateWeightedGraph);
  const [source, setSource] = useState(0);

  const generateSteps = useCallback((g, src) => {
    const steps = [];
    const log = [];
    const inMST = new Set();
    const key = Array(g.nodes.length).fill(Infinity);
    const parent = Array(g.nodes.length).fill(null);
    key[src] = 0;
    log.push(`Prim's algorithm — start from node ${src}`);
    steps.push({ type: 'init', inMST: new Set(inMST), key: [...key], parent: [...parent], current: src, log: [...log] });
    while (inMST.size < g.nodes.length) {
      let u = -1, minKey = Infinity;
      for (let i = 0; i < g.nodes.length; i++) { if (!inMST.has(i) && key[i] < minKey) { minKey = key[i]; u = i; } }
      if (u === -1) break;
      inMST.add(u);
      log.push(`Add node ${u} to MST (key=${minKey === Infinity ? '∞' : minKey})`);
      steps.push({ type: 'add', node: u, inMST: new Set(inMST), key: [...key], parent: [...parent], log: [...log] });
      for (const edge of g.edges) {
        if (edge.from === u || edge.to === u) {
          const v = edge.from === u ? edge.to : edge.from;
          if (!inMST.has(v) && edge.weight < key[v]) { key[v] = edge.weight; parent[v] = u; log.push(`Update key[${v}] = ${edge.weight} via ${u}`); steps.push({ type: 'update', node: v, from: u, weight: edge.weight, inMST: new Set(inMST), key: [...key], parent: [...parent], log: [...log] }); }
        }
      }
    }
    const mstEdges = [];
    for (let i = 0; i < g.nodes.length; i++) { if (parent[i] !== null) mstEdges.push(g.edges.find(e => (e.from === parent[i] && e.to === i) || (e.from === i && e.to === parent[i]))); }
    log.push(`MST complete ✓ — ${mstEdges.length} edges, total weight: ${mstEdges.reduce((sum, e) => sum + e.weight, 0)}`);
    steps.push({ type: 'complete', mstEdges, log: [...log] });
    return steps;
  }, []);

  const handleRun = useCallback(() => { startAnimation(generateSteps(graph, source)); }, [graph, source, generateSteps, startAnimation]);
  useEffect(() => { setGenerator(handleRun); }, [handleRun, setGenerator]);
  const handleNewGraph = useCallback(() => { resetAnimation(); setGraph(generateWeightedGraph()); setSource(0); }, [resetAnimation]);

  const { currentStep, steps } = useAlgorithm();
  const defaultInMST = new Set();
  const defaultKey = Array(NODE_COUNT).fill(Infinity);
  const currentData = steps?.[currentStep] || { type: 'idle', inMST: defaultInMST, key: defaultKey, log: [] };
  const inMST = currentData.inMST || defaultInMST;
  const key = currentData.key || defaultKey;
  const logRef = useRef(null);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [currentData.log]);
  const isMSTEdge = (edge) => currentData.mstEdges?.some(e => e && ((e.from === edge.from && e.to === edge.to) || (e.from === edge.to && e.to === edge.from)));

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
        <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '10px', padding: '1.25rem', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '.5625rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '1rem', flexShrink: 0 }}>Minimum spanning tree</div>
          <div style={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox={`0 0 ${CANVAS_SIZE} ${CANVAS_SIZE}`} style={{ width: '100%', height: '100%' }}>
              {graph.edges.map((edge, i) => {
                const from = graph.nodes[edge.from]; const to = graph.nodes[edge.to];
                const inMST = isMSTEdge(edge);
                const isUpdated = currentData.type === 'update' && currentData.node === edge.to;
                return (
                  <g key={i}>
                    <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={inMST ? '#22c55e' : isUpdated ? 'var(--amber)' : 'var(--border)'} strokeWidth={inMST || isUpdated ? 2 : 1} style={{ transition: 'all 0.3s' }} />
                    <text x={(from.x + to.x) / 2} y={(from.y + to.y) / 2 - 3} textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="7" fill={isUpdated ? 'var(--amber)' : 'var(--muted)'} style={{ pointerEvents: 'none' }}>{edge.weight}</text>
                  </g>
                );
              })}
              {graph.nodes.map(node => {
                const inMSTSet = inMST?.has(node.id);
                const isCurrent = currentData.node === node.id;
                const isSource = node.id === source;
                const fill = inMSTSet ? 'var(--purple)' : isCurrent ? 'var(--amber)' : isSource ? '#a78bfa' : 'var(--white)';
                return (
                  <g key={node.id}>
                    <circle cx={node.x} cy={node.y} r={15} fill={fill} stroke={isSource ? '#a78bfa' : 'var(--border)'} strokeWidth={isSource ? 2 : 1} style={{ transition: 'all 0.3s' }} />
                    <text x={node.x} y={node.y} textAnchor="middle" dominantBaseline="central" fontFamily="IBM Plex Mono, monospace" fontSize="8" fontWeight="500" fill={inMSTSet || isSource ? '#fff' : 'var(--ink2)'} style={{ pointerEvents: 'none' }}>{node.id}</text>
                    {key[node.id] !== Infinity && <text x={node.x} y={node.y + 22} textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="7" fill="var(--muted)" style={{ pointerEvents: 'none' }}>k={key[node.id]}</text>}
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {currentData.log && (
          <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '10px', padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '.5625rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '.5rem', flexShrink: 0 }}>MST construction log</div>
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
