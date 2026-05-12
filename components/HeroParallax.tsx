"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";

const layers = [
  { src: "/images/city1.webp", speed: -0.05, z: 20 },
  { src: "/images/city2.webp", speed: -0.3, z: 21 },
  { src: "/images/city3.webp", speed: -0.7, z: 22 },
  { src: "/images/city4.webp", speed: -1.2, z: 23 },
];

// Doubled glare instances for high-density bokeh sky
const glareLayers = [
  // Upper section
  { left: '2%', top: '2%', scale: 0.8, opacity: 0.4 },
  { left: '15%', top: '12%', scale: 0.7, opacity: 0.3 },
  { left: '10%', top: '5%', scale: 0.9, opacity: 0.5 },
  { left: '40%', top: '15%', scale: 0.9, opacity: 0.3 },
  { left: '70%', top: '10%', scale: 0.5, opacity: 0.6 },
  { left: '90%', top: '25%', scale: 0.2, opacity: 0.4 },
  // Middle section
  { left: '20%', top: '45%', scale: 1.1, opacity: 0.3 },
  { left: '55%', top: '60%', scale: 1.4, opacity: 0.4 },
  { left: '80%', top: '40%', scale: 0.9, opacity: 0.5 },
  { left: '5%', top: '55%', scale: 0.3, opacity: 0.3 },
  // Bottom section (enters during scroll)
  { left: '-15%', top: '100%', scale: 0.9, opacity: 0.4 },
  { left: '30%', top: '120%', scale: 0.9, opacity: 0.5 },
  { left: '60%', top: '110%', scale: 0.7, opacity: 0.3 },
  { left: '95%', top: '135%', scale: 0.8, opacity: 0.5 },
  { left: '15%', top: '145%', scale: 0.9, opacity: 0.4 },
  { left: '45%', top: '160%', scale: 1.2, opacity: 0.4 },
  { left: '75%', top: '175%', scale: 0.8, opacity: 0.3 },
  { left: '5%', top: '190%', scale: 1.5, opacity: 0.5 },
  { left: '85%', top: '155%', scale: 0.6, opacity: 0.4 },
  { left: '40%', top: '210%', scale: 1.1, opacity: 0.3 },
  { left: '65%', top: '230%', scale: 0.9, opacity: 0.4 },
];

const STEPS = [0, 350, 1480];

