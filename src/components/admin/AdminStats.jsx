import React from 'react';
import { Package, Layers, Eye, EyeOff, Plus, Download, Sparkles, FolderGit2 } from 'lucide-react';

export const AdminStats = ({ items, categories, onOpenAddProduct, onOpenImportKufar, onOpenImportPortfolio, onOpenAddCategory }) => {
  const totalItems = items.length;
  const activeItems = items.filter(i => i.status === 'active').length;
  const draftItems = items.filter(i => i.status === 'draft').length;
  const totalCategories = categories.length;

  return (
    <div className="space-y-6">
      {/* Quick Action Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 sm:p-8 glass-panel rounded-3xl border border-gray-800/80 shadow-2xl">
        <div>
          <h2 className="text-xl font-black text-gray-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#FF758F] animate-pulse-glow" />
            <span>Панель управления витриной</span>
          </h2>
          <p className="text-xs text-gray-400 mt-1 font-medium">Управление услугами, товарами и интеграциями tkeep</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onOpenImportPortfolio}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition-all shadow-sm"
          >
            <FolderGit2 className="w-4 h-4 text-cyan-400" />
            <span>Импорт Portfolio</span>
          </button>

          <button
            onClick={onOpenImportKufar}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all shadow-sm"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>Импорт Kufar</span>
          </button>

          <button
            onClick={onOpenAddCategory}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gray-900 hover:bg-gray-800 text-gray-200 border border-gray-800 text-xs font-bold transition-all"
          >
            <Layers className="w-4 h-4 text-[#FF758F]" />
            <span>+ Категория</span>
          </button>

          <button
            onClick={onOpenAddProduct}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white text-xs font-black transition-all shadow-lg shadow-rose-500/25"
          >
            <Plus className="w-4 h-4" />
            <span>Добавить предложение</span>
          </button>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Items */}
        <div className="glass-card p-5 rounded-3xl border border-gray-800/80 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">Всего услуг</p>
            <h3 className="text-3xl font-black text-white mt-1">{totalItems}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#FF758F]/10 border border-[#FF758F]/30 flex items-center justify-center text-[#FF758F]">
            <Package className="w-6 h-6" />
          </div>
        </div>

        {/* Active Items */}
        <div className="glass-card p-5 rounded-3xl border border-gray-800/80 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">Опубликовано</p>
            <h3 className="text-3xl font-black text-emerald-400 mt-1">{activeItems}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Eye className="w-6 h-6" />
          </div>
        </div>

        {/* Draft Items */}
        <div className="glass-card p-5 rounded-3xl border border-gray-800/80 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">Черновики</p>
            <h3 className="text-3xl font-black text-rose-400 mt-1">{draftItems}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <EyeOff className="w-6 h-6" />
          </div>
        </div>

        {/* Total Categories */}
        <div className="glass-card p-5 rounded-3xl border border-gray-800/80 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">Категории</p>
            <h3 className="text-3xl font-black text-cyan-400 mt-1">{totalCategories}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Layers className="w-6 h-6" />
          </div>
        </div>

      </div>
    </div>
  );
};
