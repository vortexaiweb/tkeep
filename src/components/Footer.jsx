import React from 'react';
import { Send, Sparkles, ShieldCheck } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="w-full glass-panel border-t border-gray-800/80 mt-20 py-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* Brand & Info */}
        <div className="flex flex-col items-center md:items-start gap-2.5 text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#FF758F] via-rose-500 to-pink-600 flex items-center justify-center shadow-lg shadow-[#FF758F]/25">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-white via-gray-100 to-[#FF758F] bg-clip-text text-transparent">
              tkeep
            </span>
          </div>
          <p className="text-xs text-gray-400 max-w-sm font-medium leading-relaxed">
            Витрина актуальных услуг и выполненных работ. Все права защищены © {new Date().getFullYear()} tkeep.
          </p>
        </div>

        {/* TELEGRAM CONTACT BANNER (t.me/tkeepk) */}
        <div className="flex flex-col items-center gap-3">
          <a
            href="https://t.me/tkeepk"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-4 px-8 py-4 rounded-3xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 hover:from-rose-400 hover:to-pink-400 text-white font-black text-sm sm:text-base transition-all duration-300 shadow-2xl shadow-rose-500/30 hover:shadow-rose-500/50 hover:-translate-y-1"
          >
            <div className="w-9 h-9 rounded-2xl bg-white/20 flex items-center justify-center">
              <Send className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
            </div>
            <div className="flex flex-col text-left leading-tight">
              <span className="text-[10px] text-pink-100 uppercase tracking-widest font-extrabold">Связаться в Telegram</span>
              <span className="text-base font-black">t.me/tkeepk</span>
            </div>
          </a>
        </div>

      </div>
    </footer>
  );
};
