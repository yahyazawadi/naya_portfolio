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
    let isCancelled = false;

    const prefetch = async () => {
      // 1. Wait for window load event if not already loaded
      if (document.readyState !== "complete") {
        await new Promise((resolve) => window.addEventListener("load", resolve, { once: true }));
      }

      if (isCancelled) return;

      // 2. Wait an extra 2 seconds to ensure all main page animations and 
      // critical tasks are finished before we start background fetching.
      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (isCancelled) return;

      try {
        // 3. Fetch all portfolio groups (metadata)
        const groups = await getAllPortfolioGroups();
        if (isCancelled) return;

        // 4. Collect all image URLs (Cover images + Gallery images)
        const urls = new Set<string>();
        groups.forEach((group: any) => {
          if (group.coverImage) urls.add(group.coverImage);
          if (Array.isArray(group.images)) {
            group.images.forEach((img: string) => urls.add(img));
          }
        });

        const urlList = Array.from(urls);

        // 5. Prefetch images in small chunks to avoid network congestion
        const chunkSize = 4;
        for (let i = 0; i < urlList.length; i += chunkSize) {
          if (isCancelled) break;
          
          const chunk = urlList.slice(i, i + chunkSize);
          await Promise.all(
            chunk.map((url) => {
              return new Promise((resolve) => {
                const img = new Image();
                img.onload = resolve;
                img.onerror = resolve; // Move on even if one fails
                img.src = url;
              });
            })
          );
          
          // Tiny breath between chunks
          await new Promise((resolve) => setTimeout(resolve, 200));
        }

        console.log(`[Prefetcher] Successfully cached ${urlList.length} portfolio assets.`);
      } catch (error) {
        // Silently fail as this is a non-critical background task
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
