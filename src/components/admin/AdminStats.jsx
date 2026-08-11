import React from 'react';
import { Package, Layers, Eye, EyeOff, Plus, Download, Sparkles } from 'lucide-react';

export const AdminStats = ({ items, categories, onOpenAddProduct, onOpenImportKufar, onOpenAddCategory }) => {
  const totalItems = items.length;
  const activeItems = items.filter(i => i.status === 'active').length;
  const draftItems = items.filter(i => i.status === 'draft').length;
  const totalCategories = categories.length;

  return (
    <div className="space-y-6">
      {/* Quick Action Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 glass-panel rounded-3xl border border-gray-800">
        <div>
          <h2 className="text-xl font-extrabold text-gray-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <span>Обзор и быстрые действия</span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">Управление каталогом объявлений tkeep</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onOpenImportKufar}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Импорт с Куфара</span>
          </button>

          <button
            onClick={onOpenAddCategory}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 text-xs font-semibold transition-all"
          >
            <Layers className="w-4 h-4 text-emerald-400" />
            <span>+ Категория</span>
          </button>

          <button
            onClick={onOpenAddProduct}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-600/30"
          >
            <Plus className="w-4 h-4" />
            <span>Добавить товар</span>
          </button>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Items */}
        <div className="glass-card p-5 rounded-2xl border border-gray-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Всего товаров</p>
            <h3 className="text-3xl font-extrabold text-white mt-1">{totalItems}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Package className="w-6 h-6" />
          </div>
        </div>

        {/* Active Items */}
        <div className="glass-card p-5 rounded-2xl border border-gray-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Опубликовано</p>
            <h3 className="text-3xl font-extrabold text-emerald-400 mt-1">{activeItems}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Eye className="w-6 h-6" />
          </div>
        </div>

        {/* Draft Items */}
        <div className="glass-card p-5 rounded-2xl border border-gray-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Черновики</p>
            <h3 className="text-3xl font-extrabold text-rose-400 mt-1">{draftItems}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <EyeOff className="w-6 h-6" />
          </div>
        </div>

        {/* Total Categories */}
        <div className="glass-card p-5 rounded-2xl border border-gray-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Категории</p>
            <h3 className="text-3xl font-extrabold text-cyan-400 mt-1">{totalCategories}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Layers className="w-6 h-6" />
          </div>
        </div>

      </div>
    </div>
  );
};
