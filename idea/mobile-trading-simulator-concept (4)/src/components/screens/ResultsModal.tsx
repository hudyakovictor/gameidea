import React from 'react';
import { useGame } from '../../context/GameContext';
import {
  Trophy,
  CheckCircle2,
  XCircle,
  Coins,
  Sparkles,
  ChevronRight,
  Layers,
  Flame,
} from 'lucide-react';

export const ResultsModal: React.FC = () => {
  const { resultsModal, setResultsModal, playSound } = useGame();

  if (!resultsModal) return null;

  const handleClose = () => {
    playSound('click');
    setResultsModal(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 animate-fadeIn select-none">
      <div className="bg-[#091522] border border-cyan-400/40 rounded-3xl max-w-md w-full p-4 sm:p-6 shadow-2xl relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-cyan-500/20 to-transparent pointer-events-none" />

        {/* Top Trophy Icon */}
        <div className="relative z-10 text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 p-0.5 shadow-lg shadow-amber-500/30 mx-auto flex items-center justify-center">
            <div className="w-full h-full bg-[#07111e] rounded-2xl flex items-center justify-center text-amber-300">
              <Trophy size={28} />
            </div>
          </div>

          <h2 className="text-xl font-black text-white uppercase tracking-tight mt-3">
            {resultsModal.titleRu}
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            {resultsModal.scenarioNameRu}
          </p>
        </div>

        {/* Big DQI Gauge & Breakdown */}
        <div className="relative z-10 my-3.5 bg-black/50 border border-white/10 rounded-2xl p-3.5 flex items-center justify-between gap-4">
          <div className="text-center pl-2">
            <div className="text-[10px] font-mono text-slate-400 uppercase">Качество Решений</div>
            <div className="text-3xl font-black text-cyan-300 font-mono mt-0.5">
              {resultsModal.dqiScore}%
            </div>
            <div className="text-[10px] text-emerald-400 font-mono font-bold mt-0.5">
              +{resultsModal.dqiDelta}% к прошлому забегу
            </div>
          </div>

          <div className="flex-1 border-l border-white/10 pl-3.5 space-y-1.5">
            <div className="text-[10px] font-mono uppercase text-slate-400 font-bold">
              Твои действия:
            </div>
            {resultsModal.actionsBreakdown.map((act, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-200 leading-tight">
                {act.isPositive ? (
                  <CheckCircle2 size={13} className="text-emerald-400 flex-shrink-0" />
                ) : (
                  <XCircle size={13} className="text-red-400 flex-shrink-0" />
                )}
                <span>{act.labelRu}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Synergies Triggered Banner (if any) */}
        {resultsModal.synergiesTriggered && resultsModal.synergiesTriggered.length > 0 && (
          <div className="relative z-10 my-2 p-2 bg-gradient-to-r from-purple-950/80 to-indigo-950/80 border border-purple-400/50 rounded-xl flex items-center gap-2">
            <Flame size={16} className="text-amber-400 fill-amber-400" />
            <div className="text-xs text-purple-200">
              <strong>Сработало комбо:</strong> {resultsModal.synergiesTriggered[0].nameRu} (+{resultsModal.synergiesTriggered[0].bonusDQI} DQI)
            </div>
          </div>
        )}

        {/* Rewards Row */}
        <div className="relative z-10 grid grid-cols-2 gap-2 my-2.5">
          <div className="p-2 rounded-xl bg-amber-950/40 border border-amber-500/30 flex items-center gap-2">
            <Coins size={18} className="text-amber-300" />
            <div>
              <div className="text-[9px] text-slate-400 font-mono uppercase">Золото</div>
              <div className="text-xs font-black text-amber-300">+{resultsModal.goldReward} 🪙</div>
            </div>
          </div>

          <div className="p-2 rounded-xl bg-cyan-950/40 border border-cyan-500/30 flex items-center gap-2">
            <Sparkles size={18} className="text-cyan-300" />
            <div>
              <div className="text-[9px] text-slate-400 font-mono uppercase">Опыт</div>
              <div className="text-xs font-black text-cyan-300">+{resultsModal.xpReward} XP</div>
            </div>
          </div>
        </div>

        {/* Unlocked Card Reward (if any) */}
        {resultsModal.unlockedCard && (
          <div className="relative z-10 my-2 p-2.5 rounded-xl bg-purple-950/60 border border-purple-500/40 flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-purple-500/20 text-purple-300">
              <Layers size={18} />
            </div>
            <div>
              <span className="text-[9px] font-mono uppercase text-purple-300 font-black">
                Разблокирована Новая Карта!
              </span>
              <div className="text-xs font-black text-white">
                {resultsModal.unlockedCard.nameRu}
              </div>
            </div>
          </div>
        )}

        {/* Continue Button */}
        <div className="relative z-10 mt-3">
          <button
            onClick={handleClose}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-lg cursor-pointer"
          >
            <span>Продолжить путь</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
