import { useState, useRef, DragEvent } from 'react';
import { STATIC_ASSETS } from '../utils/assets';
import { MediaAsset, MediaType } from '../types';
import { FolderPlus, Plus, Video, Music, Type, Sliders, Sparkles, UploadCloud } from 'lucide-react';

interface AssetLibraryProps {
  onAddAssetToTimeline: (asset: MediaAsset) => void;
  onImportCustomAsset: (asset: MediaAsset, fileUrl?: string) => void;
}

export default function AssetLibrary({ onAddAssetToTimeline, onImportCustomAsset }: AssetLibraryProps) {
  const [activeCategory, setActiveCategory] = useState<MediaType | 'all'>('all');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categoriesSet: { id: MediaType | 'all'; label: string; icon: any }[] = [
    { id: 'all', label: 'All Assets', icon: Sparkles },
    { id: 'video', label: 'Videos & Images', icon: Video },
    { id: 'audio', label: 'Audio Tracks', icon: Music },
    { id: 'text', label: 'Titles & Texts', icon: Type },
    { id: 'filter', label: 'Filters & LUTs', icon: Sliders },
  ];

  const filteredAssets = activeCategory === 'all' 
    ? STATIC_ASSETS 
    : STATIC_ASSETS.filter(asset => asset.type === activeCategory);

  // Handle local File Imports
  const processImportedFiles = (files: FileList) => {
    Array.from(files).forEach((file) => {
      const isVideo = file.type.startsWith('video/');
      const isAudio = file.type.startsWith('audio/');
      const isImage = file.type.startsWith('image/');
      
      if (!isVideo && !isAudio && !isImage) {
        alert('Format not supported. Please import a video (MP4/MOV), audio (MP3/WAV), or image (PNG/JPG) file.');
        return;
      }

      const fileUrl = URL.createObjectURL(file);
      
      // Determine duration asynchronously
      if (isVideo) {
        const tempVideo = document.createElement('video');
        tempVideo.src = fileUrl;
        tempVideo.onloadedmetadata = () => {
          const customAsset: MediaAsset = {
            id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            name: file.name,
            type: 'video',
            duration: Math.round(tempVideo.duration) || 10,
            color: 'from-blue-500 to-cyan-500',
            thumbnailEmoji: '📁'
          };
          onImportCustomAsset(customAsset, fileUrl);
        };
      } else if (isAudio) {
        const tempAudio = document.createElement('audio');
        tempAudio.src = fileUrl;
        tempAudio.onloadedmetadata = () => {
          const customAsset: MediaAsset = {
            id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            name: file.name,
            type: 'audio',
            duration: Math.round(tempAudio.duration) || 120,
            color: 'from-amber-500 to-indigo-500',
            thumbnailEmoji: '🎵'
          };
          onImportCustomAsset(customAsset, fileUrl);
        };
      } else if (isImage) {
        const customAsset: MediaAsset = {
          id: `custom-img-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          name: file.name,
          type: 'video', // treated as video clip on timeline
          duration: 5,   // static images default to a 5-second track clip
          color: 'from-pink-500 to-rose-500',
          thumbnailEmoji: '🖼️',
          isImage: true
        };
        onImportCustomAsset(customAsset, fileUrl);
      }
    });
  };

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImportedFiles(e.dataTransfer.files);
    }
  };

  return (
    <div className="h-full flex flex-col bg-elegant-panel border border-elegant-border rounded-md overflow-hidden shadow-xl">
      {/* Search and Category Toggle Tabs */}
      <div className="p-3 bg-elegant-panel border-b border-elegant-border shrink-0">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-500">Project Media</span>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="text-[#6366f1] hover:text-indigo-400 text-xs font-semibold"
          >
            + Import
          </button>
        </div>
        <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-thin">
          {categoriesSet.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] whitespace-nowrap transition ${
                  activeCategory === cat.id
                    ? 'bg-elegant-item text-white font-medium border border-[#333]'
                    : 'text-gray-400 hover:text-slate-200 hover:bg-elegant-item/40'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Asset grid flow */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin bg-elegant-darker/30">
        {/* Dynamic Drag / Upload area */}
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border border-dashed rounded-md p-4 flex flex-col items-center justify-center text-center cursor-pointer transition ${
            dragActive 
              ? 'border-[#6366f1] bg-[#6366f1]/5' 
              : 'border-elegant-border hover:border-gray-700 hover:bg-elegant-item/30'
          }`}
        >
          <UploadCloud className="w-6 h-6 text-gray-500 mb-1" />
          <p className="text-[11px] text-gray-300 font-medium">Drag raw media here, or <span className="text-indigo-400 hover:underline">browse</span></p>
          <p className="text-[10px] text-gray-500 mt-0.5">Supports MP4, MOV, PNG, JPG, MP3, WAV files</p>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            multiple
            accept="video/*,audio/*,image/*"
            onChange={(e) => e.target.files && processImportedFiles(e.target.files)}
          />
        </div>

        {/* List of preset libraries */}
        <div className="grid grid-cols-1 gap-2">
          {filteredAssets.map((asset) => (
            <div
              key={asset.id}
              className="group flex items-center justify-between p-2.5 bg-elegant-item border border-[#333] hover:border-gray-700 rounded-md transition"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className={`w-8 h-8 rounded-md shrink-0 bg-gradient-to-tr ${asset.color} flex items-center justify-center text-base shadow-sm relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <span className="relative z-1">{asset.thumbnailEmoji}</span>
                </div>
                <div className="min-w-0">
                  <h4 className="text-[11px] text-gray-300 font-medium truncate pr-2">{asset.name}</h4>
                  <p className="text-[9px] text-gray-500 font-mono mt-0.5 uppercase tracking-wider">{asset.type} • {asset.duration}s</p>
                </div>
              </div>
              
              <button
                onClick={() => onAddAssetToTimeline(asset)}
                className="opacity-0 group-hover:opacity-100 p-1.5 bg-[#6366f1] hover:bg-indigo-500 text-white rounded-md transition shadow-md shrink-0 animate-in fade-in duration-100"
                title="Add Clip to Timeline layer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
