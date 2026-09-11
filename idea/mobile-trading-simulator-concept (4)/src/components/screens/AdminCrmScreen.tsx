import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { ALL_GAME_CARDS } from '../../data/cards';
import { BOSS_THREATS } from '../../data/bosses';
import { MARKET_PUZZLES } from '../../data/puzzles';
import { ACADEMY_LESSONS } from '../../data/academy';
import { STORY_SCENARIOS } from '../../data/stories';
import {
  ShieldAlert,
  Users,
  Sliders,
  BarChart3,
  Send,
  Radio,
  Search,
  Plus,
  Edit3,
  CheckCircle2,
  AlertTriangle,
  Coins,
  Gem,
  Zap,
  Save,
  Layers,
  BookOpen,
  Puzzle,
  TrendingUp,
  Cpu,
  Activity,
} from 'lucide-react';

type AdminTab =
  | 'overview'
  | 'players'
  | 'balance'
  | 'cms'
  | 'liveops'
  | 'telemetry';

interface AdminPlayer {
  id: string;
  name: string;
  rank: number;
  level: number;
  dqiScore: number;
  gold: number;
  gems: number;
  energy: number;
  status: 'active' | 'banned' | 'muted';
  streak: number;
  lastActive: string;
  scenariosCompleted: number;
  warningCount: number;
}

