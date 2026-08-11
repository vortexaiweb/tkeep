import React from 'react';
import { ProductCard } from './ProductCard';
import { PackageX, Sparkles } from 'lucide-react';

export const ProductGrid = ({ items, categoriesMap, onSelectItem, isLoading, searchQuery, selectedCategory, onResetFilters, isAdmin }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="glass-card rounded-2xl p-4 flex flex-col gap-4 border border-gray-800">
            <div className="w-full aspect-[4/3] rounded-xl animate-skeleton" />
            <div className="h-5 w-3/4 rounded animate-skeleton" />
            <div className="h-4 w-1/2 rounded animate-skeleton" />
            <div className="flex justify-between items-center pt-2">
              <div className="h-6 w-1/3 rounded animate-skeleton" />
              <div className="h-8 w-24 rounded-xl animate-skeleton" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center glass-panel rounded-3xl my-8 border border-gray-800/80">
        <div className="w-20 h-20 rounded-2xl bg-gray-900 flex items-center justify-center text-gray-500 mb-4 border border-gray-800">
          <PackageX className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-100 mb-2">Объявления не найдены</h3>
        <p className="text-sm text-gray-400 max-w-md mb-6">
          {searchQuery
            ? `По запросу «${searchQuery}» ничего не найдено.`
            : 'В данной категории пока нет опубликованных товаров.'}
        </p>
        {(searchQuery || selectedCategory !== 'all') && (
          <button
            onClick={onResetFilters}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm transition-all shadow-lg shadow-emerald-600/30 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Сбросить фильтры</span>
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
