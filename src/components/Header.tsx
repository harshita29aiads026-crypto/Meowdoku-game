import React from 'react';
import { Volume2, VolumeX, HelpCircle, Download, Sparkles } from 'lucide-react';
import { Difficulty } from '../types';
import { downloadStandaloneHtmlFile } from '../exportHtml';

interface HeaderProps {
  difficulty: Difficulty;
  onSelectDifficulty: (diff: Difficulty) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenRules: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  difficulty,
  onSelectDifficulty,
  soundEnabled,
  onToggleSound,
  onOpenRules,
}) => {
  return (
    <header className="w-full max-w-2xl flex items-center justify-between py-3 px-4 sm:px-6 border-b border-stone-200/80 bg-white/70 backdrop-blur-md sticky top-0 z-20">
      {/* Zone 1: Single Brand Wordmark */}
      <div className="flex items-center gap-2">
        <span className="text-xl sm:text-2xl font-black tracking-tight text-stone-800 flex items-center gap-1.5 font-['Fredoka',sans-serif]">
          Meowdoku
          <span className="text-xl select-none" role="img" aria-label="Cat">🐱</span>
        </span>
      </div>

      {/* Zone 2: Navigation / Difficulty Segmented Control */}
      <nav aria-label="Difficulty" className="flex items-center p-1 bg-stone-100/90 rounded-xl border border-stone-200/60 shadow-inner">
        <button
          onClick={() => onSelectDifficulty('warmup')}
          className={`px-2 sm:px-2.5 py-1 text-xs sm:text-sm font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
            difficulty === 'warmup'
              ? 'bg-white text-stone-900 shadow-sm font-bold'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          5x5 Warmup
        </button>
        <button
          onClick={() => onSelectDifficulty('easy')}
          className={`px-2 sm:px-2.5 py-1 text-xs sm:text-sm font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
            difficulty === 'easy'
              ? 'bg-white text-stone-900 shadow-sm font-bold'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          6x6 Easy
        </button>
        <button
          onClick={() => onSelectDifficulty('medium')}
          className={`px-2 sm:px-2.5 py-1 text-xs sm:text-sm font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
            difficulty === 'medium'
              ? 'bg-white text-stone-900 shadow-sm font-bold'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          7x7 Med
        </button>
        <button
          onClick={() => onSelectDifficulty('hard')}
          className={`px-2 sm:px-2.5 py-1 text-xs sm:text-sm font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
            difficulty === 'hard'
              ? 'bg-white text-stone-900 shadow-sm font-bold'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          8x8 Hard
        </button>
      </nav>

      {/* Zone 3: Primary Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <button
          onClick={onOpenRules}
          title="How to Play Rules"
          className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
          aria-label="How to play rules"
        >
          <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        <button
          onClick={onToggleSound}
          title={soundEnabled ? 'Mute Sounds' : 'Unmute Sounds'}
          className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
          aria-label="Toggle sound"
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-rose-500" />
          ) : (
            <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-stone-400" />
          )}
        </button>
        <button
          onClick={downloadStandaloneHtmlFile}
          title="Download single self-contained HTML file"
          className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-lg transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-stone-500" />
          <span>Single HTML</span>
        </button>
      </div>
    </header>
  );
};
