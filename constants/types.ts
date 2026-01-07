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
  { id: 'comeback', label: 'Comeback', icon: 'Music', color: '#FF6B9D' },
  { id: 'album', label: 'Album Release', icon: 'Gift', color: '#C44DFF' },
  { id: 'concert', label: 'Concert', icon: 'Mic', color: '#4D9DFF' },
  { id: 'fanmeeting', label: 'Fanmeeting', icon: 'Heart', color: '#FFB3D9' },
  { id: 'debut', label: 'Debut Anniversary', icon: 'Cake', color: '#FFD84D' },
  { id: 'discharge', label: 'Military Discharge', icon: 'Star', color: '#FFD700' },
  { id: 'birthday', label: 'Birthday', icon: 'PartyPopper', color: '#FF6B4D' },
  { id: 'custom', label: 'Custom', icon: 'Sparkles', color: '#4DFFDF', isPro: true },
];

export const ARTIST_PRESETS = [
  { id: 'bts', name: 'BTS', color: '#C9B7FF' },
  { id: 'ive', name: 'IVE', color: '#FF6B9D' },
  { id: 'newjeans', name: 'NewJeans', color: '#A8D8FF' },
  { id: 'seventeen', name: 'SEVENTEEN', color: '#FFB8D1' },
  { id: 'custom', name: 'Custom', color: '#E0E0E0', isPro: true },
];