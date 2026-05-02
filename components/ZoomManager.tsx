"use client";

import { useEffect } from "react";

export default function ZoomManager() {
  useEffect(() => {
    function applyZoom() {
      const html = document.documentElement;
      const body = document.body;
      
      // Ensure we target the body correctly
      if (!body) return;

      // Force 75% zoom
      // Check if 'zoom' is supported (Chrome, Safari, Edge)
      if (body.style.zoom !== undefined) {
        body.style.zoom = "75%";
        body.style.width = "auto";
        body.style.transform = "none";
      } else {
        // Fallback for Firefox
        body.style.transform = "scale(0.75)";
        body.style.transformOrigin = "top left";
        body.style.width = "133.333%";
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
