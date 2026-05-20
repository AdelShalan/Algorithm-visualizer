import { useState, useCallback, useEffect, useRef } from 'react';
import { useAlgorithm } from '../../contexts/AlgorithmContext';

export default function NQueens() {
  const { setGenerator } = useAlgorithm();
  const [n, setN] = useState(4);

  const createGenerator = useCallback((size) => {
    return function* () {
      const log = [];
      const board = Array(size).fill(-1);
      function isValid(row, col) {
        for (let r = 0; r < row; r++) {
          const c = board[r];
          if (c === col || Math.abs(c - col) === Math.abs(r - row)) return false;
        }
        return true;
      }
      function* solve(row) {
        if (row === size) { log.push(`Solution found!`); yield { type: 'solution', board: [...board], log: [...log] }; return true; }
        for (let col = 0; col < size; col++) {
          log.push(`Try queen at (${row}, ${col})`);
          yield { type: 'try', row, col, board: [...board], log: [...log] };
          if (isValid(row, col)) {
            board[row] = col; log.push(`Place queen at (${row}, ${col})`); yield { type: 'place', row, col, board: [...board], log: [...log] };
            if (yield* solve(row + 1)) return true;
            board[row] = -1; log.push(`Backtrack from row ${row}`); yield { type: 'backtrack', row, col, board: [...board], log: [...log] };
          } else { log.push(`Conflict at (${row}, ${col})`); yield { type: 'conflict', row, col, board: [...board], log: [...log] }; }
        }
        return false;
      }
      yield* solve(0);
      log.push(`Search complete`);
      yield { type: 'done', board: [...board], log: [...log] };
    };
  }, []);

  useEffect(() => { setGenerator(() => createGenerator(n)()); }, [n, createGenerator, setGenerator]);

  const { currentStep, steps } = useAlgorithm();
  const currentData = steps?.[currentStep] || { type: 'idle', board: Array(n).fill(-1), log: [] };
  const logRef = useRef(null);
  useEffect(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; }, [currentData.log]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '10px', padding: '1rem 1.25rem' }}>
        <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '.5625rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '.75rem' }}>Input</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
            <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '.8125rem', color: 'var(--ink2)' }}>N =</span>
            <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '1rem', fontWeight: 500, color: 'var(--purple)' }}>{n}</span>
            <button onClick={() => setN(p => Math.max(4, p - 1))} style={{ width: 28, height: 28, borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--white)', color: 'var(--ink2)', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
            <button onClick={() => setN(p => Math.min(8, p + 1))} style={{ width: 28, height: 28, borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--white)', color: 'var(--ink2)', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '1.25rem', flex: 1, minHeight: 0 }}>
        <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '10px', padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
                <div key={i} style={{ width: 60, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', background: bg }}>
                  {hasQueen && <span style={{ color: '#fff', fontSize: '1.5rem', textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>♛</span>}
                </div>
              );
            })}
          </div>
        </div>

        {currentData.log && (
          <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '10px', padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '.5625rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '.5rem', flexShrink: 0 }}>Search log</div>
            <div ref={logRef} style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '3px' }}>
              {currentData.log.map((entry, i) => {
                const isLast = i === currentData.log.length - 1;
                return (
                  <div key={i} style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '.625rem', padding: '.3rem .5rem', borderRadius: '4px', color: isLast ? 'var(--purple)' : 'var(--muted)', background: isLast ? 'var(--purple-light)' : 'transparent', fontWeight: isLast ? 500 : 400 }}>{entry}</div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
