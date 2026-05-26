# Sudoku

A browser-based Sudoku game built with Vue 3, TypeScript, Pinia, and Tailwind CSS.

## What it does

- Generates a unique Sudoku puzzle on load, with three difficulty levels: Easy, Medium, and Hard
- Players select a cell and enter a number via an on-screen number pad
- Errors are highlighted in real time — any cell that conflicts with another in its row, column, or 3×3 box is flagged
- A running timer tracks how long the current puzzle has taken to solve
- A win overlay appears when the board is correctly completed, showing the solve time

## How puzzles are generated

The puzzle generator uses a **shuffle-based approach**:

1. Starts from a known valid seed grid (the canonical "shift-by-3" solution)
2. Applies randomizing transformations that preserve Sudoku validity:
   - Digit relabeling (permute which digit maps to which)
   - Row shuffles within each band (rows 0–2, 3–5, 6–8)
   - Column shuffles within each stack (cols 0–2, 3–5, 6–8)
   - Band and stack shuffles
   - Optional transpose
3. Removes cells according to difficulty: 36 (easy), 46 (medium), or 54 (hard)

This approach is simpler and more predictable than recursive backtracking — the complete solution is always known upfront.

## Project structure

```
src/
├── App.vue                  # Root component, win overlay
├── components/
│   ├── SudokuBoard.vue      # 9×9 grid
│   ├── SudokuCell.vue       # Individual cell with selection/error states
│   ├── NumberPad.vue        # 1–9 input buttons + Clear
│   └── GameHeader.vue       # Difficulty selector, New Game button, timer
├── stores/gameStore.ts      # All game state and logic (Pinia)
├── composables/useTimer.ts  # Reactive stopwatch
├── utils/
│   ├── generator.ts         # Puzzle generation (shuffle-based)
│   └── validator.ts         # Error detection and win condition
└── types/sudoku.ts          # Cell, Board, Difficulty, GameStatus types
```

## Running locally

```bash
npm install
npm run dev
```
