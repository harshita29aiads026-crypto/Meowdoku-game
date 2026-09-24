import React from 'react';
import { X, Sparkles, AlertTriangle, ShieldCheck } from 'lucide-react';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-stone-200/80 relative text-stone-800"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition-colors cursor-pointer"
          aria-label="Close rules"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl" role="img" aria-label="Cat">🐱</span>
          <h2 className="text-xl font-black tracking-tight text-stone-900 font-['Fredoka',sans-serif]">
            How to Play Meowdoku
          </h2>
        </div>

        <p className="text-xs text-stone-500 mb-5 leading-relaxed">
          Inspired by LinkedIn Queens, Meowdoku is a peaceful logic puzzle. Your goal is to tuck all cats comfortably into the grid following four simple rules:
        </p>

        <div className="space-y-3.5 mb-6">
          {/* Rule 1 */}
          <div className="flex items-start gap-3 p-3 bg-amber-50/70 border border-amber-200/60 rounded-2xl">
            <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-base shrink-0 font-bold">
              1
            </div>
            <div>
              <h3 className="text-xs font-bold text-stone-900">One Cat per Row & Column</h3>
              <p className="text-xs text-stone-600 mt-0.5">
                Every horizontal row and vertical column must contain <strong>exactly one 🐱 Cat</strong>.
              </p>
            </div>
          </div>

          {/* Rule 2 */}
          <div className="flex items-start gap-3 p-3 bg-purple-50/70 border border-purple-200/60 rounded-2xl">
            <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center text-base shrink-0 font-bold">
              2
            </div>
            <div>
              <h3 className="text-xs font-bold text-stone-900">One Cat per Color Territory</h3>
              <p className="text-xs text-stone-600 mt-0.5">
                Each pastel colored region is a territory. Exactly <strong>one 🐱 Cat</strong> is allowed per territory.
              </p>
            </div>
          </div>

          {/* Rule 3 */}
          <div className="flex items-start gap-3 p-3 bg-rose-50/70 border border-rose-200/60 rounded-2xl">
            <div className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center text-base shrink-0 font-bold">
              3
            </div>
            <div>
              <h3 className="text-xs font-bold text-stone-900">The No-Touching Rule</h3>
              <p className="text-xs text-stone-600 mt-0.5">
                Cats need their personal bubble! No two cats can touch each other—<strong>not even diagonally</strong> (all 8 surrounding squares).
              </p>
            </div>
          </div>

          {/* Rule 4 */}
          <div className="flex items-start gap-3 p-3 bg-emerald-50/70 border border-emerald-200/60 rounded-2xl">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-base shrink-0 font-bold">
              4
            </div>
            <div>
              <h3 className="text-xs font-bold text-stone-900">Controls & Validation</h3>
              <p className="text-xs text-stone-600 mt-0.5">
                • <strong>Single Click:</strong> Place or clear safe <strong>✕</strong> marks.<br/>
                • <strong>Double Click:</strong> Place a <strong>🐱 Cat</strong>.<br/>
                • <strong>Instant Error:</strong> If a cat breaks any rule, it immediately turns into a red <strong>❌</strong>!
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm rounded-2xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Start Playing! 🐾</span>
        </button>
      </div>
    </div>
  );
};
