import React, { useState } from 'react';
import { FolderGit2, ExternalLink, Check, Sparkles, AlertTriangle, Image as ImageIcon, Layers, Plus } from 'lucide-react';
import { parsePortfolioUrl } from '../../services/portfolioParser';
import { useToast } from '../../context/ToastContext';

// Preset portfolio projects detected in vortexaiweb/portfolio
const PORTFOLIO_PRESETS = [
  {
    name: 'Портфолио Проект #1',
    url: 'https://github.com/vortexaiweb/portfolio/tree/main/1',
    desc: 'Многостраничный сайт услуг и контактов (HTML/CSS/JS)'
  },
  {
    name: 'Портфолио Проект #2',
    url: 'https://github.com/vortexaiweb/portfolio/tree/main/2',
    desc: 'Интерактивный лендинг веб-студии'
  },
  {
    name: 'iPhone Showcase App',
    url: 'https://github.com/vortexaiweb/portfolio/tree/main/iphone-main',
    desc: 'Приложение-каталог техники Apple (React + Vite)'
  },
  {
    name: 'Персональный сайт d2c-site',
    url: 'https://github.com/vortexaiweb/d2c-site',
    desc: 'Персональный веб-сайт и портфолио разработки'
  }
];

export const PortfolioImporter = ({ categories, onImportSave }) => {
  const [urlInput, setUrlInput] = useState('');
  const [targetCategory, setTargetCategory] = useState(categories[0]?.id || '');
  const [isParsing, setIsParsing] = useState(false);
  const [parsedData, setParsedData] = useState(null);
  const [parseError, setParseError] = useState('');
  const { showToast } = useToast();

  const handleParse = async (e, customUrl) => {
    if (e) e.preventDefault();
    const urlToParse = customUrl || urlInput;

    if (!urlToParse.trim()) {
      showToast('Вставьте ссылку на репозиторий портфолио', 'error');
      return;
    }

    setIsParsing(true);
    setParseError('');
    setParsedData(null);

    try {
      const result = await parsePortfolioUrl(urlToParse.trim());
      result.categoryId = targetCategory || (categories[0]?.id || '');
      setParsedData(result);
      showToast('Данные проекта портфолио успешно загружены!', 'success');
    } catch (err) {
      setParseError(err.message || 'Ошибка парсинга портфолио');
      showToast('Ошибка загрузки', 'error');
    } finally {
      setIsParsing(false);
    }
  };

  const handleCommitImport = () => {
    if (!parsedData || !parsedData.title) return;

    onImportSave({
      ...parsedData,
      categoryId: targetCategory || parsedData.categoryId || (categories[0]?.id || ''),
      status: 'active',
      createdAt: new Date().toISOString()
    });

    showToast(`Проект «${parsedData.title}» добавлен в категорию!`, 'success');
    setParsedData(null);
    setUrlInput('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header Panel */}
      <div className="p-6 glass-panel rounded-3xl border border-gray-800 space-y-5">
        <div>
          <h2 className="text-xl font-extrabold text-gray-100 flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-cyan-400" />
            <span>Добавление сайта из Репозитория Портфолио</span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Выберите категорию/услугу из каталога, вставьте ссылку на сайт или проект из вашего репозитория портфолио и прикрепите его к услуге.
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleParse} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            {/* Category Selector */}
            <div className="sm:col-span-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
                <span>Целевая услуга / категория</span>
              </label>
              <select
                value={targetCategory}
                onChange={(e) => setTargetCategory(e.target.value)}
                className="w-full bg-gray-900 text-gray-100 text-sm rounded-xl px-4 py-3 border border-gray-800 focus:border-cyan-500 outline-none"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* URL Input */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                Ссылка на проект / репозиторий портфолио
              </label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <ExternalLink className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="url"
                    required
                    placeholder="https://github.com/vortexaiweb/portfolio/tree/main/1"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    className="w-full bg-gray-900 text-gray-100 placeholder-gray-500 text-sm rounded-xl pl-10 pr-4 py-3 border border-gray-800 focus:border-cyan-500 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isParsing}
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold text-sm transition-all shadow-lg shadow-cyan-600/30 disabled:opacity-50 shrink-0"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isParsing ? 'Загрузка...' : 'Загрузить проект'}</span>
                </button>
              </div>
            </div>

          </div>
        </form>

        {/* Quick Presets from vortexaiweb/portfolio */}
        <div className="pt-2 border-t border-gray-800">
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
            Обнаруженные проекты из vortexaiweb/portfolio:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {PORTFOLIO_PRESETS.map((preset, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setUrlInput(preset.url);
                  handleParse(null, preset.url);
                }}
                className="text-left p-3 rounded-xl bg-gray-900/80 hover:bg-gray-800 border border-gray-800 hover:border-cyan-500/40 transition-all group"
              >
                <div className="text-xs font-bold text-gray-200 group-hover:text-cyan-400 flex items-center justify-between">
                  <span>{preset.name}</span>
                  <Plus className="w-3.5 h-3.5 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="text-[11px] text-gray-400 mt-1 line-clamp-1">{preset.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {parseError && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{parseError}</span>
          </div>
        )}
      </div>

      {/* Parsed Preview Card & Editor */}
      {parsedData && (
        <div className="glass-panel rounded-3xl p-6 border border-cyan-500/40 shadow-2xl space-y-6 animate-fade-in">
          
          <div className="flex items-center justify-between pb-4 border-b border-gray-800">
            <span className="px-3 py-1 rounded-xl text-xs font-extrabold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Предпросмотр услуги из портфолио
            </span>
            <button
              onClick={() => setParsedData(null)}
              className="text-xs text-gray-400 hover:text-white"
            >
              Отмена
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Image Preview & Links */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-cyan-400" />
                  <span>Изображение / Скриншот (URL)</span>
                </label>
                <input
                  type="text"
                  value={parsedData.images[0] || ''}
                  onChange={(e) => setParsedData({ ...parsedData, images: [e.target.value] })}
                  className="w-full bg-gray-900 text-gray-100 text-xs font-mono rounded-xl p-2.5 border border-gray-800 focus:border-cyan-500 outline-none"
                />
              </div>

              <div className="aspect-video w-full rounded-2xl bg-gray-950 overflow-hidden border border-gray-800">
                <img
                  src={parsedData.images[0]}
                  alt=""
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800';
                  }}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                  Ссылка на живое демо / сайт (Live URL)
                </label>
                <input
                  type="url"
                  value={parsedData.liveUrl || ''}
                  onChange={(e) => setParsedData({ ...parsedData, liveUrl: e.target.value })}
                  className="w-full bg-gray-900 text-gray-100 text-xs rounded-xl p-2.5 border border-gray-800 focus:border-cyan-500 outline-none"
                />
              </div>
            </div>

            {/* Editable Form Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                  Название услуги / проекта
                </label>
                <input
                  type="text"
                  value={parsedData.title}
                  onChange={(e) => setParsedData({ ...parsedData, title: e.target.value })}
                  className="w-full bg-gray-900 text-gray-100 text-sm rounded-xl px-4 py-2 border border-gray-800 focus:border-cyan-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Ориентировочная цена (BYN)
                  </label>
                  <input
                    type="number"
                    value={parsedData.price}
                    onChange={(e) => setParsedData({ ...parsedData, price: Number(e.target.value) })}
                    className="w-full bg-gray-900 text-gray-100 text-sm rounded-xl px-4 py-2 border border-gray-800 focus:border-cyan-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Привязать к категории
                  </label>
                  <select
                    value={targetCategory}
                    onChange={(e) => {
                      setTargetCategory(e.target.value);
                      setParsedData({ ...parsedData, categoryId: e.target.value });
                    }}
                    className="w-full bg-gray-900 text-gray-100 text-sm rounded-xl px-4 py-2 border border-gray-800 focus:border-cyan-500 outline-none"
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
                  Описание услуги и стек
                </label>
                <textarea
                  rows="4"
                  value={parsedData.description}
                  onChange={(e) => setParsedData({ ...parsedData, description: e.target.value })}
                  className="w-full bg-gray-900 text-gray-100 text-xs rounded-xl p-3 border border-gray-800 focus:border-cyan-500 outline-none resize-none"
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
              <span>Добавить проект в услугу каталога</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
