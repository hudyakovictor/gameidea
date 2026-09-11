import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { STORY_SCENARIOS } from '../../data/stories';
import {
  BookOpen,
  Newspaper,
  Shield,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';

export const StoryScreen: React.FC = () => {
  const { playSound, recordScenarioResult } = useGame();
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const story = STORY_SCENARIOS[scenarioIndex] || STORY_SCENARIOS[0];

  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [isDecided, setIsDecided] = useState(false);

  const handleMakeChoice = (choiceId: string) => {
    if (isDecided) return;
    setSelectedChoiceId(choiceId);
    setIsDecided(true);

    const choice = story.choices.find((c) => c.id === choiceId);
    if (choice?.isBestPractice) {
      playSound('success');
    } else {
      playSound('error');
    }
  };

  const handleProceed = () => {
    const choice = story.choices.find((c) => c.id === selectedChoiceId);
    if (!choice) return;

    recordScenarioResult(
      choice.dqiImpact,
      180,
      350,
      `Хроника: ${story.titleRu}`,
      [
        { labelRu: 'Проанализировал макро-контекст кризиса', isPositive: true },
        { labelRu: choice.titleRu, isPositive: choice.isBestPractice },
      ],
      choice.isBestPractice ? 'dec-staying-out' : undefined
    );

    // Reset or switch scenario
    setSelectedChoiceId(null);
    setIsDecided(false);
    setScenarioIndex((prev) => (prev + 1) % STORY_SCENARIOS.length);
  };

  const handleReset = () => {
    playSound('click');
    setSelectedChoiceId(null);
    setIsDecided(false);
  };

  const currentChoice = story.choices.find((c) => c.id === selectedChoiceId);

  return (
    <div className="h-full flex flex-col justify-between overflow-y-auto p-3 sm:p-4 max-w-5xl mx-auto w-full select-none pb-2">
      {/* Header Info */}
      <div className="flex items-center justify-between bg-[#081524] border border-purple-500/30 p-2.5 sm:p-3 rounded-xl shadow-lg">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30">
            <BookOpen size={18} />
          </div>
          <div>
            <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest">
              Сюжетная Хроника: {story.year} год
            </span>
            <h2 className="text-xs sm:text-sm font-black text-white uppercase mt-0.5">
              {story.titleRu}
            </h2>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-white border border-white/10"
          title="Сброс"
        >
          <RotateCcw size={15} />
        </button>
      </div>

      {/* Main Narrative Stage Box */}
      <div className="my-2.5 bg-gradient-to-b from-[#120822] via-[#0b0517] to-[#06030c] border border-purple-500/30 rounded-2xl p-4 sm:p-5 relative overflow-hidden shadow-2xl flex-1 flex flex-col justify-between">
        {/* News Flash Ticker */}
        <div className="bg-red-950/60 border border-red-500/40 rounded-xl p-2.5 flex items-start gap-2.5 shadow-inner">
          <Newspaper size={18} className="text-red-400 flex-shrink-0 mt-0.5 animate-pulse" />
          <div>
            <span className="text-[9px] font-mono text-red-300 uppercase font-black tracking-wider">
              ЭКСТРЕННАЯ МОЛНИЯ НОВОСТЕЙ:
            </span>
            <p className="text-xs font-mono text-red-200 mt-0.5 font-bold leading-tight">
              {story.newsFlashRu}
            </p>
          </div>
        </div>

        {/* Narrative Atmosphere Text */}
        <div className="my-3 text-xs sm:text-sm text-slate-200 leading-relaxed font-serif bg-black/40 p-3.5 rounded-xl border border-white/5">
          «{story.situationRu}»
        </div>

        {/* Macro Badges */}
        <div className="flex flex-wrap gap-1.5">
          {story.contextBadges.map((badge, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded-md bg-purple-950/70 border border-purple-500/30 text-[10px] font-mono text-purple-300 flex items-center gap-1"
            >
              <Shield size={10} /> {badge}
            </span>
          ))}
        </div>

        {/* Post-Choice Consequence Reveal */}
        {isDecided && currentChoice && (
          <div className="mt-3 p-3 rounded-xl bg-[#190d30] border border-purple-400/50 animate-fadeIn">
            <div className="flex items-center justify-between text-xs font-mono font-bold">
              <span className={currentChoice.isBestPractice ? 'text-emerald-300' : 'text-red-400'}>
                {currentChoice.isBestPractice ? '✅ Грамотное тактическое решение' : '❌ Высокий системный риск'}
              </span>
              <span className="text-amber-300">
                Качество решения: {currentChoice.dqiImpact}/100 DQI
              </span>
            </div>
            <p className="text-xs text-slate-200 mt-1 leading-snug">
              {currentChoice.outcomeRu}
            </p>
            <div className="mt-1.5 text-[11px] text-cyan-300 italic font-mono">
              💡 Урок кризиса: {currentChoice.lessonRu}
            </div>
          </div>
        )}
      </div>

      {/* Choices List / Continue CTA */}
      <div className="space-y-2">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Как поступит твой аналитический комитет?
        </div>

        <div className="space-y-2">
          {story.choices.map((choice, idx) => {
            const isSelected = selectedChoiceId === choice.id;
            let choiceClass =
              'bg-[#081522] border-white/10 hover:border-purple-400/50 text-slate-200';

            if (isDecided) {
              if (choice.isBestPractice) {
                choiceClass =
                  'bg-emerald-950/80 border-emerald-400 text-emerald-200 ring-2 ring-emerald-400/50';
              } else if (isSelected && !choice.isBestPractice) {
                choiceClass =
                  'bg-red-950/80 border-red-400 text-red-200 ring-2 ring-red-400/50';
              }
            } else if (isSelected) {
              choiceClass = 'bg-purple-950 border-purple-400 text-purple-200';
            }

            return (
              <button
                key={choice.id}
                disabled={isDecided}
                onClick={() => handleMakeChoice(choice.id)}
                className={`w-full p-2.5 sm:p-3 rounded-xl border text-left text-xs transition-all flex items-start gap-2.5 cursor-pointer ${choiceClass}`}
              >
                <span className="w-5 h-5 rounded-md bg-black/40 border border-white/20 flex items-center justify-center font-mono font-bold text-[10px] flex-shrink-0 mt-0.5">
                  {String.fromCharCode(65 + idx)}
                </span>
                <div className="flex-1">
                  <div className="font-bold text-white text-xs">{choice.titleRu}</div>
                  <div className="text-[10px] sm:text-xs text-slate-400 mt-0.5 leading-snug">
                    {choice.descriptionRu}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        {isDecided && (
          <div className="pt-2 flex justify-end">
            <button
              onClick={handleProceed}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 hover:scale-105 active:scale-95 transition-all shadow-lg cursor-pointer"
            >
              <span>Зафиксировать опыт и продолжить</span>
              <ChevronRight size={15} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
