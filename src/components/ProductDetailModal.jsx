import React, { useState } from 'react';
import { X, ExternalLink, Calendar, Send, ChevronLeft, ChevronRight, Share2, FolderGit2, ArrowUpRight } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const ProductDetailModal = ({ item, category, onClose }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { showToast } = useToast();

  if (!item) return null;

  const images = item.images && item.images.length > 0 ? item.images : ['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=800'];

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}#/item/${item.id}`;
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(shareUrl);
      showToast('Ссылка на предложение скопирована в буфер обмена!', 'success');
    } else {
      showToast(`Ссылка: ${shareUrl}`, 'info');
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl animate-fade-in overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl glass-panel rounded-3xl overflow-hidden border border-gray-800/80 shadow-2xl my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-800/80 bg-gray-950/60 backdrop-blur-md">
          <div className="flex items-center gap-2 flex-wrap">
            {category && (
              <span className="px-3 py-1 rounded-xl text-xs font-extrabold bg-[#FF758F]/10 text-[#FF758F] border border-[#FF758F]/30">
                {category.icon} {category.name}
              </span>
            )}
            {item.sourceUrl && (
              <span className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                <ExternalLink className="w-3.5 h-3.5" /> Kufar
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl text-gray-400 hover:text-white bg-gray-800/80 hover:bg-gray-800 transition-all border border-gray-700/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Gallery Section */}
            <div className="flex flex-col gap-4">
              {/* Main Image Display */}
              <div className="relative aspect-[4/3] w-full rounded-3xl bg-gray-950 overflow-hidden border border-gray-800/80 shadow-inner">
                <img
                  src={images[selectedImageIndex]}
                  alt={item.title}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=800';
                  }}
                />

                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-2xl bg-gray-900/80 hover:bg-gray-900 text-white backdrop-blur-md transition-all border border-gray-700/50"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-2xl bg-gray-900/80 hover:bg-gray-900 text-white backdrop-blur-md transition-all border border-gray-700/50"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails list */}
              {images.length > 1 && (
                <div className="flex items-center gap-2.5 overflow-x-auto pb-2 no-scrollbar">
                  {images.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative w-16 h-16 rounded-2xl overflow-hidden shrink-0 border-2 transition-all ${
                        selectedImageIndex === idx
                          ? 'border-[#FF758F] scale-105 shadow-md shadow-[#FF758F]/25'
                          : 'border-gray-800 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Meta & Actions */}
            <div className="flex flex-col justify-between gap-6">
              <div className="space-y-4">
                <h1 className="text-2xl sm:text-3xl font-black text-gray-100 tracking-tight leading-snug">
                  {item.title}
                </h1>

                {/* Price Display */}
                <div className="flex items-baseline gap-2 py-2">
                  <span className="text-sm text-gray-400 font-semibold">от</span>
                  <span className="text-3xl sm:text-4xl font-black text-[#FF758F] tracking-tight">
                    {Number(item.price).toLocaleString('ru-RU')}
                  </span>
                  <span className="text-lg font-bold text-rose-300">
                    {item.currency || 'BYN'}
                  </span>
                </div>

                {/* Date Metadata */}
                {item.createdAt && (
                  <div className="flex items-center gap-4 text-xs text-gray-400 py-2 border-y border-gray-800/80">
                    <div className="flex items-center gap-1.5 font-medium">
                      <Calendar className="w-4 h-4 text-[#FF758F]" />
                      <span>{new Date(item.createdAt).toLocaleDateString('ru-RU')}</span>
                    </div>
                  </div>
                )}

                {/* Description */}
                <div>
                  <h4 className="text-[11px] uppercase font-extrabold tracking-wider text-gray-400 mb-2">Описание услуги</h4>
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed whitespace-pre-line bg-gray-950/80 p-4 rounded-2xl border border-gray-800/80 max-h-48 overflow-y-auto">
                    {item.description || 'Описание не указано.'}
                  </p>
                </div>

                {/* Attached Service Portfolio Gallery */}
                {Array.isArray(item.portfolio) && item.portfolio.length > 0 && (
                  <div className="pt-4 border-t border-gray-800/80 space-y-3">
                    <h4 className="text-[11px] uppercase font-black tracking-wider text-[#FF758F] flex items-center gap-2">
                      <FolderGit2 className="w-4 h-4" />
                      <span>Выполненные проекты в Портфолио ({item.portfolio.length})</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-1">
                      {item.portfolio.map((proj, idx) => (
                        <div key={idx} className="glass-card p-3.5 rounded-2xl border border-gray-800 flex flex-col justify-between gap-2.5 bg-gray-950/80">
                          {proj.image && (
                            <div className="aspect-video w-full rounded-xl bg-gray-900 overflow-hidden border border-gray-800">
                              <img src={proj.image} alt={proj.title} className="w-full h-full object-cover" />
                            </div>
                          )}
                          <div>
                            <h5 className="font-bold text-gray-100 text-xs">{proj.title}</h5>
                            {proj.description && (
                              <p className="text-[11px] text-gray-400 mt-1 line-clamp-2">{proj.description}</p>
                            )}
                          </div>
                          {(proj.liveUrl || proj.sourceUrl) && (
                            <a
                              href={proj.liveUrl || proj.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-between text-xs font-bold text-[#FF758F] bg-[#FF758F]/10 hover:bg-[#FF758F]/20 px-3 py-1.5 rounded-xl border border-[#FF758F]/30 transition-all mt-1"
                            >
                              <span>Посмотреть демо</span>
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                
                {/* Telegram Contact Button */}
                <a
                  href="https://t.me/tkeepk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 hover:from-rose-400 hover:to-pink-400 text-white font-extrabold text-sm transition-all shadow-xl shadow-rose-500/25 group"
                >
                  <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  <span>Связаться в Telegram (t.me/tkeepk)</span>
                </a>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleShare}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-gray-900 hover:bg-gray-800 text-gray-300 font-bold text-xs border border-gray-800 transition-all"
                  >
                    <Share2 className="w-4 h-4 text-[#FF758F]" />
                    <span>Поделиться ссылкой</span>
                  </button>

                  {item.sourceUrl && (
                    <a
                      href={item.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-bold text-xs border border-amber-500/30 transition-all"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Kufar</span>
                    </a>
                  )}
                </div>

              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
