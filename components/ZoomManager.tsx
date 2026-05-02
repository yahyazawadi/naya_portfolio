"use client";

import { useEffect } from "react";

export default function ZoomManager() {
  useEffect(() => {
    function applyZoom() {
      const html = document.documentElement;
      const body = document.body;
      
      if (!body) return;

      const width = window.innerWidth;
      const isMobile = width <= 1024;
      const scale = isMobile ? 0.85 : 0.75;
      const scalePercent = isMobile ? "85%" : "75%";
      const fallbackWidth = isMobile ? "117.647%" : "133.333%"; // 1/0.85 and 1/0.75

      // Check if 'zoom' is supported (Chrome, Safari, Edge)
      if (body.style.zoom !== undefined) {
        body.style.zoom = scalePercent;
        body.style.width = "auto";
        body.style.transform = "none";
      } else {
        // Fallback for Firefox
        body.style.transform = `scale(${scale})`;
        body.style.transformOrigin = "top left";
        body.style.width = fallbackWidth;
      }
      
      html.style.overflowX = "hidden";
      body.style.overflowX = "hidden";
    }

    // Apply immediately
    applyZoom();

    // Use a small timeout to ensure it sticks after hydration
    const timeoutId = setTimeout(applyZoom, 100);

    // Re-apply on resize
    window.addEventListener("resize", applyZoom);
    
    return () => {
      window.removeEventListener("resize", applyZoom);
      clearTimeout(timeoutId);
    };
  }, []);

  return null;
}
