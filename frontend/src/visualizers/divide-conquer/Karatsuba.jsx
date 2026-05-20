import { useState, useCallback, useEffect, useRef } from 'react';
import { useAlgorithm } from '../../contexts/AlgorithmContext';

export default function Karatsuba() {
  const { startAnimation, setGenerator } = useAlgorithm();
  const [num1, setNum1] = useState(1234);
  const [num2, setNum2] = useState(5678);

  const generateSteps = useCallback((x, y) => {
    const steps = [];
    const log = [];
    function karatsuba(a, b, depth = 0) {
      const sa = a.toString(); const sb = b.toString();
      const n = Math.max(sa.length, sb.length);
      log.push(`${'  '.repeat(depth)}karatsuba(${a}, ${b})`);
      steps.push({ type: 'call', a, b, depth, n, log: [...log] });
      if (n <= 2) { const result = a * b; log.push(`${'  '.repeat(depth)}Base: ${a} × ${b} = ${result}`); steps.push({ type: 'base', a, b, result, depth, log: [...log] }); return result; }
      const m = Math.ceil(n / 2);
      const high1 = Math.floor(a / Math.pow(10, m)); const low1 = a % Math.pow(10, m);
      const high2 = Math.floor(b / Math.pow(10, m)); const low2 = b % Math.pow(10, m);
      log.push(`${'  '.repeat(depth)}Split: ${a}→(${high1},${low1}), ${b}→(${high2},${low2})`);
      steps.push({ type: 'split', a, b, high1, low1, high2, low2, m, depth, log: [...log] });
      const z0 = karatsuba(low1, low2, depth + 1);
      const z1 = karatsuba(low1 + high1, low2 + high2, depth + 1);
      const z2 = karatsuba(high1, high2, depth + 1);
      const result = z2 * Math.pow(10, 2 * m) + (z1 - z2 - z0) * Math.pow(10, m) + z0;
      log.push(`${'  '.repeat(depth)}Combine: z0=${z0}, z1=${z1}, z2=${z2} → ${result}`);
      steps.push({ type: 'combine', z0, z1, z2, result, depth, log: [...log] });
      return result;
    }
    karatsuba(x, y);
    log.push(`Result: ${x * y}`);
    steps.push({ type: 'complete', result: x * y, log: [...log] });
    return steps;
  }, []);

  const handleRun = useCallback(() => { startAnimation(generateSteps(num1, num2)); }, [num1, num2, generateSteps, startAnimation]);
  useEffect(() => { setGenerator(handleRun); }, [handleRun, setGenerator]);

  const { currentStep, steps } = useAlgorithm();
  const currentData = steps?.[currentStep] || { type: 'idle', log: [] };
  const logRef = useRef(null);
  useEffect(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; }, [currentData.log]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '10px', padding: '1rem 1.25rem' }}>
        <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '.5625rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '.75rem' }}>Input</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
          <input type="number" value={num1} onChange={e => setNum1(parseInt(e.target.value) || 0)} style={{ width: 90, padding: '.375rem .625rem', border: '1px solid var(--border)', borderRadius: '6px', fontFamily: 'IBM Plex Mono, monospace', fontSize: '.8125rem', color: 'var(--ink)', background: 'var(--bg)', outline: 'none' }} />
          <span style={{ color: 'var(--muted)', fontWeight: 700 }}>×</span>
          <input type="number" value={num2} onChange={e => setNum2(parseInt(e.target.value) || 0)} style={{ width: 90, padding: '.375rem .625rem', border: '1px solid var(--border)', borderRadius: '6px', fontFamily: 'IBM Plex Mono, monospace', fontSize: '.8125rem', color: 'var(--ink)', background: 'var(--bg)', outline: 'none' }} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '1.25rem', flex: 1, minHeight: 0 }}>
        <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '10px', padding: '1.25rem', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '.8125rem', color: 'var(--ink)', marginBottom: '.75rem' }}>Recursion Log</div>
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {steps.slice(0, currentStep + 1).map((step, i) => {
              const isCurrent = i === currentStep;
              return (
                <div key={i} style={{ padding: '.25rem .5rem', borderRadius: '5px', background: isCurrent ? 'var(--purple-light)' : 'transparent', paddingLeft: `${(step.depth ?? 0) * 24 + 8}px`, fontFamily: 'IBM Plex Mono, monospace', fontSize: '.6875rem', color: 'var(--ink2)' }}>
                  {step.type === 'call' && `karatsuba(${step.a}, ${step.b})`}
                  {step.type === 'base' && `${step.a} × ${step.b} = ${step.result}`}
                  {step.type === 'split' && `Split: ${step.a}→(${step.high1},${step.low1}), ${step.b}→(${step.high2},${step.low2})`}
                  {step.type === 'combine' && `Combine: z0=${step.z0}, z1=${step.z1}, z2=${step.z2} → ${step.result}`}
                  {step.type === 'complete' && <span style={{ fontSize: '.875rem', fontWeight: 700, color: 'var(--purple)' }}>Result: {step.result}</span>}
                </div>
              );
            })}
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
