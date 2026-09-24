import { BoardCell, CellState, Difficulty, Puzzle } from './types';

export interface RegionTheme {
  name: string;
  bg: string;
  border: string;
  lightBg: string;
  textColor: string;
}

export const REGION_THEMES: RegionTheme[] = [
  {
    name: 'Lavender Dusk',
    bg: '#EBDDF7',
    border: '#C39DE8',
    lightBg: '#F5ECFC',
    textColor: '#5B3785',
  },
  {
    name: 'Butter Honey',
    bg: '#FEF3C7',
    border: '#FCD34D',
    lightBg: '#FFFBEB',
    textColor: '#854D0E',
  },
  {
    name: 'Sage Mint',
    bg: '#D1FAE5',
    border: '#86EFAC',
    lightBg: '#ECFDF5',
    textColor: '#166534',
  },
  {
    name: 'Peach Whisper',
    bg: '#FFE4E6',
    border: '#FDA4AF',
    lightBg: '#FFF1F2',
    textColor: '#9F1239',
  },
  {
    name: 'Sky Cloud',
    bg: '#E0F2FE',
    border: '#93C5FD',
    lightBg: '#F0F9FF',
    textColor: '#075985',
  },
  {
    name: 'Apricot Cream',
    bg: '#FFEDD5',
    border: '#FDBA74',
    lightBg: '#FFF7ED',
    textColor: '#9A3412',
  },
  {
    name: 'Rose Lilac',
    bg: '#FCE7F3',
    border: '#F472B6',
    lightBg: '#FDF2F8',
    textColor: '#831843',
  },
  {
    name: 'Oat Biscuit',
    bg: '#F3E8FF',
    border: '#D8B4FE',
    lightBg: '#FAF5FF',
    textColor: '#6B21A8',
  },
  {
    name: 'Pistachio Tea',
    bg: '#ECFCCB',
    border: '#BEF264',
    lightBg: '#F7FEE7',
    textColor: '#3F6212',
  },
];

// Helper to count how many cells belong to each region
export function getRegionCellCounts(regions: number[][], size: number): number[] {
  const counts = new Array(size).fill(0);
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const reg = regions[r][c];
      if (reg >= 0 && reg < size) {
        counts[reg]++;
      }
    }
  }
  return counts;
}

