import { useState, useCallback, useEffect, useRef } from 'react';
import { useAlgorithm } from '../../contexts/AlgorithmContext';
import { generateSteps } from '../../algorithms/string/kmp.js';

const TEXT = 'ABABDABACDABABCABAB';
const PATTERN = 'ABABCABAB';

export default function KMP() {
  const { startAnimation, setGenerator } = useAlgorithm();
  const [text, setText] = useState(TEXT);
  const [pattern, setPattern] = useState(PATTERN);

  const handleRun = useCallback(() => { startAnimation(generateSteps(text, pattern)); }, [text, pattern, startAnimation]);
  useEffect(() => { setGenerator(handleRun); }, [handleRun, setGenerator]);

  const { currentStep, steps } = useAlgorithm();
  const currentData = steps?.[currentStep] || { type: 'idle', lps: [], log: [] };
  const logRef = useRef(null);
  useEffect(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; }, [currentData.log]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '10px', padding: '1rem 1.25rem' }}>
        <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '.5625rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '.75rem' }}>Input</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
            <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '.75rem', color: 'var(--ink2)', width: 50 }}>Text:</span>
            <input value={text} onChange={e => setText(e.target.value.toUpperCase())} style={{ flex: 1, padding: '.375rem .625rem', border: '1px solid var(--border)', borderRadius: '6px', fontFamily: 'IBM Plex Mono, monospace', fontSize: '.8125rem', color: 'var(--ink)', background: 'var(--bg)', outline: 'none' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
            <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '.75rem', color: 'var(--ink2)', width: 50 }}>Pattern:</span>
            <input value={pattern} onChange={e => setPattern(e.target.value.toUpperCase())} style={{ flex: 1, padding: '.375rem .625rem', border: '1px solid var(--border)', borderRadius: '6px', fontFamily: 'IBM Plex Mono, monospace', fontSize: '.8125rem', color: 'var(--ink)', background: 'var(--bg)', outline: 'none' }} />
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '1.25rem', flex: 1, minHeight: 0 }}>
        <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '10px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', overflowY: 'auto' }}>
          <div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '.8125rem', color: 'var(--ink)', marginBottom: '.5rem' }}>Text</div>
            <div style={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {text.split('').map((ch, i) => {
                const isMatch = currentData.type === 'match' && i >= currentData.textIdx && i < currentData.textIdx + pattern.length;
                const isComparing = currentData.type === 'compare' && currentData.textIdx === i;
                const isShift = currentData.type === 'shift' && currentData.textIdx === i;
                let bg = 'var(--bg)', color = 'var(--ink2)', border = '1px solid var(--border)';
                if (isMatch) { bg = '#f0fdf4'; color = '#15803d'; border = '2px solid #86efac'; }
                else if (isComparing) { bg = 'var(--purple)'; color = '#fff'; border = '2px solid var(--purple)'; }
                else if (isShift) { bg = '#fef3c7'; color = '#92400e'; }
                return <div key={i} style={{ width: 32, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', fontFamily: 'IBM Plex Mono, monospace', fontSize: '.75rem', fontWeight: 700, background: bg, color, border }}>{ch}</div>;
              })}
            </div>
          </div>

          <div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '.8125rem', color: 'var(--ink)', marginBottom: '.5rem' }}>Pattern</div>
            <div style={{ display: 'flex', gap: 2 }}>
              {pattern.split('').map((ch, i) => {
                const isComparing = currentData.type === 'compare' && currentData.patIdx === i;
                return <div key={i} style={{ width: 32, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', fontFamily: 'IBM Plex Mono, monospace', fontSize: '.75rem', fontWeight: 700, background: isComparing ? 'var(--purple)' : 'var(--bg)', color: isComparing ? '#fff' : 'var(--ink2)', border: isComparing ? '2px solid var(--purple)' : '1px solid var(--border)' }}>{ch}</div>;
              })}
            </div>
          </div>

          {currentData.lps.length > 0 && (
            <div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '.8125rem', color: 'var(--ink)', marginBottom: '.5rem' }}>LPS Array</div>
              <div style={{ display: 'flex', gap: 2 }}>
                {currentData.lps.map((val, i) => {
                  const isSetting = currentData.type === 'lps-set' && currentData.i === i;
                  return <div key={i} style={{ width: 32, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', fontFamily: 'IBM Plex Mono, monospace', fontSize: '.75rem', fontWeight: 600, background: isSetting ? '#fef3c7' : 'var(--bg)', color: isSetting ? '#92400e' : 'var(--muted)', border: isSetting ? '2px solid var(--amber)' : '1px solid var(--border)' }}>{val}</div>;
                })}
              </div>
            </div>
          )}

          {currentData.type === 'match' && (
            <div style={{ textAlign: 'center', padding: '.5rem', background: '#f0fdf4', borderRadius: '8px', fontFamily: 'Instrument Sans, sans-serif', fontSize: '.75rem', fontWeight: 600, color: '#15803d' }}>Match found at index {currentData.textIdx}!</div>
          )}
        </div>

        {currentData.log && (
          <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '10px', padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '.5625rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '.5rem', flexShrink: 0 }}>Pattern matching log</div>
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
