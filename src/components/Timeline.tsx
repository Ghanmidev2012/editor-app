import React, { useRef, useState, useEffect } from 'react';
import { VideoClip, MediaType } from '../types';
import { ZoomIn, ZoomOut, Scissors, Trash, Play } from 'lucide-react';

interface TimelineProps {
  clips: VideoClip[];
  currentTime: number;
  timelineDuration: number;
  selectedClipId: string | null;
  onSelectClip: (clipId: string | null) => void;
  onUpdateClipProps: (clipId: string, updatedProps: Partial<VideoClip>) => void;
  onSplitClipAtPlayhead: () => void;
  onDeleteClip: (clipId: string) => void;
  onSetCurrentTime: (time: number) => void;
}

export default function Timeline({
  clips,
  currentTime,
  timelineDuration,
  selectedClipId,
  onSelectClip,
  onUpdateClipProps,
  onSplitClipAtPlayhead,
  onDeleteClip,
  onSetCurrentTime
}: TimelineProps) {
  const [pixelsPerSecond, setPixelsPerSecond] = useState<number>(15);
  const timelineRulerRef = useRef<HTMLDivElement>(null);
  
  // Drag tracking state
  const [dragAction, setDragAction] = useState<{
    clipId: string;
    type: 'move' | 'trim-left' | 'trim-right';
    initialMouseX: number;
    initialStart: number;
    initialEnd: number;
  } | null>(null);

  const [isScrubbing, setIsScrubbing] = useState<boolean>(false);

  // Track lanes configurations (trackId matches indices)
  const tracksList: { id: number; name: string; type: MediaType; color: string }[] = [
    { id: 0, name: 'V2 (Overlay Text)', type: 'text', color: 'border-l-2 border-indigo-400 bg-indigo-500/5' },
    { id: 1, name: 'V1 (Video Track)', type: 'video', color: 'border-l-2 border-slate-500 bg-white/5' },
    { id: 2, name: 'A1 (Audio Track)', type: 'audio', color: 'border-l-2 border-emerald-500 bg-emerald-500/5' },
    { id: 3, name: 'FX (Dynamic Filter)', type: 'filter', color: 'border-l-2 border-purple-500 bg-purple-500/5' },
  ];

  const totalWidth = timelineDuration * pixelsPerSecond;

  // Zoom actions
  const zoomIn = () => setPixelsPerSecond(prev => Math.min(60, prev + 5));
  const zoomOut = () => setPixelsPerSecond(prev => Math.max(5, prev - 5));

  // Timeline Mouse Click & Drag (Scrubbing playhead)
  const handleRulerMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsScrubbing(true);
    updatePlayheadPosition(e);
  };

  const updatePlayheadPosition = (e: React.MouseEvent | MouseEvent) => {
    if (!timelineRulerRef.current) return;
    const rect = timelineRulerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left + timelineRulerRef.current.scrollLeft;
    const targetTime = Math.max(0, Math.min(timelineDuration, clickX / pixelsPerSecond));
    onSetCurrentTime(targetTime);
  };

  // Clip mouse drags
  const handleClipMouseDown = (
    e: React.MouseEvent,
    clip: VideoClip,
    type: 'move' | 'trim-left' | 'trim-right'
  ) => {
    e.stopPropagation();
    onSelectClip(clip.id);
    setDragAction({
      clipId: clip.id,
      type,
      initialMouseX: e.clientX,
      initialStart: clip.start,
      initialEnd: clip.end
    });
  };

  // Track global dragging moves
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isScrubbing) {
        updatePlayheadPosition(e);
        return;
      }

      if (!dragAction) return;

      const deltaX = e.clientX - dragAction.initialMouseX;
      const deltaTime = deltaX / pixelsPerSecond;
      const clip = clips.find(c => c.id === dragAction.clipId);
      if (!clip) return;

      if (dragAction.type === 'move') {
        const newStart = Math.max(0, dragAction.initialStart + deltaTime);
        const duration = dragAction.initialEnd - dragAction.initialStart;
        onUpdateClipProps(clip.id, {
          start: newStart,
          end: newStart + duration
        });
      } else if (dragAction.type === 'trim-left') {
        const newStart = Math.max(0, Math.min(dragAction.initialEnd - 0.2, dragAction.initialStart + deltaTime));
        const deltaStart = newStart - dragAction.initialStart;
        
        onUpdateClipProps(clip.id, {
          start: newStart,
          trimStart: Math.max(0, clip.trimStart + deltaStart)
        });
      } else if (dragAction.type === 'trim-right') {
        const newEnd = Math.max(dragAction.initialStart + 0.2, dragAction.initialEnd + deltaTime);
        onUpdateClipProps(clip.id, { end: newEnd });
      }
    };

    const handleMouseUp = () => {
      setDragAction(null);
      setIsScrubbing(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragAction, isScrubbing, pixelsPerSecond, clips]);

  // Keyboard shortcut for deleting clips
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedClipId && (e.key === 'Delete' || e.key === 'Backspace')) {
        if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
          return;
        }
        onDeleteClip(selectedClipId);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedClipId, onDeleteClip]);

  // Generate ruler tick layout marks
  const renderRulerTicks = () => {
    const ticks = [];
    const interval = pixelsPerSecond < 10 ? 10 : 5;
    for (let i = 0; i <= timelineDuration; i += interval) {
      ticks.push(
        <div
          key={i}
          className="absolute scroll-none text-[9px] font-mono text-gray-600 flex flex-col items-center"
          style={{ left: `${i * pixelsPerSecond}px` }}
        >
          <div className="w-px h-2 bg-[#2A2A2A]"></div>
          <span className="mt-1">{i}s</span>
        </div>
      );
    }
    return ticks;
  };

  return (
    <div className="flex flex-col bg-elegant-panel border border-elegant-border rounded-md overflow-hidden shadow-2xl h-full font-sans">
      {/* Control Actions Header Bar */}
      <div className="h-10 px-4 bg-elegant-panel border-b border-elegant-border flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex space-x-1">
            <button
              onClick={onSplitClipAtPlayhead}
              disabled={!selectedClipId}
              className={`p-1.5 rounded transition font-medium ${
                selectedClipId
                  ? 'text-[#6366f1] bg-[#6366f1]/10 hover:bg-[#6366f1]/20'
                  : 'text-gray-600 cursor-not-allowed'
              }`}
              title="Split selected track clip at active playhead tick"
            >
              <Scissors className="w-3.5 h-3.5" />
            </button>
            {selectedClipId && (
              <button
                onClick={() => onDeleteClip(selectedClipId)}
                className="p-1.5 text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 rounded transition"
                title="Delete active track clip"
              >
                <Trash className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <div className="h-4 w-px bg-elegant-border"></div>
          <span className="text-[11px] text-gray-400 font-medium hidden sm:inline">Timeline Multi-Track Toolbar</span>
        </div>

        {/* Zoom controls & time readout */}
        <div className="flex items-center space-x-6">
          <div className="text-xs font-mono text-gray-400">
            {currentTime.toFixed(2)}s / {timelineDuration}s
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-[10px] text-gray-500">Zoom</span>
            <div className="flex bg-elegant-darker border border-elegant-border rounded-md p-0.5">
              <button
                onClick={zoomOut}
                className="p-1 hover:bg-[#1E1E1E] text-gray-400 hover:text-white rounded transition"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={zoomIn}
                className="p-1 hover:bg-[#1E1E1E] text-gray-400 hover:text-white rounded transition"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Timeline scroll container */}
      <div className="flex-1 overflow-auto flex min-h-0 select-none relative scrollbar-thin">
        {/* Track Heads Side Panel */}
        <div className="w-36 bg-elegant-panel shrink-0 border-r border-[#2A2A2A] h-full flex flex-col pt-6 z-15 sticky left-0">
          {tracksList.map(track => (
            <div
              key={track.id}
              className="h-14 flex flex-col justify-center px-3 border-b border-elegant-border text-left shrink-0"
            >
              <span className="text-[10px] text-gray-400 font-semibold uppercase">{track.name.split(' (')[0]}</span>
              <span className="text-[8px] text-gray-600 font-mono">{track.name.includes('(') ? track.name.split('(')[1].replace(')', '') : track.type}</span>
            </div>
          ))}
        </div>

        {/* Timeline body (Ruler + Lanes) */}
        <div
          ref={timelineRulerRef}
          className="flex-1 flex flex-col relative h-full bg-elegant-darker"
          style={{ width: `${totalWidth}px`, minWidth: '100%' }}
        >
          {/* Timeline Time Ruler */}
          <div
            onMouseDown={handleRulerMouseDown}
            className="h-6 border-b border-[#222] bg-[#121212] flex items-end px-2 select-none cursor-col-resize shrink-0 relative"
          >
            {renderRulerTicks()}
          </div>

          {/* Track Lanes */}
          <div className="flex-1 flex flex-col relative">
            {tracksList.map((track) => {
              const trackClips = clips.filter(c => c.trackId === track.id);
              
              return (
                <div
                  key={track.id}
                  className={`h-14 border-b border-[#1A1A1A] relative flex items-center shrink-0 ${track.color}`}
                >
                  {trackClips.map((clip) => {
                    const clipWidth = (clip.end - clip.start) * pixelsPerSecond;
                    const clipLeft = clip.start * pixelsPerSecond;
                    const isSelected = clip.id === selectedClipId;

                    return (
                      <div
                        key={clip.id}
                        onMouseDown={(e) => handleClipMouseDown(e, clip, 'move')}
                        className={`absolute h-10 rounded-md border flex items-center justify-between overflow-hidden shadow-md cursor-grab active:cursor-grabbing transition-shadow group ${
                          isSelected
                            ? 'bg-[#6366f1]/40 border-[#6366f1] ring-1 ring-[#6366f1]'
                            : clip.type === 'video'
                            ? 'bg-indigo-900/40 border-indigo-400/50 text-[#cfd3ff] hover:bg-indigo-900/50'
                            : clip.type === 'audio'
                            ? 'bg-green-900/20 border-green-500/30 text-[#d1fcd1] hover:bg-green-900/30'
                            : clip.type === 'text'
                            ? 'bg-yellow-600/20 border-yellow-500/30 text-[#fefcd1] hover:bg-yellow-600/30'
                            : 'bg-purple-600/20 border-purple-500/30 text-[#fbd1fc] hover:bg-purple-600/30'
                        }`}
                        style={{
                          left: `${clipLeft}px`,
                          width: `${clipWidth}px`,
                        }}
                      >
                        {/* Trim HANDLE: Left */}
                        <div
                          onMouseDown={(e) => handleClipMouseDown(e, clip, 'trim-left')}
                          className="w-1.5 h-full bg-black/40 hover:bg-white/10 cursor-ew-resize transition-colors opacity-60 flex items-center justify-center text-[8px] select-none text-gray-500"
                          title="Drag to trim clip start"
                        >
                          ⋮
                        </div>

                        {/* Title and duration labels */}
                        <div className="flex-1 px-1.5 flex flex-col justify-center min-w-0 pointer-events-none select-none">
                          <span className="text-[9px] font-semibold truncate leading-tight">
                            {clip.name}
                          </span>
                          <span className="text-[7.5px] font-mono opacity-60 mt-0.5">
                            {((clip.end - clip.start)).toFixed(1)}s (Offset: {clip.trimStart.toFixed(1)}s)
                          </span>
                        </div>

                        {/* Trim HANDLE: Right */}
                        <div
                          onMouseDown={(e) => handleClipMouseDown(e, clip, 'trim-right')}
                          className="w-1.5 h-full bg-black/40 hover:bg-white/10 cursor-ew-resize transition-colors opacity-60 flex items-center justify-center text-[8px] select-none text-gray-500"
                          title="Drag to trim clip end"
                        >
                          ⋮
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* Scrolling PLAYHEAD LINE Indicators */}
          <div
            className="absolute top-0 bottom-0 w-[2px] bg-[#6366f1] pointer-events-none z-20"
            style={{ left: `${currentTime * pixelsPerSecond}px` }}
          >
            {/* Top Indicator cap triangle (CineForge exact timeline look) */}
            <div className="absolute top-0 -left-[5px] w-3 h-3 bg-[#6366f1] rounded-b"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
