import React, { useState } from 'react';
import { Download, ExternalLink, Check, RefreshCw, AlertTriangle, Sparkles, Image as ImageIcon } from 'lucide-react';
import { parseKufarUrl } from '../../services/kufarParser';
import { useToast } from '../../context/ToastContext';

export const KufarImporter = ({ categories, onImportSave }) => {
  const [urlInput, setUrlInput] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [parsedData, setParsedData] = useState(null);
  const [parseError, setParseError] = useState('');
  const { showToast } = useToast();

  const handleParse = async (e) => {
    e?.preventDefault();
    if (!urlInput.trim()) {
      showToast('Вставьте ссылку на объявление Kufar', 'error');
      return;
    }

    setIsParsing(true);
    setParseError('');
    setParsedData(null);

    try {
      const result = await parseKufarUrl(urlInput.trim());
      // Auto assign category if matched
      if (categories.length > 0) {
        result.categoryId = categories[0].id;
      }
      setParsedData(result);
      showToast('Данные объявлений извлечены!', 'success');
    } catch (err) {
      setParseError(err.message || 'Не удалось распарсить объявление');
      showToast('Ошибка распарсивания', 'error');
    } finally {
      setIsParsing(false);
    }
  };

  const handleCommitImport = () => {
    if (!parsedData || !parsedData.title) return;

    onImportSave({
      ...parsedData,
      status: 'active', // default active
      createdAt: new Date().toISOString()
    });

    showToast(`Товар «${parsedData.title}» импортирован с Куфара!`, 'success');
    setParsedData(null);
    setUrlInput('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header Panel */}
      <div className="p-6 glass-panel rounded-3xl border border-gray-800 space-y-4">
        <div>
          <h2 className="text-xl font-extrabold text-gray-100 flex items-center gap-2">
            <Download className="w-5 h-5 text-amber-400" />
            <span>Автоматический импорт с Kufar.by</span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Вставьте ссылку на объявление Kufar. Система извлечёт наименование, описание, цену и фотографии (прямые CDN ссылки).
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleParse} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <ExternalLink className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="url"
              required
              placeholder="https://www.kufar.by/item/214983214"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="w-full bg-gray-900 text-gray-100 placeholder-gray-500 text-sm rounded-xl pl-10 pr-4 py-3 border border-gray-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isParsing}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-gray-950 font-extrabold text-sm transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50 shrink-0"
          >
            {isParsing ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            <span>{isParsing ? 'Парсинг...' : 'Загрузить данные'}</span>
          </button>
        </form>

        {parseError && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{parseError}</span>
          </div>
        )}
      </div>

      {/* Parsed Preview Card & Editor */}
      {parsedData && (
        <div className="glass-panel rounded-3xl p-6 border border-amber-500/40 shadow-2xl space-y-6 animate-fade-in">
          
          <div className="flex items-center justify-between pb-4 border-b border-gray-800">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-xl text-xs font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Предпросмотр данных
              </span>
              {parsedData.needsManualCheck && (
                <span className="text-xs text-rose-400 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Проверьте заголовок и цену
                </span>
              )}
            </div>

            <button
              onClick={() => setParsedData(null)}
              className="text-xs text-gray-400 hover:text-white"
            >
              Отмена
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Images Scraped Preview */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-amber-400" />
                <span>Извлечённые фото (CDN Куфара: {parsedData.images?.length || 0})</span>
              </label>
              
              <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto p-2 bg-gray-900/80 rounded-2xl border border-gray-800">
                {parsedData.images?.map((img, idx) => (
                  <div key={idx} className="aspect-square rounded-xl overflow-hidden bg-gray-950 border border-gray-800">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>

            {/* Editable Fields Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                  Название
                </label>
                <input
                  type="text"
                  value={parsedData.title}
                  onChange={(e) => setParsedData({ ...parsedData, title: e.target.value })}
                  className="w-full bg-gray-900 text-gray-100 text-sm rounded-xl px-4 py-2 border border-gray-800 focus:border-amber-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Цена (BYN)
                  </label>
                  <input
                    type="number"
                    value={parsedData.price}
                    onChange={(e) => setParsedData({ ...parsedData, price: Number(e.target.value) })}
                    className="w-full bg-gray-900 text-gray-100 text-sm rounded-xl px-4 py-2 border border-gray-800 focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Категория
                  </label>
                  <select
                    value={parsedData.categoryId}
                    onChange={(e) => setParsedData({ ...parsedData, categoryId: e.target.value })}
                    className="w-full bg-gray-900 text-gray-100 text-sm rounded-xl px-4 py-2 border border-gray-800 focus:border-amber-500 outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.icon} {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                  Описание
                </label>
                <textarea
                  rows="3"
                  value={parsedData.description}
                  onChange={(e) => setParsedData({ ...parsedData, description: e.target.value })}
                  className="w-full bg-gray-900 text-gray-100 text-xs rounded-xl p-3 border border-gray-800 focus:border-amber-500 outline-none resize-none"
                />
              </div>
            </div>

          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-gray-800">
            <button
              onClick={() => setParsedData(null)}
              className="px-4 py-2.5 rounded-xl bg-gray-800 text-gray-300 text-xs font-medium"
            >
              Отмена
            </button>
            
            <button
              onClick={handleCommitImport}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30"
            >
              <Check className="w-4 h-4" />
              <span>Сохранить в Firestore</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
