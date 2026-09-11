import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import {
  BookOpen,
  X,
  RotateCcw,
  BarChart3,
  Layers,
  Brain,
  Shield,
  CheckCircle2,
  XCircle,
  Sparkles,
} from 'lucide-react';

export const ConceptGDDModal: React.FC = () => {
  const { conceptModalOpen, setConceptModalOpen, playSound } = useGame();
  const [activeTab, setActiveTab] = useState<'loop' | 'progression' | 'meta' | 'learning' | 'notTerminal' | 'cards'>('loop');

  if (!conceptModalOpen) return null;

  const handleClose = () => {
    playSound('click');
    setConceptModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 animate-fadeIn select-none">
      <div className="bg-[#091522] border border-cyan-400/40 rounded-2xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl relative max-h-[90vh] flex flex-col justify-between overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <BookOpen size={18} className="text-cyan-300" />
            <div>
              <h2 className="text-sm sm:text-base font-black text-white uppercase tracking-tight">
                Геймдизайн Концепт: Signal Arena
              </h2>
              <p className="text-[10px] font-mono text-cyan-400">
                Simulation + Puzzle + Card Battler + Narrative + Social
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-white border border-white/10"
          >
            <X size={16} />
          </button>
        </div>

        {/* Tab Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-2.5 border-b border-white/5">
          {[
            { id: 'loop', label: 'Core Loop', icon: RotateCcw },
            { id: 'progression', label: 'Прогрессия', icon: BarChart3 },
            { id: 'meta', label: 'Мета-игра', icon: Layers },
            { id: 'learning', label: 'Обучение (Duolingo)', icon: Brain },
            { id: 'notTerminal', label: 'Не Терминал!', icon: Shield },
            { id: 'cards', label: 'Карты & Боссы', icon: Sparkles },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  playSound('click');
                  setActiveTab(tab.id as typeof activeTab);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === tab.id
                    ? 'bg-cyan-400 text-black shadow-md shadow-cyan-400/30'
                    : 'bg-white/5 text-slate-400 hover:bg-white/10 border border-white/5'
                }`}
              >
                <Icon size={13} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div className="my-3 flex-1 overflow-y-auto pr-1 text-xs text-slate-300 space-y-3 leading-relaxed">
          {activeTab === 'loop' && (
            <div className="space-y-3">
              <div className="p-3 bg-cyan-950/40 border border-cyan-500/30 rounded-xl">
                <h3 className="font-black text-white text-sm uppercase">
                  1. Core Loop: Сессия 4–7 минут
                </h3>
                <p className="mt-1 text-slate-300 text-xs">
                  Игрок погружается в конкретную рыночную ситуацию без бесконечного залипания в графики.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-center text-[11px] font-mono font-bold">
                <div className="p-2.5 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-cyan-300">01. КОНТЕКСТ</div>
                  <div className="text-[9px] text-slate-400 mt-1 font-normal">Сводка кризиса & шум</div>
                </div>
                <div className="p-2.5 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-emerald-300">02. ПАЗЛ</div>
                  <div className="text-[9px] text-slate-400 mt-1 font-normal">Поиск ловушки</div>
                </div>
                <div className="p-2.5 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-amber-300">03. КАРТЫ</div>
                  <div className="text-[9px] text-slate-400 mt-1 font-normal">Битва протоколов</div>
                </div>
                <div className="p-2.5 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-purple-300">04. ВЫБОР</div>
                  <div className="text-[9px] text-slate-400 mt-1 font-normal">Сюжетная дилемма</div>
                </div>
                <div className="p-2.5 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-cyan-300">05. РАЗБОР</div>
                  <div className="text-[9px] text-slate-400 mt-1 font-normal">DQI-оценка логики</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'progression' && (
            <div className="space-y-3">
              <div className="p-3 bg-amber-950/40 border border-amber-500/30 rounded-xl">
                <h3 className="font-black text-white text-sm uppercase">
                  2. Прогрессия: RPG Профиль Аналитика
                </h3>
                <p className="mt-1 text-slate-300">
                  Прокачивается 5 ключевых ментальных навыков трейдера вместо виртуального баланса долларов.
                </p>
              </div>
              <ul className="space-y-1.5 list-disc pl-4 text-xs">
                <li><strong>Анализ структуры:</strong> умение фильтровать шум от истинных сигналов.</li>
                <li><strong>Управление рисками:</strong> жесткая математика Risk-to-Reward и лимиты убытка.</li>
                <li><strong>Дисциплина:</strong> способность не совершать импульсивных действий.</li>
                <li><strong>Психология:</strong> иммунитет к синдрому упущенной выгоды (FOMO) и тильту.</li>
                <li><strong>Макро-стратегия:</strong> понимание денежно-кредитной политики центробанков.</li>
              </ul>
            </div>
          )}

          {activeTab === 'meta' && (
            <div className="space-y-3">
              <div className="p-3 bg-purple-950/40 border border-purple-500/30 rounded-xl">
                <h3 className="font-black text-white text-sm uppercase">
                  3. Мета-игра & Социальный соревновательный контур
                </h3>
                <p className="mt-1 text-slate-300">
                  Коллекционирование карт-принципов, исследование Хроники кризисов и асинхронные турниры.
                </p>
              </div>
              <p>
                В турнирах все участники получают одинаковые вводные данные. Рейтинг в таблице формируется на 100% из <strong>Decision Quality Index (DQI)</strong>, что полностью исключает элемент случайной удачи.
              </p>
            </div>
          )}

          {activeTab === 'learning' && (
            <div className="space-y-3">
              <div className="p-3 bg-cyan-950/40 border border-cyan-500/30 rounded-xl">
                <h3 className="font-black text-white text-sm uppercase">
                  4. Обучение: Duolingo-структура + Into the Breach
                </h3>
                <p className="mt-1 text-slate-300">
                  Микроуроки с маскотом Совой-наставником. Теория подается порционно ровно в момент совершения ошибки.
                </p>
              </div>
              <p>
                Игрок видит прозрачные последствия каждого действия: карта наглядно показывает, какую угрозу она нейтрализует и почему.
              </p>
            </div>
          )}

          {activeTab === 'notTerminal' && (
            <div className="space-y-3">
              <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-xl">
                <h3 className="font-black text-white text-sm uppercase text-red-300">
                  5. Принципиальный отказ от «Терминала»
                </h3>
                <p className="mt-1 text-slate-300">
                  Игра сознательно устраняет механики, формирующие лудоманию и иллюзию быстрого обогащения.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 bg-red-950/30 border border-red-500/30 rounded-xl space-y-1">
                  <div className="text-red-400 font-bold uppercase flex items-center gap-1">
                    <XCircle size={13} /> ЧЕГО НЕТ В ИГРЕ
                  </div>
                  <div className="text-[11px] text-slate-300">• Кнопок Buy / Sell</div>
                  <div className="text-[11px] text-slate-300">• Кредитных плеч 50x/100x</div>
                  <div className="text-[11px] text-slate-300">• Угадывания направления свечи</div>
                  <div className="text-[11px] text-slate-300">• Оценки по балансу $ PnL</div>
                </div>

                <div className="p-2.5 bg-emerald-950/30 border border-emerald-500/30 rounded-xl space-y-1">
                  <div className="text-emerald-400 font-bold uppercase flex items-center gap-1">
                    <CheckCircle2 size={13} /> ЧТО ЕСТЬ В ИГРЕ
                  </div>
                  <div className="text-[11px] text-slate-300">• Чтение свидетельств рынка</div>
                  <div className="text-[11px] text-slate-300">• Проверка условий отмены идеи</div>
                  <div className="text-[11px] text-slate-300">• Контроль риска до входа</div>
                  <div className="text-[11px] text-slate-300">• Оценка качества мышления (DQI)</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'cards' && (
            <div className="space-y-3">
              <div className="p-3 bg-purple-950/40 border border-purple-500/30 rounded-xl">
                <h3 className="font-black text-white text-sm uppercase">
                  6. Карты и Рыночные Угрозы
                </h3>
                <p className="mt-1 text-slate-300">
                  4 архетипа карт и 3 ключевых игровых босса.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 bg-purple-950/50 border border-purple-500/40 rounded-lg">
                  <strong className="text-purple-300 uppercase">Протоколы (Purple):</strong>
                  <div className="text-slate-300 mt-0.5">Только факты, Карантин шума, Пауза после стопа.</div>
                </div>
                <div className="p-2 bg-emerald-950/50 border border-emerald-500/40 rounded-lg">
                  <strong className="text-emerald-300 uppercase">Решения (Green):</strong>
                  <div className="text-slate-300 mt-0.5">Не входить — тоже решение, Не усреднять убыток.</div>
                </div>
                <div className="p-2 bg-cyan-950/50 border border-cyan-500/40 rounded-lg">
                  <strong className="text-cyan-300 uppercase">Чтение (Cyan):</strong>
                  <div className="text-slate-300 mt-0.5">Структура рынка, Объемы и ликвидность, Он-чейн.</div>
                </div>
                <div className="p-2 bg-amber-950/50 border border-amber-500/40 rounded-lg">
                  <strong className="text-amber-300 uppercase">Защита (Gold):</strong>
                  <div className="text-slate-300 mt-0.5">Новость — не сигнал, Дневной лимит риска.</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-white/10 flex justify-end">
          <button
            onClick={handleClose}
            className="px-6 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-black text-xs uppercase cursor-pointer"
          >
            Понятно, в игру!
          </button>
        </div>
      </div>
    </div>
  );
};
