export function* generateSteps(puzzle) {
  const log = [];
  const board = puzzle.map(r => [...r]);
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
}