export const AdminCrmScreen: React.FC = () => {
  const {
    playerStats,
    playSound,
    setCurrentScreen,
  } = useGame();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Search & Filter in Players CRM
  const [playerSearchQuery, setPlayerSearchQuery] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState<AdminPlayer | null>(null);

  // Editable live state for Admin Players
  const [playersList, setPlayersList] = useState<AdminPlayer[]>([
    {
      id: 'p-player',
      name: 'NovaTrader (Вы)',
      rank: 248,
      level: playerStats.level,
      dqiScore: playerStats.decisionQualityAvg,
      gold: playerStats.gold,
      gems: playerStats.gems,
      energy: playerStats.energy,
      status: 'active',
      streak: playerStats.streakDays,
      lastActive: 'Онлайн сейчас',
      scenariosCompleted: playerStats.scenariosCompleted,
      warningCount: 0,
    },
    {
      id: 'p-1',
      name: 'QuantumMind',
      rank: 1,
      level: 42,
      dqiScore: 96.4,
      gold: 145200,
      gems: 12500,
      energy: 100,
      status: 'active',
      streak: 84,
      lastActive: '5 мин. назад',
      scenariosCompleted: 312,
      warningCount: 0,
    },
    {
      id: 'p-2',
      name: 'TradeZen',
      rank: 2,
      level: 39,
      dqiScore: 94.2,
      gold: 98400,
      gems: 8200,
      energy: 95,
      status: 'active',
      streak: 52,
      lastActive: '12 мин. назад',
      scenariosCompleted: 240,
      warningCount: 0,
    },
    {
      id: 'p-3',
      name: 'RiskMaster',
      rank: 3,
      level: 36,
      dqiScore: 92.8,
      gold: 72100,
      gems: 6100,
      energy: 80,
      status: 'active',
      streak: 41,
      lastActive: '34 мин. назад',
      scenariosCompleted: 198,
      warningCount: 0,
    },
    {
      id: 'p-cheat',
      name: 'YoloLeverage_100x',
      rank: 4192,
      level: 4,
      dqiScore: 21.3,
      gold: 120,
      gems: 50,
      energy: 0,
      status: 'muted',
      streak: 0,
      lastActive: '3 часа назад',
      scenariosCompleted: 14,
      warningCount: 3,
    },
  ]);

  // LiveOps & Balance Config State
  const [liveCards, setLiveCards] = useState(ALL_GAME_CARDS);
  const [liveBosses, setLiveBosses] = useState(BOSS_THREATS);
  const [dqiDisciplineWeight, setDqiDisciplineWeight] = useState(40);
  const [dqiRiskWeight, setDqiRiskWeight] = useState(35);
  const [dqiAnalysisWeight, setDqiAnalysisWeight] = useState(25);

  // Live Push Announcement Form
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastType, setBroadcastType] = useState<'urgent' | 'event' | 'maintenance'>('urgent');

  // A/B Testing Flags
  const [abFlags, setAbFlags] = useState({
    duolingo_voiceover: true,
    dynamic_timeframe_puzzles: true,
    hardcore_no_undo: false,
    guild_tournaments_v2: true,
    ai_mentor_reactive_quotes: true,
  });

  const showToast = (msg: string) => {
    playSound('success');
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Modify Player in CRM
  const handleModifyCurrency = (playerId: string, type: 'gold' | 'gems' | 'energy', amount: number) => {
    playSound('click');
    setPlayersList(prev =>
      prev.map(p => {
        if (p.id === playerId) {
          const newVal = Math.max(0, p[type] + amount);
          return { ...p, [type]: newVal };
        }
        return p;
      })
    );
    if (selectedPlayer && selectedPlayer.id === playerId) {
      setSelectedPlayer(prev => prev ? { ...prev, [type]: Math.max(0, prev[type] + amount) } : null);
    }
    showToast(`Игроку начислено ${amount > 0 ? '+' : ''}${amount} ${type.toUpperCase()}`);
  };

  const handleTogglePlayerStatus = (playerId: string, newStatus: 'active' | 'banned' | 'muted') => {
    playSound('click');
    setPlayersList(prev =>
      prev.map(p => (p.id === playerId ? { ...p, status: newStatus } : p))
    );
    if (selectedPlayer && selectedPlayer.id === playerId) {
      setSelectedPlayer(prev => prev ? { ...prev, status: newStatus } : null);
    }
    showToast(`Статус игрока изменен на: ${newStatus.toUpperCase()}`);
  };

  // Live Balance Card Tweaker
  const handleUpdateCardStat = (cardId: string, field: 'cost' | 'clarityBonus' | 'noiseShield', delta: number) => {
    playSound('click');
    setLiveCards(prev =>
      prev.map(c => {
        if (c.id === cardId) {
          return { ...c, [field]: Math.max(0, c[field] + delta) };
        }
        return c;
      })
    );
  };

  // Boss HP & Damage Tweaker
  const handleUpdateBossStat = (bossId: string, field: 'maxStability' | 'threatLevel', delta: number) => {
    playSound('click');
    setLiveBosses(prev =>
      prev.map(b => {
        if (b.id === bossId) {
          return { ...b, [field]: Math.max(10, b[field] + delta) };
        }
        return b;
      })
    );
  };

  const handleSendBroadcast = () => {
    if (!broadcastTitle.trim() || !broadcastMessage.trim()) {
      playSound('error');
      return;
    }
    showToast(`📢 PUSH разослан на 24,850 активных клиентов!`);
    setBroadcastTitle('');
    setBroadcastMessage('');
  };

  const filteredPlayers = playersList.filter(
    p =>
      p.name.toLowerCase().includes(playerSearchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(playerSearchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col justify-between overflow-hidden p-2.5 sm:p-4 max-w-6xl mx-auto w-full select-none">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-emerald-500 text-black font-black text-xs px-4 py-2 rounded-xl shadow-2xl flex items-center gap-2 animate-fadeIn border border-white/40">
          <CheckCircle2 size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin CRM Top Header */}
      <div className="bg-[#091522] border border-cyan-500/40 rounded-2xl p-3 sm:p-3.5 shadow-xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-500 p-0.5 shadow-lg shadow-cyan-950/60 flex items-center justify-center">
            <div className="w-full h-full bg-[#06101c] rounded-xl flex items-center justify-center text-cyan-300">
              <Cpu size={20} />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-black text-white uppercase tracking-tight">
                SIGNAL ARENA — ADMIN CRM & LIVEOPS
              </h2>
              <span className="text-[9px] font-mono bg-red-950/80 text-red-300 px-2 py-0.5 rounded border border-red-500/40 uppercase font-black tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
                Live Production (v1.4.2)
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 font-mono">
              Центр управления игровым балансом, экономикой, модерацией и телеметрией DQI
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              playSound('click');
              showToast('Все изменения баланса синхронизированы с сервером!');
            }}
            className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-400 to-teal-300 text-black font-black text-xs px-3.5 py-1.5 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer"
          >
            <Save size={14} />
            <span>Применить на прод</span>
          </button>

          <button
            onClick={() => setCurrentScreen('lobby')}
            className="text-xs text-slate-400 hover:text-white bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl transition-colors"
          >
            В игру ✕
          </button>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-2 my-1">
        {[
          { id: 'overview', labelRu: 'Дашборд & KPI', icon: BarChart3 },
          { id: 'players', labelRu: 'CRM Игроков', icon: Users, badge: playersList.length },
          { id: 'balance', labelRu: 'Баланс & Карты', icon: Sliders },
          { id: 'cms', labelRu: 'Контент (CMS)', icon: BookOpen },
          { id: 'liveops', labelRu: 'События & Push', icon: Radio },
          { id: 'telemetry', labelRu: 'Телеметрия DQI', icon: Activity },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                playSound('click');
                setActiveTab(tab.id as AdminTab);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition-all whitespace-nowrap flex items-center gap-1.5 ${
                isActive
                  ? 'bg-cyan-400 text-black shadow-md shadow-cyan-400/40 ring-1 ring-white'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10 border border-white/5'
              }`}
            >
              <Icon size={14} />
              <span>{tab.labelRu}</span>
              {tab.badge && (
                <span
                  className={`text-[9px] font-mono px-1.5 rounded-full ${
                    isActive ? 'bg-black text-cyan-300' : 'bg-white/10 text-slate-300'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW & KPI DASHBOARD */}
      {activeTab === 'overview' && (
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {/* 4 Core Game Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="bg-[#091522] border border-cyan-500/30 p-3 rounded-xl shadow-lg">
              <div className="text-[10px] font-mono text-slate-400 uppercase">DAU / Активные игроки</div>
              <div className="text-xl sm:text-2xl font-black text-white font-mono mt-0.5 flex items-center gap-1.5">
                <span>24,850</span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-1.5 rounded border border-emerald-500/30">
                  +18.4%
                </span>
              </div>
              <div className="text-[9px] text-cyan-300 font-mono mt-1">MAU: 142,300 • Лиги: 4</div>
            </div>

            <div className="bg-[#091522] border border-emerald-500/30 p-3 rounded-xl shadow-lg">
              <div className="text-[10px] font-mono text-slate-400 uppercase">D1 / D7 Удержание</div>
              <div className="text-xl sm:text-2xl font-black text-emerald-300 font-mono mt-0.5">
                64.2% <span className="text-xs text-slate-400 font-normal">/ 38.5%</span>
              </div>
              <div className="text-[9px] text-slate-400 font-mono mt-1">Таргет: 60% / 35% (Превышен)</div>
            </div>

            <div className="bg-[#091522] border border-amber-500/30 p-3 rounded-xl shadow-lg">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Среднее время сессии</div>
              <div className="text-xl sm:text-2xl font-black text-amber-300 font-mono mt-0.5">
                6м 42с
              </div>
              <div className="text-[9px] text-amber-400 font-mono mt-1">4.2 сессии на игрока/день</div>
            </div>

            <div className="bg-[#091522] border border-purple-500/30 p-3 rounded-xl shadow-lg">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Средний индекс DQI</div>
              <div className="text-xl sm:text-2xl font-black text-purple-300 font-mono mt-0.5">
                78.4%
              </div>
              <div className="text-[9px] text-purple-400 font-mono mt-1">Ошибки риска снизились на 31%</div>
            </div>
          </div>

          {/* Retention & Funnel Diagnostic */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Conversion Funnel */}
            <div className="bg-[#06101c] border border-white/10 rounded-xl p-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-white/5 mb-3">
                <span className="text-xs font-black uppercase text-white flex items-center gap-1.5">
                  <TrendingUp size={14} className="text-cyan-300" />
                  Воронка прохождения новичков (Onboarding Funnel)
                </span>
                <span className="text-[10px] font-mono text-slate-400">100% = 12,400</span>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <div className="flex justify-between font-mono text-[11px] mb-0.5">
                    <span className="text-slate-300">1. Запуск & Обучение Совы (Урок #1)</span>
                    <span className="text-cyan-300 font-bold">96.2% (11,928)</span>
                  </div>
                  <div className="w-full bg-black/60 h-2 rounded-full overflow-hidden">
                    <div className="bg-cyan-400 h-full" style={{ width: '96.2%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-mono text-[11px] mb-0.5">
                    <span className="text-slate-300">2. Первый Пазл (Паттерн Треугольник)</span>
                    <span className="text-cyan-300 font-bold">88.5% (10,974)</span>
                  </div>
                  <div className="w-full bg-black/60 h-2 rounded-full overflow-hidden">
                    <div className="bg-cyan-400 h-full" style={{ width: '88.5%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-mono text-[11px] mb-0.5">
                    <span className="text-slate-300">3. Победа над Леверидж-Гоблином (Бой #1)</span>
                    <span className="text-emerald-300 font-bold">78.1% (9,684)</span>
                  </div>
                  <div className="w-full bg-black/60 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-400 h-full" style={{ width: '78.1%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-mono text-[11px] mb-0.5">
                    <span className="text-slate-300">4. Историческая Хроника (Кризис 2008)</span>
                    <span className="text-purple-300 font-bold">69.4% (8,605)</span>
                  </div>
                  <div className="w-full bg-black/60 h-2 rounded-full overflow-hidden">
                    <div className="bg-purple-400 h-full" style={{ width: '69.4%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-mono text-[11px] mb-0.5">
                    <span className="text-slate-300">5. Вступление в Сезонную Лигу & Гильдию</span>
                    <span className="text-amber-300 font-bold">58.8% (7,291)</span>
                  </div>
                  <div className="w-full bg-black/60 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-400 h-full" style={{ width: '58.8%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Live Telemetry Health Check */}
            <div className="bg-[#06101c] border border-white/10 rounded-xl p-3.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-white/5 mb-3">
                  <span className="text-xs font-black uppercase text-white flex items-center gap-1.5">
                    <Activity size={14} className="text-emerald-400" />
                    Состояние Сервисов LiveOps & Matchmaking
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">99.98% Uptime</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-2 bg-white/5 rounded-lg border border-white/5 flex items-center justify-between">
                    <span className="text-slate-300">Асинхронный расчет DQI (Decision Engine)</span>
                    <span className="text-emerald-400 font-mono font-bold">24ms • Норма</span>
                  </div>
                  <div className="p-2 bg-white/5 rounded-lg border border-white/5 flex items-center justify-between">
                    <span className="text-slate-300">Турнирный лидерборд (Redis Shards)</span>
                    <span className="text-emerald-400 font-mono font-bold">12ms • Норма</span>
                  </div>
                  <div className="p-2 bg-white/5 rounded-lg border border-white/5 flex items-center justify-between">
                    <span className="text-slate-300">Синхронизация колод & Прокачки RPG</span>
                    <span className="text-emerald-400 font-mono font-bold">OK</span>
                  </div>
                  <div className="p-2 bg-white/5 rounded-lg border border-white/5 flex items-center justify-between">
                    <span className="text-slate-300">Античит & Валидация ходов в битвах</span>
                    <span className="text-cyan-300 font-mono font-bold">0 читеров за 24ч</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span>Пул серверов: EU-Central (Frankfurt)</span>
                <span>Репликация: 3x Node Cluster</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CRM PLAYERS MANAGEMENT */}
      {activeTab === 'players' && (
        <div className="flex-1 overflow-hidden flex flex-col sm:flex-row gap-3">
          {/* Players Table Left */}
          <div className="flex-1 bg-[#06101c] border border-white/10 rounded-2xl p-3 flex flex-col justify-between overflow-hidden">
            {/* Search Bar */}
            <div className="relative mb-2.5">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={playerSearchQuery}
                onChange={e => setPlayerSearchQuery(e.target.value)}
                placeholder="Поиск игрока по нику, ID или рангу..."
                className="w-full bg-[#091522] border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Table */}
            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
              {filteredPlayers.map(p => {
                const isSelected = selectedPlayer?.id === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => {
                      playSound('click');
                      setSelectedPlayer(p);
                    }}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between text-xs ${
                      isSelected
                        ? 'bg-cyan-950/90 border-cyan-400 text-white ring-1 ring-cyan-400/60 shadow-lg'
                        : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-black/50 border border-white/10 flex items-center justify-center font-black text-cyan-300 font-mono text-xs">
                        #{p.rank}
                      </div>
                      <div>
                        <div className="font-bold text-white flex items-center gap-1.5">
                          {p.name}
                          <span
                            className={`text-[8px] font-mono px-1 py-0.2 rounded uppercase ${
                              p.status === 'active'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                                : p.status === 'muted'
                                ? 'bg-amber-950 text-amber-300 border border-amber-500/30'
                                : 'bg-red-950 text-red-300 border border-red-500/30'
                            }`}
                          >
                            {p.status}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          Ур. {p.level} • {p.lastActive}
                        </div>
                      </div>
                    </div>

                    <div className="text-right font-mono text-xs">
                      <div className="font-black text-amber-300">{p.dqiScore}% DQI</div>
                      <div className="text-[9px] text-slate-400">{p.gold.toLocaleString()} 🪙</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Player Detail & Modifier Drawer (Right) */}
          <div className="w-full sm:w-80 bg-[#091522] border border-cyan-500/30 rounded-2xl p-3.5 flex flex-col justify-between overflow-y-auto">
            {selectedPlayer ? (
              <div className="space-y-3">
                <div className="pb-2 border-b border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-cyan-400 uppercase">Карточка игрока</span>
                    <h3 className="text-sm font-black text-white">{selectedPlayer.name}</h3>
                  </div>
                  <span className="text-xs font-mono font-black text-amber-300">
                    Ранг #{selectedPlayer.rank}
                  </span>
                </div>

                {/* Player Live Stats */}
                <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-black/40 p-2.5 rounded-xl border border-white/5">
                  <div>
                    <span className="text-slate-500 text-[9px] block">КАЧЕСТВО (DQI)</span>
                    <strong className="text-cyan-300">{selectedPlayer.dqiScore}%</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[9px] block">СЦЕНАРИЕВ</span>
                    <strong className="text-white">{selectedPlayer.scenariosCompleted}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[9px] block">СЕРИЯ ДНЕЙ</span>
                    <strong className="text-orange-400">🔥 {selectedPlayer.streak}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[9px] block">НАРУШЕНИЙ</span>
                    <strong className={selectedPlayer.warningCount > 0 ? 'text-red-400' : 'text-emerald-400'}>
                      {selectedPlayer.warningCount}
                    </strong>
                  </div>
                </div>

                {/* Direct Currency Injection Controls */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                    Начисление ресурсов (Live Grant)
                  </span>

                  {/* Gold Injection */}
                  <div className="flex items-center justify-between p-2 bg-white/5 rounded-xl border border-white/5">
                    <span className="text-xs text-amber-300 font-bold flex items-center gap-1 font-mono">
                      <Coins size={14} /> {selectedPlayer.gold.toLocaleString()}
                    </span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleModifyCurrency(selectedPlayer.id, 'gold', 1000)}
                        className="px-2 py-0.5 bg-amber-500/20 text-amber-300 hover:bg-amber-500/40 rounded text-[10px] font-mono font-bold"
                      >
                        +1,000
                      </button>
                      <button
                        onClick={() => handleModifyCurrency(selectedPlayer.id, 'gold', 10000)}
                        className="px-2 py-0.5 bg-amber-500/20 text-amber-300 hover:bg-amber-500/40 rounded text-[10px] font-mono font-bold"
                      >
                        +10k
                      </button>
                    </div>
                  </div>

                  {/* Gems Injection */}
                  <div className="flex items-center justify-between p-2 bg-white/5 rounded-xl border border-white/5">
                    <span className="text-xs text-purple-300 font-bold flex items-center gap-1 font-mono">
                      <Gem size={14} /> {selectedPlayer.gems.toLocaleString()}
                    </span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleModifyCurrency(selectedPlayer.id, 'gems', 500)}
                        className="px-2 py-0.5 bg-purple-500/20 text-purple-300 hover:bg-purple-500/40 rounded text-[10px] font-mono font-bold"
                      >
                        +500
                      </button>
                      <button
                        onClick={() => handleModifyCurrency(selectedPlayer.id, 'gems', 2500)}
                        className="px-2 py-0.5 bg-purple-500/20 text-purple-300 hover:bg-purple-500/40 rounded text-[10px] font-mono font-bold"
                      >
                        +2.5k
                      </button>
                    </div>
                  </div>

                  {/* Energy Refill */}
                  <div className="flex items-center justify-between p-2 bg-white/5 rounded-xl border border-white/5">
                    <span className="text-xs text-cyan-300 font-bold flex items-center gap-1 font-mono">
                      <Zap size={14} /> {selectedPlayer.energy}/100
                    </span>
                    <button
                      onClick={() => handleModifyCurrency(selectedPlayer.id, 'energy', 100)}
                      className="px-2 py-0.5 bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/40 rounded text-[10px] font-mono font-bold"
                    >
                      Пополнить 100%
                    </button>
                  </div>
                </div>

                {/* Moderation Actions */}
                <div className="pt-2 border-t border-white/10 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                    Модерация аккаунта
                  </span>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      onClick={() => handleTogglePlayerStatus(selectedPlayer.id, 'active')}
                      className={`p-1.5 rounded-lg text-[10px] font-bold uppercase border ${
                        selectedPlayer.status === 'active'
                          ? 'bg-emerald-500 text-black border-emerald-400'
                          : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      Активен
                    </button>
                    <button
                      onClick={() => handleTogglePlayerStatus(selectedPlayer.id, 'muted')}
                      className={`p-1.5 rounded-lg text-[10px] font-bold uppercase border ${
                        selectedPlayer.status === 'muted'
                          ? 'bg-amber-500 text-black border-amber-400'
                          : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      Мут чата
                    </button>
                    <button
                      onClick={() => handleTogglePlayerStatus(selectedPlayer.id, 'banned')}
                      className={`p-1.5 rounded-lg text-[10px] font-bold uppercase border ${
                        selectedPlayer.status === 'banned'
                          ? 'bg-red-500 text-white border-red-400'
                          : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      Бан
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 p-4">
                <Users size={32} className="mb-2 opacity-40 text-cyan-300" />
                <p className="text-xs font-bold text-slate-400">Выберите игрока из списка</p>
                <p className="text-[10px] mt-1">
                  Для просмотра лога решений DQI, начисления валюты или изменения статуса
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: GAME BALANCE & CARDS CONFIGURATOR */}
      {activeTab === 'balance' && (
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {/* Economy Multipliers & DQI Formula Configuration */}
          <div className="bg-[#06101c] border border-cyan-500/30 rounded-2xl p-3.5 shadow-lg">
            <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-3">
              <span className="text-xs font-black uppercase text-white flex items-center gap-1.5">
                <Sliders size={14} className="text-cyan-300" />
                Формула Decision Quality Index (DQI) & Веса навыков
              </span>
              <span className="text-[10px] font-mono text-cyan-300 font-bold">
                Сумма: {dqiDisciplineWeight + dqiRiskWeight + dqiAnalysisWeight}%
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {/* Discipline Weight */}
              <div className="p-2.5 bg-white/5 rounded-xl border border-white/5">
                <div className="flex justify-between font-bold mb-1">
                  <span className="text-emerald-300">Вес Дисциплины</span>
                  <span className="font-mono">{dqiDisciplineWeight}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="60"
                  value={dqiDisciplineWeight}
                  onChange={e => setDqiDisciplineWeight(Number(e.target.value))}
                  className="w-full accent-emerald-400"
                />
                <span className="text-[9px] text-slate-500 block mt-1">Следование правилам и анти-тильт</span>
              </div>

              {/* Risk Weight */}
              <div className="p-2.5 bg-white/5 rounded-xl border border-white/5">
                <div className="flex justify-between font-bold mb-1">
                  <span className="text-amber-300">Вес Контроля Риска</span>
                  <span className="font-mono">{dqiRiskWeight}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="60"
                  value={dqiRiskWeight}
                  onChange={e => setDqiRiskWeight(Number(e.target.value))}
                  className="w-full accent-amber-400"
                />
                <span className="text-[9px] text-slate-500 block mt-1">Расчет R:R и сохранение капитала</span>
              </div>

              {/* Analysis Weight */}
              <div className="p-2.5 bg-white/5 rounded-xl border border-white/5">
                <div className="flex justify-between font-bold mb-1">
                  <span className="text-cyan-300">Вес Анализа Рынка</span>
                  <span className="font-mono">{dqiAnalysisWeight}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="60"
                  value={dqiAnalysisWeight}
                  onChange={e => setDqiAnalysisWeight(Number(e.target.value))}
                  className="w-full accent-cyan-400"
                />
                <span className="text-[9px] text-slate-500 block mt-1">Поиск манипуляций и паттернов</span>
              </div>
            </div>
          </div>

          {/* Cards Live Balancer Grid */}
          <div className="bg-[#06101c] border border-white/10 rounded-2xl p-3.5 shadow-lg">
            <div className="flex items-center justify-between pb-2 border-b border-white/5 mb-3">
              <span className="text-xs font-black uppercase text-white flex items-center gap-1.5">
                <Layers size={14} className="text-purple-400" />
                Живой тюнинг карт протоколов & решений ({liveCards.length} карт)
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                Изменения мгновенно влияют на бои
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {liveCards.map(c => (
                <div
                  key={c.id}
                  className="p-3 rounded-xl bg-[#091522] border border-white/10 flex flex-col justify-between text-xs"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-black text-white">{c.nameRu}</span>
                      <span className="text-[9px] font-mono uppercase bg-purple-950 text-purple-300 px-1.5 py-0.2 rounded border border-purple-500/30">
                        {c.category}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1 leading-tight">{c.effectRu}</div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between font-mono text-[11px]">
                    {/* Cost */}
                    <div className="flex items-center gap-1">
                      <span className="text-amber-400 font-bold">⚡{c.cost}</span>
                      <div className="flex flex-col">
                        <button
                          onClick={() => handleUpdateCardStat(c.id, 'cost', 1)}
                          className="text-[8px] bg-white/10 hover:bg-white/20 px-1 rounded"
                        >
                          ▲
                        </button>
                        <button
                          onClick={() => handleUpdateCardStat(c.id, 'cost', -1)}
                          className="text-[8px] bg-white/10 hover:bg-white/20 px-1 rounded"
                        >
                          ▼
                        </button>
                      </div>
                    </div>

                    {/* Clarity */}
                    <div className="flex items-center gap-1">
                      <span className="text-cyan-300 font-bold">+{c.clarityBonus} Ясн.</span>
                      <div className="flex flex-col">
                        <button
                          onClick={() => handleUpdateCardStat(c.id, 'clarityBonus', 5)}
                          className="text-[8px] bg-white/10 hover:bg-white/20 px-1 rounded"
                        >
                          ▲
                        </button>
                        <button
                          onClick={() => handleUpdateCardStat(c.id, 'clarityBonus', -5)}
                          className="text-[8px] bg-white/10 hover:bg-white/20 px-1 rounded"
                        >
                          ▼
                        </button>
                      </div>
                    </div>

                    {/* Shield */}
                    <div className="flex items-center gap-1">
                      <span className="text-emerald-300 font-bold">🛡️{c.noiseShield}</span>
                      <div className="flex flex-col">
                        <button
                          onClick={() => handleUpdateCardStat(c.id, 'noiseShield', 5)}
                          className="text-[8px] bg-white/10 hover:bg-white/20 px-1 rounded"
                        >
                          ▲
                        </button>
                        <button
                          onClick={() => handleUpdateCardStat(c.id, 'noiseShield', -5)}
                          className="text-[8px] bg-white/10 hover:bg-white/20 px-1 rounded"
                        >
                          ▼
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Boss Balance Configurator */}
          <div className="bg-[#06101c] border border-white/10 rounded-2xl p-3.5 shadow-lg">
            <div className="flex items-center justify-between pb-2 border-b border-white/5 mb-3">
              <span className="text-xs font-black uppercase text-white flex items-center gap-1.5">
                <ShieldAlert size={14} className="text-red-400" />
                Параметры Боссов & Рыночных Угроз
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {liveBosses.map(boss => (
                <div
                  key={boss.id}
                  className="p-3 rounded-xl bg-[#140810] border border-red-500/30 flex flex-col justify-between text-xs"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-black text-white">{boss.nameRu}</span>
                      <span className="text-[9px] font-mono bg-red-950 text-red-300 px-1.5 py-0.2 rounded border border-red-500/40">
                        Ур. {boss.threatLevel}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">{boss.intent.description}</p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between font-mono text-[11px]">
                    <div className="flex items-center gap-1">
                      <span className="text-red-300">HP: {boss.maxStability}</span>
                      <div className="flex flex-col">
                        <button
                          onClick={() => handleUpdateBossStat(boss.id, 'maxStability', 10)}
                          className="text-[8px] bg-white/10 hover:bg-white/20 px-1 rounded"
                        >
                          ▲
                        </button>
                        <button
                          onClick={() => handleUpdateBossStat(boss.id, 'maxStability', -10)}
                          className="text-[8px] bg-white/10 hover:bg-white/20 px-1 rounded"
                        >
                          ▼
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="text-amber-300">Угроза: {boss.threatLevel}</span>
                      <div className="flex flex-col">
                        <button
                          onClick={() => handleUpdateBossStat(boss.id, 'threatLevel', 1)}
                          className="text-[8px] bg-white/10 hover:bg-white/20 px-1 rounded"
                        >
                          ▲
                        </button>
                        <button
                          onClick={() => handleUpdateBossStat(boss.id, 'threatLevel', -1)}
                          className="text-[8px] bg-white/10 hover:bg-white/20 px-1 rounded"
                        >
                          ▼
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CMS CONTENT MANAGER */}
      {activeTab === 'cms' && (
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {/* Academy CMS */}
          <div className="bg-[#06101c] border border-cyan-500/30 rounded-2xl p-3.5 shadow-lg">
            <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-3">
              <span className="text-xs font-black uppercase text-white flex items-center gap-1.5">
                <BookOpen size={14} className="text-cyan-300" />
                Главы Академии & Уроки Совы ({ACADEMY_LESSONS.length} глав)
              </span>
              <button
                onClick={() => showToast('Новый урок Академии добавлен в черновики')}
                className="flex items-center gap-1 text-[10px] font-bold uppercase bg-cyan-400 text-black px-2 py-1 rounded-lg"
              >
                <Plus size={12} /> Добавить урок
              </button>
            </div>

            <div className="space-y-2">
              {ACADEMY_LESSONS.map((lesson, idx) => (
                <div
                  key={lesson.id}
                  className="p-2.5 rounded-xl bg-[#091522] border border-white/5 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-cyan-300 font-bold">0{idx + 1}.</span>
                    <div>
                      <div className="font-bold text-white">{lesson.titleRu}</div>
                      <div className="text-[10px] text-slate-400 truncate max-w-md">
                        {lesson.mentorQuoteRu}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-[10px]">
                    <span className="text-amber-300">+{lesson.xpReward} XP</span>
                    <button
                      onClick={() => showToast(`Редактор урока «${lesson.titleRu}» открыт`)}
                      className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-300"
                    >
                      <Edit3 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Puzzles CMS */}
          <div className="bg-[#06101c] border border-emerald-500/30 rounded-2xl p-3.5 shadow-lg">
            <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-3">
              <span className="text-xs font-black uppercase text-white flex items-center gap-1.5">
                <Puzzle size={14} className="text-emerald-400" />
                Банк Задач и Паттернов ({MARKET_PUZZLES.length} активных пазлов)
              </span>
              <button
                onClick={() => showToast('Новый пазл добавлен в базу')}
                className="flex items-center gap-1 text-[10px] font-bold uppercase bg-emerald-400 text-black px-2 py-1 rounded-lg"
              >
                <Plus size={12} /> Новый Пазл
              </button>
            </div>

            <div className="space-y-2">
              {MARKET_PUZZLES.map((puz, idx) => (
                <div
                  key={puz.id}
                  className="p-2.5 rounded-xl bg-[#091522] border border-white/5 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <span>#{idx + 1} {puz.titleRu}</span>
                      <span className="text-[9px] font-mono bg-cyan-950 text-cyan-300 px-1.5 py-0.2 rounded">
                        {puz.asset} ({puz.timeframe})
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{puz.marketContextRu}</div>
                  </div>

                  <button
                    onClick={() => showToast(`Редактор пазла «${puz.titleRu}» открыт`)}
                    className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-300"
                  >
                    <Edit3 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Narrative Stories CMS */}
          <div className="bg-[#06101c] border border-purple-500/30 rounded-2xl p-3.5 shadow-lg">
            <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-3">
              <span className="text-xs font-black uppercase text-white flex items-center gap-1.5">
                <Layers size={14} className="text-purple-400" />
                Исторические Сюжетные Хроники ({STORY_SCENARIOS.length} сценариев)
              </span>
            </div>

            <div className="space-y-2">
              {STORY_SCENARIOS.map(story => (
                <div
                  key={story.id}
                  className="p-2.5 rounded-xl bg-[#091522] border border-white/5 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <span className="font-mono text-amber-300">{story.year}</span>
                      <span>{story.titleRu}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5 truncate max-w-md">
                      {story.newsFlashRu}
                    </div>
                  </div>

                  <button
                    onClick={() => showToast(`Редактор сценария «${story.year}» открыт`)}
                    className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-300"
                  >
                    <Edit3 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: LIVEOPS, EVENTS & PUSH BROADCASTS */}
      {activeTab === 'liveops' && (
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {/* Push Broadcast Console */}
          <div className="bg-[#091522] border border-cyan-500/30 rounded-2xl p-4 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-3">
              <span className="text-xs font-black uppercase text-white flex items-center gap-1.5">
                <Radio size={15} className="text-red-400 animate-pulse" />
                Глобальная Рассылка (Push / In-Game Mail Broadcast)
              </span>
              <span className="text-[10px] font-mono text-cyan-300">Охват: ~24,850 онлайн</span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={broadcastTitle}
                  onChange={e => setBroadcastTitle(e.target.value)}
                  placeholder="Заголовок (напр. «ФРС экстренно меняет ставку: +50% XP в Арене!»)..."
                  className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />

                <select
                  value={broadcastType}
                  onChange={e => setBroadcastType(e.target.value as typeof broadcastType)}
                  className="bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-slate-300 font-mono text-xs focus:outline-none"
                >
                  <option value="urgent">🔴 Срочная новость</option>
                  <option value="event">🏆 Турнир / Ивент</option>
                  <option value="maintenance">⚙️ Техработы</option>
                </select>
              </div>

              <textarea
                value={broadcastMessage}
                onChange={e => setBroadcastMessage(e.target.value)}
                rows={3}
                placeholder="Текст уведомления игрокам с описанием рыночной аномалии и наградами..."
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 resize-none"
              />

              <div className="flex justify-end">
                <button
                  onClick={handleSendBroadcast}
                  className="flex items-center gap-1.5 bg-gradient-to-r from-red-500 to-amber-500 text-black font-black text-xs uppercase px-5 py-2 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg cursor-pointer"
                >
                  <Send size={14} />
                  <span>Отправить Push всем игрокам</span>
                </button>
              </div>
            </div>
          </div>

          {/* A/B Feature Flags Matrix */}
          <div className="bg-[#06101c] border border-white/10 rounded-2xl p-4 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-3">
              <span className="text-xs font-black uppercase text-white flex items-center gap-1.5">
                <Cpu size={14} className="text-cyan-300" />
                A/B Тестирование & Feature Flags в реальном времени
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              {Object.entries(abFlags).map(([key, isEnabled]) => (
                <div
                  key={key}
                  className="p-3 bg-[#091522] rounded-xl border border-white/5 flex items-center justify-between"
                >
                  <div>
                    <div className="font-mono text-white font-bold">{key}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {key === 'duolingo_voiceover'
                        ? 'Озвучка Совы через Web Audio'
                        : key === 'dynamic_timeframe_puzzles'
                        ? 'Динамическая смена таймфреймов в пазлах'
                        : key === 'hardcore_no_undo'
                        ? 'Хардкор режим без отмены карты'
                        : key === 'guild_tournaments_v2'
                        ? 'Клановые DQI турниры 2.0'
                        : 'Адаптивные подсказки наставника'}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      playSound('click');
                      setAbFlags(prev => ({
                        ...prev,
                        [key]: !prev[key as keyof typeof abFlags],
                      }));
                      showToast(`Флаг ${key} переключен`);
                    }}
                    className={`w-11 h-6 rounded-full transition-colors relative ${
                      isEnabled ? 'bg-emerald-400' : 'bg-white/20'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-black absolute top-1 transition-transform ${
                        isEnabled ? 'right-1' : 'left-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: DQI TELEMETRY & CHURN ANALYTICS */}
      {activeTab === 'telemetry' && (
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          <div className="bg-[#091522] border border-cyan-500/30 rounded-2xl p-4 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-3">
              <span className="text-xs font-black uppercase text-white flex items-center gap-1.5">
                <Activity size={15} className="text-cyan-300" />
                Распределение качества решений игроков (DQI Bell Curve)
              </span>
              <span className="text-[10px] font-mono text-amber-300">Выборка: 124,000 сессий</span>
            </div>

            {/* Simulated Bell Curve */}
            <div className="h-32 w-full flex items-end justify-between gap-1 px-2 pt-4 bg-black/40 rounded-xl border border-white/5">
              {[8, 14, 22, 38, 55, 76, 94, 88, 70, 52, 34, 18, 9].map((height, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className={`w-full rounded-t transition-all ${
                      idx >= 5 && idx <= 8
                        ? 'bg-gradient-to-t from-cyan-500 to-emerald-400'
                        : 'bg-white/20'
                    }`}
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-[8px] font-mono text-slate-500">
                    {idx * 8 + 10}%
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-slate-400 pt-2 border-t border-white/5">
              <span>Нижний квартиль (&lt;50% DQI): 12% игроков</span>
              <span className="text-cyan-300 font-bold">Медиана: 78.4% DQI</span>
              <span className="text-amber-300">Топ Мастера (&gt;90% DQI): 14% игроков</span>
            </div>
          </div>

          {/* Critical Churn Alerts */}
          <div className="bg-[#180a0e] border border-red-500/40 rounded-2xl p-4 shadow-xl">
            <span className="text-xs font-black uppercase text-red-300 flex items-center gap-1.5 mb-2">
              <AlertTriangle size={15} className="text-red-400 animate-pulse" />
              Автоматические алерты геймдизайнеру (Live Churn Signals)
            </span>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-red-950/60 border border-red-500/30 rounded-xl text-red-200 flex items-center justify-between">
                <span>⚠️ <strong>Пазл #2 (Liquidity Sweep):</strong> 62% игроков выбирают неверный вариант A</span>
                <button
                  onClick={() => showToast('Сложность Пазла #2 снижена на 15%')}
                  className="px-2 py-1 bg-red-500 text-black font-bold text-[10px] rounded uppercase"
                >
                  Смягчить
                </button>
              </div>
              <div className="p-2.5 bg-amber-950/60 border border-amber-500/30 rounded-xl text-amber-200 flex items-center justify-between">
                <span>⚡ <strong>Босс Леверидж-Гоблин:</strong> 28% новичков теряют щит на 2 ходу</span>
                <button
                  onClick={() => showToast('Урон босса снижен на 5 ед.')}
                  className="px-2 py-1 bg-amber-400 text-black font-bold text-[10px] rounded uppercase"
                >
                  Балансировать
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
