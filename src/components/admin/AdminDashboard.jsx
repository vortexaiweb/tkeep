import React, { useState } from 'react';
import { LayoutDashboard, Package, Layers, Download, ArrowLeft, Plus } from 'lucide-react';
import { AdminStats } from './AdminStats';
import { ProductListAdmin } from './ProductListAdmin';
import { CategoryManager } from './CategoryManager';
import { KufarImporter } from './KufarImporter';
import { ProductEditModal } from './ProductEditModal';

export const AdminDashboard = ({ 
  items, 
  categories, 
  categoriesMap, 
  itemsCountByCategory, 
  onBackToCatalog, 
  onAddProduct, 
  onUpdateProduct, 
  onDeleteProduct, 
  onToggleProductStatus, 
  onAddCategory, 
  onUpdateCategory, 
  onDeleteCategory 
}) => {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'products', 'categories', 'kufar'
  const [editingItem, setEditingItem] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  const handleOpenAddProduct = () => {
    setEditingItem(null);
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (item) => {
    setEditingItem(item);
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (productData) => {
    if (editingItem) {
      onUpdateProduct(editingItem.id, productData);
    } else {
      onAddProduct(productData);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Admin Panel Top Navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 glass-panel rounded-3xl border border-gray-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToCatalog}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-semibold transition-all border border-gray-700/60"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Вернуться на сайт</span>
          </button>
          <div className="h-6 w-px bg-gray-800 hidden sm:block" />
          <h1 className="text-xl font-extrabold text-gray-100 tracking-tight">Панель управления tkeep</h1>
        </div>

        {/* Tabs Bar */}
        <div className="flex items-center gap-1.5 bg-gray-900/90 p-1.5 rounded-2xl border border-gray-800 overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Дашборд</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'products'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Товары ({items.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'categories'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Категории ({categories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('kufar')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'kufar'
                ? 'bg-amber-500 text-gray-950 shadow-md shadow-amber-500/30'
                : 'text-amber-400 hover:bg-amber-500/10'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Импорт с Куфара</span>
          </button>
        </div>
      </div>

      {/* Tab Content Render */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8">
          <AdminStats
            items={items}
            categories={categories}
            onOpenAddProduct={handleOpenAddProduct}
            onOpenImportKufar={() => setActiveTab('kufar')}
            onOpenAddCategory={() => setActiveTab('categories')}
          />

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-100">Последние добавленные товары</h3>
              <button
                onClick={() => setActiveTab('products')}
                className="text-xs font-bold text-emerald-400 hover:underline"
              >
                Посмотреть все товары →
              </button>
            </div>
            <ProductListAdmin
              items={items.slice(0, 5)}
              categoriesMap={categoriesMap}
              onEdit={handleOpenEditProduct}
              onDelete={onDeleteProduct}
              onToggleStatus={onToggleProductStatus}
              onOpenAdd={handleOpenAddProduct}
              onOpenImport={() => setActiveTab('kufar')}
            />
          </div>
        </div>
      )}

      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-gray-100">Все товары каталога</h2>
            <button
              onClick={handleOpenAddProduct}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-600/30"
            >
              <Plus className="w-4 h-4" />
              <span>Добавить товар</span>
            </button>
          </div>

          <ProductListAdmin
            items={items}
            categoriesMap={categoriesMap}
            onEdit={handleOpenEditProduct}
            onDelete={onDeleteProduct}
            onToggleStatus={onToggleProductStatus}
            onOpenAdd={handleOpenAddProduct}
            onOpenImport={() => setActiveTab('kufar')}
          />
        </div>
      )}

      {activeTab === 'categories' && (
        <CategoryManager
          categories={categories}
          itemsCountByCategory={itemsCountByCategory}
          onAddCategory={onAddCategory}
          onUpdateCategory={onUpdateCategory}
          onDeleteCategory={onDeleteCategory}
        />
      )}

      {activeTab === 'kufar' && (
        <KufarImporter
          categories={categories}
          onImportSave={(newItem) => {
            onAddProduct(newItem);
            setActiveTab('products');
          }}
        />
      )}

      {/* Product Edit Modal */}
      <ProductEditModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onSave={handleSaveProduct}
        item={editingItem}
        categories={categories}
      />

    </div>
  );
};
