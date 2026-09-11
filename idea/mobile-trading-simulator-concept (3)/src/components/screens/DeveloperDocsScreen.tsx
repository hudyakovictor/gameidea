import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { CandleChartEngine } from '../common/CandleChartEngine';
import {
  Code,
  Terminal,
  Server,
  Layers,
  Cpu,
  Smartphone,
  Sparkles,
  GitBranch,
} from 'lucide-react';

export const DeveloperDocsScreen: React.FC = () => {
  const { playSound } = useGame();
  const [activeSection, setActiveSection] = useState<'stack' | 'engine' | 'telegramTma' | 'deterministic' | 'prodPipeline'>('stack');
  const [testSeed, setTestSeed] = useState('0xSIGNAL_ARENA_2026');
  const [seedGeneratedScenario, setSeedGeneratedScenario] = useState<{
    id: string;
    anomalyType: string;
    volatility: number;
    threatScore: number;
    invalidationPrice: number;
  } | null>(null);

  const handleRunSeedGenerator = () => {
    playSound('play');
    // Simulated deterministic scenario generator (seedrandom)
    let hash = 0;
    for (let i = 0; i < testSeed.length; i++) {
      hash = (hash << 5) - hash + testSeed.charCodeAt(i);
      hash |= 0;
    }
    const absHash = Math.abs(hash);
    const types = [
      'Liquidity Sweep (SFP) на перегретом фандинге',
      'Спираль депега стейблкоина Curve 3pool',
      'Ложный пробой восходящего клина перед решением FOMC',
      'Охота за стопами лонгов (Long Squeeze каскад)',
    ];

    setSeedGeneratedScenario({
      id: `SCENARIO-${(absHash % 10000).toString().padStart(4, '0')}`,
      anomalyType: types[absHash % types.length],
      volatility: 60 + (absHash % 40),
      threatScore: 70 + (absHash % 30),
      invalidationPrice: 62000 + (absHash % 4000),
    });
    playSound('success');
  };

  return (
    <div className="h-full flex flex-col justify-between overflow-y-auto p-3 sm:p-4 max-w-6xl mx-auto w-full select-none pb-2 font-mono">
      {/* Dev Header */}
      <div className="bg-[#071320] border border-cyan-500/40 p-3 rounded-xl shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            <Terminal size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/30">
                FOR_DEVELOPERS // PRODUCTION BLUEPRINT
              </span>
              <span className="text-[9px] bg-purple-950 text-purple-300 px-1.5 py-0.2 rounded border border-purple-500/40">
                SOLO FOUNDER $1M/MO ARCHITECTURE
              </span>
            </div>
            <h2 className="text-xs sm:text-sm font-black text-white uppercase mt-0.5 font-sans">
              Инфраструктура, Phaser 4 Движок & План Масштабирования
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Готово к сборке</span>
        </div>
      </div>

      {/* Dev Sections Nav */}
      <div className="flex items-center gap-1.5 overflow-x-auto my-2.5 py-1">
        {[
          { id: 'stack', label: '1. Целевой Стек & Инструменты', icon: Layers },
          { id: 'engine', label: '2. Phaser 4 + Canvas Graphics', icon: Cpu },
          { id: 'telegramTma', label: '3. Telegram TMA SDK & GameFi', icon: Smartphone },
          { id: 'deterministic', label: '4. Детерминированный Seed-Генератор', icon: GitBranch },
          { id: 'prodPipeline', label: '5. Docker / Fastify / Drizzle Деплой', icon: Server },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                playSound('click');
                setActiveSection(tab.id as typeof activeSection);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition-all whitespace-nowrap flex items-center gap-1.5 font-sans ${
                activeSection === tab.id
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

      {/* Content Area */}
      <div className="flex-1 bg-[#050e18] border border-white/10 rounded-2xl p-3 sm:p-4 overflow-y-auto shadow-inner text-xs text-slate-300 space-y-3 leading-relaxed">
        {/* ================= SECTION 1: STACK ================= */}
        {activeSection === 'stack' && (
          <div className="space-y-3 font-sans">
            <div className="p-3 bg-cyan-950/40 border border-cyan-500/30 rounded-xl">
              <h3 className="text-sm font-black text-white uppercase flex items-center gap-1.5">
                <Code size={16} className="text-cyan-300" />
                Архитектурный Стек для 100,000+ Одновременных Сессий
              </h3>
              <p className="text-xs text-slate-300 mt-1 font-normal">
                Проект спроектирован так, чтобы один соло-фаундер мог поддерживать и масштабировать игру с нулевыми затратами на лишний персонал.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="p-3 bg-[#081524] border border-white/10 rounded-xl space-y-1.5">
                <div className="text-cyan-300 font-bold font-mono text-xs">CLIENT ENGINE (100% 60 FPS):</div>
                <div className="text-[11px] space-y-1 text-slate-300 font-mono">
                  <div>• <strong>Phaser 4 + TypeScript + Vite</strong>: игровой луп, твины, партиклы.</div>
                  <div>• <strong>rexUI Plugin</strong>: игровые интерфейсы внутри единого канваса.</div>
                  <div>• <strong>Собственный CandleChart</strong> на Graphics: нулевые внешние зависимости.</div>
                  <div>• <strong>Zustand Store</strong>: реактивное состояние без ререндеров React.</div>
                  <div>• <strong>seedrandom</strong>: 100% воспроизводимость турнирных матчей.</div>
                </div>
              </div>

              <div className="p-3 bg-[#081524] border border-white/10 rounded-xl space-y-1.5">
                <div className="text-emerald-300 font-bold font-mono text-xs">BACKEND & DATA LAYER:</div>
                <div className="text-[11px] space-y-1 text-slate-300 font-mono">
                  <div>• <strong>Fastify + WebSocket</strong>: 50,000 req/sec на 1 CPU ядре.</div>
                  <div>• <strong>SQLite (libSQL / Turso) + Drizzle ORM</strong>: мгновенные edge-запросы.</div>
                  <div>• <strong>Zod Typebox</strong>: строгая валидация входящих клиентских пакетов.</div>
                  <div>• <strong>Vitest + Playwright</strong>: E2E автотесты перед каждым коммитом.</div>
                  <div>• <strong>vite-plugin-pwa</strong>: офлайн-кэширование и установка на экран смартфона.</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= SECTION 2: PHASER 4 GRAPHICS ENGINE ================= */}
        {activeSection === 'engine' && (
          <div className="space-y-3 font-sans">
            <div className="p-3 bg-purple-950/40 border border-purple-500/30 rounded-xl">
              <h3 className="text-sm font-black text-white uppercase">
                Живая демонстрация встроенного Canvas CandleChart (Без Lightweight-Charts)
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                График рендерится напрямую в игровой кадровый буфер через 2D Context / WebGL Graphics. Это исключает лаги DOM и позволяет рисовать стрелки, зоны ликвидности и Footprint поверх свечей.
              </p>
            </div>

            {/* Embed the custom chart engine */}
            <CandleChartEngine height={200} showVolumeProfile={true} showFootprint={true} />
          </div>
        )}

        {/* ================= SECTION 3: TELEGRAM TMA & GAMEFI 2.0 ================= */}
        {activeSection === 'telegramTma' && (
          <div className="space-y-3 font-sans">
            <div className="p-3 bg-cyan-950/40 border border-cyan-500/30 rounded-xl">
              <h3 className="text-sm font-black text-white uppercase">
                Telegram Mini App (TMA SDK) + GameFi 2.0 План
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Telegram используется как стартовая воронка вирального трафика (1-клик запуск без логина), а далее игра разворачивается в кросс-платформенное приложение.
              </p>
            </div>

            <div className="bg-[#081524] p-3 rounded-xl border border-white/10 font-mono text-[11px] text-slate-300 space-y-2">
              <div className="text-amber-300 font-bold">// Пример инициализации TMA SDK:</div>
              <pre className="bg-black/60 p-2.5 rounded-lg border border-white/5 overflow-x-auto text-cyan-200">
{`import { initTelegramApp, TelegramUser } from '@telegram-apps/sdk';

export async function bootstrapGameSession() {
  const tma = initTelegramApp();
  tma.expand(); // Полный экран без скролла
  tma.headerColor('#06101c');
  
  // Авторизация по защищенному HMAC-хэшу
  const initDataRaw = tma.initDataRaw;
  const ws = new WebSocket(\`wss://api.signalarena.gg/live?auth=\${initDataRaw}\`);
  return ws;
}`}
              </pre>
            </div>
          </div>
        )}

        {/* ================= SECTION 4: DETERMINISTIC SEED PLAYGROUND ================= */}
        {activeSection === 'deterministic' && (
          <div className="space-y-3 font-sans">
            <div className="p-3 bg-amber-950/40 border border-amber-500/30 rounded-xl">
              <h3 className="text-sm font-black text-amber-300 uppercase">
                Интерактивный Генератор Сценариев (Seedrandom Engine)
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Один и тот же seed генерирует 100% идентичный график, объемы и ордербук на любых устройствах. Это основа честных турниров и античита.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-black/50 p-2 rounded-xl border border-white/10">
              <input
                type="text"
                value={testSeed}
                onChange={(e) => setTestSeed(e.target.value)}
                placeholder="Введи турнирный SEED (например, TOURNAMENT_WEEK_42)"
                className="flex-1 bg-transparent px-3 py-1.5 text-xs text-white font-mono focus:outline-none"
              />
              <button
                onClick={handleRunSeedGenerator}
                className="px-4 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-black font-black text-xs uppercase flex items-center gap-1 font-mono cursor-pointer"
              >
                <Sparkles size={12} />
                <span>Сгенерировать</span>
              </button>
            </div>

            {seedGeneratedScenario && (
              <div className="p-3 bg-[#0a1829] border border-cyan-400/40 rounded-xl font-mono text-xs space-y-1 animate-fadeIn">
                <div className="text-cyan-300 font-bold">✨ Сценарий {seedGeneratedScenario.id} сформирован:</div>
                <div>• Аномалия: <strong className="text-white">{seedGeneratedScenario.anomalyType}</strong></div>
                <div>• Индекс Волатильности: <strong className="text-amber-300">{seedGeneratedScenario.volatility}/100</strong></div>
                <div>• Угроза Штурма: <strong className="text-red-400">{seedGeneratedScenario.threatScore}/100</strong></div>
                <div>• Точка отмены идеи (Invalidation): <strong className="text-emerald-400">${seedGeneratedScenario.invalidationPrice}</strong></div>
              </div>
            )}
          </div>
        )}

        {/* ================= SECTION 5: PRODUCTION PIPELINE & DOCKER ================= */}
        {activeSection === 'prodPipeline' && (
          <div className="space-y-3 font-sans">
            <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl">
              <h3 className="text-sm font-black text-emerald-300 uppercase">
                Production Deployment: Fastify + Docker + Drizzle
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Команды для развертывания проекта на защищенном VPS/Kubernetes за 5 минут.
              </p>
            </div>

            <div className="bg-[#081522] p-3 rounded-xl border border-white/10 font-mono text-[11px] text-slate-300 space-y-2">
              <div className="text-cyan-300 font-bold">// Команды сборки и тестов:</div>
              <pre className="bg-black/60 p-2.5 rounded-lg border border-white/5 overflow-x-auto text-slate-200">
{`# 1. Установка и запуск тестов
npm install
npm run test:vitest
npm run test:playwright

# 2. Сборка продакшен бандла (Single HTML PWA)
npm run build

# 3. Запуск изолированного Fastify Game Server
docker-compose up -d --build
# Fastify WS listens on :4000
# Admin Core listens on 127.0.0.1:8080 (VPN only)`}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
