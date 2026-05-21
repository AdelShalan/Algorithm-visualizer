import { useState, useCallback, useEffect, useRef } from 'react';
import { useAlgorithm } from '../../contexts/AlgorithmContext';
import { generateSteps, generateMatrix } from '../../algorithms/graph/FloydWarshall';

const SIZE = 5;

export default function FloydWarshall() {
  const { startAnimation, setGenerator } = useAlgorithm();
  const [matrix, setMatrix] = useState(generateMatrix);

  const handleRun = useCallback(() => { startAnimation(generateSteps(matrix)); }, [matrix, startAnimation]);
  useEffect(() => { setGenerator(handleRun); }, [handleRun, setGenerator]);
  const handleNewMatrix = useCallback(() => { setMatrix(generateMatrix()); }, []);

  const { currentStep, steps } = useAlgorithm();
  const defaultDist = matrix.map(r => [...r]);
  const currentData = steps?.[currentStep] || { type: 'idle', dist: defaultDist, log: [] };
  const dist = currentData.dist || defaultDist;
  const logRef = useRef(null);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [currentData.log]);

  return (
    <div className="h-full flex flex-col gap-5">
      <div className="bg-white border border-border rounded-[10px] px-5 py-4">
        <div className="font-mono text-[0.5625rem] tracking-[0.08em] uppercase text-muted mb-3">Matrix</div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[0.6875rem] text-muted">{SIZE}×{SIZE} distance matrix</span>
          <div className="flex-1" />
          <button onClick={handleNewMatrix} className="px-3 py-1 text-[0.6875rem] rounded-sm border border-border bg-transparent cursor-pointer text-ink2 font-body">New Matrix</button>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_280px] gap-5 flex-1 min-h-0">
        <div className="bg-white border border-border rounded-[10px] p-5 flex flex-col">
          <div className="font-mono text-[0.5625rem] tracking-[0.08em] uppercase text-muted mb-4">All-pairs shortest paths</div>
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col gap-1.5">
              {dist.map((row, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="font-mono text-sm font-bold text-muted w-8">N{i}</span>
                  <div className="flex gap-1">
                    {row.map((val, j) => {
                      const isUpdating = currentData.type === 'update' && currentData.i === i && currentData.j === j;
                      const isChecking = currentData.type === 'check' && currentData.i === i && currentData.j === j;
                      const isK = currentData.type === 'k-iteration' && (i === currentData.k || j === currentData.k);
                      let bg = 'var(--white)', color = 'var(--ink2)', border = '1px solid var(--border)';
                      if (isUpdating) { bg = '#f0fdf4'; color = '#15803d'; border = '2px solid #86efac'; }
                      else if (isChecking) { bg = '#fffbeb'; color = '#92400e'; border = '2px solid var(--amber)'; }
                      else if (isK) { bg = 'var(--purple-light)'; color = 'var(--purple)'; border = 'none'; }
                      return (
                        <div key={j} className="w-16 h-12 flex items-center justify-center rounded-lg font-mono text-sm font-semibold" style={{ background: bg, color, border }}>
                          {val === Infinity ? '∞' : val}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
              {currentData.k !== undefined && <div className="text-center mt-4 font-mono text-sm text-muted">Intermediate vertex: <span className="font-bold text-purple">k = {currentData.k}</span></div>}
            </div>
          </div>
        </div>

        {currentData.log && (
          <div className="bg-white border border-border rounded-[10px] px-4 py-3 flex flex-col overflow-hidden">
            <div className="font-mono text-[0.5625rem] tracking-[0.08em] uppercase text-muted mb-2 flex-shrink-0">Execution trace</div>
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
