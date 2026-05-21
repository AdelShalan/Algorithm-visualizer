import { useState, useCallback, useEffect, useRef } from 'react';
import { useAlgorithm } from '../../contexts/AlgorithmContext';
import { generateSteps } from '../../algorithms/string/kmp.js';

const TEXT = 'ABABDABACDABABCABAB';
const PATTERN = 'ABABCABAB';

export default function KMP() {
  const { startAnimation, setGenerator } = useAlgorithm();
  const [text, setText] = useState(TEXT);
  const [pattern, setPattern] = useState(PATTERN);

  const handleRun = useCallback(() => { startAnimation(generateSteps(text, pattern)); }, [text, pattern, startAnimation]);
  useEffect(() => { setGenerator(handleRun); }, [handleRun, setGenerator]);

  const { currentStep, steps } = useAlgorithm();
  const currentData = steps?.[currentStep] || { type: 'idle', lps: [], log: [] };
  const logRef = useRef(null);
  useEffect(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; }, [currentData.log]);

  return (
    <div className="flex h-full flex-col gap-5">
      <div className="rounded-[10px] border border-border bg-white p-5">
        <div className="mb-3 font-mono text-[.5625rem] uppercase tracking-[.08em] text-muted">Input</div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="w-[50px] font-mono text-[.75rem] text-ink2">Text:</span>
            <input value={text} onChange={e => setText(e.target.value.toUpperCase())} className="flex-1 rounded-md border border-border bg-bg px-2.5 py-1.5 font-mono text-[.8125rem] text-ink outline-none" />
          </div>
          <div className="flex items-center gap-2">
            <span className="w-[50px] font-mono text-[.75rem] text-ink2">Pattern:</span>
            <input value={pattern} onChange={e => setPattern(e.target.value.toUpperCase())} className="flex-1 rounded-md border border-border bg-bg px-2.5 py-1.5 font-mono text-[.8125rem] text-ink outline-none" />
          </div>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-[1fr_280px] gap-5">
        <div className="flex flex-col gap-5 overflow-y-auto rounded-[10px] border border-border bg-white p-5">
          <div>
            <div className="mb-2 font-heading text-[.8125rem] font-bold text-ink">Text</div>
            <div className="flex flex-wrap gap-0.5">
              {text.split('').map((ch, i) => {
                const isMatch = currentData.type === 'match' && i >= currentData.textIdx && i < currentData.textIdx + pattern.length;
                const isComparing = currentData.type === 'compare' && currentData.textIdx === i;
                const isShift = currentData.type === 'shift' && currentData.textIdx === i;
                let bg = 'var(--bg)', color = 'var(--ink2)', border = '1px solid var(--border)';
                if (isMatch) { bg = '#f0fdf4'; color = '#15803d'; border = '2px solid #86efac'; }
                else if (isComparing) { bg = 'var(--purple)'; color = '#fff'; border = '2px solid var(--purple)'; }
                else if (isShift) { bg = '#fef3c7'; color = '#92400e'; }
                return <div key={i} className="flex h-10 w-8 items-center justify-center rounded-lg font-mono text-[.75rem] font-bold" style={{ background: bg, color, border }}>{ch}</div>;
              })}
            </div>
          </div>

          <div>
            <div className="mb-2 font-heading text-[.8125rem] font-bold text-ink">Pattern</div>
            <div className="flex gap-0.5">
              {pattern.split('').map((ch, i) => {
                const isComparing = currentData.type === 'compare' && currentData.patIdx === i;
                return <div key={i} className="flex h-10 w-8 items-center justify-center rounded-lg font-mono text-[.75rem] font-bold" style={{ background: isComparing ? 'var(--purple)' : 'var(--bg)', color: isComparing ? '#fff' : 'var(--ink2)', border: isComparing ? '2px solid var(--purple)' : '1px solid var(--border)' }}>{ch}</div>;
              })}
            </div>
          </div>

          {currentData.lps.length > 0 && (
            <div>
              <div className="mb-2 font-heading text-[.8125rem] font-bold text-ink">LPS Array</div>
              <div className="flex gap-0.5">
                {currentData.lps.map((val, i) => {
                  const isSetting = currentData.type === 'lps-set' && currentData.i === i;
                  return <div key={i} className="flex h-10 w-8 items-center justify-center rounded-lg font-mono text-[.75rem] font-semibold" style={{ background: isSetting ? '#fef3c7' : 'var(--bg)', color: isSetting ? '#92400e' : 'var(--muted)', border: isSetting ? '2px solid var(--amber)' : '1px solid var(--border)' }}>{val}</div>;
                })}
              </div>
            </div>
          )}

          {currentData.type === 'match' && (
            <div className="rounded-lg bg-[#f0fdf4] px-4 py-2 text-center font-body text-[.75rem] font-semibold text-[#15803d]">Match found at index {currentData.textIdx}!</div>
          )}
        </div>

        {currentData.log && (
          <div className="flex flex-col overflow-hidden rounded-[10px] border border-border bg-white px-5 py-4">
            <div className="mb-2 shrink-0 font-mono text-[.5625rem] uppercase tracking-[.08em] text-muted">Pattern matching log</div>
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
