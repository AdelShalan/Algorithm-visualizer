import { useState, useCallback, useEffect, useRef } from 'react';
import { useAlgorithm } from '../../contexts/AlgorithmContext';

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

  const createGenerator = useCallback((p) => {
    return function* () {
      const log = [];
      const board = p.map(r => [...r]);
      function isValid(row, col, num) {
        for (let i = 0; i < 9; i++) { if (board[row][i] === num || board[i][col] === num) return false; }
        const boxRow = Math.floor(row / 3) * 3; const boxCol = Math.floor(col / 3) * 3;
        for (let r = boxRow; r < boxRow + 3; r++) { for (let c = boxCol; c < boxCol + 3; c++) { if (board[r][c] === num) return false; } }
        return true;
      }
      function* solve() {
        for (let row = 0; row < 9; row++) {
          for (let col = 0; col < 9; col++) {
            if (board[row][col] === 0) {
              for (let num = 1; num <= 9; num++) {
                log.push(`Try ${num} at (${row}, ${col})`);
                yield { type: 'try', row, col, num, board: board.map(r => [...r]), log: [...log] };
                if (isValid(row, col, num)) {
                  board[row][col] = num; log.push(`Place ${num} at (${row}, ${col})`); yield { type: 'place', row, col, num, board: board.map(r => [...r]), log: [...log] };
                  if (yield* solve()) return true;
                  board[row][col] = 0; log.push(`Backtrack from (${row}, ${col})`); yield { type: 'backtrack', row, col, board: board.map(r => [...r]), log: [...log] };
                }
              }
              return false;
            }
          }
        }
        log.push('Puzzle solved!');
        yield { type: 'solved', board: board.map(r => [...r]), log: [...log] };
        return true;
      }
      yield* solve();
    };
  }, []);

  useEffect(() => {
    resetAnimation();
    setGenerator(() => createGenerator(puzzle)());
  }, [puzzleKey, puzzle, createGenerator, setGenerator, resetAnimation]);

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
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '10px', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '.5625rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '.25rem' }}>Puzzle</div>
          <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '.6875rem', color: 'var(--muted)' }}>9×9 Sudoku — {puzzle.flat().filter(v => v !== 0).length} clues</span>
        </div>
        <button
          onClick={handleNewPuzzle}
          style={{
            padding: '0.4rem 0.875rem', fontSize: '0.75rem', fontWeight: 500,
            fontFamily: 'Instrument Sans, sans-serif',
            background: 'var(--purple)', color: '#fff',
            border: 'none', borderRadius: '6px', cursor: 'pointer',
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          New puzzle
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '1.25rem', flex: 1, minHeight: 0 }}>
        <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '10px', padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
                <div key={i} style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'IBM Plex Mono, monospace', fontSize: '.875rem', fontWeight: 700, background: bg, color, borderRight: (col + 1) % 3 === 0 && col < 8 ? '2px solid var(--ink)' : '1px solid var(--border)', borderBottom: (row + 1) % 3 === 0 && row < 8 ? '2px solid var(--ink)' : '1px solid var(--border)' }}>
                  {val !== 0 ? val : ''}
                </div>
              );
            })}
          </div>
        </div>

        {currentData.log && (
          <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '10px', padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '.5625rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '.5rem', flexShrink: 0 }}>Call stack</div>
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

      <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '10px', padding: '.75rem 1.25rem', textAlign: 'center', fontFamily: 'IBM Plex Mono, monospace', fontSize: '.75rem', color: 'var(--ink2)', minHeight: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {currentData.type === 'try' && <span>Trying {currentData.num} at ({currentData.row}, {currentData.col})</span>}
        {currentData.type === 'place' && <span style={{ color: '#15803d' }}>Placed {currentData.num} at ({currentData.row}, {currentData.col})</span>}
        {currentData.type === 'backtrack' && <span style={{ color: '#e11d48' }}>Backtracking from ({currentData.row}, {currentData.col})</span>}
        {currentData.type === 'solved' && <span style={{ color: '#15803d', fontWeight: 600 }}>Puzzle solved!</span>}
        {currentData.type === 'idle' && <span style={{ color: 'var(--muted)' }}>Ready to solve</span>}
      </div>
    </div>
  );
}
