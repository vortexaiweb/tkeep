import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { CategoryBar } from './components/CategoryBar';
import { ProductGrid } from './components/ProductGrid';
import { ProductDetailModal } from './components/ProductDetailModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { Footer } from './components/Footer';
import { useAuth } from './context/AuthContext';
import {
  subscribeCategories,
  subscribeItems,
  addProductItem,
  updateProductItem,
  deleteProductItem,
  toggleProductStatus,
  addCategoryItem,
  updateCategoryItem,
  deleteCategoryItem,
  seedInitialData
} from './services/firebase';
import { Sparkles, ShieldCheck, Zap, MessageCircle } from 'lucide-react';

export const App = () => {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentView, setCurrentView] = useState('catalog'); // 'catalog' | 'admin'
  const [isLoading, setIsLoading] = useState(true);

  const { isAdmin } = useAuth();

  // Initial Data Fetch & Realtime Listeners
  useEffect(() => {
    seedInitialData();

    const unsubCat = subscribeCategories((data) => {
      setCategories(data);
    });

    const unsubItems = subscribeItems((data) => {
      setItems(data);
      setIsLoading(false);
    }, isAdmin);

    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => {
      clearTimeout(loadingTimer);
      unsubCat();
      unsubItems();
    };
  }, [isAdmin]);

  // Hash Routing (#/admin or #/item/:id)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/item/')) {
        const itemId = hash.replace('#/item/', '');
        const target = items.find((i) => i && i.id === itemId);
        if (target) {
          setSelectedItem(target);
          setCurrentView('catalog');
        }
      } else if (hash === '#/admin' || hash === '#/login') {
        setCurrentView('admin');
      } else if (hash === '#/' || hash === '') {
        setCurrentView('catalog');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [items, isAdmin]);

  // Categories Map
  const categoriesMap = useMemo(() => {
    const map = {};
    (categories || []).forEach((cat) => {
      if (cat && cat.id) {
        map[cat.id] = cat;
      }
    });
    return map;
  }, [categories]);

  // Count items per category
  const itemsCountByCategory = useMemo(() => {
    const counts = { all: (items || []).length };
    (categories || []).forEach((cat) => {
      if (cat && cat.id) {
        counts[cat.id] = 0;
      }
    });
    (items || []).forEach((item) => {
      if (item && item.categoryId && counts[item.categoryId] !== undefined) {
        counts[item.categoryId] = (counts[item.categoryId] || 0) + 1;
      }
    });
    return counts;
  }, [categories, items]);

  // Filter items by selected category and search query
  const filteredItems = useMemo(() => {
    return (items || []).filter((item) => {
      if (!item) return false;
      const matchesCat = selectedCategory === 'all' || item.categoryId === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (item.title && item.title.toLowerCase().includes(q)) ||
        (item.description && item.description.toLowerCase().includes(q));
      return matchesCat && matchesSearch;
    });
  }, [items, selectedCategory, searchQuery]);

  // Product Actions
  const handleAddProduct = async (productData) => {
    const newItem = await addProductItem(productData);
    if (newItem) {
      setItems((prev) => [newItem, ...prev.filter((i) => i.id !== newItem.id)]);
    }
  };

  const handleUpdateProduct = async (id, productData) => {
    await updateProductItem(id, productData);
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...productData } : i)));
  };

  const handleDeleteProduct = async (id) => {
    await deleteProductItem(id);
    setItems((prev) => prev.filter((i) => i && i.id !== id));
  };

  const handleToggleProductStatus = async (id, currentStatus) => {
    const newStatus = await toggleProductStatus(id, currentStatus);
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status: newStatus } : i)));
  };

  // Category Actions
  const handleAddCategory = async (categoryData) => {
    const newCat = await addCategoryItem(categoryData);
    if (newCat) {
      setCategories((prev) => [...prev.filter((c) => c.id !== newCat.id), newCat]);
    }
  };

  const handleUpdateCategory = async (id, categoryData) => {
    await updateCategoryItem(id, categoryData);
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...categoryData } : c)));
  };

  const handleDeleteCategory = async (id) => {
    await deleteCategoryItem(id);
    setCategories((prev) => prev.filter((c) => c && c.id !== id));
  };

  const handleCloseItemModal = () => {
    setSelectedItem(null);
    if (window.location.hash.startsWith('#/item/')) {
      window.location.hash = '#/';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0C10] text-gray-100 selection:bg-[#FF758F] selection:text-white">
      
      {/* Top Navbar */}
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onNavigateAdmin={() => {
          const nextView = currentView === 'admin' ? 'catalog' : 'admin';
          setCurrentView(nextView);
          window.location.hash = nextView === 'admin' ? '#/admin' : '#/';
        }}
        currentView={currentView}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        
        {currentView === 'admin' ? (
          <AdminDashboard
            items={items}
            categories={categories}
            categoriesMap={categoriesMap}
            itemsCountByCategory={itemsCountByCategory}
            onBackToCatalog={() => {
              setCurrentView('catalog');
              window.location.hash = '#/';
            }}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            onToggleProductStatus={handleToggleProductStatus}
            onAddCategory={handleAddCategory}
            onUpdateCategory={handleUpdateCategory}
            onDeleteCategory={handleDeleteCategory}
          />
        ) : (
          <div className="py-8">
            
            {/* Catalog Premium Hero Banner (wibe style) */}
            <div className="relative glass-panel rounded-3xl p-8 sm:p-10 mb-8 overflow-hidden border border-gray-800/80 bg-gradient-to-br from-gray-950 via-[#131520] to-[#251520]">
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF758F]/15 rounded-full blur-3xl -z-10 pointer-events-none" />
              <div className="absolute -bottom-10 left-1/3 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
              
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full badge-brand text-xs font-extrabold mb-4 shadow-lg shadow-[#FF758F]/15">
                  <Sparkles className="w-4 h-4 text-[#FF758F] animate-pulse-glow" />
                  <span>Премиальная витрина услуг и проектов</span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-4 leading-tight">
                  Интерактивный каталог <br />
                  <span className="bg-gradient-to-r from-white via-rose-200 to-[#FF758F] bg-clip-text text-transparent">
                    tkeep.online
                  </span>
                </h1>

                <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-medium mb-6">
                  Выбирайте подходящие услуги, просматривайте прикрепленные живые примеры работ в портфолио и напрямую связывайтесь с нами в Telegram для быстрого оформления заказa.
                </p>

                <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-gray-300">
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-900/80 border border-gray-800 text-gray-300">
                    <Zap className="w-3.5 h-3.5 text-[#FF758F]" />
                    <span>Быстрый запуск</span>
                  </span>
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-900/80 border border-gray-800 text-gray-300">
                    <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
                    <span>Проверенное портфолио</span>
                  </span>
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-900/80 border border-gray-800 text-gray-300">
                    <MessageCircle className="w-3.5 h-3.5 text-sky-400" />
                    <span>Прямая связь в Telegram</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Category Filter Bar */}
            <CategoryBar
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              itemsCountByCategory={itemsCountByCategory}
            />

            {/* Catalog Product Grid */}
            <ProductGrid
              items={filteredItems}
              categoriesMap={categoriesMap}
              onSelectItem={(item) => {
                setSelectedItem(item);
                window.location.hash = `#/item/${item.id}`;
              }}
              isLoading={isLoading}
              searchQuery={searchQuery}
              selectedCategory={selectedCategory}
              onResetFilters={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              isAdmin={isAdmin}
            />
          </div>
        )}

      </main>

      {/* Footer */}
      <Footer />

      {/* Product Detail Modal */}
      {selectedItem && (
        <ProductDetailModal
          item={selectedItem}
          category={categoriesMap[selectedItem.categoryId]}
          onClose={handleCloseItemModal}
        />
      )}

    </div>
  );
};

export default App;
