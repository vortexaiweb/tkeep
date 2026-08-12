import React from 'react';
import { ProductCard } from './ProductCard';
import { PackageX, Sparkles, RefreshCw } from 'lucide-react';

export const ProductGrid = ({ items, categoriesMap, onSelectItem, isLoading, searchQuery, selectedCategory, onResetFilters, isAdmin }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="glass-card rounded-3xl p-5 flex flex-col gap-4 border border-gray-800/80">
            <div className="w-full aspect-[16/10] rounded-2xl animate-skeleton" />
            <div className="h-6 w-3/4 rounded-xl animate-skeleton" />
            <div className="h-4 w-1/2 rounded-lg animate-skeleton" />
            <div className="flex justify-between items-center pt-3 border-t border-gray-800/60">
              <div className="h-6 w-1/3 rounded-lg animate-skeleton" />
              <div className="h-9 w-24 rounded-2xl animate-skeleton" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center glass-panel rounded-3xl my-8 border border-gray-800/80 shadow-2xl relative overflow-hidden">
        <div className="w-20 h-20 rounded-3xl bg-gray-900/90 flex items-center justify-center text-gray-500 mb-4 border border-gray-800 shadow-inner">
          <PackageX className="w-10 h-10 text-[#FF758F]/70 animate-bounce" />
        </div>
        <h3 className="text-2xl font-black text-gray-100 mb-2 tracking-tight">Предложения не найдены</h3>
        <p className="text-sm text-gray-400 max-w-md mb-6 font-medium leading-relaxed">
          {searchQuery
            ? `По запросу «${searchQuery}» ничего не найдено.`
            : 'В данной категории пока нет опубликованных предложений.'}
        </p>
        {(searchQuery || selectedCategory !== 'all') && (
          <button
            onClick={onResetFilters}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white font-extrabold text-xs transition-all shadow-lg shadow-rose-500/25 flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Сбросить поиск и фильтры</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-6">
      {items.map((item) => (
        <ProductCard
          key={item.id}
          item={item}
          category={categoriesMap[item.categoryId]}
          onSelect={onSelectItem}
          isAdmin={isAdmin}
        />
      ))}
    </div>
  );
};
