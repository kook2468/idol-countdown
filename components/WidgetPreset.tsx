import { Cake, CalendarHeart, Crown, Gift, Headphones, Heart, Mic, Music, PartyPopper, Sparkles, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { ARTIST_PRESETS, CountdownEvent, WidgetSize } from './types';

interface WidgetPreviewProps {
  event: CountdownEvent;
  size: WidgetSize;
  nextEvent?: CountdownEvent;
  showSeconds?: boolean;
}

const ICON_MAP: Record<string, any> = {
  Music,
  Mic,
  Gift,
  Cake,
  PartyPopper,
  Crown,
  CalendarHeart,
  Heart,
  Star,
  Headphones,
  Sparkles,
};

export function WidgetPreview({ event, size, nextEvent, showSeconds = false }: WidgetPreviewProps) {
  const calculateTimeLeft = () => {
    const now = new Date();
    const eventDate = new Date(event.date);
    const diffTime = eventDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const hours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffTime % (1000 * 60)) / 1000);
    
    return { days: diffDays, hours, minutes, seconds };
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).replace(/\. /g, '.').replace(/\.$/, '');
  };

  const timeLeft = calculateTimeLeft();
  const IconComponent = ICON_MAP[event.emoji || 'Music'] || Music;

  // Get artist name from event
  const getArtistName = () => {
    if (event.artistPreset === 'custom' && event.customArtistName) {
      return event.customArtistName;
    }
    const artist = ARTIST_PRESETS.find(a => a.id === event.artistPreset);
    return artist?.name || 'Artist';
  };

  const artistName = getArtistName();

  // Small Widget
  if (size === 'small') {
    return (
      <motion.div
        className="rounded-3xl p-4 shadow-lg relative overflow-hidden"
        style={{
          width: '155px',
          height: '155px',
          background: `linear-gradient(135deg, ${event.color}30, ${event.color}15)`,
          border: `2px solid ${event.color}30`,
        }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-5xl font-semibold tracking-tight" style={{ color: event.color }}>
            D-{timeLeft.days}
          </div>
        </div>
        
        {/* Small icon badge with artist name */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-white/90">
          <IconComponent className="size-3" style={{ color: event.color }} />
          <span className="text-[10px] font-medium" style={{ color: event.color }}>
            {artistName}
          </span>
        </div>
      </motion.div>
    );
  }

  // Medium Widget
  if (size === 'medium') {
    return (
      <motion.div
        className="rounded-3xl p-5 shadow-lg relative overflow-hidden"
        style={{
          width: '330px',
          height: '155px',
          background: `linear-gradient(135deg, ${event.color}30, ${event.color}15)`,
          border: `2px solid ${event.color}30`,
        }}
      >
        <div className="flex flex-col h-full">
          {/* Event name with artist */}
          <div className="flex items-center gap-2 mb-2">
            <div 
              className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${event.color}40` }}
            >
              <IconComponent className="size-5" style={{ color: event.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold truncate text-gray-800">
                {event.title}
              </h3>
            </div>
          </div>

          {/* D-Day */}
          <div className="flex-1 flex items-center justify-center">
            <div className="text-5xl font-semibold tracking-tight" style={{ color: event.color }}>
              D-{timeLeft.days}
            </div>
          </div>

          {/* Date */}
          <div className="text-center text-sm text-gray-600 font-medium">
            {formatDate(event.date)}
          </div>
        </div>
      </motion.div>
    );
  }

  // Large Widget
  return (
    <motion.div
      className="rounded-3xl p-5 shadow-lg relative overflow-hidden"
      style={{
        width: '330px',
        height: '330px',
        background: `linear-gradient(135deg, ${event.color}30, ${event.color}15)`,
        border: `2px solid ${event.color}30`,
      }}
    >
      <div className="flex flex-col h-full">
        {/* Event name with artist */}
        <div className="flex items-center gap-3 mb-4">
          <div 
            className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${event.color}40` }}
          >
            <IconComponent className="size-6" style={{ color: event.color }} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold truncate text-gray-800">
              {event.title}
            </h3>
          </div>
        </div>

        {/* D-Day */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="text-6xl font-semibold mb-3 tracking-tight" style={{ color: event.color }}>
            D-{timeLeft.days}
          </div>

          {/* Time countdown (hours:minutes:seconds) */}
          {showSeconds && (
            <div className="flex items-center gap-2 text-2xl font-mono text-gray-700 font-medium">
              <span>{String(timeLeft.hours).padStart(2, '0')}</span>
              <span className="text-gray-400">:</span>
              <span>{String(timeLeft.minutes).padStart(2, '0')}</span>
              <span className="text-gray-400">:</span>
              <span>{String(timeLeft.seconds).padStart(2, '0')}</span>
            </div>
          )}
        </div>

        {/* Next Event */}
        {nextEvent && (
          <div 
            className="mt-4 p-3 rounded-2xl"
            style={{ backgroundColor: `${event.color}20` }}
          >
            <div className="text-xs text-gray-500 mb-1 font-medium">Next Event</div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 truncate flex-1">
                {nextEvent.title}
              </span>
              <span className="text-sm font-semibold ml-2" style={{ color: event.color }}>
                D-{Math.ceil((new Date(nextEvent.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
              </span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}