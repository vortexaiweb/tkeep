import React from 'react';
import { ExternalLink, Share2, Eye, ShieldAlert, FolderGit2, ArrowUpRight } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const ProductCard = ({ item, category, onSelect, isAdmin }) => {
  const { showToast } = useToast();

  const handleShare = (e) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}${window.location.pathname}#/item/${item.id}`;
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(shareUrl);
      showToast('Ссылка на услугу скопирована!', 'success');
    } else {
      showToast(`Ссылка: ${shareUrl}`, 'info');
    }
  };

  const mainImage = item.images && item.images.length > 0 ? item.images[0] : 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=800';
  const portfolioCount = Array.isArray(item.portfolio) ? item.portfolio.length : 0;

  return (
    <div
      onClick={() => onSelect(item)}
      className="group relative glass-card rounded-3xl overflow-hidden cursor-pointer flex flex-col h-full border border-gray-800/80 hover:border-[#FF758F]/50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-[#FF758F]/10"
    >
      {/* Image Container */}
      <div className="relative aspect-[16/10] w-full bg-gray-950 overflow-hidden">
        <img
          src={mainImage}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=800';
          }}
        />

        {/* Overlay Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C10] via-transparent to-black/30 opacity-90" />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          {category && (
            <span className="px-3 py-1 rounded-xl text-[11px] font-bold bg-gray-950/80 backdrop-blur-md text-[#FF758F] border border-[#FF758F]/30 shadow-md">
              {category.icon} {category.name}
            </span>
          )}
          {portfolioCount > 0 && (
            <span className="px-3 py-1 rounded-xl text-[11px] font-extrabold bg-gradient-to-r from-rose-500 to-pink-600 text-white backdrop-blur-md border border-rose-400/40 flex items-center gap-1.5 shadow-lg shadow-rose-500/25">
              <FolderGit2 className="w-3.5 h-3.5" />
              <span>{portfolioCount} {portfolioCount === 1 ? 'проект' : 'проектов'}</span>
            </span>
          )}
          {item.sourceUrl && (
            <span className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-amber-500/20 backdrop-blur-md text-amber-300 border border-amber-500/30 flex items-center gap-1">
              <ExternalLink className="w-3 h-3" /> Kufar
            </span>
          )}
        </div>

        {/* Admin Draft Badge */}
        {isAdmin && item.status === 'draft' && (
          <div className="absolute top-3 right-3 z-10">
            <span className="px-3 py-1 rounded-xl text-[11px] font-bold bg-rose-500/90 backdrop-blur-md text-white flex items-center gap-1 shadow-lg">
              <ShieldAlert className="w-3.5 h-3.5" /> Черновик
            </span>
          </div>
        )}

        {/* Share Button overlay */}
        <button
          onClick={handleShare}
          title="Поделиться ссылкой"
          className="absolute bottom-3 right-3 p-2.5 rounded-2xl bg-gray-900/80 backdrop-blur-md text-gray-300 hover:text-[#FF758F] hover:bg-gray-800 border border-gray-700/60 transition-all opacity-0 group-hover:opacity-100 z-10 shadow-lg"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col flex-1 justify-between gap-4">
        <div>
          <h3 className="text-lg font-extrabold text-gray-100 group-hover:text-[#FF758F] transition-colors line-clamp-2 leading-snug tracking-tight mb-2">
            {item.title}
          </h3>

          <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed mb-3 font-normal">
            {item.description || 'Описание отсутствует'}
          </p>

          {/* All Portfolio Projects List */}
          {portfolioCount > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-800/80 space-y-2">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#FF758F] flex items-center gap-1.5">
                <FolderGit2 className="w-3.5 h-3.5" />
                <span>Выполненные работы ({portfolioCount}):</span>
              </div>
              
              <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto pr-1">
                {item.portfolio.map((proj, idx) => (
                  <a
                    key={idx}
                    href={proj.liveUrl || proj.sourceUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="group/item flex items-center justify-between text-xs bg-gray-900/80 hover:bg-gray-800 px-3 py-2 rounded-2xl border border-gray-800 hover:border-[#FF758F]/50 text-gray-200 transition-all"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {proj.image && (
                        <img src={proj.image} alt="" className="w-6 h-6 rounded-lg object-cover border border-gray-700/80 shrink-0" />
                      )}
                      <span className="truncate font-bold text-gray-200 group-hover/item:text-[#FF758F]">{proj.title}</span>
                    </div>
                    {(proj.liveUrl || proj.sourceUrl) && (
                      <span className="text-[10px] font-extrabold text-[#FF758F] bg-[#FF758F]/10 hover:bg-[#FF758F]/20 px-2.5 py-1 rounded-xl border border-[#FF758F]/30 shrink-0 ml-2 flex items-center gap-0.5">
                        <span>Демо</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </span>
                    )}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Details & Price */}
        <div className="flex items-center justify-between gap-2 pt-4 border-t border-gray-800/80">
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">Стоимость</span>
            <div className="text-xl font-black text-[#FF758F] tracking-tight flex items-baseline gap-1">
              <span className="text-xs text-gray-400 font-normal">от</span>
              <span>{Number(item.price).toLocaleString('ru-RU')}</span>
              <span className="text-xs font-bold text-rose-300 ml-0.5">{item.currency || 'BYN'}</span>
            </div>
          </div>

          <button
            onClick={() => onSelect(item)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold bg-[#FF758F]/10 text-[#FF758F] border border-[#FF758F]/30 group-hover:bg-[#FF758F] group-hover:text-white transition-all shadow-sm"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Подробнее</span>
          </button>
        </div>
      </div>
    </div>
  );
};
