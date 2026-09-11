import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { LEAGUE_PLAYERS } from '../../data/social';
import {
  Trophy,
  Clock,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

export const SocialScreen: React.FC = () => {
  const { playerStats, playSound, setCurrentScreen } = useGame();
  const [activeTab, setActiveTab] = useState<'leagues' | 'tournaments' | 'friends'>('leagues');

  return (
    <div className="h-full flex flex-col justify-between overflow-y-auto p-3 sm:p-4 max-w-5xl mx-auto w-full select-none pb-2">
      {/* Top Banner: Season League Shield */}
      <div className="bg-gradient-to-r from-[#17130a] via-[#241c0c] to-[#120f06] border border-amber-500/40 rounded-2xl p-3 sm:p-4 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-600 to-yellow-300 p-0.5 shadow-lg shadow-amber-500/30 flex-shrink-0 flex items-center justify-center">
            <div className="w-full h-full bg-[#0a0804] rounded-2xl flex items-center justify-center text-amber-300">
              <Trophy size={28} />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/30">
                Рейтинг по качеству решений (DQI)
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                18 дней до финиша
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-white uppercase mt-0.5">
              {playerStats.leagueNameRu}
            </h2>
            <p className="text-xs text-slate-300">
              Твой текущий ранг: <strong className="text-amber-300 font-mono">#{playerStats.leagueRank}</strong> из {playerStats.totalLeaguePlayers.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="w-full sm:w-auto bg-black/40 border border-amber-500/30 px-3 py-2 rounded-xl text-center">
          <div className="text-[10px] font-mono text-slate-400">Твой DQI Индекс</div>
          <div className="text-lg font-black text-amber-300 font-mono">
            {playerStats.decisionQualityAvg}%
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 my-2.5">
        {(['leagues', 'tournaments', 'friends'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              playSound('click');
              setActiveTab(tab);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition-all ${
              activeTab === tab
                ? 'bg-amber-400 text-black shadow-md shadow-amber-400/30'
                : 'bg-white/5 text-slate-400 hover:bg-white/10 border border-white/5'
            }`}
          >
            {tab === 'leagues'
              ? 'Лига Аналитиков'
              : tab === 'tournaments'
              ? 'Турниры'
              : 'Друзья'}
          </button>
        ))}
      </div>

      {/* Main Leaderboard Content */}
      <div className="flex-1 bg-[#06101c]/90 border border-white/10 rounded-2xl p-3 overflow-y-auto space-y-1.5 shadow-inner">
        {activeTab === 'leagues' && (
          <>
            <div className="flex items-center justify-between text-[10px] font-mono uppercase text-slate-400 px-3 py-1 border-b border-white/5">
              <span>Ранг & Игрок</span>
              <div className="flex gap-6">
                <span>Сценарий</span>
                <span>DQI Индекс</span>
              </div>
            </div>

            {LEAGUE_PLAYERS.map((player) => (
              <div
                key={player.id}
                className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                  player.isPlayer
                    ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200 ring-1 ring-cyan-400/50 shadow-md'
                    : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-6 font-mono font-black text-xs text-center ${
                      player.rank === 1
                        ? 'text-yellow-400'
                        : player.rank === 2
                        ? 'text-slate-300'
                        : player.rank === 3
                        ? 'text-amber-600'
                        : 'text-slate-500'
                    }`}
                  >
                    #{player.rank}
                  </span>

                  <span className="text-base">{player.avatar}</span>

                  <div>
                    <div className="text-xs font-black text-white flex items-center gap-1">
                      {player.name}
                      {player.isPlayer && (
                        <span className="text-[8px] bg-cyan-400 text-black px-1 rounded font-mono uppercase">
                          ВЫ
                        </span>
                      )}
                    </div>
                    <span className="text-[9px] text-slate-400 font-mono">
                      {player.badgeRu}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-right font-mono text-xs">
                  <span className="text-slate-400 text-[10px] hidden sm:inline">
                    {player.bestScenario}
                  </span>
                  <span className="font-black text-amber-300 text-sm">
                    {player.dqiScore}%
                  </span>
                </div>
              </div>
            ))}
          </>
        )}

        {activeTab === 'tournaments' && (
          <div className="p-3 space-y-3">
            <div className="bg-gradient-to-r from-red-950/60 to-[#1e0a14] border border-red-500/40 rounded-xl p-4 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-red-400 uppercase font-black tracking-wider flex items-center gap-1">
                  <Sparkles size={12} /> Специальный Турнир
                </span>
                <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                  <Clock size={11} /> 2д 14ч
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-black text-white uppercase mt-1">
                Неделя Бешеной Волатильности: Шок Ставок
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Все участники проходят 5 одинаковых кризисных сценариев. Очки начисляются за сохранение капитала и аргументацию.
              </p>
              <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-300">
                  Призовой фонд: 50 000 🪙 + Легендарная Карта
                </span>
                <button
                  onClick={() => {
                    playSound('play');
                    setCurrentScreen('battler');
                  }}
                  className="px-4 py-1.5 rounded-lg bg-red-500 hover:bg-red-400 text-black font-black text-xs uppercase cursor-pointer"
                >
                  Участвовать
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'friends' && (
          <div className="p-4 text-center text-xs text-slate-400">
            <ShieldCheck size={28} className="mx-auto text-cyan-400 mb-2" />
            <p className="font-bold text-white">Рейтинг друзей по DQI</p>
            <p className="mt-1">Сравнивайте точность решений и делитесь протоколами в гильдии.</p>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-2 text-[10px] text-center text-slate-400 font-mono">
        ⚖️ Принцип Signal Arena: побеждает тот, кто следует системе, а не тот, кому повезло угадать зеленую свечу.
      </div>
    </div>
  );
};
