"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";

const layers = [
  { src: "/images/city1.webp", speed: -0.05, z: 20 },
  { src: "/images/city2.webp", speed: -0.15, z: 21 },
  { src: "/images/city3.webp", speed: -0.25, z: 22 },
  { src: "/images/city4.webp", speed: -0.4, z: 23 },
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

  // Physical Wheel Triggers
  const HALF_WHEEL = 100; 
  const FULL_ROTATION = 300; 

  const totalScrollHeight = winHeight * 8; 
  const isPastHero = smoothScroll > totalScrollHeight + 500;
  
  const globalProgress = Math.min(Math.max(smoothScroll / totalScrollHeight, 0), 1);
  const cloudActiveScroll = Math.max(0, smoothScroll - HALF_WHEEL);
  const cloudOpacity = Math.min(cloudActiveScroll / 300, 1);
  const nayaProgress = Math.min(Math.max((smoothScroll - FULL_ROTATION) / 600, 0), 1);

  // Progressive density: Start thin (excellent start) and end extremely thick
  const cloudGroups = [
    { count: 2, margin: "-mt-[30vw]" }, // Start
    { count: 2, margin: "-mt-[35vw]" },
    { count: 3, margin: "-mt-[40vw]" },
    { count: 3, margin: "-mt-[45vw]" },
    { count: 4, margin: "-mt-[50vw]" },
    { count: 4, margin: "-mt-[55vw]" },
    { count: 4, margin: "-mt-[60vw]" }, // End
  ];

  return (
    <div className="relative w-full h-[800vh] bg-[#0B1D32]">
      
      <div 
        className="fixed inset-0 bg-[#0B1D32] overflow-hidden pointer-events-none"
        style={{ 
          display: isPastHero ? 'none' : 'block',
          zIndex: 0
        }}
      >
        
        {/* 1. CITY SKYLINE */}
        <div className="absolute inset-0 w-full h-full z-10">
          {layers.map((layer) => (
            <div
              key={layer.src}
              className="absolute inset-0 w-full h-full"
              style={{
                zIndex: layer.z,
                transform: `translateY(${globalProgress * layer.speed * 400}px) scale(${1 + globalProgress * 0.15})`,
              }}
            >
              <img
                src={layer.src}
                alt=""
                className="w-full h-full object-cover object-top"
              />
            </div>
          ))}
        </div>

        {/* 2. PROGRESSIVE HYBRID CLOUD PILLAR */}
        <div 
          className="absolute top-full left-0 w-full z-30 flex flex-col items-center"
          style={{ 
            // velocity adjusted to 4.5px for the progressive density pillar
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
                {/* Layer 1: Base (Up) */}
                <Image src="/images/cloud_up.webp" alt="" width={1920} height={1080} priority className="w-full h-auto" />
                
                {/* Layer 2: Hybrid Filler (Down Flipped) */}
                <div className="absolute inset-0 w-full h-auto opacity-95">
                  <Image src="/images/cloud_down.webp" alt="" width={1920} height={1080} priority className="w-full h-auto scale-x-[-1]" />
                </div>
                
                {/* Layer 3: Extra Up Jitter */}
                {group.count >= 3 && (
                  <div className="absolute inset-0 w-full h-auto opacity-90 translate-x-[5%] -translate-y-[3%]">
                    <Image src="/images/cloud_up.webp" alt="" width={1920} height={1080} priority className="w-full h-auto" />
                  </div>
                )}

                {/* Layer 4: Extra Down Jitter */}
                {group.count === 4 && (
                  <div className="absolute inset-0 w-full h-auto opacity-85 -translate-x-[5%] translate-y-[3%] scale-x-[-1]">
                    <Image src="/images/cloud_down.webp" alt="" width={1920} height={1080} priority className="w-full h-auto" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 3. NAYA & CIRCLES */}
        <div 
          className="absolute inset-0 z-40 flex items-center justify-center pt-[10vw]"
          style={{ 
            transform: `translateY(${(1 - nayaProgress) * 100}vh) scale(${1 + globalProgress * 0.1})`,
            opacity: nayaProgress
          }}
        >
           <Image
            src="/vectors/mainpagebackgroundcirclescopy.png"
            alt=""
            width={1865}
            height={562}
            priority
            className="absolute w-[120%] max-w-none h-auto opacity-30"
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
    </div>
  );
}
