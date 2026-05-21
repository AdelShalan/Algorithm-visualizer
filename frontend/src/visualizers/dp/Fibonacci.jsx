import { useState, useEffect, useRef, useCallback } from 'react';
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
    <div className="h-full flex flex-col gap-5">
      <div className="bg-white border border-border rounded-[10px] px-5 py-4">
        <div className="font-mono text-[0.5625rem] tracking-[0.08em] uppercase text-muted mb-3">Input</div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[0.8125rem] text-ink2">n =</span>
            <span className="font-mono text-base font-medium text-purple">{n}</span>
            <button onClick={() => setN(p => Math.max(3, p - 1))} className="w-7 h-7 rounded-md border border-border bg-white text-ink2 cursor-pointer text-[14px] flex items-center justify-center">−</button>
            <button onClick={() => setN(p => Math.min(15, p + 1))} className="w-7 h-7 rounded-md border border-border bg-white text-ink2 cursor-pointer text-[14px] flex items-center justify-center">+</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_200px] gap-5 flex-1 min-h-0">
        <div className="flex flex-col gap-5 overflow-hidden min-h-0">
          <div className="bg-white border border-border rounded-[10px] p-5 flex flex-col overflow-hidden flex-1 min-h-0">
            <div className="font-heading font-bold text-[0.8125rem] text-ink mb-3">Recursion Tree</div>
            <div className="flex-1 overflow-y-auto flex flex-col gap-[2px]">
              {steps.slice(0, currentStep + 1).map((step, i) => {
                const isCurrent = i === currentStep;
                const color = step.type === 'base' ? '#22c55e' : step.type === 'memo-hit' ? 'var(--amber)' : step.type === 'compute' ? 'var(--purple)' : step.type === 'complete' ? '#22c55e' : '#8b5cf6';
                return (
                  <div key={i} className="flex items-center gap-2 px-2 py-1 rounded-[5px]" style={{ background: isCurrent ? 'var(--purple-light)' : 'transparent', paddingLeft: `${(step.depth ?? 0) * 20 + 8}px` }}>
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: color }} />
                    <span className="font-mono text-[0.6875rem] text-ink2">
                      fib({step.i}){step.value !== undefined && <span className="text-muted"> → {step.value}</span>}
                    </span>
                    {step.type === 'memo-hit' && <span className="text-[0.625rem] text-amber font-medium">(cached)</span>}
                  </div>
                );
              })}
            </div>
          </div>

          {currentData.log && (
            <div className="bg-white border border-border rounded-[10px] px-5 py-4 flex flex-col overflow-hidden flex-shrink-0 max-h-[30%]">
              <div className="font-mono text-[0.5625rem] tracking-[0.08em] uppercase text-muted mb-2 flex-shrink-0">Execution trace</div>
              <div ref={logRef} className="overflow-y-auto flex flex-col gap-[3px]">
                {currentData.log.map((entry, i) => {
                  const isLast = i === currentData.log.length - 1;
                  return (
                    <div key={i} className="font-mono text-[0.625rem] px-2 py-[0.3rem] rounded" style={{ color: isLast ? 'var(--purple)' : 'var(--muted)', background: isLast ? 'var(--purple-light)' : 'transparent', fontWeight: isLast ? 500 : 400 }}>{entry}</div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <div className="font-heading font-bold text-[0.8125rem] text-ink mb-3">Memo Table</div>
          <div className="flex flex-col gap-1">
            {Object.entries(currentData.memo ?? {}).map(([k, v]) => (
              <div key={k} className="flex justify-between px-2 py-1.5 rounded-md bg-bg">
                <span className="font-mono text-[0.6875rem] text-ink2">fib({k})</span>
                <span className="font-mono text-[0.6875rem] font-bold text-purple">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
