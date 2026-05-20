import { useState, useCallback, useEffect, useRef } from 'react';
import { useAlgorithm } from '../../contexts/AlgorithmContext';
import { generateRandomArray } from '../../utils/helpers';

export default function QuickSort() {
  const { startAnimation, setGenerator } = useAlgorithm();
  const [size, setSize] = useState(30);
  const [array, setArray] = useState(() => generateRandomArray(30));

  const generateSteps = useCallback((arr) => {
    const steps = [];
    const a = [...arr];
    const log = [];

    function partition(low, high) {
      const pivot = a[high];
      log.push(`partition(${low}, ${high}) — pivot = ${pivot}`);
      steps.push({ type: 'pivot', index: high, array: [...a], log: [...log] });
      let i = low - 1;
      for (let j = low; j < high; j++) {
        log.push(`Comparing arr[${j}] (${a[j]}) ≤ pivot (${pivot})`);
        if (a[j] <= pivot) {
          i++;
          if (i !== j) {
            [a[i], a[j]] = [a[j], a[i]];
            log.push(`Swapped arr[${i}] ↔ arr[${j}]`);
            steps.push({ type: 'swap', indices: [i, j], array: [...a], log: [...log] });
          } else {
            steps.push({ type: 'compare', indices: [j, high], array: [...a], log: [...log] });
          }
        } else {
          steps.push({ type: 'compare', indices: [j, high], array: [...a], log: [...log] });
        }
      }
      [a[i + 1], a[high]] = [a[high], a[i + 1]];
      log.push(`Pivot ${pivot} placed at index ${i + 1}`);
      steps.push({ type: 'swap', indices: [i + 1, high], array: [...a], log: [...log] });
      log.pop();
      return i + 1;
    }

    function sort(low, high) {
      if (low < high) {
        log.push(`quickSort(${low}, ${high})`);
        const pi = partition(low, high);
        log.push(`Partitioned at ${pi} — left(${low}, ${pi - 1}), right(${pi + 1}, ${high})`);
        steps.push({ type: 'partitioned', index: pi, array: [...a], log: [...log] });
        sort(low, pi - 1);
        sort(pi + 1, high);
        log.pop();
      }
    }

    sort(0, a.length - 1);
    log.push(`Array is fully sorted ✓`);
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
    const isPivot = currentData.type === 'pivot' && currentData.index === i;
    const isPartitioned = currentData.type === 'partitioned' && currentData.index === i;
    const isComplete = currentData.type === 'complete';
    if (isComplete) return { bg: '#dcfce7', text: '#15803d', border: '#86efac' };
    if (isPivot) return { bg: '#fef3c7', text: '#92400e', border: 'var(--amber)' };
    if (isPartitioned) return { bg: '#dcfce7', text: '#15803d', border: '#86efac' };
    if (isComparing) return { bg: '#fef3c7', text: '#92400e', border: 'var(--amber)' };
    return { bg: 'var(--bg)', text: 'var(--ink2)', border: 'var(--border)' };
  };

  const getBarBg = (i) => {
    const isComparing = currentData.indices?.includes(i);
    const isPivot = currentData.type === 'pivot' && currentData.index === i;
    const isPartitioned = currentData.type === 'partitioned' && currentData.index === i;
    const isComplete = currentData.type === 'complete';
    if (isComplete) return '#86efac';
    if (isPivot) return 'var(--amber)';
    if (isPartitioned) return '#bbf7d0';
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
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '.5625rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '1rem' }}>Partition visualization</div>
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
