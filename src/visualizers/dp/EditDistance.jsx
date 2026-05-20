import { useState, useCallback, useEffect, useRef } from 'react';
import { useAlgorithm } from '../../contexts/AlgorithmContext';

const PAIRS = [
  { a: 'kitten', b: 'sitting' },
  { a: 'saturday', b: 'sunday' },
  { a: 'intention', b: 'execution' },
];

export default function EditDistance() {
  const { startAnimation, setGenerator } = useAlgorithm();
  const [pairIndex, setPairIndex] = useState(0);
  const pair = PAIRS[pairIndex];

  const generateSteps = useCallback((a, b) => {
    const steps = [];
    const log = [];
    const m = a.length, n = b.length;
    const dp = Array.from({ length: m + 1 }, (_, i) => Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)));
    log.push('Initialize DP table');
    steps.push({ type: 'init', dp: dp.map(r => [...r]), log: [...log] });
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        steps.push({ type: 'check', i, j, dp: dp.map(r => [...r]), cell: { row: i, col: j }, log: [...log] });
        if (a[i - 1] === b[j - 1]) { dp[i][j] = dp[i - 1][j - 1]; log.push(`'${a[i-1]}' === '${b[j-1]}' → match, dp[${i}][${j}] = ${dp[i][j]}`); steps.push({ type: 'match', i, j, char: a[i - 1], dp: dp.map(r => [...r]), cell: { row: i, col: j }, log: [...log] }); }
        else {
          const insert = dp[i][j - 1] + 1; const del = dp[i - 1][j] + 1; const replace = dp[i - 1][j - 1] + 1;
          dp[i][j] = Math.min(insert, del, replace);
          const op = dp[i][j] === insert ? 'insert' : dp[i][j] === del ? 'delete' : 'replace';
          log.push(`'${a[i-1]}' !== '${b[j-1]}' → ${op}, dp[${i}][${j}] = ${dp[i][j]}`);
          steps.push({ type: 'op', i, j, op, dp: dp.map(r => [...r]), cell: { row: i, col: j }, log: [...log] });
        }
      }
    }
    log.push(`Edit distance: ${dp[m][n]}`);
    steps.push({ type: 'complete', dp: dp.map(r => [...r]), result: dp[m][n], log: [...log] });
    return steps;
  }, []);

  const handleRun = useCallback(() => { startAnimation(generateSteps(pair.a, pair.b)); }, [pair, generateSteps, startAnimation]);
  useEffect(() => { setGenerator(handleRun); }, [handleRun, setGenerator]);

  const { currentStep, steps } = useAlgorithm();
  const defaultDp = Array.from({ length: pair.a.length + 1 }, () => Array(pair.b.length + 1).fill(0));
  const currentData = steps?.[currentStep] || { type: 'idle', dp: defaultDp, cell: null, log: [] };
  const dp = currentData.dp || defaultDp;
  const logRef = useRef(null);
  useEffect(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; }, [currentData.log]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '10px', padding: '1rem 1.25rem' }}>
        <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '.5625rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '.75rem' }}>Strings</div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {PAIRS.map((p, i) => (
            <button key={i} onClick={() => setPairIndex(i)} style={{ padding: '.25rem .625rem', borderRadius: '5px', border: i === pairIndex ? '1px solid var(--purple)' : '1px solid var(--border)', background: i === pairIndex ? 'var(--purple-light)' : 'var(--white)', fontFamily: 'IBM Plex Mono, monospace', fontSize: '.6875rem', color: i === pairIndex ? 'var(--purple)' : 'var(--ink2)', cursor: 'pointer', fontWeight: i === pairIndex ? 600 : 400 }}>
              "{p.a}" → "{p.b}"
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
                  {pair.b.split('').map((_, j) => <td key={j} style={{ height: 36, textAlign: 'center', fontFamily: 'IBM Plex Mono, monospace', fontSize: '.75rem', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--muted)' }}>{j + 1}</td>)}
                </tr>
                {pair.a.split('').map((ch, i) => (
                  <tr key={i}>
                    <td style={{ height: 36, background: 'var(--bg)', fontFamily: 'IBM Plex Mono, monospace', fontSize: '.75rem', fontWeight: 700, color: 'var(--ink2)', border: '1px solid var(--border)' }}>{ch}</td>
                    {pair.b.split('').map((_, j) => {
                      const isCurrent = currentData.cell?.row === i + 1 && currentData.cell?.col === j + 1;
                      const isMatch = currentData.type === 'match' && currentData.i === i + 1 && currentData.j === j + 1;
                      const isOp = currentData.type === 'op' && currentData.i === i + 1 && currentData.j === j + 1;
                      const isComplete = currentData.type === 'complete';
                      let bg = 'var(--white)', color = 'var(--ink2)', border = '1px solid var(--border)';
                      if (isMatch) { bg = '#f0fdf4'; color = '#15803d'; border = '2px solid #86efac'; }
                      else if (isOp) { bg = '#fffbeb'; color = '#92400e'; border = '2px solid var(--amber)'; }
                      else if (isCurrent) { bg = 'var(--purple-light)'; color = 'var(--purple)'; border = '2px solid var(--purple)'; }
                      else if (isComplete) { bg = '#f0fdf4'; color = '#15803d'; }
                      return <td key={j} style={{ height: 36, textAlign: 'center', fontFamily: 'IBM Plex Mono, monospace', fontSize: '.75rem', border, background: bg, color }}>{dp[i + 1]?.[j + 1] ?? 0}</td>;
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
          <span style={{ fontSize: '.875rem', color: 'var(--ink2)' }}>Edit distance: <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '1.125rem', fontWeight: 700, color: 'var(--purple)' }}>{currentData.result}</span></span>
        </div>
      )}
    </div>
  );
}
