import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { BOSS_THREATS } from '../../data/bosses';
import { CardView } from '../common/CardView';
import {
  Shield,
  Brain,
  Zap,
  Play,
  RotateCcw,
  AlertTriangle,
  Sparkles,
  Flame,
} from 'lucide-react';

export const BattlerScreen: React.FC = () => {
  const {
    inventoryCards,
    equippedDeck,
    recordScenarioResult,
    playSound,
    setInspectedCard,
    checkDeckSynergies,
  } = useGame();

  const [currentBossIndex, setCurrentBossIndex] = useState(0);
  const boss = BOSS_THREATS[currentBossIndex] || BOSS_THREATS[0];

  // Combat State
  const [bossHp, setBossHp] = useState(boss.maxStability);
  const [playerClarity, setPlayerClarity] = useState(100);
  const [playerShield, setPlayerShield] = useState(40);
  const [energy, setEnergy] = useState(3);
  const [selectedCardIds, setSelectedCardIds] = useState<string[]>([]);
  const [combatLog, setCombatLog] = useState<string[]>([
    `Рынок вошел в фазу аномальной волатильности. ${boss.nameRu} готовит атаку: «${boss.intent.name}»!`,
  ]);
  const [isAttacking, setIsAttacking] = useState(false);
  const [battleWon, setBattleWon] = useState(false);
  const [floatingDamage, setFloatingDamage] = useState<{ amount: number; isCrit: boolean } | null>(null);

  // Deck hand
  const handCards = inventoryCards.filter((c) =>
    equippedDeck.includes(c.id)
  );

  // Check active synergies in currently selected cards
  const activeSynergies = checkDeckSynergies(selectedCardIds);

  const toggleCardSelection = (cardId: string) => {
    const card = inventoryCards.find((c) => c.id === cardId);
    if (!card) return;

    if (selectedCardIds.includes(cardId)) {
      playSound('click');
      setSelectedCardIds(selectedCardIds.filter((id) => id !== cardId));
      setEnergy((prev) => prev + card.cost);
    } else {
      if (energy < card.cost) {
        playSound('error');
        return;
      }
      playSound('select');
      setSelectedCardIds([...selectedCardIds, cardId]);
      setEnergy((prev) => prev - card.cost);
    }
  };

  const handleExecuteTurn = () => {
    if (selectedCardIds.length === 0) {
      playSound('error');
      return;
    }

    setIsAttacking(true);

    const playedCards = inventoryCards.filter((c) =>
      selectedCardIds.includes(c.id)
    );

    let totalDamage = 0;
    let totalClarityHeal = 0;
    let totalShieldGain = 0;
    let hasCounter = false;

    playedCards.forEach((card) => {
      totalDamage += card.clarityBonus + card.disciplineBonus / 2;
      totalClarityHeal += card.clarityBonus / 2;
      totalShieldGain += card.noiseShield;
      if (card.category === boss.weaknessCategory) {
        hasCounter = true;
        totalDamage += 25;
      }
    });

    // Add Synergy Bonuses
    if (activeSynergies.length > 0) {
      playSound('combo');
      activeSynergies.forEach((syn) => {
        totalDamage += 30;
        totalClarityHeal += syn.bonusClarity;
        totalShieldGain += syn.bonusShield;
      });
    } else {
      playSound('play');
    }

    const newBossHp = Math.max(0, bossHp - Math.round(totalDamage));
    const newShield = Math.min(100, playerShield + Math.round(totalShieldGain));
    const newClarity = Math.min(100, playerClarity + Math.round(totalClarityHeal));

    // Boss retaliates
    const incomingDamage = boss.intent.damage;
    const damageAfterShield = Math.max(0, incomingDamage - newShield);
    const finalShield = Math.max(0, newShield - incomingDamage);
    const finalClarity = Math.max(0, newClarity - damageAfterShield);

    if (newShield > 0 && incomingDamage > 0) {
      playSound('block');
    }

    setFloatingDamage({ amount: Math.round(totalDamage), isCrit: hasCounter || activeSynergies.length > 0 });
    setTimeout(() => setFloatingDamage(null), 1400);

    setBossHp(newBossHp);
    setPlayerShield(finalShield);
    setPlayerClarity(finalClarity);

    // Logs
    const newLogs = [
      `Вы применили: ${playedCards.map((c) => c.nameRu).join(' + ')}. Нанесено ${Math.round(totalDamage)} урона стабильности босса!`,
      activeSynergies.length > 0 ? `🔥 КОМБО-СИНЕРГИЯ: «${activeSynergies[0].nameRu}» активирована!` : '',
      hasCounter ? '⭐ Критический контр-удар по слабости угрозы!' : '',
      `Босс ответил атакой «${boss.intent.name}» на ${incomingDamage} урона. Защита поглотила ${newShield - finalShield}.`,
    ].filter(Boolean);

    setCombatLog(newLogs);

    // Reset Turn
    setSelectedCardIds([]);
    setEnergy(3);
    setIsAttacking(false);

    if (newBossHp <= 0) {
      setBattleWon(true);
      playSound('success');
      setTimeout(() => {
        recordScenarioResult(
          hasCounter ? 96 : 88,
          260,
          500,
          `${boss.nameRu}: Победа над рыночной угрозой`,
          [
            { labelRu: 'Применил протокол «Сначала Риск»', isPositive: true },
            { labelRu: 'Активировал синергию карт мышления', isPositive: activeSynergies.length > 0 },
            { labelRu: 'Поглотил 100% урона ликвидации щитом', isPositive: true },
            { labelRu: 'Не поддался на провокацию плечом', isPositive: true },
          ],
          'dec-dont-average-losers',
          activeSynergies
        );
      }, 1200);
    } else if (finalClarity <= 0) {
      playSound('error');
    }
  };

  const handleResetBattle = () => {
    playSound('click');
    setBossHp(boss.maxStability);
    setPlayerClarity(100);
    setPlayerShield(40);
    setEnergy(3);
    setSelectedCardIds([]);
    setBattleWon(false);
    setCombatLog(['Сценарий перезапущен. Собери надежную связку протоколов.']);
  };

  return (
    <div className="h-full flex flex-col justify-between overflow-hidden p-2 sm:p-3 max-w-5xl mx-auto w-full select-none">
      {/* Top Section: Boss Status & Intent Bar */}
      <div className="bg-[#091522] border border-red-500/30 rounded-2xl p-2.5 sm:p-3 shadow-xl relative">
        <div className="flex items-center justify-between gap-2">
          {/* Boss Info + Portrait */}
          <div className="flex items-center gap-2.5">
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden border-2 border-red-500/70 shadow-lg shadow-red-950/60 flex-shrink-0">
              <img
                src={boss.image}
                alt={boss.nameRu}
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-0 right-0 bg-red-600 text-white font-black text-[8px] px-1 rounded-tl">
                {boss.threatLevel}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs sm:text-sm font-black text-white uppercase tracking-tight">
                  {boss.nameRu}
                </span>
                <span className="text-[9px] bg-red-950/80 text-red-300 px-1.5 py-0.2 rounded border border-red-500/40 uppercase font-mono">
                  Фаза {boss.phase}/{boss.maxPhases}
                </span>
              </div>

              {/* Boss Stability Bar */}
              <div className="w-36 sm:w-56 bg-black/60 h-2.5 rounded-full mt-1.5 overflow-hidden border border-red-500/30">
                <div
                  className="bg-gradient-to-r from-red-600 to-amber-500 h-full transition-all duration-300"
                  style={{ width: `${(bossHp / boss.maxStability) * 100}%` }}
                />
              </div>
              <div className="text-[9px] font-mono text-slate-400 mt-0.5">
                Стабильность угрозы: <strong className="text-red-400">{bossHp}</strong> / {boss.maxStability}
              </div>
            </div>
          </div>

          {/* Boss Switcher Buttons */}
          <div className="flex items-center gap-1">
            {BOSS_THREATS.map((b, idx) => (
              <button
                key={b.id}
                onClick={() => {
                  playSound('click');
                  setCurrentBossIndex(idx);
                  setBossHp(b.maxStability);
                  setSelectedCardIds([]);
                }}
                className={`w-7 h-7 rounded-lg text-xs font-black transition-all ${
                  idx === currentBossIndex
                    ? 'bg-red-500 text-black border border-white shadow-md'
                    : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
                }`}
                title={b.nameRu}
              >
                0{idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Boss Intent Badge */}
        <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] bg-red-950/30 px-2.5 py-1 rounded-xl">
          <div className="flex items-center gap-1.5 text-red-300">
            <AlertTriangle size={13} className="text-red-400 animate-pulse" />
            <span>Намерение: <strong>{boss.intent.name}</strong></span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            Слабость: <strong className="text-cyan-300 uppercase">{boss.weaknessCategory}</strong>
          </span>
        </div>
      </div>

      {/* Middle Section: Market Anomaly Scenario Visualizer & Live Candlestick Graphic */}
      <div className="my-1.5 bg-[#050e18] border border-cyan-500/20 rounded-2xl p-2.5 flex-1 flex flex-col justify-between overflow-hidden shadow-inner relative">
        {/* Floating Combat Damage Numbers */}
        {floatingDamage && (
          <div
            className={`absolute top-1/3 left-1/2 -translate-x-1/2 z-30 font-black font-mono animate-bounce text-2xl sm:text-3xl ${
              floatingDamage.isCrit ? 'text-amber-300 drop-shadow-[0_0_15px_#f59e0b]' : 'text-cyan-300'
            }`}
          >
            -{floatingDamage.amount} {floatingDamage.isCrit ? '🔥 CRIT!' : ''}
          </div>
        )}

        {/* Live Market Insights Checklist */}
        <div className="relative z-10 space-y-1">
          <div className="text-[10px] font-mono text-cyan-300 uppercase tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Sparkles size={11} /> Сценарий: {boss.titleRu}
            </span>
            <span className="text-amber-400 text-[9px] font-bold">
              {boss.passiveAbilityRu}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 text-[10px] text-slate-300">
            <span className="bg-black/50 border border-white/5 px-2 py-0.5 rounded-md flex items-center gap-1">
              ⚡ Слом структуры тренда (4H)
            </span>
            <span className="bg-black/50 border border-white/5 px-2 py-0.5 rounded-md flex items-center gap-1 text-red-300">
              ⚠️ Лавинообразный объем продаж
            </span>
            <span className="bg-black/50 border border-white/5 px-2 py-0.5 rounded-md flex items-center gap-1 text-amber-300">
              📊 Спред стакана расширен до 4%
            </span>
          </div>
        </div>

        {/* Active Synergy Banner (if triggered) */}
        {activeSynergies.length > 0 && (
          <div className="relative z-10 my-1 bg-gradient-to-r from-purple-950/80 to-indigo-950/80 border border-purple-400/60 p-2 rounded-xl flex items-center justify-between animate-pulse">
            <div className="flex items-center gap-1.5 text-xs text-purple-200 font-bold">
              <Flame size={14} className="text-amber-400 fill-amber-400" />
              <span>СИНЕРГИЯ АКТИВНА: {activeSynergies[0].nameRu}</span>
            </div>
            <span className="text-[10px] font-mono text-amber-300 font-bold">
              +{activeSynergies[0].bonusDQI} DQI
            </span>
          </div>
        )}

        {/* Combat Action Log */}
        <div className="relative z-10 my-1 bg-black/60 border border-white/10 rounded-xl p-2 text-[10px] sm:text-xs font-mono text-slate-300 leading-relaxed max-h-16 overflow-y-auto">
          {combatLog.map((log, idx) => (
            <div key={idx} className="text-cyan-200">
              › {log}
            </div>
          ))}
        </div>

        {/* Player Combat Meters & Energy */}
        <div className="relative z-10 grid grid-cols-3 gap-2 bg-[#091522]/90 border border-white/10 p-2 rounded-xl">
          {/* Mind Clarity */}
          <div>
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-cyan-300 font-bold flex items-center gap-1">
                <Brain size={12} /> Ясность Ума
              </span>
              <span className="font-mono text-white">{playerClarity}/100</span>
            </div>
            <div className="w-full bg-black/50 h-2 rounded-full mt-1 overflow-hidden">
              <div
                className="bg-cyan-400 h-full transition-all duration-300"
                style={{ width: `${playerClarity}%` }}
              />
            </div>
          </div>

          {/* Capital Shield */}
          <div>
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-emerald-300 font-bold flex items-center gap-1">
                <Shield size={12} /> Защита Риска
              </span>
              <span className="font-mono text-white">{playerShield}/100</span>
            </div>
            <div className="w-full bg-black/50 h-2 rounded-full mt-1 overflow-hidden">
              <div
                className="bg-emerald-400 h-full transition-all duration-300"
                style={{ width: `${playerShield}%` }}
              />
            </div>
          </div>

          {/* Energy per turn */}
          <div className="flex items-center justify-end gap-1">
            <span className="text-[10px] text-slate-400 font-mono">Энергия:</span>
            <div className="flex items-center gap-0.5">
              {[1, 2, 3].map((pt) => (
                <div
                  key={pt}
                  className={`w-4 h-5 rounded flex items-center justify-center text-[10px] font-black ${
                    pt <= energy
                      ? 'bg-amber-400 text-black shadow-md shadow-amber-400/40'
                      : 'bg-white/10 text-slate-600'
                  }`}
                >
                  <Zap size={10} className="fill-current" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Hand Cards & Turn Trigger CTA */}
      <div className="bg-[#071320] border border-white/10 rounded-2xl p-2 sm:p-2.5">
        <div className="flex items-center justify-between mb-1.5 px-1">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
            Колода игрока (Выбери карты для контр-протокола)
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleResetBattle}
              className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1"
              title="Перезапустить"
            >
              <RotateCcw size={11} /> Сброс
            </button>
          </div>
        </div>

        {/* Hand Cards */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 sm:gap-2">
          {handCards.map((card) => (
            <CardView
              key={card.id}
              card={card}
              compact
              selected={selectedCardIds.includes(card.id)}
              onClick={() => toggleCardSelection(card.id)}
              onInspect={() => setInspectedCard(card)}
            />
          ))}
        </div>

        {/* Action Button */}
        <div className="mt-2 flex items-center gap-2">
          <button
            disabled={selectedCardIds.length === 0 || isAttacking || battleWon}
            onClick={handleExecuteTurn}
            className={`w-full py-2.5 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg ${
              selectedCardIds.length > 0 && !battleWon
                ? 'bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 text-black shadow-emerald-500/30 hover:shadow-emerald-400/50 hover:scale-[1.01] active:scale-95 cursor-pointer'
                : 'bg-white/10 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Play size={16} className="fill-current" />
            <span>Применить связку карт ({selectedCardIds.length})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
