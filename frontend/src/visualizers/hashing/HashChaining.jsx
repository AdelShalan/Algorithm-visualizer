import { useState, useCallback, useRef, useEffect } from 'react';

const TABLE_SIZE = 8;

function hash(key) { return key % TABLE_SIZE; }

export default function HashChaining() {
  const [table, setTable] = useState(Array.from({ length: TABLE_SIZE }, () => []));
  const [keys, setKeys] = useState([]);
  const [inputValue, setInputValue] = useState(23);
  const [highlight, setHighlight] = useState(null);
  const [log, setLog] = useState([]);
  const logRef = useRef(null);
  useEffect(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; }, [log]);

  const handleInsert = useCallback(() => {
    const key = parseInt(inputValue);
    if (isNaN(key)) return;
    const idx = hash(key);
    setTable(prev => prev.map((bucket, i) => i === idx ? [...bucket, key] : bucket));
    setKeys(prev => [...prev, key]);
    setLog(prev => [...prev, `hash(${key}) = ${idx} → insert at index ${idx}`]);
    setHighlight(idx);
    setTimeout(() => setHighlight(null), 1500);
    setInputValue('');
  }, [inputValue]);

  const handleClear = useCallback(() => { setTable(Array.from({ length: TABLE_SIZE }, () => [])); setKeys([]); setHighlight(null); setLog([]); }, []);
  const handleRandom = useCallback(() => {
    const newTable = Array.from({ length: TABLE_SIZE }, () => []);
    const newKeys = [];
    const newLog = [];
    for (let i = 0; i < 10; i++) { const key = Math.floor(Math.random() * 100) + 1; newKeys.push(key); const idx = hash(key); newLog.push(`hash(${key}) = ${idx}`); newTable[idx].push(key); }
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
        <div className="flex items-start justify-center gap-4 overflow-auto rounded-[10px] border border-border bg-white p-5 pt-8">
          {table.map((bucket, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="flex h-9 w-[52px] items-center justify-center rounded-t-lg border-2 font-mono text-[.75rem] font-bold" style={{ borderColor: highlight === i ? 'var(--purple)' : 'var(--border)', background: highlight === i ? 'var(--purple-light)' : 'var(--bg)', color: highlight === i ? 'var(--purple)' : 'var(--ink2)' }}>{i}</div>
              {bucket.map((key, j) => (
                <div key={`${key}-${j}`} className="flex h-9 w-[52px] items-center justify-center border-2 border-t-0 border-border bg-white font-mono text-[.75rem] font-bold text-ink2">{key}</div>
              ))}
              {bucket.length === 0 && <div className="flex h-9 w-[52px] items-center justify-center border-2 border-t-0 border-dashed border-border bg-surface text-[.75rem] text-muted">∅</div>}
            </div>
          ))}
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
