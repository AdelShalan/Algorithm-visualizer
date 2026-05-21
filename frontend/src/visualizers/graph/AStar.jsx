import { useState, useCallback, useEffect, useRef } from 'react';
import { useAlgorithm } from '../../contexts/AlgorithmContext';
import { generateSteps, generateWeightedGraph } from '../../algorithms/graph/AStar';

const NODE_COUNT = 8;
const CANVAS_SIZE = 400;

export default function AStar() {
  const { startAnimation, setGenerator, resetAnimation } = useAlgorithm();
  const [graph, setGraph] = useState(generateWeightedGraph);
  const [source, setSource] = useState(0);
  const [target, setTarget] = useState(7);

  const handleRun = useCallback(() => { startAnimation(generateSteps(graph, source, target)); }, [graph, source, target, startAnimation]);
  useEffect(() => { setGenerator(handleRun); }, [handleRun, setGenerator]);
  const handleNewGraph = useCallback(() => { resetAnimation(); setGraph(generateWeightedGraph()); setSource(0); setTarget(NODE_COUNT - 1); }, [resetAnimation]);

  const { currentStep, steps } = useAlgorithm();
  const currentData = steps?.[currentStep] || { type: 'idle', closedSet: new Set(), openSet: [], path: [], log: [] };
  const logRef = useRef(null);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [currentData.log]);

  return (
    <div className="h-full flex flex-col gap-5">
      <div className="bg-white border border-border rounded-[10px] px-5 py-4">
        <div className="font-mono text-[0.5625rem] tracking-[0.08em] uppercase text-muted mb-3">Graph</div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[0.8125rem] text-ink2">Start:</span>
            <span className="font-mono text-base font-medium text-purple">{source}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[0.8125rem] text-ink2">End:</span>
            <span className="font-mono text-base font-medium text-purple">{target}</span>
          </div>
          <div className="flex-1" />
          <button onClick={handleNewGraph} className="px-3 py-1 text-[0.6875rem] rounded-sm border border-border bg-transparent cursor-pointer text-ink2 font-body">New Graph</button>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_280px] gap-5 flex-1 min-h-0">
        <div className="bg-white border border-border rounded-[10px] p-5 flex flex-col overflow-hidden">
          <div className="font-mono text-[0.5625rem] tracking-[0.08em] uppercase text-muted mb-4 flex-shrink-0">A* pathfinding</div>
          <div className="flex-1 min-h-0 flex items-center justify-center">
            <svg viewBox={`0 0 ${CANVAS_SIZE} ${CANVAS_SIZE}`} className="w-full h-full">
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
          <div className="bg-white border border-border rounded-[10px] px-4 py-3 flex flex-col overflow-hidden">
            <div className="font-mono text-[0.5625rem] tracking-[0.08em] uppercase text-muted mb-2 flex-shrink-0">Pathfinding log</div>
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
    </div>
  );
}