export default function HeroParallax() {
  const [isDesktop, setIsDesktop] = useState(true);
  const [smoothScroll, setSmoothScroll] = useState(0);
  const [winHeight, setWinHeight] = useState(1000);

  const scrollYRef = useRef(0);
  const [currentStep, setCurrentStep] = useState(0);
  const stepRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const requestRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 1024);
      setWinHeight(window.innerHeight);
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    const handleScroll = () => {
      const y = window.scrollY;
      if (y > 0) {
        scrollYRef.current = y + STEPS[STEPS.length - 1];
        // Sync step if we scroll into the portfolio
        if (stepRef.current !== STEPS.length - 1) {
          stepRef.current = STEPS.length - 1;
          setCurrentStep(STEPS.length - 1);
        }
      }
    };

    const handleWheel = (e: WheelEvent) => {
      const isAtTop = window.scrollY <= 5;

      if (isAtTop) {
        if (e.deltaY > 0 && stepRef.current < STEPS.length - 1) {
          e.preventDefault();
          if (!isAnimatingRef.current) {
            isAnimatingRef.current = true;
            stepRef.current += 1;
            setCurrentStep(stepRef.current);
            scrollYRef.current = STEPS[stepRef.current];
            setTimeout(() => { isAnimatingRef.current = false; }, 600);
          }
        } else if (e.deltaY < 0 && stepRef.current > 0) {
          e.preventDefault();
          if (!isAnimatingRef.current) {
            isAnimatingRef.current = true;
            stepRef.current -= 1;
            setCurrentStep(stepRef.current);
            scrollYRef.current = STEPS[stepRef.current];
            setTimeout(() => { isAnimatingRef.current = false; }, 600);
          }
        }
      }
    };

    const animate = () => {
      setSmoothScroll((prev) => {
        const diff = scrollYRef.current - prev;
        // Slower for first step (cinematic reveal), snappier for the rest
        const factor = prev < 350 ? 0.012 : 0.03;
        return prev + diff * factor;
      });
      requestRef.current = requestAnimationFrame(animate);
    };

    const handleSkipHero = () => {
      stepRef.current = STEPS.length - 1;
      setCurrentStep(STEPS.length - 1);
      scrollYRef.current = STEPS[STEPS.length - 1];
      setSmoothScroll(1500); // Push past 1400 immediately to unlock scroll
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("skipHero", handleSkipHero);
    requestRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("skipHero", handleSkipHero);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  // Clean up hero-done class on unmount
  useEffect(() => {
    return () => {
      document.documentElement.classList.remove('hero-done');
    };
  }, []);

  // Restore scroll once the hero is done (smoothScroll crosses threshold once)
  const isHeroDone = smoothScroll > 1400;
  useEffect(() => {
    if (isHeroDone && isDesktop) {
      document.documentElement.classList.add('hero-done');
    } else {
      document.documentElement.classList.remove('hero-done');
    }
  }, [isHeroDone, isDesktop]);

  // Step 2 (dark blue bg) → white navbar text; steps 0 & 1 (light cloud bg) → dark text
  useEffect(() => {
    if (currentStep === 2) {
      document.documentElement.classList.add('hero-step-last');
    } else {
      document.documentElement.classList.remove('hero-step-last');
    }
    return () => {
      document.documentElement.classList.remove('hero-step-last');
    };
  }, [currentStep]);

  if (!isDesktop) return null;

  // FINAL SYNCED TRIGGERS: Coordinated for a fast, punchy reveal
  const HALF_WHEEL = 100; // Start clouds almost immediately
  const FULL_ROTATION = 200; // Start Naya reveal much sooner

  const totalScrollHeight = winHeight * 1.4; // Reduced overall scroll distance
  const isPastHero = smoothScroll > 1400; // Triggers before STEPS[3]=1500 asymptote

  const globalProgress = Math.min(Math.max(smoothScroll / totalScrollHeight, 0), 1);
  const cloudActiveScroll = Math.max(0, smoothScroll - HALF_WHEEL);
  const cloudOpacity = 0.5 + Math.min(cloudActiveScroll / 300, 0.5);
  const nayaProgress = Math.min(Math.max((smoothScroll - FULL_ROTATION) / 150, 0), 1);
  const nayaOpacity = Math.min(Math.max((smoothScroll - FULL_ROTATION) / 80, 0), 1);

  // Dense cloud reveal: Balanced layers below the character's feet
  const cloudGroups = [
    { count: 4, margin: "-mt-[30vw]" },
    { count: 4, margin: "-mt-[45vw]" },
    { count: 4, margin: "-mt-[45vw]" },
    { count: 4, margin: "-mt-[45vw]" },
    { count: 4, margin: "-mt-[45vw]" },
    { count: 4, margin: "-mt-[45vw]" },
    { count: 4, margin: "-mt-[45vw]" },
  ];

  // Naya's "Stuck" logic: once she is revealed, she hooks onto the clouds and moves up
  const nayaStuckThreshold = 450; // Adjusted for earlier arrival
  const nayaStuckOffset = Math.max(0, smoothScroll - nayaStuckThreshold);

  // Overlay fade: clouds/Naya are off-screen by ~850, fade dark bg to reveal portfolio
  const overlayFade = smoothScroll > 900
    ? Math.max(0, 1 - (smoothScroll - 900) / 500)
    : 1;

  return (
    <div className="relative w-full h-0 bg-[#0B1D32]">
      {/* 
        PREVENT SCROLLBAR FLASH:
        This style tag is SSR'd, so the browser sees it BEFORE the first paint.
        It hides the scrollbar on desktop immediately.
      */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media (min-width: 1024px) {
          html:not(.hero-done) { overflow: hidden !important; }
          html:not(.hero-done) body { overflow: hidden !important; }
          html.hero-done { overflow: auto !important; }
        }
      `}} />

      <div
        className="fixed inset-0 bg-[#0B1D32] overflow-hidden pointer-events-none"
        style={{
          display: isPastHero ? 'none' : 'block',
          opacity: overlayFade,
          zIndex: 9999
        }}
      >

        {/* 1. CITY SKYLINE & LENS FLARES */}
        <div className="absolute inset-0 w-full h-full z-10" style={{ opacity: 1 - nayaProgress }}>

          {/* HIGH-SPEED CITY GLARES (Lens Flares) - Doubled & Intensified */}
          {glareLayers.map((glare, i) => (
            <div
              key={`glare-${i}`}
              className="absolute pointer-events-none mix-blend-screen"
              style={{
                left: glare.left,
                top: glare.top,
                zIndex: 25,
                width: '65vw',
                // Constant fast velocity, but takes longer to be covered by clouds
                transform: `translateY(${globalProgress * -15000}px) scale(${glare.scale * 0.85})`,
                opacity: 1.0
              }}
            >
              <Image
                src="/images/cityglare5.webp"
                alt=""
                width={800}
                height={800}
                priority
                className="w-full h-auto"
              />
              <div className="absolute inset-0 translate-x-[-8%] translate-y-[8%] opacity-70">
                <Image
                  src="/images/cityglare5.webp"
                  alt=""
                  width={800}
                  height={800}
                  priority
                  className="w-full h-auto"
                />
              </div>
            </div>
          ))}

          {layers.map((layer) => (
            <div
              key={layer.src}
              className="absolute inset-0 w-full h-full"
              style={{
                zIndex: layer.z,
                transform: `translateY(${globalProgress * layer.speed * 400}px) scale(${1 + globalProgress * 0.15})`,
              }}
            >
              <img src={layer.src} alt="" className="w-full h-full object-cover object-top" fetchPriority="high" loading="eager" />
            </div>
          ))}
        </div>

        {/* 2. PROGRESSIVE HYBRID CLOUD PILLAR */}
        <div
          className="absolute top-[75%] left-0 w-full z-30 flex flex-col items-center"
          style={{
            // velocity remains 4.5px for the cinematic feel
            transform: `translateY(-${cloudActiveScroll * 4.5}px) scale(0.85)`,
            opacity: cloudOpacity
          }}
        >
          <div className="w-full flex flex-col items-center">
            {cloudGroups.map((group, index) => {
              // Pick cycles: each group slot gets a unique variant from the 6 available.
              // The variants are ultra-wide (~5:1) vs the old 16:9 clouds.
              // We lock every slot to 16:9 height (56.25vw) using aspect-video + object-cover
              // so the layout geometry is identical to what the old cloud_up/down produced.
              const pick = (offset: number) =>
                `/images/cloud_variant_${((index * 2 + offset) % 6) + 1}.webp`;

              // Shared wrapper: locks rendered height to 56.25vw (= original 1920×1080 at 100vw)
              // We use flex centering and allow the wide images to overflow the screen horizontally
              // This prevents the sharp clipping edges when translated.
              const CloudSlot = ({ src, className = "" }: { src: string; className?: string }) => (
                <div className={`relative w-full h-[56.25vw] flex justify-center items-center ${className}`}>
                  <img src={src} alt="" className="h-full w-auto max-w-none pointer-events-none" loading="lazy" fetchPriority="low" />
                </div>
              );

              return (
                <div
                  key={index}
                  className={`relative w-full ${index > 0 ? group.margin : ""}`}
                >
                  {/* Base layer */}
                  <CloudSlot src={pick(0)} />

                  {/* Overlay layer — flipped horizontally */}
                  <div className="absolute inset-0 w-full h-full opacity-95 scale-x-[-1]">
                    <CloudSlot src={pick(1)} />
                  </div>

                  {/* 3rd layer (groups with count ≥ 3) */}
                  {group.count >= 3 && (
                    <div className="absolute inset-0 w-full h-full opacity-90 translate-x-[5%] -translate-y-[3%]">
                      <CloudSlot src={pick(2)} />
                    </div>
                  )}

                  {/* 4th layer (groups with count === 4) — flipped */}
                  {group.count === 4 && (
                    <div className="absolute inset-0 w-full h-full opacity-85 -translate-x-[5%] translate-y-[3%] scale-x-[-1]">
                      <CloudSlot src={pick(3)} />
                    </div>
                  )}
                </div>
              );
            })}

            <div
              className="w-full h-[100vh] bg-[#0B1D32] -mt-[60vw]"
              style={{ zIndex: -1 }}
            />
          </div>
        </div>

        {/* 3. NAYA & CIRCLES */}
        <div
          className="absolute inset-0 z-40 flex items-center justify-center pt-0 mt-0"
          style={{
            transform: `translateY(${(1 - nayaProgress) * 100}vh) translateY(-${nayaStuckOffset * 4.5}px) scale(${(1 + globalProgress * 0.1) * 0.85})`,
            opacity: nayaOpacity
          }}
        >
          <Image
            src="/vectors/mainpagebackgroundcirclescopy.webp"
            alt=""
            width={1865}
            height={562}
            className="absolute w-[120%] max-w-none h-auto"
            style={{
              opacity: 0.6 + (nayaProgress * 0.4)
            }}
          />
          <Image
            src="/images/nayaherself.webp"
            alt="Naya"
            width={1200}
            height={1697}
            className="relative w-[55%] max-w-[800px] h-auto z-10 drop-shadow-[0_45px_45px_rgba(0,0,0,0.8)]"
            style={{
              transform: `translateY(${globalProgress * -150}px)`,
            }}
          />
        </div>

      </div>
      {/* 5. PADDING SPACER - Prevents overlap with portfolio content */}

    </div>
  );
}
