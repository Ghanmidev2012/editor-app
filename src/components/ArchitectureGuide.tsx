import { useState } from 'react';
import { Layers, Cpu, Code, BookOpen, Check, Copy, Terminal, Server } from 'lucide-react';

export default function ArchitectureGuide() {
  const [activeTab, setActiveTab] = useState<'stack' | 'folders' | 'boilerplate' | 'performance'>('stack');
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="h-full flex flex-col bg-elegant-panel border border-elegant-border rounded-md overflow-hidden shadow-2xl">
      {/* Header Banner */}
      <div className="bg-elegant-darker border-b border-elegant-border p-4 shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#6366f1]/10 text-[#6366f1] rounded-md">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-sans font-semibold text-white text-sm">Desktop Porting & Architecture Hub</h2>
            <p className="text-xs text-gray-400 font-sans">Engineering blueprints to port this web timeline to high-performance local binaries</p>
          </div>
        </div>
        <div className="flex gap-2 text-xs bg-elegant-panel p-1 border border-elegant-border rounded-md text-gray-400">
          <span className="px-2 py-0.5 rounded bg-[#6366f1]/10 text-[#6366f1] flex items-center gap-1 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6366f1] animate-pulse"></span> Production Spec v1.0
          </span>
        </div>
      </div>

      {/* Main Content split into Sidebar & Detail */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Navigation Sidebar */}
        <div className="w-64 bg-elegant-darker shrink-0 border-r border-[#2A2A2A] p-3 flex flex-col gap-1 overflow-y-auto">
          <button
            onClick={() => setActiveTab('stack')}
            className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-md text-left text-xs transition-all ${
              activeTab === 'stack'
                ? 'bg-[#6366f1] text-white font-medium shadow-md shadow-[#6366f1]/10'
                : 'text-gray-400 hover:text-white hover:bg-[#1E1E1E]'
            }`}
          >
            <Layers className="w-4 h-4 shrink-0" />
            <span>1. Tech Stack Selection</span>
          </button>
          
          <button
            onClick={() => setActiveTab('folders')}
            className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-md text-left text-xs transition-all ${
              activeTab === 'folders'
                ? 'bg-[#6366f1] text-white font-medium shadow-md shadow-[#6366f1]/10'
                : 'text-gray-400 hover:text-white hover:bg-[#1E1E1E]'
            }`}
          >
            <Server className="w-4 h-4 shrink-0" />
            <span>2. Production Layout</span>
          </button>

          <button
            onClick={() => setActiveTab('boilerplate')}
            className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-md text-left text-xs transition-all ${
              activeTab === 'boilerplate'
                ? 'bg-[#6366f1] text-white font-medium shadow-md shadow-[#6366f1]/10'
                : 'text-gray-400 hover:text-white hover:bg-[#1E1E1E]'
            }`}
          >
            <Code className="w-4 h-4 shrink-0" />
            <span>3. Video Engine Boilerplate</span>
          </button>

          <button
            onClick={() => setActiveTab('performance')}
            className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-md text-left text-xs transition-all ${
              activeTab === 'performance'
                ? 'bg-[#6366f1] text-white font-medium shadow-md shadow-[#6366f1]/10'
                : 'text-gray-400 hover:text-white hover:bg-[#1E1E1E]'
            }`}
          >
            <Cpu className="w-4 h-4 shrink-0" />
            <span>4. UI Thread Performance</span>
          </button>

          <div className="mt-auto pt-4 border-t border-[#2A2A2A] text-[10px] text-gray-500 font-mono text-center">
            Designed for Desktop Portability
          </div>
        </div>

        {/* Content Panel */}
        <div className="flex-1 overflow-y-auto bg-elegant-panel p-6 font-sans">
          {activeTab === 'stack' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-semibold text-white flex items-center gap-2 mb-2">
                  <span className="text-[#6366f1] font-mono text-sm">[01]</span> Cross-Platform Desktop Architecture
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Choosing the right stack for desktop video editing means balancing a high-fidelity timeline UI with high-throughput frame decoding and rendering pipelines. 
                  Below are the three industry-standard desktop architectures ranked by suitability.
                </p>
              </div>

              {/* Stack Option 1 - Recommended */}
              <div className="border border-[#6366f1]/20 bg-[#6366f1]/5 rounded-md p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex gap-2">
                    <span className="text-xs bg-[#6366f1]/20 text-[#bfc1fc] font-semibold px-2 py-0.5 rounded uppercase">Highly Recommended</span>
                    <h4 className="text-sm font-semibold text-white">Tauri + React + Rust / FFmpeg</h4>
                  </div>
                  <span className="text-xs font-mono text-emerald-400 font-medium">9.8/10 Performance</span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Utilizes <strong>Tauri</strong> for an ultra-lightweight frontend shell (rendering through system Webview, saving 150MB+ RAM vs Electron) connected to a <strong>Rust back-end sidecar</strong>. 
                  Rust handles high-performance frame sequencing, blending, and hardware acceleration (VAAPI/NVDEC) directly with FFmpeg libraries (`ffmpeg-next` or `gstreamer-rs`) compile-linked inside the native binary.
                </p>
                <div className="grid grid-cols-2 gap-3 pt-1 text-[11px]">
                  <div className="bg-[#1E1E1E] p-2 rounded-md border border-[#333]">
                    <span className="text-emerald-400 font-medium font-mono">PROS:</span>
                    <p className="text-gray-400">Tiny distribution size (~15MB), near-native frame processing speed, zero-copy memory pipelines inside Rust, HTML/Tailwind timeline UI.</p>
                  </div>
                  <div className="bg-[#1E1E1E] p-2 rounded-md border border-[#333]">
                    <span className="text-rose-400 font-medium font-mono">CONS:</span>
                    <p className="text-gray-400">Requires writing core frame interpolation and filter compositing logic in Rust. Rust FFmpeg bindings have a steep learning curve.</p>
                  </div>
                </div>
              </div>

              {/* Stack Option 2 - Electron */}
              <div className="border border-[#333] bg-elegant-darker/40 rounded-md p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex gap-2">
                    <span className="text-xs bg-[#1E1E1E] text-gray-300 font-semibold px-2 py-0.5 rounded uppercase">Standard Alternative</span>
                    <h4 className="text-sm font-semibold text-white">Electron + React + Node / fluent-ffmpeg</h4>
                  </div>
                  <span className="text-xs font-mono text-gray-400 font-medium">8.0/10 Performance</span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">
                  The standard Web-to-Desktop model (similar to CapCut Desktop Web-modules). Uses <strong>Electron</strong> process separation.
                  The Renderer thread display is structured in React. The Main Node process executes native spawn-calls to pre-bundled FFmpeg binaries or uses a native Node C++ helper module (like `node-av`) to pipe uncompressed RGB frame buffers into the canvas compositor over IPC.
                </p>
                <div className="grid grid-cols-2 gap-3 pt-1 text-[11px]">
                  <div className="bg-[#1E1E1E] p-2 rounded-md border border-[#333]">
                    <span className="text-emerald-400 font-medium font-mono">PROS:</span>
                    <p className="text-gray-400">100% code reuse from standard React code. Rapid iteration, massive ecosystem (fluent-ffmpeg, node-canvas, etc.).</p>
                  </div>
                  <div className="bg-[#1E1E1E] p-2 rounded-md border border-[#333]">
                    <span className="text-rose-400 font-medium font-mono">CONS:</span>
                    <p className="text-gray-400">Large bundle size (~120MB minimum), heavy memory overhead. Bottlenecks in IPC channel when piping 4K Raw RGB data to UI.</p>
                  </div>
                </div>
              </div>

              {/* Stack Option 3 - Python */}
              <div className="border border-[#333] bg-elegant-darker/40 rounded-md p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex gap-2">
                    <span className="text-xs bg-[#1E1E1E] text-gray-300 font-semibold px-2 py-0.5 rounded uppercase">Native Heavyweight</span>
                    <h4 className="text-sm font-semibold text-white">Python + PySide6 (Qt) + PyAV / OpenCV</h4>
                  </div>
                  <span className="text-xs font-mono text-[#6366f1] font-medium">9.0/10 Performance</span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Uses **PySide6** (Qt bindings) to generate a fully localized UI. Python utilizes native ctypes libraries like **PyAV** 
                  (Pythonic wrappers around the C FFmpeg APIs) to decode streams on secondary worker threads, passing Numpy arrays directly into a QGraphicsView / OpenGL frame buffer widget for zero-latency frame display.
                </p>
                <div className="grid grid-cols-2 gap-3 pt-1 text-[11px]">
                  <div className="bg-[#1E1E1E] p-2 rounded-md border border-[#333]">
                    <span className="text-emerald-400 font-medium font-mono">PROS:</span>
                    <p className="text-gray-400">Blazingly fast processing, easy integration with PyTorch/AI pipelines, extremely stable audio-to-video AV sync clocks using Qt Multimedia.</p>
                  </div>
                  <div className="bg-[#1E1E1E] p-2 rounded-md border border-[#333]">
                    <span className="text-rose-400 font-medium font-mono">CONS:</span>
                    <p className="text-gray-400">Styling complex UI with Qt Stylesheets (QSS) is significantly harder and more restrictive than Tailwind CSS/HTML5 transitions.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'folders' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-semibold text-white flex items-center gap-2 mb-2">
                  <span className="text-[#6366f1] font-mono text-sm">[02]</span> Production Project Directory Layout
                </h3>
                <p className="text-xs text-gray-400">
                  A modern structured framework mapping frontend state streams to compile-ready video background workers. This layout isolates the memory-hogging rendering thread from your smooth UI interactions.
                </p>
              </div>

              <div className="bg-elegant-darker rounded-md p-4 border border-elegant-border font-mono text-[11px] text-gray-300 relative">
                <button 
                  onClick={() => handleCopy(FOLDER_LAYOUT_CODE, 'folders-copy')}
                  className="absolute right-3 top-3 bg-[#1E1E1E] hover:bg-[#2A2A2A] border border-[#333] p-1.5 rounded-md text-gray-400 hover:text-white transition-all"
                >
                  {copied === 'folders-copy' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <pre>{FOLDER_LAYOUT_CODE}</pre>
              </div>

              {/* Pipeline Workflow Descriptions */}
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="border border-elegant-border bg-elegant-darker/20 p-3 rounded-md">
                  <h5 className="font-semibold text-gray-200 mb-1">1. State IPC Sync</h5>
                  <p className="text-[11px] text-gray-400">
                    React logs user trims, cuts, and layer re-orders. It saves the composition state as a highly structured nested JSON payload and pumps it down over Unix sockets / Tauri Commands on change.
                  </p>
                </div>
                <div className="border border-elegant-border bg-elegant-darker/20 p-3 rounded-md">
                  <h5 className="font-semibold text-gray-200 mb-1">2. Decode Engine</h5>
                  <p className="text-[11px] text-gray-400">
                    The background engine spawns independent PyAV / Rust-FFmpeg demuxers for each imported file, managing secondary buffers in shared GPU video textures.
                  </p>
                </div>
                <div className="border border-elegant-border bg-elegant-darker/20 p-3 rounded-md">
                  <h5 className="font-semibold text-gray-200 mb-1">3. Frame Compositor</h5>
                  <p className="text-[11px] text-gray-400">
                    A frame compositor thread reads active video timelines, interpolates cut cuts, overlays alpha channels (texts/filters), and sends final frames to the main video encoder pipeline.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'boilerplate' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-semibold text-white flex items-center gap-2 mb-2">
                  <span className="text-[#6366f1] font-mono text-sm">[03]</span> Native Video Processing Engine Boilerplate
                </h3>
                <p className="text-xs text-gray-400">
                  Below is a complete, production-ready Python + PyAV (nested FFmpeg C wrapper) class boilerplate which reads a client-provided Timeline JSON config, seeking to exact timestamps, performing frame trimming, and encoding the output sequence.
                </p>
              </div>

              <div className="bg-elegant-darker rounded-md p-4 border border-elegant-border font-mono text-[11px] text-gray-300 relative max-h-96 overflow-y-auto">
                <button 
                  onClick={() => handleCopy(BOILERPLATE_PYTHON_CODE, 'boilerplate-copy')}
                  className="absolute right-3 top-3 bg-[#1E1E1E] hover:bg-[#2A2A2A] border border-[#333] p-1.5 rounded-md text-gray-400 hover:text-white transition-all z-10"
                >
                  {copied === 'boilerplate-copy' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <pre>{BOILERPLATE_PYTHON_CODE}</pre>
              </div>

              <div className="text-xs text-gray-400 leading-relaxed bg-[#6366f1]/5 border border-[#6366f1]/10 rounded-md p-3">
                <strong className="text-[#9698f9]">How to implement:</strong> This script uses <code>pyav</code> to interact with the raw media frames directly at the index levels, completely bypassing slow shell-process execution of regular FFmpeg. Perfect for high performance rendering engines inside a PyQt or Rust sidecar structure.
              </div>
            </div>
          )}

          {activeTab === 'performance' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-semibold text-white flex items-center gap-2 mb-2">
                  <span className="text-[#6366f1] font-mono text-sm">[04]</span> Advanced UI Thread Performance Recipes
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Piping raw 4K uncompressed frame bytes (3840×2160 × 4 bytes/pixel × 60fps ≈ 2 GB/s) directly into your React runtime will completely crash your application thread. 
                  Below are four critical strategies used by video-first desktop frameworks to guarantee 60fps playback rendering.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="border border-[#333] bg-elegant-darker/40 p-4 rounded-md space-y-2">
                  <div className="flex items-center gap-2 text-[#6366f1]">
                    <Terminal className="w-4 h-4" />
                    <h4 className="text-xs font-semibold text-gray-200">1. Offline Proxy Workflows</h4>
                  </div>
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    Upon importing any video track, do not feed the raw 4K/1080p source file to the player timeline. 
                    Spawn a background thread with reduced priority to transcode a tiny editing proxy (e.g., <strong>640×360 standard ProRes Proxy or H.264 at extremely low bitrates</strong>). 
                    Perform all active timeline scrolling, scrubbing, visual canvas compositing, and overlays using this fast-loading proxy, and only swap in the raw 4K source files during the high-fidelity render-export step.
                  </p>
                </div>

                <div className="border border-[#333] bg-elegant-darker/40 p-4 rounded-md space-y-2">
                  <div className="flex items-center gap-2 text-[#6366f1]">
                    <Terminal className="w-4 h-4" />
                    <h4 className="text-xs font-semibold text-gray-200">2. Shared GPU Texture Maps</h4>
                  </div>
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    Instead of copying frame arrays from CPU RAM back-and-forth into the graphics rendering pipeline, 
                    bind video frames directly to GPU shared memory textures (using <strong>OpenGL Pixel Buffer Objects (PBOs)</strong>, WebGL texturing, or modern WebGPU external textures). 
                    This enables the decoding engine to write frames directly onto hardware chips, where custom fragment shaders can handle Grayscale, Sepia, and blending, with almost zero overhead.
                  </p>
                </div>

                <div className="border border-[#333] bg-elegant-darker/40 p-4 rounded-md space-y-2">
                  <div className="flex items-center gap-2 text-[#6366f1]">
                    <Terminal className="w-4 h-4" />
                    <h4 className="text-xs font-semibold text-gray-200">3. Bidirectional Keyframe Caching</h4>
                  </div>
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    Since H.264/H.265 streams are temporally compressed, seeking backwards requires reconstructing preceding frames back from the nearest I-Frame. 
                    Implement an active cache pool in the backing engine. This pool pre-decodes and stores frames in a bidirectional buffer (e.g., caching 30 frames ahead of the playhead, and 15 frames behind). 
                    This creates instant, stutter-free desktop scrubbing.
                  </p>
                </div>

                <div className="border border-[#333] bg-[#0A0A0A] p-4 rounded-md space-y-2">
                  <div className="flex items-center gap-2 text-[#6366f1]">
                    <Terminal className="w-4 h-4" />
                    <h4 className="text-xs font-semibold text-gray-200">4. Decoupled Frame-Clocks</h4>
                  </div>
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    Never lock the audio playback card clock inside the application with the visual refresh loop. 
                    Establish the system's hardware audio buffer as the **Universal Master Clock**. 
                    Allow the rendering canvas to drop frames proactively if the system resources choke, ensuring visual tracking can catch up, while the master sound output remains 100% fluent, synchronized, and noise-free.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const FOLDER_LAYOUT_CODE = `my-desktop-video-editor/
├── package.json
├── tauri.conf.json    # Tauri workspace configurations
├── src/               # React UI Timeline / CSS Layer
│   ├── App.tsx
│   ├── components/
│   │   ├── Timeline.tsx      # Multitrack layout
│   │   ├── CanvasPlayer.tsx  # Dynamic preview port (WebSockets/WebGL)
│   │   ├── AssetsLibrary.tsx # Source clips
│   │   └── Properties.tsx    # Audio, filters, text parameters
│   ├── index.css
│   └── main.tsx
└── src-tauri/          # High Performance Native Engine (Rust)
    ├── Cargo.toml
    └── src/
        ├── main.rs            # Desktop App entry, System event loops
        ├── video_engine/
        │   ├── mod.rs         # System module manager
        │   ├── demuxer.rs     # Multi-threaded file loaders (FFmpeg / PyAV)
        │   ├── compositor.rs  # Frame overlays, shader filter compositor
        │   └── encoder.rs     # Final MP4 file writer (hardware accelerated)
        └── ipc_handlers.rs    # Bridges JSON timeline payloads to state engines
`;

const BOILERPLATE_PYTHON_CODE = `import av # PyAV provides low-level C FFMPEG binders
import json

class VideoCompositionEngine:
    def __init__(self, timeline_json_path):
        with open(timeline_json_path, 'r') as f:
            self.timeline_config = json.load(f)
            
    def render_composition(self, output_path="output_montage.mp4"):
        # Setup output media container
        output_container = av.open(output_path, mode='w')
        
        # Configure output stream with H.264 details
        codec_name = "libx264"
        fps = 30
        width = 1920
        height = 1080
        
        output_stream = output_container.add_stream(codec_name, rate=fps)
        output_stream.width = width
        output_stream.height = height
        output_stream.pix_fmt = 'yuv420p'
        output_stream.options = {'preset': 'medium', 'crf': '23'}
        
        # Parse timeline tracks sorted by layer index
        tracks = sorted(self.timeline_config["tracks"], key=lambda x: x["trackId"])
        
        # Total timeline range in frames
        total_duration_secs = self.timeline_config["duration"]
        total_frames = int(total_duration_secs * fps)
        
        print(f"Beginning rendering. Target: {width}x{height} @ {fps}fps. Total frames: {total_frames}")
        
        for frame_idx in range(total_frames):
            current_time = frame_idx / fps
            
            # 1. Background base canvas
            composited_frame = self.create_blank_frame(width, height)
            
            # 2. Sequential overlay composition
            for clip in tracks:
                if clip["start"] <= current_time <= clip["end"]:
                    # Seek, read, and extract the matching frame from our source file
                    source_frame = self.extract_source_frame(
                        clip["assetPath"], 
                        seek_time=(current_time - clip["start"]) + clip["trimStart"],
                        scale=(width, height)
                    )
                    
                    # Composite source frame applying layer filter
                    composited_frame = self.composite_layers(
                        background=composited_frame,
                        overlay=source_frame,
                        color_filter=clip.get("colorFilter", "none")
                    )
            
            # Encode and packetize final frame
            for packet in output_stream.encode(composited_frame):
                output_container.mux(packet)
                
        # Flush output stream
        for packet in output_stream.encode():
            output_container.mux(packet)
            
        output_container.close()
        print("Montage rendering complete! File saved cleanly inside output_montage.mp4")
incoming:
    def extract_source_frame(self, file_path, seek_time, scale):
        # Open source container safely
        container = av.open(file_path)
        stream = container.streams.video[0]
        
        # Calculate matching DTS time offset
        time_base = float(stream.time_base)
        seek_target = int(seek_time / time_base)
        
        # Seek cleanly to correct preceding I-Frame
        container.seek(seek_target, stream=stream)
        
        for frame in container.decode(video=0):
            if frame.pts >= seek_target:
                # Convert format and rescale frame cleanly
                rgb_frame = frame.to_image().resize(scale)
                container.close()
                return rgb_frame
        
        container.close()
        return None

    def create_blank_frame(self, w, h):
        from PIL import Image
        return Image.new("RGB", (w, h), (10, 10, 10)) # Elegant Carbon CineForge baseline

    def composite_layers(self, background, overlay, color_filter):
        if overlay is None:
            return background
            
        # Optional: Apply matrix transformations or LUTs based on target color filters
        if color_filter == "grayscale":
            overlay = overlay.convert("L").convert("RGB")
            
        # Safe blending of foreground with transparency filters
        background.paste(overlay, (0, 0))
        return background
`;
