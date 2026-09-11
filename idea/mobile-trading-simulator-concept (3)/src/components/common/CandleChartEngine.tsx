import React, { useEffect, useRef, useState } from 'react';
import { RefreshCw, Eye } from 'lucide-react';

interface CandleData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  buyVolume: number;
  sellVolume: number;
  annotation?: string;
  isSweep?: boolean;
}

const INITIAL_CANDLES: CandleData[] = [
  { time: '10:00', open: 64200, high: 64600, low: 64150, close: 64550, volume: 450, buyVolume: 320, sellVolume: 130 },
  { time: '10:15', open: 64550, high: 64800, low: 64400, close: 64750, volume: 520, buyVolume: 390, sellVolume: 130 },
  { time: '10:30', open: 64750, high: 65100, low: 64650, close: 64900, volume: 680, buyVolume: 410, sellVolume: 270 },
  { time: '10:45', open: 64900, high: 65400, low: 64850, close: 65350, volume: 890, buyVolume: 650, sellVolume: 240 },
  { time: '11:00', open: 65350, high: 65650, low: 65200, close: 65500, volume: 920, buyVolume: 510, sellVolume: 410, annotation: 'Ключевое сопротивление' },
  { time: '11:15', open: 65500, high: 66200, low: 65300, close: 65420, volume: 1450, buyVolume: 600, sellVolume: 850, isSweep: true, annotation: '⚡ Снятие ликвидности (SFP / Sweep)' },
  { time: '11:30', open: 65420, high: 65500, low: 64800, close: 64950, volume: 1100, buyVolume: 280, sellVolume: 820 },
  { time: '11:45', open: 64950, high: 65100, low: 64300, close: 64450, volume: 980, buyVolume: 310, sellVolume: 670, annotation: 'Слом структуры (BOS)' },
  { time: '12:00', open: 64450, high: 64600, low: 63900, close: 64100, volume: 1320, buyVolume: 400, sellVolume: 920 },
  { time: '12:15', open: 64100, high: 64350, low: 63800, close: 64250, volume: 750, buyVolume: 480, sellVolume: 270, annotation: 'Тест поддержки' },
];

