export const algorithmCodeSnippets = {
  sudoku: `function solveSudoku(board) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (isValid(board, row, col, num)) {
            board[row][col] = num;
            if (solveSudoku(board)) return true;
            board[row][col] = 0; // backtrack
          }
        }
        return false; // no valid number found
      }
    }
  }
  return true; // all cells filled
}

function isValid(board, row, col, num) {
  // Check row and column
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num) return false;
    if (board[i][col] === num) return false;
  }
  // Check 3×3 box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let r = boxRow; r < boxRow + 3; r++) {
    for (let c = boxCol; c < boxCol + 3; c++) {
      if (board[r][c] === num) return false;
    }
  }
  return true;
}`,
  'sudoku-cp': `function solveSudoku(board) {
  const candidates = initCandidates(board);
  return search(candidates);
}

function search(candidates) {
  // Phase 1: constraint propagation
  propagate(candidates);
  if (isContradiction(candidates)) return null;
  if (isSolved(candidates)) return candidates;

  // Phase 2: MRV heuristic — pick cell with fewest candidates
  const cell = findMinCandidates(candidates);
  for (const val of candidates[cell]) {
    const copy = cloneCandidates(candidates);
    copy[cell] = new Set([val]);
    const result = search(copy);
    if (result) return result;
  }
  return null; // backtrack
}

function propagate(candidates) {
  let changed = true;
  while (changed) {
    changed = false;
    for (const cell of cells) {
      if (candidates[cell].size === 1) {
        const val = [...candidates[cell]][0];
        for (const peer of getPeers(cell)) {
          if (candidates[peer].has(val)) {
            candidates[peer].delete(val);
            changed = true;
          }
        }
      }
    }
  }
}`,
};
