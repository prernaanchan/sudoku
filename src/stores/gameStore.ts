import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Board, Difficulty, GameStatus } from '../types/sudoku'
import { generatePuzzle } from '../utils/generator'
import { computeErrors, isBoardComplete } from '../utils/validator'
import { useTimer } from '../composables/useTimer'

type HistoryEntry = { row: number; col: number; prevValue: number | null; prevNotes: Set<number> }

export const useGameStore = defineStore('game', () => {
  const board = ref<Board>([])
  const selectedCell = ref<{ row: number; col: number } | null>(null)
  const difficulty = ref<Difficulty>('easy')
  const status = ref<GameStatus>('idle')
  const timer = useTimer()
  const history = ref<HistoryEntry[]>([])
  const initialBoard = ref<Board>([])
  const notesMode = ref(false)

  function newGame(diff: Difficulty = difficulty.value) {
    difficulty.value = diff
    board.value = generatePuzzle(diff)
    initialBoard.value = board.value.map(row => row.map(cell => ({ ...cell, notes: new Set(cell.notes) })))
    history.value = []
    selectedCell.value = null
    notesMode.value = false
    status.value = 'playing'
    timer.reset()
    timer.start()
  }

  function selectCell(row: number, col: number) {
    if (status.value !== 'playing') return
    if (board.value[row][col].given) {
      selectedCell.value = { row, col }
      return
    }
    selectedCell.value = { row, col }
  }

  function toggleNote(value: number) {
    if (!selectedCell.value || status.value !== 'playing') return
    const { row, col } = selectedCell.value
    const cell = board.value[row][col]
    if (cell.given || cell.value !== null) return
    history.value.push({ row, col, prevValue: cell.value, prevNotes: new Set(cell.notes) })
    if (cell.notes.has(value)) cell.notes.delete(value)
    else cell.notes.add(value)
  }

  function enterNumber(value: number) {
    if (!selectedCell.value || status.value !== 'playing') return
    const { row, col } = selectedCell.value
    if (board.value[row][col].given) return

    if (notesMode.value) {
      toggleNote(value)
      return
    }

    history.value.push({ row, col, prevValue: board.value[row][col].value, prevNotes: new Set(board.value[row][col].notes) })
    board.value[row][col].value = value
    board.value[row][col].notes.clear()

    const br = Math.floor(row / 3) * 3
    const bc = Math.floor(col / 3) * 3
    for (let i = 0; i < 9; i++) {
      board.value[row][i].notes.delete(value)
      board.value[i][col].notes.delete(value)
    }
    for (let r = br; r < br + 3; r++) {
      for (let c = bc; c < bc + 3; c++) {
        board.value[r][c].notes.delete(value)
      }
    }

    board.value = computeErrors(board.value)
    if (isBoardComplete(board.value)) {
      status.value = 'won'
      timer.stop()
    }
  }

  function clearCell() {
    if (!selectedCell.value || status.value !== 'playing') return
    const { row, col } = selectedCell.value
    const cell = board.value[row][col]
    if (cell.given) return
    history.value.push({ row, col, prevValue: cell.value, prevNotes: new Set(cell.notes) })
    cell.value = null
    cell.notes.clear()
    board.value = computeErrors(board.value)
  }

  function undo() {
    if (history.value.length === 0 || status.value !== 'playing') return
    const { row, col, prevValue, prevNotes } = history.value.pop()!
    board.value[row][col].value = prevValue
    board.value[row][col].notes = prevNotes
    board.value = computeErrors(board.value)
  }

  function reset() {
    if (!initialBoard.value.length) return
    board.value = initialBoard.value.map(row => row.map(cell => ({ ...cell, notes: new Set(cell.notes) })))
    history.value = []
    selectedCell.value = null
    notesMode.value = false
    status.value = 'playing'
    timer.reset()
    timer.start()
  }

  function goToMenu() {
    timer.stop()
    status.value = 'idle'
    selectedCell.value = null
    notesMode.value = false
  }

  function moveSelection(dr: number, dc: number) {
    if (!selectedCell.value || status.value !== 'playing') return
    const r = Math.max(0, Math.min(8, selectedCell.value.row + dr))
    const c = Math.max(0, Math.min(8, selectedCell.value.col + dc))
    selectedCell.value = { row: r, col: c }
  }

  const highlightedCells = computed(() => {
    if (!selectedCell.value) return new Set<string>()
    const { row, col } = selectedCell.value
    const keys = new Set<string>()
    for (let i = 0; i < 9; i++) {
      keys.add(`${row}-${i}`)
      keys.add(`${i}-${col}`)
    }
    const br = Math.floor(row / 3) * 3
    const bc = Math.floor(col / 3) * 3
    for (let r = br; r < br + 3; r++) {
      for (let c = bc; c < bc + 3; c++) {
        keys.add(`${r}-${c}`)
      }
    }
    return keys
  })

  const selectedValue = computed(() => {
    if (!selectedCell.value) return null
    return board.value[selectedCell.value.row]?.[selectedCell.value.col]?.value ?? null
  })

  return {
    board,
    selectedCell,
    difficulty,
    status,
    timer,
    history,
    notesMode,
    newGame,
    goToMenu,
    selectCell,
    enterNumber,
    clearCell,
    undo,
    reset,
    moveSelection,
    highlightedCells,
    selectedValue,
  }
})
