import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { CountdownEvent, WidgetSize } from '../constants/types';

interface WidgetPreviewProps {
  event: CountdownEvent;
  size: WidgetSize;
  showSeconds: boolean;
}

const ICON_MAP: Record<string, any> = {
  Music: 'musical-notes',
  Mic: 'mic',
  Gift: 'gift',
  Cake: 'cake',
  PartyPopper: 'happy',
  Crown: 'trophy',
  CalendarHeart: 'heart',
  Heart: 'heart',
  Star: 'star',
  Sparkles: 'sparkles',
  // 이모지가 직접 들어올 경우 대비
  '🎵': 'musical-notes',
  '🎤': 'mic',
  '🎁': 'gift',
  '🎂': 'cake',
  '🎉': 'happy',
  '👑': 'trophy',
  '💖': 'heart',
  '❤️': 'heart',
  '⭐': 'star',
  '🎧': 'headset',
  '✨': 'sparkles',
  '📅': 'calendar',
};

export function WidgetPreview({ event, size, showSeconds }: WidgetPreviewProps) {
  const calculateDaysLeft = (targetDate: string) => {
    const now = new Date();
    const target = new Date(targetDate);
    const diffTime = target.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysLeft = calculateDaysLeft(event.date);
  const iconName = ICON_MAP[event.emoji || 'Music'] || 'star';

  const containerStyle =
    size === 'small'
      ? styles.widgetSmall
      : size === 'medium'
      ? styles.widgetMedium
      : styles.widgetLarge;

  return (
    <View style={[containerStyle, { backgroundColor: event.color }]}>
      <View style={styles.widgetContent}>
        <View style={styles.widgetHeader}>
          <Ionicons name={iconName} size={size === 'small' ? 16 : 20} color="#fff" />
          <Text
            style={[
              styles.widgetTitle,
              size === 'small' && styles.widgetTitleSmall,
            ]}
            numberOfLines={1}
          >
            {event.title}
          </Text>
        </View>

        <View style={styles.widgetDday}>
          <Text style={[styles.widgetDdayNumber, size === 'small' && styles.widgetDdayNumberSmall]}>
            D-{daysLeft}
          </Text>
          {showSeconds && size !== 'small' && (
            <Text style={styles.widgetSeconds}>12:34:56</Text>
          )}
        </View>

        {size === 'large' && (
          <Text style={styles.widgetDate}>{event.date}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  widgetSmall: {
    width: 150,
    height: 150,
    borderRadius: 20,
    padding: 12,
  },
  widgetMedium: {
    width: 300,
    height: 150,
    borderRadius: 20,
    padding: 16,
  },
  widgetLarge: {
    width: 300,
    height: 300,
    borderRadius: 20,
    padding: 20,
  },
  widgetContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  widgetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  widgetTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    flex: 1,
  },
  widgetTitleSmall: {
    fontSize: 12,
  },
  widgetDday: {
    alignItems: 'center',
  },
  widgetDdayNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
  },
  widgetDdayNumberSmall: {
    fontSize: 32,
  },
  widgetSeconds: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  widgetDate: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
});
