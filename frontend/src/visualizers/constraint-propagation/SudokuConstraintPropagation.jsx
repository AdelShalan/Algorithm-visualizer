import { useState, useCallback, useEffect, useRef } from 'react';
import { useAlgorithm } from '../../contexts/AlgorithmContext';
import { generateSteps } from '../../algorithms/constraint-propagation/sudoku-constraint-propagation.js';

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
            if (isValid(b, r, c, num)) { b[r][c] = num; if (fill(b)) return true; b[r][c] = 0; }
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

export default function SudokuConstraintPropagation() {
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
  const currentData = steps?.[currentStep] || { type: 'idle', board: puzzle, candidates: null, log: [] };
  const board = currentData.board || puzzle;
  const candidates = currentData.candidates;
  const givenMask = puzzle.map(r => r.map(v => v !== 0));
  const logRef = useRef(null);
  useEffect(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; }, [currentData.log]);

  return (
    <div className="flex h-full flex-col gap-5">
      <div className="flex items-center justify-between rounded-[10px] border border-border bg-white p-5">
        <div>
          <div className="mb-1 font-mono text-[.5625rem] uppercase tracking-[.08em] text-muted">Puzzle</div>
          <span className="font-mono text-[.6875rem] text-muted">9×9 Sudoku — {puzzle.flat().filter(v => v !== 0).length} clues — CP + Backtracking</span>
        </div>
        <button
          onClick={handleNewPuzzle}
          className="rounded-md border-none bg-purple px-3.5 py-1 text-[.75rem] font-medium font-body text-white cursor-pointer transition-opacity duration-150 hover:opacity-85"
        >
          New puzzle
        </button>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-[1fr_280px] gap-5">
        <div className="flex items-center justify-center rounded-[10px] border border-border bg-white p-5">
          <div className="inline-grid overflow-hidden rounded-lg border-2 border-ink" style={{ gridTemplateColumns: 'repeat(9, 44px)' }}>
            {board.flat().map((val, i) => {
              const row = Math.floor(i / 9); const col = i % 9;
              const isGiven = givenMask[row][col];
              const isNakedSingle = currentData.type === 'naked-single' && currentData.row === row && currentData.col === col;
              const isTrying = currentData.type === 'try' && currentData.row === row && currentData.col === col;
              const isEliminating = currentData.type === 'eliminate' && currentData.row === row && currentData.col === col;
              const isGuessing = currentData.type === 'guess' && currentData.row === row && currentData.col === col;
              const isBacktracking = currentData.type === 'backtrack' && currentData.row === row && currentData.col === col;
              const isContradiction = currentData.type === 'contradiction' && currentData.row === row && currentData.col === col;
              const isSolved = currentData.type === 'solved';

              let bg = (row + col) % 2 === 0 ? 'var(--white)' : '#f8fafc';
              let color = 'var(--ink2)';
              if (isGiven) bg = 'var(--bg)';
              if (isNakedSingle) { bg = '#86efac'; color = '#fff'; }
              else if (isTrying) { bg = '#86efac'; color = '#fff'; }
              else if (isEliminating) { bg = '#fef3c7'; color = '#92400e'; }
              else if (isGuessing) { bg = '#bfdbfe'; color = '#1e40af'; }
              else if (isBacktracking) { bg = '#fca5a5'; color = '#fff'; }
              else if (isContradiction) { bg = '#fecaca'; color = '#991b1b'; }
              else if (isSolved) bg = '#dcfce7';

              const cellCandidates = candidates?.[row]?.[col];
              const showCandidates = !isGiven && cellCandidates && cellCandidates.size > 1 && val === 0;

              return (
                <div key={i} className="flex h-11 w-11 items-center justify-center font-mono text-[.875rem] font-bold" style={{ background: bg, color, borderRight: (col + 1) % 3 === 0 && col < 8 ? '2px solid var(--ink)' : '1px solid var(--border)', borderBottom: (row + 1) % 3 === 0 && row < 8 ? '2px solid var(--ink)' : '1px solid var(--border)' }}>
                  {val !== 0 ? val : (showCandidates ? (
                    <div className="grid h-full w-full grid-cols-3 grid-rows-3 p-0.5">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                        <span key={n} className="flex items-center justify-center text-[0.5rem] font-normal" style={{ color: cellCandidates.has(n) ? 'var(--ink2)' : 'transparent' }}>{n}</span>
                      ))}
                    </div>
                  ) : '')}
                </div>
              );
            })}
          </div>
        </div>

        {currentData.log && (
          <div className="flex flex-col overflow-hidden rounded-[10px] border border-border bg-white px-5 py-4">
            <div className="mb-2 shrink-0 font-mono text-[.5625rem] uppercase tracking-[.08em] text-muted">Propagation log</div>
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

      <div className="flex min-h-[2.5rem] items-center justify-center rounded-[10px] border border-border bg-white px-5 py-3 text-center font-mono text-[.75rem] text-ink2">
        {currentData.type === 'naked-single' && <span className="text-[#15803d]">Naked single: ({currentData.row}, {currentData.col}) = {currentData.num}</span>}
        {currentData.type === 'try' && <span>Trying {currentData.num} at ({currentData.row}, {currentData.col})</span>}
        {currentData.type === 'eliminate' && <span className="text-[#92400e]">Eliminated {currentData.num} from ({currentData.row}, {currentData.col})</span>}
        {currentData.type === 'guess' && <span className="text-[#1e40af]">Guessing at ({currentData.row}, {currentData.col}): {currentData.values?.join(', ')}</span>}
        {currentData.type === 'backtrack' && <span className="text-[#e11d48]">Backtracked from ({currentData.row}, {currentData.col})</span>}
        {currentData.type === 'contradiction' && <span className="text-[#991b1b]">Contradiction at ({currentData.row}, {currentData.col})</span>}
        {currentData.type === 'solved' && <span className="font-semibold text-[#15803d]">Puzzle solved!</span>}
        {currentData.type === 'idle' && <span className="text-muted">Ready to solve</span>}
      </div>
    </div>
  );
}
