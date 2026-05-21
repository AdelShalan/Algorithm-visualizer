import { useState, useCallback, useEffect, useRef } from 'react';
import { useAlgorithm } from '../../contexts/AlgorithmContext';
import { generateSteps } from '../../algorithms/sliding-window/max-sum-subarray.js';

const ARRAY = [-2, 1, -3, 4, -1, 2, 1, -5, 4];

export default function MaxSumSubarray() {
  const { startAnimation, setGenerator } = useAlgorithm();
  const [arr] = useState(ARRAY);

  const handleRun = useCallback(() => { startAnimation(generateSteps(arr)); }, [arr, startAnimation]);
  useEffect(() => { setGenerator(handleRun); }, [handleRun, setGenerator]);

  const { currentStep, steps } = useAlgorithm();
  const currentData = steps?.[currentStep] || { type: 'idle', array: arr, maxSum: 0, currentSum: 0, window: [0, 0], log: [] };
  const safeArray = currentData.array != null ? currentData.array : arr;
  const logRef = useRef(null);
  useEffect(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; }, [currentData.log]);

  return (
    <div className="flex h-full flex-col gap-5">
      <div className="rounded-[10px] border border-border bg-white p-5">
        <div className="mb-3 font-mono text-[.5625rem] uppercase tracking-[.08em] text-muted">Array</div>
        <div className="flex flex-wrap gap-1.5">
          {arr.map((val, i) => (
            <span key={i} className="rounded bg-bg px-2 py-1 font-mono text-[.8125rem] text-ink2">{val > 0 ? '+' : ''}{val}</span>
          ))}
        </div>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-[1fr_280px] gap-5">
        <div className="flex flex-col gap-4 rounded-[10px] border border-border bg-white p-5">
          <div className="flex flex-1 items-center justify-center">
            <div className="flex gap-2">
              {safeArray.map((val, i) => {
                const inWindow = currentData.window && i >= currentData.window[0] && i <= currentData.window[1];
                const isBest = currentData.type === 'complete' && currentData.window && i >= currentData.window[0] && i <= currentData.window[1];
                const isAdding = currentData.type === 'add' && currentData.index === i;
                const isResetting = currentData.type === 'reset' && currentData.index === i;
                let bg = 'var(--white)', border = '2px solid var(--border)';
                if (isBest) { bg = '#f0fdf4'; border = '2px solid #86efac'; }
                else if (isAdding) { bg = 'var(--purple-light)'; border = '2px solid var(--purple)'; }
                else if (isResetting) { bg = '#fef2f2'; border = '2px solid #f87171'; }
                else if (inWindow) { bg = 'var(--purple-light)'; border = '2px solid var(--purple)'; }
                return (
                  <div key={i} className="flex h-20 w-16 flex-col items-center justify-center rounded-2xl" style={{ border, background: bg }}>
                    <span className="font-mono text-[1.125rem] font-bold" style={{ color: val >= 0 ? 'var(--ink)' : '#b91c1c' }}>{val > 0 ? '+' : ''}{val}</span>
                    {isAdding && <span className="font-mono text-[.625rem] font-semibold text-purple">sum={currentData.currentSum}</span>}
                  </div>
                );
              })}
            </div>
          </div>

          {currentData.type === 'complete' && (
            <div className="rounded-[10px] bg-bg px-6 py-3 text-center">
              <span className="font-body text-[.875rem] text-ink2">
                Maximum sum: <span className="font-mono text-[1rem] font-bold text-purple">{currentData.maxSum}</span>
              </span>
            </div>
          )}
        </div>

        {currentData.log && (
          <div className="flex flex-col overflow-hidden rounded-[10px] border border-border bg-white px-5 py-4">
            <div className="mb-2 shrink-0 font-mono text-[.5625rem] uppercase tracking-[.08em] text-muted">Window log</div>
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
