import { useState, useCallback, useEffect, useRef } from 'react';
import { useAlgorithm } from '../../contexts/AlgorithmContext';
import { generateSteps } from '../../algorithms/sliding-window/two-sum-sorted.js';

const ARRAY = [2, 7, 11, 15, 3, 6, 9, 1];
const TARGET = 9;

export default function TwoSumSorted() {
  const { startAnimation, setGenerator } = useAlgorithm();
  const [arr] = useState([...ARRAY].sort((a, b) => a - b));
  const [target, setTarget] = useState(TARGET);

  const handleRun = useCallback(() => { startAnimation(generateSteps(arr, target)); }, [arr, target, startAnimation]);
  useEffect(() => { setGenerator(handleRun); }, [handleRun, setGenerator]);

  const { currentStep, steps } = useAlgorithm();
  const currentData = steps?.[currentStep] || { type: 'idle', array: arr, left: 0, right: arr.length - 1, log: [] };
  const safeArray = currentData.array != null ? currentData.array : arr;
  const logRef = useRef(null);
  useEffect(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; }, [currentData.log]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '10px', padding: '1rem 1.25rem' }}>
        <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '.5625rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '.75rem' }}>Input</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
            <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '.75rem', color: 'var(--ink2)' }}>Target:</span>
            <input type="number" value={target} onChange={e => setTarget(parseInt(e.target.value) || 0)} style={{ width: 70, padding: '.375rem .625rem', border: '1px solid var(--border)', borderRadius: '6px', fontFamily: 'IBM Plex Mono, monospace', fontSize: '.8125rem', color: 'var(--ink)', background: 'var(--bg)', outline: 'none' }} />
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '1.25rem', flex: 1, minHeight: 0 }}>
        <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '10px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ display: 'flex', gap: 8 }}>
              {safeArray.map((val, i) => {
                const isLeft = currentData.left === i;
                const isRight = currentData.right === i;
                const isFound = currentData.type === 'found' && (i === currentData.left || i === currentData.right);
                const between = i > currentData.left && i < currentData.right;
                let bg = 'var(--bg)', border = '2px solid var(--border)', opacity = 0.5;
                if (isFound) { bg = '#f0fdf4'; border = '2px solid #86efac'; opacity = 1; }
                else if (isLeft) { bg = '#f3e8ff'; border = '2px solid #a855f7'; opacity = 1; }
                else if (isRight) { bg = 'var(--purple-light)'; border = '2px solid var(--purple)'; opacity = 1; }
                else if (between) { bg = 'var(--purple-light)'; border = '2px solid var(--purple)'; opacity = 1; }
                return (
                  <div key={i} style={{ width: 64, height: 80, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: '16px', border, background: bg, opacity }}>
                    <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '1.125rem', fontWeight: 700, color: 'var(--ink)' }}>{val}</span>
                    {isLeft && <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '.625rem', color: '#7c3aed', fontWeight: 600 }}>left</span>}
                    {isRight && <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '.625rem', color: 'var(--purple)', fontWeight: 600 }}>right</span>}
                  </div>
                );
              })}
            </div>
          </div>

          {currentData.type === 'found' && (
            <div style={{ textAlign: 'center', padding: '.75rem', background: 'var(--bg)', borderRadius: '10px' }}>
              <span style={{ fontFamily: 'Instrument Sans, sans-serif', fontSize: '.875rem', color: 'var(--ink2)' }}>
                Found: <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontWeight: 700, color: 'var(--purple)' }}>{safeArray[currentData.left]}</span> + <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontWeight: 700, color: '#7c3aed' }}>{safeArray[currentData.right]}</span> = <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontWeight: 700, color: '#15803d' }}>{target}</span>
              </span>
            </div>
          )}

          {currentData.sum !== undefined && currentData.type !== 'found' && currentData.type !== 'init' && currentData.type !== 'not-found' && (
            <div style={{ textAlign: 'center', padding: '.5rem', background: 'var(--bg)', borderRadius: '8px', fontFamily: 'Instrument Sans, sans-serif', fontSize: '.75rem', color: 'var(--ink2)' }}>
              {safeArray[currentData.left]} + {safeArray[currentData.right]} = {currentData.sum}
              {currentData.type === 'too-small' && ' < target → move left pointer right'}
              {currentData.type === 'too-large' && ' > target → move right pointer left'}
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
