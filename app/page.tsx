export const runtime = 'edge';

import Image from "next/image";
import Link from "next/link";
import Footer from "../components/Footer";
import PortfolioPrefetcher from "../components/PortfolioPrefetcher";

const portfolioItems = [
  {
    src: "/images/DigitalArt&Illustration.webp",
    title: "Digital Art & Illustrations",
    subtitle: "Using Krita, StylusX\n& Clip Studio Paint",
    href: "/digital-art",
    type: "wide",
  },
  {
    src: "/images/traditionalarts&crafts.webp",
    title: "Traditional Art & Crafts",
    subtitle: "Paintings made with Water/Acrylic colors\nClay & other craftrs",
    href: "/traditional-art",
    type: "narrow",
  },
  {
    src: "/images/illustrator&photoshop.webp",
    title: "Graphic Design",
    subtitle: "Illustrator & Photoshop",
    href: "/graphic-design",
    type: "narrow",
  },
  {
    src: "/images/Animation&MotionGraphics.webp",
    title: "Animation & Motion Graphics",
    subtitle: "Krita, Illustrator, Adobe Animate\n& Adobe After Effects",
    href: "/animation",
    type: "wide",
  },
];

export default function Home() {
  return (
    <div className="relative w-full bg-[#0B1D32]">
      {/* ═══════════════════════════════════════════════
          SECTION 1 — City skyline (Main Background)
          ═══════════════════════════════════════════════ */}
      <div className="relative w-full overflow-hidden z-0">
        <div className="relative w-[130%] md:w-[110%] -left-[15%] md:-left-[5%]">
          <img
            src="/images/city.webp"
            alt="City Background"
            className="w-full h-auto block object-cover"
          />
        </div>
      </div>

      {/* 
          CRITICAL: (ill kill you if you touch this)
          Background circles/strips for the main page. 
          Moved to root to prevent clipping by wrappers.
          Set to z-100 to ensure they are always visible on the sides.
          DO NOT TOUCH THIS SECTION.
      */}
      <div className="absolute left-0 top-[1500px] pointer-events-none select-none z-[100]">
        <Image
          src="/vectors/main_left_circles.png"
          alt="Decorative background circles"
          width={242}
          height={2493}
          priority
          className="w-[180px] md:w-[240px] lg:w-[300px] h-auto opacity-90"
        />
      </div>
      <div className="absolute right-0 top-[1500px] pointer-events-none select-none z-[100]">
        <Image
          src="/vectors/main_right_circles.png"
          alt="Decorative background circles"
          width={295}
          height={2349}
          priority
          className="w-[180px] md:w-[240px] lg:w-[300px] h-auto opacity-90"
        />
      </div>

      {/* 
          CRITICAL: DO NOT add overflow-hidden to this section. 
          This allows the character PNG to visually overlap/overflow 
          as requested by the user. 
          Elevated z-index to z-60 to ensure it overlaps everything (including navbar).
          DO NOT TOUCH THIS SECTION'S OVERFLOW OR Z-INDEX.
      */}
      <div className="relative w-full -mt-[45vw] md:-mt-[40vw] lg:-mt-[35vw] z-60">
        {/* Upper cloud layer */}
        <Image
          src="/images/cloud_up.webp"
          alt=""
          width={1920}
          height={1080}
          priority
          className="relative w-full h-auto block z-10"
        />

        {/* Lower cloud layer */}
        <Image
          src="/images/cloud_down.webp"
          alt=""
          width={1920}
          height={1080}
          priority
          className="relative w-full h-auto block z-10 -mt-[12vw]"
        />

        {/* Character + Vectors overlay */}
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none pt-[10vw] overflow-hidden">
          <Image
            src="/vectors/mainpagebackgroundcirclescopy.png"
            alt=""
            width={1865}
            height={562}
            priority
            className="absolute w-[180%] md:w-[140%] max-w-none h-auto opacity-90"
          />
          <Image
            src="/images/nayaherself.webp"
            alt="Naya"
            width={1200}
            height={1697}
            priority
            className="relative w-[85%] md:w-[60%] max-w-[850px] h-auto z-10 drop-shadow-2xl"
          />
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          SECTION 3 & 4 — Content Area
          ═══════════════════════════════════════════════ */}
      {/* ═══════════════════════════════════════════════
          CONTENT WRAPPER (Sections 3, 4, & 5)
          ═══════════════════════════════════════════════ */}
      <div className="relative w-full">

        {/* ── Section 3 & 4: Intro & Grid ── */}
        <div className="relative">
          {/* Intro Text */}
          <div className="relative z-70 text-center px-6 mt-[5vw] md:-mt-[12vw] pb-16 md:pb-32">
            <h1 className="font-sans text-white text-[15px] sm:text-base md:text-lg lg:text-xl font-normal leading-relaxed tracking-wide max-w-[360px] sm:max-w-[850px] mx-auto">
              Hi, I&apos;m{" "}
              <span className="font-accent text-[2.2em] md:text-[3em] text-[#3FE2FF] align-middle px-1 leading-none">
                Naya
              </span>
              ! I&apos;m a digital &amp; traditional artist,
              <br className="hidden sm:block" />
              illustrator, graphic designer and animator.
            </h1>
          </div>

          {/* The Grid */}
          <div className="relative z-[110] max-w-[1650px] mx-auto px-4 md:px-10 lg:px-20 pb-4 md:pb-8 flex flex-col gap-y-32">
            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-[1100fr_506fr] gap-x-16 gap-y-12 md:gap-y-0 items-start">
              {[portfolioItems[0], portfolioItems[1]].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex flex-col no-underline"
                >
                  <div className={`relative overflow-hidden rounded-[8px] shadow-2xl transition-all duration-500 group-hover:scale-[1.015] group-hover:shadow-[0_30px_60px_rgba(0,0,0,0.6)] ${item.type === 'wide' ? 'aspect-[1100/768]' : 'aspect-[506/768]'}`}>
                    <img
                      src={item.src}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="mt-8 text-center pb-4 md:pb-0">
                    <h2 className="font-sans font-bold text-white text-[18px] md:text-[20px] tracking-tight">{item.title}</h2>
                    <p className="font-sans text-white/50 text-[14px] md:text-[15px] mt-2 whitespace-pre-line font-medium leading-relaxed italic">{item.subtitle}</p>
                  </div>
                </Link>
              ))}
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-[506fr_1100fr] gap-x-16 gap-y-12 md:gap-y-0 items-start">
              {[portfolioItems[2], portfolioItems[3]].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex flex-col no-underline"
                >
                  <div className={`relative overflow-hidden rounded-[8px] shadow-2xl transition-all duration-500 group-hover:scale-[1.015] group-hover:shadow-[0_30px_60px_rgba(0,0,0,0.6)] ${item.type === 'wide' ? 'aspect-[1100/768]' : 'aspect-[506/768]'}`}>
                    <img
                      src={item.src}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="mt-8 text-center pb-4 md:pb-0">
                    <h2 className="font-sans font-bold text-white text-[18px] md:text-[20px] tracking-tight">{item.title}</h2>
                    <p className="font-sans text-white/50 text-[14px] md:text-[15px] mt-2 whitespace-pre-line font-medium leading-relaxed italic">{item.subtitle}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* ── Section 5: About & Contact ── */}
        <Footer hideStrips />
      </div>

      {/* Silent background prefetching */}
      <PortfolioPrefetcher />
    </div>
  );
}
