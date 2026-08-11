import React from 'react';
import { Search, ShieldCheck, LogOut, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar = ({ searchQuery, setSearchQuery, onNavigateAdmin, currentView }) => {
  const { isAdmin, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-gray-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <a 
          href="#/" 
          className="flex items-center gap-3 group focus:outline-none"
        >
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-300">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white via-gray-100 to-emerald-400 bg-clip-text text-transparent">
                tkeep
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Каталог
              </span>
            </div>
            <p className="text-xs text-gray-400 hidden sm:block">Автоматизированная витрина товаров</p>
          </div>
        </a>

        {/* Global Search Bar */}
        {currentView !== 'admin' && (
          <div className="flex-1 max-w-md mx-2 sm:mx-4">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Поиск по названию или описанию..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-900/80 text-gray-100 placeholder-gray-500 text-sm rounded-xl pl-10 pr-4 py-2.5 border border-gray-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-white bg-gray-800 px-1.5 py-0.5 rounded"
                >
                  Очистить
                </button>
              )}
            </div>
          </div>
        )}

        {/* Admin Actions (Visible ONLY when logged in as Admin) */}
        {isAdmin && (
          <div className="flex items-center gap-2">
            <button
              onClick={onNavigateAdmin}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                currentView === 'admin'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                  : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Админка</span>
            </button>

            <button
              onClick={logout}
              title="Выйти из админ-панели"
              className="p-2 rounded-xl text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        )}

      </div>
    </header>
  );
};
