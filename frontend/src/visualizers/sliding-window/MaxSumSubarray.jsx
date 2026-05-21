import { useState, useCallback, useEffect, useRef } from 'react';
import { useAlgorithm } from '../../contexts/AlgorithmContext';
import { generateSteps } from '../../algorithms/sliding-window/max-sum-subarray.js';

const ARRAY = [-2, 1, -3, 4, -1, 2, 1, -5, 4];

export default function MaxSumSubarray() {
  const { startAnimation, setGenerator } = useAlgorithm();
  const [arr] = useState(ARRAY);

  const handleRun = useCallback(() => { startAnimation(generateSteps(arr)); }, [arr, startAnimation]);
  useEffect(() => { setGenerator(handleRun); }, [handleRun, setGenerator]);

  const { currentStep, steps } = useAlgorithm();
  const currentData = steps?.[currentStep] || { type: 'idle', array: arr, maxSum: 0, currentSum: 0, window: [0, 0], log: [] };
  const safeArray = currentData.array != null ? currentData.array : arr;
  const logRef = useRef(null);
  useEffect(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; }, [currentData.log]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '10px', padding: '1rem 1.25rem' }}>
        <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '.5625rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '.75rem' }}>Array</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {arr.map((val, i) => (
            <span key={i} style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '.8125rem', color: 'var(--ink2)', padding: '.25rem .5rem', background: 'var(--bg)', borderRadius: '4px' }}>{val > 0 ? '+' : ''}{val}</span>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '1.25rem', flex: 1, minHeight: 0 }}>
        <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '10px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ display: 'flex', gap: 8 }}>
              {safeArray.map((val, i) => {
                const inWindow = currentData.window && i >= currentData.window[0] && i <= currentData.window[1];
                const isBest = currentData.type === 'complete' && currentData.window && i >= currentData.window[0] && i <= currentData.window[1];
                const isAdding = currentData.type === 'add' && currentData.index === i;
                const isResetting = currentData.type === 'reset' && currentData.index === i;
                let bg = 'var(--white)', border = '2px solid var(--border)';
                if (isBest) { bg = '#f0fdf4'; border = '2px solid #86efac'; }
                else if (isAdding) { bg = 'var(--purple-light)'; border = '2px solid var(--purple)'; }
                else if (isResetting) { bg = '#fef2f2'; border = '2px solid #f87171'; }
                else if (inWindow) { bg = 'var(--purple-light)'; border = '2px solid var(--purple)'; }
                return (
                  <div key={i} style={{ width: 64, height: 80, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: '16px', border, background: bg }}>
                    <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '1.125rem', fontWeight: 700, color: val >= 0 ? 'var(--ink)' : '#b91c1c' }}>{val > 0 ? '+' : ''}{val}</span>
                    {isAdding && <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '.625rem', color: 'var(--purple)', fontWeight: 600 }}>sum={currentData.currentSum}</span>}
                  </div>
                );
              })}
            </div>
          </div>

          {currentData.type === 'complete' && (
            <div style={{ textAlign: 'center', padding: '.75rem', background: 'var(--bg)', borderRadius: '10px' }}>
              <span style={{ fontFamily: 'Instrument Sans, sans-serif', fontSize: '.875rem', color: 'var(--ink2)' }}>
                Maximum sum: <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontWeight: 700, color: 'var(--purple)', fontSize: '1rem' }}>{currentData.maxSum}</span>
              </span>
            </div>
          )}
        </div>

        {currentData.log && (
          <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '10px', padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '.5625rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '.5rem', flexShrink: 0 }}>Window log</div>
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
