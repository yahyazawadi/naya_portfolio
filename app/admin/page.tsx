'use client';

export const runtime = 'edge';

import { useState, useEffect } from 'react';
import { Upload, Image as ImageIcon, Loader2, CheckCircle2, AlertCircle, ChevronLeft, Edit, Trash2, Settings2, PlusCircle, X } from 'lucide-react';
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
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [existingCoverImage, setExistingCoverImage] = useState<string>('');
  const [gallery, setGallery] = useState<File[]>([]);
  const [existingGallery, setExistingGallery] = useState<string[]>([]);
  
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [progress, setProgress] = useState(0);

  // Load items when switching to manage
  useEffect(() => {
    if (activeTab === 'manage') {
      fetchItems();
    }
  }, [activeTab]);

  const fetchItems = async () => {
    setIsLoadingItems(true);
    try {
      const items = await getAllPortfolioGroups();
      setExistingItems(items || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingItems(false);
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnail(e.target.files[0]);
    }
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setGallery(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setTitle(item.title);
    setDescription(item.description);
    setCategory(item.category);
    setExistingCoverImage(item.coverImage);
    setExistingGallery(item.images || []);
    setGallery([]);
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

      if (item.images?.includes(oldUrl)) {
        newImages = newImages.map(img => img === oldUrl ? newUrl : img);
        updated = true;
      }

      if (updated) {
        return { ...item, coverImage: newCover, images: newImages };
      }
      return item;
    }));

    if (existingCoverImage === oldUrl) setExistingCoverImage(newUrl);
    if (existingGallery.includes(oldUrl)) {
      setExistingGallery(prev => prev.map(url => url === oldUrl ? newUrl : url));
    }
  };

  const removeExistingImage = (url: string) => {
    setExistingGallery(prev => prev.filter(u => u !== url));
  };

  const removeNewImage = (index: number) => {
    setGallery(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const hasExistingContent = editingId && (existingCoverImage || thumbnail);
    const hasNewContent = thumbnail || gallery.length > 0 || title;
    
    if (!editingId && (!thumbnail || gallery.length === 0 || !title)) {
      setStatus({ type: 'error', message: 'Please fill in all fields and select images.' });
      return;
    }

    setIsUploading(true);
    setStatus(null);
    setProgress(5);

    try {
      let finalCoverImage = existingCoverImage;
      let finalGallery = [...existingGallery];

      // 1. Upload new Thumbnail if selected
      if (thumbnail) {
        const thumbFormData = new FormData();
        thumbFormData.append('file', thumbnail);
        const thumbFetch = await fetch('/api/upload', { method: 'POST', body: thumbFormData });
        
        if (!thumbFetch.ok) {
          const errData = (await thumbFetch.json().catch(() => ({}))) as { error?: string };
          throw new Error(errData.error || `Thumbnail upload failed (${thumbFetch.status})`);
        }
        
        const thumbRes = (await thumbFetch.json()) as { url: string };
        finalCoverImage = thumbRes.url;
        setProgress(20);
      }

      // 2. Upload new Gallery Images
      if (gallery.length > 0) {
        const totalToUpload = gallery.length;
        for (let i = 0; i < totalToUpload; i++) {
          const formData = new FormData();
          formData.append('file', gallery[i]);
          
          const uploadFetch = await fetch('/api/upload', { method: 'POST', body: formData });
          
          if (!uploadFetch.ok) {
            const errData = (await uploadFetch.json().catch(() => ({}))) as { error?: string };
            throw new Error(`Gallery image ${i+1} failed: ${errData.error || uploadFetch.status}`);
          }
          
          const res = (await uploadFetch.json()) as { url: string };
          finalGallery.push(res.url);
          setProgress(20 + Math.floor(((i + 1) / totalToUpload) * 70));
        }
      }

      // 3. Save or Update
      if (editingId) {
        const res = await updatePortfolioGroup(editingId, {
          category,
          title,
          description,
          coverImage: finalCoverImage,
          images: finalGallery,
        });
        if (res.error) throw new Error(res.error);
        setStatus({ type: 'success', message: 'Collection updated successfully!' });
      } else {
        const saveRes = await savePortfolioGroup({
          category,
          title,
          description,
          coverImage: finalCoverImage,
          images: finalGallery,
        });
        if (saveRes.error) throw new Error(saveRes.error);
        setStatus({ type: 'success', message: 'New collection added successfully!' });
      }

      setProgress(100);
      
      // Reset form
      setTitle('');
      setDescription('');
      setThumbnail(null);
      setExistingCoverImage('');
      setGallery([]);
      setExistingGallery([]);
      setEditingId(null);
      
      if (editingId) setTimeout(() => setActiveTab('manage'), 1500);
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message || 'Something went wrong' });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#051C30] text-white p-6 md:p-12 lg:p-20 font-sans">
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

          <div className="flex p-1 bg-[#0F314D] rounded-2xl border border-white/5">
            <button 
              onClick={() => { setActiveTab('upload'); setEditingId(null); }}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all font-medium ${activeTab === 'upload' ? 'bg-[#48ABBF] text-[#051C30]' : 'text-white/60 hover:text-white'}`}
            >
              <PlusCircle size={18} />
              Add New
            </button>
            <button 
              onClick={() => setActiveTab('manage')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all font-medium ${activeTab === 'manage' ? 'bg-[#48ABBF] text-[#051C30]' : 'text-white/60 hover:text-white'}`}
            >
              <Settings2 size={18} />
              Manage
            </button>
          </div>
        </div>

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
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 max-h-[480px] overflow-y-auto pr-2 custom-scrollbar">
                  {/* Existing Images */}
                  {existingGallery.map((url, i) => (
                    <div key={`exist-${i}`} className="relative aspect-square rounded-lg overflow-hidden group border border-white/5">
                      {isVideo(url) ? (
                        <video src={url} className="w-full h-full object-cover" autoPlay loop muted playsInline />
                      ) : (
                        <SmartImage 
                          src={url} 
                          className="w-full h-full object-cover" 
                          alt="" 
                          onConverted={(newUrl) => handleImageConverted(url, newUrl)}
                        />
                      )}
                      <button 
                        type="button"
                        onClick={() => removeExistingImage(url)}
                        className="absolute top-1 right-1 p-1 bg-red-500 rounded-md opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  
                  {/* New (Unuploaded) Images */}
                  {gallery.map((file, i) => {
                    const isVid = file.type.startsWith('video/');
                    return (
                      <div key={`new-${i}`} className="relative aspect-square rounded-lg overflow-hidden group border border-[#48ABBF]/30 bg-[#48ABBF]/5">
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-center p-2 text-[#48ABBF]/60 break-all leading-tight">
                          {file.name}
                        </div>
                        <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center gap-1">
                          <span className="bg-[#48ABBF] text-[#051C30] text-[8px] font-bold px-1.5 py-0.5 rounded uppercase">New</span>
                          {isVid && <span className="bg-purple-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded uppercase">Video</span>}
                        </div>
                        <button 
                          type="button"
                          onClick={() => removeNewImage(i)}
                          className="absolute top-1 right-1 p-1 bg-red-500 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    );
                  })}

                  {existingGallery.length === 0 && gallery.length === 0 && (
                    <div className="col-span-full py-12 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-2xl text-white/20">
                       <ImageIcon size={32} className="mb-2" />
                       <p className="text-xs">No images in this collection</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Progress & Status */}
            {(isUploading || status) && (
              <div className="pt-6 border-t border-white/5 space-y-4">
                {isUploading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-medium tracking-widest text-[#48ABBF]">
                      <span>Processing Assets...</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-[#48ABBF] transition-all duration-300" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                )}
                {status && (
                  <div className={`p-4 rounded-xl border flex items-center gap-3 animate-fadeIn ${status.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                    {status.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                    <p className="text-sm font-medium">{status.message}</p>
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-4">
              <button type="submit" disabled={isUploading} className="flex-1 h-16 bg-[#48ABBF] hover:bg-[#5bc0d4] disabled:opacity-50 text-[#051C30] font-bold text-lg rounded-2xl transition-all shadow-xl flex items-center justify-center gap-3">
                {isUploading ? <Loader2 className="animate-spin" /> : editingId ? <CheckCircle2 size={20}/> : <Upload size={20}/>}
                {editingId ? 'Save Changes' : 'Create Collection'}
              </button>
              
              {editingId && (
                <button 
                  type="button" 
                  onClick={() => { setEditingId(null); setTitle(''); setDescription(''); setGallery([]); setExistingGallery([]); }}
                  className="px-8 h-16 border border-white/10 hover:bg-white/5 rounded-2xl transition-all text-white/60 font-medium"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        ) : (
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
                      <div className="text-[10px] text-[#48ABBF] uppercase tracking-widest font-bold">
                        {item.images?.length || 0} Assets
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
        )}
      </div>
    </div>
  );
}
