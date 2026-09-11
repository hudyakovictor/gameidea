import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { MARKET_PUZZLES } from '../../data/puzzles';
import {
  Lightbulb,
  Clock,
  HelpCircle,
  RotateCcw,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

export const PuzzleScreen: React.FC = () => {
  const { playSound, recordScenarioResult } = useGame();
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const puzzle = MARKET_PUZZLES[puzzleIndex] || MARKET_PUZZLES[0];

  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [timeLeft, setTimeLeft] = useState(28);
  const [isAnswered, setIsAnswered] = useState(false);

  useEffect(() => {
    if (isAnswered) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isAnswered]);

  const handleSelectOption = (id: string) => {
    if (isAnswered) return;
    setSelectedOptionId(id);
    setIsAnswered(true);

    const opt = puzzle.options.find((o) => o.id === id);
    if (opt?.isCorrect) {
      playSound('success');
    } else {
      playSound('error');
    }
  };

  const handleNextPuzzle = () => {
    const opt = puzzle.options.find((o) => o.id === selectedOptionId);
    const isCorrect = !!opt?.isCorrect;

    recordScenarioResult(
      isCorrect ? 94 : 58,
      140,
      280,
      `Пазл: ${puzzle.titleRu}`,
      [
        { labelRu: 'Проанализировал структуру свечей и объемы', isPositive: true },
        { labelRu: 'Определил ловушку ликвидности', isPositive: isCorrect },
      ],
      'read-volume-liquidity'
    );

    // Switch or reset
    setSelectedOptionId(null);
    setIsAnswered(false);
    setShowHint(false);
    setTimeLeft(28);
    setPuzzleIndex((prev) => (prev + 1) % MARKET_PUZZLES.length);
  };

  const handleReset = () => {
    playSound('click');
    setSelectedOptionId(null);
    setIsAnswered(false);
    setShowHint(false);
    setTimeLeft(28);
  };

  return (
    <div className="h-full flex flex-col justify-between overflow-y-auto p-3 sm:p-4 max-w-5xl mx-auto w-full select-none pb-2">
      {/* Header Info + Timer */}
      <div className="flex items-center justify-between bg-[#081524] border border-cyan-500/30 p-2.5 sm:p-3 rounded-xl shadow-lg">
        <div>
          <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-1">
            <Sparkles size={11} /> Паттерны: Уровень {puzzle.level}
          </span>
          <h2 className="text-xs sm:text-sm font-black text-white uppercase mt-0.5">
            {puzzle.titleRu}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          {/* Countdown Clock */}
          <div
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-mono text-xs font-bold border ${
              timeLeft < 10
                ? 'bg-red-950/80 border-red-500 text-red-300 animate-pulse'
                : 'bg-cyan-950/80 border-cyan-500/30 text-cyan-300'
            }`}
          >
            <Clock size={13} />
            <span>00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}</span>
          </div>

          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-white border border-white/10"
            title="Перезапустить пазл"
          >
            <RotateCcw size={15} />
          </button>
        </div>
      </div>

      {/* Main Pattern Canvas Simulation */}
      <div className="my-2.5 bg-gradient-to-b from-[#05111d] to-[#030a12] border border-white/10 rounded-2xl p-3 sm:p-4 relative overflow-hidden shadow-2xl flex-1 flex flex-col justify-between">
        {/* Top Asset Bar */}
        <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-black text-white">{puzzle.asset}</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300">
              {puzzle.timeframe}
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            Контекст: {puzzle.marketContextRu}
          </span>
        </div>

        {/* Interactive SVG Chart Graphic of Pattern */}
        <div className="relative my-3 h-40 sm:h-48 w-full flex items-center justify-center bg-black/40 rounded-xl border border-white/5 p-3 overflow-hidden">
          {/* Horizontal Level Line */}
          <div className="absolute top-10 inset-x-8 border-t-2 border-dashed border-red-500/70 z-10 flex justify-between px-2 text-[9px] font-mono text-red-400">
            <span>Зона Сопротивления / Пул Ликвидности ($68,500)</span>
            <span>Stop-Hunt Zone</span>
          </div>

          {/* Candlesticks & Ascending Support Line */}
          <svg className="w-full h-full" viewBox="0 0 500 160">
            {/* Ascending Trendline */}
            <line
              x1="60"
              y1="135"
              x2="380"
              y2="55"
              stroke="#10b981"
              strokeWidth="2.5"
              strokeDasharray="4,4"
            />

            {/* Candle 1 (Green) */}
            <line x1="80" y1="90" x2="80" y2="140" stroke="#10b981" strokeWidth="1.5" />
            <rect x="73" y="100" width="14" height="30" fill="#10b981" rx="1" />

            {/* Candle 2 (Red pullback) */}
            <line x1="130" y1="70" x2="130" y2="125" stroke="#ef4444" strokeWidth="1.5" />
            <rect x="123" y="75" width="14" height="40" fill="#ef4444" rx="1" />

            {/* Candle 3 (Green push) */}
            <line x1="180" y1="50" x2="180" y2="110" stroke="#10b981" strokeWidth="1.5" />
            <rect x="173" y="55" width="14" height="45" fill="#10b981" rx="1" />

            {/* Candle 4 (Higher low) */}
            <line x1="230" y1="65" x2="230" y2="105" stroke="#ef4444" strokeWidth="1.5" />
            <rect x="223" y="70" width="14" height="25" fill="#ef4444" rx="1" />

            {/* Candle 5 (Tight squeeze) */}
            <line x1="280" y1="50" x2="280" y2="85" stroke="#10b981" strokeWidth="1.5" />
            <rect x="273" y="55" width="14" height="25" fill="#10b981" rx="1" />

            {/* Candle 6 (Current SFP / Pinbar) */}
            <line x1="330" y1="35" x2="330" y2="80" stroke="#f59e0b" strokeWidth="2" />
            <rect x="323" y="55" width="14" height="18" fill="#f59e0b" rx="1" />

            {/* Target Reticle */}
            <circle cx="330" cy="55" r="16" fill="none" stroke="#69e7df" strokeWidth="1.5" strokeDasharray="3,3" className="animate-spin" />
          </svg>

          {/* Volume sub-histogram at bottom */}
          <div className="absolute bottom-1 inset-x-8 h-8 flex items-end justify-around opacity-40 pointer-events-none">
            <div className="w-3 bg-emerald-500 h-7" />
            <div className="w-3 bg-red-500 h-6" />
            <div className="w-3 bg-emerald-500 h-5" />
            <div className="w-3 bg-red-500 h-4" />
            <div className="w-3 bg-emerald-500 h-3" />
            <div className="w-3 bg-amber-400 h-2" />
          </div>
        </div>

        {/* Live Pattern Signals Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {puzzle.patternSignals.map((sig, idx) => (
            <div
              key={idx}
              className={`p-1.5 rounded-lg border text-[10px] ${
                sig.status === 'bullish'
                  ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                  : sig.status === 'bearish'
                  ? 'bg-red-950/40 border-red-500/30 text-red-300'
                  : sig.status === 'warning'
                  ? 'bg-amber-950/40 border-amber-500/30 text-amber-300'
                  : 'bg-white/5 border-white/10 text-slate-300'
              }`}
            >
              <div className="font-bold uppercase tracking-wider">{sig.labelRu}</div>
              <div className="text-[9px] text-slate-300 truncate mt-0.5">{sig.valueRu}</div>
            </div>
          ))}
        </div>

        {/* Hint Box Toggle */}
        <div className="mt-2">
          {showHint ? (
            <div className="p-2 rounded-xl bg-amber-950/60 border border-amber-500/40 text-xs text-amber-200 flex items-start gap-2">
              <Lightbulb size={16} className="text-amber-300 flex-shrink-0 mt-0.5" />
              <span>{puzzle.hintRu}</span>
            </div>
          ) : (
            <button
              onClick={() => {
                playSound('click');
                setShowHint(true);
              }}
              className="text-[11px] text-cyan-300 hover:text-cyan-200 flex items-center gap-1.5 font-bold"
            >
              <Lightbulb size={13} />
              <span>Показать тактическую подсказку</span>
            </button>
          )}
        </div>
      </div>

      {/* Question & A/B/C/D Choices */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <HelpCircle size={15} className="text-cyan-400" />
          <h3 className="text-xs sm:text-sm font-black text-white">
            {puzzle.questionRu}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {puzzle.options.map((opt, idx) => {
            const isSelected = selectedOptionId === opt.id;
            let btnClass =
              'bg-[#081522] border-white/10 hover:border-cyan-400/50 text-slate-200';

            if (isAnswered) {
              if (opt.isCorrect) {
                btnClass =
                  'bg-emerald-950 border-emerald-400 text-emerald-200 ring-2 ring-emerald-400/50 shadow-lg shadow-emerald-950/80';
              } else if (isSelected && !opt.isCorrect) {
                btnClass =
                  'bg-red-950 border-red-400 text-red-200 ring-2 ring-red-400/50';
              }
            } else if (isSelected) {
              btnClass = 'bg-cyan-950 border-cyan-400 text-cyan-200';
            }

            return (
              <button
                key={opt.id}
                disabled={isAnswered}
                onClick={() => handleSelectOption(opt.id)}
                className={`p-2.5 sm:p-3 rounded-xl border text-left text-xs transition-all flex items-start gap-2.5 cursor-pointer ${btnClass}`}
              >
                <span className="w-5 h-5 rounded-md bg-black/40 border border-white/20 flex items-center justify-center font-mono font-bold text-[10px] flex-shrink-0">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="flex-1 leading-snug">{opt.textRu}</span>
              </button>
            );
          })}
        </div>

        {/* Post-Answer Explanation Box & Next Button */}
        {isAnswered && (
          <div className="mt-2 p-3 rounded-xl bg-[#091728] border border-cyan-400/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fadeIn">
            <div className="text-xs text-slate-200 leading-snug">
              💡 <strong>Разбор ситуации:</strong>{' '}
              {puzzle.options.find((o) => o.id === selectedOptionId)?.explanationRu}
            </div>

            <button
              onClick={handleNextPuzzle}
              className="w-full sm:w-auto px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 hover:scale-105 active:scale-95 transition-all flex-shrink-0 cursor-pointer shadow-lg shadow-cyan-500/30"
            >
              <span>Продолжить</span>
              <ChevronRight size={15} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
