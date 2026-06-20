import { useEffect, useRef, useState } from 'react';
import { VideoClip, PlaybackState, RenderState } from '../types';
import { drawNeonGrid, drawCosmicNebula, drawOceanSunset, drawRetroTech, applyColorFilter } from '../utils/proceduralGens';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Download, Sparkles, Loader2, PlayCircle, Eye } from 'lucide-react';

interface CompositorProps {
  clips: VideoClip[];
  currentTime: number;
  isMuted: boolean;
  isPlaying: boolean;
  playbackRate: number;
  onSetCurrentTime: (time: number) => void;
  onPlayPause: (isPlaying: boolean) => void;
  timelineDuration: number;
}

function drawFitMedia(
  ctx: CanvasRenderingContext2D,
  element: HTMLImageElement | HTMLVideoElement,
  width: number,
  height: number
) {
  let isReady = false;
  let intrinsicWidth = 0;
  let intrinsicHeight = 0;

  if (element instanceof HTMLImageElement) {
    isReady = element.complete && element.naturalWidth > 0;
    intrinsicWidth = element.naturalWidth;
    intrinsicHeight = element.naturalHeight;
  } else if (element instanceof HTMLVideoElement) {
    isReady = element.readyState >= 1 && element.videoWidth > 0;
    intrinsicWidth = element.videoWidth;
    intrinsicHeight = element.videoHeight;
  }

  if (!isReady) {
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = '#818cf8';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Preparing media...', width / 2, height / 2);
    ctx.textAlign = 'start';
    return;
  }

  const mediaRatio = intrinsicWidth / intrinsicHeight;
  const canvasRatio = width / height;
  let dWidth = width;
  let dHeight = height;
  let dx = 0;
  let dy = 0;

  if (mediaRatio > canvasRatio) {
    dWidth = height * mediaRatio;
    dx = (width - dWidth) / 2;
  } else {
    dHeight = width / mediaRatio;
    dy = (height - dHeight) / 2;
  }

  try {
    ctx.drawImage(element, dx, dy, dWidth, dHeight);
  } catch (e) {
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, width, height);
  }
}

