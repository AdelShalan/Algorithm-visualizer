import { useState, useEffect, useRef } from 'react';
import { useAlgorithm } from '../../contexts/AlgorithmContext';
import { generateSteps } from '../../algorithms/dp/knapsack';

const ITEMS = [
  { weight: 2, value: 3 }, { weight: 3, value: 4 }, { weight: 4, value: 5 },
  { weight: 5, value: 7 }, { weight: 6, value: 8 },
];
const CAPACITY = 10;

export default function Knapsack() {
  const { startAnimation, setGenerator } = useAlgorithm();

  const handleRun = () => { startAnimation(generateSteps(ITEMS, CAPACITY)); };
  useEffect(() => { setGenerator(handleRun); }, [handleRun, setGenerator]);

  const { currentStep, steps } = useAlgorithm();
  const defaultDp = Array.from({ length: ITEMS.length + 1 }, () => Array(CAPACITY + 1).fill(0));
  const currentData = steps?.[currentStep] || { type: 'idle', dp: defaultDp, cell: null, log: [] };
  const dp = currentData.dp || defaultDp;
  const logRef = useRef(null);
  useEffect(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; }, [currentData.log]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '10px', padding: '1rem 1.25rem' }}>
        <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '.5625rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '.75rem' }}>Items</div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {ITEMS.map((item, i) => (
            <div key={i} style={{ padding: '.25rem .625rem', borderRadius: '5px', background: 'var(--bg)', fontFamily: 'IBM Plex Mono, monospace', fontSize: '.6875rem', color: 'var(--ink2)' }}>w:{item.weight} v:{item.value}</div>
          ))}
          <div style={{ padding: '.25rem .625rem', borderRadius: '5px', background: 'var(--purple-light)', fontFamily: 'IBM Plex Mono, monospace', fontSize: '.6875rem', color: 'var(--purple)', fontWeight: 500 }}>Capacity: {CAPACITY}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '1.25rem', flex: 1, minHeight: 0 }}>
        <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '10px', padding: '1.25rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '.5625rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '1rem' }}>DP Table</div>
          <div style={{ flex: 1, overflow: 'auto', display: 'flex', alignItems: 'flex-start' }}>
            <table style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ width: 120, height: 36, background: 'var(--bg)', fontSize: '.625rem', fontWeight: 700, color: 'var(--muted)', border: '1px solid var(--border)', borderRadius: '6px 0 0 0' }}>Item \ W</th>
                  {Array.from({ length: CAPACITY + 1 }, (_, w) => <th key={w} style={{ width: 52, height: 36, background: 'var(--bg)', fontFamily: 'IBM Plex Mono, monospace', fontSize: '.6875rem', fontWeight: 700, color: 'var(--ink2)', border: '1px solid var(--border)' }}>{w}</th>)}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ height: 36, background: 'var(--surface)', fontSize: '.625rem', fontWeight: 700, color: 'var(--muted)', border: '1px solid var(--border)' }}>0 (none)</td>
                  {Array.from({ length: CAPACITY + 1 }, (_, w) => <td key={w} style={{ height: 36, textAlign: 'center', fontFamily: 'IBM Plex Mono, monospace', fontSize: '.75rem', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--muted)' }}>0</td>)}
                </tr>
                {ITEMS.map((item, i) => (
                  <tr key={i}>
                    <td style={{ height: 36, background: 'var(--surface)', fontSize: '.625rem', fontWeight: 700, color: 'var(--muted)', border: '1px solid var(--border)' }}>{i + 1} (w:{item.weight}, v:{item.value})</td>
                    {Array.from({ length: CAPACITY + 1 }, (_, w) => {
                      const isCurrent = currentData.cell?.row === i + 1 && currentData.cell?.col === w;
                      const isComplete = currentData.type === 'complete';
                      let bg = 'var(--white)', color = 'var(--ink2)', border = '1px solid var(--border)';
                      if (isCurrent) { bg = 'var(--purple-light)'; color = 'var(--purple)'; border = '2px solid var(--purple)'; }
                      else if (isComplete) { bg = '#f0fdf4'; color = '#15803d'; }
                      return <td key={w} style={{ height: 36, textAlign: 'center', fontFamily: 'IBM Plex Mono, monospace', fontSize: '.75rem', border, background: bg, color }}>{dp[i + 1]?.[w] ?? 0}</td>;
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
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

      {currentData.type === 'complete' && (
        <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '10px', padding: '.75rem 1.25rem', textAlign: 'center' }}>
          <span style={{ fontSize: '.875rem', color: 'var(--ink2)' }}>Maximum value: <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '1.125rem', fontWeight: 700, color: 'var(--purple)' }}>{currentData.result}</span></span>
        </div>
      )}
    </div>
  );
}
