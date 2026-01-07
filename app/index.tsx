import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { useEffect, useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { AddEventModal } from '../components/AddEventModal';
import { CountdownCard } from '../components/CountdownCard';
import { ProModal } from '../components/ProModal';
import { WidgetPreviewModal } from '../components/WidgetPreviewModal';
import { CountdownEvent, UserSettings } from '../constants/types';

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
  const [proModalOpen, setProModalOpen] = useState(false);
  const [proFeature, setProFeature] = useState<
    'lockscreen' | 'seconds' | 'themes' | 'icons' | undefined
  >();
  const [widgetPreviewOpen, setWidgetPreviewOpen] = useState(false);

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
    } catch (e) {
      console.error('Failed to load data', e);
    }
  };

  useEffect(() => {
    if (events.length > 0) {
      AsyncStorage.setItem('idolCountdownEvents', JSON.stringify(events));
    }
  }, [events]);

  useEffect(() => {
    AsyncStorage.setItem('idolCountdownSettings', JSON.stringify(userSettings));
  }, [userSettings]);

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

  const handleShowProModal = (
    feature?: 'lockscreen' | 'seconds' | 'themes' | 'icons'
  ) => {
    setProFeature(feature);
    setProModalOpen(true);
  };

  const handleShowWidgetPreview = () => {
    setWidgetPreviewOpen(true);
  };

  const toggleProMode = () => {
    setUserSettings((prev) => ({
      ...prev,
      isPro: !prev.isPro,
    }));
  };

  const sortedEvents = [...events].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  const previewEvent = sortedEvents[0] || {
    id: 'demo',
    title: '[BTS] 컴백',
    date: '2026-01-15T19:00',
    color: '#FF6B9D',
    emoji: 'Music',
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" />

        {/* Header */}
        <LinearGradient
          colors={['#F472B6', '#C084FC', '#F472B6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.header}
        >
          <View style={styles.headerLeft}>
            <MotiView
              from={{ rotate: '0deg', scale: 1 }}
              animate={{
                rotate: ['0deg', '10deg', '-10deg', '10deg', '0deg'],
                scale: [1, 1.1, 1.1, 1.1, 1],
              }}
              transition={{
                type: 'timing',
                duration: 2000,
                loop: true,
                delay: 1000,
              }}
            >
              <Ionicons name="sparkles" size={28} color="#fff" />
            </MotiView>
            <View>
              <Text style={styles.headerTitle}>아이돌 카운트다운</Text>
              <View style={styles.headerSubtitleRow}>
                <Text style={styles.headerSubtitle}>우리의 특별한 날들</Text>
                <Ionicons name="heart" size={12} color="#fff" style={{ marginLeft: 4 }} />
              </View>
            </View>
          </View>

            <View style={styles.headerRight}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={
                  userSettings.isPro ? toggleProMode : () => handleShowProModal()
                }
              >
                <LinearGradient
                  colors={
                    userSettings.isPro
                      ? ['#FBBF24', '#F59E0B']
                      : ['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.2)']
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.proBadge}
                >
                  <Ionicons name="trophy" size={12} color="#fff" />
                  <Text style={styles.proBadgeText}>
                    {userSettings.isPro ? 'PRO' : 'Free'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setIsModalOpen(true)}
              >
                <LinearGradient
                  colors={['#ffffff', '#f8f9fa']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={styles.addButton}
                >
                  <Ionicons name="add" size={24} color="#F472B6" />
                </LinearGradient>
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
            <MotiView
              from={{ translateY: 0 }}
              animate={{ translateY: [-10, 0] }}
              transition={{ type: 'timing', duration: 2000, loop: true }}
            >
              <Ionicons name="sparkles" size={48} color="#FF6B9D" />
            </MotiView>
            <Text style={styles.emptyTitle}>아직 이벤트가 없어요!</Text>
            <View style={styles.emptySubtitleRow}>
              <Text style={styles.emptySubtitle}>첫 이벤트를 추가해보세요</Text>
              <Ionicons name="happy" size={16} color="#6B7280" style={{ marginLeft: 4 }} />
            </View>

            <View style={styles.proPreview}>
              <View style={styles.proPreviewHeader}>
                <Ionicons name="trophy" size={20} color="#FF6B9D" />
                <Text style={styles.proPreviewTitle}>PRO 기능 미리보기</Text>
              </View>
              <View style={styles.proFeaturesList}>
                {[
                  '홈 & 잠금화면 위젯',
                  '초 단위 카운트다운',
                  '커스텀 이벤트 무제한',
                ].map((text, idx) => (
                  <View key={idx} style={styles.proFeatureItem}>
                    <View style={styles.proFeatureCheck}>
                      <Text style={styles.proFeatureCheckText}>✓</Text>
                    </View>
                    <Text style={styles.proFeatureText}>{text}</Text>
                  </View>
                ))}
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => handleShowProModal()}
              style={styles.ctaButton}
            >
              <Text style={styles.ctaButtonText}>PRO로 위젯 사용하기</Text>
            </TouchableOpacity>

            <Text style={styles.ctaSubtext}>또는 무료로 시작하기</Text>
          </MotiView>
        ) : (
          <>
            <View style={styles.hintContainer}>
              <Text style={styles.hintText}>카드를 탭해서 위젯 미리보기</Text>
            </View>

            {sortedEvents.map((event) => (
              <TouchableOpacity
                key={event.id}
                activeOpacity={0.95}
                onPress={() => handleShowWidgetPreview()}
              >
                <CountdownCard
                  event={event}
                  onEdit={handleEdit}
                  onDelete={handleDeleteEvent}
                />
              </TouchableOpacity>
            ))}
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
        onUpgrade={() => handleShowProModal()}
      />

      <ProModal
        isOpen={proModalOpen}
        onClose={() => setProModalOpen(false)}
        feature={proFeature}
      />

      {previewEvent && (
        <WidgetPreviewModal
          isOpen={widgetPreviewOpen}
          onClose={() => setWidgetPreviewOpen(false)}
          event={previewEvent}
          isPro={userSettings.isPro}
          onUpgrade={() => handleShowProModal()}
        />
      )}
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.9)',
  },
  headerSubtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  proBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  proBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#fff',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 16,
    gap: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  emptySubtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
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
    color: '#9CA3AF',
  },
});
