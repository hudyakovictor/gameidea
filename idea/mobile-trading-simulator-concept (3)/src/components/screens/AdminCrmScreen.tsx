import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { AI_SOLO_FOUNDER_AGENTS, AIAgentDefinition } from '../../data/aiAgentOps';
import {
  BrainCircuit,
  Bot,
  Activity,
  ShieldAlert,
  Sparkles,
  RefreshCw,
  Coins,
  Cpu,
  Lock,
  Layers,
  Database,
  Play,
} from 'lucide-react';

export const AdminCrmScreen: React.FC = () => {
  const { playSound } = useGame();
  const [activeTab, setActiveTab] = useState<'agents' | 'telemetry' | 'contentCms' | 'economySim' | 'security'>('agents');
  const [agents, setAgents] = useState<AIAgentDefinition[]>(AI_SOLO_FOUNDER_AGENTS);
  const [selectedAgent, setSelectedAgent] = useState<AIAgentDefinition>(AI_SOLO_FOUNDER_AGENTS[0]);
  const [isSimulatingAgent, setIsSimulatingAgent] = useState(false);
  const [aiOutputLog, setAiOutputLog] = useState<string>('');

  // Global AI Model Selector
  const [selectedGlobalModel, setSelectedGlobalModel] = useState<string>('Claude 3.7 Sonnet (Reasoning Enabled)');

  const handleRunAgentAction = (agent: AIAgentDefinition) => {
    playSound('play');
    setIsSimulatingAgent(true);
    setAiOutputLog(`[AI Dispatcher] Подключение к ${agent.activeModel} через защищенный шлюз mTLS...\n[Prompt Execution] Обработка задачи: ${agent.codename}...\n`);

    setTimeout(() => {
      setIsSimulatingAgent(false);
      playSound('success');
      setAiOutputLog((prev) => 
        prev + `[Response 200 OK] (Latency: ${agent.avgLatencyMs}ms)\n✅ Результат: ${agent.lastActionRu}\n✨ Верификация инвариантов: 100% валидно.\n💾 Зафиксировано в SQLite + Drizzle ORM.`
      );
      setAgents((prev) =>
        prev.map((a) => (a.id === agent.id ? { ...a, callsToday: a.callsToday + 1 } : a))
      );
    }, 900);
  };

  return (
    <div className="h-full flex flex-col justify-between overflow-y-auto p-3 sm:p-4 max-w-6xl mx-auto w-full select-none pb-2 font-sans">
      {/* Admin CRM Header with Security Isolated Flag */}
      <div className="bg-gradient-to-r from-[#0b1b2b] via-[#0d2238] to-[#081524] border border-cyan-500/40 p-3 sm:p-4 rounded-2xl shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-500 p-0.5 shadow-lg shadow-cyan-950/80 flex items-center justify-center">
            <div className="w-full h-full bg-[#06101c] rounded-xl flex items-center justify-center text-cyan-300">
              <Cpu size={24} />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-cyan-300 uppercase tracking-widest bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/40">
                ADMIN CRM // SOLO FOUNDER UNICORN OS
              </span>
              <span className="text-[9px] font-mono bg-emerald-950 text-emerald-300 px-1.5 py-0.2 rounded border border-emerald-500/40 flex items-center gap-1 font-bold">
                <Lock size={10} /> 2-TIER ISOLATED SERVER
              </span>
            </div>
            <h2 className="text-sm sm:text-base font-black text-white uppercase mt-0.5">
              Центр Управления ИИ-Агентами & Телеметрией
            </h2>
          </div>
        </div>

        {/* Global LLM Switcher */}
        <div className="flex items-center gap-2 bg-black/50 border border-white/10 px-2.5 py-1.5 rounded-xl">
          <Bot size={15} className="text-cyan-300" />
          <select
            value={selectedGlobalModel}
            onChange={(e) => {
              playSound('click');
              setSelectedGlobalModel(e.target.value);
            }}
            className="bg-transparent text-xs text-white font-mono font-bold focus:outline-none cursor-pointer"
          >
            <option value="Claude 3.7 Sonnet (Reasoning Enabled)" className="bg-[#091522] text-white">Claude 3.7 Sonnet (Reasoning)</option>
            <option value="GPT-4.5 Ultra" className="bg-[#091522] text-white">GPT-4.5 Ultra</option>
            <option value="DeepSeek V3 (Fast Math)" className="bg-[#091522] text-white">DeepSeek V3 (Fast Math)</option>
            <option value="Grok 3 (Realtime Web3)" className="bg-[#091522] text-white">Grok 3 (Realtime Web3)</option>
            <option value="Llama 3.3 70B (Edge)" className="bg-[#091522] text-white">Llama 3.3 70B (Private Edge)</option>
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto my-2.5 py-1">
        {[
          { id: 'agents', label: '15 ИИ-Агентов Solo-Фаундера', icon: BrainCircuit },
          { id: 'telemetry', label: 'Телеметрия & DQI Аналитика', icon: Activity },
          { id: 'contentCms', label: 'CMS Контента & Карт', icon: Layers },
          { id: 'economySim', label: 'Экономика & $SIGNAL Токеномика', icon: Coins },
          { id: 'security', label: '2-Server Изоляция & Безопасность', icon: Lock },
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
                  ? 'bg-cyan-400 text-black shadow-md shadow-cyan-400/40'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10 border border-white/5'
              }`}
            >
              <Icon size={13} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 bg-[#06101c]/95 border border-white/10 rounded-2xl p-3 sm:p-4 overflow-y-auto shadow-inner">
        {/* ================= TAB 1: 15 AI AGENTS ================= */}
        {activeTab === 'agents' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 h-full">
            {/* Agent Directory */}
            <div className="lg:col-span-5 space-y-1.5 overflow-y-auto max-h-[380px] pr-1">
              {agents.map((agent) => {
                const isSelected = selectedAgent.id === agent.id;
                return (
                  <button
                    key={agent.id}
                    onClick={() => {
                      playSound('click');
                      setSelectedAgent(agent);
                      setAiOutputLog('');
                    }}
                    className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-start justify-between gap-2 cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200 ring-1 ring-cyan-400/50 shadow-md'
                        : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-black text-white leading-tight">
                        {agent.nameRu}
                      </div>
                      <div className="text-[9px] font-mono text-cyan-400 mt-0.5">
                        {agent.codename} • {agent.activeModel}
                      </div>
                    </div>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30 flex-shrink-0">
                      ● Active
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Selected Agent Inspector & Realtime Execution Sandbox */}
            <div className="lg:col-span-7 bg-[#091728] border border-cyan-500/30 rounded-xl p-3.5 flex flex-col justify-between shadow-xl">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <div>
                    <h3 className="text-sm font-black text-white uppercase">
                      {selectedAgent.nameRu}
                    </h3>
                    <p className="text-[10px] font-mono text-cyan-300">
                      ID: {selectedAgent.codename} | Модель: {selectedAgent.activeModel}
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-300">
                    Сегодня вызовов: {selectedAgent.callsToday}
                  </span>
                </div>

                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {selectedAgent.descriptionRu}
                </p>

                {/* System Prompt Box */}
                <div className="my-2.5 bg-black/60 border border-white/10 rounded-lg p-2.5">
                  <div className="text-[9px] font-mono text-slate-400 uppercase font-bold">
                    System Directive / Zero-Shot Rule:
                  </div>
                  <div className="text-[11px] font-mono text-cyan-200 mt-1 italic">
                    «{selectedAgent.systemPromptSample}»
                  </div>
                </div>

                {/* Live Console Output */}
                <div className="my-2 bg-black/80 border border-cyan-500/20 rounded-lg p-2.5 text-[10px] font-mono text-slate-300 max-h-28 overflow-y-auto whitespace-pre-wrap leading-tight">
                  {aiOutputLog || `› Готов к исполнению директивы агента ${selectedAgent.codename}...\n› Последний запуск: ${selectedAgent.lastActionRu}`}
                </div>
              </div>

              {/* Action Trigger */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
                <span className="text-[10px] font-mono text-slate-400">
                  Средняя задержка: <strong className="text-white">{selectedAgent.avgLatencyMs}мс</strong>
                </span>

                <button
                  disabled={isSimulatingAgent}
                  onClick={() => handleRunAgentAction(selectedAgent)}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 text-black font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-cyan-500/30 hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  {isSimulatingAgent ? (
                    <RefreshCw size={14} className="animate-spin" />
                  ) : (
                    <Play size={14} className="fill-current" />
                  )}
                  <span>{isSimulatingAgent ? 'Исполнение...' : 'Запустить задачу агента'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: TELEMETRY & DQI ANALYTICS ================= */}
        {activeTab === 'telemetry' && (
          <div className="space-y-3">
            {/* Realtime KPI Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
              <div className="p-2.5 bg-[#0a1829] border border-cyan-500/30 rounded-xl">
                <div className="text-[10px] font-mono text-slate-400 uppercase">DAU (Активные пользователи)</div>
                <div className="text-xl font-black text-cyan-300 font-mono mt-0.5">24,580</div>
                <div className="text-[9px] text-emerald-400 font-mono">+18.4% w/w</div>
              </div>

              <div className="p-2.5 bg-[#0a1829] border border-amber-500/30 rounded-xl">
                <div className="text-[10px] font-mono text-slate-400 uppercase">Средний DQI Индекс</div>
                <div className="text-xl font-black text-amber-300 font-mono mt-0.5">78.6%</div>
                <div className="text-[9px] text-slate-400 font-mono">Высокая точность</div>
              </div>

              <div className="p-2.5 bg-[#0a1829] border border-emerald-500/30 rounded-xl">
                <div className="text-[10px] font-mono text-slate-400 uppercase">D1 / D7 Retention</div>
                <div className="text-xl font-black text-emerald-300 font-mono mt-0.5">58% / 34%</div>
                <div className="text-[9px] text-emerald-400 font-mono">AAA-уровень</div>
              </div>

              <div className="p-2.5 bg-[#0a1829] border border-purple-500/30 rounded-xl">
                <div className="text-[10px] font-mono text-slate-400 uppercase">Месячный Runrate (ARR)</div>
                <div className="text-xl font-black text-purple-300 font-mono mt-0.5">$124,000</div>
                <div className="text-[9px] text-amber-300 font-mono">Target: $1M/mo</div>
              </div>
            </div>

            {/* Live Event Stream */}
            <div className="bg-[#081522] border border-white/10 rounded-xl p-3">
              <div className="flex items-center justify-between pb-2 border-b border-white/5 text-xs font-mono">
                <span className="text-cyan-300 font-black flex items-center gap-1.5">
                  <Activity size={14} className="text-emerald-400 animate-pulse" />
                  LIVE EVENT STREAM (FASTIFY WS TELEMETRY PIPELINE)
                </span>
                <span className="text-slate-400">120 событий / сек</span>
              </div>

              <div className="space-y-1 mt-2 font-mono text-[10px] text-slate-300 max-h-48 overflow-y-auto">
                <div className="p-1 bg-white/5 rounded flex justify-between">
                  <span className="text-emerald-400">› [SESSION_COMPLETE]</span>
                  <span>User #84291 • Сценарий: Инфляция 2022 • DQI: 92% • Seed: 0x9fa4</span>
                  <span className="text-slate-500">0.2с назад</span>
                </div>
                <div className="p-1 bg-white/5 rounded flex justify-between">
                  <span className="text-cyan-400">› [CARD_UPGRADE]</span>
                  <span>User #19203 • Карта «Только факты» → Ур. 3 • Золото -750</span>
                  <span className="text-slate-500">0.8с назад</span>
                </div>
                <div className="p-1 bg-white/5 rounded flex justify-between">
                  <span className="text-amber-400">› [TOURNAMENT_SUBMIT]</span>
                  <span>User #33190 • Турнир «Шок ставок» • Ранг: #14</span>
                  <span className="text-slate-500">1.4с назад</span>
                </div>
                <div className="p-1 bg-white/5 rounded flex justify-between">
                  <span className="text-red-400">› [ANTI_CHEAT_FLAG]</span>
                  <span>Sentinel AI проверил субсекундный клик: False Positive (Мобильный лаг)</span>
                  <span className="text-slate-500">2.1с назад</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: CONTENT CMS ================= */}
        {activeTab === 'contentCms' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="font-bold">Управление контентом без деплоя (Hot-Reloading Over WS)</span>
              <button
                onClick={() => {
                  playSound('success');
                  alert('ИИ Сгенерировал 5 новых карточек для Главы 6 «Ликвидность DeFi» и отправил в стейджинг!');
                }}
                className="px-3 py-1.5 rounded-lg bg-cyan-400 text-black font-black text-xs uppercase flex items-center gap-1 cursor-pointer"
              >
                <Sparkles size={12} />
                <span>AI Auto-Generate Новые Карты</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div className="p-3 bg-[#0a1726] border border-white/10 rounded-xl">
                <div className="font-black text-white">Колода Карт (24 активных)</div>
                <p className="text-[10px] text-slate-400 mt-1">Протоколы, Решения, Чтение, Защита</p>
                <div className="mt-2 text-emerald-400 font-mono text-[10px]">● 100% Верифицировано ИИ</div>
              </div>

              <div className="p-3 bg-[#0a1726] border border-white/10 rounded-xl">
                <div className="font-black text-white">Рыночные Пазлы (48 сетапов)</div>
                <p className="text-[10px] text-slate-400 mt-1">SFP, BOS, ChoCh, Order Blocks, Liquidity</p>
                <div className="mt-2 text-cyan-300 font-mono text-[10px]">● Seed-генерация включена</div>
              </div>

              <div className="p-3 bg-[#0a1726] border border-white/10 rounded-xl">
                <div className="font-black text-white">Кризисные Хроники (12 глав)</div>
                <p className="text-[10px] text-slate-400 mt-1">2000, 2008, 2015, 2020, 2022, 2024</p>
                <div className="mt-2 text-purple-300 font-mono text-[10px]">● Нарратив с 36 ветками</div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 4: ECONOMY SIMULATION ================= */}
        {activeTab === 'economySim' && (
          <div className="space-y-3">
            <div className="p-3 bg-gradient-to-r from-amber-950/60 to-[#1e1308] border border-amber-500/40 rounded-xl">
              <h3 className="text-xs sm:text-sm font-black text-amber-300 uppercase">
                GameFi 2.0 & $SIGNAL Utility Tokenomics
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Модель устойчивой экономики: никаких Ponzi-выплат. Токен используется для турнирных бай-инов, аренды экспертных колод, кастомизации и доступа к закрытым мастер-классам.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-black/40 border border-white/10 rounded-xl space-y-2">
                <span className="text-cyan-300 font-bold uppercase font-mono">Источники сжигания (Token Sinks):</span>
                <div className="space-y-1 text-slate-300 text-[11px]">
                  <div>🔥 50% бай-инов турниров сжигаются смарт-контрактом</div>
                  <div>🔥 Плата за улучшение карт в NFT-кузнице</div>
                  <div>🔥 Покупка эксклюзивных аватаров и скинов графиков</div>
                </div>
              </div>

              <div className="p-3 bg-black/40 border border-white/10 rounded-xl space-y-2">
                <span className="text-emerald-300 font-bold uppercase font-mono">Награды за Мастерство (Value Drivers):</span>
                <div className="space-y-1 text-slate-300 text-[11px]">
                  <div>🏆 Выплаты в Лиге Аналитиков строго по DQI (без удачи)</div>
                  <div>🎓 Гранты от проп-трейдинговых компаний лучшим выпускникам</div>
                  <div>⭐ Стейкинг для получения статуса Наставника Гильдии</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 5: 2-TIER SERVER ISOLATION ================= */}
        {activeTab === 'security' && (
          <div className="space-y-3">
            <div className="p-3.5 bg-red-950/40 border border-red-500/40 rounded-xl flex items-start gap-3">
              <ShieldAlert size={24} className="text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-xs sm:text-sm font-black text-white uppercase">
                  Архитектура Нулевого Доверия (Zero-Client Secrets)
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Клиентская часть (Telegram Mini App / Mobile / Web) является полностью «недоверенной». Все ключи API (OpenAI, Anthropic, DeepSeek), приватные ключи смарт-контрактов и мастер-база данных находятся на изолированном внутреннем сервере в закрытом VPC.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-[#0a1422] border border-cyan-500/30 rounded-xl">
                <div className="text-cyan-300 font-black flex items-center gap-1.5 uppercase font-mono">
                  <Database size={14} /> 1. Публичный Edge Game Server
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Fastify + WebSockets + Zod. Раздает только проверенные стейты, обрабатывает клиентские инпуты и пересылает зашифрованные пакеты в очередь.
                </p>
                <div className="mt-2 text-emerald-400 text-[10px] font-mono">● DDoS Shield + WAF Активен</div>
              </div>

              <div className="p-3 bg-[#150d1e] border border-purple-500/30 rounded-xl">
                <div className="text-purple-300 font-black flex items-center gap-1.5 uppercase font-mono">
                  <Lock size={14} /> 2. Изолированный Admin & AI Core
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Доступен только по приватному VPN / WireGuard + Passkey 2FA. Хранит ключи LLM, исполняет балансировку и управляет миграциями Drizzle.
                </p>
                <div className="mt-2 text-purple-300 text-[10px] font-mono">● 100% Изоляция от публичного интернета</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
