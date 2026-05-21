import { useState, useCallback, useEffect, useRef } from 'react';
import { useAlgorithm } from '../../contexts/AlgorithmContext';
import { generateSteps } from '../../algorithms/backtracking/permutations.js';

export default function Permutations() {
  const { startAnimation, setGenerator } = useAlgorithm();
  const [n, setN] = useState(3);

  const handleRun = useCallback(() => { startAnimation(generateSteps(n)); }, [n, startAnimation]);
  useEffect(() => { setGenerator(handleRun); }, [handleRun, setGenerator]);

  const { currentStep, steps } = useAlgorithm();
  const currentData = steps?.[currentStep] || { type: 'idle', perms: [], current: [], remaining: [], log: [] };
  const logRef = useRef(null);
  useEffect(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; }, [currentData.log]);

  return (
    <div className="h-full flex flex-col gap-5">
      <div className="bg-white border border-border rounded-[10px] px-5 py-4">
        <div className="font-mono text-[0.5625rem] tracking-[0.08em] uppercase text-muted mb-3">Input</div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[0.8125rem] text-ink2">N =</span>
            <span className="font-mono text-base font-medium text-purple">{n}</span>
            <button onClick={() => setN(p => Math.max(2, p - 1))} className="w-7 h-7 rounded-md border border-border bg-white text-ink2 cursor-pointer text-[14px] flex items-center justify-center">−</button>
            <button onClick={() => setN(p => Math.min(6, p + 1))} className="w-7 h-7 rounded-md border border-border bg-white text-ink2 cursor-pointer text-[14px] flex items-center justify-center">+</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_280px] gap-5 flex-1 min-h-0">
        <div className="bg-white border border-border rounded-[10px] p-5 flex gap-6 overflow-hidden">
          <div className="flex-1">
            <div className="font-heading font-bold text-[0.8125rem] text-ink mb-3">Building permutations</div>
            <div className="flex gap-1.5 flex-wrap">
              {currentData.current.map((val, i) => (
                <span key={i} className="w-9 h-9 flex items-center justify-center bg-purple text-white rounded-lg font-mono text-[0.75rem] font-bold">{val}</span>
              ))}
              {currentData.remaining.map((val, i) => (
                <span key={`r-${i}`} className="w-9 h-9 flex items-center justify-center bg-bg text-muted rounded-lg font-mono text-[0.75rem] font-semibold">{val}</span>
              ))}
            </div>
          </div>

          <div className="w-[220px] overflow-y-auto">
            <div className="font-heading font-bold text-[0.8125rem] text-ink mb-3">Permutations ({currentData.perms?.length ?? 0})</div>
            <div className="flex flex-col gap-1">
              {currentData.perms?.map((perm, i) => (
                <div key={i} className="flex gap-1 px-2 py-1.5 bg-bg rounded-md">
                  {perm.map((val, j) => <span key={j} className="w-7 h-7 flex items-center justify-center bg-green-50 text-green-700 rounded font-mono text-[0.625rem] font-bold">{val}</span>)}
                </div>
              ))}
            </div>
          </div>
        </div>

        {currentData.log && (
          <div className="bg-white border border-border rounded-[10px] px-5 py-4 flex flex-col overflow-hidden">
            <div className="font-mono text-[0.5625rem] tracking-[0.08em] uppercase text-muted mb-2 flex-shrink-0">Search log</div>
            <div ref={logRef} className="flex-1 overflow-y-auto flex flex-col gap-[3px]">
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
    </div>
  );
}
