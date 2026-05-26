<script setup lang="ts">
import { useGameStore } from './stores/gameStore'
import StartScreen from './components/StartScreen.vue'
import GameHeader from './components/GameHeader.vue'
import SudokuBoard from './components/SudokuBoard.vue'
import NumberPad from './components/NumberPad.vue'

const store = useGameStore()
</script>

<template>
  <div class="min-h-screen">
    <transition name="page" mode="out-in">
      <StartScreen v-if="store.status === 'idle'" key="start" />

      <div v-else key="game" class="game-page">
        <h1 class="game-title">Sudoku</h1>

        <div class="flex flex-col items-center md:items-start">
          <GameHeader />
          <div class="flex flex-col md:flex-row md:items-center md:gap-6">
            <SudokuBoard />
            <NumberPad />
          </div>
        </div>

        <transition name="fade">
          <div
            v-if="store.status === 'won'"
            class="fixed inset-0 bg-black/60 flex items-center justify-center z-10"
          >
            <div class="win-modal">
              <div class="text-5xl mb-3">🎉</div>
              <h2 class="text-2xl font-bold text-gray-900 mb-1">You solved it!</h2>
              <p class="text-gray-400 mb-5">Time: {{ store.timer.formatted }}</p>
              <button
                class="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 active:bg-indigo-800 transition-colors"
                @click="store.goToMenu()"
              >
                Play Again
              </button>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </div>
</template>

<style>
.game-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  background: #f3f4f6;
}

.game-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #1e1b4b;
  margin: 0 0 1.5rem;
  letter-spacing: -0.02em;
}

.win-modal {
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 32px 80px rgba(0, 0, 0, 0.5);
  padding: 2.5rem 3rem;
  text-align: center;
}

.page-enter-active,
.page-leave-active {
  transition: opacity 0.25s ease;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
