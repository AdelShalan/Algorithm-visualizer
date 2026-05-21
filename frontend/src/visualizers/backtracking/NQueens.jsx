import { useState, useEffect, useRef } from 'react';
import { useAlgorithm } from '../../contexts/AlgorithmContext';
import { generateSteps } from '../../algorithms/backtracking/n-queens.js';

export default function NQueens() {
  const { setGenerator } = useAlgorithm();
  const [n, setN] = useState(4);

  useEffect(() => { setGenerator(() => generateSteps(n)); }, [n, setGenerator]);

  const { currentStep, steps } = useAlgorithm();
  const currentData = steps?.[currentStep] || { type: 'idle', board: Array(n).fill(-1), log: [] };
  const logRef = useRef(null);
  useEffect(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; }, [currentData.log]);

  return (
    <div className="h-full flex flex-col gap-5">
      <div className="bg-white border border-border rounded-[10px] px-5 py-4">
        <div className="font-mono text-[0.5625rem] tracking-[0.08em] uppercase text-muted mb-3">Input</div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[0.8125rem] text-ink2">N =</span>
            <span className="font-mono text-base font-medium text-purple">{n}</span>
            <button onClick={() => setN(p => Math.max(4, p - 1))} className="w-7 h-7 rounded-md border border-border bg-white text-ink2 cursor-pointer text-[14px] flex items-center justify-center">−</button>
            <button onClick={() => setN(p => Math.min(8, p + 1))} className="w-7 h-7 rounded-md border border-border bg-white text-ink2 cursor-pointer text-[14px] flex items-center justify-center">+</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_280px] gap-5 flex-1 min-h-0">
        <div className="bg-white border border-border rounded-[10px] p-5 flex items-center justify-center">
          <div style={{ display: 'inline-grid', gridTemplateColumns: `repeat(${n}, 60px)`, gap: 0, border: '2px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
            {Array.from({ length: n * n }, (_, i) => {
              const row = Math.floor(i / n); const col = i % n;
              const isLight = (row + col) % 2 === 0;
              const hasQueen = currentData.board[row] === col;
              const isTrying = currentData.type === 'try' && currentData.row === row && currentData.col === col;
              const isConflict = currentData.type === 'conflict' && currentData.row === row && currentData.col === col;
              const isPlacing = currentData.type === 'place' && currentData.row === row && currentData.col === col;
              const isBacktracking = currentData.type === 'backtrack' && currentData.row === row;
              let bg = isLight ? '#f1f5f9' : '#e2e8f0';
              if (isPlacing) bg = '#86efac';
              else if (isConflict) bg = '#fca5a5';
              else if (isTrying) bg = 'var(--amber)';
              else if (isBacktracking) bg = '#fee2e2';
              else if (hasQueen) bg = 'var(--purple)';
              return (
                <div key={i} className="w-[60px] h-[60px] flex items-center justify-center" style={{ background: bg }}>
                  {hasQueen && <span className="text-white text-[1.5rem]" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>♛</span>}
                </div>
              );
            })}
          </div>
        </div>

        {currentData.log && (
          <div className="bg-white border border-border rounded-[10px] px-5 py-4 flex flex-col overflow-hidden">
            <div className="font-mono text-[0.5625rem] tracking-[0.08em] uppercase text-muted mb-2 flex-shrink-0">Search log</div>
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
    </div>
  );
}
