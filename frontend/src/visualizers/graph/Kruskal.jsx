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
    <div className="h-full flex flex-col gap-5">
      <div className="bg-white border border-border rounded-[10px] px-5 py-4">
        <div className="font-mono text-[0.5625rem] tracking-[0.08em] uppercase text-muted mb-3">Graph</div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[0.6875rem] text-muted">{NODE_COUNT} nodes, {graph.edges.length} edges</span>
          <div className="flex-1" />
          <button onClick={handleNewGraph} className="px-3 py-1 text-[0.6875rem] rounded-sm border border-border bg-transparent cursor-pointer text-ink2 font-body">New Graph</button>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_280px] gap-5 flex-1 min-h-0">
        <div className="bg-white border border-border rounded-[10px] p-5 flex flex-col overflow-hidden">
          <div className="font-mono text-[0.5625rem] tracking-[0.08em] uppercase text-muted mb-4 flex-shrink-0">Minimum spanning tree</div>
          <div className="flex-1 min-h-0 flex items-center justify-center">
            <svg viewBox={`0 0 ${CANVAS_SIZE} ${CANVAS_SIZE}`} className="w-full h-full">
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
          <div className="bg-white border border-border rounded-[10px] px-4 py-3 flex flex-col overflow-hidden">
            <div className="font-mono text-[0.5625rem] tracking-[0.08em] uppercase text-muted mb-2 flex-shrink-0">MST construction log</div>
            <div ref={logRef} className="flex-1 overflow-y-auto flex flex-col gap-[3px]">
              {currentData.log.map((entry, i) => {
                const isLast = i === currentData.log.length - 1;
                return (
                  <div key={i} className="font-mono text-[0.625rem] px-2 py-1 rounded-sm" style={{ color: isLast ? 'var(--purple)' : 'var(--muted)', background: isLast ? 'var(--purple-light)' : 'transparent', fontWeight: isLast ? 500 : 400 }}>{entry}</div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="bg-white border border-border rounded-[10px] px-5 py-3 flex items-center gap-4">
        <span className="text-sm text-muted">MST weight:</span>
        <span className="font-mono text-lg font-bold text-purple">{mst?.reduce((sum, e) => sum + e.weight, 0) ?? 0}</span>
        <span className="w-px h-4 bg-border" />
        <span className="text-sm text-muted">Edges:</span>
        <span className="font-mono text-sm font-medium text-ink">{mst?.length ?? 0}</span>
        <span className="font-mono text-sm text-muted">/{NODE_COUNT - 1}</span>
      </div>
    </div>
  );
}
