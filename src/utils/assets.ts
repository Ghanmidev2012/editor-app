import { MediaAsset } from '../types';

export const STATIC_ASSETS: MediaAsset[] = [
  {
    id: 'vid-neon-grid',
    name: 'Neon Grid (30s Retro Loop)',
    type: 'video',
    duration: 30,
    color: 'from-pink-500 to-indigo-500',
    thumbnailEmoji: '🔮'
  },
  {
    id: 'vid-cosmic-nebula',
    name: 'Cosmic Nebula (25s Space Fluid)',
    type: 'video',
    duration: 25,
    color: 'from-purple-600 to-rose-500',
    thumbnailEmoji: '🌌'
  },
  {
    id: 'vid-ocean-sunset',
    name: 'Ocean Sunset (40s Sea Horizon)',
    type: 'video',
    duration: 40,
    color: 'from-amber-400 to-rose-400',
    thumbnailEmoji: '🌅'
  },
  {
    id: 'vid-retro-tech',
    name: 'Retro Tech (45s Matrix Stream)',
    type: 'video',
    duration: 45,
    color: 'from-emerald-500 to-slate-900',
    thumbnailEmoji: '📟'
  },
  {
    id: 'aud-synthwave',
    name: 'Synthwave Beats 120BPM (Soundtrack)',
    type: 'audio',
    duration: 60,
    color: 'from-cyan-400 to-blue-600',
    thumbnailEmoji: '🎵'
  },
  {
    id: 'aud-ambient',
    name: 'Atmospheric Lo-Fi Pad (Soundtrack)',
    type: 'audio',
    duration: 90,
    color: 'from-teal-400 to-emerald-600',
    thumbnailEmoji: '🎶'
  },
  {
    id: 'txt-title',
    name: 'Centered Overlay Title',
    type: 'text',
    duration: 5,
    color: 'from-yellow-400 to-amber-500',
    thumbnailEmoji: '💬'
  },
  {
    id: 'txt-credits',
    name: 'Cinema End Credits Block',
    type: 'text',
    duration: 8,
    color: 'from-slate-400 to-slate-600',
    thumbnailEmoji: '📝'
  },
  {
    id: 'filt-cyberpunk',
    name: 'Neon Cyberpunk (Color LUT)',
    type: 'filter',
    duration: 10,
    color: 'from-fuchsia-500 to-purple-600',
    thumbnailEmoji: '🎨'
  },
  {
    id: 'filt-sepia',
    name: 'Vintage Sepia (Color LUT)',
    type: 'filter',
    duration: 10,
    color: 'from-yellow-700 to-yellow-900',
    thumbnailEmoji: '🎞️'
  }
];
