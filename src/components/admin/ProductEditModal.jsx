import React, { useState, useEffect } from 'react';
import { X, Save, Image, Tag, DollarSign, ExternalLink, FolderGit2, Plus, Trash2, Link } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const ProductEditModal = ({ isOpen, onClose, onSave, item, categories }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    currency: 'BYN',
    categoryId: '',
    status: 'active',
    imagesStr: '',
    sourceUrl: '',
    portfolio: []
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
        imagesStr: item.images ? item.images.join('\n') : '',
        sourceUrl: item.sourceUrl || '',
        portfolio: Array.isArray(item.portfolio) ? item.portfolio : []
      });
    } else {
      setFormData({
        title: '',
        description: '',
        price: '',
        currency: 'BYN',
        categoryId: categories[0]?.id || '',
        status: 'active',
        imagesStr: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=800',
        sourceUrl: '',
        portfolio: []
      });
    }
  }, [item, categories, isOpen]);

  if (!isOpen) return null;

  const handleAddPortfolioItem = () => {
    const newEntry = {
      id: `port_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title: 'Новый пример работы',
      liveUrl: 'https://',
      image: '',
      description: ''
    };
    setFormData(prev => ({
      ...prev,
      portfolio: [...prev.portfolio, newEntry]
    }));
  };

  const handleUpdatePortfolioItem = (index, field, value) => {
    setFormData(prev => {
      const updated = [...prev.portfolio];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, portfolio: updated };
    });
  };

  const handleRemovePortfolioItem = (index) => {
    setFormData(prev => ({
      ...prev,
      portfolio: prev.portfolio.filter((_, i) => i !== index)
    }));
  };

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
      images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=800'],
      portfolio: formData.portfolio || []
    };

    delete payload.imagesStr;

    onSave(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl glass-panel rounded-3xl overflow-hidden border border-gray-700/80 shadow-2xl p-6 sm:p-8 my-auto max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-gray-800">
          <h2 className="text-xl font-extrabold text-gray-100">
            {item ? 'Редактировать услугу / товар' : 'Новая услуга в каталог'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-white bg-gray-800/80 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 py-4 overflow-y-auto pr-1">
          
          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
              Название товара / услуги *
            </label>
            <input
              type="text"
              required
              placeholder="Создание лендингов под ключ"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-gray-900 text-gray-100 placeholder-gray-500 text-sm rounded-xl px-4 py-2.5 border border-gray-800 focus:border-[#FF758F] focus:ring-1 focus:ring-[#FF758F] outline-none"
            />
          </div>

          {/* Price, Currency, Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                Цена (от) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="any"
                placeholder="500"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full bg-gray-900 text-gray-100 text-sm rounded-xl px-4 py-2.5 border border-gray-800 focus:border-[#FF758F] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                Валюта
              </label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full bg-gray-900 text-gray-100 text-sm rounded-xl px-4 py-2.5 border border-gray-800 focus:border-[#FF758F] outline-none"
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
                className="w-full bg-gray-900 text-gray-100 text-sm rounded-xl px-4 py-2.5 border border-gray-800 focus:border-[#FF758F] outline-none"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.icon} {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
              Статус публикации
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full bg-gray-900 text-gray-100 text-sm rounded-xl px-4 py-2.5 border border-gray-800 focus:border-[#FF758F] outline-none"
            >
              <option value="active">🟢 Опубликован (Active)</option>
              <option value="draft">🔴 Черновик (Draft)</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
              Описание товара / услуги
            </label>
            <textarea
              rows="3"
              placeholder="Полное описание услуги, условия, сроки..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-gray-900 text-gray-100 text-sm rounded-xl p-3 border border-gray-800 focus:border-[#FF758F] outline-none resize-none"
            />
          </div>

          {/* Image URLs */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
              Ссылки на обложки / фото товара (по 1 ссылке на строку)
            </label>
            <textarea
              rows="2"
              placeholder="https://images.unsplash.com/photo-...\nhttps://..."
              value={formData.imagesStr}
              onChange={(e) => setFormData({ ...formData, imagesStr: e.target.value })}
              className="w-full bg-gray-900 text-gray-100 text-xs font-mono rounded-xl p-3 border border-gray-800 focus:border-[#FF758F] outline-none resize-none"
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
              className="w-full bg-gray-900 text-gray-100 text-sm rounded-xl px-4 py-2.5 border border-gray-800 focus:border-[#FF758F] outline-none"
            />
          </div>

          {/* PORTFOLIO ATTACHED PROJECTS MANAGER */}
          <div className="pt-4 border-t border-gray-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold uppercase tracking-wider text-[#FF758F] flex items-center gap-2">
                <FolderGit2 className="w-4 h-4" />
                <span>Примеры выполненных работ в Портфолио ({formData.portfolio.length})</span>
              </label>
              <button
                type="button"
                onClick={handleAddPortfolioItem}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FF758F]/10 hover:bg-[#FF758F]/20 text-[#FF758F] text-xs font-bold border border-[#FF758F]/30 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Добавить проект</span>
              </button>
            </div>

            {formData.portfolio.length === 0 ? (
              <div className="p-4 rounded-2xl bg-gray-900/60 border border-gray-800/80 text-center text-xs text-gray-400">
                К этой услуге ещё не прикреплены работы. Нажмите «Добавить проект» выше, чтобы добавить ссылку и фото готового проекта!
              </div>
            ) : (
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {formData.portfolio.map((proj, idx) => (
                  <div key={proj.id || idx} className="p-3.5 rounded-2xl bg-gray-900/80 border border-gray-800 space-y-2 relative">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                        <FolderGit2 className="w-3.5 h-3.5 text-[#FF758F]" />
                        <span>Проект #{idx + 1}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemovePortfolioItem(idx)}
                        className="p-1 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                        title="Удалить проект из портфолио"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase">Название работы</label>
                        <input
                          type="text"
                          placeholder="Сайт «d2c-site»"
                          value={proj.title || ''}
                          onChange={(e) => handleUpdatePortfolioItem(idx, 'title', e.target.value)}
                          className="w-full bg-gray-950 text-gray-100 text-xs rounded-lg px-3 py-1.5 border border-gray-800 focus:border-[#FF758F] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase">Ссылка на живой сайт / демо</label>
                        <input
                          type="url"
                          placeholder="https://vortexaiweb.github.io/d2c-site"
                          value={proj.liveUrl || ''}
                          onChange={(e) => handleUpdatePortfolioItem(idx, 'liveUrl', e.target.value)}
                          className="w-full bg-gray-950 text-gray-100 text-xs rounded-lg px-3 py-1.5 border border-gray-800 focus:border-[#FF758F] outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase">Ссылка на фото / скриншот работы (необязательно)</label>
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/photo-..."
                        value={proj.image || ''}
                        onChange={(e) => handleUpdatePortfolioItem(idx, 'image', e.target.value)}
                        className="w-full bg-gray-950 text-gray-100 text-xs rounded-lg px-3 py-1.5 border border-gray-800 focus:border-[#FF758F] outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit buttons */}
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
              <span>Сохранить товар</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
