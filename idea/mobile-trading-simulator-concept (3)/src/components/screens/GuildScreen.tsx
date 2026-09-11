import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { GUILD_MESSAGES } from '../../data/social';
import { GuildMessage } from '../../types/game';
import {
  Users,
  Send,
  Heart,
  Sparkles,
  Layers,
} from 'lucide-react';

export const GuildScreen: React.FC = () => {
  const { playSound } = useGame();
  const [messages, setMessages] = useState<GuildMessage[]>(GUILD_MESSAGES);
  const [inputText, setInputText] = useState('');

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    playSound('click');

    const newMsg: GuildMessage = {
      id: `m-${Date.now()}`,
      sender: 'NovaTrader',
      avatar: '👤',
      time: 'Только что',
      messageRu: inputText.trim(),
      likes: 0,
      attachedCard: 'ТОЛЬКО ФАКТЫ',
      attachedDQI: 86,
    };

    setMessages([...messages, newMsg]);
    setInputText('');
  };

  const handleLike = (id: string) => {
    playSound('click');
    setMessages(
      messages.map((m) => (m.id === id ? { ...m, likes: m.likes + 1 } : m))
    );
  };

  return (
    <div className="h-full flex flex-col justify-between overflow-hidden p-3 sm:p-4 max-w-5xl mx-auto w-full select-none">
      {/* Guild Header Info */}
      <div className="bg-[#091522] border border-cyan-500/30 p-3 rounded-xl shadow-lg flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-400 p-0.5 shadow-md">
            <div className="w-full h-full bg-[#06101c] rounded-xl flex items-center justify-center text-cyan-300">
              <Users size={22} />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-black text-white uppercase">
                Cashflow Crew
              </h2>
              <span className="text-[9px] font-mono bg-purple-950 text-purple-300 px-1.5 py-0.2 rounded border border-purple-500/30">
                Гильдия 124 чел.
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              «Учимся на исторических кризисах, разбираем ошибки, растем вместе.»
            </p>
          </div>
        </div>

        <span className="hidden sm:inline text-xs font-mono text-emerald-400 font-bold bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-500/30">
          ● 18 онлайн
        </span>
      </div>

      {/* Live Chat Feed */}
      <div className="my-2.5 flex-1 bg-[#06101c]/90 border border-white/10 rounded-2xl p-3 sm:p-4 overflow-y-auto space-y-3 shadow-inner">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all flex items-start gap-3"
          >
            <span className="text-xl flex-shrink-0">{msg.avatar}</span>

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-white">{msg.sender}</span>
                <span className="text-[10px] text-slate-500 font-mono">{msg.time}</span>
              </div>

              <p className="text-xs text-slate-200 mt-1 leading-relaxed">
                {msg.messageRu}
              </p>

              {/* Attached Card or DQI badge */}
              {(msg.attachedCard || msg.attachedDQI) && (
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {msg.attachedCard && (
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-400/40 text-cyan-300 flex items-center gap-1 font-bold">
                      <Layers size={10} /> Протокол: {msg.attachedCard}
                    </span>
                  )}
                  {msg.attachedDQI && (
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-amber-950/80 border border-amber-400/40 text-amber-300 flex items-center gap-1 font-bold">
                      <Sparkles size={10} /> DQI: {msg.attachedDQI}%
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Like Button */}
            <button
              onClick={() => handleLike(msg.id)}
              className="flex items-center gap-1 text-[10px] font-mono text-slate-400 hover:text-red-400 bg-black/40 px-2 py-1 rounded-lg border border-white/5"
            >
              <Heart size={12} className={msg.likes > 0 ? 'fill-red-500 text-red-500' : ''} />
              <span>{msg.likes}</span>
            </button>
          </div>
        ))}
      </div>

      {/* Chat Input Bar */}
      <div className="bg-[#091522] border border-white/10 rounded-xl p-2 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Обсудить тактику или поделиться разбором сессии..."
          className="flex-1 bg-transparent px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none"
        />

        <button
          onClick={handleSendMessage}
          className="p-2 rounded-lg bg-cyan-400 text-black hover:bg-cyan-300 transition-colors cursor-pointer"
        >
          <Send size={15} />
        </button>
      </div>
    </div>
  );
};
