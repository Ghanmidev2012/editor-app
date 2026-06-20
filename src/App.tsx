import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Code, 
  Video, 
  Layers, 
  Monitor, 
  Trash2, 
  RotateCcw, 
  SlidersHorizontal, 
  FolderLock,
  ArrowRight,
  BookOpen,
  Sliders,
  Cpu
} from 'lucide-react';
import { VideoClip, MediaAsset } from './types';
import AssetLibrary from './components/AssetLibrary';
import Compositor from './components/Compositor';
import PropertiesPanel from './components/PropertiesPanel';
import Timeline from './components/Timeline';
import ArchitectureGuide from './components/ArchitectureGuide';

const INITIAL_CLIPS: VideoClip[] = [
  {
    id: 'clip-1',
    name: 'Retro Neon Grid Ascent',
    type: 'video',
    start: 0,
    end: 12,
    duration: 30,
    trimStart: 0,
    sourceId: 'vid-neon-grid',
    trackId: 0,
    colorFilter: 'none',
    speed: 1.0
  },
  {
    id: 'clip-2',
    name: 'Cosmic Nebula Plasma',
    type: 'video',
    start: 12,
    end: 25,
    duration: 25,
    trimStart: 2,
    sourceId: 'vid-cosmic-nebula',
    trackId: 0,
    colorFilter: 'cyberpunk',
    speed: 1.0
  },
  {
    id: 'clip-3',
    name: 'Retrowave Sunset Intro (Audio)',
    type: 'audio',
    start: 0,
    end: 25,
    duration: 60,
    trimStart: 0,
    sourceId: 'aud-synthwave',
    trackId: 1,
    volume: 0.75,
    speed: 1.0
  },
  {
    id: 'clip-4',
    name: 'Cinematic Introduction Header',
    type: 'text',
    start: 1.5,
    end: 8.5,
    duration: 10,
    trimStart: 0,
    sourceId: 'txt-title',
    trackId: 2,
    textValue: 'MONTAGE COMPOSITOR v1.0',
    textStyle: {
      fontSize: 28,
      color: '#f43f5e',
      position: 'middle',
      fontStyle: 'display'
    }
  },
  {
    id: 'clip-5',
    name: 'Late Space (Subtitle)',
    type: 'text',
    start: 13,
    end: 22,
    duration: 10,
    trimStart: 0,
    sourceId: 'txt-credits',
    trackId: 2,
    textValue: 'Deep Cosmic Acceleration...',
    textStyle: {
      fontSize: 20,
      color: '#ffffff',
      position: 'bottom',
      fontStyle: 'mono'
    }
  },
  {
    id: 'clip-6',
    name: 'Retro Warm filter mapping',
    type: 'filter',
    start: 5,
    end: 15,
    duration: 10,
    trimStart: 0,
    sourceId: 'filt-sepia',
    trackId: 3,
    colorFilter: 'sepia'
  }
];

