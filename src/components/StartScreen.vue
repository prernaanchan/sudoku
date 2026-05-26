<script setup lang="ts">
import { useGameStore } from '../stores/gameStore'
import type { Difficulty } from '../types/sudoku'

const store = useGameStore()

const difficulties: {
  value: Difficulty
  label: string
  description: string
  level: number
  color: string
  tint: string
  border: string
  shadow: string
}[] = [
  { value: 'easy',   label: 'Easy',   description: 'Beginner friendly',       level: 1, color: '#16a34a', tint: '#f0fdf4', border: '#86efac', shadow: 'rgba(22,163,74,0.2)'   },
  { value: 'medium', label: 'Medium', description: 'A balanced challenge',    level: 2, color: '#d97706', tint: '#fffbeb', border: '#fcd34d', shadow: 'rgba(217,119,6,0.2)'   },
  { value: 'hard',   label: 'Hard',   description: 'For experienced players', level: 3, color: '#dc2626', tint: '#fef2f2', border: '#fca5a5', shadow: 'rgba(220,38,38,0.2)'   },
]

const rules = [
  {
    icon: 'M3 3h18v18H3zM3 9h18M3 15h18M9 3v18M15 3v18',
    text: 'Fill every row, column, and 3×3 box with the digits 1–9, each exactly once.',
  },
  {
    icon: 'M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13.8 12H3',
    text: 'Select a cell, then tap a number to place it. Gray cells are fixed clues.',
  },
  {
    icon: 'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z',
    text: 'Use Notes mode to pencil in candidates. They auto-clear when a number is placed nearby.',
  },
  {
    icon: 'M3 7v6h6 M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13',
    text: 'Undo any mistake, or Reset to restart the same puzzle from scratch.',
  },
]
</script>

