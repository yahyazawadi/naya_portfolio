"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";

const layers = [
  { src: "/images/city1.webp", speed: -0.05, z: 20 },
  { src: "/images/city2.webp", speed: -0.15, z: 21 },
  { src: "/images/city3.webp", speed: -0.25, z: 22 },
  { src: "/images/city4.webp", speed: -0.4, z: 23 },
];

// Doubled glare instances for high-density bokeh sky
const glareLayers = [
  { left: '5%', top: '2%', scale: 0.9, opacity: 0.5 },
  { left: '35%', top: '12%', scale: 0.9, opacity: 0.3 },
  { left: '65%', top: '8%', scale: 0.5, opacity: 0.6 },
  { left: '80%', top: '22%', scale: 0.2, opacity: 0.4 },
  // { left: '15%', top: '18%', scale: 1.2, opacity: 0.4 },
  // { left: '45%', top: '5%', scale: 1.5, opacity: 0.5 },
  // { left: '25%', top: '25%', scale: 1.0, opacity: 0.3 },
  // { left: '90%', top: '10%', scale: 1.3, opacity: 0.4 },
  // Lower flare layers (closer to buildings)
  { left: '20%', top: '45%', scale: 1.1, opacity: 0.3 },
  { left: '50%', top: '60%', scale: 1.4, opacity: 0.4 },
  { left: '75%', top: '40%', scale: 0.9, opacity: 0.5 },
  { left: '10%', top: '55%', scale: 0.3, opacity: 0.3 },
  // Bottom flare layers for high-density fly-through
  { left: '-10%', top: '110%', scale: 0.9, opacity: 0.4 },
  { left: '-10%', top: '125%', scale: 0.9, opacity: 0.5 },
  { left: '-20%', top: '100%', scale: 0.7, opacity: 0.3 },
  { left: '40%', top: '140%', scale: 0.8, opacity: 0.5 },
  { left: '60%', top: '115%', scale: 0.9, opacity: 0.4 },
];

export default function HeroParallax() {
  const [isDesktop, setIsDesktop] = useState(false);
  const [smoothScroll, setSmoothScroll] = useState(0);
  const [winHeight, setWinHeight] = useState(1000);

  const scrollYRef = useRef(0);
  const requestRef = useRef<number>();

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 1024);
      setWinHeight(window.innerHeight);
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    const handleScroll = () => {
      scrollYRef.current = window.scrollY;
    };

    const animate = () => {
      setSmoothScroll((prev) => {
        const diff = scrollYRef.current - prev;
        return prev + diff * 0.08;
      });
      requestRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    requestRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  if (!isDesktop) return null;

  // FINAL SYNCED TRIGGERS: Coordinated for a fast, punchy 4-layer reveal
  const HALF_WHEEL = 250; // Delay cloud start slightly to wait for scroll momentum
  const FULL_ROTATION = 400; // Start Naya reveal sooner

  const totalScrollHeight = winHeight * 1.9;
  const isPastHero = smoothScroll > totalScrollHeight + 250;

  const globalProgress = Math.min(Math.max(smoothScroll / totalScrollHeight, 0), 1);
  const cloudActiveScroll = Math.max(0, smoothScroll - HALF_WHEEL);
  const cloudOpacity = 0.5 + Math.min(cloudActiveScroll / 300, 0.5);
  const nayaProgress = Math.min(Math.max((smoothScroll - FULL_ROTATION) / 250, 0), 1);

  // Dense cloud reveal: 4 high-density layers
  const cloudGroups = [
    { count: 3, margin: "-mt-[25vw]" },
    { count: 4, margin: "-mt-[35vw]" },
    { count: 4, margin: "-mt-[40vw]" },
    { count: 4, margin: "-mt-[45vw]" },
  ];

  // Naya's "Stuck" logic: once she is revealed, she hooks onto the clouds and moves up
  const nayaStuckThreshold = 650; // Stuck point moved up to match faster cloud arrival
  const nayaStuckOffset = Math.max(0, smoothScroll - nayaStuckThreshold);

  return (
    <div className="relative w-full h-[245vh] bg-[#0B1D32]">

      <div
        className="fixed inset-0 bg-[#0B1D32] overflow-hidden pointer-events-none"
        style={{
          display: isPastHero ? 'none' : 'block',
          zIndex: 0
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
              <img src={layer.src} alt="" className="w-full h-full object-cover object-top" />
            </div>
          ))}
        </div>

        {/* 2. PROGRESSIVE HYBRID CLOUD PILLAR */}
        <div
          className="absolute top-[65%] left-0 w-full z-30 flex flex-col items-center"
          style={{
            // velocity remains 4.5px for the cinematic feel
            transform: `translateY(-${cloudActiveScroll * 4.5}px) scale(1)`,
            opacity: cloudOpacity
          }}
        >
          <div className="w-full flex flex-col items-center">
            {cloudGroups.map((group, index) => (
              <div
                key={index}
                className={`relative w-full ${index > 0 ? group.margin : ""}`}
              >
                <Image src="/images/cloud_up.webp" alt="" width={1920} height={1080} priority className="w-full h-auto" />
                <div className="absolute inset-0 w-full h-auto opacity-95">
                  <Image src="/images/cloud_down.webp" alt="" width={1920} height={1080} priority className="w-full h-auto scale-x-[-1]" />
                </div>
                {group.count >= 3 && (
                  <div className="absolute inset-0 w-full h-auto opacity-90 translate-x-[5%] -translate-y-[3%]">
                    <Image src="/images/cloud_up.webp" alt="" width={1920} height={1080} priority className="w-full h-auto" />
                  </div>
                )}
                {group.count === 4 && (
                  <div className="absolute inset-0 w-full h-auto opacity-85 -translate-x-[5%] translate-y-[3%] scale-x-[-1]">
                    <Image src="/images/cloud_down.webp" alt="" width={1920} height={1080} priority className="w-full h-auto" />
                  </div>
                )}
              </div>
            ))}

            <div
              className="w-full h-[100vh] bg-[#0B1D32] -mt-[60vw]"
              style={{ zIndex: -1 }}
            />
          </div>
        </div>

        {/* 3. NAYA & CIRCLES */}
        <div
          className="absolute inset-0 z-40 flex items-center justify-center pt-[10vw]"
          style={{
            transform: `translateY(${(1 - nayaProgress) * 100}vh) translateY(-${nayaStuckOffset * 4.5}px) scale(${1 + globalProgress * 0.1})`,
            opacity: nayaProgress
          }}
        >
          <Image
            src="/vectors/mainpagebackgroundcirclescopy.png"
            alt=""
            width={1865}
            height={562}
            priority
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
            priority
            className="relative w-[55%] max-w-[800px] h-auto z-10 drop-shadow-[0_45px_45px_rgba(0,0,0,0.8)]"
            style={{
              transform: `translateY(${globalProgress * -150}px)`,
            }}
          />
        </div>

      </div>
      {/* 5. PADDING SPACER - Prevents overlap with portfolio content */}
      <div className="h-[60vh] w-full pointer-events-none" />
    </div>
  );
}
