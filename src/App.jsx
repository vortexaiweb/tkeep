import React, { useState, useEffect, useMemo } from 'react';
import { 
  subscribeCategories, 
  subscribeItems, 
  seedInitialData,
  addProductItem,
  updateProductItem,
  deleteProductItem,
  toggleProductStatus,
  addCategoryItem,
  updateCategoryItem,
  deleteCategoryItem 
} from './services/firebase';
import { useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { CategoryBar } from './components/CategoryBar';
import { ProductGrid } from './components/ProductGrid';
import { ProductDetailModal } from './components/ProductDetailModal';
import { Footer } from './components/Footer';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { Sparkles } from 'lucide-react';

export function App() {
  const { isAdmin } = useAuth();

  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected item modal state
  const [selectedItem, setSelectedItem] = useState(null);

  // Admin login modal state & view state ('catalog' | 'admin')
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [currentView, setCurrentView] = useState('catalog');

  // Initial Seed & Real-time Listeners
  useEffect(() => {
    seedInitialData();

    // Fallback timer to prevent getting stuck in loading state forever
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    const unsubCat = subscribeCategories((cats) => {
      setCategories(Array.isArray(cats) ? cats : []);
    });

    const unsubItems = subscribeItems((itemList) => {
      setItems(Array.isArray(itemList) ? itemList : []);
      setIsLoading(false);
    }, isAdmin);

    return () => {
      clearTimeout(loadingTimer);
      unsubCat();
      unsubItems();
    };
  }, [isAdmin]);

  // Direct Address / Hash Routing (#/admin or #/login opens hidden admin entry)
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
        if (isAdmin) {
          setCurrentView('admin');
        } else {
          setIsAdminLoginOpen(true);
        }
      } else if (hash === '#/' || hash === '') {
        setCurrentView('catalog');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [items, isAdmin]);

  // Categories Lookup Map
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
      if (item && counts[item.categoryId] !== undefined) {
        counts[item.categoryId] += 1;
      }
    });
    return counts;
  }, [categories, items]);

  // Filtered Items for Catalog View
  const filteredItems = useMemo(() => {
    return (items || []).filter((item) => {
      if (!item) return false;
      const matchesCat = selectedCategory === 'all' || item.categoryId === selectedCategory;
      const itemTitle = (item.title || '').toLowerCase();
      const itemDesc = (item.description || '').toLowerCase();
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = !query || itemTitle.includes(query) || itemDesc.includes(query);
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

  const handleCloseAdminLoginModal = () => {
    setIsAdminLoginOpen(false);
    if (!isAdmin && (window.location.hash === '#/admin' || window.location.hash === '#/login')) {
      window.location.hash = '#/';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#121319] text-gray-100 selection:bg-[#FF758F] selection:text-white">
      
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
        
        {currentView === 'admin' && isAdmin ? (
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
          <div className="py-6">
            
            {/* Catalog Hero Banner */}
            <div className="relative glass-panel rounded-3xl p-8 mb-6 overflow-hidden border border-gray-800 bg-gradient-to-r from-gray-900 via-[#181a24] to-[#2a1b24]">
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF758F]/10 rounded-full blur-3xl -z-10 pointer-events-none" />
              
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FF758F]/10 border border-[#FF758F]/25 text-[#FF758F] text-xs font-bold mb-4 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Официальный каталог товаров и услуг</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
                  Каталог объявлений <span className="bg-gradient-to-r from-[#FF758F] via-[#FF8A9E] to-rose-400 bg-clip-text text-transparent">tkeep</span>
                </h1>
                <p className="text-sm text-gray-300 leading-relaxed">
                  Ищите нужные товары, используйте фильтры по категориям и напрямую связывайтесь с нами в Telegram для покупки или вопросов.
                </p>
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

      {/* Product Detail Modal */}
      {selectedItem && (
        <ProductDetailModal
          item={selectedItem}
          category={categoriesMap[selectedItem.categoryId]}
          onClose={handleCloseItemModal}
        />
      )}

      {/* Admin Login Modal (Triggered strictly via URL hash #/admin or #/login) */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={handleCloseAdminLoginModal}
        onSuccess={() => {
          setCurrentView('admin');
          window.location.hash = '#/admin';
        }}
      />

      {/* Persistent Footer with Prominent Telegram Link */}
      <Footer />

    </div>
  );
}

export default App;
