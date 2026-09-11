import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import {
  RotateCcw,
  AlertTriangle,
  Brain,
  Sparkles,
  ArrowRight,
  Filter,
} from 'lucide-react';

export const JournalScreen: React.FC = () => {
  const { mistakeJournal, setCurrentScreen, playSound } = useGame();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'risk' | 'fomo' | 'structure'>('all');

  return (
    <div className="h-full flex flex-col justify-between overflow-y-auto p-3 sm:p-4 max-w-5xl mx-auto w-full select-none pb-2">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#170a1a] via-[#240e28] to-[#140816] border border-pink-500/40 rounded-2xl p-3.5 sm:p-4 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-600 to-purple-400 p-0.5 shadow-lg shadow-pink-950/60 flex-shrink-0 flex items-center justify-center">
            <div className="w-full h-full bg-[#06101c] rounded-2xl flex items-center justify-center text-pink-300">
              <Brain size={24} />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-pink-300 uppercase tracking-widest bg-pink-950/80 px-2 py-0.5 rounded border border-pink-500/30">
                Интервальное Повторение & Разбор Ошибок
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {mistakeJournal.length} записей
              </span>
            </div>
            <h2 className="text-sm sm:text-base font-black text-white uppercase mt-0.5">
              Журнал Ментальных Ошибок & Рефлексии
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              «Трейдер учится не на удачных сделках, а на систематическом разборе своих когнитивных искажений.»
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            playSound('play');
            setCurrentScreen('puzzle');
          }}
          className="w-full sm:w-auto px-4 py-2 rounded-xl bg-pink-500 hover:bg-pink-400 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-all"
        >
          <RotateCcw size={14} />
          <span>Тренировать слабые места</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 my-2.5">
        <Filter size={14} className="text-slate-400 mr-1" />
        {[
          { id: 'all', label: 'Все ошибки' },
          { id: 'risk', label: 'Риск & Плечи' },
          { id: 'fomo', label: 'FOMO & Спешка' },
          { id: 'structure', label: 'Сломы структуры' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              playSound('click');
              setSelectedFilter(tab.id as typeof selectedFilter);
            }}
            className={`px-3 py-1 rounded-xl text-xs font-bold uppercase transition-all ${
              selectedFilter === tab.id
                ? 'bg-pink-500 text-black shadow-md shadow-pink-500/30'
                : 'bg-white/5 text-slate-400 hover:bg-white/10 border border-white/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Mistake Cards Feed */}
      <div className="my-2 flex-1 bg-[#06101c]/90 border border-white/10 rounded-2xl p-3 sm:p-4 overflow-y-auto space-y-3 shadow-inner">
        {mistakeJournal.map((entry) => (
          <div
            key={entry.id}
            className="p-3.5 rounded-xl bg-[#0d1624] border border-white/10 hover:border-pink-500/40 transition-all shadow-md flex flex-col justify-between gap-2.5"
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <div className="flex items-center gap-2">
                <AlertTriangle size={15} className="text-amber-400" />
                <span className="text-xs font-black text-white uppercase">
                  {entry.scenarioTitleRu}
                </span>
                <span className="text-[9px] font-mono bg-red-950 text-red-300 px-1.5 py-0.2 rounded border border-red-500/40">
                  {entry.errorTypeRu}
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-500">{entry.date}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-red-950/30 border border-red-500/20 text-red-200">
                <span className="text-[9px] font-mono uppercase text-red-400 font-bold block mb-0.5">
                  ❌ Что было сделано (Ошибка):
                </span>
                {entry.wrongChoiceRu}
              </div>

              <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-500/20 text-emerald-200">
                <span className="text-[9px] font-mono uppercase text-emerald-400 font-bold block mb-0.5">
                  ✅ Как требовал протокол (Система):
                </span>
                {entry.correctChoiceRu}
              </div>
            </div>

            <div className="pt-2 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="text-xs text-cyan-300 font-mono flex items-center gap-1.5">
                <Sparkles size={13} className="text-amber-300" />
                <span>{entry.remedyRuleRu}</span>
              </div>

              <button
                onClick={() => {
                  playSound('play');
                  setCurrentScreen('battler');
                }}
                className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-[10px] font-bold uppercase flex items-center gap-1 border border-white/10"
              >
                <span>Пройти заново</span>
                <ArrowRight size={11} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
