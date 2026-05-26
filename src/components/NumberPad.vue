<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '../stores/gameStore'

const store = useGameStore()

const isDisabled = computed(() => !store.selectedCell || store.status !== 'playing')
const canUndo = computed(() => store.history.length > 0 && store.status === 'playing')
const canReset = computed(() => store.status === 'playing' || store.status === 'won')

const completedDigits = computed(() => {
  const counts = new Array(10).fill(0)
  for (const row of store.board) {
    for (const cell of row) {
      if (cell.value !== null && !cell.error) counts[cell.value]++
    }
  }
  return new Set([1,2,3,4,5,6,7,8,9].filter(n => counts[n] === 9))
})
</script>

<template>
  <div class="numpad">
    <div class="grid grid-cols-3 gap-2 mb-2">
      <button
        v-for="n in 9"
        :key="n"
        :disabled="isDisabled || completedDigits.has(n)"
        class="num-btn"
        :class="completedDigits.has(n) ? 'num-btn--done' : ''"
        @click="store.enterNumber(n)"
      >
        {{ n }}
      </button>
    </div>
    <button
      class="notes-btn"
      :class="store.notesMode ? 'notes-btn--active' : ''"
      :disabled="store.status !== 'playing'"
      @click="store.notesMode = !store.notesMode"
    >
      <span class="flex items-center justify-center gap-1">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
        {{ store.notesMode ? 'Notes: ON' : 'Notes: OFF' }}
      </span>
    </button>
    <button
      :disabled="isDisabled"
      class="clear-btn"
      @click="store.clearCell()"
    >
      Clear
    </button>
    <div class="flex gap-2 mt-3 pt-3 border-t border-gray-100">
      <button :disabled="!canUndo" class="action-btn" @click="store.undo()">
        <span class="flex items-center justify-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4">
            <path d="M3 7v6h6"/>
            <path d="M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13"/>
          </svg>
          Undo
        </span>
      </button>
      <button :disabled="!canReset" class="action-btn" @click="store.reset()">
        <span class="flex items-center justify-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
            <path d="M3 3v5h5"/>
          </svg>
          Reset
        </span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.numpad {
  width: min(90vw, 480px);
  margin-top: 1rem;
}

@media (min-width: 768px) {
  .numpad {
    width: 13rem;
    margin-top: 0;
  }
}

.num-btn {
  padding: 0.75rem 0;
  font-size: 1.125rem;
  font-weight: 600;
  border-radius: 8px;
  border: 1.5px solid #e5e7eb;
  background: #fff;
  color: #1e1b4b;
  cursor: pointer;
  transition: background 0.1s, opacity 0.1s;
}
.num-btn:hover:not(:disabled)  { background: #eef2ff; }
.num-btn:active:not(:disabled) { background: #e0e7ff; }
.num-btn:disabled { opacity: 0.35; cursor: not-allowed; }
.num-btn--done { background: #f0fdf4; border-color: #86efac; color: #16a34a; opacity: 0.55; }

.notes-btn {
  width: 100%;
  padding: 0.6rem 0;
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: 8px;
  border: 1.5px solid #e5e7eb;
  background: #fff;
  color: #6b7280;
  cursor: pointer;
  transition: background 0.1s, color 0.1s, border-color 0.1s;
  margin-bottom: 0.5rem;
}
.notes-btn:hover:not(:disabled) { background: #f5f3ff; color: #4f46e5; border-color: #c7d2fe; }
.notes-btn--active { background: #4f46e5; color: #fff; border-color: #818cf8; }
.notes-btn--active:hover:not(:disabled) { background: #4338ca; color: #fff; }
.notes-btn:disabled { opacity: 0.35; cursor: not-allowed; }

.clear-btn {
  width: 100%;
  padding: 0.6rem 0;
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: 8px;
  border: 1.5px solid #e5e7eb;
  background: #fff;
  color: #6b7280;
  cursor: pointer;
  transition: background 0.1s, color 0.1s, border-color 0.1s;
}
.clear-btn:hover:not(:disabled) { background: #fef2f2; color: #dc2626; border-color: #fca5a5; }
.clear-btn:active:not(:disabled) { background: #fee2e2; }
.clear-btn:disabled { opacity: 0.35; cursor: not-allowed; }

.action-btn {
  flex: 1;
  padding: 0.6rem 0;
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: 8px;
  border: 1.5px solid #818cf8;
  background: #4f46e5;
  color: #fff;
  cursor: pointer;
  transition: background 0.1s;
}
.action-btn:hover:not(:disabled)  { background: #4338ca; }
.action-btn:active:not(:disabled) { background: #3730a3; }
.action-btn:disabled { opacity: 0.35; cursor: not-allowed; }
</style>
