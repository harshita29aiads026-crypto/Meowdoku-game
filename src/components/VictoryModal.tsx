import React, { useState } from 'react';
import { Trophy, ArrowRight, RotateCcw, Share2, Check, Download } from 'lucide-react';
import { downloadStandaloneHtmlFile } from '../exportHtml';

interface VictoryModalProps {
  isOpen: boolean;
  timeSeconds: number;
  movesCount: number;
  hintsUsed: number;
  difficulty: string;
  puzzleName: string;
  onNextPuzzle: () => void;
  onPlayAgain: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  isOpen,
  timeSeconds,
  movesCount,
  hintsUsed,
  difficulty,
  puzzleName,
  onNextPuzzle,
  onPlayAgain,
}) => {
  const [copied, setCopied] = useState(false);
  if (!isOpen) return null;

  const mins = Math.floor(timeSeconds / 60);
  const secs = timeSeconds % 60;
  const timeFormatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  const handleShare = () => {
    const text = `Meowdoku 🐱\nPuzzle: ${puzzleName} (${difficulty})\n⏱️ Time: ${timeFormatted}\n🎯 Moves: ${movesCount}\n💡 Hints: ${hintsUsed}\nPlay Meowdoku!`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in zoom-in-95 duration-200"
    >
      <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-stone-200 text-stone-800 text-center relative overflow-hidden">
        {/* Decorative background paw */}
        <div className="absolute -top-10 -right-10 text-stone-100 text-9xl select-none pointer-events-none">
          🐾
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-3 text-3xl shadow-inner animate-bounce">
            🏆
          </div>

          <h2 className="text-2xl font-black text-stone-900 tracking-tight font-['Fredoka',sans-serif]">
            Purr-fect Victory!
          </h2>
          <p className="text-xs text-stone-500 mt-1 max-w-[260px]">
            All cats are happily tucked in without a single spat or argument.
          </p>

          {/* Stats Box */}
          <div className="w-full grid grid-cols-3 gap-2 my-5 p-3 bg-stone-50 border border-stone-200/80 rounded-2xl">
            <div className="flex flex-col items-center">
              <span className="text-[10px] uppercase font-bold text-stone-400">Time</span>
              <span className="text-base font-extrabold text-stone-800 font-mono">{timeFormatted}</span>
            </div>
            <div className="flex flex-col items-center border-x border-stone-200">
              <span className="text-[10px] uppercase font-bold text-stone-400">Moves</span>
              <span className="text-base font-extrabold text-stone-800 font-mono">{movesCount}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[10px] uppercase font-bold text-stone-400">Hints</span>
              <span className="text-base font-extrabold text-stone-800 font-mono">{hintsUsed}</span>
            </div>
          </div>

          {/* Primary Action: Next Puzzle */}
          <button
            onClick={onNextPuzzle}
            className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm rounded-2xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 mb-2.5"
          >
            <span>Next Puzzle</span>
            <ArrowRight className="w-4 h-4 text-amber-300" />
          </button>

          {/* Secondary Actions */}
          <div className="w-full flex items-center gap-2">
            <button
              onClick={onPlayAgain}
              className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Replay</span>
            </button>
            <button
              onClick={handleShare}
              className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Share'}</span>
            </button>
          </div>

          {/* Download Standalone HTML Link */}
          <button
            onClick={downloadStandaloneHtmlFile}
            className="mt-3 text-[11px] text-stone-500 hover:text-stone-800 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Download className="w-3 h-3" />
            <span>Download Standalone HTML version</span>
          </button>
        </div>
      </div>
    </div>
  );
};