export default function App() {
  const [clips, setClips] = useState<VideoClip[]>(INITIAL_CLIPS);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [selectedClipId, setSelectedClipId] = useState<string | null>('clip-1');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  
  // Custom workspace view toggle
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<'editor' | 'architecture'>('editor');

  const timelineDuration = 30; // standard fixed workspace clip timeline matching 30s
  const selectedClip = clips.find(c => c.id === selectedClipId) || null;

  // Add selected asset to timeline at playhead
  const handleAddAssetToTimeline = (asset: MediaAsset) => {
    // Map generic asset types into targeted track lanes
    let targetTrack = 0;
    if (asset.type === 'audio') targetTrack = 1;
    if (asset.type === 'text') targetTrack = 2;
    if (asset.type === 'filter') targetTrack = 3;

    // Set duration bounds
    const clipDuration = Math.min(asset.duration, 8); // clamp standard imports to 8 seconds defaults
    const endPosition = Math.min(timelineDuration, currentTime + clipDuration);

    const newClip: VideoClip = {
      id: `clip-${Date.now()}`,
      name: asset.name,
      type: asset.type,
      start: currentTime,
      end: endPosition,
      duration: asset.duration,
      trimStart: 0,
      sourceId: asset.id,
      trackId: targetTrack,
      volume: asset.type === 'audio' || asset.type === 'video' ? 0.8 : undefined,
      speed: 1.0,
      colorFilter: asset.type === 'filter' ? 'sepia' : 'none',
      textValue: asset.type === 'text' ? 'Double-click to edit overlay' : undefined,
      textStyle: asset.type === 'text' ? {
        fontSize: 24,
        color: '#ffffff',
        position: 'middle',
        fontStyle: 'sans'
      } : undefined
    };

    setClips(prev => [...prev, newClip]);
    setSelectedClipId(newClip.id);
  };

  // Add imported custom user files directly to state library
  const handleImportCustomAsset = (asset: MediaAsset, fileUrl?: string) => {
    // For imported files, we add them directly as playable items on the timeline
    const isAudio = asset.type === 'audio';
    const targetTrack = isAudio ? 1 : 0;
    const endPosition = Math.min(timelineDuration, currentTime + asset.duration);

    const newCustomClip: VideoClip = {
      id: asset.id,
      name: asset.name,
      type: asset.type,
      start: currentTime,
      end: endPosition,
      duration: asset.duration,
      trimStart: 0,
      sourceId: fileUrl || asset.id, // save internal or blob url references
      trackId: targetTrack,
      volume: 0.8,
      speed: 1.0,
      colorFilter: 'none',
      isImage: asset.isImage
    };

    setClips(prev => [...prev, newCustomClip]);
    setSelectedClipId(newCustomClip.id);
  };

  // Split selected clip at current playhead
  const handleSplitClipAtPlayhead = () => {
    if (!selectedClip) return;
    
    // Playhead must lie inside clip range to perform split operation
    if (currentTime > selectedClip.start && currentTime < selectedClip.end) {
      const splitTime = currentTime;
      
      // Left slice modifications
      const updatedLeftClip: VideoClip = {
        ...selectedClip,
        end: splitTime
      };

      // Right slice calculations: Start time matches playhead, trimStart is adjusted forward
      const rightSliceDuration = selectedClip.end - splitTime;
      const rightSliceOffset = splitTime - selectedClip.start;
      const updatedRightClip: VideoClip = {
        ...selectedClip,
        id: `clip-${Date.now()}-split`,
        name: `${selectedClip.name} (Part 2)`,
        start: splitTime,
        end: selectedClip.end,
        trimStart: selectedClip.trimStart + rightSliceOffset
      };

      setClips(prev => prev.map(c => c.id === selectedClip.id ? updatedLeftClip : c).concat(updatedRightClip));
      setSelectedClipId(updatedRightClip.id);
    }
  };

  // Update specific values
  const handleUpdateClipProps = (clipId: string, updatedProps: Partial<VideoClip>) => {
    setClips(prev => prev.map(clip => {
      if (clip.id === clipId) {
        return { ...clip, ...updatedProps };
      }
      return clip;
    }));
  };

  // Remove clip
  const handleDeleteClip = (clipId: string) => {
    setClips(prev => prev.filter(c => c.id !== clipId));
    if (selectedClipId === clipId) {
      setSelectedClipId(null);
    }
  };

  // Templates loaders
  const loadPresetTemplate = (type: 'nebula' | 'retrowave' | 'clear') => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (type === 'clear') {
      setClips([]);
      setSelectedClipId(null);
    } else if (type === 'nebula') {
      const template: VideoClip[] = [
        {
          id: 'tem-1',
          name: 'Cosmic Nebula Plasma',
          type: 'video',
          start: 0,
          end: 20,
          duration: 25,
          trimStart: 0,
          sourceId: 'vid-cosmic-nebula',
          trackId: 0,
          colorFilter: 'cyberpunk',
          speed: 1.0
        },
        {
          id: 'tem-2',
          name: 'Cosmic soundtrack',
          type: 'audio',
          start: 0,
          end: 25,
          duration: 90,
          trimStart: 0,
          sourceId: 'aud-ambient',
          trackId: 1,
          volume: 0.8
        },
        {
          id: 'tem-3',
          name: 'Cinematic Ambient Title',
          type: 'text',
          start: 2,
          end: 18,
          duration: 15,
          trimStart: 0,
          sourceId: 'txt-title',
          trackId: 2,
          textValue: 'CELESTIAL ASCENT TRAILS',
          textStyle: {
            fontSize: 32,
            color: '#a855f7',
            position: 'middle',
            fontStyle: 'display'
          }
        }
      ];
      setClips(template);
      setSelectedClipId('tem-1');
    } else if (type === 'retrowave') {
      const template: VideoClip[] = [
        {
          id: 'tem-rw1',
          name: 'Neon Grid Synth',
          type: 'video',
          start: 0,
          end: 15,
          duration: 30,
          trimStart: 0,
          sourceId: 'vid-neon-grid',
          trackId: 0,
          colorFilter: 'none'
        },
        {
          id: 'tem-rw2',
          name: 'Ocean Sunset Horizon',
          type: 'video',
          start: 15,
          end: 30,
          duration: 40,
          trimStart: 0,
          sourceId: 'vid-ocean-sunset',
          trackId: 0,
          colorFilter: 'warm'
        },
        {
          id: 'tem-rw3',
          name: 'Classic Synthwave pad',
          type: 'audio',
          start: 0,
          end: 30,
          duration: 60,
          trimStart: 0,
          sourceId: 'aud-synthwave',
          trackId: 1,
          volume: 0.65
        }
      ];
      setClips(template);
      setSelectedClipId('tem-rw1');
    }
  };

  return (
    <div className="min-h-screen bg-elegant-bg text-[#E0E0E0] flex flex-col overflow-hidden max-w-full font-sans selection:bg-[#6366f1]/30 selection:text-white">
      {/* Universal Desktop Application Main Menu Header (Elegant Carbon Design) */}
      <header className="bg-elegant-panel border-b border-elegant-border px-4 py-2 h-12 shrink-0 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-[#6366f1] rounded flex items-center justify-center text-[10px] font-bold text-white shadow-lg shadow-indigo-600/20">
            C
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-sans font-medium text-xs tracking-wider uppercase text-white">CineForge Montage Studio</h1>
              <span className="text-[9px] bg-[#6366f1]/10 text-[#6366f1] border border-[#6366f1]/20 font-bold px-1.5 py-0.2 rounded">PRO</span>
            </div>
          </div>
        </div>

        {/* Quick presets & view triggers */}
        <div className="flex items-center gap-4">
          <div className="text-[10px] text-gray-500 font-mono hidden md:block">Project: Summer_Campaign_Final_v2.cfp</div>

          {/* Templates toggles */}
          <div className="flex bg-elegant-item border border-elegant-border rounded-md text-[10px] p-0.5">
            <button
              onClick={() => loadPresetTemplate('retrowave')}
              className="px-2 py-1 text-gray-400 hover:text-white rounded transition font-medium"
              title="Load grid retro theme"
            >
              Retrowave Preset
            </button>
            <button
              onClick={() => loadPresetTemplate('nebula')}
              className="px-2 py-1 text-gray-400 hover:text-white rounded transition font-medium"
              title="Load deep nebula theme"
            >
              Nebula Preset
            </button>
            <button
              onClick={() => loadPresetTemplate('clear')}
              className="px-2 py-1 hover:bg-[#6366f1]/10 hover:text-red-400 text-gray-500 rounded transition font-bold"
              title="Clear active tracks"
            >
              Clear
            </button>
          </div>

          <div className="h-4 w-px bg-elegant-border"></div>

          {/* Core Panel Swapper button */}
          <div className="flex bg-elegant-darker p-0.5 border border-elegant-border rounded-lg">
            <button
              onClick={() => setActiveWorkspaceTab('editor')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-medium transition ${
                activeWorkspaceTab === 'editor'
                  ? 'bg-[#6366f1] text-white shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Timeline Workspace</span>
            </button>
            
            <button
              onClick={() => setActiveWorkspaceTab('architecture')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-medium transition ${
                activeWorkspaceTab === 'architecture'
                  ? 'bg-[#6366f1] text-white shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Desktop Porting Guide</span>
            </button>
          </div>
        </div>
      </header>

      {/* Primary Dynamic Workspace Viewport */}
      <main className="flex-1 overflow-hidden min-h-0 min-w-0">
        <AnimatePresence mode="wait">
          {activeWorkspaceTab === 'editor' ? (
            <motion.div
              key="editor"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15 }}
              className="h-full flex flex-col p-4 gap-4 overflow-hidden min-h-0 min-w-0"
            >
              {/* Upper Section: Assets, Viewer, Inspector */}
              <div className="flex-1 grid grid-cols-12 gap-4 min-h-0 overflow-hidden">
                {/* Left: Assets Selector catalog */}
                <div className="col-span-3 h-full min-h-0">
                  <AssetLibrary 
                    onAddAssetToTimeline={handleAddAssetToTimeline} 
                    onImportCustomAsset={handleImportCustomAsset}
                  />
                </div>

                {/* Center: Program monitor visual composite canvas */}
                <div className="col-span-6 h-full min-h-0">
                  <Compositor
                    clips={clips}
                    currentTime={currentTime}
                    isMuted={false}
                    isPlaying={isPlaying}
                    playbackRate={1.0}
                    onSetCurrentTime={setCurrentTime}
                    onPlayPause={setIsPlaying}
                    timelineDuration={timelineDuration}
                  />
                </div>

                {/* Right: Clip settings & LUT modifiers form inspector */}
                <div className="col-span-3 h-full min-h-0">
                  <PropertiesPanel
                    selectedClip={selectedClip}
                    onUpdateClipProps={handleUpdateClipProps}
                    onDeleteClip={handleDeleteClip}
                  />
                </div>
              </div>

              {/* Lower Section: Complete Multitrack Timeline Scrubber area */}
              <div className="h-64 shrink-0 overflow-hidden">
                <Timeline
                  clips={clips}
                  currentTime={currentTime}
                  timelineDuration={timelineDuration}
                  selectedClipId={selectedClipId}
                  onSelectClip={setSelectedClipId}
                  onUpdateClipProps={handleUpdateClipProps}
                  onSplitClipAtPlayhead={handleSplitClipAtPlayhead}
                  onDeleteClip={handleDeleteClip}
                  onSetCurrentTime={setCurrentTime}
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="architecture"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15 }}
              className="h-full p-4 overflow-hidden"
            >
              <ArchitectureGuide />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
