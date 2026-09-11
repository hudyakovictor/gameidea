import React from 'react';
import { useGame } from '../../context/GameContext';
import {
  X,
  Zap,
  Sparkles,
  ArrowUpCircle,
} from 'lucide-react';

export const CardInspectorModal: React.FC = () => {
  const {
    inspectedCard,
    setInspectedCard,
    equippedDeck,
    equipCard,
    unequipCard,
    upgradeCard,
    playerStats,
    playSound,
  } = useGame();

  if (!inspectedCard) return null;

  const isEquipped = equippedDeck.includes(inspectedCard.id);
  const canUpgrade = inspectedCard.level < inspectedCard.maxLevel && playerStats.gold >= 750;

  const handleUpgrade = () => {
    upgradeCard(inspectedCard.id);
  };

  const handleClose = () => {
    playSound('click');
    setInspectedCard(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 animate-fadeIn select-none">
      <div className="bg-[#091522] border border-cyan-400/40 rounded-3xl max-w-md w-full p-4 sm:p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between">
        {/* Animated Hologram Top Glow */}
        <div
          className="absolute top-0 inset-x-0 h-32 opacity-25 pointer-events-none blur-xl"
          style={{ backgroundColor: inspectedCard.foilColor || '#06b6d4' }}
        />

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/30">
              {inspectedCard.category.toUpperCase()} • {inspectedCard.rarity.toUpperCase()}
            </span>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-white border border-white/10"
          >
            <X size={16} />
          </button>
        </div>

        {/* 3D Holographic Card Canvas */}
        <div className="relative z-10 my-3 flex flex-col items-center">
          <div
            className="w-48 h-64 rounded-2xl p-3 flex flex-col justify-between border-2 shadow-2xl relative overflow-hidden transition-transform duration-300 hover:scale-105"
            style={{
              borderColor: inspectedCard.foilColor || '#69e7df',
              background: `linear-gradient(135deg, #0d1f33 0%, #06101c 100%)`,
              boxShadow: `0 0 30px ${inspectedCard.foilColor || '#69e7df'}30`,
            }}
          >
            {/* Holographic Sheen Layer */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />

            <div className="flex items-center justify-between">
              <span className="text-[9px] font-mono font-black uppercase text-white/70">
                SIGNAL PROTOCOL
              </span>
              <span className="flex items-center text-xs font-mono font-bold text-amber-300 bg-black/60 px-1.5 py-0.5 rounded border border-amber-500/30">
                <Zap size={11} className="fill-current mr-0.5" />
                {inspectedCard.cost}
              </span>
            </div>

            <div className="my-auto text-center">
              <div className="w-16 h-16 mx-auto rounded-xl bg-black/50 border border-white/20 flex items-center justify-center text-3xl shadow-inner">
                {inspectedCard.category === 'protocol'
                  ? '🟪'
                  : inspectedCard.category === 'decision'
                  ? '🟩'
                  : inspectedCard.category === 'reading'
                  ? '🟦'
                  : '🟧'}
              </div>
              <h3 className="font-black text-sm uppercase text-white mt-2 leading-tight">
                {inspectedCard.nameRu}
              </h3>
              <p className="text-[9px] font-mono text-slate-400 mt-0.5">
                {inspectedCard.name}
              </p>
            </div>

            <div className="text-[9px] font-mono text-center text-slate-300 bg-black/50 p-1.5 rounded border border-white/5">
              {inspectedCard.effectRu}
            </div>
          </div>
        </div>

        {/* Lore Text Box */}
        <div className="relative z-10 my-2 bg-black/40 border border-white/5 p-3 rounded-xl text-xs text-slate-300 italic font-serif leading-relaxed">
          «{inspectedCard.loreRu}»
        </div>

        {/* Synergy Combos Box */}
        {inspectedCard.synergies && inspectedCard.synergies.length > 0 && (
          <div className="relative z-10 my-1 p-2.5 rounded-xl bg-purple-950/50 border border-purple-500/40 space-y-1">
            <div className="text-[10px] font-black uppercase text-purple-300 flex items-center gap-1">
              <Sparkles size={12} /> Комбо-синергия: {inspectedCard.synergies[0].nameRu}
            </div>
            <p className="text-[11px] text-slate-200 leading-snug">
              {inspectedCard.synergies[0].bonusEffectRu}
            </p>
          </div>
        )}

        {/* Stat Meters */}
        <div className="relative z-10 grid grid-cols-3 gap-2 text-center my-2 text-xs font-mono">
          <div className="p-2 bg-white/5 rounded-xl border border-white/5">
            <div className="text-[9px] text-slate-400">Ясность</div>
            <div className="font-black text-cyan-300">+{inspectedCard.clarityBonus}</div>
          </div>
          <div className="p-2 bg-white/5 rounded-xl border border-white/5">
            <div className="text-[9px] text-slate-400">Щит</div>
            <div className="font-black text-emerald-300">+{inspectedCard.noiseShield}</div>
          </div>
          <div className="p-2 bg-white/5 rounded-xl border border-white/5">
            <div className="text-[9px] text-slate-400">Уровень</div>
            <div className="font-black text-amber-300">{inspectedCard.level}/{inspectedCard.maxLevel}</div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="relative z-10 pt-2 border-t border-white/10 flex items-center justify-between gap-2">
          <button
            disabled={!canUpgrade}
            onClick={handleUpgrade}
            className={`flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
              canUpgrade
                ? 'bg-amber-400 text-black hover:scale-105 cursor-pointer shadow-md'
                : 'bg-white/5 text-slate-500 cursor-not-allowed'
            }`}
          >
            <ArrowUpCircle size={14} />
            <span>Улучшить (750 🪙)</span>
          </button>

          <button
            onClick={() => {
              if (isEquipped) unequipCard(inspectedCard.id);
              else equipCard(inspectedCard.id);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase border transition-all ${
              isEquipped
                ? 'bg-emerald-950 border-emerald-400 text-emerald-300'
                : 'bg-cyan-400 border-cyan-300 text-black hover:scale-105'
            }`}
          >
            {isEquipped ? 'В колоде ✓' : '+ Взять'}
          </button>
        </div>
      </div>
    </div>
  );
};