export default function Compositor({
  clips,
  currentTime,
  isMuted,
  isPlaying,
  playbackRate,
  onSetCurrentTime,
  onPlayPause,
  timelineDuration
}: CompositorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  
  // Exporter compilation state
  const [renderState, setRenderState] = useState<RenderState>({
    isRendering: false,
    progress: 0,
    renderedBlobUrl: null
  });

  // Target cache of HTML Elements for local uploaded media files
  const mediaCacheRef = useRef<Map<string, HTMLImageElement | HTMLVideoElement | HTMLAudioElement>>(new Map());
  const [cacheUpdateTrigger, setCacheUpdateTrigger] = useState<number>(0);

  // Stop/manage playing cached videos when playback pauses or state updates
  useEffect(() => {
    const activeVideoClip = clips.find(c => c.type === 'video' && currentTime >= c.start && currentTime <= c.end);
    const activeVideoSourceId = activeVideoClip?.sourceId;

    mediaCacheRef.current.forEach((el, key) => {
      if (el instanceof HTMLVideoElement) {
        // Automatically pause background video clip streams that are not actively visible on track 0
        if (!isPlaying || key !== activeVideoSourceId) {
          try {
            el.pause();
          } catch (e) {}
        }
      }
    });
  }, [isPlaying, clips, currentTime]);

  // Clean-release all media elements from browser playback on component unmount
  useEffect(() => {
    return () => {
      mediaCacheRef.current.forEach((el) => {
        try {
          el.pause();
        } catch (e) {}
      });
      mediaCacheRef.current.clear();
    };
  }, []);

  // 1. Core Canvas Compositing Frame Tick
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High Density Pixels correction
    const width = 640;
    const height = 360;
    canvas.width = width;
    canvas.height = height;

    // Baseline deep background draw
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);

    // Filter track check (is there a global filter covering this current second?)
    const activeFilterClip = clips.find(c => c.type === 'filter' && currentTime >= c.start && currentTime <= c.end);
    const activeColorFilter = activeFilterClip ? activeFilterClip.colorFilter ?? 'none' : 'none';

    // Video Track search (Video Layer = track 0)
    const activeVideoClip = clips.find(c => c.type === 'video' && currentTime >= c.start && currentTime <= c.end);

    if (activeVideoClip) {
      // Seek time offset within the source asset length
      const seekRelative = (currentTime - activeVideoClip.start) * (activeVideoClip.speed ?? 1) + activeVideoClip.trimStart;
      
      const filterToApply = activeColorFilter !== 'none' ? activeColorFilter : (activeVideoClip.colorFilter ?? 'none');

      // Dispatch frames rendering
      if (activeVideoClip.sourceId === 'vid-neon-grid') {
        drawNeonGrid(ctx, width, height, seekRelative, filterToApply);
      } else if (activeVideoClip.sourceId === 'vid-cosmic-nebula') {
        drawCosmicNebula(ctx, width, height, seekRelative, filterToApply);
      } else if (activeVideoClip.sourceId === 'vid-ocean-sunset') {
        drawOceanSunset(ctx, width, height, seekRelative, filterToApply);
      } else if (activeVideoClip.sourceId === 'vid-retro-tech') {
        drawRetroTech(ctx, width, height, seekRelative, filterToApply);
      } else {
        // Render custom uploaded raw media files (videos & images)
        const isImage = activeVideoClip.isImage;
        const sourceUrl = activeVideoClip.sourceId;

        applyColorFilter(ctx, width, height, filterToApply, () => {
          if (isImage) {
            let img = mediaCacheRef.current.get(sourceUrl) as HTMLImageElement | undefined;
            if (!img) {
              img = new Image();
              img.src = sourceUrl;
              img.onload = () => {
                setCacheUpdateTrigger(prev => prev + 1);
              };
              mediaCacheRef.current.set(sourceUrl, img);
            }
            drawFitMedia(ctx, img, width, height);
          } else {
            let video = mediaCacheRef.current.get(sourceUrl) as HTMLVideoElement | undefined;
            if (!video) {
              video = document.createElement('video');
              video.src = sourceUrl;
              video.muted = true;
              video.playsInline = true;
              video.loop = true;
              video.preload = 'auto';
              video.onloadeddata = () => {
                setCacheUpdateTrigger(prev => prev + 1);
              };
              mediaCacheRef.current.set(sourceUrl, video);
            }

            // Lowered from >= 2 to >= 1 to start drawing instantly as soon as dimensions are ready, skipping black/blue flashes
            if (video.readyState >= 1) {
              const targetVideoTime = seekRelative % (activeVideoClip.duration || 10);
              const driftThreshold = isPlaying ? 0.4 : 0.05;
              if (Math.abs(video.currentTime - targetVideoTime) > driftThreshold) {
                video.currentTime = targetVideoTime;
              }

              // Synchronize video muted state and sound volume matching properties panel configuration
              video.muted = isMuted;
              video.volume = (activeVideoClip.volume ?? 0.8) * (isMuted ? 0 : 1);

              if (isPlaying && video.paused) {
                video.play().catch(() => {});
              } else if (!isPlaying && !video.paused) {
                video.pause();
              }

              drawFitMedia(ctx, video, width, height);
            } else {
              // Smooth, dark loader screen that matches workspace slate instead of flashing bright blue
              ctx.fillStyle = '#090d16';
              ctx.fillRect(0, 0, width, height);
              ctx.fillStyle = '#818cf8';
              ctx.font = '11px sans-serif';
              ctx.textAlign = 'center';
              ctx.fillText(`Loading Stream: ${activeVideoClip.name}...`, width / 2, height / 2);
              ctx.textAlign = 'start';
            }
          }
        });
      }
    } else {
      // Empty viewport template card
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, width, height);
      
      // Moving ambient grids as idle backdrop
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.04)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 30) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
      }
      for (let y = 0; y < height; y += 30) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
      }

      ctx.fillStyle = '#334155';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('[Timeline viewport - Empty frame sequence]', width / 2, height / 2);
      ctx.textAlign = 'start'; // restore
    }

    // Text Overlay Layer search (Text Track = track 2)
    const activeTextClips = clips.filter(c => c.type === 'text' && currentTime >= c.start && currentTime <= c.end);
    activeTextClips.forEach(textClip => {
      const textVal = textClip.textValue || 'Overlay text';
      const fontSize = textClip.textStyle?.fontSize ?? 26;
      const color = textClip.textStyle?.color ?? '#ffffff';
      const font = textClip.textStyle?.fontStyle ?? 'sans';
      const position = textClip.textStyle?.position ?? 'middle';

      ctx.save();
      // Configure Font family styles
      if (font === 'display') {
        ctx.font = `bold ${fontSize}px "Outfit", sans-serif`;
      } else if (font === 'mono') {
        ctx.font = `${fontSize}px "JetBrains Mono", monospace`;
      } else {
        ctx.font = `medium ${fontSize}px "Inter", sans-serif`;
      }

      ctx.fillStyle = color;
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowBlur = 6;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;

      let yPos = height / 2;
      if (position === 'top') {
        yPos = height * 0.22;
      } else if (position === 'bottom') {
        yPos = height * 0.82;
      }

      ctx.fillText(textVal, width / 2, yPos);
      ctx.restore();
    });

  }, [clips, currentTime, isPlaying, cacheUpdateTrigger]);

  // 2. Playback Audio synthesizer feedback (Web Audio OSC notes for preset virtual soundtracks)
  useEffect(() => {
    // Only engage synthetic audio if a virtual, procedural preset audio track is active on the timeline!
    const activeVirtualAudio = clips.find(
      c => c.type === 'audio' &&
           currentTime >= c.start &&
           currentTime <= c.end &&
           (c.sourceId === 'aud-synthwave' || c.sourceId === 'aud-ambient')
    );

    if (isPlaying && !isMuted && activeVirtualAudio) {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (!audioCtxRef.current) {
          audioCtxRef.current = new AudioContextClass();
        }
        
        const audioCtx = audioCtxRef.current;
        if (audioCtx.state === 'suspended') {
          audioCtx.resume();
        }

        if (!oscillatorRef.current) {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          
          // Smooth sine tones
          osc.type = 'triangle';
          
          oscillatorRef.current = osc;
          gainNodeRef.current = gain;
          osc.start();
        }

        if (oscillatorRef.current && gainNodeRef.current) {
          // Calculate dynamic frequency note based on currentTime coordinates and track selection
          const baseFreq = activeVirtualAudio.sourceId === 'aud-synthwave' ? 160 : 110; 
          const waveFreq = baseFreq + Math.sin(currentTime * 3) * 20;
          
          oscillatorRef.current.frequency.setValueAtTime(waveFreq, audioCtx.currentTime);
          
          const targetVol = (activeVirtualAudio.volume ?? 0.5) * 0.15;
          gainNodeRef.current.gain.setValueAtTime(targetVol, audioCtx.currentTime);
        }
      } catch (err) {
        console.warn("Web Audio API disabled or blocked in sandbox:", err);
      }
    } else {
      shutdownSynthesizer();
    }

    return () => {
      shutdownSynthesizer();
    };
  }, [isPlaying, isMuted, currentTime, clips]);

  // 2.2. Custom Audio Clips Playback & Sync
  useEffect(() => {
    // Find all custom audio tracks in the timeline
    const customAudioClips = clips.filter(
      c => c.type === 'audio' && c.sourceId !== 'aud-synthwave' && c.sourceId !== 'aud-ambient'
    );

    customAudioClips.forEach(clip => {
      // Check if this clip intersects with the current playhead
      const isUnderPlayhead = currentTime >= clip.start && currentTime <= clip.end;
      const cacheKey = `audio-${clip.id}`;

      let audioEl = mediaCacheRef.current.get(cacheKey) as HTMLAudioElement | undefined;

      if (isUnderPlayhead) {
        if (!audioEl) {
          audioEl = new Audio(clip.sourceId);
          mediaCacheRef.current.set(cacheKey, audioEl);
        }

        // Apply dynamic volume and muted configurations
        audioEl.muted = isMuted;
        audioEl.volume = (clip.volume ?? 0.8) * (isMuted ? 0 : 1);

        // Sync local playhead timing relative to current global currentTime
        const relativeTime = (currentTime - clip.start) * (clip.speed ?? 1) + (clip.trimStart ?? 0);
        const driftThreshold = isPlaying ? 0.4 : 0.05;
        if (Math.abs(audioEl.currentTime - relativeTime) > driftThreshold) {
          audioEl.currentTime = relativeTime;
        }

        // Play or Pause matching the global playback toggle status
        if (isPlaying && audioEl.paused) {
          audioEl.play().catch(e => console.warn('Custom track autoplay blocked or delayed:', e));
        } else if (!isPlaying && !audioEl.paused) {
          audioEl.pause();
        }
      } else {
        // If not active, but the element exists, make sure to pause it!
        if (audioEl) {
          try {
            audioEl.pause();
          } catch (e) {}
        }
      }
    });

    // Pause and clean up cached audio elements of clips that were deleted from the project
    mediaCacheRef.current.forEach((el, key) => {
      if (key.startsWith('audio-') && el instanceof HTMLAudioElement) {
        const clipId = key.substring(6); // remove 'audio-'
        if (!clips.some(c => c.id === clipId)) {
          try {
            el.pause();
          } catch (e) {}
          mediaCacheRef.current.delete(key);
        }
      }
    });
  }, [isPlaying, isMuted, currentTime, clips]);

  const shutdownSynthesizer = () => {
    if (oscillatorRef.current) {
      try {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
      } catch (e) {}
      oscillatorRef.current = null;
    }
    gainNodeRef.current = null;
  };

  // 3. Playback Clock Timer Interval
  useEffect(() => {
    let tickId: number;

    if (isPlaying && !renderState.isRendering) {
      const stepInterval = 33; // ~30 fps
      const actualRate = playbackRate;

      const runTick = () => {
        onSetCurrentTime(Math.min(timelineDuration, currentTime + (stepInterval / 1000) * actualRate));
        if (currentTime >= timelineDuration) {
          onPlayPause(false);
        }
      };

      const intervalId = setInterval(runTick, stepInterval);
      return () => clearInterval(intervalId);
    }
  }, [isPlaying, currentTime, playbackRate, timelineDuration, renderState.isRendering]);

  // Reset clock action
  const resetTimeline = () => {
    onPlayPause(false);
    onSetCurrentTime(0);
  };

  // 4. In-Browser Export compiler function
  const triggerExportRendering = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    onPlayPause(false);
    setRenderState({ isRendering: true, progress: 0, renderedBlobUrl: null });

    const exportFPS = 30;
    const step = 1 / exportFPS;
    let localTime = 0;
    const totalFrames = timelineDuration * exportFPS;

    // Set up canvas capture stream
    const chunks: Blob[] = [];
    const stream = canvas.captureStream(exportFPS);
    
    // Fallback: We'll record canvas frames into a real playable WebM movie!
    let mediaRecorder: MediaRecorder | null = null;
    try {
      mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' });
    } catch (e) {
      try {
        mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
      } catch (err) {
        console.warn("Fallback to basic MediaRecorder configuration", err);
        mediaRecorder = new MediaRecorder(stream);
      }
    }

    mediaRecorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) chunks.push(e.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const blobUrl = URL.createObjectURL(blob);
      setRenderState({
        isRendering: false,
        progress: 100,
        renderedBlobUrl: blobUrl
      });
    };

    mediaRecorder.start();

    // Render loop frame-by-frame
    const runRenderLoop = () => {
      if (localTime >= timelineDuration) {
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
          mediaRecorder.stop();
        }
        return;
      }

      onSetCurrentTime(localTime);
      localTime += step;

      const currentProgress = Math.round((localTime / timelineDuration) * 100);
      setRenderState(prev => ({ ...prev, progress: Math.min(99, currentProgress) }));

      // Request next canvas frame render step
      setTimeout(runRenderLoop, 40); // 40ms separation mimics render compiling
    };

    runRenderLoop();
  };

  return (
    <div className="h-full flex flex-col bg-elegant-panel border border-elegant-border rounded-md overflow-hidden shadow-xl font-sans">
      {/* Viewer Screen Frame */}
      <div className="flex-1 min-h-0 bg-elegant-canvas flex flex-col items-center justify-center p-4 relative group border border-elegant-border m-2 rounded-md">
        <div className="absolute top-4 left-4 flex space-x-4 items-center">
           <span className="text-[10px] text-gray-500 bg-black/50 px-2 py-1 rounded">Preview: 1080p</span>
           <span className="text-[10px] text-[#6366f1] font-mono font-semibold">00:01:24:12</span>
        </div>

        <canvas
          ref={canvasRef}
          className="aspect-video w-full max-w-xl rounded-md shadow-2xl bg-black border border-[#222]"
        />

        {/* Live Export Render Backdrop Overlay */}
        {renderState.isRendering && (
          <div className="absolute inset-0 bg-black/95 flex flex-col items-center justify-center p-6 backdrop-blur-sm z-30">
            <Loader2 className="w-8 h-8 text-[#6366f1] animate-spin mb-3" />
            <span className="text-sm font-semibold text-gray-200">Rendering Video Montage Composition</span>
            <div className="w-64 bg-[#222] h-1.5 rounded-full mt-3 overflow-hidden">
              <div 
                className="bg-[#6366f1] h-full transition-all duration-100 rounded-full"
                style={{ width: `${renderState.progress}%` }}
              ></div>
            </div>
            <span className="text-xs text-gray-500 mt-2 font-mono">{renderState.progress}% complete</span>
          </div>
        )}
      </div>

      {/* Control Buttons Panel */}
      <div className="px-3 py-2 bg-elegant-panel border-t border-elegant-border shrink-0 flex items-center justify-between text-xs font-sans">
        {/* Playback rate */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider font-mono bg-elegant-darker px-2.5 py-0.5 border border-[#333] rounded">
            PROGRAM MONITOR
          </span>
        </div>

        {/* Media controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={resetTimeline}
            className="p-1.5 bg-elegant-item text-gray-400 hover:text-white border border-[#333] rounded-md transition hover:bg-[#252525]"
            title="Rewind playhead"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          
          <button
            onClick={() => onPlayPause(!isPlaying)}
            className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shadow-lg transform active:scale-95 transition-all hover:scale-105"
            title={isPlaying ? "Pause stream" : "Play stream"}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
          </button>
        </div>

        {/* Exporter triggers */}
        <div className="flex items-center gap-2">
          {renderState.renderedBlobUrl ? (
            <a
              href={renderState.renderedBlobUrl}
              download="edited-montage-studio.webm"
              className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md font-medium transition shadow-sm"
              title="Download compiled video file"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Raw File</span>
            </a>
          ) : (
            <button
              onClick={triggerExportRendering}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#6366f1] hover:bg-indigo-500 text-white rounded-md font-semibold transition shadow-md shadow-indigo-600/10"
              title="Render canvas sequences frame-by-frame"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Render Montage</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
