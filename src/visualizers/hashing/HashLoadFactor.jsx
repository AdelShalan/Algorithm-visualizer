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
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '10px', padding: '1rem 1.25rem' }}>
        <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '.5625rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '.75rem' }}>Input</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
          <input type="number" value={inputValue} onChange={e => setInputValue(e.target.value)} style={{ width: 70, padding: '.375rem .625rem', border: '1px solid var(--border)', borderRadius: '6px', fontFamily: 'IBM Plex Mono, monospace', fontSize: '.8125rem', color: 'var(--ink)', background: 'var(--bg)', outline: 'none' }} placeholder="Key" />
          <button onClick={handleInsert} disabled={rehashing} style={{ padding: '.3rem .75rem', fontSize: '.6875rem', borderRadius: '5px', border: 'none', background: 'var(--purple)', color: '#fff', cursor: rehashing ? 'not-allowed' : 'pointer', opacity: rehashing ? 0.5 : 1, fontFamily: 'Instrument Sans, sans-serif' }}>Insert</button>
          <div style={{ flex: 1 }} />
          <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '.6875rem', color: 'var(--muted)' }}>Load: <span style={{ fontWeight: 700, color: shouldRehash ? '#e11d48' : 'var(--purple)' }}>{loadFactor.toFixed(2)}</span></span>
          <div style={{ width: 100, height: 6, background: 'var(--border)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${Math.min(100, loadFactor * 100)}%`, background: shouldRehash ? '#e11d48' : loadFactor > 0.5 ? 'var(--amber)' : 'var(--purple)', borderRadius: '3px' }} />
          </div>
          <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '.625rem', color: 'var(--muted)' }}>Size: {tableSize}</span>
          <button onClick={handleClear} style={{ padding: '.3rem .75rem', fontSize: '.6875rem', borderRadius: '5px', border: '1px solid #fecdd3', background: '#fff1f2', color: '#e11d48', cursor: 'pointer', fontFamily: 'Instrument Sans, sans-serif' }}>Clear</button>
        </div>
      </div>

      {shouldRehash && !rehashing && <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '10px', padding: '.75rem 1.25rem', fontSize: '.8125rem', color: '#92400e', fontWeight: 500 }}>Load factor exceeds 0.7 — next insert will trigger rehashing!</div>}
      {rehashing && <div style={{ background: 'var(--purple-light)', border: '1px solid #c4b5fd', borderRadius: '10px', padding: '.75rem 1.25rem', fontSize: '.8125rem', color: '#3c2a8a', fontWeight: 500 }}>Rehashing to table size {tableSize * 2 + 1}...</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '1.25rem', flex: 1, minHeight: 0 }}>
        <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '10px', padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ display: 'flex', gap: '4px' }}>
            {table.map((key, i) => (
              <div key={i} style={{ width: 56, height: 72, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: '12px', border: key !== null ? '1px solid var(--border)' : '1px dashed var(--border)', background: key !== null ? 'var(--white)' : 'var(--surface)' }}>
                <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '.5625rem', color: 'var(--muted)' }}>{i}</span>
                {key !== null ? <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '1rem', fontWeight: 700, color: 'var(--ink2)' }}>{key}</span> : <span style={{ fontSize: '.875rem', color: 'var(--muted)' }}>∅</span>}
              </div>
            ))}
          </div>
        </div>

        {log.length > 0 && (
          <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '10px', padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '.5625rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '.5rem', flexShrink: 0 }}>Operation log</div>
            <div ref={logRef} style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '3px' }}>
              {log.map((entry, i) => {
                const isLast = i === log.length - 1;
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
