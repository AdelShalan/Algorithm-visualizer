import { useState, useCallback, useEffect, useRef } from 'react';
import { useAlgorithm } from '../../contexts/AlgorithmContext';
import { generateSteps, generateSortedArray } from '../../algorithms/searching/BinarySearch';

export default function BinarySearch() {
  const { startAnimation, setGenerator } = useAlgorithm();
  const [size, setSize] = useState(32);
  const [array, setArray] = useState(() => generateSortedArray(32, 1, 100));
  const [target, setTarget] = useState(50);

  const generateSteps = useCallback((arr, tgt) => {
    const steps = [];
    const log = [];
    let low = 0, high = arr.length - 1;
    log.push(`Searching for ${tgt} in sorted array of ${arr.length} elements`);
    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      log.push(`low=${low}, high=${high}, mid=${mid} → arr[${mid}] = ${arr[mid]}`);
      steps.push({ type: 'check-mid', low, high, mid, array: [...arr], found: arr[mid] === tgt, log: [...log] });
      if (arr[mid] === tgt) {
        log.push(`Target ${tgt} found at index ${mid} ✓`);
        steps.push({ type: 'found', index: mid, low, high, array: [...arr], log: [...log] });
        return steps;
      } else if (arr[mid] < tgt) {
        log.push(`${arr[mid]} < ${tgt} — searching right half [${mid + 1}, ${high}]`);
        low = mid + 1;
      } else {
        log.push(`${arr[mid]} > ${tgt} — searching left half [${low}, ${mid - 1}]`);
        high = mid - 1;
      }
    }
    log.push(`Target ${tgt} not found in array`);
    steps.push({ type: 'not-found', low, high, array: [...arr], log: [...log] });
    return steps;
  }, []);

  const handleRun = useCallback(() => {
    startAnimation(generateSteps(array, target));
  }, [array, target, generateSteps, startAnimation]);

  useEffect(() => { setGenerator(handleRun); }, [handleRun, setGenerator]);

  const handleShuffle = useCallback(() => {
    const newArr = generateSortedArray(size, 1, 100);
    setArray(newArr);
    setTarget(newArr[Math.floor(Math.random() * newArr.length)]);
  }, [size]);

  const handleSizeChange = useCallback((delta) => {
    setSize(prev => {
      const next = Math.min(64, Math.max(8, prev + delta));
      const rounded = Math.pow(2, Math.round(Math.log2(next)));
      const newArr = generateSortedArray(rounded, 1, 100);
      setArray(newArr);
      setTarget(newArr[Math.floor(Math.random() * newArr.length)]);
      return rounded;
    });
  }, []);

  const { currentStep, steps } = useAlgorithm();
  const currentData = steps?.[currentStep] || { array, type: 'idle', low: 0, high: array.length - 1, mid: -1, log: [] };
  const safeArray = currentData.array != null ? currentData.array : array;
  const maxVal = Math.max(...safeArray);
  const logRef = useRef(null);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [currentData.log]);

  const getBoxStyle = (i) => {
    const inRange = i >= (currentData.low ?? 0) && i <= (currentData.high ?? array.length - 1);
    const isMid = currentData.mid === i;
    const isFound = currentData.type === 'found' && currentData.index === i;
    const isNotFound = currentData.type === 'not-found';
    if (isFound) return { bg: '#dcfce7', text: '#15803d', border: '#86efac' };
    if (isMid) return { bg: '#fef3c7', text: '#92400e', border: 'var(--amber)' };
    if (isNotFound) return { bg: '#fef2f2', text: '#dc2626', border: '#fca5a5' };
    if (inRange) return { bg: '#ede9fe', text: '#7c3aed', border: '#a78bfa' };
    return { bg: 'var(--bg)', text: 'var(--muted)', border: 'var(--border)' };
  };

  const getBarBg = (i) => {
    const inRange = i >= (currentData.low ?? 0) && i <= (currentData.high ?? array.length - 1);
    const isMid = currentData.mid === i;
    const isFound = currentData.type === 'found' && currentData.index === i;
    const isNotFound = currentData.type === 'not-found';
    if (isFound) return '#86efac';
    if (isMid) return 'var(--amber)';
    if (isNotFound) return '#fca5a5';
    if (inRange) return 'var(--purple)';
    return 'var(--border)';
  };

  const getBarOpacity = (i) => {
    const inRange = i >= (currentData.low ?? 0) && i <= (currentData.high ?? array.length - 1);
    const isFound = currentData.type === 'found' && currentData.index === i;
    const isMid = currentData.mid === i;
    const isNotFound = currentData.type === 'not-found';
    if (isFound || isMid || isNotFound || inRange) return 1;
    return 0.25;
  };

  return (
    <div className="h-full flex flex-col gap-5">
      <div className="bg-white border border-border rounded-[10px] px-5 py-4">
        <div className="font-mono text-[0.5625rem] tracking-[0.08em] uppercase text-muted mb-3">Input</div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[0.8125rem] text-ink2">Target:</span>
            <span className="font-mono text-base font-medium text-purple">{target}</span>
          </div>
          <div className="flex items-center gap-2 flex-1">
            <span className="font-mono text-[0.8125rem] text-ink2">n =</span>
            <span className="font-mono text-base font-medium text-purple min-w-[2ch] text-center">{size}</span>
            <button onClick={() => handleSizeChange(-4)} className="w-7 h-7 rounded-md border border-border bg-white text-ink2 cursor-pointer text-sm flex items-center justify-center">−</button>
            <button onClick={() => handleSizeChange(4)} className="w-7 h-7 rounded-md border border-border bg-white text-ink2 cursor-pointer text-sm flex items-center justify-center">+</button>
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
            <div className="font-mono text-[0.5625rem] tracking-[0.08em] uppercase text-muted mb-4">Binary search visualization</div>
            <div className="flex-1 flex items-end justify-center gap-0.5 min-h-0">
              {safeArray.map((value, i) => {
                const height = (value / maxVal) * 100;
                return (
                  <div key={i} className="w-12 rounded-xl flex items-center justify-center" style={{ height: `${height}%`, background: getBarBg(i), opacity: getBarOpacity(i) }}>
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
          <div className="bg-white border border-border rounded-[10px] px-4 py-3 flex flex-col overflow-hidden">
            <div className="font-mono text-[0.5625rem] tracking-[0.08em] uppercase text-muted mb-2 flex-shrink-0">Search log</div>
            <div ref={logRef} className="flex-1 overflow-y-auto flex flex-col gap-[3px]">
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
