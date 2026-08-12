import React, { useState, useEffect } from 'react';
import { X, Save, Image, Tag, DollarSign, MapPin, ExternalLink } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const ProductEditModal = ({ isOpen, onClose, onSave, item, categories }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    currency: 'BYN',
    categoryId: '',
    status: 'active',
    location: 'Минск',
    imagesStr: '',
    sourceUrl: ''
  });

  const { showToast } = useToast();

  useEffect(() => {
    if (item) {
      setFormData({
        title: item.title || '',
        description: item.description || '',
        price: item.price || '',
        currency: item.currency || 'BYN',
        categoryId: item.categoryId || (categories[0]?.id || ''),
        status: item.status || 'active',
        location: item.location || 'Минск',
        imagesStr: item.images ? item.images.join('\n') : '',
        sourceUrl: item.sourceUrl || ''
      });
    } else {
      setFormData({
        title: '',
        description: '',
        price: '',
        currency: 'BYN',
        categoryId: categories[0]?.id || '',
        status: 'active',
        location: 'Минск',
        imagesStr: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=800',
        sourceUrl: ''
      });
    }
  }, [item, categories, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('Укажите название товара', 'error');
      return;
    }

    const images = formData.imagesStr
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const payload = {
      ...formData,
      price: Number(formData.price) || 0,
      images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=800']
    };

    delete payload.imagesStr;

    onSave(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl glass-panel rounded-3xl overflow-hidden border border-gray-700/80 shadow-2xl p-6 sm:p-8 my-auto max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-gray-800">
          <h2 className="text-xl font-extrabold text-gray-100">
            {item ? 'Редактировать товар' : 'Новый товар в каталог'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-white bg-gray-800/80 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 py-4 overflow-y-auto">
          
          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
              Название товара *
            </label>
            <input
              type="text"
              required
              placeholder="Apple iPhone 15 Pro 128GB"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-gray-900 text-gray-100 placeholder-gray-500 text-sm rounded-xl px-4 py-2.5 border border-gray-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
            />
          </div>

          {/* Price, Currency, Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                Цена *
              </label>
              <input
                type="number"
                required
                min="0"
                step="any"
                placeholder="2500"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full bg-gray-900 text-gray-100 text-sm rounded-xl px-4 py-2.5 border border-gray-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                Валюта
              </label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full bg-gray-900 text-gray-100 text-sm rounded-xl px-4 py-2.5 border border-gray-800 focus:border-emerald-500 outline-none"
              >
                <option value="BYN">BYN (руб.)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="RUB">RUB (₽)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                Категория
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full bg-gray-900 text-gray-100 text-sm rounded-xl px-4 py-2.5 border border-gray-800 focus:border-emerald-500 outline-none"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.icon} {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Location and Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                Город / Локация
              </label>
              <input
                type="text"
                placeholder="Минск"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full bg-gray-900 text-gray-100 text-sm rounded-xl px-4 py-2.5 border border-gray-800 focus:border-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                Статус публикации
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full bg-gray-900 text-gray-100 text-sm rounded-xl px-4 py-2.5 border border-gray-800 focus:border-emerald-500 outline-none"
              >
                <option value="active">🟢 Опубликован (Active)</option>
                <option value="draft">🔴 Черновик (Draft)</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
              Описание товара
            </label>
            <textarea
              rows="4"
              placeholder="Полное описание, характеристики, состояние..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-gray-900 text-gray-100 text-sm rounded-xl p-3 border border-gray-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none resize-none"
            />
          </div>

          {/* Image URLs */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
              Ссылки на изображения (по 1 ссылке на строку или с Kufar CDN)
            </label>
            <textarea
              rows="3"
              placeholder="https://img.kufar.by/v1/gallery/...\nhttps://..."
              value={formData.imagesStr}
              onChange={(e) => setFormData({ ...formData, imagesStr: e.target.value })}
              className="w-full bg-gray-900 text-gray-100 text-xs font-mono rounded-xl p-3 border border-gray-800 focus:border-emerald-500 outline-none resize-none"
            />
          </div>

          {/* Source Kufar URL */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
              Ссылка на оригинал Kufar (необязательно)
            </label>
            <input
              type="url"
              placeholder="https://www.kufar.by/item/..."
              value={formData.sourceUrl}
              onChange={(e) => setFormData({ ...formData, sourceUrl: e.target.value })}
              className="w-full bg-gray-900 text-gray-100 text-sm rounded-xl px-4 py-2.5 border border-gray-800 focus:border-emerald-500 outline-none"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-medium transition-all"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 text-white font-bold text-sm transition-all shadow-lg shadow-rose-500/25"
            >
              <Save className="w-4 h-4" />
              <span>Сохранить</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
