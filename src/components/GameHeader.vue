<script setup lang="ts">
import { useGameStore } from '../stores/gameStore'

const store = useGameStore()
</script>

<template>
  <div class="header">
    <div class="flex items-center gap-2">
      <span class="difficulty-badge" :class="`difficulty-badge--${store.difficulty}`">
        {{ store.difficulty }}
      </span>
      <button class="menu-btn" @click="store.goToMenu()">
        Menu
      </button>
    </div>
    <div class="timer">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 shrink-0">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
      {{ store.timer.formatted }}
    </div>
  </div>
</template>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: min(90vw, 480px);
  margin-bottom: 1rem;
}

.difficulty-badge {
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 6px;
  padding: 0.2rem 0.6rem;
  text-transform: capitalize;
  letter-spacing: 0.02em;
  border: 1px solid;
}

.difficulty-badge--easy   { background: #f0fdf4; color: #16a34a; border-color: #86efac; }
.difficulty-badge--medium { background: #fffbeb; color: #d97706; border-color: #fcd34d; }
.difficulty-badge--hard   { background: #fef2f2; color: #dc2626; border-color: #fca5a5; }

.menu-btn {
  padding: 0.2rem 0.75rem;
  font-size: 0.8rem;
  font-weight: 600;
  border-radius: 6px;
  border: none;
  background: #4f46e5;
  color: #fff;
  cursor: pointer;
  transition: background 0.1s;
}
.menu-btn:hover  { background: #4338ca; }
.menu-btn:active { background: #3730a3; }

.timer {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: #eef2ff;
  border: 1px solid #e0e7ff;
  color: #4f46e5;
  font-family: ui-monospace, monospace;
  font-size: 0.95rem;
  font-weight: 700;
  padding: 0.35rem 0.75rem;
  border-radius: 8px;
}
</style>
