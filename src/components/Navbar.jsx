import React from 'react';
import { Search, ShieldCheck, LogOut, Sparkles, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar = ({ searchQuery, setSearchQuery, onNavigateAdmin, currentView }) => {
  const { isAdmin, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-gray-800/60 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <a 
          href="#/" 
          className="flex items-center gap-3.5 group focus:outline-none"
        >
          <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-[#FF758F] via-rose-500 to-pink-600 flex items-center justify-center shadow-lg shadow-[#FF758F]/25 group-hover:scale-105 transition-all duration-300">
            <Sparkles className="w-6 h-6 text-white animate-pulse-glow" />
            <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-white via-gray-100 to-[#FF758F] bg-clip-text text-transparent">
                tkeep
              </span>
              <span className="text-[10px] uppercase font-extrabold tracking-widest px-2.5 py-0.5 rounded-full badge-brand">
                Online
              </span>
            </div>
            <span className="text-[11px] text-gray-400 font-medium hidden sm:inline">Витрина товаров & услуг</span>
          </div>
        </a>

        {/* Global Search Bar */}
        {currentView !== 'admin' && (
          <div className="flex-1 max-w-md mx-2 sm:mx-4">
            <div className="relative group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#FF758F] transition-colors" />
              <input
                type="text"
                placeholder="Поиск по товарам, портфолио и описанию..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-900/80 text-gray-100 placeholder-gray-500 text-sm rounded-2xl pl-10 pr-10 py-2.5 border border-gray-800 focus:border-[#FF758F]/60 focus:ring-2 focus:ring-[#FF758F]/20 transition-all outline-none shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-white bg-gray-800/80 rounded-lg transition-colors"
                  title="Очистить поиск"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Admin Actions */}
        {isAdmin && (
          <div className="flex items-center gap-2">
            <button
              onClick={onNavigateAdmin}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-extrabold transition-all shadow-md ${
                currentView === 'admin'
                  ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-rose-500/25'
                  : 'bg-[#FF758F]/10 text-[#FF758F] border border-[#FF758F]/30 hover:bg-[#FF758F]/20'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Админка</span>
            </button>

            <button
              onClick={logout}
              title="Выйти из админ-панели"
              className="p-2.5 rounded-2xl text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </header>
  );
};
