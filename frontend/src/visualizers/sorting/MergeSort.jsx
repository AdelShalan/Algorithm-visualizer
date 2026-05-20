import { useState, useCallback, useEffect, useRef } from 'react';
import { useAlgorithm } from '../../contexts/AlgorithmContext';
import { generateRandomArray } from '../../utils/helpers';

export default function MergeSort() {
  const { startAnimation, setGenerator } = useAlgorithm();
  const [size, setSize] = useState(32);
  const [array, setArray] = useState(() => generateRandomArray(32));

  const generateSteps = useCallback((arr) => {
    const steps = [];
    const a = [...arr];
    const log = [];

    function merge(left, mid, right) {
      const leftArr = a.slice(left, mid + 1);
      const rightArr = a.slice(mid + 1, right + 1);
      let i = 0, j = 0, k = left;
      log.push(`merge(${left}, ${mid}, ${right}) — merging [${leftArr}] and [${rightArr}]`);
      steps.push({ type: 'split', range: [left, right], array: [...a], log: [...log] });
      while (i < leftArr.length && j < rightArr.length) {
        if (leftArr[i] <= rightArr[j]) { a[k] = leftArr[i]; i++; }
        else { a[k] = rightArr[j]; j++; }
        log.push(`Placed ${a[k]} at index ${k}`);
        steps.push({ type: 'merge', index: k, array: [...a], log: [...log] });
        k++;
      }
      while (i < leftArr.length) { a[k] = leftArr[i]; log.push(`Copied ${a[k]} from left subarray`); steps.push({ type: 'merge', index: k, array: [...a], log: [...log] }); i++; k++; }
      while (j < rightArr.length) { a[k] = rightArr[j]; log.push(`Copied ${a[k]} from right subarray`); steps.push({ type: 'merge', index: k, array: [...a], log: [...log] }); j++; k++; }
      log.pop();
    }

    function sort(left, right) {
      if (left < right) {
        const mid = Math.floor((left + right) / 2);
        log.push(`sort(${left}, ${right}) — splitting at ${mid}`);
        steps.push({ type: 'divide', range: [left, right], mid, array: [...a], log: [...log] });
        sort(left, mid);
        sort(mid + 1, right);
        merge(left, mid, right);
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
      const next = Math.min(64, Math.max(8, prev + delta));
      const rounded = Math.pow(2, Math.round(Math.log2(next)));
      setArray(generateRandomArray(rounded));
      return rounded;
    });
  }, []);

  const { currentStep, steps } = useAlgorithm();
  const currentData = steps?.[currentStep] || { array, type: 'idle', log: [] };
  const safeArray = currentData.array != null ? currentData.array : array;
  const maxVal = Math.max(...safeArray);
  const logRef = useRef(null);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [currentData.log]);

  const getBoxStyle = (i) => {
    const isMerging = currentData.type === 'merge' && currentData.index === i;
    const isDividing = currentData.type === 'divide' && currentData.range && i >= currentData.range[0] && i <= currentData.range[1];
    const isComplete = currentData.type === 'complete';
    if (isComplete) return { bg: '#dcfce7', text: '#15803d', border: '#86efac' };
    if (isMerging) return { bg: '#ede9fe', text: '#7c3aed', border: '#a78bfa' };
    if (isDividing) return { bg: '#fef3c7', text: '#92400e', border: 'var(--amber)' };
    return { bg: 'var(--bg)', text: 'var(--ink2)', border: 'var(--border)' };
  };

  const getBarBg = (i) => {
    const isMerging = currentData.type === 'merge' && currentData.index === i;
    const isDividing = currentData.type === 'divide' && currentData.range && i >= currentData.range[0] && i <= currentData.range[1];
    const isComplete = currentData.type === 'complete';
    if (isComplete) return '#86efac';
    if (isMerging) return 'var(--purple)';
    if (isDividing) return 'var(--amber)';
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
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '.5625rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '1rem' }}>Divide and merge phases</div>
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
