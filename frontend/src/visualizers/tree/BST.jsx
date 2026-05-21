import { useState, useEffect, useRef } from 'react';
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
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '10px', padding: '1rem 1.25rem' }}>
        <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '.5625rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '.75rem' }}>Input</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
          <input type="number" value={inputValue} onChange={e => setInputValue(e.target.value)} style={{ width: 80, padding: '.375rem .625rem', border: '1px solid var(--border)', borderRadius: '6px', fontFamily: 'IBM Plex Mono, monospace', fontSize: '.8125rem', color: 'var(--ink)', background: 'var(--bg)', outline: 'none' }} placeholder="Value" />
          <button onClick={handleInsert} style={{ padding: '.3rem .75rem', fontSize: '.6875rem', borderRadius: '5px', border: 'none', background: 'var(--purple)', color: '#fff', cursor: 'pointer', fontFamily: 'Instrument Sans, sans-serif' }}>Insert</button>
          <button onClick={handleSearch} disabled={!root} style={{ padding: '.3rem .75rem', fontSize: '.6875rem', borderRadius: '5px', border: '1px solid var(--border)', background: 'var(--white)', color: 'var(--ink2)', cursor: root ? 'pointer' : 'not-allowed', opacity: root ? 1 : 0.5, fontFamily: 'Instrument Sans, sans-serif' }}>Search</button>
          <div style={{ flex: 1 }} />
          <button onClick={handleRandom} style={{ padding: '.3rem .75rem', fontSize: '.6875rem', borderRadius: '5px', border: '1px solid var(--border)', background: 'var(--white)', color: 'var(--ink2)', cursor: 'pointer', fontFamily: 'Instrument Sans, sans-serif' }}>Random</button>
          <button onClick={handleClear} style={{ padding: '.3rem .75rem', fontSize: '.6875rem', borderRadius: '5px', border: '1px solid #fecdd3', background: '#fff1f2', color: '#e11d48', cursor: 'pointer', fontFamily: 'Instrument Sans, sans-serif' }}>Clear</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '1.25rem', flex: 1, minHeight: 0 }}>
        <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '10px', padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          {root ? (
            <svg viewBox={viewBox} preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%' }}>
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
            <div style={{ textAlign: 'center', color: 'var(--muted)' }}>
              <p style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '.25rem' }}>Empty tree</p>
              <p style={{ fontSize: '.75rem' }}>Insert values or generate a random tree</p>
            </div>
          )}
        </div>

        {currentData.log && (
          <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '10px', padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '.5625rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '.5rem', flexShrink: 0 }}>Operation log</div>
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