<template>
  <div class="start-screen">
    <!-- Floating card -->
    <div class="start-card">
      <!-- Brand -->
      <div class="brand">
        <svg class="brand-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <rect x="1"  y="1"  width="6" height="6" rx="1.2"/>
          <rect x="9"  y="1"  width="6" height="6" rx="1.2"/>
          <rect x="17" y="1"  width="6" height="6" rx="1.2"/>
          <rect x="1"  y="9"  width="6" height="6" rx="1.2"/>
          <rect x="9"  y="9"  width="6" height="6" rx="1.2"/>
          <rect x="17" y="9"  width="6" height="6" rx="1.2"/>
          <rect x="1"  y="17" width="6" height="6" rx="1.2"/>
          <rect x="9"  y="17" width="6" height="6" rx="1.2"/>
          <rect x="17" y="17" width="6" height="6" rx="1.2"/>
        </svg>
        <h1 class="title">Sudoku</h1>
      </div>
      <p class="tagline">The classic logic puzzle</p>

      <!-- Difficulty -->
      <p class="section-label">Select difficulty</p>
      <div class="diff-list">
        <button
          v-for="d in difficulties"
          :key="d.value"
          class="diff-card"
          :class="store.difficulty === d.value ? 'diff-card--active' : ''"
          :style="{
            '--diff-color':  d.color,
            '--diff-tint':   d.tint,
            '--diff-border': d.border,
            '--diff-shadow': d.shadow,
          }"
          @click="store.difficulty = d.value"
        >
          <div class="diff-accent" />
          <div class="diff-info">
            <span class="diff-name">{{ d.label }}</span>
            <span class="diff-desc">{{ d.description }}</span>
          </div>
          <div class="diff-dots" aria-hidden="true">
            <span
              v-for="i in 3"
              :key="i"
              class="dot"
              :style="i <= d.level ? { background: d.color } : {}"
            />
          </div>
        </button>
      </div>

      <!-- CTA -->
      <button class="start-btn" @click="store.newGame()">
        Start Game
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="btn-arrow" aria-hidden="true">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </button>
    </div>

    <!-- How to play (on dark bg below card) -->
    <div class="how-to-play">
      <p class="htp-label">How to play</p>
      <ul class="rules-list">
        <li v-for="(rule, i) in rules" :key="i" class="rule-item">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.75"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="rule-icon"
            aria-hidden="true"
          >
            <path :d="rule.icon" />
          </svg>
          <span class="rule-text">{{ rule.text }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.start-screen {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  gap: 2.25rem;
  background: linear-gradient(150deg, #0f0e17 0%, #1d1a6e 55%, #1e1b4b 100%);
}

/* Card */
.start-card {
  background: #fff;
  border-radius: 24px;
  padding: 2.75rem 2.5rem;
  width: min(92vw, 440px);
  box-shadow: 0 32px 80px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.06);
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

/* Brand */
.brand {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 0.3rem;
}

.brand-icon {
  width: 2rem;
  height: 2rem;
  color: #4f46e5;
  flex-shrink: 0;
}

.title {
  font-size: 2.25rem;
  font-weight: 900;
  color: #111827;
  margin: 0;
  letter-spacing: -0.03em;
  line-height: 1;
}

.tagline {
  font-size: 0.875rem;
  color: #9ca3af;
  margin: 0 0 2rem;
}

/* Section label */
.section-label {
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #9ca3af;
  margin: 0 0 0.6rem;
}

/* Difficulty list */
.diff-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.75rem;
}

.diff-card {
  display: flex;
  align-items: center;
  gap: 0;
  border: 1.5px solid #e5e7eb;
  border-radius: 12px;
  background: #fff;
  cursor: pointer;
  overflow: hidden;
  padding: 0;
  text-align: left;
  transition: border-color 0.15s, background 0.15s, box-shadow 0.15s;
}
.diff-card:hover {
  border-color: #d1d5db;
  background: #f9fafb;
}
.diff-card--active {
  border-color: var(--diff-border);
  background: var(--diff-tint);
  box-shadow: 0 0 0 3px var(--diff-shadow);
}

.diff-accent {
  width: 4px;
  align-self: stretch;
  background: var(--diff-color);
  opacity: 0.3;
  flex-shrink: 0;
  transition: opacity 0.15s;
}
.diff-card--active .diff-accent { opacity: 1; }

.diff-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  padding: 0.85rem 0.9rem;
}

.diff-name {
  font-size: 0.9rem;
  font-weight: 700;
  color: #111827;
  transition: color 0.15s;
}
.diff-card--active .diff-name { color: var(--diff-color); }

.diff-desc {
  font-size: 0.72rem;
  color: #9ca3af;
}

.diff-dots {
  display: flex;
  gap: 0.3rem;
  align-items: center;
  padding-right: 1rem;
  flex-shrink: 0;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #e5e7eb;
  transition: background 0.15s;
}

/* CTA */
.start-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.9rem 0;
  font-size: 1rem;
  font-weight: 700;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #4f46e5 0%, #6d28d9 100%);
  color: #fff;
  cursor: pointer;
  letter-spacing: 0.01em;
  box-shadow: 0 4px 18px rgba(79, 70, 229, 0.4);
  transition: opacity 0.1s, box-shadow 0.1s;
}
.start-btn:hover {
  opacity: 0.92;
  box-shadow: 0 6px 24px rgba(79, 70, 229, 0.5);
}
.start-btn:active {
  opacity: 0.85;
  box-shadow: 0 2px 10px rgba(79, 70, 229, 0.35);
}

.btn-arrow {
  width: 1rem;
  height: 1rem;
}

/* How to play */
.how-to-play {
  width: min(92vw, 440px);
  padding: 0 0.25rem;
}

.htp-label {
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: rgba(255, 255, 255, 0.3);
  margin: 0 0 0.85rem;
}

.rules-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.rule-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.rule-icon {
  width: 1rem;
  height: 1rem;
  color: rgba(255, 255, 255, 0.35);
  flex-shrink: 0;
  margin-top: 0.1rem;
}

.rule-text {
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.55;
}
</style>
