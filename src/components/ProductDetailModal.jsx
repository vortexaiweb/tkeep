import React, { useState, useEffect } from 'react';
import { X, ExternalLink, Share2, MapPin, Calendar, Send, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const ProductDetailModal = ({ item, category, onClose }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  const images = item.images && item.images.length > 0
    ? item.images
    : ['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=800'];

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleShare = () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}#/item/${item.id}`;
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      showToast('Прямая ссылка на товар скопирована!', 'success');
      setTimeout(() => setCopied(false), 3000);
    } else {
      showToast(`Ссылка: ${shareUrl}`, 'info');
    }
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      {/* Modal Container */}
      <div 
        className="relative w-full max-w-4xl glass-panel rounded-3xl overflow-hidden border border-gray-700/60 shadow-2xl my-auto max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-gray-900/90">
          <div className="flex items-center gap-2">
            {category && (
              <span className="px-3 py-1 rounded-xl text-xs font-semibold bg-[#FF758F]/10 text-[#FF758F] border border-[#FF758F]/25">
                {category.icon} {category.name}
              </span>
            )}
            {item.sourceUrl && (
              <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                <ExternalLink className="w-3.5 h-3.5" /> Импорт Kufar
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-white bg-gray-800/80 hover:bg-gray-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Gallery Section */}
            <div className="flex flex-col gap-4">
              {/* Main Image Display */}
              <div className="relative aspect-[4/3] w-full rounded-2xl bg-gray-950 overflow-hidden border border-gray-800">
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
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-gray-900/80 hover:bg-gray-900 text-white backdrop-blur-md transition-all border border-gray-700/50"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-gray-900/80 hover:bg-gray-900 text-white backdrop-blur-md transition-all border border-gray-700/50"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails list */}
              {images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                  {images.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                        selectedImageIndex === idx
                          ? 'border-[#FF758F] scale-105 shadow-md shadow-[#FF758F]/20'
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
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-100 tracking-tight leading-snug">
                  {item.title}
                </h1>

                {/* Price Display */}
                <div className="flex items-baseline gap-2 py-2">
                  <span className="text-3xl sm:text-4xl font-extrabold text-[#FF758F] tracking-tight">
                    {Number(item.price).toLocaleString('ru-RU')}
                  </span>
                  <span className="text-lg font-bold text-rose-300">
                    {item.currency || 'BYN'}
                  </span>
                </div>

                {/* Location & Date Metadata */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 py-2 border-y border-gray-800">
                  {item.location && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-[#FF758F]" />
                      <span>{item.location}</span>
                    </div>
                  )}
                  {item.createdAt && (
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span>{new Date(item.createdAt).toLocaleDateString('ru-RU')}</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <h4 className="text-xs uppercase font-bold tracking-wider text-gray-400 mb-2">Описание</h4>
                  <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line bg-gray-900/60 p-4 rounded-2xl border border-gray-800 max-h-48 overflow-y-auto">
                    {item.description || 'Описание не указано.'}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                
                {/* Telegram Contact Button */}
                <a
                  href="https://t.me/tkeepk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 hover:from-rose-400 hover:to-pink-400 text-white font-bold text-base transition-all shadow-lg shadow-rose-500/25 group"
                >
                  <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  <span>Связаться в Telegram (t.me/tkeepk)</span>
                </a>

                <div className="flex items-center gap-3">
                  {/* Share button */}
                  <button
                    onClick={handleShare}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-gray-800 hover:bg-gray-700 text-gray-200 font-semibold text-sm transition-all border border-gray-700/60"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-emerald-400" />}
                    <span>{copied ? 'Ссылка скопирована' : 'Поделиться'}</span>
                  </button>

                  {/* Kufar Original Link */}
                  {item.sourceUrl && (
                    <a
                      href={item.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-semibold text-sm transition-all border border-amber-500/30"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>На Kufar.by</span>
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
