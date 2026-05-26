<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useGameStore } from '../stores/gameStore'
import SudokuCell from './SudokuCell.vue'

const store = useGameStore()

function handleKeyDown(e: KeyboardEvent) {
  if (store.status !== 'playing') return
  const key = e.key
  if (key >= '1' && key <= '9') {
    store.enterNumber(parseInt(key))
  } else if (key === 'Backspace' || key === 'Delete' || key === '0') {
    store.clearCell()
  } else if (key === 'ArrowUp') {
    e.preventDefault()
    store.moveSelection(-1, 0)
  } else if (key === 'ArrowDown') {
    e.preventDefault()
    store.moveSelection(1, 0)
  } else if (key === 'ArrowLeft') {
    e.preventDefault()
    store.moveSelection(0, -1)
  } else if (key === 'ArrowRight') {
    e.preventDefault()
    store.moveSelection(0, 1)
  }
}

onMounted(() => window.addEventListener('keydown', handleKeyDown))
onUnmounted(() => window.removeEventListener('keydown', handleKeyDown))

function row(br: number, cr: number) { return (br - 1) * 3 + (cr - 1) }
function col(bc: number, cc: number) { return (bc - 1) * 3 + (cc - 1) }

function isSelected(r: number, c: number) {
  return store.selectedCell?.row === r && store.selectedCell?.col === c
}
function isHighlighted(r: number, c: number) {
  return !isSelected(r, c) && store.highlightedCells.has(`${r}-${c}`)
}
function isSameValue(r: number, c: number) {
  const sv = store.selectedValue
  return sv !== null && store.board[r][c].value === sv && !isSelected(r, c)
}
</script>

<template>
  <div class="board" :class="{ 'notes-active': store.notesMode }" tabindex="0">
    <template v-for="br in 3" :key="br">
      <template v-for="bc in 3" :key="bc">
        <div class="box">
          <template v-for="cr in 3" :key="cr">
            <template v-for="cc in 3" :key="cc">
              <div class="cell-wrapper" @click="store.selectCell(row(br, cr), col(bc, cc))">
                <SudokuCell
                  :cell="store.board[row(br, cr)][col(bc, cc)]"
                  :is-selected="isSelected(row(br, cr), col(bc, cc))"
                  :is-highlighted="isHighlighted(row(br, cr), col(bc, cc))"
                  :is-same-value="isSameValue(row(br, cr), col(bc, cc))"
                />
              </div>
            </template>
          </template>
        </div>
      </template>
    </template>
  </div>
</template>

<style scoped>
/* Outer board: 3x3 grid of boxes, dark bg shows through as thick box borders */
.board {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 3px;
  padding: 3px;
  background: #1e1b4b;
  width: min(90vw, 480px);
  border-radius: 8px;
  overflow: hidden;
  outline: none;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.18);
  transition: box-shadow 0.2s;
}

@media (max-width: 767px) {
  .board { width: min(84vw, 480px); }
}

.board.notes-active {
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.18), 0 0 0 3px #818cf8;
}

/* Each 3x3 box: inner grid, light bg shows through as thin cell borders */
.box {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background: #c7c9d1;
}

.cell-wrapper {
  background: #fff;
  overflow: hidden;
}

/* Corner cells — inner radius = board-radius(8px) minus board-padding(3px) */
.box:first-child  .cell-wrapper:first-child { border-top-left-radius: 5px; }
.box:nth-child(3) .cell-wrapper:nth-child(3) { border-top-right-radius: 5px; }
.box:nth-child(7) .cell-wrapper:nth-child(7) { border-bottom-left-radius: 5px; }
.box:last-child   .cell-wrapper:last-child   { border-bottom-right-radius: 5px; }
</style>
