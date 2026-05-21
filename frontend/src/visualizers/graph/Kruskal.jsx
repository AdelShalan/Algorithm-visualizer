import { useState, useCallback, useEffect, useRef } from 'react';
import { useAlgorithm } from '../../contexts/AlgorithmContext';
import { generateSteps, generateWeightedGraph } from '../../algorithms/graph/Kruskal';

const NODE_COUNT = 7;
const CANVAS_SIZE = 400;

export default function Kruskal() {
  const { startAnimation, setGenerator, resetAnimation } = useAlgorithm();
  const [graph, setGraph] = useState(generateWeightedGraph);

  const handleRun = useCallback(() => { startAnimation(generateSteps(graph)); }, [graph, startAnimation]);
  useEffect(() => { setGenerator(handleRun); }, [handleRun, setGenerator]);
  const handleNewGraph = useCallback(() => { resetAnimation(); setGraph(generateWeightedGraph()); }, [resetAnimation]);

  const { currentStep, steps } = useAlgorithm();
  const defaultMST = [];
  const currentData = steps?.[currentStep] || { type: 'idle', mst: defaultMST, log: [] };
  const mst = currentData.mst || defaultMST;
  const logRef = useRef(null);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [currentData.log]);
  const isMSTEdge = (edge) => mst?.some(e => (e.from === edge.from && e.to === edge.to) || (e.from === edge.to && e.to === edge.from));

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '10px', padding: '1rem 1.25rem' }}>
        <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '.5625rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '.75rem' }}>Graph</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
          <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '.6875rem', color: 'var(--muted)' }}>{NODE_COUNT} nodes, {graph.edges.length} edges</span>
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
                const isConsidered = currentData.type === 'consider' && currentData.edge === edge;
                const isSkipped = currentData.type === 'skip' && currentData.edge === edge;
                return (
                  <g key={i}>
                    <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={inMST ? '#22c55e' : isConsidered ? 'var(--amber)' : isSkipped ? '#ef4444' : 'var(--border)'} strokeWidth={inMST || isConsidered ? 2 : 1} style={{ transition: 'all 0.3s' }} />
                    <text x={(from.x + to.x) / 2} y={(from.y + to.y) / 2 - 3} textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="7" fill={isConsidered ? 'var(--amber)' : 'var(--muted)'} style={{ pointerEvents: 'none' }}>{edge.weight}</text>
                  </g>
                );
              })}
              {graph.nodes.map(node => (
                <g key={node.id}>
                  <circle cx={node.x} cy={node.y} r={15} fill="var(--white)" stroke="var(--border)" strokeWidth={1} />
                  <text x={node.x} y={node.y} textAnchor="middle" dominantBaseline="central" fontFamily="IBM Plex Mono, monospace" fontSize="8" fontWeight="500" fill="var(--ink2)" style={{ pointerEvents: 'none' }}>{node.id}</text>
                </g>
              ))}
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

      <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '10px', padding: '.75rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span style={{ fontSize: '.75rem', color: 'var(--muted)' }}>MST weight:</span>
        <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '1.125rem', fontWeight: 700, color: 'var(--purple)' }}>{mst?.reduce((sum, e) => sum + e.weight, 0) ?? 0}</span>
        <span style={{ width: 1, height: 16, background: 'var(--border)' }} />
        <span style={{ fontSize: '.75rem', color: 'var(--muted)' }}>Edges:</span>
        <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '.75rem', fontWeight: 500, color: 'var(--ink)' }}>{mst?.length ?? 0}</span>
        <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '.75rem', color: 'var(--muted)' }}>/{NODE_COUNT - 1}</span>
      </div>
    </div>
  );
}
