import React from 'react';
import { useGame } from '../../context/GameContext';
import {
  Play,
  Swords,
  Puzzle,
  GraduationCap,
  Trophy,
  ShieldAlert,
  ChevronRight,
  Flame,
  Award,
  Sparkles,
} from 'lucide-react';

export const LobbyScreen: React.FC = () => {
  const { setCurrentScreen, playSound, playerStats } = useGame();

  return (
    <div className="h-full flex flex-col justify-between overflow-y-auto p-3 sm:p-4 max-w-5xl mx-auto w-full select-none pb-2">
      {/* Hero Banner Section */}
      <div className="relative rounded-2xl overflow-hidden border border-cyan-500/40 bg-gradient-to-r from-[#071728] via-[#091f33] to-[#0d283f] shadow-2xl p-4 sm:p-6 flex flex-col justify-between min-h-[190px] sm:min-h-[220px]">
        {/* Background Graphic Illustration */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-35 mix-blend-luminosity pointer-events-none"
          style={{ backgroundImage: "url('/images/trader-hero.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#06121f] via-[#06121f]/60 to-transparent pointer-events-none" />

        {/* Top Tag & Season */}
        <div className="relative z-10 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 bg-cyan-950/80 border border-cyan-400/40 text-cyan-300 text-[10px] sm:text-xs font-black uppercase tracking-widest px-2.5 py-1 rounded-full backdrop-blur-md">
            <Sparkles size={12} className="text-amber-300" />
            Сезон 01: Архивы Паники
          </div>

          <div className="flex items-center gap-1 text-[11px] font-mono text-amber-300 bg-amber-950/70 border border-amber-500/30 px-2 py-0.5 rounded-md">
            <Flame size={12} className="fill-amber-400" />
            Серия: 14 дней
          </div>
        </div>

        {/* Center Title & Slogan */}
        <div className="relative z-10 my-2">
          <h1 className="font-black text-2xl sm:text-4xl text-white tracking-tight uppercase leading-none drop-shadow-md">
            SIGNAL <span className="text-cyan-300">ARENA</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 mt-1.5 max-w-md leading-relaxed font-medium">
            Рынок — это не про удачу и угадывание. Это про управление риском, чтение контекста и дисциплину.
          </p>
        </div>

        {/* Quick Launch CTA Button */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[11px] sm:text-xs text-slate-300 font-medium">
              Текущий вызов: <strong className="text-white">Инфляционный шок 2022</strong>
            </span>
          </div>

          <button
            onClick={() => {
              playSound('play');
              setCurrentScreen('battler');
            }}
            className="flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 text-[#06101c] font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-cyan-500/30 hover:shadow-cyan-400/50 hover:scale-[1.02] active:scale-95 transition-all"
          >
            <Play size={16} className="fill-current" />
            <span>В бой с рынком</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* 4 Main Game Modes Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-3">
        {/* Card Battler Mode */}
        <button
          onClick={() => setCurrentScreen('battler')}
          className="p-3 rounded-xl border border-red-500/40 bg-gradient-to-b from-[#220d13] to-[#0d0508] hover:border-red-400 text-left transition-all hover:scale-[1.02] active:scale-95 group shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 rounded-lg bg-red-500/20 text-red-400 group-hover:bg-red-500/30">
              <Swords size={20} />
            </div>
            <span className="text-[9px] font-black bg-red-500 text-black px-1.5 py-0.5 rounded uppercase">
              Боссы
            </span>
          </div>
          <div className="text-xs sm:text-sm font-black text-white uppercase">Арена</div>
          <div className="text-[10px] text-slate-400 mt-0.5 leading-tight">
            Битвы протоколов против рыночных угроз
          </div>
        </button>

        {/* Academy / Duolingo Mode */}
        <button
          onClick={() => setCurrentScreen('academy')}
          className="p-3 rounded-xl border border-cyan-500/40 bg-gradient-to-b from-[#082029] to-[#040f14] hover:border-cyan-400 text-left transition-all hover:scale-[1.02] active:scale-95 group shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-300 group-hover:bg-cyan-500/30">
              <GraduationCap size={20} />
            </div>
            <span className="text-[9px] font-black bg-cyan-400 text-black px-1.5 py-0.5 rounded uppercase">
              Дуо
            </span>
          </div>
          <div className="text-xs sm:text-sm font-black text-white uppercase">Академия</div>
          <div className="text-[10px] text-slate-400 mt-0.5 leading-tight">
            Микроуроки от Совы-наставника
          </div>
        </button>

        {/* Puzzles Mode */}
        <button
          onClick={() => setCurrentScreen('puzzle')}
          className="p-3 rounded-xl border border-emerald-500/40 bg-gradient-to-b from-[#092218] to-[#04110c] hover:border-emerald-400 text-left transition-all hover:scale-[1.02] active:scale-95 group shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300 group-hover:bg-emerald-500/30">
              <Puzzle size={20} />
            </div>
            <span className="text-[9px] font-black bg-emerald-400 text-black px-1.5 py-0.5 rounded uppercase">
              Пазлы
            </span>
          </div>
          <div className="text-xs sm:text-sm font-black text-white uppercase">Паттерны</div>
          <div className="text-[10px] text-slate-400 mt-0.5 leading-tight">
            Поиск сигналов и ловушек ликвидности
          </div>
        </button>

        {/* Narrative / Stories Mode */}
        <button
          onClick={() => setCurrentScreen('story')}
          className="p-3 rounded-xl border border-purple-500/40 bg-gradient-to-b from-[#1c0c2e] to-[#0d0517] hover:border-purple-400 text-left transition-all hover:scale-[1.02] active:scale-95 group shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 rounded-lg bg-purple-500/20 text-purple-300 group-hover:bg-purple-500/30">
              <Award size={20} />
            </div>
            <span className="text-[9px] font-black bg-purple-400 text-black px-1.5 py-0.5 rounded uppercase">
              Истории
            </span>
          </div>
          <div className="text-xs sm:text-sm font-black text-white uppercase">Хроники</div>
          <div className="text-[10px] text-slate-400 mt-0.5 leading-tight">
            Реальные исторические кризисы с выбором
          </div>
        </button>
      </div>

      {/* Bottom Row: Season League Banner + Daily Objectives */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {/* Season League Status */}
        <button
          onClick={() => setCurrentScreen('social')}
          className="p-3.5 rounded-xl border border-amber-500/30 bg-[#0c1624] hover:border-amber-400 flex items-center justify-between text-left transition-all shadow-md group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <Trophy size={24} />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase text-amber-400">
                {playerStats.leagueNameRu}
              </div>
              <div className="text-sm font-black text-white">
                Твой ранг: #{playerStats.leagueRank} <span className="text-xs text-slate-400 font-normal">из {playerStats.totalLeaguePlayers.toLocaleString()}</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Рейтинг рассчитывается по качеству решений (DQI)
              </div>
            </div>
          </div>
          <ChevronRight size={18} className="text-slate-500 group-hover:text-amber-300 transition-colors" />
        </button>

        {/* Threat Alert / Daily Mission */}
        <button
          onClick={() => setCurrentScreen('battler')}
          className="p-3.5 rounded-xl border border-red-500/30 bg-[#160c14] hover:border-red-400 flex items-center justify-between text-left transition-all shadow-md group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30">
              <ShieldAlert size={24} />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase text-red-400">
                Активная Угроза Рынка
              </div>
              <div className="text-sm font-black text-white">
                Леверидж-Гоблин 100x <span className="text-xs text-red-400 font-mono">[92/100]</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Собери защиту из карт протоколов и решений
              </div>
            </div>
          </div>
          <ChevronRight size={18} className="text-slate-500 group-hover:text-red-400 transition-colors" />
        </button>
      </div>
    </div>
  );
};
