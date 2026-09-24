import React from 'react';
import { Undo2, Redo2, RotateCcw, Lightbulb, Play, Pause, CheckSquare } from 'lucide-react';

interface ControlsBarProps {
  timerSeconds: number;
  isPaused: boolean;
  onTogglePause: () => void;
  catsPlaced: number;
  totalCats: number;
  hasConflicts: boolean;
  conflictCount: number;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onReset: () => void;
  onHint: () => void;
  autoXEnabled: boolean;
  onToggleAutoX: () => void;
  activeInputMode: 'auto' | 'cat' | 'cross';
  onChangeInputMode: (mode: 'auto' | 'cat' | 'cross') => void;
}

export const ControlsBar: React.FC<ControlsBarProps> = ({
  timerSeconds,
  isPaused,
  onTogglePause,
  catsPlaced,
  totalCats,
  hasConflicts,
  conflictCount,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onReset,
  onHint,
  autoXEnabled,
  onToggleAutoX,
  activeInputMode,
  onChangeInputMode,
}) => {
  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-[460px] mx-auto mt-3 flex flex-col gap-2.5">
      {/* Top HUD: Timer & Cat Counter */}
      <div className="flex items-center justify-between px-1">
        {/* Timer */}
        <div className="flex items-center gap-1.5 bg-stone-100/90 border border-stone-200/80 px-2.5 py-1 rounded-xl text-stone-800 font-mono text-sm shadow-xs">
          <button
            onClick={onTogglePause}
            className="hover:text-stone-950 transition-colors cursor-pointer"
            title={isPaused ? 'Resume Game' : 'Pause Game'}
          >
            {isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5" />}
          </button>
          <span className="font-semibold tracking-wider">{formatTime(timerSeconds)}</span>
        </div>

        {/* Cats Counter */}
        <div
          className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs sm:text-sm font-bold border transition-colors ${
            hasConflicts
              ? 'bg-rose-50 border-rose-300 text-rose-700'
              : catsPlaced === totalCats
              ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
              : 'bg-stone-100 border-stone-200 text-stone-800'
          }`}
        >
          <span>🐱 Cats:</span>
          <span className="font-mono text-sm">{catsPlaced}/{totalCats}</span>
          {hasConflicts && (
            <span className="text-[11px] font-extrabold text-rose-600 ml-1">
              ({conflictCount} {conflictCount === 1 ? 'conflict' : 'conflicts'})
            </span>
          )}
        </div>
      </div>

      {/* Touch Input Mode Segmented Toggle */}
      <div className="flex items-center justify-between gap-1 p-1 bg-stone-100/90 rounded-xl border border-stone-200/70 text-xs">
        <button
          type="button"
          onClick={() => onChangeInputMode('auto')}
          className={`flex-1 py-1.5 px-2 rounded-lg font-semibold transition-all text-center cursor-pointer ${
            activeInputMode === 'auto'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Auto (Click: ✕ · 2x: 🐱)
        </button>
        <button
          type="button"
          onClick={() => onChangeInputMode('cat')}
          className={`flex-1 py-1.5 px-2 rounded-lg font-semibold transition-all text-center cursor-pointer ${
            activeInputMode === 'cat'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          🐱 Cat Mode
        </button>
        <button
          type="button"
          onClick={() => onChangeInputMode('cross')}
          className={`flex-1 py-1.5 px-2 rounded-lg font-semibold transition-all text-center cursor-pointer ${
            activeInputMode === 'cross'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          ✕ Flag Mode
        </button>
      </div>

      {/* Action Buttons: Undo, Redo, Reset, Hint, Auto-X */}
      <div className="flex items-center justify-between gap-1.5">
        <div className="flex items-center gap-1">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
            className="p-2 sm:px-2.5 sm:py-2 bg-white hover:bg-stone-50 disabled:opacity-40 disabled:hover:bg-white text-stone-700 border border-stone-200 rounded-xl transition-all shadow-2xs text-xs font-semibold flex items-center gap-1 cursor-pointer disabled:cursor-not-allowed"
          >
            <Undo2 className="w-4 h-4" />
            <span className="hidden sm:inline">Undo</span>
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
            className="p-2 sm:px-2.5 sm:py-2 bg-white hover:bg-stone-50 disabled:opacity-40 disabled:hover:bg-white text-stone-700 border border-stone-200 rounded-xl transition-all shadow-2xs text-xs font-semibold flex items-center gap-1 cursor-pointer disabled:cursor-not-allowed"
          >
            <Redo2 className="w-4 h-4" />
            <span className="hidden sm:inline">Redo</span>
          </button>
          <button
            onClick={onReset}
            title="Reset Grid"
            className="p-2 sm:px-2.5 sm:py-2 bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 rounded-xl transition-all shadow-2xs text-xs font-semibold flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onToggleAutoX}
            title="Auto-place ✕ marks around placed cats"
            className={`px-2.5 py-2 text-xs font-semibold rounded-xl border transition-all flex items-center gap-1 cursor-pointer shadow-2xs ${
              autoXEnabled
                ? 'bg-amber-50 border-amber-300 text-amber-900'
                : 'bg-white hover:bg-stone-50 border-stone-200 text-stone-700'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5 text-amber-600" />
            <span>Auto-✕</span>
          </button>

          <button
            onClick={onHint}
            title="Get a gentle hint"
            className="px-3 py-2 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1 cursor-pointer"
          >
            <Lightbulb className="w-4 h-4" />
            <span>Hint</span>
          </button>
        </div>
      </div>
    </div>
  );
};
