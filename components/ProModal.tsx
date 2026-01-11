import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { FEATURE_LIMIT_INFO, PRO_UPGRADE_COPY } from '../constants/proCopy';
import { CountdownEvent } from '../constants/types';

interface ProModalProps {
  isOpen: boolean;
  onClose: () => void;
  limitReason?: 'widget' | 'seconds' | null;
}

export function ProModal({ isOpen, onClose, limitReason }: ProModalProps) {
  const limitInfo = limitReason ? FEATURE_LIMIT_INFO[limitReason] : null;
  const [expandedFeature, setExpandedFeature] = useState<number | null>(null);

  // 샘플 이벤트 데이터
  const sampleEvent: CountdownEvent = {
    id: 'pro-modal-sample',
    title: '[Sample] 컴백',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    emoji: 'sparkles',
    color: '#A855F7',
  };

  const handleUpgrade = () => {
    Alert.alert(
      PRO_UPGRADE_COPY.alerts.purchaseDemo.title,
      PRO_UPGRADE_COPY.alerts.purchaseDemo.message
    );
    onClose();
  };
  
  const handleRestore = () => {
    Alert.alert(
      PRO_UPGRADE_COPY.alerts.restoreFailed.title,
      PRO_UPGRADE_COPY.alerts.restoreFailed.message
    );
  };

  return (
    <Modal 
      visible={isOpen} 
      transparent 
      animationType="fade" 
      onRequestClose={onClose}
      statusBarTranslucent
      presentationStyle="overFullScreen"
    >
      <View style={styles.backdrop} pointerEvents="box-none">
        <TouchableOpacity style={styles.backdropTouch} onPress={onClose} activeOpacity={1} />

        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={styles.modal}
        >
          {/* Gradient Header - 축소 */}
          <LinearGradient
            colors={['#F472B6', '#A855F7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.header}
          >
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={18} color="#fff" />
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
              <Ionicons name="trophy" size={40} color="#fff" style={styles.crownIcon} />
            </MotiView>
            <Text style={styles.headerTitle}>{PRO_UPGRADE_COPY.title}</Text>
            <Text style={styles.headerSubtitle}>{PRO_UPGRADE_COPY.subtitle}</Text>
          </LinearGradient>

          {/* Content */}
          <ScrollView style={styles.content}>
            {/* Limit Reason Highlight */}
            {limitInfo && (
              <View style={styles.featureHighlight}>
                <View style={styles.featureIconContainer}>
                  <Ionicons name={limitInfo.icon} size={20} color="#fff" />
                </View>
                <View style={styles.featureTextContainer}>
                  <Text style={styles.featureTitle}>{limitInfo.title}</Text>
                  <Text style={styles.featureDescription}>{limitInfo.description}</Text>
                </View>
              </View>
            )}

            {/* Features List - 컴팩트 버전 */}
            <View style={styles.featuresList}>
              {PRO_UPGRADE_COPY.benefits.map((benefit, index) => {
                return (
                  <TouchableOpacity
                    key={index}
                    activeOpacity={0.7}
                    style={styles.featureItem}
                  >
                    <View style={styles.checkCircle}>
                      <Ionicons name={benefit.icon} size={16} color="#FF6B9D" />
                    </View>
                    <View style={styles.featureItemText}>
                      <View style={styles.featureItemHeader}>
                        <Text style={styles.featureItemTitle}>{benefit.title}</Text>
                      </View>
                      <Text style={styles.featureItemSubtitle}>{benefit.description}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* 가격 & CTA 통합 블록 */}
            <View style={styles.pricingCTABlock}>
              <View style={styles.pricingBox}>
                <Text style={styles.pricingLabel}>{PRO_UPGRADE_COPY.priceLabel}</Text>
                <Text style={styles.pricingAmount}>{PRO_UPGRADE_COPY.priceAmount}</Text>
              </View>

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
                  <Text style={styles.upgradeButtonText}>{PRO_UPGRADE_COPY.buttons.upgrade}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* 하단 보조 링크 */}
            <View style={styles.footerLinks}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={onClose}
                style={styles.laterButton}
              >
                <Text style={styles.laterButtonText}>{PRO_UPGRADE_COPY.buttons.later}</Text>
              </TouchableOpacity>
              
              <Text style={styles.linkSeparator}>•</Text>
              
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleRestore}
                style={styles.restoreButton}
              >
                <Text style={styles.restoreButtonText}>{PRO_UPGRADE_COPY.buttons.restore}</Text>
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
    zIndex: 999999,
    elevation: 999999,
  },
  backdropTouch: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 24,
    width: '100%',
    maxWidth: 400,
    overflow: 'hidden',
    zIndex: 1000000,
    elevation: 1000000,
  },
  header: {
    padding: 20,
    paddingTop: 24,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    zIndex: 10,
  },
  crownIcon: {
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 6,
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
  },
  content: {
    padding: 20,
    paddingTop: 16,
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
    gap: 8,
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 4,
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
  featureItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  featureItemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  featureItemSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    lineHeight: 17,
  },
  // 가격 & CTA 통합 블록
  pricingCTABlock: {
    gap: 16,
    marginBottom: 12,
  },
  pricingBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  pricingLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  pricingAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
  },
  upgradeButton: {
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  upgradeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  // 위젯 썸네일 - 보조 증거
  widgetThumbnailSection: {
    marginTop: 16,
    marginBottom: 12,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
  },
  widgetThumbnailLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  widgetThumbnailContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.8,
  },
  // 하단 보조 링크
  footerLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  laterButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  laterButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
  },
  linkSeparator: {
    fontSize: 13,
    color: '#D1D5DB',
  },
  restoreButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  restoreButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#9CA3AF',
  },
});
