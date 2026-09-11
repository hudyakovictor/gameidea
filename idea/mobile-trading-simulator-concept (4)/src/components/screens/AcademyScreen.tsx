import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { ACADEMY_LESSONS } from '../../data/academy';
import { AcademyLesson } from '../../types/game';
import {
  CheckCircle2,
  Lock,
  Star,
  Play,
  Sparkles,
  HelpCircle,
  X,
  ChevronRight,
} from 'lucide-react';

export const AcademyScreen: React.FC = () => {
  const { playSound, recordScenarioResult } = useGame();
  const [selectedLesson, setSelectedLesson] = useState<AcademyLesson | null>(null);
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const handleStartLesson = (lesson: AcademyLesson) => {
    if (lesson.status === 'locked') {
      playSound('error');
      return;
    }
    playSound('select');
    setSelectedLesson(lesson);
    setQuizIndex(0);
    setSelectedOption(null);
    setQuizSubmitted(false);
  };

  const handleSelectOption = (idx: number) => {
    if (quizSubmitted) return;
    playSound('click');
    setSelectedOption(idx);
  };

  const handleVerifyAnswer = () => {
    if (selectedOption === null || !selectedLesson) return;
    setQuizSubmitted(true);
    const quiz = selectedLesson.quiz[quizIndex];
    const isCorrect = quiz.options[selectedOption].isCorrect;
    if (isCorrect) {
      playSound('success');
    } else {
      playSound('error');
    }
  };

  const handleFinishQuiz = () => {
    if (!selectedLesson) return;
    const isSuccess = selectedLesson.quiz[quizIndex]?.options[selectedOption || 0]?.isCorrect;
    
    recordScenarioResult(
      isSuccess ? 95 : 65,
      selectedLesson.xpReward,
      selectedLesson.coinReward,
      `Урок: ${selectedLesson.titleRu}`,
      [
        { labelRu: 'Прошел теоретический микроурок', isPositive: true },
        { labelRu: 'Ответил на контрольный вопрос Совы-наставника', isPositive: isSuccess },
      ],
      selectedLesson.unlockedCardId
    );
    setSelectedLesson(null);
  };

  return (
    <div className="h-full flex flex-col justify-between overflow-y-auto p-3 sm:p-4 max-w-5xl mx-auto w-full select-none pb-2">
      {/* Mentor Owl Banner */}
      <div className="bg-gradient-to-r from-[#091b29] via-[#0b2438] to-[#071520] border border-cyan-500/40 rounded-2xl p-3 sm:p-4 shadow-xl flex items-center gap-3 sm:gap-4">
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-cyan-400 shadow-lg shadow-cyan-950/60 flex-shrink-0">
          <img
            src="/images/owl-mentor.jpg"
            alt="Сова-наставник"
            className="w-full h-full object-cover"
          />
          <span className="absolute bottom-0 inset-x-0 bg-cyan-950/90 text-cyan-300 font-black text-[7px] text-center uppercase py-0.5 border-t border-cyan-400/40">
            Наставник
          </span>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-cyan-300 uppercase tracking-widest bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
              Обучение в стиле Duolingo
            </span>
            <span className="flex items-center text-[10px] text-amber-300 font-mono">
              <Sparkles size={11} className="mr-0.5" /> 5 Глав Мастерства
            </span>
          </div>
          <h2 className="text-sm sm:text-base font-black text-white uppercase mt-0.5">
            Академия Мышления Трейдера
          </h2>
          <p className="text-xs text-slate-300 mt-1 italic leading-relaxed">
            «Короткие 3-минутные уроки. Реальные рыночные навыки. Мы не учим угадывать свечи — мы учим понимать логику аукциона.»
          </p>
        </div>
      </div>

      {/* Duolingo-style Linear Skill Tree */}
      <div className="my-3 flex-1 bg-[#06101c]/80 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center space-y-3 relative overflow-hidden shadow-inner">
        {/* Decorative Dotted Center Guide Line */}
        <div className="absolute top-4 bottom-4 w-0.5 bg-dashed border-l-2 border-dashed border-cyan-500/20 pointer-events-none" />

        {ACADEMY_LESSONS.map((lesson, idx) => {
          const isCompleted = lesson.status === 'completed';
          const isActive = lesson.status === 'active';
          const isLocked = lesson.status === 'locked';

          return (
            <div
              key={lesson.id}
              className={`relative z-10 w-full max-w-xl p-3 sm:p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-950/90 to-[#0c2236] border-cyan-400 shadow-xl shadow-cyan-950/80 scale-[1.02]'
                  : isCompleted
                  ? 'bg-[#0a1e17]/80 border-emerald-500/40'
                  : 'bg-black/40 border-white/5 opacity-45'
              }`}
            >
              {/* Left: Circle Number / Check */}
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0 border ${
                  isCompleted
                    ? 'bg-emerald-500 text-black border-emerald-300 shadow-md shadow-emerald-500/30'
                    : isActive
                    ? 'bg-cyan-400 text-black border-cyan-200 shadow-md shadow-cyan-400/40 animate-pulse'
                    : 'bg-white/5 text-slate-500 border-white/10'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 size={20} className="stroke-[2.5]" />
                ) : isLocked ? (
                  <Lock size={16} />
                ) : (
                  <span>0{idx + 1}</span>
                )}
              </div>

              {/* Center: Title & Description */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs sm:text-sm font-black text-white truncate">
                    {lesson.titleRu}
                  </h3>
                  {isCompleted && (
                    <div className="flex text-amber-400">
                      {Array.from({ length: lesson.stars }).map((_, i) => (
                        <Star key={i} size={11} className="fill-current" />
                      ))}
                    </div>
                  )}
                </div>
                <p className="text-[10px] sm:text-xs text-slate-400 truncate mt-0.5">
                  {lesson.descriptionRu}
                </p>
              </div>

              {/* Right: Action Button */}
              <div>
                {isCompleted ? (
                  <button
                    onClick={() => handleStartLesson(lesson)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold uppercase hover:bg-emerald-900/60 transition-colors"
                  >
                    Пройдено
                  </button>
                ) : isActive ? (
                  <button
                    onClick={() => handleStartLesson(lesson)}
                    className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-cyan-400 to-emerald-400 text-black font-black text-xs uppercase tracking-wider shadow-md shadow-cyan-400/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Play size={12} className="fill-current" />
                    <span>Начать</span>
                  </button>
                ) : (
                  <span className="text-[10px] text-slate-500 font-mono px-2 py-1 bg-white/5 rounded border border-white/5 flex items-center gap-1">
                    <Lock size={10} /> Ур. {idx * 2 + 1}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Lesson Modal Popup */}
      {selectedLesson && selectedLesson.quiz.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 animate-fadeIn">
          <div className="bg-[#091522] border border-cyan-400/40 rounded-2xl max-w-lg w-full p-4 sm:p-5 shadow-2xl relative">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <HelpCircle size={16} className="text-cyan-300" />
                <span className="text-xs font-black uppercase tracking-wider text-white">
                  {selectedLesson.titleRu}
                </span>
              </div>
              <button
                onClick={() => setSelectedLesson(null)}
                className="p-1 rounded bg-white/5 text-slate-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            {/* Mentor Tip Box */}
            <div className="my-3 bg-cyan-950/40 border border-cyan-500/30 rounded-xl p-3 flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-cyan-300 flex-shrink-0">
                <img src="/images/owl-mentor.jpg" alt="Owl" className="w-full h-full object-cover" />
              </div>
              <p className="text-xs text-cyan-200 italic leading-snug">
                {selectedLesson.mentorQuoteRu}
              </p>
            </div>

            {/* Question */}
            <div className="my-3">
              <span className="text-[10px] font-mono uppercase text-slate-400">Контрольный вопрос:</span>
              <h4 className="text-sm font-black text-white mt-1 leading-snug">
                {selectedLesson.quiz[quizIndex].questionRu}
              </h4>
            </div>

            {/* Options List */}
            <div className="space-y-2 my-4">
              {selectedLesson.quiz[quizIndex].options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                let optStyle = 'bg-white/5 border-white/10 hover:border-cyan-400/50 text-slate-200';
                if (quizSubmitted) {
                  if (opt.isCorrect) {
                    optStyle = 'bg-emerald-950/80 border-emerald-400 text-emerald-200 ring-2 ring-emerald-400/50';
                  } else if (isSelected && !opt.isCorrect) {
                    optStyle = 'bg-red-950/80 border-red-400 text-red-200 ring-2 ring-red-400/50';
                  }
                } else if (isSelected) {
                  optStyle = 'bg-cyan-950/80 border-cyan-400 text-cyan-200 ring-2 ring-cyan-400/50';
                }

                return (
                  <button
                    key={idx}
                    disabled={quizSubmitted}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-start gap-2.5 cursor-pointer ${optStyle}`}
                  >
                    <span className="w-5 h-5 rounded-md bg-black/40 border border-white/20 flex items-center justify-center font-mono font-bold text-[10px] flex-shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="flex-1 leading-relaxed">{opt.textRu}</span>
                  </button>
                );
              })}
            </div>

            {/* Instant Feedback Message */}
            {quizSubmitted && (
              <div className="my-3 p-2.5 rounded-xl bg-black/50 border border-white/10 text-xs text-slate-300">
                💡 <strong>Разбор:</strong> {selectedLesson.quiz[quizIndex].options[selectedOption || 0].feedbackRu}
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between">
              <span className="text-[10px] font-mono text-amber-300">
                +{selectedLesson.xpReward} XP / +{selectedLesson.coinReward} 🪙
              </span>

              {!quizSubmitted ? (
                <button
                  disabled={selectedOption === null}
                  onClick={handleVerifyAnswer}
                  className={`px-5 py-2 rounded-xl font-black text-xs uppercase tracking-wider ${
                    selectedOption !== null
                      ? 'bg-cyan-400 text-black hover:bg-cyan-300 cursor-pointer'
                      : 'bg-white/10 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  Проверить ответ
                </button>
              ) : (
                <button
                  onClick={handleFinishQuiz}
                  className="px-5 py-2 rounded-xl bg-emerald-400 text-black font-black text-xs uppercase tracking-wider hover:bg-emerald-300 flex items-center gap-1 cursor-pointer"
                >
                  <span>Завершить урок</span>
                  <ChevronRight size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
