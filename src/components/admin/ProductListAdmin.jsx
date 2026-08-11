import React, { useState } from 'react';
import { Edit2, Trash2, ExternalLink, Search, CheckCircle, XCircle, Plus, Download } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const ProductListAdmin = ({ items, categoriesMap, onEdit, onDelete, onToggleStatus, onOpenAdd, onOpenImport }) => {
  const [filterSearch, setFilterSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [deletingId, setDeletingId] = useState(null);
  const { showToast } = useToast();

  const filteredItems = (items || []).filter((item) => {
    if (!item) return false;
    const titleStr = (item.title || '').toLowerCase();
    const descStr = (item.description || '').toLowerCase();
    const searchStr = filterSearch.toLowerCase().trim();
    const matchesSearch = !searchStr || titleStr.includes(searchStr) || descStr.includes(searchStr);
    const matchesCat = filterCategory === 'all' || item.categoryId === filterCategory;
    const matchesStat = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesCat && matchesStat;
  });

  const handleDeleteConfirm = (id) => {
    onDelete(id);
    setDeletingId(null);
    showToast('Товар удален из каталога', 'info');
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 glass-panel rounded-2xl border border-gray-800">
        
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Фильтр по наименованию..."
            value={filterSearch}
            onChange={(e) => setFilterSearch(e.target.value)}
            className="w-full bg-gray-900 text-gray-100 text-sm rounded-xl pl-9 pr-4 py-2 border border-gray-800 focus:border-emerald-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-gray-900 text-gray-300 text-xs rounded-xl px-3 py-2 border border-gray-800 outline-none"
          >
            <option value="all">Все категории</option>
            {Object.values(categoriesMap).map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {cat.name}
              </option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-gray-900 text-gray-300 text-xs rounded-xl px-3 py-2 border border-gray-800 outline-none"
          >
            <option value="all">Все статусы</option>
            <option value="active">Опубликованные</option>
            <option value="draft">Черновики</option>
          </select>
        </div>

      </div>

      {/* Product Table Container */}
      <div className="glass-panel rounded-2xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-900/60 text-xs text-gray-400 uppercase tracking-wider font-semibold">
                <th className="py-3.5 px-4">Фото</th>
                <th className="py-3.5 px-4">Товар / Описание</th>
                <th className="py-3.5 px-4">Категория</th>
                <th className="py-3.5 px-4">Цена</th>
                <th className="py-3.5 px-4">Статус</th>
                <th className="py-3.5 px-4 text-right">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60 text-sm">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-gray-400">
                    Товары не найдены.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const cat = categoriesMap[item.categoryId];
                  const mainImg = item.images && item.images.length > 0 ? item.images[0] : 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=800';

                  return (
                    <tr key={item.id} className="hover:bg-gray-800/40 transition-colors">
                      {/* Photo Thumbnail */}
                      <td className="py-3 px-4">
                        <div className="w-12 h-12 rounded-xl bg-gray-900 overflow-hidden border border-gray-800 shrink-0">
                          <img src={mainImg} alt="" className="w-full h-full object-cover" />
                        </div>
                      </td>

                      {/* Title & Info */}
                      <td className="py-3 px-4 max-w-xs">
                        <div className="font-bold text-gray-100 line-clamp-1">{item.title}</div>
                        <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                          {item.location && <span>{item.location}</span>}
                          {item.sourceUrl && (
                            <a
                              href={item.sourceUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-amber-400 hover:underline flex items-center gap-1"
                            >
                              <ExternalLink className="w-3 h-3" /> Kufar
                            </a>
                          )}
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        {cat ? (
                          <span className="text-xs px-2.5 py-1 rounded-lg bg-gray-800 text-gray-300 border border-gray-700">
                            {cat.icon} {cat.name}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-500">—</span>
                        )}
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4 whitespace-nowrap font-bold text-emerald-400">
                        {Number(item.price).toLocaleString('ru-RU')} {item.currency || 'BYN'}
                      </td>

                      {/* Status Toggle Switch */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <button
                          onClick={() => onToggleStatus(item.id, item.status)}
                          className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                            item.status === 'active'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20'
                          }`}
                        >
                          {item.status === 'active' ? (
                            <>
                              <CheckCircle className="w-3.5 h-3.5" /> Опубликован
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3.5 h-3.5" /> Черновик
                            </>
                          )}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => onEdit(item)}
                            title="Редактировать"
                            className="p-2 rounded-xl text-gray-300 hover:text-emerald-400 bg-gray-800 hover:bg-gray-700 transition-all"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {deletingId === item.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleDeleteConfirm(item.id)}
                                className="px-2.5 py-1 rounded-lg bg-rose-600 text-white text-xs font-bold"
                              >
                                Да
                              </button>
                              <button
                                onClick={() => setDeletingId(null)}
                                className="px-2.5 py-1 rounded-lg bg-gray-800 text-gray-300 text-xs"
                              >
                                Нет
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeletingId(item.id)}
                              title="Удалить"
                              className="p-2 rounded-xl text-gray-400 hover:text-rose-400 bg-gray-800 hover:bg-gray-700 transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
