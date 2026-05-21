import { useState, useCallback, useEffect, useRef } from 'react';
import { useAlgorithm } from '../../contexts/AlgorithmContext';
import { generateSteps } from '../../algorithms/sliding-window/longest-unique-substring.js';

const TEXT = 'abcabcbb';

export default function LongestUniqueSubstring() {
  const { startAnimation, setGenerator } = useAlgorithm();
  const [text, setText] = useState(TEXT);

  const handleRun = useCallback(() => { startAnimation(generateSteps(text)); }, [text, startAnimation]);
  useEffect(() => { setGenerator(handleRun); }, [handleRun, setGenerator]);

  const { currentStep, steps } = useAlgorithm();
  const currentData = steps?.[currentStep] || { type: 'idle', text, left: 0, right: 0, window: '', log: [] };
  const logRef = useRef(null);
  useEffect(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; }, [currentData.log]);

  return (
    <div className="flex h-full flex-col gap-5">
      <div className="rounded-[10px] border border-border bg-white p-5">
        <div className="mb-3 font-mono text-[.5625rem] uppercase tracking-[.08em] text-muted">Input</div>
        <input value={text} onChange={e => setText(e.target.value.toLowerCase())} className="w-full rounded-md border border-border bg-bg px-2.5 py-1.5 font-mono text-[.8125rem] text-ink outline-none" />
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-[1fr_280px] gap-5">
        <div className="flex flex-col gap-4 rounded-[10px] border border-border bg-white p-5">
          <div className="flex flex-1 items-center justify-center">
            <div className="flex gap-1.5">
              {text.split('').map((ch, i) => {
                const inWindow = currentData.window && i >= currentData.left && i <= (currentData.right ?? i);
                const isRight = currentData.right === i;
                const isLeft = currentData.left === i;
                const isDuplicate = currentData.type === 'duplicate' && currentData.right === i;
                const isComplete = currentData.type === 'complete' && i >= currentData.maxStart && i < currentData.maxStart + currentData.maxLen;
                let bg = 'var(--white)', color = 'var(--ink2)', border = '2px solid var(--border)';
                if (isComplete) { bg = '#f0fdf4'; border = '2px solid #86efac'; color = '#15803d'; }
                else if (isDuplicate) { bg = '#fef2f2'; border = '2px solid #f87171'; color = '#b91c1c'; }
                else if (isRight) { bg = 'var(--purple)'; border = '2px solid var(--purple)'; color = '#fff'; }
                else if (isLeft) { bg = '#f3e8ff'; border = '2px solid #a855f7'; color = '#7c3aed'; }
                else if (inWindow) { bg = 'var(--purple-light)'; border = '2px solid var(--purple)'; color = 'var(--purple)'; }
                return <div key={i} className="flex h-14 w-12 items-center justify-center rounded-2xl font-mono text-[1.125rem] font-bold" style={{ background: bg, color, border }}>{ch}</div>;
              })}
            </div>
          </div>

          {currentData.type === 'complete' && (
            <div className="rounded-[10px] bg-bg px-6 py-3 text-center">
              <span className="font-body text-[.875rem] text-ink2">
                Longest unique substring: <span className="font-mono text-[1rem] font-bold text-purple">"{currentData.result}"</span> ({currentData.maxLen} chars)
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
