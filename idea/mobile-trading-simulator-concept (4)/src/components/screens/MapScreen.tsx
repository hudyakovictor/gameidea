import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { WORLD_MAP_NODES } from '../../data/social';
import { WorldMapNode } from '../../types/game';
import {
  Star,
  Lock,
  Play,
  Award,
  Sparkles,
  Swords,
  Puzzle,
  BookOpen,
} from 'lucide-react';

export const MapScreen: React.FC = () => {
  const { setCurrentScreen, playSound } = useGame();
  const [selectedNode, setSelectedNode] = useState<WorldMapNode>(
    WORLD_MAP_NODES.find((n) => n.status === 'active') || WORLD_MAP_NODES[0]
  );

  const completedCount = WORLD_MAP_NODES.filter(
    (n) => n.status === 'completed'
  ).length;

  return (
    <div className="h-full flex flex-col justify-between overflow-y-auto p-3 sm:p-4 max-w-5xl mx-auto w-full select-none pb-2">
      {/* Header Info */}
      <div className="flex items-center justify-between bg-[#081524] border border-cyan-500/30 p-3 rounded-xl shadow-lg">
        <div>
          <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles size={12} className="text-amber-300" />
            Хроника финансовых кризисов
          </div>
          <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-tight">
            Карта Мира: Архивы Рынка
          </h2>
        </div>

        <div className="text-right">
          <div className="text-[10px] text-slate-400 font-mono">Исследовано:</div>
          <div className="text-sm font-black text-cyan-300">
            {completedCount} / {WORLD_MAP_NODES.length} Эпох
          </div>
        </div>
      </div>

      {/* Interactive World Map Node Canvas */}
      <div className="my-3 relative min-h-[300px] flex-1 bg-gradient-to-b from-[#05101d] via-[#07172b] to-[#040c16] rounded-2xl border border-white/10 p-4 overflow-hidden flex items-center justify-center shadow-2xl">
        {/* Background Grid & Star Map */}
        <div
          className="absolute inset-0 opacity-15 bg-[radial-gradient(#69e7df_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"
        />

        {/* Nodes Timeline Grid */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 w-full max-w-3xl">
          {WORLD_MAP_NODES.map((node) => {
            const isSelected = selectedNode.id === node.id;
            const isLocked = node.status === 'locked';
            const isCompleted = node.status === 'completed';

            return (
              <button
                key={node.id}
                disabled={isLocked}
                onClick={() => {
                  playSound('click');
                  setSelectedNode(node);
                }}
                className={`relative p-3 rounded-xl border text-left transition-all duration-200 ${
                  isSelected
                    ? 'scale-105 ring-2 ring-cyan-300 bg-cyan-950/80 border-cyan-400 shadow-xl shadow-cyan-950/80'
                    : isCompleted
                    ? 'bg-[#0a201b]/80 border-emerald-500/40 hover:border-emerald-400'
                    : isLocked
                    ? 'bg-black/40 border-white/5 opacity-40 cursor-not-allowed'
                    : 'bg-[#0f1d30]/80 border-amber-500/40 hover:border-amber-400'
                }`}
              >
                {/* Status Indicator Icon */}
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-black px-1.5 py-0.5 rounded uppercase font-mono bg-black/50 text-slate-300 border border-white/10">
                    {node.year}
                  </span>

                  <div className="flex items-center">
                    {isLocked ? (
                      <Lock size={14} className="text-slate-500" />
                    ) : (
                      <div className="flex gap-0.5">
                        {Array.from({ length: node.maxStars }).map((_, idx) => (
                          <Star
                            key={idx}
                            size={11}
                            className={
                              idx < node.stars
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-600'
                            }
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Node Title */}
                <div className="text-xs sm:text-sm font-black text-white leading-snug">
                  {node.titleRu}
                </div>
                <div className="text-[9px] text-slate-400 mt-0.5 line-clamp-1">
                  {node.subtitleRu}
                </div>

                {/* Node Type Tag */}
                <div className="mt-2 pt-1.5 border-t border-white/10 flex items-center gap-1 text-[9px] font-mono text-cyan-300">
                  {node.type === 'boss' && <Swords size={11} className="text-red-400" />}
                  {node.type === 'puzzle' && <Puzzle size={11} className="text-emerald-400" />}
                  {node.type === 'story' && <BookOpen size={11} className="text-purple-400" />}
                  <span className="uppercase">
                    {node.type === 'boss' ? 'Босс-сценарий' : node.type === 'puzzle' ? 'Паттерны' : 'Хроника'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Node Action Card */}
      <div className="bg-[#091522] border border-cyan-500/30 p-3 sm:p-4 rounded-xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-black text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/30">
              {selectedNode.year}
            </span>
            <h3 className="text-sm sm:text-base font-black text-white uppercase">
              {selectedNode.titleRu}
            </h3>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            {selectedNode.subtitleRu}
          </p>
          <div className="text-[10px] text-amber-300/90 font-mono mt-1 flex items-center gap-1">
            <Award size={12} /> Награда: {selectedNode.rewardsRu}
          </div>
        </div>

        <button
          onClick={() => {
            playSound('play');
            if (selectedNode.type === 'boss') setCurrentScreen('battler');
            else if (selectedNode.type === 'puzzle') setCurrentScreen('puzzle');
            else setCurrentScreen('story');
          }}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 text-black font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-cyan-500/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Play size={15} className="fill-current" />
          <span>Начать миссию</span>
        </button>
      </div>
    </div>
  );
};
