import { useState, useCallback, useEffect, useRef } from 'react';
import { useAlgorithm } from '../../contexts/AlgorithmContext';
import { generateRandomArray } from '../../utils/helpers';
import { generateSteps } from '../../algorithms/sorting/insertion-sort.js';

export default function InsertionSort() {
  const { startAnimation, setGenerator } = useAlgorithm();
  const [size, setSize] = useState(30);
  const [array, setArray] = useState(() => generateRandomArray(30));

  const handleRun = useCallback(() => {
    startAnimation(generateSteps(array));
  }, [array, startAnimation]);

  useEffect(() => { setGenerator(handleRun); }, [handleRun, setGenerator]);

  const handleShuffle = useCallback(() => {
    setArray(generateRandomArray(size));
  }, [size]);

  const handleSizeChange = useCallback((delta) => {
    setSize(prev => {
      const next = Math.min(80, Math.max(10, prev + delta));
      setArray(generateRandomArray(next));
      return next;
    });
  }, []);

  const { currentStep, steps } = useAlgorithm();
  const currentData = steps?.[currentStep] || { array, type: 'idle', indices: [], log: [] };
  const safeArray = currentData.array != null ? currentData.array : array;
  const maxVal = Math.max(...safeArray);
  const logRef = useRef(null);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [currentData.log]);

  const getBoxStyle = (i) => {
    const isComparing = currentData.indices?.includes(i);
    const isPicked = currentData.type === 'pick' && currentData.index === i;
    const isInserting = currentData.type === 'insert' && currentData.index === i;
    const isSorted = currentData.type === 'sorted' && currentData.indices?.includes(i);
    const isComplete = currentData.type === 'complete';
    if (isComplete || isSorted) return { bg: '#dcfce7', text: '#15803d', border: '#86efac' };
    if (isInserting) return { bg: '#dcfce7', text: '#15803d', border: '#86efac' };
    if (isPicked) return { bg: '#ede9fe', text: '#7c3aed', border: '#a78bfa' };
    if (isComparing) return { bg: '#fef3c7', text: '#92400e', border: 'var(--amber)' };
    return { bg: 'var(--bg)', text: 'var(--ink2)', border: 'var(--border)' };
  };

  const getBarBg = (i) => {
    const isComparing = currentData.indices?.includes(i);
    const isPicked = currentData.type === 'pick' && currentData.index === i;
    const isInserting = currentData.type === 'insert' && currentData.index === i;
    const isSorted = currentData.type === 'sorted' && currentData.indices?.includes(i);
    const isComplete = currentData.type === 'complete';
    if (isComplete) return '#86efac';
    if (isSorted) return '#bbf7d0';
    if (isInserting) return '#86efac';
    if (isPicked) return '#a78bfa';
    if (isComparing) return 'var(--amber)';
    return 'var(--purple)';
  };

  return (
    <div className="h-full flex flex-col gap-5">
      <div className="bg-white border border-border rounded-[10px] px-5 py-4">
        <div className="font-mono text-[0.5625rem] tracking-[0.08em] uppercase text-muted mb-3">Array</div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 flex-1">
            <span className="font-mono text-[0.8125rem] text-ink2">n =</span>
            <span className="font-mono text-base font-medium text-purple min-w-[2ch] text-center">{size}</span>
            <button onClick={() => handleSizeChange(-5)} className="w-7 h-7 rounded-md border border-border bg-white text-ink2 cursor-pointer text-sm flex items-center justify-center">−</button>
            <button onClick={() => handleSizeChange(5)} className="w-7 h-7 rounded-md border border-border bg-white text-ink2 cursor-pointer text-sm flex items-center justify-center">+</button>
          </div>
          <button onClick={handleShuffle} className="px-3 py-1 text-[0.6875rem] rounded-sm border border-border bg-transparent cursor-pointer text-ink2 font-body">Shuffle</button>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_280px] gap-5 flex-1 min-h-0">
        <div className="flex flex-col gap-5 overflow-hidden">
          <div className="bg-white border border-border rounded-[10px] p-5 flex flex-col">
            <div className="font-mono text-[0.5625rem] tracking-[0.08em] uppercase text-muted mb-4">Array</div>
            <div className="flex justify-center gap-0.5 flex-shrink-0">
              {safeArray.map((value, i) => {
                const hl = getBoxStyle(i);
                return (
                  <div key={i} className="flex-1 max-w-[48px] h-9 flex items-center justify-center rounded-md font-mono text-[0.6875rem] font-semibold" style={{ background: hl.bg, color: hl.text, border: `1px solid ${hl.border}` }}>
                    {value}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white border border-border rounded-[10px] p-5 flex flex-col flex-1 min-h-0">
            <div className="font-mono text-[0.5625rem] tracking-[0.08em] uppercase text-muted mb-4">Sorting visualization</div>
            <div className="flex-1 flex items-end justify-center gap-0.5 min-h-0">
              {safeArray.map((value, i) => {
                const height = (value / maxVal) * 100;
                return (
                  <div key={i} className="w-12 rounded-xl flex items-center justify-center" style={{ height: `${height}%`, background: getBarBg(i) }}>
                    <span className="text-white font-mono text-xs font-bold">{value}</span>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-center gap-0.5 flex-shrink-0 mt-1">
              {safeArray.map((_, i) => (
                <div key={i} className="w-12 text-center font-mono text-[0.5rem] text-muted">{i}</div>
              ))}
            </div>
          </div>
        </div>

        {currentData.log && (
          <div className="bg-white border border-border rounded-[10px] px-5 py-4 flex flex-col overflow-hidden">
            <div className="font-mono text-[0.5625rem] tracking-[0.08em] uppercase text-muted mb-2 flex-shrink-0">Execution trace</div>
            <div ref={logRef} className="flex-1 overflow-y-auto flex flex-col gap-0.75">
              {currentData.log.map((entry, i) => {
                const isLast = i === currentData.log.length - 1;
                return (
                  <div key={i} className="font-mono text-[0.625rem] px-2 py-1 rounded-sm" style={{ color: isLast ? 'var(--purple)' : 'var(--muted)', background: isLast ? 'var(--purple-light)' : 'transparent', fontWeight: isLast ? 500 : 400 }}>{entry}</div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
