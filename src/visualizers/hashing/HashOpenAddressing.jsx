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
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '10px', padding: '1rem 1.25rem' }}>
        <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '.5625rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '.75rem' }}>Input</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
          <input type="number" value={inputValue} onChange={e => setInputValue(e.target.value)} style={{ width: 70, padding: '.375rem .625rem', border: '1px solid var(--border)', borderRadius: '6px', fontFamily: 'IBM Plex Mono, monospace', fontSize: '.8125rem', color: 'var(--ink)', background: 'var(--bg)', outline: 'none' }} placeholder="Key" />
          <button onClick={handleInsert} style={{ padding: '.3rem .75rem', fontSize: '.6875rem', borderRadius: '5px', border: 'none', background: 'var(--purple)', color: '#fff', cursor: 'pointer', fontFamily: 'Instrument Sans, sans-serif' }}>Insert</button>
          <div style={{ flex: 1 }} />
          <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '.6875rem', color: 'var(--muted)' }}>Load factor: <span style={{ fontWeight: 700, color: 'var(--purple)' }}>{(keys.length / TABLE_SIZE).toFixed(2)}</span></span>
          <button onClick={handleRandom} style={{ padding: '.3rem .75rem', fontSize: '.6875rem', borderRadius: '5px', border: '1px solid var(--border)', background: 'var(--white)', color: 'var(--ink2)', cursor: 'pointer', fontFamily: 'Instrument Sans, sans-serif' }}>Random</button>
          <button onClick={handleClear} style={{ padding: '.3rem .75rem', fontSize: '.6875rem', borderRadius: '5px', border: '1px solid #fecdd3', background: '#fff1f2', color: '#e11d48', cursor: 'pointer', fontFamily: 'Instrument Sans, sans-serif' }}>Clear</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '1.25rem', flex: 1, minHeight: 0 }}>
        <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '10px', padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ display: 'flex', gap: '4px' }}>
            {table.map((key, i) => {
              const isProbing = probing.includes(i);
              const isProbeEnd = probing[probing.length - 1] === i && key !== null;
              let bg = key !== null ? 'var(--white)' : 'var(--surface)';
              let border = key !== null ? '1px solid var(--border)' : '1px dashed var(--border)';
              if (isProbeEnd) { bg = '#f0fdf4'; border = '2px solid #86efac'; }
              else if (isProbing) { bg = '#fffbeb'; border = '2px solid var(--amber)'; }
              return (
                <div key={i} style={{ width: 56, height: 72, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: '12px', border, background: bg }}>
                  <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '.5625rem', color: 'var(--muted)' }}>{i}</span>
                  {key !== null ? <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '1rem', fontWeight: 700, color: 'var(--ink2)' }}>{key}</span> : <span style={{ fontSize: '.875rem', color: 'var(--muted)' }}>∅</span>}
                </div>
              );
            })}
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

      <div style={{ textAlign: 'center', fontFamily: 'IBM Plex Mono, monospace', fontSize: '.625rem', color: 'var(--muted)' }}>Linear probing: h(k, i) = (h(k) + i) mod m</div>
    </div>
  );
}
