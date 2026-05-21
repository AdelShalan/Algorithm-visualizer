import { useState, useEffect, useRef } from 'react';
import { useAlgorithm } from '../../contexts/AlgorithmContext';
import { generateSteps } from '../../algorithms/dp/editDistance';

const PAIRS = [
  { a: 'kitten', b: 'sitting' },
  { a: 'saturday', b: 'sunday' },
  { a: 'intention', b: 'execution' },
];

export default function EditDistance() {
  const { startAnimation, setGenerator } = useAlgorithm();
  const [pairIndex, setPairIndex] = useState(0);
  const pair = PAIRS[pairIndex];

  const handleRun = () => { startAnimation(generateSteps(pair.a, pair.b)); };
  useEffect(() => { setGenerator(handleRun); }, [handleRun, setGenerator]);

  const { currentStep, steps } = useAlgorithm();
  const defaultDp = Array.from({ length: pair.a.length + 1 }, () => Array(pair.b.length + 1).fill(0));
  const currentData = steps?.[currentStep] || { type: 'idle', dp: defaultDp, cell: null, log: [] };
  const dp = currentData.dp || defaultDp;
  const logRef = useRef(null);
  useEffect(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; }, [currentData.log]);

  return (
    <div className="h-full flex flex-col gap-5">
      <div className="bg-white border border-border rounded-[10px] px-5 py-4">
        <div className="font-mono text-[0.5625rem] tracking-[0.08em] uppercase text-muted mb-3">Strings</div>
        <div className="flex gap-1.5 flex-wrap">
          {PAIRS.map((p, i) => (
            <button key={i} onClick={() => setPairIndex(i)} className="px-2.5 py-1 rounded-[5px] cursor-pointer font-mono text-[0.6875rem]" style={{ border: i === pairIndex ? '1px solid var(--purple)' : '1px solid var(--border)', background: i === pairIndex ? 'var(--purple-light)' : 'var(--white)', color: i === pairIndex ? 'var(--purple)' : 'var(--ink2)', fontWeight: i === pairIndex ? 600 : 400 }}>
              "{p.a}" → "{p.b}"
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-[1fr_280px] gap-5 flex-1 min-h-0">
        <div className="bg-white border border-border rounded-[10px] p-5 flex flex-col">
          <div className="font-mono text-[0.5625rem] tracking-[0.08em] uppercase text-muted mb-4">DP Table</div>
          <div className="flex-1 overflow-auto flex items-start">
            <table className="border-collapse">
              <thead>
                <tr>
                  <th className="w-11 h-9 bg-bg border border-border rounded-tl-[6px]"></th>
                  <th className="w-9 h-9 bg-bg border border-border"></th>
                  {pair.b.split('').map((ch, j) => <th key={j} className="w-9 h-9 bg-bg font-mono text-[0.75rem] font-bold text-ink2 border border-border">{ch}</th>)}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="h-9 bg-bg border border-border"></td>
                  {pair.b.split('').map((_, j) => <td key={j} className="h-9 text-center font-mono text-[0.75rem] border border-border bg-surface text-muted">{j + 1}</td>)}
                </tr>
                {pair.a.split('').map((ch, i) => (
                  <tr key={i}>
                    <td className="h-9 bg-bg font-mono text-[0.75rem] font-bold text-ink2 border border-border">{ch}</td>
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
                      return <td key={j} className="h-9 text-center font-mono text-[0.75rem]" style={{ border, background: bg, color }}>{dp[i + 1]?.[j + 1] ?? 0}</td>;
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {currentData.log && (
          <div className="bg-white border border-border rounded-[10px] px-5 py-4 flex flex-col overflow-hidden">
            <div className="font-mono text-[0.5625rem] tracking-[0.08em] uppercase text-muted mb-2 flex-shrink-0">Execution trace</div>
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

      {currentData.type === 'complete' && (
        <div className="bg-white border border-border rounded-[10px] px-5 py-3 text-center">
          <span className="text-[0.875rem] text-ink2">Edit distance: <span className="font-mono text-lg font-bold text-purple">{currentData.result}</span></span>
        </div>
      )}
    </div>
  );
}
