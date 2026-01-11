import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { CountdownEvent } from '../constants/types';
import { useCountdown } from '../hooks/use-countdown';

interface CountdownCardProps {
  event: CountdownEvent;
  onEdit: (event: CountdownEvent) => void;
  onDelete: (id: string) => void;
}

const ICON_MAP: Record<string, any> = {
  // Legacy icon names to Ionicons mapping
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
  '💜': 'heart',
  '🐰': 'happy',
  '💎': 'diamond',
};

export function CountdownCard({ event, onEdit, onDelete }: CountdownCardProps) {
  // 카운트다운 계산 (실시간 업데이트 불필요)
  const timeLeft = useCountdown(event.date, false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // event.emoji가 Ionicons 이름이면 그대로 사용, 아니면 ICON_MAP에서 변환
  const iconName = ICON_MAP[event.emoji || 'musical-notes'] || event.emoji || 'musical-notes';
  const accentColor = event.color || '#FF6B9D';
  
  // 아티스트명과 이벤트명 분리
  const artistMatch = event.title.match(/^\[(.*?)\]/);
  const artistName = artistMatch ? artistMatch[1] : '';
  const eventTitle = event.title.replace(/^\[.*?\]\s*/, '');

  // 우측 스와이프 액션 (삭제)
  const renderRightActions = () => (
    <View style={styles.swipeActions}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => onEdit(event)}
        style={[styles.swipeAction, styles.editAction]}
      >
        <Ionicons name="create-outline" size={20} color="#fff" />
        <Text style={styles.swipeActionText}>편집</Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => onDelete(event.id)}
        style={[styles.swipeAction, styles.deleteAction]}
      >
        <Ionicons name="trash-outline" size={20} color="#fff" />
        <Text style={styles.swipeActionText}>삭제</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Swipeable renderRightActions={renderRightActions} overshootRight={false}>
      <View style={styles.listItem}>
        {/* 좌측: 아이콘 + 텍스트 정보 */}
        <View style={styles.leftContent}>
          {/* 아이콘 */}
          <View style={[styles.iconContainer, { backgroundColor: `${accentColor}15` }]}>
            <Ionicons name={iconName as any} size={24} color={accentColor} />
          </View>

          {/* 텍스트 정보 */}
          <View style={styles.textContent}>
            {/* 아티스트명 */}
            {artistName && (
              <Text style={[styles.artistName, { color: accentColor }]} numberOfLines={1}>
                {artistName}
              </Text>
            )}
            
            {/* 이벤트명 */}
            <Text style={styles.eventName} numberOfLines={1}>
              {eventTitle}
            </Text>
          </View>
        </View>

        {/* 우측: D-Day + 날짜/시간 */}
        <View style={styles.rightContent}>
          {/* D-Day */}
          <View style={styles.ddayContainer}>
            <Text style={styles.ddayText}>
              D{timeLeft.days >= 0 ? '-' : '+'}
              <Text style={styles.ddayNumber}>{Math.abs(timeLeft.days)}</Text>
            </Text>
          </View>

          {/* 날짜/시간 */}
          <Text style={styles.dateText}>{formatDate(event.date)}</Text>
        </View>
      </View>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  // iOS 리스트 아이템 스타일
  listItem: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  
  // 좌측 콘텐츠
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContent: {
    flex: 1,
    gap: 2,
  },
  artistName: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  eventName: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '400',
  },
  
  // 우측 콘텐츠
  rightContent: {
    alignItems: 'flex-end',
    gap: 4,
    marginLeft: 12,
  },
  ddayContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  ddayText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    letterSpacing: -1,
  },
  ddayNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
  },
  dateText: {
    fontSize: 11,
    color: '#777',
    fontWeight: '400',
  },
  
  // 스와이프 액션
  swipeActions: {
    flexDirection: 'row',
  },
  swipeAction: {
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  editAction: {
    backgroundColor: '#3B82F6',
  },
  deleteAction: {
    backgroundColor: '#EF4444',
  },
  swipeActionText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});
