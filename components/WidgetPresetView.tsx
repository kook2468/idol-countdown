import { Lock, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { CountdownEvent, WidgetSize } from './types';
import { WidgetPreview } from './WidgetPreview';

interface WidgetPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: CountdownEvent;
  nextEvent?: CountdownEvent;
  isPro?: boolean;
  onUpgrade?: (feature: 'seconds' | 'lockscreen') => void;
}

export function WidgetPreviewModal({ isOpen, onClose, event, nextEvent, isPro = false, onUpgrade }: WidgetPreviewModalProps) {
  const [selectedSize, setSelectedSize] = useState<WidgetSize>('medium');
  const [showSeconds, setShowSeconds] = useState(false);

  if (!isOpen) return null;

  const handleSecondsToggle = () => {
    if (!isPro) {
      onUpgrade?.('seconds');
      return;
    }
    setShowSeconds(!showSeconds);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="px-6 pt-6 pb-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                위젯 미리보기
              </h2>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="size-5 text-gray-500" />
              </motion.button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Size selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">위젯 크기</label>
              <div className="flex gap-2">
                {(['small', 'medium', 'large'] as WidgetSize[]).map((size) => (
                  <motion.button
                    key={size}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedSize(size)}
                    className="flex-1 py-2.5 px-3 rounded-xl text-sm font-medium transition-all"
                    style={{
                      backgroundColor: selectedSize === size ? '#f3f4f6' : '#ffffff',
                      border: selectedSize === size ? '2px solid #FF6B9D' : '2px solid #e5e7eb',
                      color: selectedSize === size ? '#FF6B9D' : '#6b7280',
                    }}
                  >
                    {size === 'small' ? 'Small' : size === 'medium' ? 'Medium' : 'Large'}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Options */}
            {selectedSize === 'large' && (
              <div className="mb-6">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">초 단위 표시</span>
                    {!isPro && (
                      <div className="flex items-center gap-1 text-xs text-pink-500">
                        <Lock className="size-3" />
                        <span>PRO</span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={handleSecondsToggle}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      showSeconds && isPro ? 'bg-pink-500' : 'bg-gray-300'
                    }`}
                  >
                    <motion.div
                      animate={{ x: showSeconds && isPro ? 24 : 0 }}
                      className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow"
                    />
                  </button>
                </div>
              </div>
            )}

            {/* Widget Preview Container */}
            <div className="relative flex justify-center items-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl">
              {/* Widget */}
              <div className={!isPro ? 'filter blur-sm' : ''}>
                <WidgetPreview
                  event={event}
                  size={selectedSize}
                  nextEvent={nextEvent}
                  showSeconds={showSeconds && isPro}
                />
              </div>

              {/* PRO Overlay for Free Users */}
              {!isPro && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 backdrop-blur-[2px] rounded-2xl"
                >
                  <div className="bg-white rounded-2xl p-6 max-w-xs mx-4 text-center shadow-xl">
                    <Lock className="size-12 text-pink-500 mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      이 위젯을 사용하려면
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      홈/잠금화면에 위젯을 추가하려면
                      <br />
                      PRO 업그레이드가 필요해요
                    </p>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onUpgrade?.('lockscreen')}
                      className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 transition-all"
                    >
                      PRO로 업그레이드
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Info text */}
            {isPro && (
              <p className="text-xs text-gray-500 text-center mt-4">
                홈 화면에서 위젯을 추가해보세요
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}