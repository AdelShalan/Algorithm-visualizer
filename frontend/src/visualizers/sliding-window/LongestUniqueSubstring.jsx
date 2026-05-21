import { useState, useCallback, useEffect, useRef } from 'react';
import { useAlgorithm } from '../../contexts/AlgorithmContext';
import { generateSteps } from '../../algorithms/sliding-window/longest-unique-substring.js';

const TEXT = 'abcabcbb';

export default function LongestUniqueSubstring() {
  const { startAnimation, setGenerator } = useAlgorithm();
  const [text, setText] = useState(TEXT);

  const handleRun = useCallback(() => { startAnimation(generateSteps(text)); }, [text, startAnimation]);
  useEffect(() => { setGenerator(handleRun); }, [handleRun, setGenerator]);

  const { currentStep, steps } = useAlgorithm();
  const currentData = steps?.[currentStep] || { type: 'idle', text, left: 0, right: 0, window: '', log: [] };
  const logRef = useRef(null);
  useEffect(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; }, [currentData.log]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '10px', padding: '1rem 1.25rem' }}>
        <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '.5625rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '.75rem' }}>Input</div>
        <input value={text} onChange={e => setText(e.target.value.toLowerCase())} style={{ width: '100%', padding: '.375rem .625rem', border: '1px solid var(--border)', borderRadius: '6px', fontFamily: 'IBM Plex Mono, monospace', fontSize: '.8125rem', color: 'var(--ink)', background: 'var(--bg)', outline: 'none' }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '1.25rem', flex: 1, minHeight: 0 }}>
        <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '10px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ display: 'flex', gap: 6 }}>
              {text.split('').map((ch, i) => {
                const inWindow = currentData.window && i >= currentData.left && i <= (currentData.right ?? i);
                const isRight = currentData.right === i;
                const isLeft = currentData.left === i;
                const isDuplicate = currentData.type === 'duplicate' && currentData.right === i;
                const isComplete = currentData.type === 'complete' && i >= currentData.maxStart && i < currentData.maxStart + currentData.maxLen;
                let bg = 'var(--white)', color = 'var(--ink2)', border = '2px solid var(--border)';
                if (isComplete) { bg = '#f0fdf4'; border = '2px solid #86efac'; color = '#15803d'; }
                else if (isDuplicate) { bg = '#fef2f2'; border = '2px solid #f87171'; color = '#b91c1c'; }
                else if (isRight) { bg = 'var(--purple)'; border = '2px solid var(--purple)'; color = '#fff'; }
                else if (isLeft) { bg = '#f3e8ff'; border = '2px solid #a855f7'; color = '#7c3aed'; }
                else if (inWindow) { bg = 'var(--purple-light)'; border = '2px solid var(--purple)'; color = 'var(--purple)'; }
                return <div key={i} style={{ width: 48, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '16px', fontFamily: 'IBM Plex Mono, monospace', fontSize: '1.125rem', fontWeight: 700, background: bg, color, border }}>{ch}</div>;
              })}
            </div>
          </div>

          {currentData.type === 'complete' && (
            <div style={{ textAlign: 'center', padding: '.75rem', background: 'var(--bg)', borderRadius: '10px' }}>
              <span style={{ fontFamily: 'Instrument Sans, sans-serif', fontSize: '.875rem', color: 'var(--ink2)' }}>
                Longest unique substring: <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontWeight: 700, color: 'var(--purple)', fontSize: '1rem' }}>"{currentData.result}"</span> ({currentData.maxLen} chars)
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
