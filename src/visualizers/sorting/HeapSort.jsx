import { useState, useCallback, useEffect, useRef } from 'react';
import { useAlgorithm } from '../../contexts/AlgorithmContext';
import { generateRandomArray } from '../../utils/helpers';

export default function HeapSort() {
  const { startAnimation, setGenerator } = useAlgorithm();
  const [size, setSize] = useState(30);
  const [array, setArray] = useState(() => generateRandomArray(30));

  const generateSteps = useCallback((arr) => {
    const steps = [];
    const a = [...arr];
    const n = a.length;
    const log = [];

    function heapify(size, i) {
      let largest = i;
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      log.push(`heapify(${i}, size=${size})`);
      steps.push({ type: 'heapify', index: i, array: [...a], log: [...log] });
      if (left < size) {
        log.push(`Comparing arr[${largest}] (${a[largest]}) and arr[${left}] (${a[left]})`);
        if (a[left] > a[largest]) largest = left;
      }
      if (right < size) {
        log.push(`Comparing arr[${largest}] (${a[largest]}) and arr[${right}] (${a[right]})`);
        if (a[right] > a[largest]) largest = right;
      }
      if (largest !== i) {
        [a[i], a[largest]] = [a[largest], a[i]];
        log.push(`Swapped arr[${i}] ↔ arr[${largest}]`);
        steps.push({ type: 'swap', indices: [i, largest], array: [...a], log: [...log] });
        heapify(size, largest);
      }
      log.pop();
    }

    log.push('Building max heap');
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) heapify(n, i);
    log.pop();
    log.push(`Max heap built ✓`);
    steps.push({ type: 'heap-built', array: [...a], log: [...log] });

    for (let i = n - 1; i > 0; i--) {
      [a[0], a[i]] = [a[i], a[0]];
      log.push(`Extracted max ${a[i]} → arr[${i}]`);
      steps.push({ type: 'swap', indices: [0, i], array: [...a], log: [...log] });
      log.push(`arr[${i}] = ${a[i]} is sorted ✓`);
      steps.push({ type: 'sorted', index: i, array: [...a], log: [...log] });
      heapify(i, 0);
    }
    log.push(`Array is fully sorted ✓`);
    steps.push({ type: 'sorted', index: 0, array: [...a], log: [...log] });
    steps.push({ type: 'complete', array: [...a], log: [...log] });
    return steps;
  }, []);

  const handleRun = useCallback(() => {
    startAnimation(generateSteps(array));
  }, [array, generateSteps, startAnimation]);

  useEffect(() => { setGenerator(handleRun); }, [handleRun, setGenerator]);

  const handleShuffle = useCallback(() => {
    setArray(generateRandomArray(size));
  }, [size]);

  const handleSizeChange = useCallback((delta) => {
    setSize(prev => {
      const next = Math.min(80, Math.max(10, prev + delta));
      setArray(generateRandomArray(next));
      return next;
    });
  }, []);

  const { currentStep, steps } = useAlgorithm();
  const currentData = steps?.[currentStep] || { array, type: 'idle', indices: [], log: [] };
  const safeArray = currentData.array != null ? currentData.array : array;
  const maxVal = Math.max(...safeArray);
  const logRef = useRef(null);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [currentData.log]);

  const getBoxStyle = (i) => {
    const isComparing = currentData.indices?.includes(i);
    const isHeapify = currentData.type === 'heapify' && currentData.index === i;
    const isHeapBuilt = currentData.type === 'heap-built';
    const isSorted = currentData.type === 'sorted' && currentData.index === i;
    const isComplete = currentData.type === 'complete';
    if (isComplete || isSorted) return { bg: '#dcfce7', text: '#15803d', border: '#86efac' };
    if (isHeapBuilt) return { bg: '#ecfeff', text: '#0891b2', border: '#22d3ee' };
    if (isHeapify) return { bg: '#ede9fe', text: '#7c3aed', border: '#a78bfa' };
    if (isComparing) return { bg: '#fef3c7', text: '#92400e', border: 'var(--amber)' };
    return { bg: 'var(--bg)', text: 'var(--ink2)', border: 'var(--border)' };
  };

  const getBarBg = (i) => {
    const isComparing = currentData.indices?.includes(i);
    const isHeapify = currentData.type === 'heapify' && currentData.index === i;
    const isHeapBuilt = currentData.type === 'heap-built';
    const isSorted = currentData.type === 'sorted' && currentData.index === i;
    const isComplete = currentData.type === 'complete';
    if (isComplete) return '#86efac';
    if (isSorted) return '#bbf7d0';
    if (isHeapBuilt) return '#22d3ee';
    if (isHeapify) return '#a78bfa';
    if (isComparing) return 'var(--amber)';
    return 'var(--purple)';
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '10px', padding: '1rem 1.25rem' }}>
        <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '.5625rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '.75rem' }}>Array</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
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
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '.5625rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '1rem' }}>Heap visualization</div>
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
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '.5625rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '.5rem', flexShrink: 0 }}>Call stack</div>
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
