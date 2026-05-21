import { useState, useCallback, useRef, useEffect } from 'react';

class RBNode {
  constructor(val, color = 'red') { this.val = val; this.color = color; this.left = null; this.right = null; this.parent = null; }
}

function sibling(node) {
  if (!node || !node.parent) return null;
  return node.parent.left === node ? node.parent.right : node.parent.left;
}

function uncle(node) {
  if (!node || !node.parent) return null;
  return sibling(node.parent);
}

function grandparent(node) {
  return node?.parent?.parent ?? null;
}

function rotateLeft(tree, node) {
  const right = node.right;
  node.right = right.left;
  if (right.left) right.left.parent = node;
  right.parent = node.parent;
  if (!node.parent) tree.root = right;
  else if (node === node.parent.left) node.parent.left = right;
  else node.parent.right = right;
  right.left = node;
  node.parent = right;
}

function rotateRight(tree, node) {
  const left = node.left;
  node.left = left.right;
  if (left.right) left.right.parent = node;
  left.parent = node.parent;
  if (!node.parent) tree.root = left;
  else if (node === node.parent.right) node.parent.right = left;
  else node.parent.left = left;
  left.right = node;
  node.parent = left;
}

function fixInsert(tree, node, ops) {
  if (!node.parent) { node.color = 'black'; ops.push(`Root → black`); return; }
  if (node.parent.color === 'black') return;

  let p = node.parent;
  const u = uncle(node);
  const g = grandparent(node);

  if (u && u.color === 'red') {
    p.color = 'black'; u.color = 'black'; g.color = 'red';
    ops.push(`Recolor: ${p.val}→black, ${u.val}→black, ${g.val}→red`);
    fixInsert(tree, g, ops);
  } else {
    if (p === g.left) {
      if (node === p.right) {
        rotateLeft(tree, p);
        ops.push(`Rotate left at ${p.val}`);
        p = node;
      }
      rotateRight(tree, g);
      ops.push(`Rotate right at ${g.val}`);
      p.color = 'black'; g.color = 'red';
    } else {
      if (node === p.left) {
        rotateRight(tree, p);
        ops.push(`Rotate right at ${p.val}`);
        p = node;
      }
      rotateLeft(tree, g);
      ops.push(`Rotate left at ${g.val}`);
      p.color = 'black'; g.color = 'red';
    }
  }
}

function insert(tree, val, ops) {
  let node = tree.root;
  let parent = null;
  while (node) {
    if (val === node.val) { ops.push(`${val} already exists`); return; }
    parent = node;
    node = val < node.val ? node.left : node.right;
  }
  const newNode = new RBNode(val, 'red');
  newNode.parent = parent;
  if (!parent) tree.root = newNode;
  else if (val < parent.val) parent.left = newNode;
  else parent.right = newNode;
  ops.push(`Insert ${val} as red`);
  fixInsert(tree, newNode, ops);
}

function validateTree(node) {
  if (!node) return { valid: true, blackHeight: 0, violations: [] };
  const violations = [];
  if (node.color === 'red') {
    if (node.left && node.left.color === 'red') violations.push(`Red-red violation: ${node.val} → ${node.left.val}`);
    if (node.right && node.right.color === 'red') violations.push(`Red-red violation: ${node.val} → ${node.right.val}`);
  }
  const left = validateTree(node.left);
  const right = validateTree(node.right);
  violations.push(...left.violations, ...right.violations);
  if (left.blackHeight !== right.blackHeight) violations.push(`Black-height mismatch at ${node.val}: left=${left.blackHeight}, right=${right.blackHeight}`);
  return { valid: violations.length === 0, blackHeight: left.blackHeight + (node.color === 'black' ? 1 : 0), violations };
}

