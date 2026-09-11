import React from 'react';
import { useGame } from '../../context/GameContext';
import {
  Settings,
  X,
  Volume2,
  VolumeX,
  Smartphone,
  Shield,
} from 'lucide-react';

export const SettingsModal: React.FC = () => {
  const {
    settingsModalOpen,
    setSettingsModalOpen,
    soundEnabled,
    setSoundEnabled,
    playSound,
  } = useGame();

  if (!settingsModalOpen) return null;

  const handleClose = () => {
    playSound('click');
    setSettingsModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 animate-fadeIn select-none">
      <div className="bg-[#091522] border border-cyan-400/40 rounded-2xl max-w-md w-full p-4 sm:p-5 shadow-2xl relative">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Settings size={18} className="text-cyan-300" />
            <h2 className="text-sm sm:text-base font-black text-white uppercase tracking-tight">
              Настройки игры
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-white border border-white/10"
          >
            <X size={16} />
          </button>
        </div>

        <div className="my-4 space-y-3">
          {/* Sound Toggle */}
          <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {soundEnabled ? (
                <Volume2 size={18} className="text-cyan-300" />
              ) : (
                <VolumeX size={18} className="text-slate-500" />
              )}
              <div>
                <div className="text-xs font-bold text-white">Звуковые эффекты (Web Audio)</div>
                <div className="text-[10px] text-slate-400">Синтез кликов, атак и наград</div>
              </div>
            </div>

            <button
              onClick={() => {
                playSound('click');
                setSoundEnabled(!soundEnabled);
              }}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                soundEnabled ? 'bg-cyan-400' : 'bg-white/20'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-black absolute top-1 transition-transform ${
                  soundEnabled ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Haptic / Animation */}
          <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Smartphone size={18} className="text-emerald-300" />
              <div>
                <div className="text-xs font-bold text-white">Анимации 60 FPS (Framer Motion)</div>
                <div className="text-[10px] text-slate-400">Плавные переходы между экранами</div>
              </div>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
              ВКЛ
            </span>
          </div>

          {/* Game Rules Integrity */}
          <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Shield size={18} className="text-amber-300" />
              <div>
                <div className="text-xs font-bold text-white">Режим без ордеров (Pure DQI)</div>
                <div className="text-[10px] text-slate-400">Только логика и управление риском</div>
              </div>
            </div>
            <span className="text-[10px] font-mono text-amber-300 bg-amber-950 px-2 py-0.5 rounded border border-amber-500/30">
              АКТИВЕН
            </span>
          </div>
        </div>

        <div className="pt-3 border-t border-white/10 flex justify-end">
          <button
            onClick={handleClose}
            className="px-5 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-black text-xs uppercase cursor-pointer"
          >
            Готово
          </button>
        </div>
      </div>
    </div>
  );
};
