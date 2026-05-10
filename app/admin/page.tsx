'use client';

export const runtime = 'edge';

import { useState, useEffect, useMemo } from 'react';
import { Upload, Image as ImageIcon, Loader2, CheckCircle2, AlertCircle, ChevronLeft, Edit, Trash2, Settings2, PlusCircle, X, RefreshCw, GripVertical, Calendar } from 'lucide-react';
import Link from 'next/link';
import { uploadImage } from '../actions/upload';
import { savePortfolioGroup, getAllPortfolioGroups, deletePortfolioGroup, updatePortfolioGroup } from '../actions/portfolio';
import { logout } from '../actions/auth';
import SmartImage from '@/components/SmartImage';

const categories = [
  { id: 'digital-art', label: 'Digital art & Illustrations' },
  { id: 'traditional-art', label: 'Traditional art & Crafts' },
  { id: 'graphic-design', label: 'Graphic Design' },
  { id: 'animation', label: 'Animation & Motion Graphic' },
];

const isVideo = (src: string) => {
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov'];
  return typeof src === 'string' && videoExtensions.some(ext => src.toLowerCase().endsWith(ext));
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'upload' | 'manage'>('upload');
  const [existingItems, setExistingItems] = useState<any[]>([]);
  const [isLoadingItems, setIsLoadingItems] = useState(false);

  // Form State
  const [editingId, setEditingId] = useState<number | null>(null);
  const [category, setCategory] = useState(categories[0].id);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [displayOrder, setDisplayOrder] = useState<number>(0);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [existingCoverImage, setExistingCoverImage] = useState<string>('');
  const [gallery, setGallery] = useState<{ url?: string; file?: File; description: string; date?: string; id: string }[]>([]);
  
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [progress, setProgress] = useState(0);

  // Load items when switching to manage
  useEffect(() => {
    console.log("Admin: Active tab changed to:", activeTab);
    if (activeTab === 'manage') {
      fetchItems();
    }
  }, [activeTab]);

  const fetchItems = async () => {
    console.log("Admin: Fetching items...");
    setIsLoadingItems(true);
    try {
      const items = await getAllPortfolioGroups();
      console.log("Admin: Items fetched successfully:", items?.length || 0);
      setExistingItems(items || []);
    } catch (e: any) {
      console.error("Admin: Fetch items error:", e);
      setStatus({ type: 'error', message: "Failed to load items: " + e.message });
    } finally {
      setIsLoadingItems(false);
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnail(e.target.files[0]);
    }
  };



  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setTitle(item.title);
    setDescription(item.description);
    setCategory(item.category);
    setDate(item.date || '');
    setDisplayOrder(item.displayOrder || 0);
    setExistingCoverImage(item.coverImage);
    setGallery((item.images || []).map((img: any, idx: number) => ({
      url: typeof img === 'string' ? img : img.url,
      description: typeof img === 'string' ? '' : (img.description || ''),
      date: typeof img === 'string' ? '' : (img.date || ''),
      id: `existing-${idx}-${Date.now()}`
    })));
    setThumbnail(null);
    setActiveTab('upload');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (item: any) => {
    if (!confirm(`Are you sure you want to delete "${item.title}"?`)) return;
    
    const id = item.id;
    // Optimistic UI update
    const previousItems = [...existingItems];
    setExistingItems(prev => prev.filter(i => i.id !== id));
    
    try {
      const res = await deletePortfolioGroup(Number(id), item.category); 
      if (res.error) {
        throw new Error(res.error);
      }
    } catch (err: any) {
      alert('Delete failed: ' + err.message);
      setExistingItems(previousItems); // Rollback
    }
  };

  const handleImageConverted = (oldUrl: string, newUrl: string) => {
    // Update local state to reflect the change immediately
    setExistingItems(prev => prev.map(item => {
      let updated = false;
      let newCover = item.coverImage;
      let newImages = [...(item.images || [])];

      if (item.coverImage === oldUrl) {
        newCover = newUrl;
        updated = true;
      }

      newImages = newImages.map(img => {
        const url = typeof img === 'string' ? img : img.url;
        if (url === oldUrl) {
          updated = true;
          return typeof img === 'string' ? newUrl : { ...img, url: newUrl };
        }
        return img;
      });

      if (updated) {
        return { ...item, coverImage: newCover, images: newImages };
      }
      return item;
    }));

    if (existingCoverImage === oldUrl) setExistingCoverImage(newUrl);
    setGallery(prev => prev.map(item => item.url === oldUrl ? { ...item, url: newUrl } : item));
  };

  const removeImage = (id: string) => {
    setGallery(prev => prev.filter(item => item.id !== id));
  };

  const updateImageDescription = (id: string, description: string) => {
    setGallery(prev => prev.map(item => item.id === id ? { ...item, description } : item));
  };

  const updateImageDate = (id: string, date: string) => {
    setGallery(prev => prev.map(item => item.id === id ? { ...item, date } : item));
  };

  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedItemIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedItemIndex === null || draggedItemIndex === index) return;
    
    const newGallery = [...gallery];
    const item = newGallery[draggedItemIndex];
    newGallery.splice(draggedItemIndex, 1);
    newGallery.splice(index, 0, item);
    setDraggedItemIndex(index);
    setGallery(newGallery);
  };

  const handleDragEnd = () => {
    setDraggedItemIndex(null);
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(file => ({
        file,
        description: '',
        date: '',
        id: `new-${Math.random()}-${Date.now()}`
      }));
      setGallery(prev => [...prev, ...newFiles]);
    }
  };

  const [isBulkConverting, setIsBulkConverting] = useState(false);

  const handleBulkConvert = async () => {
    const allItems = [
      { id: 'Cover Image', url: existingCoverImage },
      ...gallery.map((item, i) => ({ id: `Gallery Item ${i + 1}`, url: item.url }))
    ].filter(item => item.url && !item.url.startsWith('data:')) as { id: string, url: string }[];

    const needsOptimization = allItems.filter(item => {
      const url = item.url.toLowerCase();
      if (isVideo(url)) return !url.endsWith('.webm');
      return !url.endsWith('.webp');
    });

    if (needsOptimization.length === 0) {
      setStatus({ type: 'success', message: '✨ All media in this collection is already optimized!' });
      setTimeout(() => setStatus(null), 3000);
      return;
    }

    if (!confirm(`Found ${needsOptimization.length} items to optimize. This will replace them with WebP/WebM versions and delete the originals. Continue?`)) return;
    
    setIsBulkConverting(true);
    const results = { success: 0, failed: 0, skipped: 0, errors: [] as string[] };
    
    try {
      for (const item of needsOptimization) {
        const url = item.url;
        const isVid = isVideo(url);
        
        setStatus({ 
          type: 'success', 
          message: `🔄 [${results.success + results.failed + 1}/${needsOptimization.length}] Processing ${item.id}...` 
        });
        
        try {
          let finalBlob: Blob;
          let finalExt = 'webp';

          if (isVid) {
            setStatus({ type: 'success', message: `🎥 [${results.success + results.failed + 1}/${needsOptimization.length}] Recording ${item.id}... 0%` });
            
            finalBlob = await new Promise<Blob>((resolve, reject) => {
              const video = document.createElement('video');
              video.crossOrigin = 'anonymous';
              video.src = `/api/proxy?url=${encodeURIComponent(url)}`;
              video.muted = true;
              video.playsInline = true;
              
              // We need to put it in the DOM (hidden) for some browsers to capture stream
              const container = document.createElement('div');
              container.style.cssText = 'position:fixed; top:-9999px; width:640px; height:360px; pointer-events:none;';
              container.appendChild(video);
              document.body.appendChild(container);

              video.onloadedmetadata = () => {
                try {
                  // Use native video dimensions for best quality
                  container.style.width = `${video.videoWidth}px`;
                  container.style.height = `${video.videoHeight}px`;

                  const stream = (video as any).captureStream ? (video as any).captureStream() : (video as any).mozCaptureStream();
                  
                  // Request high quality (5Mbps target)
                  const recorder = new MediaRecorder(stream, { 
                    mimeType: MediaRecorder.isTypeSupported('video/webm;codecs=vp9') ? 'video/webm;codecs=vp9' : 'video/webm',
                    videoBitsPerSecond: 5000000 
                  });
                  const chunks: Blob[] = [];
                  
                  recorder.ondataavailable = (e) => chunks.push(e.data);
                  recorder.onstop = () => {
                    const blob = new Blob(chunks, { type: 'video/webm' });
                    document.body.removeChild(container);
                    resolve(blob);
                  };

                  video.onended = () => recorder.stop();
                  video.ontimeupdate = () => {
                    const prog = Math.round((video.currentTime / video.duration) * 100);
                    setStatus({ type: 'success', message: `🎥 [${results.success + results.failed + 1}/${needsOptimization.length}] Recording ${item.id}... ${prog}%` });
                  };

                  recorder.start();
                  video.play();
                } catch (e) {
                  document.body.removeChild(container);
                  reject(e);
                }
              };
              video.onerror = () => {
                document.body.removeChild(container);
                reject(new Error('Failed to load video for recording'));
              };
            });
            finalExt = 'webm';
          } else {
            // IMAGE PATH
            const response = await fetch(`/api/proxy?url=${encodeURIComponent(url)}`);
            if (!response.ok) throw new Error(`Fetch failed (Proxy Error)`);
            const blob = await response.blob();

            finalBlob = await new Promise<Blob>((resolve, reject) => {
              const img = new (window as any).Image();
              img.crossOrigin = "anonymous";
              const objectUrl = URL.createObjectURL(blob);
              img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                if (!ctx) { reject(new Error('Canvas Context Error')); return; }
                ctx.drawImage(img, 0, 0);
                canvas.toBlob(b => {
                  if (b) resolve(b);
                  else reject(new Error('WebP Compression Failed'));
                  URL.revokeObjectURL(objectUrl);
                }, 'image/webp', 0.9);
              };
              img.onerror = () => {
                URL.revokeObjectURL(objectUrl);
                reject(new Error('Image processing failed'));
              };
              img.src = objectUrl;
            });
          }

          // 3. Upload
          const formData = new FormData();
          const fileName = url.split('/').pop()?.split('?')[0] || 'media';
          const baseName = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
          formData.append('file', new File([finalBlob], `${baseName}.${finalExt}`, { type: isVid ? 'video/webm' : 'image/webp' }));

          const uploadFetch = await fetch('/api/upload', { method: 'POST', body: formData });
          if (!uploadFetch.ok) throw new Error('Cloud Upload Failed');
          const { url: newUrl } = await uploadFetch.json() as { url: string };

          // 4. Replace in DB & R2 Cleanup
          const replaceFetch = await fetch('/api/image/replace', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ oldUrl: url, newUrl }),
          });
          
          if (!replaceFetch.ok) {
            const errorData = await replaceFetch.json() as any;
            throw new Error(`Database Sync Failed: ${errorData.error || replaceFetch.statusText}`);
          }

          handleImageConverted(url, newUrl);
          results.success++;
        } catch (err: any) {
          console.error(`Error processing ${item.id}:`, err);
          results.failed++;
          results.errors.push(`❌ ${item.id}: ${err.message}`);
        }
      }

      // Final Report
      const summary = `Optimization Finished: ${results.success} Success, ${results.failed} Failed.`;
      if (results.errors.length > 0) {
        setStatus({ 
          type: results.success > 0 ? 'success' : 'error', 
          message: `${summary}\n\n• ${results.errors.join('\n• ')}` 
        });
      } else {
        setStatus({ type: 'success', message: `✅ ${summary}` });
        setTimeout(() => setStatus(null), 5000);
      }
    } catch (err: any) {
      setStatus({ type: 'error', message: `Critical Failure: ${err.message}` });
    } finally {
      setIsBulkConverting(false);
    }
  };

  const unconvertedCount = useMemo(() => {
    const allUrls = [
      existingCoverImage,
      ...gallery.map(item => item.url).filter(Boolean)
    ].filter(url => url && typeof url === 'string' && !url.startsWith('data:')) as string[];

    return allUrls.filter(url => {
      const u = url.toLowerCase();
      if (isVideo(u)) return !u.endsWith('.webm');
      return !u.endsWith('.webp');
    }).length;
  }, [existingCoverImage, gallery]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isUploading || isBulkConverting) return;

    // Validation for new collections
    if (!editingId && (!thumbnail || gallery.length === 0 || !title)) {
      setStatus({ type: 'error', message: 'Please provide a title, cover image, and at least one gallery item.' });
      return;
    }
    
    setIsUploading(true);
    setProgress(0);
    setStatus(null);

    try {
      const optimizeFile = async (file: File, label: string): Promise<File> => {
        const isVid = file.type.startsWith('video/');
        const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
        
        if (isVid) {
          setStatus({ type: 'success', message: `🎬 Optimizing ${label}... 0%` });
          const blob = await new Promise<Blob>((resolve, reject) => {
            const url = URL.createObjectURL(file);
            const video = document.createElement('video');
            video.src = url;
            video.muted = true;
            video.playsInline = true;
            const container = document.createElement('div');
            container.style.cssText = 'position:fixed; top:-9999px; pointer-events:none;';
            container.appendChild(video);
            document.body.appendChild(container);

            video.onloadedmetadata = () => {
              container.style.width = `${video.videoWidth}px`;
              container.style.height = `${video.videoHeight}px`;
              const stream = (video as any).captureStream ? (video as any).captureStream() : (video as any).mozCaptureStream();
              const recorder = new MediaRecorder(stream, { 
                mimeType: MediaRecorder.isTypeSupported('video/webm;codecs=vp9') ? 'video/webm;codecs=vp9' : 'video/webm',
                videoBitsPerSecond: 5000000 
              });
              const chunks: Blob[] = [];
              recorder.ondataavailable = (e) => chunks.push(e.data);
              recorder.onstop = () => {
                document.body.removeChild(container);
                URL.revokeObjectURL(url);
                resolve(new Blob(chunks, { type: 'video/webm' }));
              };
              video.onended = () => recorder.stop();
              video.ontimeupdate = () => {
                const p = Math.round((video.currentTime / video.duration) * 100);
                setStatus({ type: 'success', message: `🎬 Optimizing ${label}... ${p}%` });
              };
              recorder.start();
              video.play();
            };
            video.onerror = () => {
              document.body.removeChild(container);
              URL.revokeObjectURL(url);
              reject(new Error(`Failed to load ${label} for optimization`));
            };
          });
          return new File([blob], `${baseName}.webm`, { type: 'video/webm' });
        } else {
          setStatus({ type: 'success', message: `🖼️ Optimizing ${label}...` });
          const blob = await new Promise<Blob>((resolve, reject) => {
            const url = URL.createObjectURL(file);
            const img = new (window as any).Image();
            img.onload = () => {
              const canvas = document.createElement('canvas');
              canvas.width = img.width;
              canvas.height = img.height;
              const ctx = canvas.getContext('2d');
              if (!ctx) return reject(new Error('Canvas context error'));
              ctx.drawImage(img, 0, 0);
              canvas.toBlob(b => {
                URL.revokeObjectURL(url);
                if (b) resolve(b);
                else reject(new Error('WebP conversion failed'));
              }, 'image/webp', 0.9);
            };
            img.onerror = () => {
              URL.revokeObjectURL(url);
              reject(new Error('Image processing failed'));
            };
            img.src = url;
          });
          return new File([blob], `${baseName}.webp`, { type: 'image/webp' });
        }
      };

      let finalCoverImage = existingCoverImage;
      const finalGallery: { url: string; description: string; date: string }[] = [];

      if (thumbnail) {
        const optimized = await optimizeFile(thumbnail, 'Cover Image');
        const formData = new FormData();
        formData.append('file', optimized);
        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        if (!res.ok) throw new Error('Cover upload failed');
        const data = await res.json() as { url: string };
        finalCoverImage = data.url;
        setProgress(10);
      }

      if (gallery.length > 0) {
        for (let i = 0; i < gallery.length; i++) {
          const item = gallery[i];
          let url = item.url || '';

          if (item.file) {
            const optimized = await optimizeFile(item.file, `Gallery ${i + 1}`);
            const formData = new FormData();
            formData.append('file', optimized);
            const res = await fetch('/api/upload', { method: 'POST', body: formData });
            if (!res.ok) throw new Error(`Gallery upload ${i + 1} failed`);
            const data = await res.json() as { url: string };
            url = data.url;
          }

          finalGallery.push({ url, description: item.description, date: item.date || '' });
          setProgress(10 + Math.floor(((i + 1) / gallery.length) * 80));
        }
      }

      const portfolioData = { 
        title, 
        description, 
        category, 
        date,
        displayOrder,
        coverImage: finalCoverImage, 
        images: finalGallery 
      };
      const res = editingId 
        ? await updatePortfolioGroup(editingId, portfolioData)
        : await savePortfolioGroup(portfolioData);

      if (res?.error) throw new Error(res.error);
      
      setStatus({ type: 'success', message: `✨ Collection ${editingId ? 'updated' : 'created'} and fully optimized!` });
      setProgress(100);

      if (!editingId) {
        setTitle(''); setDescription(''); setDate(''); setDisplayOrder(0); setThumbnail(null); setGallery([]);
      }
      setExistingItems(await getAllPortfolioGroups());
      if (editingId) setTimeout(() => { setEditingId(null); setActiveTab('manage'); }, 2000);

    } catch (err: any) {
      console.error(err);
      setStatus({ type: 'error', message: err.message || 'Operation failed' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddNew = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setDate('');
    setDisplayOrder(0);
    setCategory('digital-art');
    setThumbnail(null);
    setExistingCoverImage('');
    setGallery([]);
    setStatus(null);
    setActiveTab('upload');
  };

  const clearForm = () => {
    setTitle('');
    setDescription('');
    setDate('');
    setDisplayOrder(0);
    setThumbnail(null);
    setGallery([]);
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-[#051C30] text-white pt-24 pb-12 px-6 md:pt-32 md:px-12 lg:pt-40 lg:px-20 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Navigation & Tabs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-8">
          <div>
            <div className="flex items-center gap-6 mb-4">
              <Link href="/" className="flex items-center gap-2 text-[#48ABBF] hover:text-white transition-colors no-underline">
                <ChevronLeft size={20} />
                Back to Portfolio
              </Link>
              <button 
                onClick={() => logout()}
                className="text-red-400/80 hover:text-red-400 text-sm transition-colors flex items-center gap-2"
              >
                Logout
              </button>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-[#48ABBF] bg-clip-text text-transparent">
              Admin Portal
            </h1>
          </div>
        </div>

        {/* Tab Navigation Row */}
        <div className="flex justify-center mb-16 relative z-[9999]">
          <div className="flex p-1.5 bg-[#0F314D] rounded-2xl border border-white/10 shadow-2xl backdrop-blur-md">
            <button 
              onClick={() => {
                console.log("Admin: Add New clicked");
                handleAddNew();
              }}
              className={`flex items-center gap-3 px-8 py-4 rounded-xl transition-all duration-300 font-bold text-sm uppercase tracking-widest touch-manipulation relative z-[9999] ${(activeTab === 'upload' && !editingId) ? 'bg-[#48ABBF] text-[#051C30] shadow-[0_0_20px_rgba(72,171,191,0.3)]' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
            >
              <PlusCircle size={20} />
              Add New
            </button>
            <button 
              onClick={() => {
                console.log("Admin: Manage clicked");
                setEditingId(null);
                setActiveTab('manage');
                fetchItems();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex items-center gap-3 px-8 py-4 rounded-xl transition-all duration-300 font-bold text-sm uppercase tracking-widest touch-manipulation relative z-[9999] ${activeTab === 'manage' ? 'bg-[#48ABBF] text-[#051C30] shadow-[0_0_20px_rgba(72,171,191,0.3)]' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
            >
              {isLoadingItems ? <Loader2 className="animate-spin" size={20} /> : <Settings2 size={20} />}
              Manage
            </button>
          </div>
        </div>
        
        {status && (
          <div className={`mb-8 p-6 rounded-3xl border flex items-center gap-4 animate-fadeIn backdrop-blur-xl ${status.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
            {status.type === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
            <div className="flex-1">
              <p className="font-bold text-lg">{status.message}</p>
              {progress > 0 && progress < 100 && (
                <div className="mt-3 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-current transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>
              )}
            </div>
            <button onClick={() => setStatus(null)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
              <X size={20} />
            </button>
          </div>
        )}

        {activeTab === 'upload' ? (
          <form onSubmit={handleSubmit} className="space-y-10 bg-[#0F314D]/40 p-8 md:p-12 rounded-3xl border border-white/5 backdrop-blur-xl shadow-2xl animate-fadeIn">
            <h2 className="text-2xl font-bold text-[#48ABBF] flex items-center gap-3">
              {editingId ? <Edit /> : <PlusCircle />}
              {editingId ? `Editing: ${title}` : 'Create New Collection'}
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Category & Info */}
              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-sm font-semibold tracking-wider text-[#48ABBF] uppercase">Category</label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#051C30]/50 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-[#48ABBF] transition-all appearance-none cursor-pointer"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-semibold tracking-wider text-[#48ABBF] uppercase">Collection Title</label>
                  <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Traditional Oil Paintings"
                    className="w-full bg-[#051C30]/50 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-[#48ABBF] transition-all"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-semibold tracking-wider text-[#48ABBF] uppercase">Description</label>
                  <textarea 
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe this collection..."
                    className="w-full bg-[#051C30]/50 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-[#48ABBF] transition-all resize-none"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-semibold tracking-wider text-[#48ABBF] uppercase">Collection Date</label>
                  <div className="relative flex items-center">
                    <input 
                      type="text" 
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      placeholder="e.g. Summer 2024 or 20/05/2024"
                      className="w-full bg-[#051C30]/50 border border-white/10 rounded-xl px-5 py-4 pr-14 focus:outline-none focus:border-[#48ABBF] transition-all"
                    />
                    <div className="absolute right-5 flex items-center">
                      <div className="relative">
                        <Calendar size={20} className="text-[#48ABBF] cursor-pointer hover:text-white transition-colors" />
                        <input 
                          type="date"
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                          onChange={(e) => setDate(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-semibold tracking-wider text-[#48ABBF] uppercase">Display Order</label>
                  <input 
                    type="number" 
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(Number(e.target.value))}
                    placeholder="0"
                    className="w-full bg-[#051C30]/50 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-[#48ABBF] transition-all"
                  />
                  <p className="text-xs text-white/40 ml-1">Lower numbers appear first in the gallery.</p>
                </div>

                {/* --- Cover Image Section --- */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold tracking-wider text-[#48ABBF] uppercase">Cover Image</label>
                  {editingId && existingCoverImage && !thumbnail && (
                    <div className="relative group w-full h-40 rounded-xl overflow-hidden mb-4 border border-white/10">
                      {isVideo(existingCoverImage) ? (
                        <video src={existingCoverImage} className="w-full h-full object-cover" autoPlay loop muted playsInline />
                      ) : (
                        <SmartImage 
                          src={existingCoverImage} 
                          className="w-full h-full object-cover" 
                          alt="" 
                          onConverted={(newUrl) => handleImageConverted(existingCoverImage, newUrl)}
                        />
                      )}
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                         <label className="cursor-pointer bg-[#48ABBF] text-[#051C30] px-4 py-2 rounded-lg font-bold text-sm">
                           Change Asset
                           <input type="file" className="hidden" accept="image/*,video/*,image/heic,image/heif,video/quicktime,video/mp4,video/webm" onChange={handleThumbnailChange} />
                         </label>
                      </div>
                    </div>
                  )}
                  {(!editingId || thumbnail || !existingCoverImage) && (
                    <label className={`
                      relative flex flex-col items-center justify-center w-full h-40 
                      border-2 border-dashed rounded-2xl cursor-pointer transition-all
                      ${thumbnail ? 'border-[#48ABBF] bg-[#48ABBF]/5' : 'border-white/10 hover:border-white/20 hover:bg-white/5'}
                    `}>
                      <input type="file" className="hidden" accept="image/*,video/*,image/heic,image/heif,video/quicktime,video/mp4,video/webm" onChange={handleThumbnailChange} />
                      {thumbnail ? (
                        <span className="text-sm text-[#48ABBF] font-medium">{thumbnail.name}</span>
                      ) : (
                        <span className="text-sm text-white/40">Select cover asset (Image/Video)</span>
                      )}
                    </label>
                  )}
                </div>
              </div>

              {/* Gallery Section */}
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold tracking-wider text-[#48ABBF] uppercase">Gallery Collection</label>
                  <label className="cursor-pointer text-[#48ABBF] hover:text-white transition-colors text-xs font-bold flex items-center gap-2">
                    <PlusCircle size={14} />
                    Add More
                    <input type="file" multiple className="hidden" accept="image/*,video/*,image/heic,image/heif,video/quicktime,video/mp4,video/webm" onChange={handleGalleryChange} />
                  </label>
                </div>

                {/* Image Grid for Management */}
                <div className="flex flex-col gap-6 max-h-[700px] overflow-y-auto pr-4 custom-scrollbar">
                  {gallery.map((item, i) => {
                    const isVid = item.file ? item.file.type.startsWith('video/') : (item.url ? isVideo(item.url) : false);
                    
                    return (
                      <div 
                        key={item.id} 
                        draggable="true"
                        onDragStart={() => handleDragStart(i)}
                        onDragOver={(e) => handleDragOver(e, i)}
                        onDragEnd={handleDragEnd}
                        className={`relative bg-[#051C30]/40 border rounded-2xl p-4 group transition-all cursor-move active:scale-[0.98] active:rotate-1 ${draggedItemIndex === i ? 'opacity-20 border-[#48ABBF] bg-[#48ABBF]/10' : 'border-white/10 hover:border-[#48ABBF]/40'}`}
                      >
                        <div className="flex gap-6 items-start">
                          <div className="mt-12 text-white/20 group-hover:text-[#48ABBF]/40 transition-colors">
                            <GripVertical size={20} />
                          </div>
                          {/* Asset Preview */}
                          <div className="relative w-32 h-32 flex-shrink-0 rounded-xl overflow-hidden border border-white/10 bg-black/20">
                            {item.url ? (
                              isVid ? (
                                <video src={item.url} className="w-full h-full object-cover" autoPlay loop muted playsInline />
                              ) : (
                                <SmartImage 
                                  src={item.url} 
                                  className="w-full h-full object-cover" 
                                  alt="" 
                                  onConverted={(newUrl) => handleImageConverted(item.url!, newUrl)}
                                />
                              )
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center text-[10px] text-center p-2 text-[#48ABBF]/60 bg-[#48ABBF]/5">
                                <ImageIcon size={20} className="mb-1 opacity-40" />
                                <span className="uppercase font-bold tracking-tighter">{item.file?.name.split('.').pop()}</span>
                              </div>
                            )}
                            
                            {item.file && (
                              <div className="absolute top-1 left-1">
                                <span className="bg-[#48ABBF] text-[#051C30] text-[8px] font-bold px-1.5 py-0.5 rounded uppercase shadow-lg">New</span>
                              </div>
                            )}
                            {isVid && (
                              <div className="absolute bottom-1 right-1">
                                <span className="bg-purple-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded uppercase shadow-lg">Video</span>
                              </div>
                            )}
                          </div>

                          {/* Description & Controls */}
                          <div 
                            className="flex-1 flex flex-col gap-3 cursor-default"
                            onMouseDown={(e) => e.stopPropagation()}
                            onDragStart={(e) => e.stopPropagation()}
                            draggable="false"
                          >
                              <div className="flex items-start gap-6" draggable="false">
                                <div className="flex-1 flex flex-col gap-2" draggable="false">
                                  <textarea
                                    placeholder="Add description for this image..."
                                    value={item.description}
                                    draggable="false"
                                    onDragStart={(e) => e.stopPropagation()}
                                    onChange={(e) => updateImageDescription(item.id, e.target.value)}
                                    className="w-full bg-[#051C30]/30 border border-white/5 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#48ABBF]/50 transition-all resize-none h-20 cursor-text"
                                  />
                                  <input 
                                    type="text"
                                    placeholder="Asset Date (optional) e.g. 2024"
                                    value={item.date || ''}
                                    draggable="false"
                                    onDragStart={(e) => e.stopPropagation()}
                                    onChange={(e) => updateImageDate(item.id, e.target.value)}
                                    className="w-full bg-[#051C30]/30 border border-white/5 rounded-lg px-3 py-2 text-[11px] focus:outline-none focus:border-[#48ABBF]/50 transition-all cursor-text"
                                  />
                                </div>

                                <div className="flex flex-col gap-4 pt-1" draggable="false">
                                  <button 
                                    type="button"
                                    draggable="false"
                                    onDragStart={(e) => e.stopPropagation()}
                                    onClick={(e) => { e.stopPropagation(); removeImage(item.id); }}
                                    onMouseDown={(e) => e.stopPropagation()}
                                    className="p-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all cursor-pointer"
                                    title="Remove"
                                  >
                                    <Trash2 size={18} />
                                  </button>
                                  <div className="relative" draggable="false">
                                    <button 
                                      type="button"
                                      draggable="false"
                                      onDragStart={(e) => e.stopPropagation()}
                                      onMouseDown={(e) => e.stopPropagation()}
                                      className="p-5 text-[#48ABBF] hover:bg-[#48ABBF]/10 rounded-xl transition-all cursor-pointer"
                                      title="Pick Date"
                                    >
                                      <Calendar size={20} />
                                      <input 
                                        type="date"
                                        draggable="false"
                                        onDragStart={(e) => e.stopPropagation()}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        onMouseDown={(e) => e.stopPropagation()}
                                        onChange={(e) => updateImageDate(item.id, e.target.value)}
                                      />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            {item.file && (
                              <div className="text-[10px] text-white/30 truncate max-w-[300px]">
                                File: {item.file.name}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {gallery.length === 0 && (
                    <div className="py-20 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-3xl text-white/20">
                       <ImageIcon size={48} className="mb-4 opacity-20" />
                       <p className="text-sm font-medium">Your gallery is empty</p>
                       <p className="text-xs mt-1">Upload images to get started</p>
                    </div>
                  )}
                </div>
              </div>
            </div>


            <div className="flex flex-wrap gap-4">
              <button type="submit" disabled={isUploading || isBulkConverting} className="flex-1 h-16 bg-[#48ABBF] hover:bg-[#5bc0d4] disabled:opacity-50 text-[#051C30] font-bold text-lg rounded-2xl transition-all shadow-xl flex items-center justify-center gap-3">
                {isUploading ? <Loader2 className="animate-spin" /> : editingId ? <CheckCircle2 size={20}/> : <Upload size={20}/>}
                {editingId ? 'Save Changes' : 'Create Collection'}
              </button>

              {editingId && unconvertedCount > 0 && (
                <button 
                  type="button" 
                  disabled={isUploading || isBulkConverting}
                  onClick={handleBulkConvert}
                  className="px-6 h-16 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 font-bold rounded-2xl transition-all flex items-center gap-3 disabled:opacity-30"
                >
                  {isBulkConverting ? <Loader2 className="animate-spin" size={18} /> : <RefreshCw size={18} />}
                  Convert All ({unconvertedCount})
                </button>
              )}
              
              {editingId && (
                <button 
                  type="button" 
                  onClick={() => { setEditingId(null); setTitle(''); setDescription(''); setDate(''); setGallery([]); }}
                  className="px-8 h-16 border border-white/10 hover:bg-white/5 rounded-2xl transition-all text-white/60 font-medium"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
              {isLoadingItems ? (
                <div className="col-span-full py-20 flex flex-col items-center justify-center text-white/40">
                  <Loader2 className="animate-spin mb-4" size={40} />
                  <p>Retrieving database records...</p>
                </div>
              ) : existingItems.length === 0 ? (
                <div className="col-span-full py-20 text-center text-white/40 bg-[#0F314D]/20 rounded-3xl border border-dashed border-white/5">
                  <ImageIcon size={48} className="mx-auto mb-4 opacity-20" />
                  <p>The portfolio is empty. Add your first masterpiece!</p>
                </div>
              ) : (
                existingItems.map(item => (
                  <div key={item.id} className="group bg-[#0F314D]/40 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-sm flex flex-col hover:border-[#48ABBF]/30 transition-all duration-300">
                    <div className="relative h-48">
                      {isVideo(item.coverImage) ? (
                        <video src={item.coverImage} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-500" autoPlay loop muted playsInline />
                      ) : (
                        <SmartImage 
                          src={item.coverImage} 
                          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-500" 
                          alt="" 
                          onConverted={(newUrl) => handleImageConverted(item.coverImage, newUrl)}
                        />
                      )}
                      <div className="absolute top-4 right-4 flex gap-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        <button onClick={() => handleEdit(item)} className="p-2.5 bg-black/60 hover:bg-[#48ABBF] hover:text-black rounded-xl backdrop-blur-md transition-all shadow-xl">
                          <Edit size={18} />
                        </button>
                        <button onClick={() => handleDelete(item)} className="p-2.5 bg-black/60 hover:bg-red-500 rounded-xl backdrop-blur-md transition-all shadow-xl">
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <div className="absolute bottom-4 left-4">
                         <span className="bg-[#48ABBF] text-[#051C30] text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider shadow-lg">
                           {categories.find(c => c.id === item.category)?.label || item.category}
                         </span>
                      </div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col bg-gradient-to-b from-transparent to-[#0F314D]/20">
                      <h3 className="font-bold text-xl mb-2 line-clamp-1 group-hover:text-[#48ABBF] transition-colors">{item.title}</h3>
                      <p className="text-white/50 text-sm line-clamp-2 mb-4 flex-1 leading-relaxed">{item.description}</p>
                      <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <div className="flex flex-col gap-1">
                          <div className="text-[10px] text-[#48ABBF] uppercase tracking-widest font-bold">
                            {item.images?.length || 0} Assets
                          </div>
                          {item.date && (
                            <div className="text-[10px] text-white/40 font-medium">
                              {item.date}
                            </div>
                          )}
                        </div>
                        <div className="text-[10px] text-white/20 font-mono">
                          ID: {item.id}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Storage Maintenance Section */}
            {!isLoadingItems && (
              <div className="mt-12 pt-12 border-t border-white/10">
                <div className="bg-[#0F314D]/50 rounded-3xl p-8 border border-white/5 max-w-2xl">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-[#48ABBF]/10 rounded-2xl text-[#48ABBF]">
                      <Settings2 size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Storage Maintenance</h3>
                      <p className="text-white/50 text-sm">Scan and remove unoptimized legacy assets (orphans) from R2.</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={async () => {
                      if (!confirm('This will scan your R2 bucket for files not used in any board. Continue?')) return;
                      setStatus({ type: 'success', message: '🔍 Scanning R2 bucket for orphaned files...' });
                      try {
                        const res = await fetch('/api/admin/cleanup');
                        const data = await res.json() as { count: number, orphans: string[] };
                        if (data.count > 0) {
                          if (confirm(`Found ${data.count} orphaned files. Delete them all?`)) {
                            const delRes = await fetch('/api/admin/cleanup', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ keys: data.orphans })
                            });
                            const delData = await delRes.json() as { deletedCount: number };
                            setStatus({ type: 'success', message: `✨ Successfully deleted ${delData.deletedCount} legacy files!` });
                          } else {
                            setStatus(null);
                          }
                        } else {
                          setStatus({ type: 'success', message: '✅ Your storage is clean! No orphaned files found.' });
                        }
                      } catch (e) {
                        setStatus({ type: 'error', message: 'Cleanup failed. Check console for details.' });
                      }
                    }}
                    className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all text-xs font-bold tracking-widest uppercase"
                  >
                    Scan & Deep Clean Storage
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

