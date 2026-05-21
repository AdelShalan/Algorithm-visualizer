import { useState, useCallback, useEffect, useRef } from 'react';
import { useAlgorithm } from '../../contexts/AlgorithmContext';
import { generateRandomArray } from '../../utils/helpers';
import { generateSteps } from '../../algorithms/searching/LinearSearch';

export default function LinearSearch() {
  const { startAnimation, setGenerator } = useAlgorithm();
  const [size, setSize] = useState(25);
  const [array, setArray] = useState(() => generateRandomArray(25, 1, 100));
  const [target, setTarget] = useState(42);

  const handleRun = useCallback(() => {
    startAnimation(generateSteps(array, target));
  }, [array, target, generateSteps, startAnimation]);

  useEffect(() => { setGenerator(handleRun); }, [handleRun, setGenerator]);

  const handleShuffle = useCallback(() => {
    const newArr = generateRandomArray(size, 1, 100);
    setArray(newArr);
    setTarget(newArr[Math.floor(Math.random() * newArr.length)]);
  }, [size]);

  const handleSizeChange = useCallback((delta) => {
    setSize(prev => {
      const next = Math.min(50, Math.max(10, prev + delta));
      const newArr = generateRandomArray(next, 1, 100);
      setArray(newArr);
      setTarget(newArr[Math.floor(Math.random() * newArr.length)]);
      return next;
    });
  }, []);

  const { currentStep, steps } = useAlgorithm();
  const currentData = steps?.[currentStep] || { array, type: 'idle', index: -1, log: [] };
  const safeArray = currentData.array != null ? currentData.array : array;
  const maxVal = Math.max(...safeArray);
  const logRef = useRef(null);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [currentData.log]);

  const getBoxStyle = (i) => {
    const isChecking = currentData.type === 'check' && currentData.index === i;
    const isFound = currentData.type === 'found' && currentData.index === i;
    const isNotFound = currentData.type === 'not-found';
    if (isFound) return { bg: '#dcfce7', text: '#15803d', border: '#86efac' };
    if (isChecking) return { bg: '#fef3c7', text: '#92400e', border: 'var(--amber)' };
    if (isNotFound) return { bg: '#fef2f2', text: '#dc2626', border: '#fca5a5' };
    return { bg: 'var(--bg)', text: 'var(--ink2)', border: 'var(--border)' };
  };

  const getBarBg = (i) => {
    const isChecking = currentData.type === 'check' && currentData.index === i;
    const isFound = currentData.type === 'found' && currentData.index === i;
    const isNotFound = currentData.type === 'not-found';
    if (isFound) return '#86efac';
    if (isChecking) return 'var(--amber)';
    if (isNotFound) return '#fca5a5';
    return 'var(--purple)';
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '10px', padding: '1rem 1.25rem' }}>
        <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '.5625rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '.75rem' }}>Input</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
            <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '.8125rem', color: 'var(--ink2)' }}>Target:</span>
            <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '1rem', fontWeight: 500, color: 'var(--purple)' }}>{target}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', flex: 1 }}>
            <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '.8125rem', color: 'var(--ink2)' }}>n =</span>
            <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '1rem', fontWeight: 500, color: 'var(--purple)', minWidth: '2ch', textAlign: 'center' }}>{size}</span>
            <button onClick={() => handleSizeChange(-5)} style={{ width: 28, height: 28, borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--white)', color: 'var(--ink2)', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
            <button onClick={() => handleSizeChange(5)} style={{ width: 28, height: 28, borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--white)', color: 'var(--ink2)', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
          </div>
          <button onClick={handleShuffle} style={{ padding: '.3rem .75rem', fontSize: '.6875rem', borderRadius: '5px', border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer', color: 'var(--ink2)', fontFamily: 'Instrument Sans, sans-serif' }}>Shuffle</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '1.25rem', flex: 1, minHeight: 0 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', overflow: 'hidden' }}>
          <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '10px', padding: '1.25rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '.5625rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '1rem' }}>Array</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '2px', flexShrink: 0 }}>
              {safeArray.map((value, i) => {
                const hl = getBoxStyle(i);
                return (
                  <div key={i} style={{ flex: 1, maxWidth: 48, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', fontFamily: 'IBM Plex Mono, monospace', fontSize: '.6875rem', fontWeight: 600, background: hl.bg, color: hl.text, border: `1px solid ${hl.border}` }}>
                    {value}
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '10px', padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '.5625rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '1rem' }}>Search visualization</div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '2px', minHeight: 0 }}>
              {safeArray.map((value, i) => {
                const height = (value / maxVal) * 100;
                return (
                  <div key={i} style={{ width: 48, height: `${height}%`, background: getBarBg(i), borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ color: '#fff', fontFamily: 'IBM Plex Mono, monospace', fontSize: '.75rem', fontWeight: 700 }}>{value}</span>
                  </div>
                );
              })}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '2px', flexShrink: 0, marginTop: '4px' }}>
              {safeArray.map((_, i) => (
                <div key={i} style={{ width: 48, textAlign: 'center', fontFamily: 'IBM Plex Mono, monospace', fontSize: '.5rem', color: 'var(--muted)' }}>{i}</div>
              ))}
            </div>
          </div>
        </div>

        {currentData.log && (
          <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '10px', padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '.5625rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '.5rem', flexShrink: 0 }}>Search log</div>
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
