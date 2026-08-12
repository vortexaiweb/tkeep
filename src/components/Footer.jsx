import React from 'react';
import { Send, Sparkles } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="w-full glass-panel border-t border-gray-800 mt-16 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* Brand & Info */}
        <div className="flex flex-col items-center md:items-start gap-2 text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#FF758F] to-rose-400 flex items-center justify-center shadow-md shadow-[#FF758F]/20">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white to-[#FF758F] bg-clip-text text-transparent">
              tkeep
            </span>
          </div>
          <p className="text-xs text-gray-400 max-w-sm">
            Каталог актуальных товаров и услуг. Все права защищены © {new Date().getFullYear()} tkeep.
          </p>
        </div>

        {/* PROMINENT TELEGRAM CONTACT BUTTON (t.me/tkeepk) */}
        <div className="flex flex-col items-center gap-3">
          <a
            href="https://t.me/tkeepk"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-3.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 hover:from-rose-400 hover:to-pink-400 text-white font-extrabold text-sm sm:text-base transition-all duration-300 shadow-xl shadow-rose-500/25 hover:shadow-rose-500/40 hover:-translate-y-0.5"
          >
            <div className="w-7 h-7 rounded-xl bg-white/20 flex items-center justify-center">
              <Send className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
            </div>
            <div className="flex flex-col text-left leading-tight">
              <span className="text-[10px] text-pink-100 uppercase tracking-wider font-bold">Связаться в Telegram</span>
              <span className="text-base font-extrabold">t.me/tkeepk</span>
            </div>
          </a>
        </div>

      </div>
    </footer>
  );
};
