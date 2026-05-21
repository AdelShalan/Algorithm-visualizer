import { useEffect, useRef } from 'react';
import { useAlgorithm } from '../../contexts/AlgorithmContext';
import { generateSteps } from '../../algorithms/dp/knapsack';

const ITEMS = [
  { weight: 2, value: 3 }, { weight: 3, value: 4 }, { weight: 4, value: 5 },
  { weight: 5, value: 7 }, { weight: 6, value: 8 },
];
const CAPACITY = 10;

export default function Knapsack() {
  const { startAnimation, setGenerator } = useAlgorithm();

  const handleRun = () => { startAnimation(generateSteps(ITEMS, CAPACITY)); };
  useEffect(() => { setGenerator(handleRun); }, [handleRun, setGenerator]);

  const { currentStep, steps } = useAlgorithm();
  const defaultDp = Array.from({ length: ITEMS.length + 1 }, () => Array(CAPACITY + 1).fill(0));
  const currentData = steps?.[currentStep] || { type: 'idle', dp: defaultDp, cell: null, log: [] };
  const dp = currentData.dp || defaultDp;
  const logRef = useRef(null);
  useEffect(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; }, [currentData.log]);

  return (
    <div className="h-full flex flex-col gap-5">
      <div className="bg-white border border-border rounded-[10px] px-5 py-4">
        <div className="font-mono text-[0.5625rem] tracking-[0.08em] uppercase text-muted mb-3">Items</div>
        <div className="flex gap-2 flex-wrap">
          {ITEMS.map((item, i) => (
            <div key={i} className="px-2.5 py-1 rounded-[5px] bg-bg font-mono text-[0.6875rem] text-ink2">w:{item.weight} v:{item.value}</div>
          ))}
          <div className="px-2.5 py-1 rounded-[5px] bg-purple-light font-mono text-[0.6875rem] text-purple font-medium">Capacity: {CAPACITY}</div>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_280px] gap-5 flex-1 min-h-0">
        <div className="bg-white border border-border rounded-[10px] p-5 flex flex-col">
          <div className="font-mono text-[0.5625rem] tracking-[0.08em] uppercase text-muted mb-4">DP Table</div>
          <div className="flex-1 overflow-auto flex items-start">
            <table className="border-collapse">
              <thead>
                <tr>
                  <th className="w-[120px] h-9 bg-bg text-[0.625rem] font-bold text-muted border border-border rounded-tl-[6px]">Item \ W</th>
                  {Array.from({ length: CAPACITY + 1 }, (_, w) => <th key={w} className="w-[52px] h-9 bg-bg font-mono text-[0.6875rem] font-bold text-ink2 border border-border">{w}</th>)}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="h-9 bg-surface text-[0.625rem] font-bold text-muted border border-border">0 (none)</td>
                  {Array.from({ length: CAPACITY + 1 }, (_, w) => <td key={w} className="h-9 text-center font-mono text-[0.75rem] border border-border bg-surface text-muted">0</td>)}
                </tr>
                {ITEMS.map((item, i) => (
                  <tr key={i}>
                    <td className="h-9 bg-surface text-[0.625rem] font-bold text-muted border border-border">{i + 1} (w:{item.weight}, v:{item.value})</td>
                    {Array.from({ length: CAPACITY + 1 }, (_, w) => {
                      const isCurrent = currentData.cell?.row === i + 1 && currentData.cell?.col === w;
                      const isComplete = currentData.type === 'complete';
                      let bg = 'var(--white)', color = 'var(--ink2)', border = '1px solid var(--border)';
                      if (isCurrent) { bg = 'var(--purple-light)'; color = 'var(--purple)'; border = '2px solid var(--purple)'; }
                      else if (isComplete) { bg = '#f0fdf4'; color = '#15803d'; }
                      return <td key={w} className="h-9 text-center font-mono text-[0.75rem]" style={{ border, background: bg, color }}>{dp[i + 1]?.[w] ?? 0}</td>;
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
          <span className="text-[0.875rem] text-ink2">Maximum value: <span className="font-mono text-lg font-bold text-purple">{currentData.result}</span></span>
        </div>
      )}
    </div>
  );
}
