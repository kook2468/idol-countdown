import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { useEffect, useState } from 'react';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { AddEventModal } from '../components/AddEventModal';
import { CustomArtist } from '../components/ArtistPresetSelector';
import { CountdownCard } from '../components/CountdownCard';
import { CustomEventType } from '../components/EventTypePresetSelector';
import { ProModal } from '../components/ProModal';
import { WidgetPreview } from '../components/WidgetPreview';
import { WidgetPreviewModal } from '../components/WidgetPreviewModal';
import { EMPTY_STATE_COPY } from '../constants/proCopy';
import { CountdownEvent, UserSettings } from '../constants/types';
import { useProModal } from '../contexts/ProModalContext';
import { isProEffective } from '../shared/feature/featureGate';

export default function App() {
  const [events, setEvents] = useState<CountdownEvent[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CountdownEvent | null>(null);
  const [userSettings, setUserSettings] = useState<UserSettings>({
    isPro: false,
    unlockedThemes: [],
    showSeconds: false,
    lockScreenWidget: false,
  });
  const [customArtists, setCustomArtists] = useState<CustomArtist[]>([]);
  const [customEventTypes, setCustomEventTypes] = useState<CustomEventType[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const { showProModal, hideProModal, isOpen: proModalOpen, limitReason } = useProModal();
  const [widgetPreviewOpen, setWidgetPreviewOpen] = useState(false);
  const [previewEvent, setPreviewEvent] = useState<CountdownEvent | null>(null);
  const [showProPreviewDetail, setShowProPreviewDetail] = useState(false);

  // Pro 모드 샘플 위젯 데이터
  const sampleEvent: CountdownEvent = {
    id: 'MyArtist',
    title: '[MyArtist] 컴백',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7일 후
    emoji: 'sparkles',
    color: '#C084FC',
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const storedEvents = await AsyncStorage.getItem('idolCountdownEvents');
      if (storedEvents) {
        setEvents(JSON.parse(storedEvents));
      }

      const storedSettings = await AsyncStorage.getItem('idolCountdownSettings');
      if (storedSettings) {
        setUserSettings(JSON.parse(storedSettings));
      }

      const storedCustomArtists = await AsyncStorage.getItem('customArtists');
      if (storedCustomArtists) {
        const parsed = JSON.parse(storedCustomArtists);
        console.log('Loading customArtists:', parsed);
        setCustomArtists(parsed);
      }

      const storedCustomEventTypes = await AsyncStorage.getItem('customEventTypes');
      if (storedCustomEventTypes) {
        const parsed = JSON.parse(storedCustomEventTypes);
        console.log('Loading customEventTypes:', parsed);
        setCustomEventTypes(parsed);
      }
      
      // 데이터 로딩 완료 표시
      setIsDataLoaded(true);
    } catch (e) {
      console.error('Failed to load data', e);
      setIsDataLoaded(true);
    }
  };

  useEffect(() => {
    // events 바뀔때마다 storage 저장
    AsyncStorage.setItem('idolCountdownEvents', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    AsyncStorage.setItem('idolCountdownSettings', JSON.stringify(userSettings));
  }, [userSettings]);

  useEffect(() => {
    // customArtists 바뀔때마다 storage 저장 (데이터 로드 후에만)
    if (isDataLoaded) {
      console.log('Saving customArtists:', customArtists);
      AsyncStorage.setItem('customArtists', JSON.stringify(customArtists)).catch(e => {
        console.error('Failed to save customArtists', e);
      });
    }
  }, [customArtists, isDataLoaded]);

  useEffect(() => {
    // customEventTypes 바뀔때마다 storage 저장 (데이터 로드 후에만)
    if (isDataLoaded) {
      console.log('Saving customEventTypes:', customEventTypes);
      AsyncStorage.setItem('customEventTypes', JSON.stringify(customEventTypes)).catch(e => {
        console.error('Failed to save customEventTypes', e);
      });
    }
  }, [customEventTypes, isDataLoaded]);

  const handleAddEvent = (
    newEvent: Omit<CountdownEvent, 'id'> | CountdownEvent
  ) => {
    if ('id' in newEvent) {
      setEvents((prev) => prev.map((e) => (e.id === newEvent.id ? newEvent : e)));
    } else {
      const event: CountdownEvent = {
        ...newEvent,
        id: Date.now().toString(),
      };
      setEvents((prev) => [...prev, event]);
    }
    setEditingEvent(null);
  };

  const handleDeleteEvent = (id: string) => {
    console.log('@id', id);
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  const handleEdit = (event: CountdownEvent) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEvent(null);
  };

  const handleShowWidgetPreview = (event: CountdownEvent) => {
    setPreviewEvent(event);
    setWidgetPreviewOpen(true);
  };

  const sortedEvents = [...events].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });
  
  // FeatureGate를 통해 실제 Pro 기능 활성화 여부 판단
  const effectiveIsPro = isProEffective(userSettings.isPro);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" />

        {/* Header */}
        <LinearGradient
          colors={['#F5B4D9', '#E3C4F7']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.header}
        >
          <View style={styles.headerLeft}>
            <Ionicons name="sparkles" size={18} color="#fff" />
            <Text style={styles.headerTitle}>아이돌 카운트다운</Text>
          </View>

          <View style={styles.headerRight}>
            {effectiveIsPro ? (
              // Pro 모드: 상태 표시만
              <View style={styles.proBadgeContainer}>
                <LinearGradient
                  colors={['rgba(251, 191, 36, 0.7)', 'rgba(245, 158, 11, 0.7)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.proBadge}
                >
                  <Ionicons name="trophy" size={11} color="#fff" />
                  <Text style={styles.proBadgeText}>PRO</Text>
                </LinearGradient>
              </View>
            ) : (
              // Free 모드: Pro 업그레이드 버튼
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => showProModal()}
                style={styles.upgradeButtonContainer}
              >
                <LinearGradient
                  colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.2)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.upgradeButton}
                >
                  <Ionicons name="arrow-up-circle-outline" size={12} color="#fff" />
                  <Text style={styles.upgradeButtonText}>PRO 업그레이드</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setIsModalOpen(true)}
            >
              <View style={styles.addButton}>
                <Ionicons name="add" size={22} color="#fff" />
              </View>
            </TouchableOpacity>
          </View>
        </LinearGradient>

          {/* Content */}
          <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {sortedEvents.length === 0 ? (
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            style={styles.emptyState}
          > 
            {/* Pro 모드: 프리미엄 메인 화면 */}
            {effectiveIsPro ? (
              <>
                {/* 메인 메시지 */}
                <View style={styles.proMainMessage}>
                  <Text style={styles.proMainTitle}>{EMPTY_STATE_COPY.pro.title}</Text>
                  <Text style={styles.proMainSubtitle}>{EMPTY_STATE_COPY.pro.subtitle}</Text>
                </View>

                {/* Primary CTA: 이벤트 추가 */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setIsModalOpen(true)}
                  style={styles.primaryCtaButton}
                >
                  <LinearGradient
                    colors={['#F472B6', '#C084FC']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.primaryCtaGradient}
                  >
                    <Ionicons name="add-circle-outline" size={20} color="#fff" />
                    <Text style={styles.primaryCtaText}>{EMPTY_STATE_COPY.free.cta.primary}</Text>
                  </LinearGradient>
                </TouchableOpacity>

                {/* Pro 기능 아이콘 표시 */}
                <View style={styles.proFeaturesRow}>
                  <View style={styles.proFeaturesContainer}>
                    {EMPTY_STATE_COPY.pro.features.map((feature, idx) => (
                      <View key={idx} style={styles.proFeatureIcon}>
                        <View style={styles.proFeatureIconCircle}>
                          <Ionicons name={feature.icon as any} size={18} color="#6B7280" />
                        </View>
                        <Text style={styles.proFeatureLabel}>{feature.label}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* 위젯 미리보기 - 간단 버전 */}
                <View style={styles.proWidgetPreview}>
                  <Text style={styles.proWidgetPreviewLabel}>위젯 미리보기 예시</Text>
                  <View style={styles.simpleWidgetContainer}>
                    <WidgetPreview
                      event={sampleEvent}
                      size="medium"
                      showSeconds={true}
                    />
                  </View>
                </View>
              </>
            ) : (
              /* Free 모드: 이벤트 추가 우선, Pro 기능은 요약만 */
              <>
                <Text style={styles.emptyTitle}>{EMPTY_STATE_COPY.free.title}</Text>
                <Text style={styles.emptySubtitle}>{EMPTY_STATE_COPY.free.subtitle}</Text>

                {/* Primary CTA: 이벤트 추가 */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setIsModalOpen(true)}
                  style={styles.primaryCtaButton}
                >
                  <LinearGradient
                    colors={['#F472B6', '#C084FC']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.primaryCtaGradient}
                  >
                    <Ionicons name="add-circle-outline" size={20} color="#fff" />
                    <Text style={styles.primaryCtaText}>{EMPTY_STATE_COPY.free.cta.primary}</Text>
                  </LinearGradient>
                </TouchableOpacity>

                {/* Pro 기능 미리보기 (요약) */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setShowProPreviewDetail(true)}
                  style={styles.proPreviewSummary}
                >
                  <View style={styles.proPreviewSummaryContent}>
                    <View style={styles.proPreviewSummaryLeft}>
                      <Ionicons name="trophy" size={18} color="#F472B6" />
                      <View style={styles.proPreviewSummaryText}>
                        <Text style={styles.proPreviewSummaryTitle}>
                          {EMPTY_STATE_COPY.free.proPreview.title}
                        </Text>
                        <Text style={styles.proPreviewSummarySubtitle}>
                          {EMPTY_STATE_COPY.free.proPreview.subtitle}
                        </Text>
                      </View>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                  </View>
                </TouchableOpacity>
              </>
            )}
          </MotiView>
        ) : (
          <>
            {sortedEvents.map((event) => (
              <TouchableOpacity
                key={event.id}
                activeOpacity={0.95}
                onPress={() => handleShowWidgetPreview(event)}
              >
                <CountdownCard
                  event={event}
                  onEdit={handleEdit}
                  onDelete={handleDeleteEvent}
                />
              </TouchableOpacity>
            ))}
            <View style={styles.hintContainer}>
              <Text style={styles.hintText}>카드를 탭해서 위젯 미리보기</Text>
            </View>
          </>
        )}
      </ScrollView>

      {/* Modals */}
      <AddEventModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleAddEvent}
        editingEvent={editingEvent}
        isPro={userSettings.isPro}
        onUpgrade={() => showProModal()}
        customArtists={customArtists}
        customEventTypes={customEventTypes}
        onUpdateCustomArtists={setCustomArtists}
        onUpdateCustomEventTypes={setCustomEventTypes}
      />

      {/* Pro 기능 상세 모달 */}
      <ProModal
        isOpen={showProPreviewDetail}
        onClose={() => setShowProPreviewDetail(false)}
        limitReason="widget"
      />

      {previewEvent && (
        <WidgetPreviewModal
          isOpen={widgetPreviewOpen}
          onClose={() => setWidgetPreviewOpen(false)}
          event={previewEvent}
          isPro={effectiveIsPro}
          onUpgrade={() => showProModal()}
        />
      )}

      {/* ProModal - 가장 마지막에 렌더링하여 최상위에 표시 */}
      <ProModal
        isOpen={proModalOpen}
        onClose={hideProModal}
        limitReason={limitReason}
      />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 48 : 10,
    paddingBottom: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.4)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
    letterSpacing: -0.2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  proBadgeContainer: {
    alignItems: 'center',
    gap: 2,
  },
  proBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  proBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#fff',
  },
  // Free 모드: Pro 업그레이드 버튼
  upgradeButtonContainer: {
    alignItems: 'center',
  },
  upgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  upgradeButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#fff',
  },
  freePlanHint: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500',
    marginTop: -2,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 16,
    gap: 12,
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  // Pro 모드: 프리미엄 메인 화면
  proMainMessage: {
    alignItems: 'center',
    marginBottom: 32,
  },
  proMainTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  proMainSubtitle: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
  },
  // Pro 이벤트 추가 버튼
  proAddButton: {
    width: '100%',
    marginBottom: 48,
  },
  proAddButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 14,
    shadowColor: '#C084FC',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  proAddButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
    letterSpacing: -0.3,
  },
  // Pro 기능 아이콘 표시
  proFeaturesRow: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 48,
    marginTop: 20,
  },
  proFeaturesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    paddingHorizontal: 20,
  },
  proFeatureIcon: {
    alignItems: 'center',
    gap: 10,
  },
  proFeatureIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  proFeatureLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '600',
  },
  // Pro 위젯 미리보기 - 간단 버전
  proWidgetPreview: {
    width: '100%',
    paddingHorizontal: 16,
    marginTop: 5,
    alignItems: 'center',
  },
  proWidgetPreviewLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '500',
    marginBottom: 3,
    letterSpacing: 0.3,
  },
  simpleWidgetContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ scale: 0.8 }],
    opacity: 0.85,
  },
  // 기존 샘플 위젯 스타일 (제거 예정)
  proWidgetSample: {
    width: '70%',
    aspectRatio: 1.5,
  },
  proWidgetSampleGradient: {
    flex: 1,
    borderRadius: 20,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  proWidgetSampleContent: {
    alignItems: 'center',
    gap: 12,
  },
  proWidgetSampleTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: -0.5,
  },
  proWidgetSampleTime: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
  },
  // 기존 Pro 상태 배지 (사용 안 함)
  proStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 7,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    marginBottom: 24,
  },
  proStatusText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 40,
  },
  emptySubtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  // Primary CTA: 이벤트 추가
  primaryCtaButton: {
    width: '100%',
    marginBottom: 20,
  },
  primaryCtaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 14,
  },
  primaryCtaText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  // Pro 기능 미리보기 (요약)
  proPreviewSummary: {
    width: '100%',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E7EB',
  },
  proPreviewSummaryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  proPreviewSummaryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  proPreviewSummaryText: {
    flex: 1,
    gap: 4,
  },
  proPreviewSummaryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  proPreviewSummarySubtitle: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
  },
  // Pro 모드 기능 요약
  proFeaturesSummary: {
    width: '100%',
    gap: 10,
    paddingHorizontal: 12,
  },
  proFeatureSummaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  proFeatureSummaryText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  // 기존 Pro Preview 스타일 (상세 화면용으로 유지)
  proPreview: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    width: '100%',
  },
  proPreviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  proPreviewTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  proFeaturesList: {
    gap: 12,
  },
  proFeatureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  proFeatureCheck: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FDE2ED',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  proFeatureCheckText: {
    fontSize: 12,
    color: '#FF6B9D',
  },
  proFeatureText: {
    fontSize: 13,
    color: '#4B5563',
    flex: 1,
  },
  ctaButton: {
    backgroundColor: '#FF6B9D',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginBottom: 12,
    width: '100%',
  },
  ctaButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  ctaSubtext: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  hintContainer: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  hintText: {
    fontSize: 11,
    color: '#777',
  },
});
