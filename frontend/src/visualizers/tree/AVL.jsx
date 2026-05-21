import { useState, useCallback, useRef, useEffect } from 'react';

class AVLNode {
  constructor(val) { this.val = val; this.left = null; this.right = null; this.height = 1; }
}

function height(node) { return node ? node.height : 0; }
function updateHeight(node) { if (node) node.height = 1 + Math.max(height(node.left), height(node.right)); }
function rotateRight(y) { const x = y.left; const T2 = x.right; x.right = y; y.left = T2; updateHeight(y); updateHeight(x); return x; }
function rotateLeft(x) { const y = x.right; const T2 = y.left; y.left = x; x.right = T2; updateHeight(x); updateHeight(y); return y; }
function getBalance(node) { return node ? height(node.left) - height(node.right) : 0; }

export default function AVL() {
  const [root, setRoot] = useState(null);
  const [inputValue, setInputValue] = useState(50);
  const [steps, setSteps] = useState([]);
  const logRef = useRef(null);
  useEffect(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; }, [steps]);

  const log = steps.map(s => {
    if (s.type === 'insert') return `Insert ${s.val}`;
    if (s.type === 'go-left') return `Go left from ${s.val}`;
    if (s.type === 'go-right') return `Go right from ${s.val}`;
    if (s.type === 'rotate-right') return `Rotate right at ${s.at}`;
    if (s.type === 'rotate-left') return `Rotate left at ${s.at}`;
    if (s.type === 'rotate-left-right') return `Rotate left-right at ${s.at}`;
    if (s.type === 'rotate-right-left') return `Rotate right-left at ${s.at}`;
    return '';
  });

  function insert(node, val, path = []) {
    if (!node) return { node: new AVLNode(val), steps: [...path, { type: 'insert', val }] };
    let result;
    if (val < node.val) { result = insert(node.left, val, [...path, { type: 'go-left', val: node.val }]); node.left = result.node; }
    else if (val > node.val) { result = insert(node.right, val, [...path, { type: 'go-right', val: node.val }]); node.right = result.node; }
    else return { node, steps: path };
    updateHeight(node);
    const balance = getBalance(node);
    if (balance > 1 && val < node.left.val) { result.steps.push({ type: 'rotate-right', at: node.val }); return { node: rotateRight(node), steps: result.steps }; }
    if (balance < -1 && val > node.right.val) { result.steps.push({ type: 'rotate-left', at: node.val }); return { node: rotateLeft(node), steps: result.steps }; }
    if (balance > 1 && val > node.left.val) { result.steps.push({ type: 'rotate-left-right', at: node.val }); node.left = rotateLeft(node.left); return { node: rotateRight(node), steps: result.steps }; }
    if (balance < -1 && val < node.right.val) { result.steps.push({ type: 'rotate-right-left', at: node.val }); node.right = rotateRight(node.right); return { node: rotateLeft(node), steps: result.steps }; }
    return { node, steps: result.steps };
  }

  const handleInsert = useCallback(() => {
    const val = parseInt(inputValue);
    if (isNaN(val)) return;
    const result = insert(root, val);
    setRoot(result.node); setSteps(result.steps); setInputValue('');
  }, [root, inputValue, insert]);

  const handleClear = useCallback(() => { setRoot(null); setSteps([]); }, []);
  const handleRandom = useCallback(() => {
    let r = null; const vals = [];
    for (let i = 0; i < 8; i++) { const v = Math.floor(Math.random() * 100) + 1; vals.push(v); const result = insert(r, v); r = result.node; }
    setRoot(r);
  }, [insert]);

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
      const balance = getBalance(node);
      positions.push({ x, y, depth, val: node.val, node, balance, needsRotation: Math.abs(balance) > 1 });
      if (px !== null) edges.push({ x1: px, y1: py, x2: x, y2: y, parentNeedsRotation: Math.abs(getBalance(positions.find(p => p.x === px && p.y === py)?.node)) > 1 });

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
    maxY = Math.max(maxY, p.y + 40);
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
          <div className="flex-1" />
          <button onClick={handleRandom} className="cursor-pointer rounded-[5px] border border-border bg-white px-3 py-[.3rem] text-[.6875rem] font-body text-ink2">Random</button>
          <button onClick={handleClear} className="cursor-pointer rounded-[5px] border border-[#fecdd3] bg-[#fff1f2] px-3 py-[.3rem] text-[.6875rem] font-body text-[#e11d48]">Clear</button>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-[1fr_280px] gap-5">
        <div className="flex items-center justify-center overflow-hidden rounded-[10px] border border-border bg-white p-5">
          {root ? (
            <svg viewBox={viewBox} preserveAspectRatio="xMidYMid meet" className="h-full w-full">
              {edges.map((e, i) => (
                <line key={i} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} stroke={e.parentNeedsRotation ? '#ef4444' : 'var(--border)'} strokeWidth={2} />
              ))}
              {positions.map((p, i) => (
                <g key={i}>
                  <circle cx={p.x} cy={p.y} r={20} fill={p.needsRotation ? '#fee2e2' : 'var(--white)'} stroke={p.needsRotation ? '#ef4444' : 'var(--border)'} strokeWidth={p.needsRotation ? 3 : 2} />
                  <text x={p.x} y={p.y - 2} textAnchor="middle" dominantBaseline="central" fontFamily="IBM Plex Mono, monospace" fontSize="13" fontWeight="500" fill={p.needsRotation ? '#dc2626' : 'var(--ink2)'} style={{ pointerEvents: 'none' }}>{p.val}</text>
                  <text x={p.x} y={p.y + 32} textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="10" fill={p.needsRotation ? '#ef4444' : 'var(--muted)'} style={{ pointerEvents: 'none' }}>h={p.node.height}, b={p.balance}</text>
                </g>
              ))}
            </svg>
          ) : (
            <div className="text-center text-muted">
              <p className="mb-1 text-[1.125rem] font-semibold">Empty AVL tree</p>
              <p className="text-[.75rem]">Insert values to see rotations</p>
            </div>
          )}
        </div>

        {log.length > 0 && (
          <div className="flex flex-col overflow-hidden rounded-[10px] border border-border bg-white px-5 py-4">
            <div className="mb-2 shrink-0 font-mono text-[.5625rem] uppercase tracking-[.08em] text-muted">Operation log</div>
            <div ref={logRef} className="flex flex-1 flex-col gap-[3px] overflow-y-auto">
              {log.map((entry, i) => {
                const isLast = i === log.length - 1;
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
