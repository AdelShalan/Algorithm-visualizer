function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getPeers(row, col) {
  const peers = [];
  for (let i = 0; i < 9; i++) {
    if (i !== col) peers.push([row, i]);
    if (i !== row) peers.push([i, col]);
  }
  const br = Math.floor(row / 3) * 3;
  const bc = Math.floor(col / 3) * 3;
  for (let r = br; r < br + 3; r++) {
    for (let c = bc; c < bc + 3; c++) {
      if (r !== row || c !== col) peers.push([r, c]);
    }
  }
  return peers;
}

function cloneCandidates(cands) {
  return cands.map(row => row.map(set => new Set(set)));
}

function cloneBoard(b) {
  return b.map(r => [...r]);
}

export function* generateSteps(puzzle) {
  const log = [];

  const board = puzzle.map(r => [...r]);
  const candidates = Array.from({ length: 9 }, () =>
    Array.from({ length: 9 }, () => new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]))
  );
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (puzzle[r][c] !== 0) {
        candidates[r][c] = new Set([puzzle[r][c]]);
      }
    }
  }

  function* eliminate(cands, row, col, val, sourceRow, sourceCol) {
    if (cands[row][col].has(val)) {
      cands[row][col].delete(val);
      log.push(`Eliminate ${val} from (${row}, ${col})`);
      yield {
        type: 'eliminate', row, col, num: val,
        sourceRow, sourceCol,
        board: cloneBoard(board),
        candidates: cloneCandidates(cands),
        log: [...log],
      };
      if (cands[row][col].size === 0) {
        log.push(`Contradiction at (${row}, ${col})`);
        yield {
          type: 'contradiction', row, col,
          board: cloneBoard(board),
          candidates: cloneCandidates(cands),
          log: [...log],
        };
        return false;
      }
    }
    return true;
  }

  function* propagate(cands) {
    let changed = true;
    while (changed) {
      changed = false;
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          if (board[r][c] !== 0) continue;
          if (cands[r][c].size === 1) {
            const val = [...cands[r][c]][0];
            board[r][c] = val;
            log.push(`Naked single: (${r}, ${c}) = ${val}`);
            yield {
              type: 'naked-single', row: r, col: c, num: val,
              board: cloneBoard(board),
              candidates: cloneCandidates(cands),
              log: [...log],
            };
            for (const [pr, pc] of getPeers(r, c)) {
              if (board[pr][pc] !== 0) continue;
              const ok = yield* eliminate(cands, pr, pc, val, r, c);
              if (!ok) return false;
              changed = true;
            }
          }
        }
      }
    }
    return true;
  }

  function* eliminateFromPeers(cands, row, col) {
    const val = board[row][col];
    for (const [pr, pc] of getPeers(row, col)) {
      if (board[pr][pc] !== 0) continue;
      const ok = yield* eliminate(cands, pr, pc, val, row, col);
      if (!ok) return false;
    }
    return true;
  }

  function* search(cands) {
    const propOk = yield* propagate(cands);
    if (!propOk) return false;

    let solved = true;
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (board[r][c] === 0) { solved = false; break; }
      }
      if (!solved) break;
    }
    if (solved) {
      log.push('Puzzle solved!');
      yield {
        type: 'solved',
        board: cloneBoard(board),
        candidates: cloneCandidates(cands),
        log: [...log],
      };
      return true;
    }

    let minCell = null;
    let minCount = 10;
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (board[r][c] !== 0) continue;
        const size = cands[r][c].size;
        if (size > 1 && size < minCount) {
          minCount = size;
          minCell = [r, c];
        }
      }
    }

    if (!minCell) return false;
    const [mr, mc] = minCell;
    const values = shuffle([...cands[mr][mc]]);

    log.push(`MRV: (${mr}, ${mc}) has ${minCount} candidates [${values.join(', ')}]`);
    yield {
      type: 'guess', row: mr, col: mc, values,
      board: cloneBoard(board),
      candidates: cloneCandidates(cands),
      log: [...log],
    };

    for (const val of values) {
      const savedCands = cloneCandidates(cands);
      const savedBoard = cloneBoard(board);

      cands[mr][mc] = new Set([val]);
      board[mr][mc] = val;
      log.push(`Try ${val} at (${mr}, ${mc})`);
      yield {
        type: 'try', row: mr, col: mc, num: val,
        board: cloneBoard(board),
        candidates: cloneCandidates(cands),
        log: [...log],
      };

      // Eliminate val from peers before propagation
      const elimOk = yield* eliminateFromPeers(cands, mr, mc);
      if (!elimOk) {
        log.push(`Backtrack from (${mr}, ${mc})`);
        yield {
          type: 'backtrack', row: mr, col: mc, num: val,
          board: savedBoard,
          candidates: savedCands,
          log: [...log],
        };
        for (let r = 0; r < 9; r++) {
          for (let c = 0; c < 9; c++) {
            cands[r][c] = savedCands[r][c];
            board[r][c] = savedBoard[r][c];
          }
        }
        continue;
      }

      if (yield* search(cands)) return true;

      log.push(`Backtrack from (${mr}, ${mc})`);
      yield {
        type: 'backtrack', row: mr, col: mc, num: val,
        board: savedBoard,
        candidates: savedCands,
        log: [...log],
      };
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          cands[r][c] = savedCands[r][c];
          board[r][c] = savedBoard[r][c];
        }
      }
    }

    return false;
  }

  // Initial constraint propagation from puzzle givens
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (puzzle[r][c] !== 0) {
        const ok = yield* eliminateFromPeers(candidates, r, c);
        if (!ok) return;
      }
    }
  }

  yield* search(candidates);
}
