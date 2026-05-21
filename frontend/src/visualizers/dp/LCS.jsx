import { useState, useEffect, useRef } from 'react';
import { useAlgorithm } from '../../contexts/AlgorithmContext';
import { generateSteps } from '../../algorithms/dp/lcs';

const STRINGS = [
  { a: 'ABCBDAB', b: 'BDCAB' },
  { a: 'AGGTAB', b: 'GXTXAYB' },
  { a: 'XMJYAUZ', b: 'MZJAWXU' },
];

export default function LCS() {
  const { startAnimation, setGenerator } = useAlgorithm();
  const [pairIndex, setPairIndex] = useState(0);
  const pair = STRINGS[pairIndex];

  const handleRun = () => { startAnimation(generateSteps(pair.a, pair.b)); };
  useEffect(() => { setGenerator(handleRun); }, [handleRun, setGenerator]);

  const { currentStep, steps } = useAlgorithm();
  const currentData = steps?.[currentStep] || { type: 'idle', dp: Array.from({ length: pair.a.length + 1 }, () => Array(pair.b.length + 1).fill(0)), cell: null, lcs: '', log: [] };
  const logRef = useRef(null);
  useEffect(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; }, [currentData.log]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '10px', padding: '1rem 1.25rem' }}>
        <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '.5625rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '.75rem' }}>Strings</div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {STRINGS.map((p, i) => (
            <button key={i} onClick={() => setPairIndex(i)} style={{ padding: '.25rem .625rem', borderRadius: '5px', border: i === pairIndex ? '1px solid var(--purple)' : '1px solid var(--border)', background: i === pairIndex ? 'var(--purple-light)' : 'var(--white)', fontFamily: 'IBM Plex Mono, monospace', fontSize: '.6875rem', color: i === pairIndex ? 'var(--purple)' : 'var(--ink2)', cursor: 'pointer', fontWeight: i === pairIndex ? 600 : 400 }}>
              "{p.a}" / "{p.b}"
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '1.25rem', flex: 1, minHeight: 0 }}>
        <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '10px', padding: '1.25rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '.5625rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '1rem' }}>DP Table</div>
          <div style={{ flex: 1, overflow: 'auto', display: 'flex', alignItems: 'flex-start' }}>
            <table style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ width: 44, height: 36, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '6px 0 0 0' }}></th>
                  <th style={{ width: 36, height: 36, background: 'var(--bg)', border: '1px solid var(--border)' }}></th>
                  {pair.b.split('').map((ch, j) => <th key={j} style={{ width: 36, height: 36, background: 'var(--bg)', fontFamily: 'IBM Plex Mono, monospace', fontSize: '.75rem', fontWeight: 700, color: 'var(--ink2)', border: '1px solid var(--border)' }}>{ch}</th>)}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ height: 36, background: 'var(--bg)', border: '1px solid var(--border)' }}></td>
                  <td style={{ height: 36, textAlign: 'center', fontFamily: 'IBM Plex Mono, monospace', fontSize: '.75rem', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--muted)' }}>0</td>
                  {pair.b.split('').map((_, j) => <td key={j} style={{ height: 36, textAlign: 'center', fontFamily: 'IBM Plex Mono, monospace', fontSize: '.75rem', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--muted)' }}>0</td>)}
                </tr>
                {pair.a.split('').map((ch, i) => (
                  <tr key={i}>
                    <td style={{ height: 36, background: 'var(--bg)', fontFamily: 'IBM Plex Mono, monospace', fontSize: '.75rem', fontWeight: 700, color: 'var(--ink2)', border: '1px solid var(--border)' }}>{ch}</td>
                    <td style={{ height: 36, textAlign: 'center', fontFamily: 'IBM Plex Mono, monospace', fontSize: '.75rem', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--muted)' }}>0</td>
                    {pair.b.split('').map((_, j) => {
                      const isCurrent = currentData.cell?.row === i + 1 && currentData.cell?.col === j + 1;
                      const isMatch = currentData.type === 'match' && currentData.i === i + 1 && currentData.j === j + 1;
                      const isComplete = currentData.type === 'complete';
                      let bg = 'var(--white)', color = 'var(--ink2)', border = '1px solid var(--border)';
                      if (isMatch) { bg = '#f0fdf4'; color = '#15803d'; border = '2px solid #86efac'; }
                      else if (isCurrent) { bg = 'var(--purple-light)'; color = 'var(--purple)'; border = '2px solid var(--purple)'; }
                      else if (isComplete) { bg = '#f0fdf4'; color = '#15803d'; }
                      return <td key={j} style={{ height: 36, textAlign: 'center', fontFamily: 'IBM Plex Mono, monospace', fontSize: '.75rem', border, background: bg, color }}>{currentData.dp?.[i + 1]?.[j + 1] ?? 0}</td>;
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

      {currentData.lcs && (
        <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '10px', padding: '.75rem 1.25rem', textAlign: 'center' }}>
          <span style={{ fontSize: '.875rem', color: 'var(--ink2)' }}>LCS: <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '1.125rem', fontWeight: 700, color: 'var(--purple)' }}>"{currentData.lcs}"</span></span>
        </div>
      )}
    </div>
  );
}
