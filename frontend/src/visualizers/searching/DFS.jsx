import { useState, useCallback, useEffect, useRef } from 'react';
import { useAlgorithm } from '../../contexts/AlgorithmContext';

const NODE_COUNT = 12;
const CANVAS_SIZE = 400;

function generateGraph() {
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

export default function DFS() {
  const { startAnimation, setGenerator, resetAnimation } = useAlgorithm();
  const [graph, setGraph] = useState(generateGraph);
  const [startNode, setStartNode] = useState(0);

  const generateSteps = useCallback((g, start) => {
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
  }, []);

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
  const currentData = steps?.[currentStep] || { type: 'idle', visited: new Set(), log: [] };
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
            <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '1rem', fontWeight: 500, color: 'var(--purple)' }}>{startNode}</span>
          </div>
          <div style={{ flex: 1 }} />
          <button onClick={handleNewGraph} style={{ padding: '.3rem .75rem', fontSize: '.6875rem', borderRadius: '5px', border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer', color: 'var(--ink2)', fontFamily: 'Instrument Sans, sans-serif' }}>New Graph</button>
          <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '.625rem', color: 'var(--muted)' }}>Click a node to set start</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '1.25rem', flex: 1, minHeight: 0 }}>
        <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '10px', padding: '1.25rem', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '.5625rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '1rem', flexShrink: 0 }}>DFS traversal</div>
          <div style={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox={`0 0 ${CANVAS_SIZE} ${CANVAS_SIZE}`} style={{ width: '100%', height: '100%' }}>
              {graph.edges.map((edge, i) => {
                const from = graph.nodes[edge.from]; const to = graph.nodes[edge.to];
                const isExplored = currentData.type === 'explore' && ((currentData.from === edge.from && currentData.to === edge.to) || (currentData.from === edge.to && currentData.to === edge.from));
                const isBacktrack = currentData.type === 'backtrack' && ((currentData.from === edge.from && currentData.to === edge.to) || (currentData.from === edge.to && currentData.to === edge.from));
                const isVisited = currentData.visited?.has(edge.from) && currentData.visited?.has(edge.to);
                return (
                  <line key={i} x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                    stroke={isExplored ? 'var(--amber)' : isBacktrack ? '#ef4444' : isVisited ? 'var(--purple)' : 'var(--border)'}
                    strokeWidth={isExplored || isBacktrack ? 2 : 1} style={{ transition: 'all 0.3s' }} />
                );
              })}
              {graph.nodes.map(node => {
                const isVisited = currentData.visited?.has(node.id);
                const isCurrent = currentData.type === 'explore' && currentData.to === node.id;
                const isBack = currentData.type === 'backtrack' && currentData.to === node.id;
                const isStart = node.id === startNode;
                const isComplete = currentData.type === 'complete';
                const fill = isComplete || isVisited ? (isBack ? '#ef4444' : isCurrent ? 'var(--amber)' : 'var(--purple)') : isStart ? '#a78bfa' : 'var(--white)';
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

        {currentData.log && (
          <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '10px', padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '.5625rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '.5rem', flexShrink: 0 }}>Call stack</div>
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