export default function RedBlack() {
  const [root, setRoot] = useState(null);
  const [inputValue, setInputValue] = useState(50);
  const [log, setLog] = useState([]);
  const [violations, setViolations] = useState([]);
  const logRef = useRef(null);
  useEffect(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; }, [log]);

  const handleInsert = useCallback(() => {
    const val = parseInt(inputValue);
    if (isNaN(val)) return;
    const tree = { root };
    const ops = [];
    insert(tree, val, ops);
    if (tree.root) tree.root.color = 'black';
    setRoot(tree.root);
    setLog(ops);
    const result = validateTree(tree.root);
    setViolations(result.violations);
    setInputValue('');
  }, [root, inputValue]);

  const handleClear = useCallback(() => { setRoot(null); setLog([]); setViolations([]); }, []);

  const handleRandom = useCallback(() => {
    const tree = { root: null };
    const vals = [];
    for (let i = 0; i < 8; i++) { const v = Math.floor(Math.random() * 100) + 1; vals.push(v); insert(tree, v, []); }
    if (tree.root) tree.root.color = 'black';
    setRoot(tree.root);
    setLog(vals.map(v => `Insert ${v}`));
    const result = validateTree(tree.root);
    setViolations(result.violations);
  }, []);

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
      positions.push({ x, y, depth, val: node.val, color: node.color });
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

  const allNodes = positions;
  const blackNodes = allNodes.filter(n => n.color === 'black').length;
  const redNodes = allNodes.filter(n => n.color === 'red').length;

  return (
    <div className="flex h-full flex-col gap-5">
      <div className="rounded-[10px] border border-border bg-white p-5">
        <div className="mb-3 font-mono text-[.5625rem] uppercase tracking-[.08em] text-muted">Input</div>
        <div className="flex items-center gap-2">
          <input type="number" value={inputValue} onChange={e => setInputValue(e.target.value)} className="w-[80px] rounded-md border border-border bg-bg px-2.5 py-1.5 font-mono text-[.8125rem] text-ink outline-none" placeholder="Value" />
          <button onClick={handleInsert} className="cursor-pointer rounded-[5px] border-none bg-purple px-3 py-[.3rem] text-[.6875rem] font-body text-white">Insert</button>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1"><div className="h-2.5 w-2.5 rounded-full bg-[#1e293b]" /><span className="text-[.625rem] text-muted">Black ({blackNodes})</span></div>
            <div className="flex items-center gap-1"><div className="h-2.5 w-2.5 rounded-full bg-[#ef4444]" /><span className="text-[.625rem] text-muted">Red ({redNodes})</span></div>
          </div>
          <button onClick={handleRandom} className="cursor-pointer rounded-[5px] border border-border bg-white px-3 py-[.3rem] text-[.6875rem] font-body text-ink2">Random</button>
          <button onClick={handleClear} className="cursor-pointer rounded-[5px] border border-[#fecdd3] bg-[#fff1f2] px-3 py-[.3rem] text-[.6875rem] font-body text-[#e11d48]">Clear</button>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-[1fr_280px] gap-5">
        <div className="flex flex-col rounded-[10px] border border-border bg-white p-5">
          <div className="mb-4 font-mono text-[.5625rem] uppercase tracking-[.08em] text-muted">Red-Black Tree</div>
          <div className="flex flex-1 items-center justify-center overflow-hidden">
            {root ? (
              <svg viewBox={viewBox} preserveAspectRatio="xMidYMid meet" className="h-full w-full">
                {edges.map((e, i) => (
                  <line key={i} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} stroke="var(--border)" strokeWidth={2} />
                ))}
                {positions.map((p, i) => {
                  const isRed = p.color === 'red';
                  return (
                    <g key={i}>
                      <circle cx={p.x} cy={p.y} r={20} fill={isRed ? '#fee2e2' : '#1e293b'} stroke={isRed ? '#ef4444' : '#334155'} strokeWidth={2} />
                      <text x={p.x} y={p.y} textAnchor="middle" dominantBaseline="central" fontFamily="IBM Plex Mono, monospace" fontSize="13" fontWeight="500" fill={isRed ? '#dc2626' : '#fff'} style={{ pointerEvents: 'none' }}>{p.val}</text>
                    </g>
                  );
                })}
              </svg>
            ) : (
              <div className="text-center text-muted">
                <p className="mb-1 text-[1.125rem] font-semibold">Empty Red-Black tree</p>
                <p className="text-[.75rem]">Insert values to see the tree</p>
              </div>
            )}
          </div>
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
            {violations.length > 0 && (
              <div className="mt-3 border-t border-border pt-2">
                <div className="mb-1 font-mono text-[.5625rem] uppercase tracking-[.08em] text-[#e11d48]">Violations</div>
                {violations.map((v, i) => (
                  <div key={i} className="font-mono text-[.5625rem] text-[#e11d48] py-0.5">{v}</div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
