import { useState, useCallback, useRef, useEffect } from 'react';

const INITIAL_SIZE = 5;

function hash(key, size) { return key % size; }

export default function HashLoadFactor() {
  const [tableSize, setTableSize] = useState(INITIAL_SIZE);
  const [table, setTable] = useState(Array(INITIAL_SIZE).fill(null));
  const [keys, setKeys] = useState([]);
  const [inputValue, setInputValue] = useState(7);
  const [rehashing, setRehashing] = useState(false);
  const [log, setLog] = useState([]);
  const logRef = useRef(null);
  useEffect(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; }, [log]);

  const loadFactor = keys.length / tableSize;
  const shouldRehash = loadFactor > 0.7;

  const rehash = useCallback((currentKeys, currentSize) => {
    const newSize = currentSize * 2 + 1;
    setRehashing(true);
    setLog(prev => [...prev, `Rehashing from size ${currentSize} to ${newSize}`]);
    setTimeout(() => {
      const newTable = Array(newSize).fill(null);
      const newLog = [`Rehashed ${currentKeys.length} keys to new table`];
      for (const key of currentKeys) {
        const idx = hash(key, newSize);
        let i = idx; let step = 0;
        while (newTable[i] !== null && step < newSize) { i = (idx + step + 1) % newSize; step++; }
        if (step < newSize) { newTable[i] = key; newLog.push(`hash(${key}) = ${idx} → placed at ${i}`); }
      }
      setTable(newTable); setTableSize(newSize); setRehashing(false); setLog(prev => [...prev, ...newLog]);
    }, 1500);
  }, []);

  const handleInsert = useCallback(() => {
    const key = parseInt(inputValue);
    if (isNaN(key)) return;
    const idx = hash(key, tableSize);
    let i = idx; let step = 0;
    while (table[i] !== null && step < tableSize) { i = (idx + step + 1) % tableSize; step++; }
    if (step >= tableSize) return;
    const newTable = [...table]; newTable[i] = key;
    setTable(newTable);
    const newKeys = [...keys, key]; setKeys(newKeys); setInputValue('');
    setLog(prev => [...prev, `hash(${key}) = ${idx} → insert at index ${i}${step > 0 ? ` after ${step} probes` : ''}`]);
    if ((newKeys.length / tableSize) > 0.7) rehash(newKeys, tableSize);
  }, [inputValue, table, keys, tableSize, rehash]);

  const handleClear = useCallback(() => { setTable(Array(INITIAL_SIZE).fill(null)); setKeys([]); setTableSize(INITIAL_SIZE); setRehashing(false); setLog([]); }, []);

  return (
    <div className="flex h-full flex-col gap-5">
      <div className="rounded-[10px] border border-border bg-white p-5">
        <div className="mb-3 font-mono text-[.5625rem] uppercase tracking-[.08em] text-muted">Input</div>
        <div className="flex items-center gap-2">
          <input type="number" value={inputValue} onChange={e => setInputValue(e.target.value)} className="w-[70px] rounded-md border border-border bg-bg px-2.5 py-1.5 font-mono text-[.8125rem] text-ink outline-none" placeholder="Key" />
          <button onClick={handleInsert} disabled={rehashing} className="cursor-pointer rounded-[5px] border-none bg-purple px-3 py-[.3rem] text-[.6875rem] font-body text-white" style={{ cursor: rehashing ? 'not-allowed' : 'pointer', opacity: rehashing ? 0.5 : 1 }}>Insert</button>
          <div className="flex-1" />
          <span className="font-mono text-[.6875rem] text-muted">Load: <span className="font-bold" style={{ color: shouldRehash ? '#e11d48' : 'var(--purple)' }}>{loadFactor.toFixed(2)}</span></span>
          <div className="h-1.5 w-[100px] overflow-hidden rounded-sm bg-border">
            <div className="h-full rounded-sm" style={{ width: `${Math.min(100, loadFactor * 100)}%`, background: shouldRehash ? '#e11d48' : loadFactor > 0.5 ? 'var(--amber)' : 'var(--purple)' }} />
          </div>
          <span className="font-mono text-[.625rem] text-muted">Size: {tableSize}</span>
          <button onClick={handleClear} className="cursor-pointer rounded-[5px] border border-[#fecdd3] bg-[#fff1f2] px-3 py-[.3rem] text-[.6875rem] font-body text-[#e11d48]">Clear</button>
        </div>
      </div>

      {shouldRehash && !rehashing && <div className="rounded-[10px] border border-[#fde68a] bg-[#fffbeb] px-5 py-3 text-[.8125rem] font-medium text-[#92400e]">Load factor exceeds 0.7 — next insert will trigger rehashing!</div>}
      {rehashing && <div className="rounded-[10px] border border-[#c4b5fd] bg-purple-light px-5 py-3 text-[.8125rem] font-medium text-[#3c2a8a]">Rehashing to table size {tableSize * 2 + 1}...</div>}

      <div className="grid min-h-0 flex-1 grid-cols-[1fr_280px] gap-5">
        <div className="flex items-center justify-center rounded-[10px] border border-border bg-white p-5">
          <div className="flex gap-1">
            {table.map((key, i) => (
              <div key={i} className="flex h-[72px] w-14 flex-col items-center justify-center rounded-xl" style={{ border: key !== null ? '1px solid var(--border)' : '1px dashed var(--border)', background: key !== null ? 'var(--white)' : 'var(--surface)' }}>
                <span className="font-mono text-[.5625rem] text-muted">{i}</span>
                {key !== null ? <span className="font-mono text-[1rem] font-bold text-ink2">{key}</span> : <span className="text-[.875rem] text-muted">∅</span>}
              </div>
            ))}
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
    </div>
  );
}
