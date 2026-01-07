import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import {
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface ProModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature?: 'lockscreen' | 'seconds' | 'themes' | 'icons';
}

const FEATURE_INFO = {
  lockscreen: {
    title: '잠금화면 위젯',
    description: '잠금화면에서도 D-Day를 바로 확인하세요',
    icon: 'lock-closed' as const,
  },
  seconds: {
    title: '초 단위 카운트',
    description: '더 정확한 카운트다운을 경험하세요',
    icon: 'sparkles' as const,
  },
  themes: {
    title: '프리미엄 테마',
    description: '다양한 테마로 위젯을 꾸며보세요',
    icon: 'trophy' as const,
  },
  icons: {
    title: '모든 아이콘',
    description: '원하는 아이콘으로 커스터마이징하세요',
    icon: 'sparkles' as const,
  },
};

export function ProModal({ isOpen, onClose, feature }: ProModalProps) {
  const featureInfo = feature ? FEATURE_INFO[feature] : null;

  const handleUpgrade = () => {
    Alert.alert('알림', 'PRO 버전 구매 기능은 데모입니다.');
    onClose();
  };

  return (
    <Modal visible={isOpen} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <TouchableOpacity style={styles.backdropTouch} onPress={onClose} />

        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={styles.modal}
        >
          {/* Gradient Header */}
          <LinearGradient
            colors={['#F472B6', '#A855F7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.header}
          >
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={20} color="#fff" />
            </TouchableOpacity>

            <MotiView
              from={{ rotate: '0deg' }}
              animate={{ rotate: '360deg' }}
              transition={{
                type: 'timing',
                duration: 3000,
                loop: true,
              }}
            >
              <Ionicons name="trophy" size={64} color="#fff" style={styles.crownIcon} />
            </MotiView>
            <Text style={styles.headerTitle}>PRO로 업그레이드</Text>
            <Text style={styles.headerSubtitle}>완벽한 카운트다운 경험을 만나보세요</Text>
          </LinearGradient>

          {/* Content */}
          <ScrollView style={styles.content}>
            {/* Current Feature Highlight */}
            {featureInfo && (
              <View style={styles.featureHighlight}>
                <View style={styles.featureIconContainer}>
                  <Ionicons name={featureInfo.icon} size={20} color="#fff" />
                </View>
                <View style={styles.featureTextContainer}>
                  <Text style={styles.featureTitle}>{featureInfo.title}</Text>
                  <Text style={styles.featureDescription}>{featureInfo.description}</Text>
                </View>
              </View>
            )}

            {/* Features List */}
            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <View style={styles.checkCircle}>
                  <Ionicons name="checkmark" size={16} color="#FF6B9D" />
                </View>
                <View style={styles.featureItemText}>
                  <Text style={styles.featureItemTitle}>홈/잠금화면에서 D-Day 바로 확인</Text>
                  <Text style={styles.featureItemSubtitle}>위젯으로 한눈에 확인</Text>
                </View>
              </View>

              <View style={styles.featureItem}>
                <View style={styles.checkCircle}>
                  <Ionicons name="checkmark" size={16} color="#FF6B9D" />
                </View>
                <View style={styles.featureItemText}>
                  <Text style={styles.featureItemTitle}>컴백 순간까지 초 단위로 카운트</Text>
                  <Text style={styles.featureItemSubtitle}>더 정확한 카운트다운</Text>
                </View>
              </View>

              <View style={styles.featureItem}>
                <View style={styles.checkCircle}>
                  <Ionicons name="checkmark" size={16} color="#FF6B9D" />
                </View>
                <View style={styles.featureItemText}>
                  <Text style={styles.featureItemTitle}>커스텀 이벤트 무제한 추가</Text>
                  <Text style={styles.featureItemSubtitle}>원하는 이벤트 자유롭게</Text>
                </View>
              </View>
            </View>

            {/* Pricing */}
            <View style={styles.pricingBox}>
              <Text style={styles.pricingLabel}>단 한 번의 결제로</Text>
              <Text style={styles.pricingAmount}>₩4,900</Text>
              <View style={styles.lifetimeBadge}>
                <Text style={styles.lifetimeText}>평생 사용</Text>
              </View>
            </View>

            {/* CTA Buttons */}
            <View style={styles.buttons}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={handleUpgrade}
              >
                <LinearGradient
                  colors={['#F472B6', '#A855F7']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.upgradeButton}
                >
                  <Text style={styles.upgradeButtonText}>PRO로 업그레이드</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={onClose}
                style={styles.laterButton}
              >
                <Text style={styles.laterButtonText}>나중에</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </MotiView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  backdropTouch: {
    ...StyleSheet.absoluteFillObject,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 24,
    width: '100%',
    maxWidth: 400,
    overflow: 'hidden',
  },
  header: {
    padding: 32,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
  },
  crownIcon: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  content: {
    padding: 24,
  },
  featureHighlight: {
    flexDirection: 'row',
    backgroundColor: '#FFF1F5',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#FFD1E0',
    padding: 16,
    marginBottom: 24,
    gap: 12,
  },
  featureIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#FF6B9D',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 13,
    color: '#6B7280',
  },
  featuresList: {
    gap: 12,
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: 'row',
    gap: 12,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFF1F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  featureItemText: {
    flex: 1,
  },
  featureItemTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 2,
  },
  featureItemSubtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  pricingBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
  },
  pricingLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
  },
  pricingAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  lifetimeBadge: {
    backgroundColor: '#FFF1F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  lifetimeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FF6B9D',
  },
  buttons: {
    gap: 12,
    marginBottom: 16,
  },
  upgradeButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  upgradeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  laterButton: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  laterButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#6B7280',
  },
});
