export type MediaType = 'video' | 'audio' | 'text' | 'filter';

export interface VideoClip {
  id: string;
  name: string;
  type: MediaType;
  // Start and end positions of the clip inside the overall timeline (in seconds)
  start: number;
  end: number;
  // Total duration of the original asset source (in seconds)
  duration: number;
  // Starting offset of the source media (for trimming the beginning, in seconds)
  trimStart: number;
  // For procedural clips or assets
  sourceId: string;
  // Layer or track index
  trackId: number;
  
  // Property properties
  volume?: number; // range 0 to 1
  speed?: number; // playback rate multiplier
  colorFilter?: string; // none, grayscale, sepia, warm, cool, vintage, cyberpunk
  textValue?: string; // used for overlay text clips
  textStyle?: {
    fontSize: number;
    color: string;
    position: 'top' | 'middle' | 'bottom';
    fontStyle: 'sans' | 'display' | 'mono';
  };
  isImage?: boolean;
}

export interface MediaAsset {
  id: string;
  name: string;
  type: MediaType;
  duration: number;
  color: string;
  thumbnailEmoji: string;
  isImage?: boolean;
}

export interface PlaybackState {
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  playbackRate: number;
  isMuted: boolean;
}

export interface RenderState {
  isRendering: boolean;
  progress: number;
  renderedBlobUrl: string | null;
}
