import { Crown, Plus } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { AddEventModal } from './components/AddEventModal';
import { CountdownCard } from './components/CountdownCard';
import { ProModal } from './components/ProModal';
import { WidgetPreviewModal } from './components/WidgetPreviewModal.tsx';
import { CountdownEvent, UserSettings } from './components/types';

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
  const [proFeature, setProFeature] = useState<'lockscreen' | 'seconds' | 'themes' | 'icons' | undefined>();
  const [widgetPreviewOpen, setWidgetPreviewOpen] = useState(false);
  const [previewEvent, setPreviewEvent] = useState<CountdownEvent | null>(null);

  // Load events from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('idolCountdownEvents');
    if (stored) {
      try {
        setEvents(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse stored events', e);
      }
    }
    
    const storedSettings = localStorage.getItem('idolCountdownSettings');
    if (storedSettings) {
      try {
        setUserSettings(JSON.parse(storedSettings));
      } catch (e) {
        console.error('Failed to parse stored settings', e);
      }
    }
  }, []);

  // Save events to localStorage
  useEffect(() => {
    if (events.length > 0) {
      localStorage.setItem('idolCountdownEvents', JSON.stringify(events));
    }
  }, [events]);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('idolCountdownSettings', JSON.stringify(userSettings));
  }, [userSettings]);

  const handleAddEvent = (newEvent: Omit<CountdownEvent, 'id'> | CountdownEvent) => {
    if ('id' in newEvent) {
      // Editing existing event
      setEvents((prev) =>
        prev.map((e) => (e.id === newEvent.id ? newEvent : e))
      );
    } else {
      // Adding new event
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

  const handleShowProModal = (feature?: 'lockscreen' | 'seconds' | 'themes' | 'icons') => {
    setProFeature(feature);
    setProModalOpen(true);
  };

  const handleShowWidgetPreview = (event: CountdownEvent) => {
    setPreviewEvent(event);
    setWidgetPreviewOpen(true);
  };

  const toggleProMode = () => {
    setUserSettings((prev) => ({
      ...prev,
      isPro: !prev.isPro,
    }));
  };

  // Sort events by date (upcoming first)
  const sortedEvents = [...events].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  const nextEvent = sortedEvents.length > 1 ? sortedEvents[1] : undefined;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Phone container */}
      <div className="mx-auto max-w-[420px] min-h-screen bg-white shadow-xl relative">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400 px-5 py-5 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 10, 0],
                  scale: [1, 1.1, 1.1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
                className="text-3xl"
              >
                ✨
              </motion.div>
              <div>
                <h1 className="text-xl font-bold text-white drop-shadow-md">
                  아이돌 카운트다운
                </h1>
                <p className="text-white/90 text-xs mt-0.5">우리의 특별한 날들 💕</p>
              </div>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              {/* Pro badge/button */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={userSettings.isPro ? toggleProMode : () => handleShowProModal()}
                className={`${
                  userSettings.isPro
                    ? 'bg-gradient-to-r from-yellow-400 to-yellow-500'
                    : 'bg-white/20'
                } text-white rounded-full px-3 py-1.5 text-xs font-bold shadow-lg flex items-center gap-1`}
              >
                <Crown className="size-3" />
                {userSettings.isPro ? 'PRO' : 'Free'}
              </motion.button>

              {/* Add button */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsModalOpen(true)}
                className="bg-white text-pink-500 rounded-full p-2.5 shadow-lg hover:shadow-xl transition-shadow"
              >
                <Plus className="size-5" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3 bg-gradient-to-b from-pink-50/30 to-purple-50/30 min-h-[calc(100vh-100px)] pb-20">
          {sortedEvents.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12 px-6"
            >
              <motion.div
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="text-7xl mb-6"
              >
                ✨
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                아직 이벤트가 없어요!
              </h3>
              <p className="text-gray-600 mb-8">
                첫 이벤트를 추가해보세요 🎉
              </p>

              {/* PRO Features Preview */}
              <div className="bg-white rounded-2xl p-5 mb-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Crown className="size-5 text-pink-500" />
                  <h4 className="text-lg font-bold text-gray-800">PRO 기능 미리보기</h4>
                </div>
                <div className="space-y-3 text-left">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-pink-600 text-xs">✓</span>
                    </div>
                    <p className="text-sm text-gray-700">홈 & 잠금화면 위젯</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-pink-600 text-xs">✓</span>
                    </div>
                    <p className="text-sm text-gray-700">초 단위 카운트다운</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-pink-600 text-xs">✓</span>
                    </div>
                    <p className="text-sm text-gray-700">커스텀 이벤트 무제한</p>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => handleShowProModal()}
                className="w-full py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 shadow-lg transition-all mb-3"
              >
                PRO로 위젯 사용하기
              </motion.button>

              <p className="text-xs text-gray-400">
                또는 무료로 시작하기
              </p>
            </motion.div>
          ) : (
            <>
              {/* Widget preview hint */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center gap-2 py-2"
              >
                <p className="text-xs text-gray-400">
                  카드를 탭해서 위젯 미리보기
                </p>
              </motion.div>
              
              <AnimatePresence mode="popLayout">
                {sortedEvents.map((event) => (
                  <div
                    key={event.id}
                    onClick={() => handleShowWidgetPreview(event)}
                    className="cursor-pointer"
                  >
                    <CountdownCard
                      event={event}
                      onEdit={(e) => {
                        e.stopPropagation();
                        handleEdit(event);
                      }}
                      onDelete={(id) => {
                        handleDeleteEvent(id);
                      }}
                    />
                  </div>
                ))}
              </AnimatePresence>
            </>
          )}
        </div>

        {/* Decorative floating elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <motion.div
            animate={{
              y: [0, -20, 0],
              x: [0, 10, 0],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute top-32 right-8 text-4xl opacity-10"
          >
            🎀
          </motion.div>
          <motion.div
            animate={{
              y: [0, 20, 0],
              x: [0, -10, 0],
              rotate: [0, -5, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 1,
            }}
            className="absolute bottom-32 left-8 text-4xl opacity-10"
          >
            💖
          </motion.div>
          <motion.div
            animate={{
              y: [0, -15, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 2,
            }}
            className="absolute top-64 left-12 text-3xl opacity-10"
          >
            ⭐
          </motion.div>
          <motion.div
            animate={{
              y: [0, 15, 0],
              x: [0, 5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.5,
            }}
            className="absolute bottom-48 right-12 text-3xl opacity-10"
          >
            🌸
          </motion.div>
        </div>
      </div>

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
          nextEvent={nextEvent}
          isPro={userSettings.isPro}
          onUpgrade={(feature) => handleShowProModal(feature)}
        />
      )}
    </div>
  );
}