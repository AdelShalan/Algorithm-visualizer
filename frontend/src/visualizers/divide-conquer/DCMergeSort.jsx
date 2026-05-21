import { useState, useCallback, useEffect, useRef } from 'react';
import { useAlgorithm } from '../../contexts/AlgorithmContext';
import { generateRandomArray } from '../../utils/helpers';
import { generateSteps } from '../../algorithms/divide-conquer/dc-merge-sort.js';

export default function DCMergeSort() {
  const { startAnimation, setGenerator } = useAlgorithm();
  const [size, setSize] = useState(8);
  const [array, setArray] = useState(() => generateRandomArray(8, 1, 50));

  const handleRun = useCallback(() => { startAnimation(generateSteps(array)); }, [array, startAnimation]);
  useEffect(() => { setGenerator(handleRun); }, [handleRun, setGenerator]);

  const logRef = useRef(null);

  const handleShuffle = useCallback(() => { setArray(generateRandomArray(size, 1, 50)); }, [size]);
  const handleSizeChange = useCallback((delta) => {
    setSize(prev => {
      const next = Math.min(16, Math.max(4, prev + delta));
      const rounded = Math.pow(2, Math.round(Math.log2(next)));
      setArray(generateRandomArray(rounded, 1, 50));
      return rounded;
    });
  }, []);

  const { currentStep, steps } = useAlgorithm();
  const currentData = steps?.[currentStep] || { array, type: 'idle', log: [] };
  const safeArray = currentData.array != null ? currentData.array : array;
  const maxVal = Math.max(...safeArray);

  const getBoxStyle = (i) => {
    const isSplitting = currentData.type === 'split' && currentData.range && i >= currentData.range[0] && i <= currentData.range[1];
    const isMerging = currentData.type === 'merge-element' && currentData.index === i;
    const isComplete = currentData.type === 'complete';
    if (isComplete) return { bg: '#dcfce7', text: '#15803d', border: '#86efac' };
    if (isMerging) return { bg: '#ede9fe', text: '#7c3aed', border: '#a78bfa' };
    if (isSplitting) return { bg: '#fef3c7', text: '#92400e', border: 'var(--amber)' };
    return { bg: 'var(--bg)', text: 'var(--ink2)', border: 'var(--border)' };
  };

  const getBarBg = (i) => {
    const isSplitting = currentData.type === 'split' && currentData.range && i >= currentData.range[0] && i <= currentData.range[1];
    const isMerging = currentData.type === 'merge-element' && currentData.index === i;
    const isComplete = currentData.type === 'complete';
    if (isComplete) return '#86efac';
    if (isMerging) return '#a78bfa';
    if (isSplitting) return 'var(--amber)';
    return 'var(--purple)';
  };

  return (
    <div className="flex h-full flex-col gap-5">
      <div className="rounded-[10px] border border-border bg-white p-5">
        <div className="mb-3 font-mono text-[.5625rem] uppercase tracking-[.08em] text-muted">Array</div>
        <div className="flex items-center gap-3">
          <div className="flex flex-1 items-center gap-2">
            <span className="font-mono text-[.8125rem] text-ink2">n =</span>
            <span className="min-w-[2ch] text-center font-mono text-[1rem] font-medium text-purple">{size}</span>
            <button onClick={() => handleSizeChange(-2)} className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-white text-[14px] text-ink2 cursor-pointer">−</button>
            <button onClick={() => handleSizeChange(2)} className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-white text-[14px] text-ink2 cursor-pointer">+</button>
          </div>
          <button onClick={handleShuffle} className="cursor-pointer border border-border bg-transparent px-3 py-[.3rem] text-[.6875rem] font-body text-ink2">Shuffle</button>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-[1fr_280px] gap-5">
        <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-hidden">
          <div className="flex flex-col rounded-[10px] border border-border bg-white p-5">
            <div className="mb-4 font-mono text-[.5625rem] uppercase tracking-[.08em] text-muted">Array</div>
            <div className="flex shrink-0 justify-center gap-2">
              {safeArray.map((value, i) => {
                const hl = getBoxStyle(i);
                return (
                  <div key={i} className="flex h-9 w-12 items-center justify-center rounded-md font-mono text-[.75rem] font-semibold" style={{ background: hl.bg, color: hl.text, border: `1px solid ${hl.border}` }}>
                    {value}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex min-h-0 flex-1 flex-col rounded-[10px] border border-border bg-white p-5">
            <div className="mb-4 font-mono text-[.5625rem] uppercase tracking-[.08em] text-muted">Divide and merge phases</div>
            <div className="flex min-h-0 flex-1 items-end justify-center gap-3">
              {safeArray.map((value, i) => {
                const height = (value / maxVal) * 100;
                return (
                  <div key={i} className="flex w-12 items-center justify-center rounded-xl" style={{ height: `${height}%`, background: getBarBg(i) }}>
                    <span className="font-mono text-[.75rem] font-bold text-white">{value}</span>
                  </div>
                );
              })}
            </div>
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
