import { useState, useCallback, useEffect, useRef } from 'react';
import { useAlgorithm } from '../../contexts/AlgorithmContext';
import { generateSteps } from '../../algorithms/backtracking/sudoku.js';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generatePuzzle(clues = 35) {
  const board = Array.from({ length: 9 }, () => Array(9).fill(0));

  function isValid(b, row, col, num) {
    for (let i = 0; i < 9; i++) { if (b[row][i] === num || b[i][col] === num) return false; }
    const br = Math.floor(row / 3) * 3; const bc = Math.floor(col / 3) * 3;
    for (let r = br; r < br + 3; r++) { for (let c = bc; c < bc + 3; c++) { if (b[r][c] === num) return false; } }
    return true;
  }

  function fill(b) {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (b[r][c] === 0) {
          for (const num of shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9])) {
            if (isValid(b, r, c, num)) {
              b[r][c] = num;
              if (fill(b)) return true;
              b[r][c] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  fill(board);

  const puzzle = board.map(r => [...r]);
  const cells = shuffle([...Array(81).keys()]);
  let removed = 0;
  for (const idx of cells) {
    if (removed >= 81 - clues) break;
    const r = Math.floor(idx / 9); const c = idx % 9;
    puzzle[r][c] = 0;
    removed++;
  }

  return puzzle;
}

export default function Sudoku() {
  const { setGenerator, resetAnimation } = useAlgorithm();
  const [puzzle, setPuzzle] = useState(() => generatePuzzle(35));
  const [puzzleKey, setPuzzleKey] = useState(0);

  useEffect(() => {
    resetAnimation();
    setGenerator(() => generateSteps(puzzle));
  }, [puzzleKey, puzzle, setGenerator, resetAnimation]);

  const handleNewPuzzle = useCallback(() => {
    setPuzzle(generatePuzzle(35));
    setPuzzleKey(k => k + 1);
  }, []);

  const { currentStep, steps } = useAlgorithm();
  const currentData = steps?.[currentStep] || { type: 'idle', board: puzzle, log: [] };
  const board = currentData.board || puzzle;
  const givenMask = puzzle.map(r => r.map(v => v !== 0));
  const logRef = useRef(null);
  useEffect(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; }, [currentData.log]);

  return (
    <div className="h-full flex flex-col gap-5">
      <div className="bg-white border border-border rounded-[10px] px-5 py-4 flex items-center justify-between">
        <div>
          <div className="font-mono text-[0.5625rem] tracking-[0.08em] uppercase text-muted mb-1">Puzzle</div>
          <span className="font-mono text-[0.6875rem] text-muted">9×9 Sudoku — {puzzle.flat().filter(v => v !== 0).length} clues</span>
        </div>
        <button
          onClick={handleNewPuzzle}
          className="px-3.5 py-[0.4rem] text-[0.75rem] font-medium font-body bg-purple text-white border-none rounded-md cursor-pointer transition-opacity duration-150 hover:opacity-85"
        >
          New puzzle
        </button>
      </div>

      <div className="grid grid-cols-[1fr_280px] gap-5 flex-1 min-h-0">
        <div className="bg-white border border-border rounded-[10px] p-5 flex items-center justify-center">
          <div style={{ display: 'inline-grid', gridTemplateColumns: 'repeat(9, 44px)', gap: 0, border: '2px solid var(--ink)', borderRadius: '8px', overflow: 'hidden' }}>
            {board.flat().map((val, i) => {
              const row = Math.floor(i / 9); const col = i % 9;
              const isGiven = givenMask[row][col];
              const isTrying = currentData.type === 'try' && currentData.row === row && currentData.col === col;
              const isPlacing = currentData.type === 'place' && currentData.row === row && currentData.col === col;
              const isBacktracking = currentData.type === 'backtrack' && currentData.row === row && currentData.col === col;
              const isSolved = currentData.type === 'solved';
              let bg = (row + col) % 2 === 0 ? 'var(--white)' : '#f8fafc';
              let color = 'var(--ink2)';
              if (isGiven) bg = 'var(--bg)';
              if (isPlacing) { bg = '#86efac'; color = '#fff'; }
              else if (isBacktracking) { bg = '#fca5a5'; color = '#fff'; }
              else if (isTrying) { bg = 'var(--amber)'; color = '#fff'; }
              else if (isSolved) bg = '#dcfce7';
              return (
                <div key={i} className="w-11 h-11 flex items-center justify-center font-mono text-[0.875rem] font-bold" style={{ background: bg, color, borderRight: (col + 1) % 3 === 0 && col < 8 ? '2px solid var(--ink)' : '1px solid var(--border)', borderBottom: (row + 1) % 3 === 0 && row < 8 ? '2px solid var(--ink)' : '1px solid var(--border)' }}>
                  {val !== 0 ? val : ''}
                </div>
              );
            })}
          </div>
        </div>

        {currentData.log && (
          <div className="bg-white border border-border rounded-[10px] px-5 py-4 flex flex-col overflow-hidden">
            <div className="font-mono text-[0.5625rem] tracking-[0.08em] uppercase text-muted mb-2 flex-shrink-0">Call stack</div>
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

      <div className="bg-white border border-border rounded-[10px] px-5 py-3 text-center font-mono text-[0.75rem] text-ink2 min-h-[2.5rem] flex items-center justify-center">
        {currentData.type === 'try' && <span>Trying {currentData.num} at ({currentData.row}, {currentData.col})</span>}
        {currentData.type === 'place' && <span className="text-green-700">Placed {currentData.num} at ({currentData.row}, {currentData.col})</span>}
        {currentData.type === 'backtrack' && <span className="text-rose-600">Backtracking from ({currentData.row}, {currentData.col})</span>}
        {currentData.type === 'solved' && <span className="text-green-700 font-semibold">Puzzle solved!</span>}
        {currentData.type === 'idle' && <span className="text-muted">Ready to solve</span>}
      </div>
    </div>
  );
}
