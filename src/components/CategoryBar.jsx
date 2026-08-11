import React from 'react';
import { Layers } from 'lucide-react';

export const CategoryBar = ({ categories, selectedCategory, onSelectCategory, itemsCountByCategory }) => {
  return (
    <div className="w-full py-4 mb-4 border-b border-gray-800/40">
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        
        {/* All Categories Pill */}
        <button
          onClick={() => onSelectCategory('all')}
          className={`flex items-center gap-2.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
            selectedCategory === 'all'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 scale-105'
              : 'bg-gray-800/60 text-gray-300 hover:bg-gray-800 hover:text-white border border-gray-700/50'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Все товары</span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            selectedCategory === 'all' ? 'bg-emerald-800/60 text-emerald-100' : 'bg-gray-900 text-gray-400'
          }`}>
            {itemsCountByCategory.all || 0}
          </span>
        </button>

        {/* Dynamic Categories */}
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const count = itemsCountByCategory[cat.id] || 0;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                isSelected
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 scale-105'
                  : 'bg-gray-800/60 text-gray-300 hover:bg-gray-800 hover:text-white border border-gray-700/50'
              }`}
            >
              <span className="text-base">{cat.icon || '📦'}</span>
              <span>{cat.name}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                isSelected ? 'bg-emerald-800/60 text-emerald-100' : 'bg-gray-900 text-gray-400'
              }`}>
                {count}
              </span>
            </button>
          );
        })}

      </div>
    </div>
  );
};
