import { useState, useCallback, useEffect, useRef } from 'react';
import { useAlgorithm } from '../../contexts/AlgorithmContext';
import { generateSteps, generateGraph } from '../../algorithms/searching/BFS';

const CANVAS_SIZE = 400;

export default function BFS() {
  const { startAnimation, setGenerator, resetAnimation } = useAlgorithm();
  const [graph, setGraph] = useState(generateGraph);
  const [startNode, setStartNode] = useState(0);
  const svgRef = useRef();

  const handleRun = useCallback(() => {
    startAnimation(generateSteps(graph, startNode));
  }, [graph, startNode, generateSteps, startAnimation]);

  useEffect(() => { setGenerator(handleRun); }, [handleRun, setGenerator]);

  const handleNewGraph = useCallback(() => {
    resetAnimation();
    setGraph(generateGraph());
    setStartNode(0);
  }, [resetAnimation]);

  const handleNodeClick = useCallback((nodeId) => {
    setStartNode(nodeId);
  }, []);

  const { currentStep, steps } = useAlgorithm();
  const currentData = steps?.[currentStep] || { type: 'idle', visited: new Set(), queue: [], log: [] };
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
            <span className="font-mono text-base font-medium text-purple">{startNode}</span>
          </div>
          <div className="flex-1" />
          <button onClick={handleNewGraph} className="px-3 py-1 text-[0.6875rem] rounded-sm border border-border bg-transparent cursor-pointer text-ink2 font-body">New Graph</button>
          <span className="font-mono text-[0.625rem] text-muted">Click a node to set start</span>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_280px] gap-5 flex-1 min-h-0">
        <div className="bg-white border border-border rounded-[10px] p-5 flex flex-col overflow-hidden">
          <div className="font-mono text-[0.5625rem] tracking-[0.08em] uppercase text-muted mb-4 flex-shrink-0">BFS traversal</div>
          <div className="flex-1 min-h-0 flex items-center justify-center">
            <svg ref={svgRef} viewBox={`0 0 ${CANVAS_SIZE} ${CANVAS_SIZE}`} className="w-full h-full">
              {graph.edges.map((edge, i) => {
                const from = graph.nodes[edge.from]; const to = graph.nodes[edge.to];
                const isExplored = currentData.type === 'explore' && ((currentData.from === edge.from && currentData.to === edge.to) || (currentData.from === edge.to && currentData.to === edge.from));
                const isVisited = currentData.visited?.has(edge.from) && currentData.visited?.has(edge.to);
                return (
                  <line key={i} x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                    stroke={isExplored ? 'var(--amber)' : isVisited ? 'var(--purple)' : 'var(--border)'}
                    strokeWidth={isExplored ? 2 : 1} style={{ transition: 'all 0.3s' }} />
                );
              })}
              {graph.nodes.map(node => {
                const isVisited = currentData.visited?.has(node.id);
                const isCurrent = currentData.type === 'explore' && currentData.to === node.id;
                const isStart = node.id === startNode;
                const isComplete = currentData.type === 'complete';
                const fill = isComplete || isVisited ? (isCurrent ? 'var(--amber)' : 'var(--purple)') : isStart ? '#a78bfa' : 'var(--white)';
                const stroke = isStart ? '#a78bfa' : 'var(--border)';
                return (
                  <g key={node.id} onClick={() => handleNodeClick(node.id)} style={{ cursor: 'pointer' }}>
                    <circle cx={node.x} cy={node.y} r={15} fill={fill} stroke={stroke} strokeWidth={isStart ? 2 : 1} style={{ transition: 'all 0.3s' }} />
                    <text x={node.x} y={node.y} textAnchor="middle" dominantBaseline="central" fontFamily="IBM Plex Mono, monospace" fontSize="8" fontWeight="500" fill={isVisited || isStart ? '#fff' : 'var(--ink2)'} style={{ pointerEvents: 'none' }}>{node.id}</text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        <div className="flex flex-col gap-5 overflow-hidden">
          {currentData.log && (
            <div className="bg-white border border-border rounded-[10px] px-4 py-3 flex flex-col overflow-hidden flex-1">
              <div className="font-mono text-[0.5625rem] tracking-[0.08em] uppercase text-muted mb-2 flex-shrink-0">Traversal log</div>
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

          {currentData.queue && currentData.queue.length > 0 && (
            <div className="bg-white border border-border rounded-[10px] px-5 py-3 flex items-center gap-3">
              <span className="font-mono text-[0.625rem] text-muted uppercase tracking-[0.06em]">Queue</span>
              <div className="flex gap-1">
                {currentData.queue.map((n, i) => (
                  <span key={i} className="px-2 py-1 rounded-sm bg-purple-light text-purple font-mono text-[0.6875rem] font-medium">{n}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
