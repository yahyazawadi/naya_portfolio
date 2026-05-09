"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";

const layers = [
  { src: "/images/city.webp", speed: -0.1, z: 20 },
];

// Increased glare scale and opacity for a bloomy white/sunshine look
const glareLayers = [
  { left: '10%', top: '5%', scale: 1.5, opacity: 0.8 },
  { left: '60%', top: '15%', scale: 1.2, opacity: 0.7 },
  { left: '25%', top: '30%', scale: 1.8, opacity: 0.8 },
  { left: '75%', top: '45%', scale: 1.4, opacity: 0.7 },
  { left: '-5%', top: '65%', scale: 1.6, opacity: 0.8 },
  { left: '55%', top: '80%', scale: 2.0, opacity: 0.7 },
  { left: '85%', top: '110%', scale: 1.3, opacity: 0.6 },
  { left: '15%', top: '130%', scale: 1.7, opacity: 0.8 },
  { left: '45%', top: '150%', scale: 1.5, opacity: 0.7 },
];

export default function MobileHeroParallax() {
  const [isMobile, setIsMobile] = useState(true);
  const [smoothScroll, setSmoothScroll] = useState(0);
  const [winHeight, setWinHeight] = useState(1000);

  const scrollYRef = useRef(0);
  const [currentStep, setCurrentStep] = useState(0);
  const stepRef = useRef(0);
  const STEPS = [0, 350, 1480]; // Defined keyframes for the reveal
  const isAnimatingRef = useRef(false);
  const requestRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
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

    // Mobile specific: handle touch events for swipe-based scroll hijacking
    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      if (window.scrollY <= 5) {
        touchStartY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      const isAtTop = window.scrollY <= 5;
      if (!isAtTop) return;

      const touchEndY = e.touches[0].clientY;
      const deltaY = touchStartY - touchEndY;

      // Only hijack if it's a significant swipe
      if (Math.abs(deltaY) > 30) {
        if (deltaY > 0 && stepRef.current < STEPS.length - 1) {
          e.preventDefault();
          if (!isAnimatingRef.current) {
            isAnimatingRef.current = true;
            stepRef.current += 1;
            setCurrentStep(stepRef.current);
            scrollYRef.current = STEPS[stepRef.current];
            setTimeout(() => { isAnimatingRef.current = false; }, 600);
          }
        } else if (deltaY < 0 && stepRef.current > 0) {
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

    const handleSkipHero = () => {
      stepRef.current = STEPS.length - 1;
      setCurrentStep(STEPS.length - 1);
      scrollYRef.current = STEPS[STEPS.length - 1];
      setSmoothScroll(1500); // Push past 1400 immediately to unlock scroll
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("skipHero", handleSkipHero);
    
    const animate = () => {
      setSmoothScroll((prev) => {
        const diff = scrollYRef.current - prev;
        const factor = prev < 350 ? 0.012 : 0.03;
        return prev + diff * factor;
      });
      requestRef.current = requestAnimationFrame(animate);
    };
    
    requestRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("skipHero", handleSkipHero);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      // CRITICAL: remove all html-level locks on unmount (page navigation)
      document.documentElement.classList.remove('hero-done-mobile');
      document.documentElement.classList.remove('hero-step-last');
      // Force scroll to re-enable in case CSS injection persisted
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, []);

  // Clean up hero-done class on unmount
  useEffect(() => {
    return () => {
      document.documentElement.classList.remove('hero-done-mobile');
    };
  }, []);

  // Restore scroll once the hero is done (smoothScroll crosses threshold once)
  useEffect(() => {
    if (smoothScroll > 1400 && isMobile) {
      document.documentElement.classList.add('hero-done-mobile');
    } else {
      document.documentElement.classList.remove('hero-done-mobile');
    }
  }, [smoothScroll > 1400, isMobile]);

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

  if (!isMobile) return null;

  const HALF_WHEEL = 100;
  const FULL_ROTATION = 200;

  const totalScrollHeight = winHeight * 1.4;
  const isPastHero = smoothScroll > 1400;

  const globalProgress = Math.min(Math.max(smoothScroll / totalScrollHeight, 0), 1);
  const cloudActiveScroll = Math.max(0, smoothScroll - HALF_WHEEL);
  const cloudOpacity = 0.5 + Math.min(cloudActiveScroll / 300, 0.5);
  const nayaProgress = Math.min(Math.max((smoothScroll - FULL_ROTATION) / 150, 0), 1);
  const nayaOpacity = Math.min(Math.max((smoothScroll - FULL_ROTATION) / 80, 0), 1);

  // Dense cloud wall for mobile — 8 groups with heavy overlap
  const cloudGroups = [
    { count: 4, margin: "-mt-[40vw]" },
    { count: 4, margin: "-mt-[70vw]" },
    { count: 4, margin: "-mt-[70vw]" },
    { count: 4, margin: "-mt-[70vw]" },
    { count: 4, margin: "-mt-[70vw]" },
    { count: 4, margin: "-mt-[70vw]" },
    { count: 4, margin: "-mt-[70vw]" },
    { count: 4, margin: "-mt-[70vw]" },
  ];

  const nayaStuckThreshold = 450;
  const nayaStuckOffset = Math.max(0, smoothScroll - nayaStuckThreshold);

  const overlayFade = smoothScroll > 900
    ? Math.max(0, 1 - (smoothScroll - 900) / 500)
    : 1;

  return (
    <div className="relative w-full h-0" style={{ background: 'linear-gradient(to bottom, #4c6279 0%, #0B1D32 100%)' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 1023px) {
          html:not(.hero-done-mobile) { overflow: hidden !important; }
          html:not(.hero-done-mobile) body { overflow: hidden !important; }
          html.hero-done-mobile { overflow: auto !important; }
        }
      `}} />

      <div
        className="fixed inset-0 overflow-hidden pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, #4c6279 0%, #0B1D32 100%)',
          display: isPastHero ? 'none' : 'block',
          opacity: overlayFade,
          zIndex: 9999
        }}
      >
        <div className="absolute inset-0 w-full h-full z-10" style={{ opacity: 1 - nayaProgress }}>
          {glareLayers.map((glare, i) => (
            <div
              key={`glare-${i}`}
              className="absolute pointer-events-none mix-blend-screen"
              style={{
                left: glare.left,
                top: glare.top,
                zIndex: 25,
                width: '120vw', // Larger glares for mobile
                transform: `translateY(${globalProgress * -8000}px) scale(${glare.scale})`,
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
            </div>
          ))}

          {layers.map((layer) => (
            <div
              key={layer.src}
              className="absolute top-[10vh] left-[-25%] w-[150%] md:left-[-15%] md:w-[130%]"
              style={{
                zIndex: layer.z,
                transform: `translateY(${globalProgress * layer.speed * 400}px) scale(${1 + globalProgress * 0.15})`,
              }}
            >
              <img src={layer.src} alt="" className="w-full h-auto block object-cover object-top" fetchPriority="high" loading="eager" />
            </div>
          ))}
        </div>

        <div
          className="absolute top-[50vh] left-0 w-full z-30 flex flex-col items-center"
          style={{
            transform: `translateY(-${cloudActiveScroll * 4.5}px) scale(1)`,
            opacity: cloudOpacity
          }}
        >
          <div className="w-full flex flex-col items-center">
            {cloudGroups.map((group, index) => {
              const pick = (offset: number) =>
                `/images/cloud_variant_${((index * 2 + offset) % 6) + 1}.webp`;

              const CloudSlot = ({ src, className = "" }: { src: string; className?: string }) => (
                <div className={`relative w-full h-[120vw] flex justify-center items-center ${className}`}>
                  <img src={src} alt="" className="h-full w-auto max-w-none pointer-events-none" loading="lazy" fetchPriority="low" />
                </div>
              );

              return (
                <div
                  key={index}
                  className={`relative w-full ${index > 0 ? group.margin : ""}`}
                >
                  <CloudSlot src={pick(0)} />
                  <div className="absolute inset-0 w-full h-full opacity-95 scale-x-[-1]">
                    <CloudSlot src={pick(1)} />
                  </div>
                  {group.count >= 3 && (
                    <div className="absolute inset-0 w-full h-full opacity-90 translate-x-[5%] -translate-y-[3%]">
                      <CloudSlot src={pick(2)} />
                    </div>
                  )}
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

        <div
          className="absolute inset-0 z-40 flex items-center justify-center pt-0 -mt-[10vh]"
          style={{
            transform: `translateY(${(1 - nayaProgress) * 100}vh) translateY(-${nayaStuckOffset * 4.5}px) scale(${1 + globalProgress * 0.1})`,
            opacity: nayaOpacity
          }}
        >
          <Image
            src="/vectors/mainpagebackgroundcirclescopy.webp"
            alt=""
            width={1865}
            height={562}
            className="absolute w-[180%] max-w-none h-auto"
            style={{
              opacity: 0.6 + (nayaProgress * 0.4)
            }}
          />
          <Image
            src="/images/nayaherself.webp"
            alt="Naya"
            width={1200}
            height={1697}
            className="relative w-[85%] max-w-[500px] h-auto z-10 drop-shadow-[0_45px_45px_rgba(0,0,0,0.8)]"
            style={{
              transform: `translateY(${globalProgress * -150}px)`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
