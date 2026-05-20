import { useState, useCallback, useEffect, useRef } from 'react';
import { useAlgorithm } from '../../contexts/AlgorithmContext';

function generateSortedArray(size, min, max) {
  const arr = [];
  for (let i = 0; i < size; i++) {
    arr.push(min + Math.floor((max - min) * (i / size)) + Math.floor(Math.random() * 5));
  }
  return [...new Set(arr)].slice(0, size);
}

export default function BinarySearch() {
  const { startAnimation, setGenerator } = useAlgorithm();
  const [size, setSize] = useState(32);
  const [array, setArray] = useState(() => generateSortedArray(32, 1, 100));
  const [target, setTarget] = useState(50);

  const generateSteps = useCallback((arr, tgt) => {
    const steps = [];
    const log = [];
    let low = 0, high = arr.length - 1;
    log.push(`Searching for ${tgt} in sorted array of ${arr.length} elements`);
    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      log.push(`low=${low}, high=${high}, mid=${mid} → arr[${mid}] = ${arr[mid]}`);
      steps.push({ type: 'check-mid', low, high, mid, array: [...arr], found: arr[mid] === tgt, log: [...log] });
      if (arr[mid] === tgt) {
        log.push(`Target ${tgt} found at index ${mid} ✓`);
        steps.push({ type: 'found', index: mid, low, high, array: [...arr], log: [...log] });
        return steps;
      } else if (arr[mid] < tgt) {
        log.push(`${arr[mid]} < ${tgt} — searching right half [${mid + 1}, ${high}]`);
        low = mid + 1;
      } else {
        log.push(`${arr[mid]} > ${tgt} — searching left half [${low}, ${mid - 1}]`);
        high = mid - 1;
      }
    }
    log.push(`Target ${tgt} not found in array`);
    steps.push({ type: 'not-found', low, high, array: [...arr], log: [...log] });
    return steps;
  }, []);

  const handleRun = useCallback(() => {
    startAnimation(generateSteps(array, target));
  }, [array, target, generateSteps, startAnimation]);

  useEffect(() => { setGenerator(handleRun); }, [handleRun, setGenerator]);

  const handleShuffle = useCallback(() => {
    const newArr = generateSortedArray(size, 1, 100);
    setArray(newArr);
    setTarget(newArr[Math.floor(Math.random() * newArr.length)]);
  }, [size]);

  const handleSizeChange = useCallback((delta) => {
    setSize(prev => {
      const next = Math.min(64, Math.max(8, prev + delta));
      const rounded = Math.pow(2, Math.round(Math.log2(next)));
      const newArr = generateSortedArray(rounded, 1, 100);
      setArray(newArr);
      setTarget(newArr[Math.floor(Math.random() * newArr.length)]);
      return rounded;
    });
  }, []);

  const { currentStep, steps } = useAlgorithm();
  const currentData = steps?.[currentStep] || { array, type: 'idle', low: 0, high: array.length - 1, mid: -1, log: [] };
  const safeArray = currentData.array != null ? currentData.array : array;
  const maxVal = Math.max(...safeArray);
  const logRef = useRef(null);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [currentData.log]);

  const getBoxStyle = (i) => {
    const inRange = i >= (currentData.low ?? 0) && i <= (currentData.high ?? array.length - 1);
    const isMid = currentData.mid === i;
    const isFound = currentData.type === 'found' && currentData.index === i;
    const isNotFound = currentData.type === 'not-found';
    if (isFound) return { bg: '#dcfce7', text: '#15803d', border: '#86efac' };
    if (isMid) return { bg: '#fef3c7', text: '#92400e', border: 'var(--amber)' };
    if (isNotFound) return { bg: '#fef2f2', text: '#dc2626', border: '#fca5a5' };
    if (inRange) return { bg: '#ede9fe', text: '#7c3aed', border: '#a78bfa' };
    return { bg: 'var(--bg)', text: 'var(--muted)', border: 'var(--border)' };
  };

  const getBarBg = (i) => {
    const inRange = i >= (currentData.low ?? 0) && i <= (currentData.high ?? array.length - 1);
    const isMid = currentData.mid === i;
    const isFound = currentData.type === 'found' && currentData.index === i;
    const isNotFound = currentData.type === 'not-found';
    if (isFound) return '#86efac';
    if (isMid) return 'var(--amber)';
    if (isNotFound) return '#fca5a5';
    if (inRange) return 'var(--purple)';
    return 'var(--border)';
  };

  const getBarOpacity = (i) => {
    const inRange = i >= (currentData.low ?? 0) && i <= (currentData.high ?? array.length - 1);
    const isFound = currentData.type === 'found' && currentData.index === i;
    const isMid = currentData.mid === i;
    const isNotFound = currentData.type === 'not-found';
    if (isFound || isMid || isNotFound || inRange) return 1;
    return 0.25;
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
            <button onClick={() => handleSizeChange(-4)} style={{ width: 28, height: 28, borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--white)', color: 'var(--ink2)', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
            <button onClick={() => handleSizeChange(4)} style={{ width: 28, height: 28, borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--white)', color: 'var(--ink2)', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
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
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '.5625rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '1rem' }}>Binary search visualization</div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '2px', minHeight: 0 }}>
              {safeArray.map((value, i) => {
                const height = (value / maxVal) * 100;
                return (
                  <div key={i} style={{ width: 48, height: `${height}%`, background: getBarBg(i), borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: getBarOpacity(i) }}>
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
