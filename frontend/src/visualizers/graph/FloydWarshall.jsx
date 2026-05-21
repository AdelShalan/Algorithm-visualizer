import { useState, useCallback, useEffect, useRef } from 'react';
import { useAlgorithm } from '../../contexts/AlgorithmContext';
import { generateSteps, generateMatrix } from '../../algorithms/graph/FloydWarshall';

const SIZE = 5;

export default function FloydWarshall() {
  const { startAnimation, setGenerator } = useAlgorithm();
  const [matrix, setMatrix] = useState(generateMatrix);

  const handleRun = useCallback(() => { startAnimation(generateSteps(matrix)); }, [matrix, startAnimation]);
  useEffect(() => { setGenerator(handleRun); }, [handleRun, setGenerator]);
  const handleNewMatrix = useCallback(() => { setMatrix(generateMatrix()); }, []);

  const { currentStep, steps } = useAlgorithm();
  const defaultDist = matrix.map(r => [...r]);
  const currentData = steps?.[currentStep] || { type: 'idle', dist: defaultDist, log: [] };
  const dist = currentData.dist || defaultDist;
  const logRef = useRef(null);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [currentData.log]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '10px', padding: '1rem 1.25rem' }}>
        <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '.5625rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '.75rem' }}>Matrix</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
          <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '.6875rem', color: 'var(--muted)' }}>{SIZE}×{SIZE} distance matrix</span>
          <div style={{ flex: 1 }} />
          <button onClick={handleNewMatrix} style={{ padding: '.3rem .75rem', fontSize: '.6875rem', borderRadius: '5px', border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer', color: 'var(--ink2)', fontFamily: 'Instrument Sans, sans-serif' }}>New Matrix</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '1.25rem', flex: 1, minHeight: 0 }}>
        <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '10px', padding: '1.25rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '.5625rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '1rem' }}>All-pairs shortest paths</div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {dist.map((row, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '.75rem', fontWeight: 700, color: 'var(--muted)', width: '2rem' }}>N{i}</span>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {row.map((val, j) => {
                      const isUpdating = currentData.type === 'update' && currentData.i === i && currentData.j === j;
                      const isChecking = currentData.type === 'check' && currentData.i === i && currentData.j === j;
                      const isK = currentData.type === 'k-iteration' && (i === currentData.k || j === currentData.k);
                      let bg = 'var(--white)', color = 'var(--ink2)', border = '1px solid var(--border)';
                      if (isUpdating) { bg = '#f0fdf4'; color = '#15803d'; border = '2px solid #86efac'; }
                      else if (isChecking) { bg = '#fffbeb'; color = '#92400e'; border = '2px solid var(--amber)'; }
                      else if (isK) { bg = 'var(--purple-light)'; color = 'var(--purple)'; border = 'none'; }
                      return (
                        <div key={j} style={{ width: 64, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', fontFamily: 'IBM Plex Mono, monospace', fontSize: '.75rem', fontWeight: 600, background: bg, color, border }}>
                          {val === Infinity ? '∞' : val}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
              {currentData.k !== undefined && <div style={{ textAlign: 'center', marginTop: '1rem', fontFamily: 'IBM Plex Mono, monospace', fontSize: '.75rem', color: 'var(--muted)' }}>Intermediate vertex: <span style={{ fontWeight: 700, color: 'var(--purple)' }}>k = {currentData.k}</span></div>}
            </div>
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
