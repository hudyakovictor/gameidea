import React from 'react';
import { GameCard, CardCategory } from '../../types/game';
import {
  ShieldCheck,
  Radio,
  PauseCircle,
  Layers,
  Scale,
  Sparkles,
  DoorClosed,
  CheckCircle2,
  Lock,
  Ban,
  CloudRain,
  TrendingUp,
  BarChart2,
  Globe,
  Cpu,
  Newspaper,
  ShieldAlert,
  Gauge,
  ZapOff,
  Zap,
} from 'lucide-react';

interface CardViewProps {
  card: GameCard;
  selected?: boolean;
  compact?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  onInspect?: () => void;
}

const ICONS_MAP: Record<string, React.ElementType> = {
  ShieldCheck,
  Radio,
  PauseCircle,
  Layers,
  Scale,
  Sparkles,
  DoorClosed,
  CheckCircle2,
  Lock,
  Ban,
  CloudRain,
  TrendingUp,
  BarChart2,
  Globe,
  Cpu,
  Newspaper,
  ShieldAlert,
  Gauge,
  ZapOff,
};

const CATEGORY_THEMES: Record<CardCategory, {
  borderColor: string;
  glowColor: string;
  bgGradient: string;
  badgeBg: string;
  badgeText: string;
  tagRu: string;
  accentHex: string;
}> = {
  protocol: {
    borderColor: 'border-purple-500/70',
    glowColor: 'shadow-purple-500/20',
    bgGradient: 'from-[#170a2c] via-[#0c081e] to-[#060412]',
    badgeBg: 'bg-purple-900/60 border-purple-400/40 text-purple-200',
    badgeText: 'text-purple-300',
    tagRu: 'ПРОТОКОЛ',
    accentHex: '#a855f7',
  },
  decision: {
    borderColor: 'border-emerald-500/70',
    glowColor: 'shadow-emerald-500/20',
    bgGradient: 'from-[#08241b] via-[#061814] to-[#040e0c]',
    badgeBg: 'bg-emerald-900/60 border-emerald-400/40 text-emerald-200',
    badgeText: 'text-emerald-300',
    tagRu: 'РЕШЕНИЕ',
    accentHex: '#10b981',
  },
  reading: {
    borderColor: 'border-cyan-500/70',
    glowColor: 'shadow-cyan-500/20',
    bgGradient: 'from-[#07242d] via-[#051720] to-[#030d14]',
    badgeBg: 'bg-cyan-900/60 border-cyan-400/40 text-cyan-200',
    badgeText: 'text-cyan-300',
    tagRu: 'ЧТЕНИЕ',
    accentHex: '#06b6d4',
  },
  defense: {
    borderColor: 'border-amber-500/70',
    glowColor: 'shadow-amber-500/20',
    bgGradient: 'from-[#2a1b08] via-[#1a1206] to-[#0d0903]',
    badgeBg: 'bg-amber-900/60 border-amber-400/40 text-amber-200',
    badgeText: 'text-amber-300',
    tagRu: 'ЗАЩИТА',
    accentHex: '#f59e0b',
  },
};

export const CardView: React.FC<CardViewProps> = ({
  card,
  selected = false,
  compact = false,
  disabled = false,
  onClick,
  onInspect,
}) => {
  const theme = CATEGORY_THEMES[card.category] || CATEGORY_THEMES.protocol;
  const IconComponent = ICONS_MAP[card.iconName] || ShieldCheck;

  return (
    <div
      onClick={!disabled ? onClick : undefined}
      className={`relative group select-none transition-all duration-200 cursor-pointer rounded-xl overflow-hidden border ${
        theme.borderColor
      } bg-gradient-to-b ${theme.bgGradient} ${
        selected
          ? `scale-[1.03] ring-2 ring-white shadow-xl ${theme.glowColor} -translate-y-1`
          : 'hover:scale-[1.02] hover:-translate-y-0.5 shadow-md'
      } ${disabled ? 'opacity-40 grayscale cursor-not-allowed' : ''} ${
        compact ? 'p-2 min-h-[140px]' : 'p-3 min-h-[220px]'
      }`}
      style={{
        boxShadow: selected
          ? `0 0 20px ${theme.accentHex}40, inset 0 0 15px ${theme.accentHex}20`
          : undefined,
      }}
    >
      {/* Corner Tech Accents */}
      <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-white/40" />
      <div className="absolute top-1 right-1 w-2 h-2 border-t border-r border-white/40" />
      <div className="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-white/40" />
      <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-white/40" />

      {/* Header: Tag + Cost */}
      <div className="flex items-center justify-between gap-1 mb-1.5">
        <span
          className={`px-1.5 py-0.5 rounded text-[9px] font-black tracking-wider uppercase border ${theme.badgeBg}`}
        >
          {theme.tagRu}
        </span>
        <div className="flex items-center gap-1">
          <span className="flex items-center text-[10px] font-bold text-amber-300 bg-black/40 px-1 py-0.5 rounded border border-amber-500/30">
            <Zap size={10} className="mr-0.5 fill-amber-300" />
            {card.cost}
          </span>
          {onInspect && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onInspect();
              }}
              className="text-[9px] text-slate-400 hover:text-white px-1 py-0.5 bg-white/5 rounded"
              title="Инфо"
            >
              ℹ️
            </button>
          )}
        </div>
      </div>

      {/* Central Icon Illustration with Radial Halo */}
      <div className="relative my-2 flex items-center justify-center">
        <div
          className="absolute w-12 h-12 rounded-full blur-md opacity-30"
          style={{ backgroundColor: theme.accentHex }}
        />
        <div
          className={`relative z-10 p-2.5 rounded-lg border border-white/20 bg-black/50 shadow-inner`}
          style={{ borderColor: `${theme.accentHex}50` }}
        >
          <IconComponent
            size={compact ? 22 : 30}
            style={{ color: theme.accentHex }}
            strokeWidth={2}
          />
        </div>
      </div>

      {/* Title */}
      <div className="text-center px-1">
        <h4
          className={`font-black uppercase tracking-tight leading-tight text-white ${
            compact ? 'text-[11px]' : 'text-[13px]'
          }`}
        >
          {card.nameRu}
        </h4>
        <p className="text-[8px] tracking-widest text-slate-400 uppercase font-mono mt-0.5">
          {card.name}
        </p>
      </div>

      {/* Effect Description */}
      {!compact && (
        <div className="mt-2 text-[10px] text-slate-300 leading-snug bg-black/40 p-1.5 rounded border border-white/5">
          {card.effectRu}
        </div>
      )}

      {/* Bottom Footer: Stats / Level */}
      <div className="mt-2 pt-1 border-t border-white/10 flex items-center justify-between text-[9px] font-mono text-slate-400">
        <span className="text-emerald-300 font-bold">
          +{card.clarityBonus} Ясн.
        </span>
        <span className="text-amber-300">
          Ур. {card.level}/{card.maxLevel}
        </span>
      </div>
    </div>
  );
};
