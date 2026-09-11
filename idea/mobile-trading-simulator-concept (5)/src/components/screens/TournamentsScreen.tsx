import React from 'react';
import { useGame } from '../../context/GameContext';
import {
  Trophy,
  Clock,
  Users,
  Play,
  ChevronRight,
} from 'lucide-react';

export const TournamentsScreen: React.FC = () => {
  const { tournaments, setCurrentScreen, playSound } = useGame();

  return (
    <div className="h-full flex flex-col justify-between overflow-y-auto p-3 sm:p-4 max-w-5xl mx-auto w-full select-none pb-2">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#201506] via-[#2d1c07] to-[#160d03] border border-amber-500/40 rounded-2xl p-3.5 sm:p-4 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 to-yellow-400 p-0.5 shadow-lg shadow-amber-950/60 flex-shrink-0 flex items-center justify-center">
            <div className="w-full h-full bg-[#06101c] rounded-2xl flex items-center justify-center text-amber-300">
              <Trophy size={24} />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-amber-300 uppercase tracking-widest bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/30">
                Асинхронные DQI Колизеи
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                Сезон 01
              </span>
            </div>
            <h2 className="text-sm sm:text-base font-black text-white uppercase mt-0.5">
              Турнирная Арена & Кубки Мастерства
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Все участники проходят единый пул кризисных сценариев. Очки начисляются строго по качеству решений (DQI).
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] font-mono text-slate-400 uppercase block">Призовой Сезон</span>
          <span className="text-sm font-black text-amber-300 font-mono">100,000 🪙 в фонде</span>
        </div>
      </div>

      {/* Tournaments List Feed */}
      <div className="my-3 flex-1 overflow-y-auto space-y-3 pr-1">
        {tournaments.map((tourn) => {
          const isActive = tourn.status === 'active';
          return (
            <div
              key={tourn.id}
              className={`p-4 rounded-2xl border shadow-xl flex flex-col justify-between gap-3 transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-[#170e0a] to-[#0c1624] border-amber-500/40'
                  : 'bg-[#08121d] border-white/10 opacity-70'
              }`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500 text-black">
                    {tourn.badgeRu}
                  </span>
                  <h3 className="text-sm sm:text-base font-black text-white uppercase">
                    {tourn.titleRu}
                  </h3>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-mono text-amber-300">
                  <Clock size={13} />
                  <span>{tourn.timeLeft}</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {tourn.descRu}
              </p>

              {/* Tournament Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono bg-black/40 p-2.5 rounded-xl border border-white/5">
                <div>
                  <span className="text-slate-500 text-[9px] block">ПРИЗОВОЙ ФОНД</span>
                  <strong className="text-amber-300">+{tourn.prizePoolGold.toLocaleString()} 🪙</strong>
                </div>
                <div>
                  <span className="text-slate-500 text-[9px] block">ГЛАВНЫЙ ТРОФЕЙ</span>
                  <strong className="text-purple-300 truncate block">{tourn.prizeCardNameRu}</strong>
                </div>
                <div>
                  <span className="text-slate-500 text-[9px] block">УЧАСТНИКОВ</span>
                  <strong className="text-white flex items-center gap-1">
                    <Users size={11} /> {tourn.participantsCount.toLocaleString()}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-500 text-[9px] block">МИН. DQI</span>
                  <strong className="text-cyan-300">≥ {tourn.minDqiRequirement}%</strong>
                </div>
              </div>

              {/* Action */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400">
                  Рейтинг формируется по 5 раундам
                </span>

                <button
                  onClick={() => {
                    playSound('play');
                    setCurrentScreen('battler');
                  }}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-300 to-orange-400 text-black font-black text-xs uppercase tracking-wider flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer"
                >
                  <Play size={13} className="fill-current" />
                  <span>Вступить в турнир</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
