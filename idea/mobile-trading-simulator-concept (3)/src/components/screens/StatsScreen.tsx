import React from 'react';
import { useGame } from '../../context/GameContext';
import {
  TrendingUp,
  Target,
} from 'lucide-react';

export const StatsScreen: React.FC = () => {
  const { playerStats } = useGame();

  // Simulated trend data points
  const dqiHistory = [65, 68, 72, 70, 75, 78, 82, 80, 85, 84, 86, 89, 87, 92, 86];

  return (
    <div className="h-full flex flex-col justify-between overflow-y-auto p-3 sm:p-4 max-w-5xl mx-auto w-full select-none pb-2">
      {/* 3 Top Metric Cards */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <div className="bg-[#091522] border border-cyan-500/30 p-3 rounded-xl shadow-lg text-center">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Всего сыграно</div>
          <div className="text-xl sm:text-2xl font-black text-white font-mono mt-0.5">
            {playerStats.scenariosCompleted}
          </div>
          <div className="text-[9px] text-cyan-300 font-mono mt-0.5">сценариев</div>
        </div>

        <div className="bg-[#091522] border border-amber-500/30 p-3 rounded-xl shadow-lg text-center">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Средний DQI</div>
          <div className="text-xl sm:text-2xl font-black text-amber-300 font-mono mt-0.5">
            {playerStats.decisionQualityAvg}%
          </div>
          <div className="text-[9px] text-emerald-400 font-mono mt-0.5">+12% за неделю</div>
        </div>

        <div className="bg-[#091522] border border-emerald-500/30 p-3 rounded-xl shadow-lg text-center">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Лучший запуск</div>
          <div className="text-xl sm:text-2xl font-black text-emerald-300 font-mono mt-0.5">
            96%
          </div>
          <div className="text-[9px] text-slate-400 font-mono mt-0.5">Инфляция 2022</div>
        </div>
      </div>

      {/* DQI Growth Trend Chart Canvas */}
      <div className="my-3 bg-[#06101c]/90 border border-white/10 rounded-2xl p-4 shadow-xl flex-1 flex flex-col justify-between">
        <div className="flex items-center justify-between pb-2 border-b border-white/5">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-cyan-300" />
            <h3 className="text-xs sm:text-sm font-black text-white uppercase">
              Динамика Качества Решений (DQI Timeline)
            </h3>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            Последние 15 сессий
          </span>
        </div>

        {/* SVG Curve Chart */}
        <div className="my-3 h-36 sm:h-44 w-full flex items-center justify-center relative">
          <svg className="w-full h-full" viewBox="0 0 400 120" preserveAspectRatio="none">
            {/* Grid Lines */}
            <line x1="0" y1="30" x2="400" y2="30" stroke="rgba(255,255,255,0.05)" strokeDasharray="4,4" />
            <line x1="0" y1="60" x2="400" y2="60" stroke="rgba(255,255,255,0.05)" strokeDasharray="4,4" />
            <line x1="0" y1="90" x2="400" y2="90" stroke="rgba(255,255,255,0.05)" strokeDasharray="4,4" />

            {/* Gradient Area Fill */}
            <defs>
              <linearGradient id="dqiGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#69e7df" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#69e7df" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Path */}
            <path
              d={`M 0,${120 - dqiHistory[0]} ${dqiHistory
                .map((val, idx) => `L ${(idx / (dqiHistory.length - 1)) * 400},${120 - val}`)
                .join(' ')} L 400,120 L 0,120 Z`}
              fill="url(#dqiGradient)"
            />

            <path
              d={`M 0,${120 - dqiHistory[0]} ${dqiHistory
                .map((val, idx) => `L ${(idx / (dqiHistory.length - 1)) * 400},${120 - val}`)
                .join(' ')}`}
              fill="none"
              stroke="#69e7df"
              strokeWidth="2.5"
            />

            {/* Data Point Dots */}
            {dqiHistory.map((val, idx) => (
              <circle
                key={idx}
                cx={(idx / (dqiHistory.length - 1)) * 400}
                cy={120 - val}
                r="3"
                fill="#06101c"
                stroke="#69e7df"
                strokeWidth="2"
              />
            ))}
          </svg>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-2 border-t border-white/5">
          <span>Сессия 1: 65% (Новичок)</span>
          <span className="text-cyan-300 font-bold">Сессия 15: 86% (Стабильный Аналитик)</span>
        </div>
      </div>

      {/* Comparison with League Peers */}
      <div className="bg-[#091522] border border-white/10 rounded-xl p-3 shadow-md">
        <div className="text-xs font-black text-white uppercase mb-2 flex items-center gap-1.5">
          <Target size={14} className="text-amber-400" />
          Сравнение дисциплины с топ-игроками
        </div>

        <div className="space-y-2 text-xs">
          <div>
            <div className="flex justify-between font-mono text-[11px] mb-0.5">
              <span className="text-cyan-300 font-bold">Ты (NovaTrader)</span>
              <span className="text-cyan-300 font-bold">86% DQI</span>
            </div>
            <div className="w-full bg-black/60 h-2 rounded-full overflow-hidden">
              <div className="bg-cyan-400 h-full" style={{ width: '86%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between font-mono text-[11px] mb-0.5">
              <span className="text-slate-300">TradeZen (#2 Лиги)</span>
              <span className="text-amber-300">94% DQI</span>
            </div>
            <div className="w-full bg-black/60 h-2 rounded-full overflow-hidden">
              <div className="bg-amber-400 h-full" style={{ width: '94%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