// Curated Puzzles with guaranteed solvable logic
export const CURATED_PUZZLES: Puzzle[] = [
  // --- 5x5 Warmup (Gentle Starter with 1-cell Color Region) ---
  {
    id: 'warmup-1',
    name: 'First Paws (Warmup) 🐾',
    size: 5,
    difficulty: 'warmup',
    hintTip: 'Look for the single-box color region! Since each territory needs 1 cat, a cat MUST go there.',
    solution: [
      { row: 0, col: 1 },
      { row: 1, col: 3 },
      { row: 2, col: 0 },
      { row: 3, col: 2 },
      { row: 4, col: 4 },
    ],
    // Region 0 is ONLY cell [0, 1]! Exactly 1 single box!
    regions: [
      [1, 0, 1, 2, 2],
      [3, 3, 1, 2, 2],
      [3, 3, 1, 2, 2],
      [3, 3, 1, 4, 4],
      [3, 3, 4, 4, 4],
    ],
  },
  {
    id: 'warmup-2',
    name: 'Sunny Rug 🧶',
    size: 5,
    difficulty: 'warmup',
    hintTip: 'Region 2 in the corner is a single-box! Start with an easy cat there.',
    solution: [
      { row: 0, col: 2 },
      { row: 1, col: 4 },
      { row: 2, col: 0 },
      { row: 3, col: 3 },
      { row: 4, col: 1 },
    ],
    // Region 2 is ONLY cell [2, 0]!
    regions: [
      [0, 0, 0, 1, 1],
      [3, 0, 0, 1, 1],
      [2, 3, 3, 1, 1],
      [3, 3, 3, 3, 4],
      [3, 4, 4, 4, 4],
    ],
  },

  // --- 6x6 Easy ---
  {
    id: 'easy-1',
    name: 'Cozy Kitchen 🐱',
    size: 6,
    difficulty: 'easy',
    hintTip: 'Notice the single-box territory at Row 4, Col 1! That is a guaranteed cat.',
    solution: [
      { row: 0, col: 1 },
      { row: 1, col: 3 },
      { row: 2, col: 5 },
      { row: 3, col: 0 },
      { row: 4, col: 2 },
      { row: 5, col: 4 },
    ],
    // Region 3 has ONLY cell [3, 0] (Row 4, Col 1)! Exactly 1 box!
    regions: [
      [0, 0, 0, 1, 1, 2],
      [0, 0, 1, 1, 1, 2],
      [0, 0, 4, 1, 2, 2],
      [3, 4, 4, 4, 5, 2],
      [4, 4, 4, 5, 5, 5],
      [4, 4, 4, 5, 5, 5],
    ],
  },
  {
    id: 'easy-2',
    name: 'Sunbeam Nap ☀️',
    size: 6,
    difficulty: 'easy',
    solution: [
      { row: 0, col: 4 },
      { row: 1, col: 1 },
      { row: 2, col: 5 },
      { row: 3, col: 2 },
      { row: 4, col: 0 },
      { row: 5, col: 3 },
    ],
    regions: [
      [0, 0, 1, 1, 1, 2],
      [0, 0, 1, 1, 2, 2],
      [3, 3, 3, 1, 2, 2],
      [4, 4, 3, 3, 5, 2],
      [4, 4, 4, 5, 5, 5],
      [4, 4, 5, 5, 5, 5],
    ],
  },
  {
    id: 'easy-3',
    name: 'Yarn Ball Fun 🧶',
    size: 6,
    difficulty: 'easy',
    solution: [
      { row: 0, col: 2 },
      { row: 1, col: 4 },
      { row: 2, col: 1 },
      { row: 3, col: 5 },
      { row: 4, col: 3 },
      { row: 5, col: 0 },
    ],
    regions: [
      [0, 0, 0, 1, 1, 1],
      [0, 0, 2, 1, 1, 3],
      [2, 2, 2, 2, 3, 3],
      [5, 2, 4, 4, 3, 3],
      [5, 5, 4, 4, 4, 3],
      [5, 5, 5, 4, 4, 3],
    ],
  },

  // --- 7x7 Medium ---
  {
    id: 'medium-1',
    name: 'Garden Paws 🌿',
    size: 7,
    difficulty: 'medium',
    solution: [
      { row: 0, col: 1 },
      { row: 1, col: 3 },
      { row: 2, col: 5 },
      { row: 3, col: 0 },
      { row: 4, col: 2 },
      { row: 5, col: 4 },
      { row: 6, col: 6 },
    ],
    regions: [
      [0, 0, 0, 1, 1, 2, 2],
      [0, 0, 1, 1, 1, 2, 2],
      [3, 0, 4, 1, 2, 2, 6],
      [3, 3, 4, 4, 5, 6, 6],
      [3, 4, 4, 4, 5, 5, 6],
      [3, 3, 4, 5, 5, 5, 6],
      [3, 3, 5, 5, 5, 6, 6],
    ],
  },
  {
    id: 'medium-2',
    name: 'Window Perch 🪟',
    size: 7,
    difficulty: 'medium',
    solution: [
      { row: 0, col: 2 },
      { row: 1, col: 4 },
      { row: 2, col: 6 },
      { row: 3, col: 1 },
      { row: 4, col: 3 },
      { row: 5, col: 5 },
      { row: 6, col: 0 },
    ],
    regions: [
      [0, 0, 0, 1, 1, 2, 2],
      [0, 3, 1, 1, 1, 2, 2],
      [3, 3, 3, 4, 1, 2, 2],
      [6, 3, 3, 4, 4, 5, 5],
      [6, 6, 4, 4, 4, 5, 5],
      [6, 6, 6, 4, 5, 5, 5],
      [6, 6, 6, 5, 5, 5, 5],
    ],
  },

  // --- 8x8 Hard ---
  {
    id: 'hard-1',
    name: 'Cardboard Castle 🏰',
    size: 8,
    difficulty: 'hard',
    solution: [
      { row: 0, col: 3 },
      { row: 1, col: 6 },
      { row: 2, col: 2 },
      { row: 3, col: 7 },
      { row: 4, col: 1 },
      { row: 5, col: 4 },
      { row: 6, col: 0 },
      { row: 7, col: 5 },
    ],
    regions: [
      [0, 0, 0, 0, 1, 1, 1, 3],
      [0, 2, 2, 0, 1, 1, 1, 3],
      [2, 2, 2, 2, 5, 1, 3, 3],
      [4, 2, 2, 5, 5, 5, 3, 3],
      [4, 4, 6, 5, 5, 5, 3, 7],
      [4, 4, 6, 6, 5, 7, 7, 7],
      [6, 6, 6, 6, 7, 7, 7, 7],
      [6, 6, 6, 7, 7, 7, 7, 7],
    ],
  },
  {
    id: 'hard-2',
    name: 'Midnight Zoomies 🌙',
    size: 8,
    difficulty: 'hard',
    solution: [
      { row: 0, col: 2 },
      { row: 1, col: 5 },
      { row: 2, col: 7 },
      { row: 3, col: 0 },
      { row: 4, col: 3 },
      { row: 5, col: 6 },
      { row: 6, col: 4 },
      { row: 7, col: 1 },
    ],
    regions: [
      [0, 0, 0, 1, 1, 1, 2, 2],
      [0, 0, 0, 1, 1, 1, 2, 2],
      [3, 0, 4, 4, 1, 2, 2, 2],
      [3, 3, 4, 4, 4, 5, 5, 5],
      [3, 3, 4, 4, 6, 5, 5, 5],
      [3, 7, 7, 6, 6, 6, 5, 5],
      [7, 7, 7, 6, 6, 6, 5, 5],
      [7, 7, 7, 7, 6, 6, 6, 5],
    ],
  },
];

