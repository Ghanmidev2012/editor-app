import { VideoClip } from '../types';
import { Sliders, Clock, Sparkles, Volume2, Type, Trash2, ArrowRightLeft } from 'lucide-react';

interface PropertiesPanelProps {
  selectedClip: VideoClip | null;
  onUpdateClipProps: (clipId: string, updatedProps: Partial<VideoClip>) => void;
  onDeleteClip: (clipId: string) => void;
}

export default function PropertiesPanel({ selectedClip, onUpdateClipProps, onDeleteClip }: PropertiesPanelProps) {
  if (!selectedClip) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-elegant-panel border border-elegant-border rounded-md">
        <Sliders className="w-8 h-8 text-gray-700 mb-2 animate-pulse" />
        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-widest font-sans">No Clip Selected</h4>
        <p className="text-[10px] text-gray-500 max-w-xs mt-1 leading-relaxed">
          Click on any track clip in the timeline below to customize its visual effects, volume levels, speed multipliers, and overlays.
        </p>
      </div>
    );
  }

  const isVideo = selectedClip.type === 'video';
  const isAudio = selectedClip.type === 'audio';
  const isText = selectedClip.type === 'text';
  const isFilter = selectedClip.type === 'filter';

  return (
    <div className="h-full flex flex-col bg-elegant-panel border border-elegant-border rounded-md overflow-hidden shadow-xl font-sans">
      {/* Header */}
      <div className="p-3 bg-elegant-panel border-b border-elegant-border shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-[#6366f1]" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300">Inspector</h3>
        </div>
        <button
          onClick={() => onDeleteClip(selectedClip.id)}
          className="p-1 px-2 border border-rose-500/30 hover:border-rose-500/60 bg-rose-500/5 hover:bg-rose-500/15 text-rose-400 rounded-md text-[10px] flex items-center gap-1 transition-all font-semibold"
          title="Delete selected clip"
        >
          <Trash2 className="w-3" />
          <span>Remove</span>
        </button>
      </div>

      {/* Editor Scroller */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin text-xs text-gray-300 bg-elegant-darker/20">
        {/* Clip Identity Section */}
        <div className="space-y-1.5">
          <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Clip Label</label>
          <input
            type="text"
            value={selectedClip.name}
            onChange={(e) => onUpdateClipProps(selectedClip.id, { name: e.target.value })}
            className="w-full bg-elegant-item border border-[#333] hover:border-gray-700 focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1]/20 rounded-md p-2 text-[11px] outline-none text-white transition-all"
          />
        </div>

        {/* Clip Timing Settings */}
        <div className="border-t border-elegant-border pt-3 space-y-2">
          <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-bold uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5 text-gray-600" />
            <span>Timeline Position</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[9px] text-gray-505 font-semibold mb-1 block">Start (s)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={Number(selectedClip.start.toFixed(2))}
                onChange={(e) => onUpdateClipProps(selectedClip.id, { start: Math.max(0, parseFloat(e.target.value) || 0) })}
                className="w-full bg-elegant-item border border-[#333] rounded-md p-1.5 text-[11px] font-mono outline-none focus:border-[#6366f1] text-white"
              />
            </div>
            <div>
              <label className="text-[9px] text-gray-500 font-semibold mb-1 block">Cut Length (s)</label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                max={selectedClip.duration}
                value={Number((selectedClip.end - selectedClip.start).toFixed(2))}
                onChange={(e) => {
                  const chunkLen = Math.max(0.1, parseFloat(e.target.value) || 0.1);
                  onUpdateClipProps(selectedClip.id, { end: selectedClip.start + chunkLen });
                }}
                className="w-full bg-elegant-item border border-[#333] rounded-md p-1.5 text-[11px] font-mono outline-none focus:border-[#6366f1] text-white"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[9px] text-gray-500 font-semibold mb-1 block">Source Offset (s)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max={selectedClip.duration - 0.1}
                value={Number(selectedClip.trimStart.toFixed(2))}
                onChange={(e) => onUpdateClipProps(selectedClip.id, { trimStart: Math.max(0, parseFloat(e.target.value) || 0) })}
                className="w-full bg-elegant-item border border-[#333] rounded-md p-1.5 text-[11px] font-mono outline-none focus:border-[#6366f1] text-white"
              />
            </div>
            <div className="flex flex-col justify-end">
              <span className="text-[9px] text-gray-500 block mb-1">Source Size</span>
              <div className="text-[10px] font-mono p-1.5 border border-[#333] bg-elegant-darker rounded-md text-gray-500 text-center">
                {selectedClip.duration}s
              </div>
            </div>
          </div>
        </div>

        {/* Audio Volume Controls */}
        {(isVideo || isAudio) && (
          <div className="border-t border-elegant-border pt-3 space-y-2">
            <div className="flex justify-between items-center bg-black/25">
              <div className="flex items-center gap-1 text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                <Volume2 className="w-3.5 h-3.5 text-gray-600" />
                <span>Audio settings</span>
              </div>
              <span className="text-[10px] font-mono text-indigo-400 font-medium">{(selectedClip.volume ?? 1) * 100}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={selectedClip.volume ?? 1}
              onChange={(e) => onUpdateClipProps(selectedClip.id, { volume: parseFloat(e.target.value) })}
              className="w-full h-1 bg-elegant-item rounded-lg appearance-none cursor-pointer accent-[#6366f1]"
            />
          </div>
        )}

        {/* Track Speed Modifier */}
        {(isVideo || isAudio) && (
          <div className="border-t border-elegant-border pt-3 space-y-2">
            <div className="flex items-center gap-1 text-[10px] text-gray-500 font-bold uppercase tracking-wider">
              <ArrowRightLeft className="w-3.5 h-3.5 text-gray-600" />
              <span>Playback Rate</span>
            </div>
            <div className="grid grid-cols-4 gap-1">
              {[0.5, 1.0, 1.5, 2.0].map((rate) => (
                <button
                  key={rate}
                  onClick={() => onUpdateClipProps(selectedClip.id, { speed: rate })}
                  className={`py-1 rounded-md text-[10px] font-mono border transition-all ${
                    (selectedClip.speed ?? 1) === rate
                      ? 'bg-[#6366f1] text-white border-[#6366f1]'
                      : 'bg-elegant-item hover:bg-[#252525] text-gray-400 border-[#333]'
                  }`}
                >
                  {rate}x
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Video Filters LUTs dropdown */}
        {(isVideo || isFilter) && (
          <div className="border-t border-elegant-border pt-3 space-y-2">
            <div className="flex items-center gap-1 text-[10px] text-gray-500 font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-gray-600" />
              <span>Color Correction</span>
            </div>
            <select
              value={selectedClip.colorFilter ?? 'none'}
              onChange={(e) => onUpdateClipProps(selectedClip.id, { colorFilter: e.target.value })}
              className="w-full bg-elegant-item border border-[#333] rounded-md p-2 text-[11px] outline-none text-white transition focus:border-[#6366f1]"
            >
              <option value="none">Normal (Standard Space)</option>
              <option value="grayscale">Noir Grayscale</option>
              <option value="sepia">Warm Vintage Sepia</option>
              <option value="warm">Decline Sunset Warm</option>
              <option value="cool">Teal Atlantic Cool</option>
              <option value="vintage">Historic Film grain (Vintage)</option>
              <option value="cyberpunk">Cyberpunk Acid Magenta</option>
            </select>
          </div>
        )}

        {/* Overlay typography contents */}
        {isText && (
          <div className="border-t border-elegant-border pt-3 space-y-3">
            <div className="flex items-center gap-1 text-[10px] text-gray-500 font-bold uppercase tracking-wider">
              <Type className="w-3.5 h-3.5 text-gray-600" />
              <span>Typography Styling</span>
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] text-gray-500 block">Overlay Text</label>
              <textarea
                rows={2}
                value={selectedClip.textValue ?? 'Custom Text'}
                onChange={(e) => onUpdateClipProps(selectedClip.id, { textValue: e.target.value })}
                className="w-full bg-elegant-item border border-[#333] rounded-md p-2 text-[11px] outline-none text-white focus:border-[#6366f1]"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[9px] text-gray-500 block mb-1">Text Color</label>
                <div className="flex gap-1.5 items-center">
                  <input
                    type="color"
                    value={selectedClip.textStyle?.color ?? '#ffffff'}
                    onChange={(e) => {
                      const style = selectedClip.textStyle || { fontSize: 24, color: '#ffffff', position: 'middle', fontStyle: 'sans' };
                      onUpdateClipProps(selectedClip.id, { textStyle: { ...style, color: e.target.value } });
                    }}
                    className="w-7 h-7 bg-transparent border border-[#333] cursor-pointer rounded-md"
                  />
                  <span className="text-[10px] font-mono text-gray-400">{selectedClip.textStyle?.color ?? '#ffffff'}</span>
                </div>
              </div>
              
              <div>
                <label className="text-[9px] text-gray-500 block mb-1">Font Size (px)</label>
                <input
                  type="number"
                  min="10"
                  max="120"
                  value={selectedClip.textStyle?.fontSize ?? 28}
                  onChange={(e) => {
                    const style = selectedClip.textStyle || { fontSize: 24, color: '#ffffff', position: 'middle', fontStyle: 'sans' };
                    onUpdateClipProps(selectedClip.id, { textStyle: { ...style, fontSize: parseInt(e.target.value) || 24 } });
                  }}
                  className="w-full bg-elegant-item border border-[#333] rounded-md p-1.5 text-[11px] font-mono outline-none focus:border-[#6366f1] text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[9px] text-gray-500 block mb-1">Position Layout</label>
                <select
                  value={selectedClip.textStyle?.position ?? 'middle'}
                  onChange={(e) => {
                    const style = selectedClip.textStyle || { fontSize: 24, color: '#ffffff', position: 'middle', fontStyle: 'sans' };
                    onUpdateClipProps(selectedClip.id, { textStyle: { ...style, position: e.target.value as any } });
                  }}
                  className="w-full bg-elegant-item border border-[#333] rounded-md p-1.5 text-[11px] outline-none text-white focus:border-[#6366f1]"
                >
                  <option value="top">Top Third</option>
                  <option value="middle">Center Screen</option>
                  <option value="bottom">Bottom Third</option>
                </select>
              </div>

              <div>
                <label className="text-[9px] text-gray-500 block mb-1">Font Style</label>
                <select
                  value={selectedClip.textStyle?.fontStyle ?? 'sans'}
                  onChange={(e) => {
                    const style = selectedClip.textStyle || { fontSize: 24, color: '#ffffff', position: 'middle', fontStyle: 'sans' };
                    onUpdateClipProps(selectedClip.id, { textStyle: { ...style, fontStyle: e.target.value as any } });
                  }}
                  className="w-full bg-elegant-item border border-[#333] rounded-md p-1.5 text-[11px] outline-none text-white focus:border-[#6366f1]"
                >
                  <option value="sans">Inter Sans</option>
                  <option value="display">Outfit Bold</option>
                  <option value="mono">JetBrains Mono</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
