'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import Footer from './Footer';

// ─── Types ────────────────────────────────────────────────────────────────────
export interface ArtGroup {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  images: string[];
}

interface GalleryPageProps {
  title: string;
  groups: ArtGroup[];
}

function ImageWithFade({ src, alt, className }: { src: string, alt: string, className?: string }) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="relative w-full h-full bg-white/5 rounded-sm overflow-hidden">
      <img
        src={src}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        className={`${className} transition-all duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        ref={(img) => {
          if (img?.complete && !isLoaded) {
            setIsLoaded(true);
          }
        }}
      />
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite] pointer-events-none" />
      )}
    </div>
  );
}

// ─── GroupCard ─────────────────────────────────────────────────────────────────
function GroupCard({
  group,
  index,
  onSelect,
}: {
  group: ArtGroup;
  index: number;
  onSelect: () => void;
}) {
  const isLTR = index % 2 === 0;

  const textBlock = (
    <div className="flex-1 flex flex-col gap-5 py-4">
      <h2
        className="font-grover text-[#48ABBF] text-[26px] md:text-[32px] lg:text-[38px] leading-tight"
      >
        {group.title}:
      </h2>
      <p className="text-white/75 text-[15px] md:text-[17px] leading-relaxed max-w-[440px]">
        {group.description}
      </p>
    </div>
  );

  const imageBlock = (
    <div
      className={`flex-[1.4] cursor-pointer group/img ${
        !isLTR ? 'border-2 border-[#48ABBF] p-1' : ''
      }`}
      onClick={onSelect}
    >
      <div className="relative overflow-hidden group-hover/img:scale-[1.04] transition-transform duration-500">
        <ImageWithFade 
          src={group.coverImage} 
          alt={group.title} 
          className="w-full h-[260px] md:h-[340px] lg:h-[380px] object-cover" 
        />
        <div className="absolute inset-0 bg-[#48ABBF]/0 group-hover/img:bg-black/30 transition-all duration-300 flex items-center justify-center">
          <span className="text-white text-[16px] font-semibold opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 bg-black/50 px-6 py-3 rounded-full backdrop-blur-sm tracking-wide">
            View Gallery →
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className={`w-full flex flex-col md:flex-row items-center gap-8 md:gap-12 lg:gap-20
        py-10 md:py-14 px-8 md:px-16 lg:px-28
        border-b border-white/5 last:border-b-0
        ${isLTR ? 'md:flex-row' : 'md:flex-row-reverse'}`}
    >
      {textBlock}
      {imageBlock}
    </div>
  );
}

// ─── Lightbox ──────────────────────────────────────────────────────────────────
function Lightbox({ 
  images, 
  currentIndex, 
  onClose, 
  onNext, 
  onPrev 
}: { 
  images: string[]; 
  currentIndex: number; 
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    if (diff > 50) onNext(); // Swipe left
    if (diff < -50) onPrev(); // Swipe right
    setTouchStart(null);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    
    // Lock scroll on both body and html
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
    };
  }, [onClose, onNext, onPrev]);

  return (
    <div 
      className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-md flex items-center justify-center animate-fadeIn touch-none select-none p-4 md:p-12"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={onClose}
    >
      <button 
        className="absolute top-6 right-6 md:top-10 md:right-10 text-white/40 hover:text-white z-[210] p-2 transition-colors"
        onClick={onClose}
      >
        <X size={32} />
      </button>

      {/* Navigation Buttons */}
      <button 
        className="absolute left-6 md:left-12 bottom-10 md:bottom-22 p-3 md:p-4 bg-white/5 hover:bg-white/10 rounded-full text-white transition-all z-[210] backdrop-blur-sm"
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
      >
        <ChevronLeft size={24} className="md:w-8 md:h-8" />
      </button>
      <button 
        className="absolute right-6 md:right-12 bottom-10 md:bottom-22 p-3 md:p-4 bg-white/5 hover:bg-white/10 rounded-full text-white transition-all z-[210] backdrop-blur-sm"
        onClick={(e) => { e.stopPropagation(); onNext(); }}
      >
        <ChevronRight size={24} className="md:w-8 md:h-8" />
      </button>

      {/* Main Image Container */}
      <div 
        className="relative w-full h-full flex flex-col items-center justify-center pointer-events-none" 
        onClick={(e) => e.stopPropagation()}
      >
        <img 
          src={images[currentIndex]} 
          alt="" 
          className="max-w-full max-h-full object-contain shadow-2xl rounded-sm pointer-events-auto"
        />
        <div className="absolute bottom-12 md:bottom-24 left-1/2 -translate-x-1/2 text-white/50 text-sm md:text-lg font-medium tracking-[0.3em] uppercase">
          {currentIndex + 1} / {images.length}
        </div>
      </div>
    </div>
  );
}

// ─── GroupDetailView ───────────────────────────────────────────────────────────
function GroupDetailView({
  group,
  onImageClick,
}: {
  group: ArtGroup;
  onImageClick: (index: number) => void;
}) {
  return (
    <div className="w-full animate-fadeIn">
      <div
        className="px-8 md:px-16 lg:px-24 py-8"
        style={{ columns: '2 280px', gap: '16px' }}
      >
        {group.images.map((src, i) => (
          <div
            key={i}
            id={`gallery-item-${i}`}
            className="break-inside-avoid mb-4 overflow-hidden group/tile cursor-zoom-in relative bg-white/5 rounded-sm scroll-mt-24"
            onClick={() => onImageClick(i)}
          >
            <ImageWithFade 
              src={src} 
              alt={`${group.title} ${i + 1}`} 
              className="w-full h-auto object-cover group-hover/tile:scale-[1.03] duration-500" 
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── GalleryPage Component ──────────────────────────────────────────────────────
export default function GalleryPage({ title, groups }: GalleryPageProps) {
  const [selectedGroup, setSelectedGroup] = useState<ArtGroup | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const handleNext = useCallback(() => {
    if (lightboxIndex !== null && selectedGroup) {
      setLightboxIndex((lightboxIndex + 1) % selectedGroup.images.length);
    }
  }, [lightboxIndex, selectedGroup]);

  const handlePrev = useCallback(() => {
    if (lightboxIndex !== null && selectedGroup) {
      setLightboxIndex((lightboxIndex - 1 + selectedGroup.images.length) % selectedGroup.images.length);
    }
  }, [lightboxIndex, selectedGroup]);

  const handleClose = useCallback(() => {
    const lastIndex = lightboxIndex;
    setLightboxIndex(null);
    
    // Give the browser a moment to restore scroll ability before jumping
    if (lastIndex !== null) {
      setTimeout(() => {
        const el = document.getElementById(`gallery-item-${lastIndex}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 50);
    }
  }, [lightboxIndex]);

  function handleSelect(group: ArtGroup) {
    setSelectedGroup(group);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  function handleBack() {
    setSelectedGroup(null);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  const headerTitle = selectedGroup ? selectedGroup.title : title;

  return (
    <div className="relative w-full min-h-screen bg-[#051C30] overflow-hidden">
      {/* CRITICAL: DO NOT change overflow-hidden on this root div. It is needed for this page. */}
      
      {/* ── Header bar ── */}
      <div className="w-full bg-[#0F314D] flex items-center justify-center relative z-40
        pt-[120px] pb-8 md:pt-[140px] md:pb-10 px-10 md:px-20"
      >
        {/* Back arrow */}
        {selectedGroup && (
          <button
            onClick={handleBack}
            className="absolute left-10 md:left-20 text-[#48ABBF] hover:text-white
              transition-colors text-[28px] md:text-[36px] leading-none"
            aria-label="Back"
          >
            ←
          </button>
        )}

        {/* Title */}
        <h1
          className="font-grover text-[#48ABBF] text-center text-[26px] sm:text-[30px] md:text-[44px] lg:text-[52px] leading-tight"
        >
          {headerTitle}
        </h1>
      </div>

      {/* ── Side circles ── */}
      <div className="absolute left-0 top-[280px] md:top-[320px] pointer-events-none select-none z-20">
        <img src="/vectors/page_left_side.png" alt="" className="w-[90px] md:w-[110px] lg:w-[130px] h-auto" />
      </div>
      <div className="absolute right-0 top-[280px] md:top-[320px] pointer-events-none select-none z-20">
        <img src="/vectors/page_right_side.png" alt="" className="w-[90px] md:w-[110px] lg:w-[130px] h-auto" />
      </div>

      {/* ── Content ── */}
      <div className="relative z-30">
        {selectedGroup ? (
          <GroupDetailView 
            group={selectedGroup} 
            onImageClick={(idx) => setLightboxIndex(idx)} 
          />
        ) : (
          <div className="flex flex-col">
            {groups.map((group, i) => (
              <GroupCard
                key={group.id}
                group={group}
                index={i}
                onSelect={() => handleSelect(group)}
              />
            ))}
          </div>
        )}
      </div>

      {lightboxIndex !== null && selectedGroup && (
        <Lightbox 
          images={selectedGroup.images} 
          currentIndex={lightboxIndex} 
          onClose={handleClose}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      )}

      <Footer />
    </div>
  );
}