/**
 * Checks if placed cat coordinates violate:
 * 1) Same row
 * 2) Same column
 * 3) Same region
 * 4) Adjacent 8-neighbors (orthogonally or diagonally)
 */
export function validateBoard(
  board: BoardCell[][],
  puzzle: Puzzle
): {
  conflictMap: Map<string, string[]>;
  isSolved: boolean;
  totalCats: number;
} {
  const size = puzzle.size;
  const cats: { row: number; col: number; region: number }[] = [];
  const conflictMap = new Map<string, string[]>();

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (board[r][c].state === 'cat') {
        cats.push({ row: r, col: c, region: board[r][c].region });
      }
    }
  }

  // Compare every pair of cats for conflicts
  for (let i = 0; i < cats.length; i++) {
    for (let j = i + 1; j < cats.length; j++) {
      const a = cats[i];
      const b = cats[j];
      const reasons: string[] = [];

      if (a.row === b.row) reasons.push('Same Row');
      if (a.col === b.col) reasons.push('Same Column');
      if (a.region === b.region) reasons.push('Same Color Territory');

      const rowDiff = Math.abs(a.row - b.row);
      const colDiff = Math.abs(a.col - b.col);
      if (rowDiff <= 1 && colDiff <= 1) {
        reasons.push('Touching Cats (No-Touching Rule)');
      }

      if (reasons.length > 0) {
        const keyA = `${a.row},${a.col}`;
        const keyB = `${b.row},${b.col}`;
        const currentA = conflictMap.get(keyA) || [];
        const currentB = conflictMap.get(keyB) || [];
        conflictMap.set(keyA, Array.from(new Set([...currentA, ...reasons])));
        conflictMap.set(keyB, Array.from(new Set([...currentB, ...reasons])));
      }
    }
  }

  // Check if solved:
  // Exactly `size` cats, 0 conflicts, exactly 1 in each row, 1 in each col, 1 in each region
  let isSolved = false;
  if (cats.length === size && conflictMap.size === 0) {
    const rows = new Set(cats.map((c) => c.row));
    const cols = new Set(cats.map((c) => c.col));
    const regions = new Set(cats.map((c) => c.region));
    if (rows.size === size && cols.size === size && regions.size === size) {
      isSolved = true;
    }
  }

  return { conflictMap, isSolved, totalCats: cats.length };
}

