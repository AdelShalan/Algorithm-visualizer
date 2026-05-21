import { useState, useCallback, useRef, useEffect } from 'react';

const TABLE_SIZE = 11;

function hash(key) { return key % TABLE_SIZE; }

export default function HashOpenAddressing() {
  const [table, setTable] = useState(Array(TABLE_SIZE).fill(null));
  const [keys, setKeys] = useState([]);
  const [inputValue, setInputValue] = useState(23);
  const [probing, setProbing] = useState([]);
  const [log, setLog] = useState([]);
  const logRef = useRef(null);
  useEffect(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; }, [log]);

  const handleInsert = useCallback(() => {
    const key = parseInt(inputValue);
    if (isNaN(key)) return;
    const idx = hash(key);
    const probes = [idx];
    const ops = [`hash(${key}) = ${idx}`];
    let i = idx;
    let inserted = false;
    for (let step = 0; step < TABLE_SIZE; step++) {
      if (table[i] === null) { inserted = true; break; }
      ops.push(`Index ${i} occupied, probe to ${(idx + step + 1) % TABLE_SIZE}`);
      i = (idx + step + 1) % TABLE_SIZE;
      probes.push(i);
    }
    if (!inserted) { ops.push('Table full!'); setLog(ops); return; }
    ops.push(`Insert ${key} at index ${i}`);
    setTable(prev => { const next = [...prev]; next[i] = key; return next; });
    setKeys(prev => [...prev, key]);
    setProbing(probes);
    setLog(ops);
    setTimeout(() => setProbing([]), 2000);
    setInputValue('');
  }, [inputValue, table]);

  const handleClear = useCallback(() => { setTable(Array(TABLE_SIZE).fill(null)); setKeys([]); setProbing([]); setLog([]); }, []);
  const handleRandom = useCallback(() => {
    const newTable = Array(TABLE_SIZE).fill(null);
    const newKeys = [];
    const newLog = [];
    for (let i = 0; i < 7; i++) {
      const key = Math.floor(Math.random() * 100) + 1;
      newKeys.push(key);
      let idx = hash(key); let step = 0;
      newLog.push(`hash(${key}) = ${hash(key)}`);
      while (newTable[idx] !== null && step < TABLE_SIZE) { idx = (hash(key) + step + 1) % TABLE_SIZE; step++; }
      if (step < TABLE_SIZE) { newTable[idx] = key; newLog.push(`Insert at index ${idx}`); }
    }
    setTable(newTable); setKeys(newKeys); setLog(newLog);
  }, []);

  return (
    <div className="flex h-full flex-col gap-5">
      <div className="rounded-[10px] border border-border bg-white p-5">
        <div className="mb-3 font-mono text-[.5625rem] uppercase tracking-[.08em] text-muted">Input</div>
        <div className="flex items-center gap-2">
          <input type="number" value={inputValue} onChange={e => setInputValue(e.target.value)} className="w-[70px] rounded-md border border-border bg-bg px-2.5 py-1.5 font-mono text-[.8125rem] text-ink outline-none" placeholder="Key" />
          <button onClick={handleInsert} className="cursor-pointer rounded-[5px] border-none bg-purple px-3 py-[.3rem] text-[.6875rem] font-body text-white">Insert</button>
          <div className="flex-1" />
          <span className="font-mono text-[.6875rem] text-muted">Load factor: <span className="font-bold text-purple">{(keys.length / TABLE_SIZE).toFixed(2)}</span></span>
          <button onClick={handleRandom} className="cursor-pointer rounded-[5px] border border-border bg-white px-3 py-[.3rem] text-[.6875rem] font-body text-ink2">Random</button>
          <button onClick={handleClear} className="cursor-pointer rounded-[5px] border border-[#fecdd3] bg-[#fff1f2] px-3 py-[.3rem] text-[.6875rem] font-body text-[#e11d48]">Clear</button>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-[1fr_280px] gap-5">
        <div className="flex items-center justify-center rounded-[10px] border border-border bg-white p-5">
          <div className="flex gap-1">
            {table.map((key, i) => {
              const isProbing = probing.includes(i);
              const isProbeEnd = probing[probing.length - 1] === i && key !== null;
              let bg = key !== null ? 'var(--white)' : 'var(--surface)';
              let border = key !== null ? '1px solid var(--border)' : '1px dashed var(--border)';
              if (isProbeEnd) { bg = '#f0fdf4'; border = '2px solid #86efac'; }
              else if (isProbing) { bg = '#fffbeb'; border = '2px solid var(--amber)'; }
              return (
                <div key={i} className="flex h-[72px] w-14 flex-col items-center justify-center rounded-xl" style={{ border, background: bg }}>
                  <span className="font-mono text-[.5625rem] text-muted">{i}</span>
                  {key !== null ? <span className="font-mono text-[1rem] font-bold text-ink2">{key}</span> : <span className="text-[.875rem] text-muted">∅</span>}
                </div>
              );
            })}
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
          </div>
        )}
      </div>

      <div className="text-center font-mono text-[.625rem] text-muted">Linear probing: h(k, i) = (h(k) + i) mod m</div>
    </div>
  );
}
