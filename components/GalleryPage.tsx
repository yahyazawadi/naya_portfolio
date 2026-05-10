'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import Footer from './Footer';
import SmartImage from './SmartImage';

// ─── Types ────────────────────────────────────────────────────────────────────
export interface GalleryItem {
  url: string;
  description?: string;
  date?: string;
}

export interface ArtGroup {
  id: string;
  title: string;
  description: string;
  date?: string;
  coverImage: string;
  images: GalleryItem[];
}

interface GalleryPageProps {
  title: string;
  groups: ArtGroup[];
}

// ─── Utility ──────────────────────────────────────────────────────────────────
const isVideo = (src: string) => {
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov'];
  return videoExtensions.some(ext => src.toLowerCase().endsWith(ext));
};

function AssetWithFade({ src, alt, className, onConverted, onEnded, isPlaying }: { src: string, alt: string, className?: string, onConverted?: (newUrl: string) => void, onEnded?: () => void, isPlaying?: boolean }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const video = isVideo(src);
  const [el, setEl] = useState<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!el || !video) return;

    if (isPlaying) {
      el.play().catch(() => {});
    } else {
      el.pause();
    }
  }, [el, video, isPlaying]);

  useEffect(() => {
    if (!el || !video || !onEnded) return;
    el.addEventListener('ended', onEnded);
    return () => el.removeEventListener('ended', onEnded);
  }, [el, video, onEnded]);

  return (
    <div className={`relative w-full h-full flex items-center justify-center rounded-sm overflow-hidden ${className?.includes('lightbox-image') ? 'bg-transparent' : 'bg-white/5'}`}>
      {video ? (
        <video
          ref={setEl}
          src={src}
          onLoadedData={() => setIsLoaded(true)}
          className={`${className} transition-all duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          muted
          playsInline
        />
      ) : (
        <SmartImage
          src={src}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          className={`${className} transition-all duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          onConverted={onConverted}
        />
      )}
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
  onConverted,
}: {
  group: ArtGroup;
  index: number;
  onSelect: () => void;
  onConverted: (oldUrl: string, newUrl: string) => void;
}) {
  const isLTR = index % 2 === 0;

  const textBlock = (
    <div className="flex-1 flex flex-col items-center md:items-start gap-4 py-2 md:py-4">
      <h2
        className="font-grover text-[#48ABBF] text-[44px] md:text-[48px] lg:text-[60px] leading-tight text-center md:text-left"
      >
        {group.title}:
      </h2>
      {group.date && (
        <div className="flex items-center justify-center md:justify-start gap-2 text-white/40 text-[13px] lg:text-[16px] font-bold tracking-widest uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-[#48ABBF]/40" />
          {group.date}
        </div>
      )}
      <p className="text-white/75 text-[16px] md:text-[17px] lg:text-[22px] leading-relaxed max-w-[500px] lg:max-w-[700px] text-center md:text-left">
        {group.description}
      </p>
    </div>
  );

  const imageBlock = (
    <div
      className="flex-[1.4] w-full cursor-pointer group/img border border-white/10 p-1 bg-white/5 rounded-lg overflow-hidden shadow-2xl"
    >
      <div 
        className="relative overflow-hidden group-hover/img:scale-[1.02] transition-transform duration-500 rounded-md"
        onClick={onSelect}
      >
        <AssetWithFade 
          src={group.coverImage} 
          alt={group.title} 
          className="w-full h-[300px] md:h-[340px] lg:h-[380px] object-cover" 
          onConverted={(newUrl) => onConverted(group.coverImage, newUrl)}
        />
        <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/40 transition-all duration-300 flex items-center justify-center">
          <span className="text-white text-[16px] font-semibold opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 bg-[#48ABBF]/80 px-6 py-3 rounded-full backdrop-blur-sm tracking-wide">
            View Gallery →
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className={`w-full flex flex-col md:flex-row items-center gap-10 md:gap-12 lg:gap-20
        py-12 md:py-16 px-6 md:px-16 lg:px-28
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
  images: GalleryItem[]; 
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
      className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-md flex items-center justify-center animate-fadeIn touch-none select-none"
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

      <div 
        className="relative w-full h-full flex items-center justify-center" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Main Image - Takes full screen space */}
        <div className="w-full h-full flex items-center justify-center p-2 md:p-6">
          <AssetWithFade 
            src={images[currentIndex].url} 
            alt={`Gallery image ${currentIndex + 1}`} 
            className="lightbox-image w-full h-full object-contain pointer-events-auto"
          />
        </div>

        {/* Floating Info & Navigation Overlay */}
        <div className="absolute bottom-8 md:bottom-16 left-0 right-0 flex flex-col items-center gap-6 pointer-events-none z-[220]">
          {/* Description & Date Badge */}
          {(images[currentIndex].description || images[currentIndex].date) && (
            <div className="bg-black/70 backdrop-blur-xl px-10 py-4 rounded-[2rem] border border-white/10 max-w-[90vw] md:max-w-3xl text-center animate-fadeIn pointer-events-auto flex flex-wrap items-baseline justify-center gap-x-6 gap-y-2 mx-6 shadow-2xl">
              {images[currentIndex].date && (
                <span className="text-[#48ABBF] text-[13px] font-black uppercase tracking-[0.3em] whitespace-nowrap">
                  {images[currentIndex].date}
                </span>
              )}
              {images[currentIndex].description && (
                <p className="text-white text-base md:text-xl leading-relaxed font-bold tracking-tight">
                  {images[currentIndex].description}
                </p>
              )}
            </div>
          )}

          {/* Page Indicator */}
          <div className="bg-white/5 backdrop-blur-md px-6 py-2 rounded-full border border-white/5 text-white/50 text-[12px] font-black tracking-[0.5em] uppercase pointer-events-auto">
            {currentIndex + 1} / {images.length}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── GroupDetailView ───────────────────────────────────────────────────────────
function GroupDetailView({
  group,
  onImageClick,
  onConverted,
}: {
  group: ArtGroup;
  onImageClick: (index: number) => void;
  onConverted: (oldUrl: string, newUrl: string) => void;
}) {
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);

  // Initialize: start first video
  useEffect(() => {
    const firstVideoIdx = group.images.findIndex(img => isVideo(img.url));
    if (firstVideoIdx !== -1) setPlayingIndex(firstVideoIdx);
  }, [group.id]);

  const handleEnded = (index: number) => {
    // Find next video
    const nextVideoIdx = group.images.findIndex((img, i) => i > index && isVideo(img.url));
    if (nextVideoIdx !== -1) {
      setPlayingIndex(nextVideoIdx);
      // Optional: scroll to next video
      const el = document.getElementById(`gallery-item-${nextVideoIdx}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      // Loop back to first or just stop
      setPlayingIndex(null);
    }
  };

  return (
    <div className="w-full animate-fadeIn">
      <div
        className="px-8 md:px-16 lg:px-24 py-8"
        style={{ columns: '2 280px', gap: '16px' }}
      >
        {group.images.map((item, i) => (
          <div
            key={i}
            id={`gallery-item-${i}`}
            className="break-inside-avoid mb-10 group/tile cursor-zoom-in relative scroll-mt-24"
          >
            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden p-1.5 hover:border-[#48ABBF]/40 transition-colors duration-500 shadow-2xl">
              <AssetWithFade 
                src={item.url} 
                alt={`${group.title} ${i + 1}`} 
                className="w-full h-auto object-cover rounded-[2rem] group-hover/tile:scale-[1.02] duration-700 transition-transform" 
                onConverted={(newUrl) => onConverted(item.url, newUrl)}
                isPlaying={playingIndex === i}
                onEnded={() => handleEnded(i)}
              />
              {(item.date || item.description) && (
                <div className="px-8 py-7 flex flex-wrap items-baseline gap-x-5 gap-y-2">
                  {item.date && (
                    <span className="text-[#48ABBF] text-[15px] md:text-[16px] lg:text-[20px] font-black uppercase tracking-[0.3em] whitespace-nowrap">
                      {item.date}
                    </span>
                  )}
                  {item.description && (
                    <p className="text-white text-[20px] md:text-[24px] lg:text-[32px] leading-tight font-black tracking-tight">
                      {item.description}
                    </p>
                  )}
                </div>
              )}
            </div>
            {/* Click overlay to trigger gallery */}
            <div 
              className="absolute inset-0 z-10" 
              onClick={() => onImageClick(i)} 
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── GalleryPage Component ──────────────────────────────────────────────────────
export default function GalleryPage({ title, groups: initialGroups }: GalleryPageProps) {
  const [localGroups, setLocalGroups] = useState<ArtGroup[]>(initialGroups);
  const [selectedGroup, setSelectedGroup] = useState<ArtGroup | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  
  const searchParams = useSearchParams();
  const router = useRouter();

  // Handle Initial Deep Link (by Title/Slug)
  useEffect(() => {
    const groupSlug = searchParams.get('id');
    if (groupSlug) {
      const targetSlug = groupSlug.toLowerCase();
      const group = localGroups.find(g => {
        const currentSlug = g.title
          .replace(/&/g, 'and')
          .replace(/[^a-zA-Z0-9]/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '')
          .toLowerCase();
        return currentSlug === targetSlug;
      });
      if (group) {
        setSelectedGroup(group);
      }
    }
  }, [searchParams, localGroups]);

  const handleImageConverted = useCallback((oldUrl: string, newUrl: string) => {
    setLocalGroups(prev => prev.map(g => {
      let updated = false;
      let newCover = g.coverImage;
      let newImages = [...g.images];

      if (g.coverImage === oldUrl) {
        newCover = newUrl;
        updated = true;
      }
      newImages = newImages.map(img => {
        const url = typeof img === 'string' ? img : img.url;
        if (url === oldUrl) {
          updated = true;
          return { ...(typeof img === 'string' ? {} : img), url: newUrl };
        }
        return img;
      });

      if (updated) {
        const updatedGroup = { ...g, coverImage: newCover, images: newImages };
        // If this group is currently selected, update it too
        if (selectedGroup?.id === g.id) {
          setSelectedGroup(updatedGroup);
        }
        return updatedGroup;
      }
      return g;
    }));
  }, [selectedGroup]);

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
    // Update URL with formatted Slug
    const slug = group.title
      .replace(/&/g, 'and')
      .replace(/[^a-zA-Z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    const url = new URL(window.location.href);
    url.searchParams.set('id', slug);
    window.history.pushState({}, '', url.toString());
  }

  function handleBack() {
    if (selectedGroup) {
      setSelectedGroup(null);
      window.scrollTo({ top: 0, behavior: 'instant' });
      // Clear URL param
      const url = new URL(window.location.href);
      url.searchParams.delete('id');
      window.history.pushState({}, '', url.toString());
    } else {
      router.push('/');
    }
  }

  const headerTitle = selectedGroup ? selectedGroup.title : title;

  return (
    <div className="relative w-full min-h-screen bg-[#051C30] overflow-hidden">
      {/* CRITICAL: DO NOT change overflow-hidden on this root div. It is needed for this page. */}
      
      {/* ── Header bar ── */}
      <div className="w-full bg-[#0F314D] relative z-40
        pt-[120px] pb-8 md:pt-[140px] md:pb-10 px-10 md:px-20"
      >
        <div className="relative flex items-center justify-center w-full">
          {/* Back arrow - Always visible */}
          <button
            onClick={handleBack}
            className="absolute left-0 md:left-0 text-[#48ABBF] hover:text-white
              transition-colors z-50"
            aria-label="Back"
          >
            <ArrowLeft size={48} className="md:w-10 md:h-10" />
          </button>

          {/* Title */}
          <h1
            className="font-grover text-[#48ABBF] text-center text-[26px] sm:text-[30px] md:text-[44px] lg:text-[72px] leading-tight"
          >
            {headerTitle}
          </h1>
        </div>
      </div>

      {/* ── Side circles ── */}
      <div className="absolute left-0 top-[280px] md:top-[320px] pointer-events-none select-none z-20">
        <img src="/vectors/page_left_side.webp" alt="" className="w-[90px] md:w-[110px] lg:w-[130px] h-auto" />
      </div>
      <div className="absolute right-0 top-[280px] md:top-[320px] pointer-events-none select-none z-20">
        <img src="/vectors/page_right_side.webp" alt="" className="w-[90px] md:w-[110px] lg:w-[130px] h-auto" />
      </div>

      {/* ── Content ── */}
      <div className="relative z-30">
        {selectedGroup ? (
          <GroupDetailView 
            group={selectedGroup} 
            onImageClick={(idx) => setLightboxIndex(idx)} 
            onConverted={handleImageConverted}
          />
        ) : (
          <div className="flex flex-col">
            {localGroups.map((group, i) => (
              <GroupCard
                key={group.id}
                group={group}
                index={i}
                onSelect={() => handleSelect(group)}
                onConverted={handleImageConverted}
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
