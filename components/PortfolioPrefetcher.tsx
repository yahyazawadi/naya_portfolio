"use client";

import { useEffect } from "react";

/**
 * PortfolioPrefetcher
 * 
 * Silently prefetches critical static assets (images/vectors defined in code)
 * after the main page has loaded. Aggressively caches them to ensure
 * smooth navigation.
 */
export default function PortfolioPrefetcher() {
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any)._staticPrefetched) {
      return;
    }

    let isCancelled = false;

    const prefetch = async () => {
      // 1. Wait for window load
      if (document.readyState !== "complete") {
        await new Promise((resolve) => window.addEventListener("load", resolve, { once: true }));
      }
      if (isCancelled) return;

      // 2. Start prefetching after 2 seconds (Aggressive)
      await new Promise((resolve) => setTimeout(resolve, 2000));
      if (isCancelled) return;

      try {
        (window as any)._staticPrefetched = true;

        // Static assets used throughout the codebase (Hero, UI, Categories)
        const staticAssets = [
          "/images/DigitalArt&Illustration.webp",
          "/images/traditionalarts&crafts.webp",
          "/images/illustrator&photoshop.webp",
          "/images/Animation&MotionGraphics.webp",
          "/images/city.webp",
          "/images/cloud_small_1.webp",
          "/images/cloud_small_2.webp",
          "/images/nayaherself.webp",
          "/vectors/mainpagebackgroundcirclescopy.webp",
          "/vectors/main_left_circles.webp",
          "/vectors/main_right_circles.webp",
          "/vectors/naya_icon.webp",
          "/vectors/page_left_side.webp",
          "/vectors/page_right_side.webp",
          "/vectors/vector1.webp",
          "/vectors/mainpagebackgroundcircles.webp",
          "/images/city1.webp",
          "/images/city2.webp",
          "/images/city3.webp",
          "/images/city4.webp",
          "/images/cityglare5.webp",
          "/images/cloud_variant_1.webp",
          "/images/cloud_variant_2.webp",
          "/images/cloud_variant_3.webp",
          "/images/cloud_variant_4.webp",
          "/images/cloud_variant_5.webp",
          "/images/cloud_variant_6.webp",
        ];

        const urlList = Array.from(new Set(staticAssets));

        // 3. Aggressive prefetching in parallel chunks
        const chunkSize = 4;
        for (let i = 0; i < urlList.length; i += chunkSize) {
          if (isCancelled) break;
          const chunk = urlList.slice(i, i + chunkSize);
          await Promise.all(
            chunk.map((url) => {
              return new Promise((resolve) => {
                const img = new Image();
                img.onload = resolve;
                img.onerror = resolve;
                img.src = url;
              });
            })
          );
          // Very short breath
          await new Promise((resolve) => setTimeout(resolve, 150));
        }

        console.log(`[Prefetcher] Aggressively cached ${urlList.length} static assets.`);
      } catch (error) {
        console.warn("[Prefetcher] Static prefetch failed:", error);
      }
    };

    prefetch();

    return () => {
      isCancelled = true;
    };
  }, []);

  return null;
}
