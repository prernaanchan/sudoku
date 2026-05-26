export type Difficulty = 'easy' | 'medium' | 'hard'
export type GameStatus = 'idle' | 'playing' | 'won'

export interface Cell {
  value: number | null
  given: boolean
  error: boolean
  notes: Set<number>
}

export type Board = Cell[][]
