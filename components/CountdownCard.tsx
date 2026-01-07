import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CountdownEvent } from '../constants/types';

interface CountdownCardProps {
  event: CountdownEvent;
  onEdit: (event: CountdownEvent) => void;
  onDelete: (id: string) => void;
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
  Headphones: 'headset',
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

export function CountdownCard({ event, onEdit, onDelete }: CountdownCardProps) {
  const calculateDaysLeft = () => {
    const now = new Date();
    const eventDate = new Date(event.date);
    const diffTime = eventDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysLeft = calculateDaysLeft();
  const isDDay = daysLeft === 0;
  const isPast = daysLeft < 0;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const iconName = ICON_MAP[event.emoji || 'Music'] || 'musical-notes';

  return (
    <MotiView
      from={{ opacity: 0, scale: 0.9, translateY: 20 }}
      animate={{ opacity: 1, scale: 1, translateY: 0 }}
      exit={{ opacity: 0, scale: 0.9, translateX: -100 }}
      transition={{ type: 'timing', duration: 300 }}
      style={[
        styles.card,
        {
          backgroundColor: `${event.color}15`,
          borderColor: `${event.color}40`,
        },
      ]}
    >
      {/* Sparkle decoration */}
      <View style={styles.sparkleContainer}>
        <MotiView
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            type: 'timing',
            duration: 2000,
            loop: true,
          }}
        >
          <Ionicons
            name="sparkles"
            size={12}
            color={event.color}
            style={{ opacity: 0.4 }}
          />
        </MotiView>
      </View>

      {/* Top: Icon + Title */}
      <View style={styles.header}>
        <MotiView
          style={[styles.iconContainer, { backgroundColor: `${event.color}30` }]}
          animate={{
            shadowOpacity: [0, 0.3, 0],
          }}
          transition={{
            type: 'timing',
            duration: 2000,
            loop: true,
          }}
        >
          <Ionicons name={iconName as any} size={24} color={event.color} />
        </MotiView>

        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {event.title}
          </Text>
          {event.subtitle && (
            <Text style={styles.subtitle} numberOfLines={1}>
              {event.subtitle}
            </Text>
          )}
        </View>
      </View>

      {/* D-Day Display */}
      <View
        style={[
          styles.ddayContainer,
          { backgroundColor: `${event.color}25` },
        ]}
      >
        {isDDay ? (
          <View style={styles.ddayContent}>
            <MotiView
              animate={{
                scale: [1, 1.1, 1],
                rotate: ['0deg', '5deg', '-5deg', '0deg'],
              }}
              transition={{
                type: 'timing',
                duration: 1000,
                loop: true,
              }}
            >
              <Ionicons name="happy" size={24} color={event.color} />
            </MotiView>
            <Text style={[styles.ddayText, { color: event.color }]}>D-DAY</Text>
          </View>
        ) : isPast ? (
          <View style={styles.ddayContent}>
            <Text style={styles.pastText}>종료</Text>
          </View>
        ) : (
          <View style={styles.ddayContent}>
            <Text style={[styles.ddayNumber, { color: event.color }]}>
              D-{daysLeft}
            </Text>
            {/* <Text style={styles.ddayLabel}>
              {daysLeft === 1 ? '내일' : `${daysLeft}일`}
            </Text> */}
          </View>
        )}
      </View>

      {/* Date */}
      <View style={styles.dateContainer}>
        <Text style={styles.dateText}>{formatDate(event.date)}</Text>
      </View>

      {/* Action buttons */}
      <View style={styles.actions}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => onEdit(event)}
          style={styles.actionButton}
        >
          <Ionicons name="create-outline" size={14} color={event.color} />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => onDelete(event.id)}
          style={styles.actionButton}
        >
          <Ionicons name="trash-outline" size={14} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: 16,
    borderWidth: 2,
    marginBottom: 12,
    position: 'relative',
  },
  sparkleContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  ddayContainer: {
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  ddayContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  ddayText: {
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  pastText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#9CA3AF',
  },
  ddayNumber: {
    fontSize: 30,
    fontWeight: 'bold',
    letterSpacing: -1,
  },
  ddayLabel: {
    fontSize: 13,
    color: '#6B7280',
    paddingBottom: 4,
  },
  dateContainer: {
    marginBottom: 8,
  },
  dateText: {
    fontSize: 11,
    color: '#6B7280',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 4,
  },
  actionButton: {
    padding: 6,
    borderRadius: 8,
  },
});
