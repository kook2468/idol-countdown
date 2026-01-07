import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import { useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { CountdownEvent, WidgetSize } from '../constants/types';
import { WidgetPreview } from './WidgetPreview';

interface WidgetPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: CountdownEvent;
  isPro?: boolean;
  onUpgrade?: () => void;
}

export function WidgetPreviewModal({
  isOpen,
  onClose,
  event,
  isPro = false,
  onUpgrade,
}: WidgetPreviewModalProps) {
  const [size, setSize] = useState<WidgetSize>('medium');
  const [showSeconds, setShowSeconds] = useState(false);

  const handleSecondsToggle = () => {
    if (!isPro) {
      onUpgrade?.();
      return;
    }
    setShowSeconds(!showSeconds);
  };

  return (
    <Modal visible={isOpen} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <TouchableOpacity style={styles.backdropTouch} onPress={onClose} />

        <MotiView
          from={{ translateY: 300 }}
          animate={{ translateY: 0 }}
          style={styles.modal}
        >
          <View style={styles.header}>
            <Text style={styles.headerTitle}>위젯 미리보기</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            {/* Size Selector */}
            <View style={styles.section}>
              <Text style={styles.label}>위젯 크기</Text>
              <View style={styles.sizeButtons}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setSize('small')}
                  style={[
                    styles.sizeButton,
                    size === 'small' && styles.sizeButtonActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.sizeButtonText,
                      size === 'small' && styles.sizeButtonTextActive,
                    ]}
                  >
                    Small
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setSize('medium')}
                  style={[
                    styles.sizeButton,
                    size === 'medium' && styles.sizeButtonActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.sizeButtonText,
                      size === 'medium' && styles.sizeButtonTextActive,
                    ]}
                  >
                    Medium
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setSize('large')}
                  style={[
                    styles.sizeButton,
                    size === 'large' && styles.sizeButtonActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.sizeButtonText,
                      size === 'large' && styles.sizeButtonTextActive,
                    ]}
                  >
                    Large
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Settings */}
            <View style={styles.section}>
              <Text style={styles.label}>설정</Text>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleSecondsToggle}
                style={styles.settingRow}
              >
                <View style={styles.settingLeft}>
                  <Ionicons name="time" size={20} color="#6B7280" />
                  <Text style={styles.settingText}>초 단위 표시</Text>
                  {!isPro && (
                    <View style={styles.proBadge}>
                      <Ionicons name="lock-closed" size={10} color="#FF6B9D" />
                      <Text style={styles.proText}>PRO</Text>
                    </View>
                  )}
                </View>
                <View
                  style={[
                    styles.toggle,
                    showSeconds && styles.toggleActive,
                  ]}
                >
                  <View
                    style={[
                      styles.toggleCircle,
                      showSeconds && styles.toggleCircleActive,
                    ]}
                  />
                </View>
              </TouchableOpacity>
            </View>

            {/* Preview */}
            <View style={styles.section}>
              <Text style={styles.label}>미리보기</Text>
              <View style={styles.previewContainer}>
                <WidgetPreview event={event} size={size} showSeconds={showSeconds} />
              </View>
            </View>

            <View style={styles.instructions}>
              <Ionicons name="information-circle" size={16} color="#6B7280" />
              <Text style={styles.instructionsText}>
                설정 {'>'} 위젯에서 앱을 추가하여 홈 화면에 위젯을 배치할 수 있습니다.
              </Text>
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
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  backdropTouch: {
    flex: 1,
  },
  modal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  closeButton: {
    padding: 8,
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 12,
  },
  sizeButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  sizeButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  sizeButtonActive: {
    backgroundColor: '#FFF1F5',
    borderColor: '#FF6B9D',
  },
  sizeButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
    textAlign: 'center',
  },
  sizeButtonTextActive: {
    color: '#FF6B9D',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  settingText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  proBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: '#FFF1F5',
    borderRadius: 8,
  },
  proText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FF6B9D',
  },
  toggle: {
    width: 44,
    height: 24,
    backgroundColor: '#D1D5DB',
    borderRadius: 12,
    padding: 2,
  },
  toggleActive: {
    backgroundColor: '#FF6B9D',
  },
  toggleCircle: {
    width: 20,
    height: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  toggleCircleActive: {
    transform: [{ translateX: 20 }],
  },
  previewContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
  },
  instructions: {
    flexDirection: 'row',
    gap: 8,
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginBottom: 16,
  },
  instructionsText: {
    flex: 1,
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
  },
});
