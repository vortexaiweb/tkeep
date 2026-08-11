import React from 'react';
import { MapPin, ExternalLink, Share2, Eye, ShieldAlert } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const ProductCard = ({ item, category, onSelect, isAdmin }) => {
  const { showToast } = useToast();

  const handleShare = (e) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}${window.location.pathname}#/item/${item.id}`;
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(shareUrl);
      showToast('Ссылка на товар скопирована в буфер обмена!', 'success');
    } else {
      showToast(`Ссылка: ${shareUrl}`, 'info');
    }
  };

  const mainImage = item.images && item.images.length > 0 ? item.images[0] : 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=800';

  return (
    <div
      onClick={() => onSelect(item)}
      className="group relative glass-card rounded-2xl overflow-hidden cursor-pointer flex flex-col h-full border border-gray-800 hover:border-emerald-500/40 transition-all duration-300"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full bg-gray-900 overflow-hidden">
        <img
          src={mainImage}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=800';
          }}
        />

        {/* Overlay Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent opacity-80" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          {category && (
            <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-gray-950/80 backdrop-blur-md text-emerald-400 border border-emerald-500/20">
              {category.icon} {category.name}
            </span>
          )}
          {item.sourceUrl && (
            <span className="px-2 py-1 rounded-lg text-[10px] font-bold bg-amber-500/20 backdrop-blur-md text-amber-300 border border-amber-500/30 flex items-center gap-1">
              <ExternalLink className="w-3 h-3" /> Kufar
            </span>
          )}
        </div>

        {/* Admin Draft Badge */}
        {isAdmin && item.status === 'draft' && (
          <div className="absolute top-3 right-3 z-10">
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-500/80 backdrop-blur-md text-white flex items-center gap-1 shadow-lg">
              <ShieldAlert className="w-3.5 h-3.5" /> Черновик
            </span>
          </div>
        )}

        {/* Share Button overlay */}
        <button
          onClick={handleShare}
          title="Поделиться ссылкой"
          className="absolute bottom-3 right-3 p-2 rounded-xl bg-gray-900/80 backdrop-blur-md text-gray-300 hover:text-emerald-400 hover:bg-gray-800 border border-gray-700/50 transition-all opacity-0 group-hover:opacity-100 z-10"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-1 justify-between gap-4">
        <div>
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-lg font-bold text-gray-100 group-hover:text-emerald-400 transition-colors line-clamp-2 leading-snug">
              {item.title}
            </h3>
          </div>

          <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed mb-3">
            {item.description || 'Описание отсутствует'}
          </p>
        </div>

        {/* Bottom Details */}
        <div className="flex items-end justify-between gap-2 pt-3 border-t border-gray-800/60">
          <div>
            <div className="text-xl font-extrabold text-emerald-400 tracking-tight">
              {Number(item.price).toLocaleString('ru-RU')} <span className="text-sm font-semibold text-emerald-300">{item.currency || 'BYN'}</span>
            </div>
            {item.location && (
              <div className="flex items-center gap-1 text-[11px] text-gray-400 mt-0.5">
                <MapPin className="w-3 h-3 text-gray-500" />
                <span>{item.location}</span>
              </div>
            )}
          </div>

          <button
            onClick={() => onSelect(item)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 transition-all shadow-sm"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Подробнее</span>
          </button>
        </div>
      </div>
    </div>
  );
};
