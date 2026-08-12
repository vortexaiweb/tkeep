import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Layers, Save, X, Smile } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const EMOJI_PRESETS = ['📱', '🚗', '🏠', '👕', '🛠️', '💻', '👟', '🛋️', '🎁', '⚽', '📷', '🚲', '🎮', '⌚', '💎'];

export const CategoryManager = ({ categories, itemsCountByCategory, onAddCategory, onUpdateCategory, onDeleteCategory }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', icon: '📱', sortOrder: 1 });
  const [deletingId, setDeletingId] = useState(null);
  const { showToast } = useToast();

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData({ name: '', icon: '📦', sortOrder: categories.length + 1 });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingCategory(cat);
    setFormData({ name: cat.name, icon: cat.icon || '📦', sortOrder: cat.sortOrder || 1 });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Укажите название категории', 'error');
      return;
    }

    if (editingCategory) {
      onUpdateCategory(editingCategory.id, formData);
      showToast(`Категория «${formData.name}» обновлена`, 'success');
    } else {
      onAddCategory(formData);
      showToast(`Категория «${formData.name}» создана`, 'success');
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id, name) => {
    onDeleteCategory(id);
    setDeletingId(null);
    showToast(`Категория «${name}» удалена`, 'info');
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between p-6 glass-panel rounded-3xl border border-gray-800">
        <div>
          <h2 className="text-xl font-extrabold text-gray-100 flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#FF758F]" />
            <span>Управление категориями</span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">Категории сохраняются в Firestore и привязываются к товарам</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 text-white text-xs font-bold transition-all shadow-lg shadow-rose-500/25"
        >
          <Plus className="w-4 h-4" />
          <span>Новая категория</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => {
          const itemCount = itemsCountByCategory[cat.id] || 0;

          return (
            <div
              key={cat.id}
              className="glass-card p-5 rounded-2xl border border-gray-800 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center text-2xl shrink-0">
                  {cat.icon || '📦'}
                </div>
                <div>
                  <h3 className="font-bold text-gray-100">{cat.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                    <span>Сортировка: #{cat.sortOrder || 1}</span>
                    <span>•</span>
                    <span className="text-[#FF758F] font-semibold">{itemCount} товаров</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(cat)}
                  className="p-2 rounded-xl text-gray-300 hover:text-[#FF758F] bg-gray-800 hover:bg-gray-700 transition-all"
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                {deletingId === cat.id ? (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDelete(cat.id, cat.name)}
                      className="px-2 py-1 bg-rose-600 text-white text-xs font-bold rounded"
                    >
                      Да
                    </button>
                    <button
                      onClick={() => setDeletingId(null)}
                      className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded"
                    >
                      Нет
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeletingId(cat.id)}
                    className="p-2 rounded-xl text-gray-400 hover:text-rose-400 bg-gray-800 hover:bg-gray-700 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div 
            className="w-full max-w-md glass-panel rounded-3xl p-6 border border-gray-700 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <h3 className="text-lg font-bold text-gray-100">
                {editingCategory ? 'Редактировать категорию' : 'Создать категорию'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                  Название категории *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Электроника"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-gray-900 text-gray-100 text-sm rounded-xl px-4 py-2.5 border border-gray-800 focus:border-rose-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                  Выберите Иконку / Эмодзи
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-16 text-center bg-gray-900 text-xl rounded-xl p-2 border border-gray-800 focus:border-rose-500 outline-none"
                  />
                  <span className="text-xs text-gray-400">Или выберите из пресетов:</span>
                </div>
                
                <div className="flex flex-wrap gap-1.5 p-2 bg-gray-900/60 rounded-xl border border-gray-800">
                  {EMOJI_PRESETS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon: emoji })}
                      className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center transition-all ${
                        formData.icon === emoji ? 'bg-rose-600 scale-110' : 'hover:bg-gray-800'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                  Порядок сортировки
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.sortOrder}
                  onChange={(e) => setFormData({ ...formData, sortOrder: Number(e.target.value) })}
                  className="w-full bg-gray-900 text-gray-100 text-sm rounded-xl px-4 py-2.5 border border-gray-800 focus:border-rose-500 outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-800 text-gray-300 text-sm"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-sm"
                >
                  Сохранить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
