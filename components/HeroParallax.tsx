"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const layers = [
  // Reduced speeds for a much longer scroll duration
  { src: "/images/city1.webp", speed: -0.02, z: 20 },
  { src: "/images/city2.webp", speed: -0.05, z: 21 },
  { src: "/images/city3.webp", speed: -0.08, z: 22 },
  { src: "/images/city4.webp", speed: -0.12, z: 23 },
  // Glare/particles still move fast but tuned for the longer scroll
  { src: "/images/cityglare5.webp", speed: -0.8, z: 24 },
];

export default function HeroParallax() {
  const [scrollY, setScrollY] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth > 1024);
    handleResize();
    window.addEventListener("resize", handleResize);

    const handleScroll = () => {
      requestAnimationFrame(() => {
        setScrollY(window.scrollY);
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (!isDesktop) return null;

  return (
    // Massive wrapper creates the "Deep Scroll" distance (500vh)
    <div className="relative w-full h-[500vh] bg-[#0B1D32]">

      {/* Sticky container stays pinned to the top while we scroll through the 500vh */}
      <div className="sticky top-0 w-full bg-[#0B1D32] overflow-hidden">

        {/* 
            SECTION 1 — City skyline (Parallax Stack)
        */}
        <div className="relative w-full overflow-hidden z-0">
          <div className="relative w-full">
            {/* Base Layer: Defines the height of the container */}
            <img
              src="/images/city1.webp"
              alt=""
              className="w-full h-auto block object-cover"
              style={{ transform: `translateY(${scrollY * -0.02}px)` }}
            />

            {/* Additional Parallax Layers */}
            {layers.slice(1).map((layer) => (
              <img
                key={layer.src}
                src={layer.src}
                alt=""
                className="absolute top-0 left-0 w-full h-auto block object-cover"
                style={{
                  zIndex: layer.z,
                  transform: `translateY(${scrollY * layer.speed}px)`,
                }}
              />
            ))}
          </div>
        </div>

        {/* 
            SECTION 2 — Clouds & Character 
        */}
        <div className="relative w-full -mt-[35vw] z-60">

          {/* Clouds fly up as a slow-motion "curtain" reveal */}
          <div
            className="relative z-10"
            style={{ transform: `translateY(${-scrollY * 0.4}px)` }}
          >
            <Image
              src="/images/cloud_up.webp"
              alt=""
              width={1920}
              height={1080}
              priority
              className="relative w-full h-auto block"
            />
            <Image
              src="/images/cloud_down.webp"
              alt=""
              width={1920}
              height={1080}
              priority
              className="relative w-full h-auto block -mt-[12vw]"
            />
          </div>

          {/* Character + Vectors overlay (Pinned perfectly in the sticky container) */}
          <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none pt-[10vw] overflow-hidden">
            <Image
              src="/vectors/mainpagebackgroundcirclescopy.png"
              alt=""
              width={1865}
              height={562}
              priority
              className="absolute w-[140%] max-w-none h-auto opacity-90"
            />
            <Image
              src="/images/nayaherself.webp"
              alt="Naya"
              width={1200}
              height={1697}
              priority
              className="relative w-[60%] max-w-[850px] h-auto z-10 drop-shadow-2xl"
            />
          </div>
        </div>

      </div>
    </div>
  );
}

