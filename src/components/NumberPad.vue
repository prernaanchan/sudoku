<script setup lang="ts">
import { computed, ref } from 'vue'
import { useGameStore } from '../stores/gameStore'

const store = useGameStore()

const isDisabled = computed(() => !store.selectedCell || store.status !== 'playing')
const canUndo = computed(() => store.history.length > 0 && store.status === 'playing')
const canReset = computed(() => store.status === 'playing' || store.status === 'won')

const showResetConfirm = ref(false)

function confirmReset() {
  showResetConfirm.value = false
  store.reset()
}

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
    <!-- Number buttons -->
    <div class="num-grid">
      <button
        v-for="n in 9"
        :key="n"
        :disabled="isDisabled || completedDigits.has(n)"
        class="num-btn"
        :class="completedDigits.has(n) ? 'num-btn--done' : ''"
        @click="store.enterNumber(n)"
      >{{ n }}</button>
    </div>

    <!-- Controls -->
    <div class="controls">
      <button
        class="notes-btn"
        :class="store.notesMode ? 'notes-btn--active' : ''"
        :disabled="store.status !== 'playing'"
        @click="store.notesMode = !store.notesMode"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ctrl-icon">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
        <span class="ctrl-label">{{ store.notesMode ? 'Notes: ON' : 'Notes' }}</span>
      </button>

      <button :disabled="isDisabled" class="clear-btn" @click="store.clearCell()">
        <span class="ctrl-label">Clear</span>
      </button>

      <button :disabled="!canUndo" class="action-btn" @click="store.undo()">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="ctrl-icon">
          <path d="M3 7v6h6"/>
          <path d="M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13"/>
        </svg>
        <span class="ctrl-label">Undo</span>
      </button>

      <button :disabled="!canReset" class="action-btn" @click="showResetConfirm = true">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="ctrl-icon">
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
          <path d="M3 3v5h5"/>
        </svg>
        <span class="ctrl-label">Reset</span>
      </button>
    </div>

    <!-- Reset confirmation -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showResetConfirm" class="confirm-backdrop" @click.self="showResetConfirm = false">
          <div class="confirm-dialog">
            <p class="confirm-title">Reset puzzle?</p>
            <p class="confirm-body">All your progress will be cleared.</p>
            <div class="confirm-actions">
              <button class="confirm-cancel" @click="showResetConfirm = false">Cancel</button>
              <button class="confirm-ok" @click="confirmReset">Reset</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
/* ── Shared layout ───────────────────────────────── */
.numpad {
  width: min(90vw, 480px);
  margin-top: 1rem;
}

/* Number grid — 3 cols on desktop */
.num-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 8px;
}

/* Controls — stacked on desktop */
.controls {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ctrl-icon { width: 1rem; height: 1rem; flex-shrink: 0; }

/* ── Desktop sidebar (13rem) ─────────────────────── */
@media (min-width: 768px) {
  .numpad { width: 13rem; margin-top: 0; }
}

/* ── Mobile: 2-row compact layout ───────────────── */
@media (max-width: 767px) {
  .numpad {
    width: min(90vw, 480px);
    margin-top: 1rem;
  }

  /* Numbers stay 3×3 grid */
  .num-grid {
    gap: 6px;
    margin-bottom: 8px;
  }

  /* Controls: [Notes][Clear][Undo][Reset] side by side */
  .controls {
    flex-direction: row;
    gap: 6px;
  }
  .controls > * { flex: 1; }

  .ctrl-label { font-size: 0.7rem; }
  .ctrl-icon  { width: 0.85rem; height: 0.85rem; }
}

/* ── Number buttons ──────────────────────────────── */
.num-btn {
  padding: 1.1rem 0;
  font-size: 1.6rem;
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

@media (max-width: 767px) {
  .num-btn { padding: 0.8rem 0; font-size: 1.25rem; border-radius: 6px; }
}

/* ── Control buttons (shared base) ──────────────── */
.notes-btn,
.clear-btn,
.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  padding: 0.6rem 0;
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.1s, color 0.1s, border-color 0.1s;
}

@media (max-width: 767px) {
  .notes-btn,
  .clear-btn,
  .action-btn { padding: 0.55rem 0; border-radius: 6px; }
}

/* Notes */
.notes-btn {
  width: 100%;
  border: 1.5px solid #e5e7eb;
  background: #fff;
  color: #6b7280;
}
.notes-btn:hover:not(:disabled)       { background: #f5f3ff; color: #4f46e5; border-color: #c7d2fe; }
.notes-btn--active                    { background: #4f46e5; color: #fff; border-color: #818cf8; }
.notes-btn--active:hover:not(:disabled) { background: #4338ca; color: #fff; }
.notes-btn:disabled { opacity: 0.35; cursor: not-allowed; }

/* Clear */
.clear-btn {
  width: 100%;
  border: 1.5px solid #e5e7eb;
  background: #fff;
  color: #6b7280;
}
.clear-btn:hover:not(:disabled)  { background: #fef2f2; color: #dc2626; border-color: #fca5a5; }
.clear-btn:active:not(:disabled) { background: #fee2e2; }
.clear-btn:disabled { opacity: 0.35; cursor: not-allowed; }

/* Undo / Reset */
.action-btn {
  flex: 1;
  border: 1.5px solid #818cf8;
  background: #4f46e5;
  color: #fff;
}
.action-btn:hover:not(:disabled)  { background: #4338ca; }
.action-btn:active:not(:disabled) { background: #3730a3; }
.action-btn:disabled { opacity: 0.35; cursor: not-allowed; }

/* Reset confirmation */
.confirm-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.confirm-dialog {
  background: #fff;
  border-radius: 16px;
  padding: 1.5rem;
  width: min(88vw, 320px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
  text-align: center;
}

.confirm-title {
  font-size: 1rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 0.35rem;
}

.confirm-body {
  font-size: 0.85rem;
  color: #6b7280;
  margin: 0 0 1.25rem;
}

.confirm-actions {
  display: flex;
  gap: 0.5rem;
}

.confirm-cancel {
  flex: 1;
  padding: 0.6rem 0;
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: 8px;
  border: 1.5px solid #e5e7eb;
  background: #fff;
  color: #6b7280;
  cursor: pointer;
  transition: background 0.1s;
}
.confirm-cancel:hover { background: #f9fafb; }

.confirm-ok {
  flex: 1;
  padding: 0.6rem 0;
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: 8px;
  border: none;
  background: #ef4444;
  color: #fff;
  cursor: pointer;
  transition: background 0.1s;
}
.confirm-ok:hover  { background: #dc2626; }
.confirm-ok:active { background: #b91c1c; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.15s; }
.fade-enter-from,  .fade-leave-to      { opacity: 0; }
</style>
