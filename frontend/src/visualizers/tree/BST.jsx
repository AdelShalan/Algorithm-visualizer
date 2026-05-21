import { useState, useEffect, useRef, useCallback } from 'react';
import { useAlgorithm } from '../../contexts/AlgorithmContext';
import { TreeNode, generateSearchSteps } from '../../algorithms/tree/bst';

export default function BST() {
  const { startAnimation, setGenerator } = useAlgorithm();
  const [root, setRoot] = useState(null);
  const [inputValue, setInputValue] = useState(50);

  function insert(node, val) {
    if (!node) return new TreeNode(val);
    if (val < node.val) node.left = insert(node.left, val);
    else if (val > node.val) node.right = insert(node.right, val);
    return node;
  }

  const handleInsert = (val) => {
    if (isNaN(val)) return;
    const newRoot = insert(root, val);
    setRoot(newRoot);
    setInputValue('');
  };

  const handleSearch = () => {
    const target = parseInt(inputValue);
    if (isNaN(target)) return;
    startAnimation(generateSearchSteps(root, target));
  };

  useEffect(() => { setGenerator(handleSearch); }, [handleSearch, setGenerator]);

  const handleClear = useCallback(() => { setRoot(null); }, []);
  const handleRandom = useCallback(() => {
    let r = null;
    for (let i = 0; i < 8; i++) { const v = Math.floor(Math.random() * 100) + 1; r = insert(r, v); }
    setRoot(r);
  }, [insert]);

  const { currentStep, steps } = useAlgorithm();
  const currentData = steps?.[currentStep] || { type: 'idle', log: [] };
  const logRef = useRef(null);
  useEffect(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; }, [currentData.log]);

  const nodeSpacing = 70;
  const leafGap = 28;
  const padding = 30;

  // Two-pass layout
  const positions = [];
  const edges = [];
  if (root) {
    const countLeaves = (node) => {
      if (!node) return 1;
      return countLeaves(node.left) + countLeaves(node.right);
    };

    const collectLayout = (node, x, y, depth, px, py) => {
      if (!node) return;
      positions.push({ x, y, depth, val: node.val, node });
      if (px !== null) edges.push({ x1: px, y1: py, x2: x, y2: y });

      const leftCount = countLeaves(node.left);
      const rightCount = countLeaves(node.right);
      const leftX = x - (rightCount * leafGap) / 2;
      const rightX = x + (leftCount * leafGap) / 2;

      collectLayout(node.left, leftX, y + nodeSpacing, depth + 1, x, y);
      collectLayout(node.right, rightX, y + nodeSpacing, depth + 1, x, y);
    };

    const totalLeaves = countLeaves(root);
    const rootX = (totalLeaves * leafGap) / 2;
    collectLayout(root, rootX, 20, 0, null, null);
  }

  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const p of positions) {
    minX = Math.min(minX, p.x - 20);
    maxX = Math.max(maxX, p.x + 20);
    minY = Math.min(minY, p.y - 20);
    maxY = Math.max(maxY, p.y + 20);
  }
  if (positions.length === 0) { minX = 0; maxX = 100; minY = 0; maxY = 60; }
  const viewBox = `${minX - padding} ${minY - padding} ${maxX - minX + padding * 2} ${maxY - minY + padding * 2}`;

  return (
    <div className="flex h-full flex-col gap-5">
      <div className="rounded-[10px] border border-border bg-white p-5">
        <div className="mb-3 font-mono text-[.5625rem] uppercase tracking-[.08em] text-muted">Input</div>
        <div className="flex items-center gap-2">
          <input type="number" value={inputValue} onChange={e => setInputValue(e.target.value)} className="w-[80px] rounded-md border border-border bg-bg px-2.5 py-1.5 font-mono text-[.8125rem] text-ink outline-none" placeholder="Value" />
          <button onClick={handleInsert} className="cursor-pointer rounded-[5px] border-none bg-purple px-3 py-[.3rem] text-[.6875rem] font-body text-white">Insert</button>
          <button onClick={handleSearch} disabled={!root} className="cursor-pointer rounded-[5px] border border-border bg-white px-3 py-[.3rem] text-[.6875rem] font-body text-ink2" style={{ cursor: root ? 'pointer' : 'not-allowed', opacity: root ? 1 : 0.5 }}>Search</button>
          <div className="flex-1" />
          <button onClick={handleRandom} className="cursor-pointer rounded-[5px] border border-border bg-white px-3 py-[.3rem] text-[.6875rem] font-body text-ink2">Random</button>
          <button onClick={handleClear} className="cursor-pointer rounded-[5px] border border-[#fecdd3] bg-[#fff1f2] px-3 py-[.3rem] text-[.6875rem] font-body text-[#e11d48]">Clear</button>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-[1fr_280px] gap-5">
        <div className="flex items-center justify-center overflow-hidden rounded-[10px] border border-border bg-white p-5">
          {root ? (
            <svg viewBox={viewBox} preserveAspectRatio="xMidYMid meet" className="h-full w-full">
              {edges.map((e, i) => {
                const isVisited = currentData.type === 'visit' && positions.some(p => p.x === e.x1 && p.y === e.y1 && currentData.node === p.val);
                return <line key={i} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} stroke={isVisited ? 'var(--amber)' : 'var(--border)'} strokeWidth={2} />;
              })}
              {positions.map((p, i) => {
                const isVisited = currentData.type === 'visit' && currentData.node === p.val;
                const isFound = currentData.type === 'found' && currentData.node === p.val;
                return (
                  <g key={i}>
                    <circle cx={p.x} cy={p.y} r={20} fill={isFound ? '#22c55e' : isVisited ? 'var(--amber)' : 'var(--white)'} stroke={isFound ? '#22c55e' : isVisited ? 'var(--amber)' : 'var(--border)'} strokeWidth={2} />
                    <text x={p.x} y={p.y} textAnchor="middle" dominantBaseline="central" fontFamily="IBM Plex Mono, monospace" fontSize="13" fontWeight="500" fill={isFound || isVisited ? '#fff' : 'var(--ink2)'} style={{ pointerEvents: 'none' }}>{p.val}</text>
                  </g>
                );
              })}
            </svg>
          ) : (
            <div className="text-center text-muted">
              <p className="mb-1 text-[1.125rem] font-semibold">Empty tree</p>
              <p className="text-[.75rem]">Insert values or generate a random tree</p>
            </div>
          )}
        </div>

        {currentData.log && (
          <div className="flex flex-col overflow-hidden rounded-[10px] border border-border bg-white px-5 py-4">
            <div className="mb-2 shrink-0 font-mono text-[.5625rem] uppercase tracking-[.08em] text-muted">Operation log</div>
            <div ref={logRef} className="flex flex-1 flex-col gap-[3px] overflow-y-auto">
              {currentData.log.map((entry, i) => {
                const isLast = i === currentData.log.length - 1;
                return (
                  <div key={i} className="rounded px-2 py-[.3rem] font-mono text-[.625rem]" style={{ color: isLast ? 'var(--purple)' : 'var(--muted)', background: isLast ? 'var(--purple-light)' : 'transparent', fontWeight: isLast ? 500 : 400 }}>{entry}</div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
