import { useState, useEffect, useRef } from 'react';
import { useAlgorithm } from '../../contexts/AlgorithmContext';
import { generateSteps } from '../../algorithms/dp/fibonacci';

export default function Fibonacci() {
  const { startAnimation, setGenerator } = useAlgorithm();
  const [n, setN] = useState(10);

  const handleRun = useCallback(() => { startAnimation(generateSteps(n)); }, [n, startAnimation]);
  useEffect(() => { setGenerator(handleRun); }, [handleRun, setGenerator]);

  const { currentStep, steps } = useAlgorithm();
  const currentData = steps?.[currentStep] || { type: 'idle', memo: {}, log: [] };
  const logRef = useRef(null);
  useEffect(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; }, [currentData.log]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '10px', padding: '1rem 1.25rem' }}>
        <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '.5625rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '.75rem' }}>Input</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
            <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '.8125rem', color: 'var(--ink2)' }}>n =</span>
            <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '1rem', fontWeight: 500, color: 'var(--purple)' }}>{n}</span>
            <button onClick={() => setN(p => Math.max(3, p - 1))} style={{ width: 28, height: 28, borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--white)', color: 'var(--ink2)', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
            <button onClick={() => setN(p => Math.min(15, p + 1))} style={{ width: 28, height: 28, borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--white)', color: 'var(--ink2)', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '1.25rem', flex: 1, minHeight: 0 }}>
        <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '10px', padding: '1.25rem', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '.8125rem', color: 'var(--ink)', marginBottom: '.75rem' }}>Recursion Tree</div>
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {steps.slice(0, currentStep + 1).map((step, i) => {
              const isCurrent = i === currentStep;
              const color = step.type === 'base' ? '#22c55e' : step.type === 'memo-hit' ? 'var(--amber)' : step.type === 'compute' ? 'var(--purple)' : step.type === 'complete' ? '#22c55e' : '#8b5cf6';
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '.25rem .5rem', borderRadius: '5px', background: isCurrent ? 'var(--purple-light)' : 'transparent', paddingLeft: `${(step.depth ?? 0) * 20 + 8}px` }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', flexShrink: 0, background: color }} />
                  <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '.6875rem', color: 'var(--ink2)' }}>
                    fib({step.i}){step.value !== undefined && <span style={{ color: 'var(--muted)' }}> → {step.value}</span>}
                  </span>
                  {step.type === 'memo-hit' && <span style={{ fontSize: '.625rem', color: 'var(--amber)', fontWeight: 500 }}>(cached)</span>}
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ width: 180, display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '.8125rem', color: 'var(--ink)', marginBottom: '.75rem' }}>Memo Table</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {Object.entries(currentData.memo ?? {}).map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '.375rem .5rem', borderRadius: '6px', background: 'var(--bg)' }}>
                <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '.6875rem', color: 'var(--ink2)' }}>fib({k})</span>
                <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '.6875rem', fontWeight: 700, color: 'var(--purple)' }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        {currentData.log && (
          <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '10px', padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '.5625rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '.5rem', flexShrink: 0 }}>Execution trace</div>
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
