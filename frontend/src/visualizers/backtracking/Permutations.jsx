import { useState, useCallback, useEffect, useRef } from 'react';
import { useAlgorithm } from '../../contexts/AlgorithmContext';

export default function Permutations() {
  const { startAnimation, setGenerator } = useAlgorithm();
  const [n, setN] = useState(3);

  const generateSteps = useCallback((size) => {
    const steps = [];
    const log = [];
    const arr = Array.from({ length: size }, (_, i) => i + 1);
    const perms = [];
    function generate(current, remaining) {
      log.push(`Build: [${current.join(',')}] remaining: [${remaining.join(',')}]`);
      steps.push({ type: 'build', current: [...current], remaining: [...remaining], perms: [...perms], log: [...log] });
      if (remaining.length === 0) { perms.push([...current]); log.push(`Found permutation: [${current.join(',')}]`); steps.push({ type: 'complete-perm', perm: [...current], perms: [...perms], log: [...log] }); return; }
      for (let i = 0; i < remaining.length; i++) {
        const next = [...current, remaining[i]];
        const rest = [...remaining.slice(0, i), ...remaining.slice(i + 1)];
        log.push(`Pick ${remaining[i]}`);
        generate(next, rest);
        log.push(`Backtrack, restore [${remaining.join(',')}]`);
        steps.push({ type: 'backtrack', current: [...current], remaining: [...remaining], perms: [...perms], log: [...log] });
      }
    }
    generate([], arr);
    log.push(`Done: ${perms.length} permutations`);
    steps.push({ type: 'done', perms: [...perms], log: [...log] });
    return steps;
  }, []);

  const handleRun = useCallback(() => { startAnimation(generateSteps(n)); }, [n, generateSteps, startAnimation]);
  useEffect(() => { setGenerator(handleRun); }, [handleRun, setGenerator]);

  const { currentStep, steps } = useAlgorithm();
  const currentData = steps?.[currentStep] || { type: 'idle', perms: [], current: [], remaining: [], log: [] };
  const logRef = useRef(null);
  useEffect(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; }, [currentData.log]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '10px', padding: '1rem 1.25rem' }}>
        <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '.5625rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '.75rem' }}>Input</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
            <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '.8125rem', color: 'var(--ink2)' }}>N =</span>
            <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '1rem', fontWeight: 500, color: 'var(--purple)' }}>{n}</span>
            <button onClick={() => setN(p => Math.max(2, p - 1))} style={{ width: 28, height: 28, borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--white)', color: 'var(--ink2)', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
            <button onClick={() => setN(p => Math.min(6, p + 1))} style={{ width: 28, height: 28, borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--white)', color: 'var(--ink2)', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '1.25rem', flex: 1, minHeight: 0 }}>
        <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '10px', padding: '1.25rem', display: 'flex', gap: '1.5rem', overflow: 'hidden' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '.8125rem', color: 'var(--ink)', marginBottom: '.75rem' }}>Building permutations</div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {currentData.current.map((val, i) => (
                <span key={i} style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--purple)', color: '#fff', borderRadius: '8px', fontFamily: 'IBM Plex Mono, monospace', fontSize: '.75rem', fontWeight: 700 }}>{val}</span>
              ))}
              {currentData.remaining.map((val, i) => (
                <span key={`r-${i}`} style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', color: 'var(--muted)', borderRadius: '8px', fontFamily: 'IBM Plex Mono, monospace', fontSize: '.75rem', fontWeight: 600 }}>{val}</span>
              ))}
            </div>
          </div>

          <div style={{ width: 220, overflowY: 'auto' }}>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '.8125rem', color: 'var(--ink)', marginBottom: '.75rem' }}>Permutations ({currentData.perms?.length ?? 0})</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {currentData.perms?.map((perm, i) => (
                <div key={i} style={{ display: 'flex', gap: '4px', padding: '.375rem .5rem', background: 'var(--bg)', borderRadius: '6px' }}>
                  {perm.map((val, j) => <span key={j} style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0fdf4', color: '#15803d', borderRadius: '4px', fontFamily: 'IBM Plex Mono, monospace', fontSize: '.625rem', fontWeight: 700 }}>{val}</span>)}
                </div>
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
