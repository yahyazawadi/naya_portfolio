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
        return prev + diff * 0.07;
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

  const totalScroll = winHeight * 7.5; 
  const isPastHero = smoothScroll > totalScroll + (winHeight * 0.5);
  const scrollProgress = Math.min(Math.max(smoothScroll / totalScroll, 0), 1);
  
  // Reveal happens between 35% and 75% of the scroll
  const revealProgress = Math.min(Math.max((scrollProgress - 0.35) / 0.4, 0), 1);

  return (
    <div className="relative w-full h-[800vh] bg-[#0B1D32]">
      
      {/* 
          Using FIXED positioning instead of sticky. 
          This is immune to Body Zoom / Overflow issues.
      */}
      <div 
        className="fixed top-0 left-0 w-full h-full bg-[#0B1D32] overflow-hidden pointer-events-none"
        style={{ 
          display: isPastHero ? 'none' : 'block',
          zIndex: 0
        }}
      >
        
        {/* SECTION 1: City Skyline */}
        <div className="absolute inset-0 w-full h-full">
          {layers.map((layer) => (
            <div
              key={layer.src}
              className="absolute inset-0 w-full h-full"
              style={{
                zIndex: layer.z,
                transform: `translateY(${scrollProgress * layer.speed * 400}px) scale(${1 + scrollProgress * 0.06})`,
              }}
            >
              <img
                src={layer.src}
                alt=""
                className="w-full h-full object-cover object-bottom"
              />
            </div>
          ))}
        </div>

        {/* SECTION 2: Reveal Section (150vh offset to guarantee it's off-screen despite zoom) */}
        <div 
          className="absolute inset-0 z-50 flex flex-col items-center justify-center"
          style={{ 
            // 150vh creates a buffer for the 75% body zoom
            transform: `translateY(${(1 - revealProgress) * 150}vh)`,
            opacity: revealProgress > 0 ? 1 : 0
          }}
        >
          {/* Cloud Curtain */}
          <div className="relative w-full">
            <Image
              src="/images/cloud_up.webp"
              alt=""
              width={1920}
              height={1080}
              priority
              className="w-full h-auto"
            />
            <Image
              src="/images/cloud_down.webp"
              alt=""
              width={1920}
              height={1080}
              priority
              className="w-full h-auto -mt-[15vw]"
            />
          </div>

          {/* Character & Vectors (No rotation as requested) */}
          <div className="absolute inset-0 flex items-center justify-center pt-[5vw]">
             <Image
              src="/vectors/mainpagebackgroundcirclescopy.png"
              alt=""
              width={1865}
              height={562}
              priority
              className="absolute w-[120%] max-w-none h-auto opacity-30"
              style={{
                transform: `scale(${1 + scrollProgress * 0.1})`,
              }}
            />
            <Image
              src="/images/nayaherself.webp"
              alt="Naya"
              width={1200}
              height={1697}
              priority
              className="relative w-[55%] max-w-[800px] h-auto z-10 drop-shadow-[0_45px_45px_rgba(0,0,0,0.7)]"
              style={{
                transform: `translateY(${scrollProgress * -100}px) scale(${1 + scrollProgress * 0.1})`,
              }}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
