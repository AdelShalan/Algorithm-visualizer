import { useState, useCallback, useEffect, useRef } from 'react';
import { useAlgorithm } from '../../contexts/AlgorithmContext';
import { generateSteps } from '../../algorithms/divide-conquer/karatsuba.js';

export default function Karatsuba() {
  const { startAnimation, setGenerator } = useAlgorithm();
  const [num1, setNum1] = useState(1234);
  const [num2, setNum2] = useState(5678);

  const handleRun = useCallback(() => { startAnimation(generateSteps(num1, num2)); }, [num1, num2, startAnimation]);
  useEffect(() => { setGenerator(handleRun); }, [handleRun, setGenerator]);

  const { currentStep, steps } = useAlgorithm();
  const currentData = steps?.[currentStep] || { type: 'idle', log: [] };
  const logRef = useRef(null);
  useEffect(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; }, [currentData.log]);

  return (
    <div className="flex h-full flex-col gap-5">
      <div className="rounded-[10px] border border-border bg-white p-5">
        <div className="mb-3 font-mono text-[.5625rem] uppercase tracking-[.08em] text-muted">Input</div>
        <div className="flex items-center gap-2">
          <input type="number" value={num1} onChange={e => setNum1(parseInt(e.target.value) || 0)} className="w-[90px] rounded-md border border-border bg-bg px-2.5 py-1.5 font-mono text-[.8125rem] text-ink outline-none" />
          <span className="font-bold text-muted">×</span>
          <input type="number" value={num2} onChange={e => setNum2(parseInt(e.target.value) || 0)} className="w-[90px] rounded-md border border-border bg-bg px-2.5 py-1.5 font-mono text-[.8125rem] text-ink outline-none" />
        </div>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-[1fr_280px] gap-5">
        <div className="flex flex-col overflow-hidden rounded-[10px] border border-border bg-white p-5">
          <div className="mb-3 font-heading text-[.8125rem] font-bold text-ink">Recursion Log</div>
          <div className="flex flex-1 flex-col gap-0.5 overflow-y-auto">
            {steps.slice(0, currentStep + 1).map((step, i) => {
              const isCurrent = i === currentStep;
              return (
                <div key={i} className="rounded-[5px] px-2 py-1 font-mono text-[.6875rem] text-ink2" style={{ background: isCurrent ? 'var(--purple-light)' : 'transparent', paddingLeft: `${(step.depth ?? 0) * 24 + 8}px` }}>
                  {step.type === 'call' && `karatsuba(${step.a}, ${step.b})`}
                  {step.type === 'base' && `${step.a} × ${step.b} = ${step.result}`}
                  {step.type === 'split' && `Split: ${step.a}→(${step.high1},${step.low1}), ${step.b}→(${step.high2},${step.low2})`}
                  {step.type === 'combine' && `Combine: z0=${step.z0}, z1=${step.z1}, z2=${step.z2} → ${step.result}`}
                  {step.type === 'complete' && <span className="text-[.875rem] font-bold text-purple">Result: {step.result}</span>}
                </div>
              );
            })}
          </div>
        </div>

        {currentData.log && (
          <div className="flex flex-col overflow-hidden rounded-[10px] border border-border bg-white px-5 py-4">
            <div className="mb-2 shrink-0 font-mono text-[.5625rem] uppercase tracking-[.08em] text-muted">Execution trace</div>
            <div ref={logRef} className="flex flex-1 flex-col gap-[3px] overflow-y-auto">
              {currentData.log.map((entry, i) => {
                const isLast = i === currentData.log.length - 1;
                return (
                  <div key={i} className="rounded px-2 py-[.3rem] font-mono text-[.625rem]" style={{ color: isLast ? 'var(--purple)' : 'var(--muted)', background: isLast ? 'var(--purple-light)' : 'transparent', fontWeight: isLast ? 500 : 400 }}>{entry}</div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
