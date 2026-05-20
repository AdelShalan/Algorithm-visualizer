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
        <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '10px', padding: '1.25rem', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: '16px', overflow: 'auto', paddingTop: '2rem' }}>
          {table.map((bucket, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: 52, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px 8px 0 0', fontFamily: 'IBM Plex Mono, monospace', fontSize: '.75rem', fontWeight: 700, border: '2px solid', borderColor: highlight === i ? 'var(--purple)' : 'var(--border)', background: highlight === i ? 'var(--purple-light)' : 'var(--bg)', color: highlight === i ? 'var(--purple)' : 'var(--ink2)' }}>{i}</div>
              {bucket.map((key, j) => (
                <div key={`${key}-${j}`} style={{ width: 52, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--white)', border: '2px solid var(--border)', fontFamily: 'IBM Plex Mono, monospace', fontSize: '.75rem', fontWeight: 700, color: 'var(--ink2)', borderTop: 'none' }}>{key}</div>
              ))}
              {bucket.length === 0 && <div style={{ width: 52, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface)', border: '2px dashed var(--border)', fontSize: '.75rem', color: 'var(--muted)', borderTop: 'none' }}>∅</div>}
            </div>
          ))}
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