export const CandleChartEngine: React.FC<{
  height?: number;
  showVolumeProfile?: boolean;
  showFootprint?: boolean;
}> = ({ height = 240, showVolumeProfile = true, showFootprint = false }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [candles, setCandles] = useState<CandleData[]>(INITIAL_CANDLES);
  const [showAnnotations, setShowAnnotations] = useState(true);
  const zoomLevel = 1;
  const [liveStream, setLiveStream] = useState(false);

  // 60 FPS Render loop using pure 2D Canvas (Prototype for Phaser 4 Graphics Renderer)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI retina screens
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;

    // Background Clear
    ctx.fillStyle = '#06101c';
    ctx.fillRect(0, 0, w, h);

    // Calculate Min / Max
    const allPrices = candles.flatMap((c) => [c.high, c.low]);
    const minPrice = Math.min(...allPrices) - 100;
    const maxPrice = Math.max(...allPrices) + 150;
    const priceRange = maxPrice - minPrice || 1;

    const chartHeight = h - 50; // Reserve 50px for volume sub-chart
    const getY = (price: number) => chartHeight - ((price - minPrice) / priceRange) * (chartHeight - 30) - 15;

    // Grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);

    for (let i = 0; i < 5; i++) {
      const p = minPrice + (priceRange / 4) * i;
      const y = getY(p);
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w - 65, y);
      ctx.stroke();

      // Price labels on right axis
      ctx.setLineDash([]);
      ctx.fillStyle = 'rgba(148, 163, 184, 0.6)';
      ctx.font = '9px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`$${Math.round(p).toLocaleString()}`, w - 60, y + 3);
      ctx.setLineDash([4, 4]);
    }
    ctx.setLineDash([]);

    // Candle Geometry
    const totalCount = candles.length;
    const candleAreaWidth = w - 70;
    const candleSpacing = candleAreaWidth / totalCount;
    const candleWidth = Math.max(6, candleSpacing * 0.65 * zoomLevel);

    // Render Candlesticks
    candles.forEach((c, idx) => {
      const x = 20 + idx * candleSpacing + candleSpacing / 2;
      const isGreen = c.close >= c.open;
      const primaryColor = isGreen ? '#10b981' : '#ef4444';
      const wickColor = isGreen ? '#34d399' : '#f87171';

      const openY = getY(c.open);
      const closeY = getY(c.close);
      const highY = getY(c.high);
      const lowY = getY(c.low);

      // Wick
      ctx.strokeStyle = wickColor;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x, highY);
      ctx.lineTo(x, lowY);
      ctx.stroke();

      // Body
      const bodyTop = Math.min(openY, closeY);
      const bodyHeight = Math.max(3, Math.abs(openY - closeY));

      ctx.fillStyle = primaryColor;
      ctx.fillRect(x - candleWidth / 2, bodyTop, candleWidth, bodyHeight);

      // Volume Bars at bottom
      const maxVol = Math.max(...candles.map((cd) => cd.volume)) || 1;
      const volHeight = (c.volume / maxVol) * 35;
      const volY = h - volHeight - 5;

      ctx.fillStyle = isGreen ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)';
      ctx.fillRect(x - candleWidth / 2, volY, candleWidth, volHeight);

      // Footprint Order Flow Sub-blocks (if enabled)
      if (showFootprint && candleWidth > 18) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '7px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`${c.buyVolume}`, x, bodyTop + 6);
        ctx.fillStyle = 'rgba(239, 68, 68, 0.9)';
        ctx.fillText(`${c.sellVolume}`, x, bodyTop + bodyHeight - 2);
      }

      // Annotations (SFP / BOS / Resistance)
      if (showAnnotations && c.annotation) {
        ctx.fillStyle = c.isSweep ? '#f59e0b' : '#38bdf8';
        ctx.font = 'bold 8px sans-serif';
        ctx.textAlign = 'center';

        // Little callout badge
        const badgeY = highY - 12;
        ctx.fillText(c.annotation, x, badgeY);

        // Arrow marker
        ctx.beginPath();
        ctx.moveTo(x, highY - 3);
        ctx.lineTo(x - 3, highY - 8);
        ctx.lineTo(x + 3, highY - 8);
        ctx.closePath();
        ctx.fill();
      }
    });

    // Volume Profile Sidebar (Heatmap on left)
    if (showVolumeProfile) {
      ctx.fillStyle = 'rgba(6, 182, 212, 0.08)';
      ctx.fillRect(0, 0, 45, chartHeight);
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.2)';
      ctx.strokeRect(0, 0, 45, chartHeight);

      // POC line (Point of Control)
      const pocY = getY(65400);
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 2]);
      ctx.beginPath();
      ctx.moveTo(0, pocY);
      ctx.lineTo(w - 70, pocY);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 8px monospace';
      ctx.fillText('POC (Пул Объема)', 50, pocY - 3);
    }
  }, [candles, zoomLevel, showAnnotations, showVolumeProfile, showFootprint]);

  // Live Stream Simulation
  useEffect(() => {
    if (!liveStream) return;
    const interval = setInterval(() => {
      setCandles((prev) => {
        const last = prev[prev.length - 1];
        const change = (Math.random() - 0.48) * 80;
        const newClose = Math.round(last.close + change);
        const newHigh = Math.max(last.high, newClose + Math.random() * 20);
        const newLow = Math.min(last.low, newClose - Math.random() * 20);
        const updated = [...prev.slice(0, -1), { ...last, close: newClose, high: newHigh, low: newLow, volume: last.volume + 10 }];
        return updated;
      });
    }, 600);
    return () => clearInterval(interval);
  }, [liveStream]);

  return (
    <div className="bg-[#040c16] border border-cyan-500/30 rounded-xl overflow-hidden p-2 shadow-xl flex flex-col justify-between">
      {/* Engine Controls Header */}
      <div className="flex items-center justify-between pb-1.5 px-1 border-b border-white/10 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-mono font-black text-cyan-300 flex items-center gap-1 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            CANVAS CANDLE ENGINE (PHASER GRAPHICS PROTOTYPE)
          </span>
          <span className="text-[9px] bg-cyan-950 text-cyan-300 px-1.5 py-0.2 rounded border border-cyan-800 font-mono">
            BTC/USDT 15M
          </span>
        </div>

        <div className="flex items-center gap-1 text-[10px]">
          <button
            onClick={() => setLiveStream(!liveStream)}
            className={`px-2 py-0.5 rounded font-mono font-bold flex items-center gap-1 transition-all ${
              liveStream ? 'bg-red-500 text-black' : 'bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            <RefreshCw size={10} className={liveStream ? 'animate-spin' : ''} />
            {liveStream ? 'LIVE 60FPS' : 'STATIC'}
          </button>

          <button
            onClick={() => setShowAnnotations(!showAnnotations)}
            className={`px-2 py-0.5 rounded font-mono font-bold flex items-center gap-1 ${
              showAnnotations ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-white/5 text-slate-400'
            }`}
            title="Переключить аннотации паттернов"
          >
            <Eye size={10} /> Сигналы
          </button>
        </div>
      </div>

      {/* Render Canvas */}
      <div className="relative w-full my-1" style={{ height: `${height}px` }}>
        <canvas ref={canvasRef} className="w-full h-full rounded-lg" />
      </div>

      {/* Footer Indicators */}
      <div className="flex items-center justify-between px-1 text-[9px] font-mono text-slate-400 pt-1 border-t border-white/5">
        <div className="flex gap-3">
          <span className="text-emerald-400">● Спот Спрос: 68%</span>
          <span className="text-red-400">● Перп Продажи: 32%</span>
          <span className="text-amber-400">● Дельта OI: -$45M</span>
        </div>
        <span className="text-slate-500">Рендерер: 0мс задержка / Pure Canvas 2D</span>
      </div>
    </div>
  );
};
