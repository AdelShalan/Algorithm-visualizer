import { useState, useCallback, useEffect, useRef } from 'react';
import { useAlgorithm } from '../../contexts/AlgorithmContext';

const TEXT = 'ABABDABACDABABCABAB';
const PATTERN = 'ABABC';
const PRIME = 101;
const BASE = 256;

export default function RabinKarp() {
  const { startAnimation, setGenerator } = useAlgorithm();
  const [text, setText] = useState(TEXT);
  const [pattern, setPattern] = useState(PATTERN);

  const generateSteps = useCallback((txt, pat) => {
    const steps = [];
    const log = [];
    const m = pat.length; const n = txt.length;
    let hashPat = 0; let hashTxt = 0; let h = 1;
    for (let i = 0; i < m - 1; i++) h = (h * BASE) % PRIME;
    for (let i = 0; i < m; i++) { hashPat = (BASE * hashPat + pat.charCodeAt(i)) % PRIME; hashTxt = (BASE * hashTxt + txt.charCodeAt(i)) % PRIME; }
    log.push(`Pattern hash: ${hashPat}, Initial window hash: ${hashTxt}`);
    steps.push({ type: 'init', hashPat, hashTxt, textHash: hashTxt, log: [...log] });
    for (let i = 0; i <= n - m; i++) {
      log.push(`Slide window to index ${i}, hash=${hashTxt}`);
      steps.push({ type: 'slide', start: i, hashPat, hashTxt, textHash: hashTxt, log: [...log] });
      if (hashPat === hashTxt) {
        let match = true;
        for (let j = 0; j < m; j++) {
          steps.push({ type: 'verify', start: i, j, hashPat, hashTxt, log: [...log] });
          if (txt[i + j] !== pat[j]) { match = false; log.push(`Hash match but char mismatch at ${j}`); steps.push({ type: 'hash-collision', start: i, j, hashPat, hashTxt, log: [...log] }); break; }
        }
        if (match) { log.push(`Match found at index ${i}!`); steps.push({ type: 'match', start: i, hashPat, hashTxt, log: [...log] }); }
      }
      if (i < n - m) { hashTxt = (BASE * (hashTxt - txt.charCodeAt(i) * h) + txt.charCodeAt(i + m)) % PRIME; if (hashTxt < 0) hashTxt += PRIME; log.push(`Rehash to index ${i + 1}: ${hashTxt}`); steps.push({ type: 'rehash', start: i + 1, hashPat, hashTxt, log: [...log] }); }
    }
    log.push('Search complete');
    steps.push({ type: 'done', log: [...log] });
    return steps;
  }, []);

  const handleRun = useCallback(() => { startAnimation(generateSteps(text, pattern)); }, [text, pattern, generateSteps, startAnimation]);
  useEffect(() => { setGenerator(handleRun); }, [handleRun, setGenerator]);

  const { currentStep, steps } = useAlgorithm();
  const currentData = steps?.[currentStep] || { type: 'idle', log: [] };
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
                const inWindow = currentData.start !== undefined && i >= currentData.start && i < currentData.start + pattern.length;
                const isMatch = currentData.type === 'match' && i >= currentData.start && i < currentData.start + pattern.length;
                const isCollision = currentData.type === 'hash-collision' && i >= currentData.start && i < currentData.start + pattern.length;
                const isVerifying = currentData.type === 'verify' && currentData.start + currentData.j === i;
                let bg = 'var(--bg)', color = 'var(--ink2)', border = '1px solid var(--border)';
                if (isMatch) { bg = '#f0fdf4'; color = '#15803d'; border = '2px solid #86efac'; }
                else if (isCollision) { bg = '#fef2f2'; color = '#b91c1c'; }
                else if (isVerifying) { bg = '#fef3c7'; color = '#92400e'; border = '2px solid var(--amber)'; }
                else if (inWindow) { bg = 'var(--purple-light)'; color = 'var(--purple)'; }
                return <div key={i} style={{ width: 32, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', fontFamily: 'IBM Plex Mono, monospace', fontSize: '.75rem', fontWeight: 700, background: bg, color, border }}>{ch}</div>;
              })}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', padding: '.75rem 1rem', background: 'var(--bg)', borderRadius: '8px' }}>
            <div style={{ fontFamily: 'Instrument Sans, sans-serif', fontSize: '.75rem', color: 'var(--ink2)' }}>
              Pattern hash: <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontWeight: 700, color: 'var(--purple)' }}>{currentData.hashPat ?? '—'}</span>
            </div>
            <div style={{ fontFamily: 'Instrument Sans, sans-serif', fontSize: '.75rem', color: 'var(--ink2)' }}>
              Window hash: <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontWeight: 700, color: currentData.hashPat === currentData.hashTxt ? '#15803d' : 'var(--ink2)' }}>{currentData.hashTxt ?? '—'}</span>
            </div>
          </div>

          {currentData.type === 'match' && (
            <div style={{ textAlign: 'center', padding: '.5rem', background: '#f0fdf4', borderRadius: '8px', fontFamily: 'Instrument Sans, sans-serif', fontSize: '.75rem', fontWeight: 600, color: '#15803d' }}>Match found at index {currentData.start}!</div>
          )}
          {currentData.type === 'hash-collision' && (
            <div style={{ textAlign: 'center', padding: '.5rem', background: '#fef3c7', borderRadius: '8px', fontFamily: 'Instrument Sans, sans-serif', fontSize: '.75rem', fontWeight: 600, color: '#92400e' }}>Hash collision at index {currentData.start} — verifying character by character</div>
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
