export interface CountdownEvent {
  id: string;
  title: string;
  subtitle?: string;
  date: string;
  color: string;
  emoji?: string;
  eventType?: string; // Comeback, Album Release, Concert, etc.
  artistPreset?: string; // BTS, IVE, etc.
  customArtistName?: string; // For custom artist (PRO only)
  customEventName?: string; // For custom event (PRO only)
}

export interface UserSettings {
  isPro: boolean;
  unlockedThemes: string[];
  showSeconds: boolean;
  lockScreenWidget: boolean;
}

export type WidgetSize = 'small' | 'medium' | 'large';

export const EVENT_TYPE_PRESETS = [
  { id: 'comeback', label: 'Comeback', icon: 'musical-notes' },
  { id: 'album', label: 'Album Release', icon: 'gift' },
  { id: 'concert', label: 'Concert', icon: 'mic' },
  { id: 'fanmeeting', label: 'Fanmeeting', icon: 'heart' },
  { id: 'debut', label: 'Debut Anniversary', icon: 'cake' },
  { id: 'discharge', label: 'Military Discharge', icon: 'star' },
  { id: 'birthday', label: 'Birthday', icon: 'balloon' },
];

export const ARTIST_PRESETS = [
  {
    id: 'bts',
    name: 'BTS',
    color: '#7B61FF', // 보라 계열이지만 대비 강화
    emoji: 'heart',
  },
  {
    id: 'ive',
    name: 'IVE',
    color: '#FF6B9D',
    emoji: 'rose',
  },
  {
    id: 'newjeans',
    name: 'NewJeans',
    color: '#4DA3FF',
    emoji: 'happy',
  },
  {
    id: 'seventeen',
    name: 'SEVENTEEN',
    color: '#FF4D8D',
    emoji: 'diamond',
  },
];


export const PRESET_COLORS = [
  '#C44DFF', // Purple (메인, 위젯에서 안정적)
  '#FF6B9D', // Pink
  '#7B61FF', // Indigo (기존 C9B7FF 보완)
  '#4DA3FF', // Blue
  '#FF4D8D', // Hot Pink
  '#FFC83D', // Yellow (너무 연하지 않게)
  '#2ED9B0', // Mint
  '#FF5A3D', // Orange
  '#3D7CFF', // Strong Blue
  '#FFD700', // Gold
];

export const CUSTOM_ICONS = [
  'star',
  'heart',
  'trophy',
  'gift',
  'calendar',
  'musical-notes',
  'mic',
  'happy',
  'sparkles',
  'flame',
  'diamond',
  'rose',
  'balloon',
  'earth',
  'rocket',
];