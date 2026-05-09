'use client';

import { useState, useEffect, useRef } from 'react';
import Image, { ImageProps } from 'next/image';
import { RefreshCw, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface SmartImageProps extends Omit<ImageProps, 'src'> {
  src: string;
  onConverted?: (newUrl: string) => void;
}

export default function SmartImage({ src, alt, className, onConverted, ...props }: SmartImageProps) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [currentSrc, setCurrentSrc] = useState(src);

  const isWebP = typeof currentSrc === 'string' && currentSrc.toLowerCase().endsWith('.webp');
  const isDataUrl = typeof currentSrc === 'string' && currentSrc.startsWith('data:');
  // Show to admin only for non-webp images
  const shouldShowIcon = isAdmin && !isWebP && !isDataUrl && !currentSrc.includes('blob:');

  useEffect(() => {
    const checkAdmin = () => {
      const isAdminCookie = document.cookie.split(';').some(c => c.trim().startsWith('admin_session=authenticated'));
      setIsAdmin(isAdminCookie);
    };
    checkAdmin();
  }, []);

  useEffect(() => {
    setCurrentSrc(src);
  }, [src]);

  const handleConvert = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isConverting) return;

    // Confirm if already WebP
    if (isWebP && !confirm("This image is already WebP. Do you want to re-process and replace it?")) {
      return;
    }

    setIsConverting(true);
    setStatus('idle');

    try {
      // 1. Fetch current asset
      const response = await fetch(currentSrc);
      const blob = await response.blob();

      // 2. Convert to WebP in browser
      const img = new (window as any).Image();
      const objectUrl = URL.createObjectURL(blob);
      
      const webpBlob = await new Promise<Blob>((resolve, reject) => {
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }
          ctx.drawImage(img, 0, 0);
          canvas.toBlob((b) => {
            if (b) resolve(b);
            else reject(new Error('Canvas toBlob failed'));
          }, 'image/webp', 0.9);
          URL.revokeObjectURL(objectUrl);
        };
        img.onerror = () => reject(new Error('Failed to load image for conversion'));
        img.crossOrigin = "anonymous"; // Ensure CORS if possible
        img.src = objectUrl;
      });

      // 3. Upload new WebP
      const formData = new FormData();
      const fileName = currentSrc.split('/').pop()?.split('?')[0] || 'image';
      const baseName = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
      formData.append('file', new File([webpBlob], `${baseName}.webp`, { type: 'image/webp' }));

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadRes.ok) throw new Error('Upload failed');
      const { url: newUrl } = (await uploadRes.json()) as { url: string };

      // 4. Update Database (and delete old asset via API)
      const updateRes = await fetch('/api/image/replace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          oldUrl: currentSrc,
          newUrl: newUrl,
        }),
      });

      if (!updateRes.ok) throw new Error('Database update failed');

      setStatus('success');
      setCurrentSrc(newUrl);
      if (onConverted) onConverted(newUrl);

      setTimeout(() => setStatus('idle'), 3000);
    } catch (err) {
      console.error('Conversion failed:', err);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className={`relative group/smart-image overflow-hidden ${className}`}>
      <img 
        {...(props as any)}
        src={currentSrc}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-700 group-hover/smart-image:scale-105"
      />
      
      {shouldShowIcon && (
        <div className="absolute top-2 right-2 flex items-center gap-2 z-50">
          {/* Label that slides out on hover */}
          <span className="bg-black/80 text-[10px] text-white font-bold px-2 py-1.5 rounded-lg backdrop-blur-md opacity-0 group-hover/smart-image:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            {isWebP ? 'RE-OPTIMIZE' : 'CONVERT TO WEBP'}
          </span>
          
          <button
            type="button"
            onClick={handleConvert}
            disabled={isConverting}
            className={`
              p-2.5 rounded-xl backdrop-blur-xl shadow-2xl
              transition-all duration-300 transform
              ${isConverting ? 'bg-blue-500 scale-110 cursor-wait rotate-180' : 'bg-white/10 hover:bg-white/20 border border-white/10 hover:scale-110'}
              ${status === 'success' ? 'bg-green-500 border-green-400' : ''}
              ${status === 'error' ? 'bg-red-500 border-red-400' : ''}
            `}
          >
            {isConverting ? (
              <Loader2 className="w-4 h-4 text-white animate-spin" />
            ) : status === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-white" />
            ) : status === 'error' ? (
              <AlertCircle className="w-4 h-4 text-white" />
            ) : (
              <RefreshCw className={`w-4 h-4 ${isWebP ? 'text-[#48ABBF]' : 'text-white'} group-hover/smart-image:rotate-180 transition-transform duration-700`} />
            )}
          </button>
        </div>
      )}

      {/* Success/Error Overlays */}
      {status === 'success' && (
        <div className="absolute inset-0 bg-green-500/10 backdrop-blur-[2px] flex items-center justify-center pointer-events-none animate-in fade-in duration-300">
          <div className="bg-black/80 text-green-400 border border-green-500/30 px-4 py-2 rounded-2xl text-xs font-bold shadow-2xl flex items-center gap-2">
            <CheckCircle2 size={14} />
            DATABASE UPDATED
          </div>
        </div>
      )}
    </div>
  );
}

