import { useState, useCallback, useRef, useEffect } from 'react';

class TrieNode {
  constructor() { this.children = {}; this.isEnd = false; }
}

export default function Trie() {
  const [root, setRoot] = useState(new TrieNode());
  const [words, setWords] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [searchPath, setSearchPath] = useState([]);
  const [found, setFound] = useState(null);
  const [log, setLog] = useState([]);
  const logRef = useRef(null);
  useEffect(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; }, [log]);

  const cloneTrie = (node) => {
    const copy = new TrieNode();
    copy.isEnd = node.isEnd;
    for (const [ch, child] of Object.entries(node.children)) {
      copy.children[ch] = cloneTrie(child);
    }
    return copy;
  };

  const handleInsert = useCallback(() => {
    if (!inputValue.trim()) return;
    const word = inputValue.trim().toLowerCase();
    const ops = [`Insert "${word}"`];
    const newRoot = cloneTrie(root);
    let curr = newRoot;
    for (const ch of word) {
      if (!curr.children[ch]) { curr.children[ch] = new TrieNode(); ops.push(`Create node '${ch}'`); }
      else { ops.push(`Traverse '${ch}'`); }
      curr = curr.children[ch];
    }
    curr.isEnd = true;
    ops.push(`Mark end of "${word}"`);
    setRoot(newRoot); setWords(prev => [...prev, word]); setLog(ops); setInputValue('');
  }, [root, inputValue]);

  const handleSearch = useCallback(() => {
    if (!searchValue.trim()) return;
    const word = searchValue.trim().toLowerCase();
    const ops = [`Search "${word}"`];
    let curr = root; const path = [];
    for (const ch of word) {
      path.push(ch);
      if (!curr.children[ch]) { ops.push(`Node '${ch}' not found`); setSearchPath(path); setFound(false); setLog(ops); return; }
      ops.push(`Traverse '${ch}'`);
      curr = curr.children[ch];
    }
    const isFound = curr.isEnd;
    ops.push(isFound ? `Found "${word}"` : `"${word}" not in trie`);
    setSearchPath(path); setFound(isFound); setLog(ops);
  }, [root, searchValue]);

  const handleClear = useCallback(() => { setRoot(new TrieNode()); setWords([]); setSearchPath([]); setFound(null); setLog([]); }, []);
  const handleRandom = useCallback(() => {
    const sampleWords = ['cat', 'car', 'cart', 'dog', 'dot', 'bat', 'bar', 'batman'];
    let r = new TrieNode(); const w = []; const ops = [];
    for (const word of sampleWords.slice(0, 5 + Math.floor(Math.random() * 3))) {
      ops.push(`Insert "${word}"`);
      let curr = r;
      for (const ch of word) { if (!curr.children[ch]) curr.children[ch] = new TrieNode(); curr = curr.children[ch]; }
      curr.isEnd = true;
      w.push(word);
    }
    setRoot(r); setWords(w); setSearchPath([]); setFound(null); setLog(ops);
  }, []);

  const countLeaves = (node) => {
    const children = Object.values(node.children);
    if (children.length === 0) return 1;
    return children.reduce((sum, c) => sum + countLeaves(c), 0);
  };

  const nodeSpacing = 55;
  const leafGap = 40;
  const padding = 30;

  // Two-pass layout: collect positions, compute bounds, then render
  const positions = [];
  const edges = [];
  if (Object.keys(root.children).length > 0) {
    const collectLayout = (node, x, y, depth, char, px, py) => {
      positions.push({ x, y, depth, char, isEnd: node.isEnd });
      if (px !== null) edges.push({ x1: px, y1: py, x2: x, y2: y, parentDepth: depth - 1 });

      const children = Object.entries(node.children);
      if (children.length === 0) return;

      const totalLeaves = countLeaves(node);
      let runningLeaves = 0;

      for (const [ch, child] of children) {
        const childLeaves = countLeaves(child);
        const childX = totalLeaves === 1 ? x : x - (totalLeaves * leafGap) / 2 + (runningLeaves + childLeaves / 2) * leafGap;
        const childY = y + nodeSpacing;
        collectLayout(child, childX, childY, depth + 1, ch, x, y);
        runningLeaves += childLeaves;
      }
    };

    const rootLeaves = countLeaves(root);
    const rootX = (rootLeaves * leafGap) / 2;
    collectLayout(root, rootX, 20, 0, '', null, null);
  }

  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const p of positions) {
    minX = Math.min(minX, p.x - 14);
    maxX = Math.max(maxX, p.x + 14);
    minY = Math.min(minY, p.y - 14);
    maxY = Math.max(maxY, p.y + 18);
  }
  if (positions.length === 0) { minX = 0; maxX = 100; minY = 0; maxY = 60; }
  const viewBox = `${minX - padding} ${minY - padding} ${maxX - minX + padding * 2} ${maxY - minY + padding * 2}`;

  const isOnPath = (pos) => searchPath.length > pos.depth && searchPath[pos.depth] === pos.char;

  return (
    <div className="flex h-full flex-col gap-5">
      <div className="rounded-[10px] border border-border bg-white p-5">
        <div className="mb-3 font-mono text-[.5625rem] uppercase tracking-[.08em] text-muted">Input</div>
        <div className="flex flex-wrap items-center gap-2">
          <input type="text" value={inputValue} onChange={e => setInputValue(e.target.value)} className="w-[110px] rounded-md border border-border bg-bg px-2.5 py-1.5 font-mono text-[.8125rem] text-ink outline-none" placeholder="Insert word" />
          <button onClick={handleInsert} className="cursor-pointer rounded-[5px] border-none bg-purple px-3 py-[.3rem] text-[.6875rem] font-body text-white">Insert</button>
          <input type="text" value={searchValue} onChange={e => setSearchValue(e.target.value)} className="w-[110px] rounded-md border border-border bg-bg px-2.5 py-1.5 font-mono text-[.8125rem] text-ink outline-none" placeholder="Search word" />
          <button onClick={handleSearch} className="cursor-pointer rounded-[5px] border border-border bg-white px-3 py-[.3rem] text-[.6875rem] font-body text-ink2">Search</button>
          <div className="flex-1" />
          <button onClick={handleRandom} className="cursor-pointer rounded-[5px] border border-border bg-white px-3 py-[.3rem] text-[.6875rem] font-body text-ink2">Random</button>
          <button onClick={handleClear} className="cursor-pointer rounded-[5px] border border-[#fecdd3] bg-[#fff1f2] px-3 py-[.3rem] text-[.6875rem] font-body text-[#e11d48]">Clear</button>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-[1fr_280px] gap-5">
        <div className="flex items-center justify-center overflow-hidden rounded-[10px] border border-border bg-white p-5">
          <svg viewBox={viewBox} preserveAspectRatio="xMidYMid meet" className="h-full w-full">
            {edges.map((e, i) => {
              const onPath = searchPath.length > e.parentDepth && searchPath[e.parentDepth] === positions.find(p => p.x === e.x2 && p.y === e.y2)?.char;
              return <line key={i} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} stroke={onPath ? 'var(--purple)' : 'var(--border)'} strokeWidth={onPath ? 2 : 1.5} />;
            })}
            {positions.map((p, i) => {
              const onPath = isOnPath(p);
              return (
                <g key={i}>
                  {p.depth > 0 && (
                    <>
                      <circle cx={p.x} cy={p.y} r={14} fill={onPath ? '#dbeafe' : p.isEnd ? '#dcfce7' : 'var(--white)'} stroke={onPath ? 'var(--purple)' : p.isEnd ? '#22c55e' : 'var(--border)'} strokeWidth={onPath ? 2 : 1.5} />
                      <text x={p.x} y={p.y} textAnchor="middle" dominantBaseline="central" fontFamily="IBM Plex Mono, monospace" fontSize="12" fontWeight="700" fill={onPath ? '#2563eb' : 'var(--ink2)'} style={{ pointerEvents: 'none' }}>{p.char}</text>
                      {p.isEnd && <circle cx={p.x} cy={p.y + 18} r={3} fill="#22c55e" />}
                    </>
                  )}
                </g>
              );
            })}
          </svg>
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

      {found !== null && (
        <div className="rounded-[10px] px-5 py-3 text-center font-body text-[.8125rem] font-semibold" style={{ background: found ? '#f0fdf4' : '#fff1f2', border: `1px solid ${found ? '#86efac' : '#fecdd3'}`, color: found ? '#15803d' : '#e11d48' }}>
          "{searchValue}" {found ? 'found' : 'not found'} in trie
        </div>
      )}

      {words.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 rounded-[10px] border border-border bg-white px-5 py-3">
          <span className="text-[.75rem] font-semibold text-muted">Words:</span>
          {words.map((w, i) => <span key={i} className="rounded bg-bg px-2 py-0.5 font-mono text-[.6875rem] font-medium text-ink2">{w}</span>)}
        </div>
      )}
    </div>
  );
}
