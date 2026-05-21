import { useState, useCallback, useEffect, useRef } from 'react';
import { useAlgorithm } from '../../contexts/AlgorithmContext';
import { generateSteps } from '../../algorithms/sliding-window/two-sum-sorted.js';

const ARRAY = [2, 7, 11, 15, 3, 6, 9, 1];
const TARGET = 9;

export default function TwoSumSorted() {
  const { startAnimation, setGenerator } = useAlgorithm();
  const [arr] = useState([...ARRAY].sort((a, b) => a - b));
  const [target, setTarget] = useState(TARGET);

  const handleRun = useCallback(() => { startAnimation(generateSteps(arr, target)); }, [arr, target, startAnimation]);
  useEffect(() => { setGenerator(handleRun); }, [handleRun, setGenerator]);

  const { currentStep, steps } = useAlgorithm();
  const currentData = steps?.[currentStep] || { type: 'idle', array: arr, left: 0, right: arr.length - 1, log: [] };
  const safeArray = currentData.array != null ? currentData.array : arr;
  const logRef = useRef(null);
  useEffect(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; }, [currentData.log]);

  return (
    <div className="flex h-full flex-col gap-5">
      <div className="rounded-[10px] border border-border bg-white p-5">
        <div className="mb-3 font-mono text-[.5625rem] uppercase tracking-[.08em] text-muted">Input</div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[.75rem] text-ink2">Target:</span>
            <input type="number" value={target} onChange={e => setTarget(parseInt(e.target.value) || 0)} className="w-[70px] rounded-md border border-border bg-bg px-2.5 py-1.5 font-mono text-[.8125rem] text-ink outline-none" />
          </div>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-[1fr_280px] gap-5">
        <div className="flex flex-col gap-4 rounded-[10px] border border-border bg-white p-5">
          <div className="flex flex-1 items-center justify-center">
            <div className="flex gap-2">
              {safeArray.map((val, i) => {
                const isLeft = currentData.left === i;
                const isRight = currentData.right === i;
                const isFound = currentData.type === 'found' && (i === currentData.left || i === currentData.right);
                const between = i > currentData.left && i < currentData.right;
                let bg = 'var(--bg)', border = '2px solid var(--border)', opacity = 0.5;
                if (isFound) { bg = '#f0fdf4'; border = '2px solid #86efac'; opacity = 1; }
                else if (isLeft) { bg = '#f3e8ff'; border = '2px solid #a855f7'; opacity = 1; }
                else if (isRight) { bg = 'var(--purple-light)'; border = '2px solid var(--purple)'; opacity = 1; }
                else if (between) { bg = 'var(--purple-light)'; border = '2px solid var(--purple)'; opacity = 1; }
                return (
                  <div key={i} className="flex h-20 w-16 flex-col items-center justify-center rounded-2xl" style={{ border, background: bg, opacity }}>
                    <span className="font-mono text-[1.125rem] font-bold text-ink">{val}</span>
                    {isLeft && <span className="font-mono text-[.625rem] font-semibold text-[#7c3aed]">left</span>}
                    {isRight && <span className="font-mono text-[.625rem] font-semibold text-purple">right</span>}
                  </div>
                );
              })}
            </div>
          </div>

          {currentData.type === 'found' && (
            <div className="rounded-[10px] bg-bg px-6 py-3 text-center">
              <span className="font-body text-[.875rem] text-ink2">
                Found: <span className="font-mono font-bold text-purple">{safeArray[currentData.left]}</span> + <span className="font-mono font-bold text-[#7c3aed]">{safeArray[currentData.right]}</span> = <span className="font-mono font-bold text-[#15803d]">{target}</span>
              </span>
            </div>
          )}

          {currentData.sum !== undefined && currentData.type !== 'found' && currentData.type !== 'init' && currentData.type !== 'not-found' && (
            <div className="rounded-lg bg-bg px-4 py-2 text-center font-body text-[.75rem] text-ink2">
              {safeArray[currentData.left]} + {safeArray[currentData.right]} = {currentData.sum}
              {currentData.type === 'too-small' && ' < target → move left pointer right'}
              {currentData.type === 'too-large' && ' > target → move right pointer left'}
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
