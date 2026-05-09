"use client";

import { useEffect } from "react";
import { getAllPortfolioGroups } from "../app/actions/portfolio";

/**
 * PortfolioPrefetcher
 * 
 * Silently fetches all portfolio data and prefetches images 
 * ONLY after the main page has fully loaded. This ensures 
 * that the initial experience is lightning fast, while 
 * subsequent navigations feel instantaneous.
 */
export default function PortfolioPrefetcher() {
  useEffect(() => {
    // 1. Only run once per browser session to prevent redundant work 
    // on every page navigation (improves "heavy" navigation feel).
    if (typeof window !== "undefined" && (window as any)._portfolioPrefetched) {
      return;
    }

    let isCancelled = false;

    const prefetch = async () => {
      // 2. Wait for window load event if not already loaded
      if (document.readyState !== "complete") {
        await new Promise((resolve) => window.addEventListener("load", resolve, { once: true }));
      }

      if (isCancelled) return;

      // 3. Wait an extra 4 seconds (instead of 2) to ensure all main page 
      // animations and critical tasks are truly finished.
      await new Promise((resolve) => setTimeout(resolve, 4000));

      if (isCancelled) return;

      try {
        // 4. Fetch all portfolio groups (metadata)
        const groups = await getAllPortfolioGroups();
        if (isCancelled) return;

        // Mark as prefetched so it doesn't run again on next navigation
        (window as any)._portfolioPrefetched = true;

        // 5. Collect all image URLs (Cover images + Gallery images)
        const urls = new Set<string>();
        groups.forEach((group: any) => {
          if (group.coverImage) urls.add(group.coverImage);
          if (Array.isArray(group.images)) {
            group.images.forEach((img: string) => urls.add(img));
          }
        });

        const urlList = Array.from(urls);

        // 6. Prefetch assets in smaller chunks to avoid network saturation
        // Slower chunking = smoother main thread during navigation
        const chunkSize = 2; // Reduced from 4
        const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov'];
        
        for (let i = 0; i < urlList.length; i += chunkSize) {
          if (isCancelled) break;
          
          const chunk = urlList.slice(i, i + chunkSize);
          await Promise.all(
            chunk.map((url) => {
              return new Promise((resolve) => {
                const isVideo = videoExtensions.some(ext => url.toLowerCase().endsWith(ext));
                if (isVideo) {
                  const vid = document.createElement('video');
                  vid.onloadedmetadata = resolve;
                  vid.onerror = resolve;
                  vid.src = url;
                  vid.preload = 'auto';
                } else {
                  const img = new Image();
                  img.onload = resolve;
                  img.onerror = resolve;
                  img.src = url;
                }
              });
            })
          );
          
          // Longer breath between chunks (500ms instead of 200ms)
          await new Promise((resolve) => setTimeout(resolve, 500));
        }

        console.log(`[Prefetcher] Successfully cached ${urlList.length} portfolio assets.`);
      } catch (error) {
        console.warn("[Prefetcher] Silent prefetch failed:", error);
      }
    };

    prefetch();

    return () => {
      isCancelled = true;
    };
  }, []);

  return null;
}
