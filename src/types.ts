export type CellState = 'empty' | 'cat' | 'cross';

export type Difficulty = 'warmup' | 'easy' | 'medium' | 'hard';

export interface Puzzle {
  id: string;
  name: string;
  size: number;
  difficulty: Difficulty;
  regions: number[][]; // [row][col] -> region index 0..size-1
  solution: { row: number; col: number }[];
  hintTip?: string;
}

export interface BoardCell {
  row: number;
  col: number;
  region: number;
  state: CellState;
  hasConflict: boolean;
  conflictReasons: string[];
}

export interface MoveAction {
  row: number;
  col: number;
  prevState: CellState;
  nextState: CellState;
}

export interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  bestTimes: Record<Difficulty, number | null>;
}
