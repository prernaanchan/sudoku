import type { Board } from '../types/sudoku'

export function isValidPlacement(board: Board, row: number, col: number, value: number): boolean {
  for (let c = 0; c < 9; c++) {
    if (c !== col && board[row][c].value === value) return false
  }
  for (let r = 0; r < 9; r++) {
    if (r !== row && board[r][col].value === value) return false
  }
  const boxRow = Math.floor(row / 3) * 3
  const boxCol = Math.floor(col / 3) * 3
  for (let r = boxRow; r < boxRow + 3; r++) {
    for (let c = boxCol; c < boxCol + 3; c++) {
      if ((r !== row || c !== col) && board[r][c].value === value) return false
    }
  }
  return true
}

export function computeErrors(board: Board): Board {
  return board.map((row, r) =>
    row.map((cell, c) => ({
      ...cell,
      error: cell.value !== null && !isValidPlacement(board, r, c, cell.value),
    }))
  )
}

export function isBoardComplete(board: Board): boolean {
  return board.every(row =>
    row.every(cell => cell.value !== null && !cell.error)
  )
}
