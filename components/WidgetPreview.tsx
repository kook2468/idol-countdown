import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import { CountdownEvent, WidgetSize } from '../constants/types';
import { useCountdown } from '../hooks/use-countdown';

interface WidgetPreviewProps {
  event: CountdownEvent;
  size: WidgetSize;
  showSeconds: boolean;
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

export function WidgetPreview({ event, size, showSeconds }: WidgetPreviewProps) {
  // 실시간 카운트다운
  const timeLeft = useCountdown(event.date, true);

  // event.emoji가 Ionicons 이름이면 그대로 사용, 아니면 ICON_MAP에서 변환
  const iconName = ICON_MAP[event.emoji || 'musical-notes'] || event.emoji || 'star';
  const accentColor = event.color || '#FF6B9D';
  
  // 아티스트명과 이벤트명 분리
  const artistMatch = event.title.match(/^\[(.*?)\]/);
  const artistName = artistMatch ? artistMatch[1] : '';
  const eventTitle = event.title.replace(/^\[.*?\]\s*/, '');

  const containerStyle =
    size === 'small'
      ? styles.widgetSmall
      : size === 'medium'
      ? styles.widgetMedium
      : styles.widgetLarge;

  // iOS systemBackground 느낌의 배경
  const backgroundGradient: readonly [string, string] = ['#FAFAFA', '#F5F5F5'];

  return (
    <LinearGradient
      colors={backgroundGradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={[containerStyle, styles.widgetContainer]}
    >
      {/* Small Widget: 단순하고 즉각적인 정보 전달 */}
      {size === 'small' && (
        <View style={styles.smallContent}>
          {/* 상단: 아티스트명 (보조 텍스트) */}
          {artistName && (
            <Text style={[styles.smallArtistName, { color: accentColor }]} numberOfLines={1}>
              {artistName}
            </Text>
          )}
          
          {/* 중앙: D-Day 숫자 크게 */}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.ddayLarge}>D</Text>
            <Text style={[styles.ddayLarge, { fontSize: 36 }]}>{timeLeft.days >= 0 ? '-' : '+'}</Text>
            <Text style={styles.ddayLarge}>{Math.abs(timeLeft.days)}</Text>
          </View>

          {/* 하단: 아이콘 + 이벤트명 */}
          <View style={styles.smallHeader}>
            <Ionicons name={iconName} size={14} color={accentColor} />
            <Text style={[styles.smallEventName, { color: accentColor }]} numberOfLines={1}>
              {eventTitle}
            </Text>
          </View>
        </View>
      )}

      {/* Medium Widget: 초 단위 카운트다운 중심 */}
      {size === 'medium' && (
        <View style={styles.mediumContent}>
          {/* 좌측 영역: 이벤트 정보 */}
          <View style={styles.mediumLeft}>
            {artistName && (
              <Text style={[styles.mediumArtistName, { color: accentColor }]} numberOfLines={1}>
                {artistName}
              </Text>
            )}
            <View style={styles.mediumIconEventRow}>
              <Ionicons name={iconName} size={16} color={accentColor} />
              <Text style={[styles.mediumEventName, { color: accentColor }]} numberOfLines={1}>
                {eventTitle}
              </Text>
            </View>
          </View>
          
          {/* 우측 영역: D-Day + 시:분:초 */}
          <View style={styles.mediumRight}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.ddayMedium}>D</Text>
              <Text style={[styles.ddayMedium, { fontSize: 36 }]}>{timeLeft.days >= 0 ? '-' : '+'}</Text>
              <Text style={styles.ddayMedium}>{Math.abs(timeLeft.days)}</Text>
            </View>
            {showSeconds && (
              <Text style={styles.countdownText}>
                {String(Math.abs(timeLeft.hours)).padStart(2, '0')}:{String(Math.abs(timeLeft.minutes)).padStart(2, '0')}:{String(Math.abs(timeLeft.seconds)).padStart(2, '0')}
              </Text>
            )}
          </View>
        </View>
      )}

      {/* Large Widget: 초 단위 카운트다운을 보는 경험 중심 */}
      {size === 'large' && (
        <View style={styles.largeContent}>
          {/* 상단: 아티스트명 (더 크게 강조) */}
          {artistName && (
            <Text style={[styles.largeArtistName, { color: accentColor }]} numberOfLines={1}>
              {artistName}
            </Text>
          )}

          {/* 중단: 아이콘 + 이벤트명 */}
          <View style={styles.largeHeader}>
            <Ionicons name={iconName} size={20} color={accentColor} />
            <Text style={[styles.largeEventName, { color: accentColor }]} numberOfLines={1}>
              {eventTitle}
            </Text>
          </View>
          
          {/* 하단: D-Day + 시:분:초 */}
          <View style={styles.largeTimeDisplay}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.ddayExtraLarge}>D</Text>
              <Text style={[styles.ddayExtraLarge, { fontSize: 48 }]}>{timeLeft.days >= 0 ? '-' : '+'}</Text>
              <Text style={styles.ddayExtraLarge}>{Math.abs(timeLeft.days)}</Text>
            </View>
            {showSeconds && (
              <Text style={styles.largeCountdownText}>
                {String(Math.abs(timeLeft.hours)).padStart(2, '0')}:{String(Math.abs(timeLeft.minutes)).padStart(2, '0')}:{String(Math.abs(timeLeft.seconds)).padStart(2, '0')}
              </Text>
            )}
          </View>
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  widgetContainer: {
    overflow: 'hidden',
  },
  widgetSmall: {
    width: 150,
    height: 150,
    borderRadius: 24,
  },
  widgetMedium: {
    width: 300,
    height: 150,
    borderRadius: 24,
  },
  widgetLarge: {
    width: 300,
    height: 300,
    borderRadius: 24,
  },
  
  // ========================================
  // Small Widget Styles
  // ========================================
  smallContent: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 14,
    paddingBottom: 14,
  },
  smallHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  smallEventName: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
  ddayLarge: {
    fontSize: 52,
    fontWeight: '700',
    color: '#1F2937',
    letterSpacing: -2,
  },
  smallArtistName: {
    fontSize: 13,
    fontWeight: '600',
  },
  
  // ========================================
  // Medium Widget Styles
  // ========================================
  mediumContent: {
    flex: 1,
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 20,
  },
  mediumLeft: {
    flex: 1,
    justifyContent: 'center',
    gap: 6,
  },
  mediumIconEventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  mediumEventName: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
  mediumArtistName: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  mediumRight: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  ddayMedium: {
    fontSize: 52,
    fontWeight: '700',
    color: '#1F2937',
    letterSpacing: -2,
    textAlign: 'center',
  },
  // 초 단위 카운트다운 (Medium)
  countdownText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    letterSpacing: -0.5,
    fontVariant: ['tabular-nums'],
    textAlign: 'center',
  },
  
  // ========================================
  // Large Widget Styles
  // ========================================
  largeContent: {
    flex: 1,
    padding: 20,
    paddingTop: 18,
    paddingBottom: 22,
    justifyContent: 'space-between',
  },
  largeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  largeEventName: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  largeArtistName: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 4,
    letterSpacing: 0.3,
  },
  largeTimeDisplay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  ddayExtraLarge: {
    fontSize: 72,
    fontWeight: '700',
    color: '#1F2937',
    letterSpacing: -3,
  },
  // 초 단위 카운트다운 (Large)
  largeCountdownText: {
    fontSize: 28,
    fontWeight: '600',
    color: '#1F2937',
    letterSpacing: -1,
    fontVariant: ['tabular-nums'],
  },
});
