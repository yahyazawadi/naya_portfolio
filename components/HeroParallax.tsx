"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";

const layers = [
  { src: "/images/city1.webp", speed: -0.05, z: 20 },
  { src: "/images/city2.webp", speed: -0.15, z: 21 },
  { src: "/images/city3.webp", speed: -0.25, z: 22 },
  { src: "/images/city4.webp", speed: -0.4, z: 23 },
];

// Configuration for sky lens flares/glares
const glareLayers = [
  { left: '5%', top: '2%', scale: 1.4, opacity: 0.5 },
  { left: '35%', top: '12%', scale: 0.9, opacity: 0.3 },
  { left: '65%', top: '8%', scale: 1.8, opacity: 0.6 },
  { left: '80%', top: '22%', scale: 1.1, opacity: 0.4 },
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

  // Naya's "Stuck" logic: once she is revealed, she hooks onto the clouds and moves up
  const nayaStuckThreshold = 800; 
  const nayaStuckOffset = Math.max(0, smoothScroll - nayaStuckThreshold);

  return (
    <div className="relative w-full h-[800vh] bg-[#0B1D32]">
      
      <div 
        className="fixed inset-0 bg-[#0B1D32] overflow-hidden pointer-events-none"
        style={{ 
          display: isPastHero ? 'none' : 'block',
          zIndex: 0
        }}
      >
        
        {/* 1. CITY SKYLINE & LENS FLARES */}
        <div className="absolute inset-0 w-full h-full z-10" style={{ opacity: 1 - nayaProgress }}>
          
          {/* HIGH-SPEED CITY GLARES (Lens Flares) - Now in front of buildings (z-25) */}
          {glareLayers.map((glare, i) => (
            <div
              key={`glare-${i}`}
              className="absolute pointer-events-none mix-blend-screen"
              style={{
                left: glare.left,
                top: glare.top,
                zIndex: 25, // In front of city, behind clouds
                width: '65vw',
                // Ultra velocity: zip down at extreme speed
                transform: `translateY(${globalProgress * -5000}px) scale(${glare.scale})`,
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
              {/* Layered Duplicate: Shifted Left & Down */}
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
            
            {/* 3. TRANSITION BOX - Solid color behind the lowest clouds */}
            <div 
              className="w-full h-[800vh] bg-[#051c30] -mt-[60vw]" 
              style={{ zIndex: -1 }} // Blends behind the cloud stacks
            />
          </div>
        </div>

        {/* 4. NAYA & CIRCLES */}
        <div 
          className="absolute inset-0 z-40 flex items-center justify-center pt-[10vw]"
          style={{ 
            // Rise from bottom + Hook onto clouds (stuckOffset * 4.5)
            // Using two separate translateY calls to avoid calc() unit issues
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
              opacity: 0.3 + (nayaProgress * 0.7) // Ramps from 0.3 to 1.0 at the end
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
    </div>
  );
}
