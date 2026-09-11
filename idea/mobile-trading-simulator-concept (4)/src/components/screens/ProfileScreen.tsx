import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { PlayerStats } from '../../types/game';
import {
  Brain,
  Shield,
  Scale,
  LineChart,
  HeartHandshake,
  ArrowUpCircle,
  Award,
  Sparkles,
  Zap,
  Lock,
} from 'lucide-react';

export const ProfileScreen: React.FC = () => {
  const {
    playerStats,
    skillPerks,
    toggleEquipPerk,
    upgradeSkill,
    playSound,
  } = useGame();

  const [activeTab, setActiveTab] = useState<'spider' | 'skills' | 'perks' | 'achievements'>('spider');

  type SkillKey = keyof Pick<
    PlayerStats,
    'analysis' | 'psychology' | 'strategy' | 'discipline' | 'riskManagement'
  >;

  const skillsConfig: {
    key: SkillKey;
    labelRu: string;
    icon: React.ElementType;
    color: string;
    descriptionRu: string;
  }[] = [
    {
      key: 'analysis',
      labelRu: 'Анализ структуры & Паттерны',
      icon: LineChart,
      color: 'text-cyan-400',
      descriptionRu: 'Умение отличать истинный слом структуры от манипуляции ликвидностью.',
    },
    {
      key: 'riskManagement',
      labelRu: 'Управление рисками & R:R',
      icon: Scale,
      color: 'text-amber-400',
      descriptionRu: 'Жесткий расчет размера позиции от стопа и сохранение капитала.',
    },
    {
      key: 'discipline',
      labelRu: 'Дисциплина & Четкие правила',
      icon: Shield,
      color: 'text-emerald-400',
      descriptionRu: 'Способность не входить в рынок без полного набора подтверждений.',
    },
    {
      key: 'psychology',
      labelRu: 'Психология & Анти-Тильт',
      icon: HeartHandshake,
      color: 'text-purple-400',
      descriptionRu: 'Устойчивость к FOMO, сериям стопов и эйфории после побед.',
    },
    {
      key: 'strategy',
      labelRu: 'Макроэкономическая стратегия',
      icon: Brain,
      color: 'text-blue-400',
      descriptionRu: 'Понимание влияния процентных ставок и глобальной ликвидности.',
    },
  ];

  // Radar Chart Calculations (5 vertices)
  const cx = 150;
  const cy = 150;
  const radius = 100;
  const totalAxes = 5;

  const points = skillsConfig.map((skill, index) => {
    const angle = (Math.PI * 2 / totalAxes) * index - Math.PI / 2;
    const value = playerStats[skill.key] / 100;
    const x = cx + radius * value * Math.cos(angle);
    const y = cy + radius * value * Math.sin(angle);
    return { x, y };
  });

  const polygonPath = points.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <div className="h-full flex flex-col justify-between overflow-y-auto p-3 sm:p-4 max-w-5xl mx-auto w-full select-none pb-2">
      {/* Profile Header */}
      <div className="bg-[#091522] border border-cyan-500/30 rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-emerald-400 p-0.5 shadow-lg shadow-cyan-950/60 flex-shrink-0">
            <div className="w-full h-full bg-[#06101c] rounded-2xl flex items-center justify-center font-black text-2xl text-cyan-300">
              NT
            </div>
            <span className="absolute -bottom-1 -right-1 bg-amber-400 text-black font-black text-[10px] px-1.5 rounded-full border border-black">
              Ур. {playerStats.level}
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-white">NovaTrader</h2>
              <span className="text-[10px] font-mono text-cyan-300 uppercase bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/30">
                Ученик Аналитика
              </span>
            </div>
            <div className="text-xs text-slate-400 font-mono mt-0.5">
              XP: {playerStats.xp} / {playerStats.nextLevelXp} (До 13 уровня)
            </div>
            <div className="text-[11px] text-amber-300 font-mono mt-1 flex items-center gap-1">
              <Sparkles size={12} /> Средний DQI: {playerStats.decisionQualityAvg}%
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/10 flex-wrap">
          {[
            { id: 'spider', label: 'Радар (Spider)' },
            { id: 'skills', label: 'Ветки (RPG)' },
            { id: 'perks', label: 'Перки' },
            { id: 'achievements', label: 'Ачивки' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                playSound('click');
                setActiveTab(tab.id as typeof activeTab);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                activeTab === tab.id
                  ? 'bg-cyan-400 text-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="my-3 flex-1 bg-[#06101c]/90 border border-white/10 rounded-2xl p-3 sm:p-4 overflow-y-auto shadow-inner">
        {/* TAB 1: SPIDER RADAR CHART */}
        {activeTab === 'spider' && (
          <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-2">
            {/* SVG Spider Chart */}
            <div className="relative w-72 h-72 flex items-center justify-center">
              <svg viewBox="0 0 300 300" className="w-full h-full">
                {/* Background Web Rings */}
                {[0.25, 0.5, 0.75, 1.0].map((scale, i) => (
                  <polygon
                    key={i}
                    points={Array.from({ length: totalAxes })
                      .map((_, idx) => {
                        const angle = (Math.PI * 2 / totalAxes) * idx - Math.PI / 2;
                        const x = cx + radius * scale * Math.cos(angle);
                        const y = cy + radius * scale * Math.sin(angle);
                        return `${x},${y}`;
                      })
                      .join(' ')}
                    fill="none"
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth="1"
                  />
                ))}

                {/* Axes lines */}
                {Array.from({ length: totalAxes }).map((_, idx) => {
                  const angle = (Math.PI * 2 / totalAxes) * idx - Math.PI / 2;
                  const x = cx + radius * Math.cos(angle);
                  const y = cy + radius * Math.sin(angle);
                  return (
                    <line
                      key={idx}
                      x1={cx}
                      y1={cy}
                      x2={x}
                      y2={y}
                      stroke="rgba(255,255,255,0.12)"
                      strokeDasharray="2,2"
                    />
                  );
                })}

                {/* Radar Area Polygon */}
                <polygon
                  points={polygonPath}
                  fill="rgba(105, 231, 223, 0.25)"
                  stroke="#69e7df"
                  strokeWidth="2.5"
                />

                {/* Vertices Dots */}
                {points.map((p, idx) => (
                  <circle
                    key={idx}
                    cx={p.x}
                    cy={p.y}
                    r="4.5"
                    fill="#06101c"
                    stroke="#69e7df"
                    strokeWidth="2.5"
                  />
                ))}
              </svg>
            </div>

            {/* Spider Values List */}
            <div className="space-y-2.5 w-full sm:w-80 text-xs">
              <span className="text-[10px] font-mono text-cyan-300 uppercase font-black tracking-widest block mb-1">
                Показатели Мастерства
              </span>
              {skillsConfig.map((s) => (
                <div key={s.key} className="flex items-center justify-between p-2 bg-white/5 rounded-xl border border-white/5">
                  <div className="flex items-center gap-2">
                    <s.icon size={15} className={s.color} />
                    <span className="text-white font-bold">{s.labelRu.split('&')[0]}</span>
                  </div>
                  <span className="font-mono font-black text-cyan-300">
                    {playerStats[s.key]}/100
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: SKILLS UPGRADE LIST */}
        {activeTab === 'skills' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-white/5 font-mono">
              <span>Паутинная прокачка профиля трейдера</span>
              <span>Стоимость: 500 🪙 за +5 очков</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {skillsConfig.map((skill) => {
                const value = playerStats[skill.key];
                const Icon = skill.icon;
                return (
                  <div
                    key={skill.key}
                    className="p-3 rounded-xl bg-[#0a1726] border border-white/10 flex flex-col justify-between shadow-md"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon size={18} className={skill.color} />
                          <span className="text-xs font-bold text-white leading-snug">
                            {skill.labelRu}
                          </span>
                        </div>
                        <span className="text-xs font-mono font-black text-amber-300">
                          {value}/100
                        </span>
                      </div>

                      <p className="text-[10px] text-slate-400 mt-1 leading-tight">
                        {skill.descriptionRu}
                      </p>

                      {/* Progress Bar */}
                      <div className="w-full bg-black/60 h-2 rounded-full mt-2 overflow-hidden border border-white/5">
                        <div
                          className="bg-gradient-to-r from-cyan-400 to-emerald-400 h-full transition-all duration-300"
                          style={{ width: `${value}%` }}
                        />
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-slate-500">
                        Бонус: +{(value * 0.2).toFixed(1)} к ясности
                      </span>

                      <button
                        disabled={playerStats.gold < 500 || value >= 100}
                        onClick={() => upgradeSkill(skill.key)}
                        className={`px-3 py-1 rounded-lg text-xs font-black uppercase flex items-center gap-1 transition-all ${
                          playerStats.gold >= 500 && value < 100
                            ? 'bg-amber-400 text-black hover:bg-amber-300 cursor-pointer shadow-md'
                            : 'bg-white/5 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        <ArrowUpCircle size={13} />
                        <span>Улучшить</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: PASSIVE SKILL PERKS */}
        {activeTab === 'perks' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-white/5 font-mono">
              <span>Пассивные Перки Аналитика (Экипировано: {playerStats.equippedPerks.length}/2)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {skillPerks.map((perk) => {
                const isEquipped = playerStats.equippedPerks.includes(perk.id);
                return (
                  <div
                    key={perk.id}
                    className={`p-3 rounded-xl border flex flex-col justify-between transition-all ${
                      isEquipped
                        ? 'bg-cyan-950/70 border-cyan-400/80 shadow-lg'
                        : perk.unlocked
                        ? 'bg-white/5 border-white/10'
                        : 'bg-black/40 border-white/5 opacity-50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-white">{perk.nameRu}</span>
                        {perk.unlocked ? (
                          <span className="text-[9px] font-mono text-emerald-300">
                            {perk.passiveBonusRu}
                          </span>
                        ) : (
                          <span className="text-[9px] font-mono text-slate-500 flex items-center gap-1">
                            <Lock size={11} /> Ур. {perk.requiredLevel}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1 leading-snug">
                        {perk.descRu}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-white/5 flex justify-end">
                      <button
                        disabled={!perk.unlocked}
                        onClick={() => toggleEquipPerk(perk.id)}
                        className={`px-3 py-1 rounded-lg text-xs font-black uppercase ${
                          isEquipped
                            ? 'bg-emerald-400 text-black'
                            : perk.unlocked
                            ? 'bg-white/10 text-white hover:bg-cyan-400 hover:text-black'
                            : 'bg-transparent text-slate-600 cursor-not-allowed'
                        }`}
                      >
                        {isEquipped ? 'Экипирован ✓' : 'Надеть'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: ACHIEVEMENTS */}
        {activeTab === 'achievements' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {[
              { title: 'Стальные нервы', desc: 'Пропустил 10 ложных пробоев подряд', icon: Shield, unlocked: true },
              { title: 'Анти-Ликвидатор', desc: 'Победил Леверидж-Гоблина без потери капитала', icon: Zap, unlocked: true },
              { title: 'Мастер Контекста', desc: 'Получил 95+ DQI в 5 исторических кризисах', icon: Award, unlocked: false },
              { title: 'Хладнокровие 2008', desc: 'Выбрал кэш и хеджи в разгар паники Lehman', icon: Sparkles, unlocked: true },
            ].map((ach, idx) => {
              const Icon = ach.icon;
              return (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border flex items-center gap-3 ${
                    ach.unlocked
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                      : 'bg-white/5 border-white/5 text-slate-500 opacity-50'
                  }`}
                >
                  <div className={`p-2.5 rounded-xl ${ach.unlocked ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/5 text-slate-600'}`}>
                    <Icon size={22} />
                  </div>
                  <div>
                    <div className="text-xs font-black text-white">{ach.title}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{ach.desc}</div>
                    <span className="text-[9px] font-mono mt-1 inline-block">
                      {ach.unlocked ? '✅ Разблокировано' : '🔒 Заблокировано'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
