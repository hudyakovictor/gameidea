import React from 'react';
import { useGame } from '../../context/GameContext';
import {
  X,
  Zap,
  Layers,
  Gem,
} from 'lucide-react';

export const CardInspectorModal: React.FC = () => {
  const { inspectedCard, setInspectedCard, craftCardMastery, playerStats, playSound } = useGame();

  if (!inspectedCard) return null;

  const handleClose = () => {
    playSound('click');
    setInspectedCard(null);
  };

  const handleMasteryCraft = () => {
    craftCardMastery(inspectedCard.id);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 animate-fadeIn select-none">
      <div className="bg-[#091522] border border-cyan-400/40 rounded-2xl max-w-md w-full p-4 sm:p-5 shadow-2xl relative overflow-hidden flex flex-col justify-between max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded uppercase font-black bg-cyan-950 text-cyan-300 border border-cyan-500/40">
              {inspectedCard.category.toUpperCase()}
            </span>
            <span className="text-xs font-mono text-amber-300">
              Мастерство: Тир {inspectedCard.masteryTier}
            </span>
          </div>

          <button
            onClick={handleClose}
            className="p-1 rounded bg-white/5 text-slate-400 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>

        {/* Card Title & Archetype */}
        <div className="my-2 text-center">
          <h2 className="text-lg font-black text-white uppercase tracking-tight">
            {inspectedCard.nameRu}
          </h2>
          <p className="text-[10px] font-mono text-slate-400">
            {inspectedCard.name} • {inspectedCard.archetypeTagRu}
          </p>
        </div>

        {/* Scrollable Card Lore & Rule Deep Dive */}
        <div className="space-y-3 overflow-y-auto my-2 pr-1 text-xs text-slate-300">
          {/* Lore quote box */}
          <div className="p-3 bg-black/40 rounded-xl border border-white/10 italic text-slate-200 leading-relaxed font-serif">
            «{inspectedCard.loreRu}»
          </div>

          {/* Rule Breakdown */}
          <div className="p-3 bg-[#06101c] rounded-xl border border-white/5 space-y-1.5">
            <span className="text-[10px] font-mono uppercase text-cyan-300 font-bold block">
              Принцип применения в рынке:
            </span>
            <p className="text-xs text-slate-300 leading-snug">
              {inspectedCard.detailedRuleRu}
            </p>
          </div>

          {/* Stat Specs */}
          <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-white/5 p-2.5 rounded-xl">
            <div className="flex justify-between">
              <span className="text-slate-400">Стоимость:</span>
              <span className="text-amber-300 font-bold flex items-center gap-0.5">
                <Zap size={11} className="fill-amber-300" /> {inspectedCard.cost} ⚡
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Бонус Ясности:</span>
              <span className="text-cyan-300 font-bold">+{inspectedCard.clarityBonus}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Щит от Шума:</span>
              <span className="text-emerald-300 font-bold">+{inspectedCard.noiseShield}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Уровень:</span>
              <span className="text-white font-bold">{inspectedCard.level}/{inspectedCard.maxLevel}</span>
            </div>
          </div>

          {/* Synergies if present */}
          {inspectedCard.synergies && inspectedCard.synergies.length > 0 && (
            <div className="p-2.5 bg-purple-950/40 border border-purple-500/30 rounded-xl space-y-1">
              <span className="text-[10px] font-mono uppercase text-purple-300 font-bold flex items-center gap-1">
                <Layers size={11} /> Тактическая Синергия
              </span>
              <div className="text-xs text-white font-bold">
                {inspectedCard.synergies[0].synergyNameRu}
              </div>
              <p className="text-[11px] text-purple-200">
                {inspectedCard.synergies[0].bonusEffectRu}
              </p>
            </div>
          )}
        </div>

        {/* Mastery Upgrade Action */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
          <button
            disabled={playerStats.gems < 500}
            onClick={handleMasteryCraft}
            className={`flex-1 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg ${
              playerStats.gems >= 500
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:scale-105 cursor-pointer'
                : 'bg-white/10 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Gem size={13} className="fill-current" />
            <span>Ковать Мастерство (500 💎)</span>
          </button>

          <button
            onClick={handleClose}
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-300 uppercase border border-white/10"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};
