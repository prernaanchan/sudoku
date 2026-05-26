<script setup lang="ts">
import type { Cell } from '../types/sudoku'

defineProps<{
  cell: Cell
  isSelected: boolean
  isHighlighted: boolean
  isSameValue: boolean
}>()
</script>

<template>
  <div
    class="cell"
    :class="{
      'selected':       isSelected,
      'selected-error': isSelected && cell.error,
      'highlighted':    !isSelected && isHighlighted && !cell.error,
      'same-value':     !isSelected && !isHighlighted && isSameValue && !cell.error,
      'error-bg':       !isSelected && cell.error,
      'given':          cell.given,
      'user-value':     !cell.given && cell.value !== null && !cell.error,
      'error-text':     cell.error && !isSelected,
    }"
  >
    <span v-if="cell.value !== null">{{ cell.value }}</span>
    <div v-else-if="(cell.notes?.size ?? 0) > 0" class="notes-grid">
      <span v-for="n in 9" :key="n" class="note">{{ cell.notes?.has(n) ? n : '' }}</span>
    </div>
  </div>
</template>

<style scoped>
.cell {
  width: 100%;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: clamp(14px, 2.5vw, 22px);
  cursor: pointer;
  user-select: none;
  background: #fff;
  color: #374151;
  transition: background-color 0.12s, color 0.12s;
}

.highlighted    { background: #eef2ff; }
.same-value     { background: #fef3c7; }
.error-bg       { background: #fee2e2; }
.given          { font-weight: 700; color: #111827; }
.user-value     { color: #4f46e5; font-weight: 500; }
.error-text     { color: #dc2626; font-weight: 500; }
.selected       { background: #4f46e5; color: #fff; }
.selected-error { box-shadow: inset 0 0 0 3px #ef4444; }

.notes-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  width: 100%;
  height: 100%;
  padding: 1px;
  box-sizing: border-box;
}

.note {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: clamp(7px, 1.2vw, 11px);
  font-weight: 600;
  color: #6366f1;
  line-height: 1;
}

.selected .note { color: rgba(255, 255, 255, 0.85); }
</style>
