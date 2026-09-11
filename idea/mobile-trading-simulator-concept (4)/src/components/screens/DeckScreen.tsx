import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { CardCategory, GameCard } from '../../types/game';
import { CardView } from '../common/CardView';
import {
  Layers,
  ArrowUpCircle,
  X,
} from 'lucide-react';

export const DeckScreen: React.FC = () => {
  const {
    inventoryCards,
    equippedDeck,
    equipCard,
    unequipCard,
    upgradeCard,
    playerStats,
    playSound,
  } = useGame();

  const [activeCategory, setActiveCategory] = useState<CardCategory | 'all'>('all');
  const [selectedCardForUpgrade, setSelectedCardForUpgrade] = useState<GameCard | null>(null);

  const filteredCards = inventoryCards.filter((card) =>
    activeCategory === 'all' ? true : card.category === activeCategory
  );

  const equippedCardsList = inventoryCards.filter((c) =>
    equippedDeck.includes(c.id)
  );

  const handleCardClick = (card: GameCard) => {
    playSound('click');
    setSelectedCardForUpgrade(card);
  };

  const handleUpgrade = () => {
    if (!selectedCardForUpgrade) return;
    const success = upgradeCard(selectedCardForUpgrade.id);
    if (success) {
      // refresh selected card state
      const updated = inventoryCards.find((c) => c.id === selectedCardForUpgrade.id);
      if (updated) {
        setSelectedCardForUpgrade({ ...updated, level: updated.level + 1 });
      }
    }
  };

  return (
    <div className="h-full flex flex-col justify-between overflow-y-auto p-3 sm:p-4 max-w-5xl mx-auto w-full select-none pb-2">
      {/* Header & Equipped Deck Bar */}
      <div className="bg-[#091522] border border-cyan-500/30 p-3 rounded-xl shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Layers size={18} className="text-cyan-300" />
            <h2 className="text-sm sm:text-base font-black text-white uppercase">
              Активная Колода Протоколов ({equippedDeck.length}/6)
            </h2>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            Нажми на карту для слота
          </span>
        </div>

        {/* 6 Deck Slots */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {Array.from({ length: 6 }).map((_, idx) => {
            const card = equippedCardsList[idx];
            return (
              <div
                key={idx}
                onClick={() => card && unequipCard(card.id)}
                className={`min-h-[70px] rounded-xl border flex flex-col items-center justify-center p-1.5 transition-all cursor-pointer ${
                  card
                    ? 'bg-cyan-950/70 border-cyan-400/60 shadow-md hover:border-red-400 group'
                    : 'bg-black/40 border-dashed border-white/10 text-slate-600'
                }`}
              >
                {card ? (
                  <>
                    <span className="text-[9px] font-black uppercase text-cyan-300 truncate w-full text-center">
                      {card.nameRu}
                    </span>
                    <span className="text-[8px] text-slate-400 font-mono">
                      Ур. {card.level}
                    </span>
                    <span className="text-[8px] text-red-400 opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                      ✕ Снять
                    </span>
                  </>
                ) : (
                  <span className="text-[10px] font-mono font-bold">+ Слот {idx + 1}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-2">
        {(['all', 'protocol', 'decision', 'reading', 'defense'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => {
              playSound('click');
              setActiveCategory(cat);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition-all whitespace-nowrap ${
              activeCategory === cat
                ? 'bg-cyan-400 text-black shadow-md shadow-cyan-400/40'
                : 'bg-white/5 text-slate-400 hover:bg-white/10 border border-white/5'
            }`}
          >
            {cat === 'all'
              ? 'Все карты'
              : cat === 'protocol'
              ? 'Протоколы'
              : cat === 'decision'
              ? 'Решения'
              : cat === 'reading'
              ? 'Чтение'
              : 'Защита'}
          </button>
        ))}
      </div>

      {/* Cards Catalog Grid */}
      <div className="flex-1 overflow-y-auto pr-1">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {filteredCards.map((card) => {
            const isEquipped = equippedDeck.includes(card.id);
            return (
              <div key={card.id} className="relative">
                <CardView
                  card={card}
                  selected={isEquipped}
                  onClick={() => handleCardClick(card)}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isEquipped) unequipCard(card.id);
                    else equipCard(card.id);
                  }}
                  className={`absolute top-2 right-2 px-2 py-0.5 rounded text-[9px] font-black uppercase shadow-md transition-all ${
                    isEquipped
                      ? 'bg-emerald-400 text-black'
                      : 'bg-black/80 text-white border border-white/20 hover:bg-cyan-400 hover:text-black'
                  }`}
                >
                  {isEquipped ? 'В колоде' : '+ Взять'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Card Upgrade / Detail Modal */}
      {selectedCardForUpgrade && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 animate-fadeIn">
          <div className="bg-[#091522] border border-cyan-400/40 rounded-2xl max-w-sm w-full p-4 shadow-2xl relative">
            <button
              onClick={() => setSelectedCardForUpgrade(null)}
              className="absolute top-3 right-3 p-1 rounded bg-white/5 text-slate-400 hover:text-white"
            >
              <X size={16} />
            </button>

            <div className="mb-3">
              <span className="text-[10px] font-mono uppercase text-cyan-300">
                Карточка Мышления
              </span>
              <h3 className="text-base font-black text-white uppercase">
                {selectedCardForUpgrade.nameRu}
              </h3>
              <p className="text-[10px] font-mono text-slate-400">
                {selectedCardForUpgrade.name}
              </p>
            </div>

            <div className="my-3 p-3 bg-black/40 rounded-xl border border-white/10 text-xs text-slate-300 leading-relaxed font-serif">
              «{selectedCardForUpgrade.loreRu}»
            </div>

            <div className="space-y-1.5 text-xs bg-white/5 p-2.5 rounded-xl mb-4">
              <div className="flex justify-between">
                <span className="text-slate-400">Эффект:</span>
                <span className="text-white font-bold">{selectedCardForUpgrade.effectRu}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Бонус Ясности:</span>
                <span className="text-cyan-300 font-bold">+{selectedCardForUpgrade.clarityBonus}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Щит от шума:</span>
                <span className="text-amber-300 font-bold">+{selectedCardForUpgrade.noiseShield}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Текущий Уровень:</span>
                <span className="text-emerald-300 font-bold">
                  {selectedCardForUpgrade.level} / {selectedCardForUpgrade.maxLevel}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2">
              <button
                disabled={
                  selectedCardForUpgrade.level >= selectedCardForUpgrade.maxLevel ||
                  playerStats.gold < 750
                }
                onClick={handleUpgrade}
                className={`flex-1 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg ${
                  selectedCardForUpgrade.level < selectedCardForUpgrade.maxLevel &&
                  playerStats.gold >= 750
                    ? 'bg-gradient-to-r from-amber-400 to-yellow-300 text-black hover:scale-105 cursor-pointer'
                    : 'bg-white/10 text-slate-500 cursor-not-allowed'
                }`}
              >
                <ArrowUpCircle size={15} />
                <span>Прокачать (750 🪙)</span>
              </button>

              <button
                onClick={() => {
                  if (equippedDeck.includes(selectedCardForUpgrade.id)) {
                    unequipCard(selectedCardForUpgrade.id);
                  } else {
                    equipCard(selectedCardForUpgrade.id);
                  }
                  setSelectedCardForUpgrade(null);
                }}
                className="px-4 py-2.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-xs font-bold text-white uppercase"
              >
                {equippedDeck.includes(selectedCardForUpgrade.id) ? 'Снять' : 'В колоду'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
