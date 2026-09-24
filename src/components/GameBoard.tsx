import React, { useRef, useState, useMemo } from 'react';
import { BoardCell, CellState, Puzzle } from '../types';
import { REGION_THEMES, getRegionCellCounts } from '../puzzles';

interface GameBoardProps {
  board: BoardCell[][];
  puzzle: Puzzle;
  conflictMap: Map<string, string[]>;
  onCellClick: (row: number, col: number) => void;
  onCellDoubleClick: (row: number, col: number) => void;
  onCellRightClick: (row: number, col: number) => void;
  onCellDragMark?: (row: number, col: number, state: CellState) => void;
  activeInputMode?: 'auto' | 'cat' | 'cross';
}

export const GameBoard: React.FC<GameBoardProps> = ({
  board,
  puzzle,
  conflictMap,
  onCellClick,
  onCellDoubleClick,
  onCellRightClick,
  onCellDragMark,
  activeInputMode = 'auto',
}) => {
  const size = puzzle.size;
  const isMouseDownRef = useRef(false);
  const dragTargetStateRef = useRef<CellState>('cross');
  const [hoveredCell, setHoveredCell] = useState<{ r: number; c: number } | null>(null);

  // Compute region sizes to identify single-cell regions
  const regionCellCounts = useMemo(() => {
    return getRegionCellCounts(puzzle.regions, size);
  }, [puzzle.regions, size]);

  const handleMouseDown = (r: number, c: number, e: React.MouseEvent) => {
    if (e.button === 2) {
      // Right click handled in onContextMenu
      return;
    }
    isMouseDownRef.current = true;
    if (activeInputMode === 'cross') {
      const next = board[r][c].state === 'cross' ? 'empty' : 'cross';
      dragTargetStateRef.current = next;
    }
  };

  const handleMouseEnter = (r: number, c: number) => {
    setHoveredCell({ r, c });
    if (isMouseDownRef.current && onCellDragMark && activeInputMode === 'cross') {
      onCellDragMark(r, c, dragTargetStateRef.current);
    }
  };

  const handleMouseUp = () => {
    isMouseDownRef.current = false;
  };

  React.useEffect(() => {
    const handleGlobalMouseUp = () => {
      isMouseDownRef.current = false;
    };
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

  return (
    <div className="w-full max-w-[460px] aspect-square mx-auto p-1.5 sm:p-2.5 bg-stone-900 rounded-2xl shadow-xl shadow-stone-900/10 transition-all select-none">
      <div
        className="w-full h-full grid rounded-xl overflow-hidden bg-stone-900"
        style={{
          gridTemplateColumns: `repeat(${size}, 1fr)`,
          gridTemplateRows: `repeat(${size}, 1fr)`,
        }}
        onMouseLeave={() => setHoveredCell(null)}
      >
        {board.map((row, r) =>
          row.map((cell, c) => {
            const regionId = cell.region;
            const theme = REGION_THEMES[regionId % REGION_THEMES.length];
            const key = `${r},${c}`;
            const hasConflict = conflictMap.has(key);
            const conflictReasons = conflictMap.get(key) || [];
            const isSingleCellRegion = regionCellCounts[regionId] === 1;

            // Detect region boundaries
            const bTop = r === 0 || puzzle.regions[r - 1][c] !== regionId;
            const bBottom = r === size - 1 || puzzle.regions[r + 1][c] !== regionId;
            const bLeft = c === 0 || puzzle.regions[r][c - 1] !== regionId;
            const bRight = c === size - 1 || puzzle.regions[r][c + 1] !== regionId;

            // Border styling: thick outer/territory border, hairline dotted interior border
            const borderClasses = [
              bTop ? 'border-t-[3px] border-t-stone-800' : 'border-t-[0.5px] border-t-stone-900/10',
              bBottom ? 'border-b-[3px] border-b-stone-800' : 'border-b-[0.5px] border-b-stone-900/10',
              bLeft ? 'border-l-[3px] border-l-stone-800' : 'border-l-[0.5px] border-l-stone-900/10',
              bRight ? 'border-r-[3px] border-r-stone-800' : 'border-r-[0.5px] border-r-stone-900/10',
            ].join(' ');

            const isHovered = hoveredCell?.r === r && hoveredCell?.c === c;

            return (
              <button
                key={key}
                type="button"
                aria-label={`Cell Row ${r + 1}, Column ${c + 1}, Region ${theme.name}${isSingleCellRegion ? ' (Single Box Territory)' : ''}, State: ${cell.state}`}
                className={`relative flex items-center justify-center cursor-pointer transition-transform duration-75 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-800 ${borderClasses} ${
                  hasConflict ? 'bg-rose-200/95 ring-2 ring-rose-500 z-10' : ''
                }`}
                style={{
                  backgroundColor: hasConflict ? '#FECDD3' : theme.bg,
                }}
                onClick={(e) => {
                  e.preventDefault();
                  onCellClick(r, c);
                }}
                onDoubleClick={(e) => {
                  e.preventDefault();
                  onCellDoubleClick(r, c);
                }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  onCellRightClick(r, c);
                }}
                onMouseDown={(e) => handleMouseDown(r, c, e)}
                onMouseEnter={() => handleMouseEnter(r, c)}
                onMouseUp={handleMouseUp}
              >
                {/* Subtle row/col/region hover guide */}
                {isHovered && !hasConflict && (
                  <div className="absolute inset-0 bg-black/5 pointer-events-none" />
                )}

                {/* Single-box territory gentle guide indicator when empty */}
                {isSingleCellRegion && cell.state === 'empty' && (
                  <div className="absolute inset-1 border border-dashed border-stone-700/30 rounded-lg pointer-events-none flex items-center justify-center">
                    <span className="text-[10px] font-bold text-stone-600/70 select-none">
                      🐾 1-box
                    </span>
                  </div>
                )}

                {/* Conflict badge glow */}
                {hasConflict && (
                  <div className="absolute inset-0 bg-rose-500/20 animate-pulse pointer-events-none" />
                )}

                {/* State rendering */}
                {cell.state === 'cat' && (
                  <div className="relative flex items-center justify-center z-10">
                    {hasConflict ? (
                      <div
                        className="flex flex-col items-center justify-center text-rose-600 transition-transform scale-110"
                        title={`Conflict: ${conflictReasons.join(', ')}`}
                      >
                        {/* Red ❌ as specified in prompt */}
                        <span className="text-2xl sm:text-3xl leading-none font-black drop-shadow-md filter select-none">
                          ❌
                        </span>
                        <span className="absolute -bottom-2 text-[9px] font-extrabold uppercase tracking-tight bg-rose-600 text-white px-1 rounded-sm shadow-sm">
                          Error
                        </span>
                      </div>
                    ) : (
                      <span className="text-2xl sm:text-3xl leading-none select-none transition-transform hover:scale-110 drop-shadow-sm">
                        🐱
                      </span>
                    )}
                  </div>
                )}

                {cell.state === 'cross' && (
                  <span className="text-stone-700/60 font-black text-lg sm:text-xl leading-none select-none z-10 transition-opacity">
                    ✕
                  </span>
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};
