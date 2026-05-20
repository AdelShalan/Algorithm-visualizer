import { useState, useCallback, useEffect, useRef } from 'react';
import { useAlgorithm } from '../../contexts/AlgorithmContext';

const TEXT = 'ABABCABAB';
const PATTERN = 'ABABC';

export default function ZAlgorithm() {
  const { startAnimation, setGenerator } = useAlgorithm();
  const [text, setText] = useState(TEXT);
  const [pattern, setPattern] = useState(PATTERN);

  const generateSteps = useCallback((txt, pat) => {
    const steps = [];
    const log = [];
    const concat = pat + '$' + txt; const n = concat.length;
    const z = Array(n).fill(0); let l = 0, r = 0;
    log.push(`Concatenated: "${concat}"`);
    steps.push({ type: 'init', concat, z: [...z], l, r, log: [...log] });
    for (let i = 1; i < n; i++) {
      log.push(`Compute Z[${i}]`);
      steps.push({ type: 'compute', i, concat, z: [...z], l, r, log: [...log] });
      if (i < r) { z[i] = Math.min(r - i, z[i - l]); log.push(`In Z-box: z[${i}] = ${z[i]}`); steps.push({ type: 'z-box', i, z: z[i], concat, zArr: [...z], l, r, log: [...log] }); }
      while (i + z[i] < n && concat[z[i]] === concat[i + z[i]]) { z[i]++; log.push(`Match at z[${i}] = ${z[i]}`); steps.push({ type: 'match-char', i, z: z[i], concat, zArr: [...z], l, r, log: [...log] }); }
      if (i + z[i] > r) { l = i; r = i + z[i]; log.push(`Update Z-box: l=${l}, r=${r}`); steps.push({ type: 'update-box', i, l, r, concat, zArr: [...z], log: [...log] }); }
      if (z[i] === pat.length) { log.push(`Match at text position ${i - pat.length - 1}`); steps.push({ type: 'match', pos: i - pat.length - 1, z: [...z], log: [...log] }); }
    }
    log.push(`Z-array: [${z.join(',')}]`);
    steps.push({ type: 'done', z: [...z], log: [...log] });
    return steps;
  }, []);

  const handleRun = useCallback(() => { startAnimation(generateSteps(text, pattern)); }, [text, pattern, generateSteps, startAnimation]);
  useEffect(() => { setGenerator(handleRun); }, [handleRun, setGenerator]);

  const { currentStep, steps } = useAlgorithm();
  const currentData = steps?.[currentStep] || { type: 'idle', z: [], log: [] };
  const logRef = useRef(null);
  useEffect(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; }, [currentData.log]);
  const concat = pattern + '$' + text;

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
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '.8125rem', color: 'var(--ink)', marginBottom: '.5rem' }}>Concatenated string</div>
            <div style={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {concat.split('').map((ch, i) => {
                const isPattern = i < pattern.length;
                const isSep = ch === '$';
                const inZBox = currentData.l !== undefined && i >= currentData.l && i < currentData.r;
                const isCurrent = currentData.i === i;
                const isMatch = currentData.type === 'match' && i >= currentData.pos + pattern.length + 1 && i < currentData.pos + 2 * pattern.length + 1;
                let bg = 'var(--bg)', color = 'var(--ink2)', border = '1px solid var(--border)';
                if (isMatch) { bg = '#f0fdf4'; color = '#15803d'; border = '2px solid #86efac'; }
                else if (isCurrent) { bg = 'var(--purple)'; color = '#fff'; border = '2px solid var(--purple)'; }
                else if (inZBox) { bg = 'var(--purple-light)'; color = 'var(--purple)'; }
                else if (isSep) { bg = '#fef2f2'; color = '#b91c1c'; }
                else if (isPattern) { bg = '#f3e8ff'; color = '#7c3aed'; }
                return <div key={i} style={{ width: 32, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', fontFamily: 'IBM Plex Mono, monospace', fontSize: '.75rem', fontWeight: 700, background: bg, color, border }}>{ch}</div>;
              })}
            </div>
          </div>

          {currentData.z.length > 0 && (
            <div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '.8125rem', color: 'var(--ink)', marginBottom: '.5rem' }}>Z-array</div>
              <div style={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                {currentData.z.map((val, i) => {
                  const isCurrent = currentData.type === 'compute' && currentData.i === i;
                  const isMatch = val === pattern.length;
                  let bg = 'var(--bg)', color = 'var(--muted)', border = '1px solid var(--border)';
                  if (isMatch) { bg = '#f0fdf4'; color = '#15803d'; border = '2px solid #86efac'; }
                  else if (isCurrent) { bg = '#fef3c7'; color = '#92400e'; border = '2px solid var(--amber)'; }
                  else if (val > 0) { bg = 'var(--purple-light)'; color = 'var(--purple)'; border = '1px solid var(--purple)'; }
                  return <div key={i} style={{ width: 32, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', fontFamily: 'IBM Plex Mono, monospace', fontSize: '.75rem', fontWeight: 600, background: bg, color, border }}>{val}</div>;
                })}
              </div>
            </div>
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
