import React, { useState } from 'react';
import { useGame, GameScreen } from '../../context/GameContext';
import {
  Home,
  Swords,
  Map,
  GraduationCap,
  Puzzle,
  Layers,
  Trophy,
  Users,
  BarChart3,
  User,
  Scroll,
  MoreHorizontal,
  X,
} from 'lucide-react';

interface NavItem {
  id: GameScreen;
  labelRu: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
}

const PRIMARY_NAV: NavItem[] = [
  { id: 'lobby', labelRu: 'Лобби', icon: Home },
  { id: 'battler', labelRu: 'Арена', icon: Swords, badge: 'HOT', badgeColor: 'bg-red-500' },
  { id: 'map', labelRu: 'Кампания', icon: Map },
  { id: 'academy', labelRu: 'Академия', icon: GraduationCap, badge: 'NEW', badgeColor: 'bg-cyan-500' },
  { id: 'puzzle', labelRu: 'Пазлы', icon: Puzzle },
  { id: 'deck', labelRu: 'Колода', icon: Layers },
];

const SECONDARY_NAV: NavItem[] = [
  { id: 'story', labelRu: 'Нарратив', icon: Scroll },
  { id: 'social', labelRu: 'Лиги & Турниры', icon: Trophy },
  { id: 'guild', labelRu: 'Гильдия & Чат', icon: Users },
  { id: 'stats', labelRu: 'Аналитика', icon: BarChart3 },
  { id: 'profile', labelRu: 'Профиль & RPG', icon: User },
  { id: 'admin', labelRu: 'Admin CRM (ИИ)', icon: Trophy, badge: 'AI', badgeColor: 'bg-purple-500' },
  { id: 'developers', labelRu: 'Для Разработчиков', icon: BarChart3 },
];

export const BottomNav: React.FC = () => {
  const { currentScreen, setCurrentScreen } = useGame();
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  return (
    <>
      {/* Secondary Drawer Modal */}
      {moreMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm flex flex-col justify-end p-3 animate-fadeIn"
          onClick={() => setMoreMenuOpen(false)}
        >
          <div
            className="bg-[#091524] border border-cyan-500/30 rounded-2xl p-4 shadow-2xl mb-14 max-w-md mx-auto w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
              <span className="text-xs font-black uppercase tracking-wider text-cyan-300">
                Все разделы игры
              </span>
              <button
                onClick={() => setMoreMenuOpen(false)}
                className="p-1 rounded bg-white/5 text-slate-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {SECONDARY_NAV.map((item) => {
                const Icon = item.icon;
                const isActive = currentScreen === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentScreen(item.id);
                      setMoreMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 p-2.5 rounded-xl border text-left transition-all ${
                      isActive
                        ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300 shadow-lg shadow-cyan-950/50'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg ${
                        isActive ? 'bg-cyan-500/20 text-cyan-300' : 'bg-white/5 text-slate-400'
                      }`}
                    >
                      <Icon size={18} />
                    </div>
                    <div>
                      <div className="text-xs font-bold leading-none">{item.labelRu}</div>
                      <div className="text-[9px] text-slate-500 font-mono mt-1">
                        {item.id.toUpperCase()}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Main Bottom Dock */}
      <nav className="h-[62px] min-h-[62px] bg-[#07111e]/98 backdrop-blur-xl border-t border-white/10 px-2 flex items-center justify-around z-30 select-none">
        {PRIMARY_NAV.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setCurrentScreen(item.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all duration-150 ${
                isActive
                  ? 'text-cyan-300 scale-105'
                  : 'text-slate-400 hover:text-slate-200 hover:scale-100'
              }`}
            >
              {/* Active Ambient Glow */}
              {isActive && (
                <div className="absolute inset-0 bg-cyan-400/10 rounded-xl blur-sm -z-10" />
              )}

              {/* Icon Container with Badge */}
              <div className="relative">
                <Icon
                  size={20}
                  className={isActive ? 'text-cyan-300 drop-shadow-[0_0_8px_rgba(105,231,223,0.6)]' : ''}
                />
                {item.badge && (
                  <span
                    className={`absolute -top-1.5 -right-2.5 ${item.badgeColor} text-black font-black text-[8px] px-1 py-0.2 rounded-full leading-none animate-pulse`}
                  >
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Label */}
              <span
                className={`text-[10px] font-bold tracking-tight mt-1 leading-none ${
                  isActive ? 'text-cyan-200' : 'text-slate-400'
                }`}
              >
                {item.labelRu}
              </span>

              {/* Bottom Active Indicator Pill */}
              {isActive && (
                <div className="w-3 h-0.5 bg-cyan-300 rounded-full mt-0.5 shadow-[0_0_6px_#69e7df]" />
              )}
            </button>
          );
        })}

        {/* More Button */}
        <button
          onClick={() => setMoreMenuOpen(!moreMenuOpen)}
          className={`relative flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
            moreMenuOpen ? 'text-amber-300' : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Все режимы"
        >
          <MoreHorizontal size={20} />
          <span className="text-[10px] font-bold tracking-tight mt-1 leading-none">
            Ещё
          </span>
        </button>
      </nav>
    </>
  );
};
