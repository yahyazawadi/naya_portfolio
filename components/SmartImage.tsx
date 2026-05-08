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

    setIsConverting(true);
    setStatus('idle');

    try {
      const response = await fetch(currentSrc);
      const blob = await response.blob();

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
        img.src = objectUrl;
      });

      const formData = new FormData();
      const fileName = currentSrc.split('/').pop()?.split('?')[0] || 'image';
      const baseName = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
      formData.append('file', new File([webpBlob], `${baseName}.webp`, { type: 'image/webp' }));

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadRes.ok) throw new Error('Upload failed');
      const { url: newUrl } = await uploadRes.json();

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
    <div className={`relative group/smart-image ${className}`}>
      <img 
        {...(props as any)}
        src={currentSrc}
        alt={alt}
        className="w-full h-full object-cover"
      />
      
      {shouldShowIcon && (
        <button
          type="button"
          onClick={handleConvert}
          disabled={isConverting}
          className={`
            absolute top-2 right-2 p-2 rounded-full backdrop-blur-md shadow-lg
            transition-all duration-300 z-50
            ${isConverting ? 'bg-blue-500/80 cursor-wait' : 'bg-black/40 hover:bg-black/60'}
            ${status === 'success' ? 'bg-green-500/80' : ''}
            ${status === 'error' ? 'bg-red-500/80' : ''}
          `}
          title="Convert to WebP"
        >
          {isConverting ? (
            <Loader2 className="w-5 h-5 text-white animate-spin" />
          ) : status === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-white animate-bounce" />
          ) : status === 'error' ? (
            <AlertCircle className="w-5 h-5 text-white" />
          ) : (
            <RefreshCw className="w-5 h-5 text-white group-hover/smart-image:rotate-180 transition-transform duration-500" />
          )}
        </button>
      )}

      {status === 'success' && (
        <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center pointer-events-none animate-pulse">
          <span className="bg-black/60 text-white px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm">
            Converted!
          </span>
        </div>
      )}
    </div>
  );
}

