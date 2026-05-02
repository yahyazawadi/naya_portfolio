'use client';

import { useState } from 'react';
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
        style={{ fontFamily: 'var(--font-irish-grover), cursive' }}
        className="text-[#48ABBF] text-[26px] md:text-[32px] lg:text-[38px] leading-tight"
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
      <div className="relative overflow-hidden">
        <img
          src={group.coverImage}
          alt={group.title}
          className="w-full h-[260px] md:h-[340px] lg:h-[380px] object-cover transition-transform duration-500 group-hover/img:scale-[1.04]"
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

// ─── GroupDetailView ───────────────────────────────────────────────────────────
function GroupDetailView({
  group,
}: {
  group: ArtGroup;
}) {
  return (
    <div className="w-full animate-fadeIn">
      {/* Masonry image grid — no extra header; back arrow lives in the page header */}
      <div
        className="px-8 md:px-16 lg:px-24 py-8"
        style={{ columns: '2 280px', gap: '16px' }}
      >
        {group.images.map((src, i) => (
          <div
            key={i}
            className="break-inside-avoid mb-4 overflow-hidden group/tile cursor-zoom-in"
          >
            <img
              src={src}
              alt={`${group.title} ${i + 1}`}
              className="w-full h-auto object-cover transition-transform duration-500 group-hover/tile:scale-[1.03]"
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
          style={{ fontFamily: 'var(--font-irish-grover), cursive' }}
          className="text-[#48ABBF] text-center text-[26px] sm:text-[30px] md:text-[44px] lg:text-[52px] leading-tight"
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
          <GroupDetailView group={selectedGroup} />
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

      <Footer />
    </div>
  );
}
