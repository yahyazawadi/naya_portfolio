'use client';

import { useState } from 'react';
import Footer from '../../components/Footer';

// ─── Types ────────────────────────────────────────────────────────────────────
// This interface will map 1:1 with the DB schema when we integrate Cloudflare.
interface ArtGroup {
  id: string;
  title: string;
  description: string;
  coverImage: string;  // the representative cover shown in the list
  images: string[];    // all images shown in the detail masonry grid
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
// Replace this array with a fetch() from Cloudflare/DB later.
const mockGroups: ArtGroup[] = [
  {
    id: 'traditional-paintings',
    title: 'Traditional Paintings',
    description:
      'Watercolor, acrylic, and oil — bringing scenes to life with raw texture and emotion. Each piece is a window into a handcrafted world.',
    coverImage: 'https://picsum.photos/seed/trad_cover/900/600',
    images: [
      'https://picsum.photos/seed/tp1/600/800',
      'https://picsum.photos/seed/tp2/900/600',
      'https://picsum.photos/seed/tp3/500/700',
      'https://picsum.photos/seed/tp4/700/500',
      'https://picsum.photos/seed/tp5/600/900',
      'https://picsum.photos/seed/tp6/800/600',
    ],
  },
  {
    id: 'clay-crafts',
    title: 'Clay & other Crafts',
    description:
      'Handcrafted clay figures and mixed-media creations with a playful, tactile spirit. Small sculptures with big personalities.',
    coverImage: 'https://picsum.photos/seed/clay_cover/900/600',
    images: [
      'https://picsum.photos/seed/cc1/600/500',
      'https://picsum.photos/seed/cc2/500/700',
      'https://picsum.photos/seed/cc3/800/600',
      'https://picsum.photos/seed/cc4/600/800',
      'https://picsum.photos/seed/cc5/700/500',
    ],
  },
  {
    id: 'character-art',
    title: 'Character Art & Design',
    description:
      'Original characters with personality — from anime-style portraits to storybook fantasy. Every design tells its own story.',
    coverImage: 'https://picsum.photos/seed/char_cover/900/600',
    images: [
      'https://picsum.photos/seed/ca1/500/700',
      'https://picsum.photos/seed/ca2/800/600',
      'https://picsum.photos/seed/ca3/600/800',
      'https://picsum.photos/seed/ca4/700/500',
      'https://picsum.photos/seed/ca5/500/600',
      'https://picsum.photos/seed/ca6/800/900',
      'https://picsum.photos/seed/ca7/600/600',
    ],
  },
];

// ─── GroupCard ─────────────────────────────────────────────────────────────────
// Alternates layout: even index = LTR (text left, image right)
//                    odd index  = RTL (image left with border, text right)
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
        {/* Hover overlay */}
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
// Shows a single group's images in a free masonry column grid.
function GroupDetailView({
  group,
  onBack,
}: {
  group: ArtGroup;
  onBack: () => void;
}) {
  return (
    <div className="w-full animate-fadeIn">
      {/* Group header bar */}
      <div className="w-full bg-[#0D2C44] py-8 px-8 md:px-16 flex items-center gap-6 border-b border-[#48ABBF]/20">
        <button
          onClick={onBack}
          className="text-[#48ABBF] hover:text-white transition-colors text-[14px] md:text-[16px] font-medium flex items-center gap-2 whitespace-nowrap"
        >
          ← Back
        </button>
        <h2
          style={{ fontFamily: 'var(--font-irish-grover), cursive' }}
          className="text-[#48ABBF] text-[24px] md:text-[36px] lg:text-[44px] text-center flex-1"
        >
          {group.title}
        </h2>
        {/* Spacer to keep title centered */}
        <div className="w-[60px] hidden md:block" />
      </div>

      {/* Masonry image grid */}
      <div
        className="px-8 md:px-16 lg:px-24 py-12"
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

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AnimationPage() {
  const [selectedGroup, setSelectedGroup] = useState<ArtGroup | null>(null);

  return (
    <div className="relative w-full min-h-screen bg-[#051C30] overflow-hidden">
      {/* ── Header bar (always visible) ── */}
      <div className="w-full h-[200px] md:h-[240px] bg-[#0F314D]" />

      {/* ── Page title (hidden when viewing a group detail) ── */}
      {!selectedGroup && (
        <div className="absolute top-[70px] md:top-[90px] left-0 right-0 flex justify-center px-4 pointer-events-none">
          <h1
            style={{ fontFamily: 'var(--font-irish-grover), cursive' }}
            className="text-[#48ABBF] text-center text-[26px] sm:text-[30px] md:text-[44px] lg:text-[56px] leading-tight"
          >
            Animations &amp; Motion Graphics
          </h1>
        </div>
      )}

      {/* ── Main content ── */}
      <div className="relative z-10 -mt-2">
        {selectedGroup ? (
          <GroupDetailView
            group={selectedGroup}
            onBack={() => setSelectedGroup(null)}
          />
        ) : (
          <div className="flex flex-col">
            {mockGroups.map((group, i) => (
              <GroupCard
                key={group.id}
                group={group}
                index={i}
                onSelect={() => setSelectedGroup(group)}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      <Footer />
    </div>
  );
}
