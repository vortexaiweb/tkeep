import React from 'react';
import { Layers, LayoutGrid } from 'lucide-react';

export const CategoryBar = ({ categories, selectedCategory, onSelectCategory, itemsCountByCategory }) => {
  return (
    <div className="w-full py-5 mb-6 border-b border-gray-800/60">
      <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-1">
        
        {/* All Categories Pill */}
        <button
          onClick={() => onSelectCategory('all')}
          className={`flex items-center gap-2.5 px-4.5 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-300 ${
            selectedCategory === 'all'
              ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg shadow-rose-500/30 scale-[1.03] border border-rose-400/40'
              : 'bg-gray-900/80 text-gray-400 hover:text-white hover:bg-gray-800/80 border border-gray-800/80'
          }`}
        >
          <LayoutGrid className="w-4 h-4" />
          <span>Все предложения</span>
          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
            selectedCategory === 'all' ? 'bg-black/30 text-white' : 'bg-gray-800 text-gray-400'
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
              className={`flex items-center gap-2.5 px-4.5 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-300 ${
                isSelected
                  ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg shadow-rose-500/30 scale-[1.03] border border-rose-400/40'
                  : 'bg-gray-900/80 text-gray-400 hover:text-white hover:bg-gray-800/80 border border-gray-800/80'
              }`}
            >
              <span className="text-sm">{cat.icon || '📦'}</span>
              <span>{cat.name}</span>
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                isSelected ? 'bg-black/30 text-white' : 'bg-gray-800 text-gray-400'
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