/**
 * Procedural Puzzle Generator:
 * Generates an N-Queens / Queens logic puzzle with guaranteed solvable connected regions
 */
export function generateRandomPuzzle(size: number, difficulty: Difficulty): Puzzle {
  // Find valid queens placement with Chebyshev distance >= 2
  const maxAttempts = 300;
  let solution: { row: number; col: number }[] | null = null;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const cols = Array.from({ length: size }, (_, i) => i);
    // Shuffle columns
    for (let i = cols.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cols[i], cols[j]] = [cols[j], cols[i]];
    }

    // Check no-touching rule
    let valid = true;
    for (let r1 = 0; r1 < size; r1++) {
      for (let r2 = r1 + 1; r2 < size; r2++) {
        const c1 = cols[r1];
        const c2 = cols[r2];
        if (Math.abs(r1 - r2) <= 1 && Math.abs(c1 - c2) <= 1) {
          valid = false;
          break;
        }
      }
      if (!valid) break;
    }

    if (valid) {
      solution = cols.map((col, row) => ({ row, col }));
      break;
    }
  }

  // Fallback to verified template if random search hit attempt cap
  if (!solution) {
    const fallback = CURATED_PUZZLES.find((p) => p.size === size) || CURATED_PUZZLES[0];
    return {
      ...fallback,
      id: `gen-${Date.now()}`,
      name: `Procedural Whisker ${size}x${size}`,
    };
  }

  // Multi-source region expansion to grow contiguous territories
  const grid: number[][] = Array.from({ length: size }, () => Array(size).fill(-1));
  const regionSizes = new Array(size).fill(1);

  // Initialize seeds
  solution.forEach((pos, regionId) => {
    grid[pos.row][pos.col] = regionId;
  });

  // Grow regions cell by cell
  let unassigned = size * size - size;
  const dirs = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  while (unassigned > 0) {
    let progress = false;
    // Order regions by size ascending (balance territories)
    const order = Array.from({ length: size }, (_, i) => i).sort(
      (a, b) => regionSizes[a] - regionSizes[b] + (Math.random() - 0.5) * 1.5
    );

    for (const rId of order) {
      // Find border cells for this region
      const frontier: [number, number][] = [];
      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          if (grid[r][c] === rId) {
            for (const [dr, dc] of dirs) {
              const nr = r + dr;
              const nc = c + dc;
              if (nr >= 0 && nr < size && nc >= 0 && nc < size && grid[nr][nc] === -1) {
                frontier.push([nr, nc]);
              }
            }
          }
        }
      }

      if (frontier.length > 0) {
        const choice = frontier[Math.floor(Math.random() * frontier.length)];
        grid[choice[0]][choice[1]] = rId;
        regionSizes[rId]++;
        unassigned--;
        progress = true;
        if (unassigned === 0) break;
      }
    }

    if (!progress) {
      // Fill remaining orphan cells with nearest neighbor
      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          if (grid[r][c] === -1) {
            for (const [dr, dc] of dirs) {
              const nr = r + dr;
              const nc = c + dc;
              if (nr >= 0 && nr < size && nc >= 0 && nc < size && grid[nr][nc] !== -1) {
                grid[r][c] = grid[nr][nc];
                unassigned--;
                break;
              }
            }
          }
        }
      }
    }
  }

  const names = [
    'Catnip Meadow',
    'Velvet Paws',
    'Scratching Post',
    'Fuzzy Tails',
    'Purr Paradise',
    'Whiskers Haven',
  ];
  const chosenName = `${names[Math.floor(Math.random() * names.length)]} 🐾`;

  return {
    id: `rand-${Date.now()}`,
    name: chosenName,
    size,
    difficulty,
    regions: grid,
    solution,
  };
}
