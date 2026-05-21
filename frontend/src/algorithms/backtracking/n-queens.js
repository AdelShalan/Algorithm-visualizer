export function* generateSteps(size) {
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
}
