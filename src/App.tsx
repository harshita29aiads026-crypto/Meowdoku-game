/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { BoardCell, CellState, Difficulty, MoveAction, Puzzle } from './types';
import { CURATED_PUZZLES, generateRandomPuzzle, validateBoard, getRegionCellCounts } from './puzzles';
import { sound } from './audio';
import { triggerConfetti } from './confetti';
import { Header } from './components/Header';
import { GameBoard } from './components/GameBoard';
import { ControlsBar } from './components/ControlsBar';
import { HowToPlayModal } from './components/HowToPlayModal';
import { VictoryModal } from './components/VictoryModal';
import { Sparkles, Dices, X, Lightbulb } from 'lucide-react';

export default function App() {
  const [difficulty, setDifficulty] = useState<Difficulty>('warmup');
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle>(CURATED_PUZZLES[0]);
  const [board, setBoard] = useState<BoardCell[][]>([]);
  const [conflictMap, setConflictMap] = useState<Map<string, string[]>>(new Map());
  const [totalCats, setTotalCats] = useState(0);
  const [isSolved, setIsSolved] = useState(false);
  const [starterClueDismissed, setStarterClueDismissed] = useState(false);

  // Stats & History
  const [moveHistory, setMoveHistory] = useState<MoveAction[]>([]);
  const [redoHistory, setRedoHistory] = useState<MoveAction[]>([]);
  const [movesCount, setMovesCount] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);

  // Timer
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Settings & Modes
  const [soundEnabled, setSoundEnabled] = useState(sound.enabled);
  const [autoXEnabled, setAutoXEnabled] = useState(true);
  const [activeInputMode, setActiveInputMode] = useState<'auto' | 'cat' | 'cross'>('auto');

  // Modals
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isVictoryOpen, setIsVictoryOpen] = useState(false);

  // Click Timer for distinguishing Single Click (✕) vs Double Click (🐱)
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize Board from Puzzle
  const loadPuzzle = useCallback((puzzle: Puzzle) => {
    setCurrentPuzzle(puzzle);
    const initialBoard: BoardCell[][] = Array.from({ length: puzzle.size }, (_, r) =>
      Array.from({ length: puzzle.size }, (_, c) => ({
        row: r,
        col: c,
        region: puzzle.regions[r][c],
        state: 'empty',
        hasConflict: false,
        conflictReasons: [],
      }))
    );

    setBoard(initialBoard);
    setConflictMap(new Map());
    setTotalCats(0);
    setIsSolved(false);
    setMoveHistory([]);
    setRedoHistory([]);
    setMovesCount(0);
    setHintsUsed(0);
    setTimerSeconds(0);
    setIsPaused(false);
    setIsVictoryOpen(false);
  }, []);

  // Switch Difficulty or Level
  const handleSelectDifficulty = (newDiff: Difficulty) => {
    setDifficulty(newDiff);
    const filtered = CURATED_PUZZLES.filter((p) => p.difficulty === newDiff);
    setPuzzleIndex(0);
    const defaultSize = newDiff === 'warmup' ? 5 : newDiff === 'easy' ? 6 : newDiff === 'medium' ? 7 : 8;
    loadPuzzle(filtered[0] || generateRandomPuzzle(defaultSize, newDiff));
  };

  const handleNextPuzzle = () => {
    const filtered = CURATED_PUZZLES.filter((p) => p.difficulty === difficulty);
    const nextIdx = (puzzleIndex + 1) % filtered.length;
    setPuzzleIndex(nextIdx);
    if (nextIdx === 0 && filtered.length > 0) {
      // If looped through curated, generate an exciting random one
      const size = difficulty === 'warmup' ? 5 : difficulty === 'easy' ? 6 : difficulty === 'medium' ? 7 : 8;
      loadPuzzle(generateRandomPuzzle(size, difficulty));
    } else {
      loadPuzzle(filtered[nextIdx]);
    }
  };

  const handleRandomPuzzle = () => {
    const size = difficulty === 'warmup' ? 5 : difficulty === 'easy' ? 6 : difficulty === 'medium' ? 7 : 8;
    loadPuzzle(generateRandomPuzzle(size, difficulty));
  };

  // Initial Load
  useEffect(() => {
    loadPuzzle(CURATED_PUZZLES[0]);
  }, [loadPuzzle]);

  // Timer Tick
  useEffect(() => {
    if (isPaused || isSolved) return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isPaused, isSolved]);

  // Apply auto-X neighbors around a placed cat
  const applyAutoX = (boardState: BoardCell[][], catR: number, catC: number): BoardCell[][] => {
    if (!autoXEnabled) return boardState;
    const size = currentPuzzle.size;
    const newBoard = boardState.map((row) => row.map((cell) => ({ ...cell })));

    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const nr = catR + dr;
        const nc = catC + dc;
        if (nr >= 0 && nr < size && nc >= 0 && nc < size) {
          if (newBoard[nr][nc].state === 'empty') {
            newBoard[nr][nc].state = 'cross';
          }
        }
      }
    }
    return newBoard;
  };

  // Re-validate Board state and trigger victory/audio feedback
  const updateBoardAndValidate = (
    nextBoard: BoardCell[][],
    latestAction?: { r: number; c: number; state: CellState }
  ) => {
    const { conflictMap: newConflicts, isSolved: solved, totalCats: catsCount } = validateBoard(
      nextBoard,
      currentPuzzle
    );

    setBoard(nextBoard);
    setConflictMap(newConflicts);
    setTotalCats(catsCount);

    if (latestAction) {
      const isConflicted = newConflicts.has(`${latestAction.r},${latestAction.c}`);
      if (latestAction.state === 'cat') {
        if (isConflicted) {
          sound.playConflict();
        } else {
          sound.playPlaceCat();
        }
      } else if (latestAction.state === 'cross') {
        sound.playPlaceX();
      } else {
        sound.playRemove();
      }
    }

    if (solved && !isSolved) {
      setIsSolved(true);
      sound.playVictory();
      triggerConfetti();
      setTimeout(() => {
        setIsVictoryOpen(true);
      }, 350);
    }
  };

  // Execute Cell State Change
  const setCellState = (r: number, c: number, nextState: CellState) => {
    const currentState = board[r][c].state;
    if (currentState === nextState) return;

    let newBoard = board.map((row) => row.map((cell) => ({ ...cell })));
    newBoard[r][c].state = nextState;

    // Auto-X on Cat placement
    if (nextState === 'cat' && autoXEnabled) {
      newBoard = applyAutoX(newBoard, r, c);
    }

    setMoveHistory((prev) => [...prev, { row: r, col: c, prevState: currentState, nextState }]);
    setRedoHistory([]);
    setMovesCount((prev) => prev + 1);

    updateBoardAndValidate(newBoard, { r, c, state: nextState });
  };

  // Single Click: Places or clears an "X" mark (per user concept & rules)
  const handleCellClick = (r: number, c: number) => {
    if (isSolved || isPaused) return;

    if (activeInputMode === 'cat') {
      // In Cat Mode, single click toggles Cat
      const next: CellState = board[r][c].state === 'cat' ? 'empty' : 'cat';
      setCellState(r, c, next);
      return;
    }

    if (activeInputMode === 'cross') {
      // In Flag Mode, single click toggles Cross
      const next: CellState = board[r][c].state === 'cross' ? 'empty' : 'cross';
      setCellState(r, c, next);
      return;
    }

    // Default 'auto' mode: Single click is X, Double click is Cat!
    // We debounce single-click slightly (220ms) so double click executes immediately without stutter
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
      handleCellDoubleClick(r, c);
      return;
    }

    clickTimeoutRef.current = setTimeout(() => {
      clickTimeoutRef.current = null;
      const current = board[r][c].state;
      // Single Click: Places or clears an "X" mark
      const next: CellState = current === 'cross' ? 'empty' : current === 'cat' ? 'empty' : 'cross';
      setCellState(r, c, next);
    }, 220);
  };

  // Double Click: Places a Cat (🐱) (per user concept & rules)
  const handleCellDoubleClick = (r: number, c: number) => {
    if (isSolved || isPaused) return;

    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
    }

    const current = board[r][c].state;
    const next: CellState = current === 'cat' ? 'empty' : 'cat';
    setCellState(r, c, next);
  };

  // Right-Click also places/clears Cat instantly for power users
  const handleCellRightClick = (r: number, c: number) => {
    if (isSolved || isPaused) return;
    const current = board[r][c].state;
    const next: CellState = current === 'cat' ? 'empty' : 'cat';
    setCellState(r, c, next);
  };

  // Drag-to-mark support for rapid flagging
  const handleCellDragMark = (r: number, c: number, targetState: CellState) => {
    if (isSolved || isPaused) return;
    if (board[r][c].state !== targetState && board[r][c].state !== 'cat') {
      setCellState(r, c, targetState);
    }
  };

  // Undo / Redo
  const handleUndo = () => {
    if (moveHistory.length === 0) return;
    const last = moveHistory[moveHistory.length - 1];
    const newHistory = moveHistory.slice(0, -1);

    const newBoard = board.map((row) => row.map((cell) => ({ ...cell })));
    newBoard[last.row][last.col].state = last.prevState;

    setMoveHistory(newHistory);
    setRedoHistory((prev) => [last, ...prev]);
    updateBoardAndValidate(newBoard);
    sound.playRemove();
  };

  const handleRedo = () => {
    if (redoHistory.length === 0) return;
    const next = redoHistory[0];
    const newRedo = redoHistory.slice(1);

    let newBoard = board.map((row) => row.map((cell) => ({ ...cell })));
    newBoard[next.row][next.col].state = next.nextState;
    if (next.nextState === 'cat' && autoXEnabled) {
      newBoard = applyAutoX(newBoard, next.row, next.col);
    }

    setRedoHistory(newRedo);
    setMoveHistory((prev) => [...prev, next]);
    updateBoardAndValidate(newBoard);
  };

  // Reset Grid
  const handleReset = () => {
    const newBoard = board.map((row) =>
      row.map((cell) => ({
        ...cell,
        state: 'empty' as CellState,
        hasConflict: false,
        conflictReasons: [],
      }))
    );
    setBoard(newBoard);
    setConflictMap(new Map());
    setTotalCats(0);
    setIsSolved(false);
    setMoveHistory([]);
    setRedoHistory([]);
    sound.playRemove();
  };

  // Hint: Finds an unplaced solution cat or an empty non-solution cell to mark with safe X
  const handleHint = () => {
    if (isSolved) return;
    setHintsUsed((prev) => prev + 1);

    // First try: place one correct cat from solution
    for (const sol of currentPuzzle.solution) {
      if (board[sol.row][sol.col].state !== 'cat') {
        setCellState(sol.row, sol.col, 'cat');
        sound.playPlaceCat();
        return;
      }
    }

    // Otherwise mark safe X
    for (let r = 0; r < currentPuzzle.size; r++) {
      for (let c = 0; c < currentPuzzle.size; c++) {
        const isSolutionCat = currentPuzzle.solution.some((s) => s.row === r && s.col === c);
        if (!isSolutionCat && board[r][c].state === 'empty') {
          setCellState(r, c, 'cross');
          sound.playPlaceX();
          return;
        }
      }
    }
  };

  // Keyboard Shortcuts (Undo, Redo, Reset, Hint, Pause)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        handleRedo();
      } else if (e.key.toLowerCase() === 'r' && !e.ctrlKey && !e.metaKey) {
        handleReset();
      } else if (e.key.toLowerCase() === 'h') {
        handleHint();
      } else if (e.key === 'p') {
        setIsPaused((prev) => !prev);
      } else if (e.key === 'Escape') {
        setIsRulesOpen(false);
        setIsVictoryOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-800 flex flex-col items-center justify-between font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Bar Header */}
      <Header
        difficulty={difficulty}
        onSelectDifficulty={handleSelectDifficulty}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(sound.toggle())}
        onOpenRules={() => setIsRulesOpen(true)}
      />

      {/* Main Game Arena */}
      <main className="w-full max-w-xl flex-1 flex flex-col items-center justify-center px-4 py-3 sm:py-6">
        {/* Title & Level Subtitle */}
        <div className="w-full max-w-[460px] flex items-center justify-between mb-2 px-1">
          <div>
            <h1 className="text-lg sm:text-xl font-black text-stone-900 tracking-tight font-['Fredoka',sans-serif] flex items-center gap-1.5">
              <span>{currentPuzzle.name}</span>
            </h1>
            <p className="text-[11px] text-stone-500 font-medium">
              Place 1 cat per row, column & color territory without touching
            </p>
          </div>
          <button
            onClick={handleRandomPuzzle}
            title="Generate Random Puzzle"
            className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 rounded-xl transition-all flex items-center gap-1 text-xs font-semibold cursor-pointer"
          >
            <Dices className="w-4 h-4 text-amber-600" />
            <span className="hidden sm:inline">Random</span>
          </button>
        </div>

        {/* Starter Clue Box (Easy Start Guidance with 1-box Color Territory) */}
        {!starterClueDismissed && (currentPuzzle.hintTip || getRegionCellCounts(currentPuzzle.regions, currentPuzzle.size).some(c => c === 1)) && (
          <div className="w-full max-w-[460px] mb-2.5 p-2.5 sm:p-3 bg-amber-50/90 border border-amber-200/90 rounded-2xl flex items-start justify-between text-xs text-amber-950 shadow-xs">
            <div className="flex items-start gap-2 pr-2">
              <span className="text-base leading-none select-none">🐾</span>
              <div className="leading-tight">
                <span className="font-extrabold text-amber-900 block text-[11px] uppercase tracking-wide">
                  Starter Clue: Find the 1-box Territory!
                </span>
                <p className="text-[11px] text-amber-800 mt-0.5 font-medium">
                  {currentPuzzle.hintTip ||
                    'Look for the color region with only 1 single box! Since each color territory must have 1 cat, you can place a cat there immediately.'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setStarterClueDismissed(true)}
              className="text-amber-500 hover:text-amber-900 p-0.5 rounded-lg transition-colors cursor-pointer"
              title="Dismiss tip"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Board */}
        {board.length > 0 && (
          <GameBoard
            board={board}
            puzzle={currentPuzzle}
            conflictMap={conflictMap}
            onCellClick={handleCellClick}
            onCellDoubleClick={handleCellDoubleClick}
            onCellRightClick={handleCellRightClick}
            onCellDragMark={handleCellDragMark}
            activeInputMode={activeInputMode}
          />
        )}

        {/* Controls & Status HUD */}
        <ControlsBar
          timerSeconds={timerSeconds}
          isPaused={isPaused}
          onTogglePause={() => setIsPaused((prev) => !prev)}
          catsPlaced={totalCats}
          totalCats={currentPuzzle.size}
          hasConflicts={conflictMap.size > 0}
          conflictCount={conflictMap.size}
          canUndo={moveHistory.length > 0}
          canRedo={redoHistory.length > 0}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onReset={handleReset}
          onHint={handleHint}
          autoXEnabled={autoXEnabled}
          onToggleAutoX={() => setAutoXEnabled((prev) => !prev)}
          activeInputMode={activeInputMode}
          onChangeInputMode={setActiveInputMode}
        />
      </main>

      {/* Footer */}
      <footer className="w-full max-w-xl py-3 px-4 border-t border-stone-200/60 flex items-center justify-between text-[11px] text-stone-400">
        <div className="flex items-center gap-1.5">
          <span>Meowdoku</span>
          <span>·</span>
          <span>Queens Logic Cat Puzzle</span>
        </div>
        <div className="flex items-center gap-3">
          <span>Shortcuts: Ctrl+Z Undo · H Hint</span>
        </div>
      </footer>

      {/* Modals */}
      <HowToPlayModal isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} />
      <VictoryModal
        isOpen={isVictoryOpen}
        timeSeconds={timerSeconds}
        movesCount={movesCount}
        hintsUsed={hintsUsed}
        difficulty={`${currentPuzzle.size}x${currentPuzzle.size} ${difficulty}`}
        puzzleName={currentPuzzle.name}
        onNextPuzzle={handleNextPuzzle}
        onPlayAgain={handleReset}
      />
    </div>
  );
}
