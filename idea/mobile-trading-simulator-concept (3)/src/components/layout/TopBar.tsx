import React from 'react';
import { useGame } from '../../context/GameContext';
import {
  Flame,
  Gem,
  Zap,
  Volume2,
  VolumeX,
  BookOpen,
  Settings,
  Coins,
} from 'lucide-react';

export const TopBar: React.FC = () => {
  const {
    playerStats,
    soundEnabled,
    setSoundEnabled,
    setConceptModalOpen,
    setSettingsModalOpen,
    setCurrentScreen,
    playSound,
  } = useGame();

  const xpProgress = Math.min(
    100,
    Math.round((playerStats.xp / playerStats.nextLevelXp) * 100)
  );

  return (
    <header className="h-[56px] min-h-[56px] px-3 sm:px-4 bg-[#07111e]/95 backdrop-blur-md border-b border-white/10 flex items-center justify-between z-30 select-none">
      {/* Left: Player Avatar + Level + XP Bar */}
      <button
        onClick={() => setCurrentScreen('profile')}
        className="flex items-center gap-2.5 p-1 rounded-lg hover:bg-white/5 transition-colors text-left"
      >
        <div className="relative">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-600 to-emerald-400 p-0.5 shadow-md">
            <div className="w-full h-full rounded-full bg-[#06101c] flex items-center justify-center text-sm font-black text-cyan-300">
              NT
            </div>
          </div>
          <span className="absolute -bottom-1 -right-1 bg-amber-500 text-black font-black text-[9px] px-1 rounded-full border border-black">
            {playerStats.level}
          </span>
        </div>

        <div className="hidden xs:block">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-black text-white leading-none">
              NovaTrader
            </span>
            <span className="text-[9px] text-cyan-300 font-mono uppercase bg-cyan-950/80 px-1 py-0.2 rounded border border-cyan-800/40">
              Ученик
            </span>
          </div>
          <div className="w-20 sm:w-24 bg-white/10 h-1.5 rounded-full mt-1 overflow-hidden">
            <div
              className="bg-gradient-to-r from-cyan-400 to-emerald-400 h-full transition-all duration-300"
              style={{ width: `${xpProgress}%` }}
            />
          </div>
        </div>
      </button>

      {/* Middle: Game Currencies & Energy */}
      <div className="flex items-center gap-2 sm:gap-3 text-xs font-mono">
        {/* Streak */}
        <div
          className="flex items-center gap-1 bg-orange-950/40 border border-orange-500/30 px-2 py-1 rounded-md text-orange-400 font-bold"
          title="Дней подряд в тренажере"
        >
          <Flame size={14} className="fill-orange-400 text-orange-400 animate-pulse" />
          <span>{playerStats.streakDays}</span>
        </div>

        {/* Energy */}
        <div
          className="flex items-center gap-1 bg-cyan-950/40 border border-cyan-500/30 px-2 py-1 rounded-md text-cyan-300 font-bold"
          title="Энергия решений"
        >
          <Zap size={13} className="fill-cyan-300 text-cyan-300" />
          <span>{playerStats.energy}/{playerStats.maxEnergy}</span>
        </div>

        {/* Gold */}
        <div
          className="hidden sm:flex items-center gap-1 bg-amber-950/40 border border-amber-500/30 px-2 py-1 rounded-md text-amber-300 font-bold"
          title="Золото за сценарии"
        >
          <Coins size={14} className="text-amber-300" />
          <span>{playerStats.gold.toLocaleString()}</span>
        </div>

        {/* Gems */}
        <div
          className="flex items-center gap-1 bg-purple-950/40 border border-purple-500/30 px-2 py-1 rounded-md text-purple-300 font-bold"
          title="Кристаллы"
        >
          <Gem size={13} className="fill-purple-300 text-purple-300" />
          <span>{playerStats.gems.toLocaleString()}</span>
        </div>
      </div>

      {/* Right: Sound + GDD Concept + Settings */}
      <div className="flex items-center gap-1 sm:gap-1.5">
        <button
          onClick={() => {
            playSound('click');
            setSoundEnabled(!soundEnabled);
          }}
          className={`p-1.5 rounded-lg border transition-colors ${
            soundEnabled
              ? 'bg-cyan-950/50 border-cyan-500/30 text-cyan-300 hover:bg-cyan-900/50'
              : 'bg-white/5 border-white/10 text-slate-500 hover:bg-white/10'
          }`}
          title={soundEnabled ? 'Звук включен' : 'Звук выключен'}
        >
          {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </button>

        {/* ADMIN CRM LINK (ISOLATED EMBED) */}
        <button
          onClick={() => {
            playSound('click');
            setCurrentScreen('admin');
          }}
          className="flex items-center gap-1 bg-gradient-to-r from-purple-900/60 to-cyan-900/60 border border-purple-400/60 text-purple-200 hover:text-white px-2 py-1 rounded-lg hover:border-purple-300 transition-all text-[11px] font-mono font-bold tracking-wider shadow-md"
          title="Панель администратора & 15 ИИ-Агентов"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="hidden sm:inline">ADMIN</span> CRM
        </button>

        {/* FOR DEVELOPERS BLUEPRINT */}
        <button
          onClick={() => {
            playSound('click');
            setCurrentScreen('developers');
          }}
          className="flex items-center gap-1 bg-gradient-to-r from-cyan-950/80 to-[#0c1f30] border border-cyan-500/40 text-cyan-300 hover:text-white px-2 py-1 rounded-lg hover:border-cyan-300 transition-all text-[11px] font-mono font-bold tracking-wider"
          title="Для разработчиков: Phaser 4, Fastify, Docker"
        >
          <span className="hidden sm:inline">FOR_</span>DEV
        </button>

        <button
          onClick={() => {
            playSound('click');
            setConceptModalOpen(true);
          }}
          className="flex items-center gap-1 bg-white/5 border border-white/10 text-slate-300 hover:text-white px-2 py-1 rounded-lg hover:border-cyan-300 transition-colors text-[11px] font-bold tracking-wider"
          title="Геймдизайн документ & Архитектура игры"
        >
          <BookOpen size={14} className="text-cyan-300" />
          <span className="hidden md:inline">GDD</span>
        </button>

        <button
          onClick={() => {
            playSound('click');
            setSettingsModalOpen(true);
          }}
          className="p-1.5 bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 rounded-lg transition-colors"
          title="Настройки"
        >
          <Settings size={16} />
        </button>
      </div>
    </header>
  );
};
