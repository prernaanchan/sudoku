import type { Board, Difficulty } from '../types/sudoku'

function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

const SEED: number[][] = [
  [1, 2, 3, 4, 5, 6, 7, 8, 9],
  [4, 5, 6, 7, 8, 9, 1, 2, 3],
  [7, 8, 9, 1, 2, 3, 4, 5, 6],
  [2, 3, 4, 5, 6, 7, 8, 9, 1],
  [5, 6, 7, 8, 9, 1, 2, 3, 4],
  [8, 9, 1, 2, 3, 4, 5, 6, 7],
  [3, 4, 5, 6, 7, 8, 9, 1, 2],
  [6, 7, 8, 9, 1, 2, 3, 4, 5],
  [9, 1, 2, 3, 4, 5, 6, 7, 8],
]

const CELLS_TO_REMOVE: Record<Difficulty, number> = {
  easy: 36,
  medium: 46,
  hard: 54,
}

export function generatePuzzle(difficulty: Difficulty): Board {
  let g: number[][] = SEED.map(row => [...row])

  const digitMap = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9])
  g = g.map(row => row.map(v => digitMap[v - 1]))

  for (let band = 0; band < 3; band++) {
    const order = shuffle([0, 1, 2])
    const rows = [g[band * 3], g[band * 3 + 1], g[band * 3 + 2]]
    for (let i = 0; i < 3; i++) g[band * 3 + i] = rows[order[i]]
  }

  for (let stack = 0; stack < 3; stack++) {
    const order = shuffle([0, 1, 2])
    const cols = [
      g.map(r => r[stack * 3]),
      g.map(r => r[stack * 3 + 1]),
      g.map(r => r[stack * 3 + 2]),
    ]
    for (let r = 0; r < 9; r++) {
      g[r][stack * 3]     = cols[order[0]][r]
      g[r][stack * 3 + 1] = cols[order[1]][r]
      g[r][stack * 3 + 2] = cols[order[2]][r]
    }
  }

  const bandOrder = shuffle([0, 1, 2])
  const bands = [[g[0], g[1], g[2]], [g[3], g[4], g[5]], [g[6], g[7], g[8]]]
  for (let b = 0; b < 3; b++) {
    g[b * 3]     = bands[bandOrder[b]][0]
    g[b * 3 + 1] = bands[bandOrder[b]][1]
    g[b * 3 + 2] = bands[bandOrder[b]][2]
  }

  const stackOrder = shuffle([0, 1, 2])
  const stacks = [
    g.map(r => [r[0], r[1], r[2]]),
    g.map(r => [r[3], r[4], r[5]]),
    g.map(r => [r[6], r[7], r[8]]),
  ]
  for (let r = 0; r < 9; r++) {
    g[r] = [...stacks[stackOrder[0]][r], ...stacks[stackOrder[1]][r], ...stacks[stackOrder[2]][r]]
  }

  if (Math.random() < 0.5) {
    g = g.map((row, r) => row.map((_, c) => g[c][r]))
  }

  const positions = shuffle(
    Array.from({ length: 81 }, (_, i) => [Math.floor(i / 9), i % 9] as [number, number])
  )
  const removedSet = new Set<number>()
  for (let i = 0; i < CELLS_TO_REMOVE[difficulty]; i++) {
    const [r, c] = positions[i]
    removedSet.add(r * 9 + c)
  }

  return g.map((row, r) =>
    row.map((val, c) => {
      const removed = removedSet.has(r * 9 + c)
      return { value: removed ? null : val, given: !removed, error: false, notes: new Set<number>() }
    })
  )
}
