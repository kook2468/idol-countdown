import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MotiView } from 'moti';
import { useEffect, useState } from 'react';
import {
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { ARTIST_PRESETS, CountdownEvent, EVENT_TYPE_PRESETS } from '../constants/types';

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Omit<CountdownEvent, 'id'> | CountdownEvent) => void;
  editingEvent?: CountdownEvent | null;
  isPro?: boolean;
  onUpgrade?: () => void;
}

export function AddEventModal({
  isOpen,
  onClose,
  onSave,
  editingEvent,
  isPro = false,
  onUpgrade,
}: AddEventModalProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [eventType, setEventType] = useState('comeback');
  const [artistPreset, setArtistPreset] = useState('bts');
  const [customArtistName, setCustomArtistName] = useState('');
  const [customEventName, setCustomEventName] = useState('');

  useEffect(() => {
    if (editingEvent) {
      setSelectedDate(new Date(editingEvent.date));
      setEventType(editingEvent.eventType || 'comeback');
      setArtistPreset(editingEvent.artistPreset || 'bts');
      setCustomArtistName(editingEvent.customArtistName || '');
      setCustomEventName(editingEvent.customEventName || '');
    } else {
      setSelectedDate(new Date());
      setEventType('comeback');
      setArtistPreset('bts');
      setCustomArtistName('');
      setCustomEventName('');
    }
  }, [editingEvent, isOpen]);

  const formatDateToISO = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleSubmit = () => {
    if ((artistPreset === 'custom' || eventType === 'custom') && !isPro) {
      onUpgrade?.();
      return;
    }

    const artistName =
      artistPreset === 'custom'
        ? customArtistName
        : ARTIST_PRESETS.find((a) => a.id === artistPreset)?.name || '';

    const eventName =
      eventType === 'custom'
        ? customEventName
        : EVENT_TYPE_PRESETS.find((e) => e.id === eventType)?.label || '';

    const title = `[${artistName}] ${eventName}`;

    const eventPreset = EVENT_TYPE_PRESETS.find((e) => e.id === eventType);
    const artistColor = ARTIST_PRESETS.find((a) => a.id === artistPreset)?.color;
    const color = artistColor || eventPreset?.color || '#FF6B9D';
    const emoji = eventPreset?.icon || 'Music';
    const date = formatDateToISO(selectedDate);

    if (editingEvent) {
      onSave({
        ...editingEvent,
        title,
        date,
        color,
        emoji,
        eventType,
        artistPreset,
        customArtistName,
        customEventName,
      });
    } else {
      onSave({
        title,
        date,
        color,
        emoji,
        eventType,
        artistPreset,
        customArtistName,
        customEventName,
      });
    }

    onClose();
  };

  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleTimeChange = (event: any, date?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleArtistPresetSelect = (artistId: string) => {
    if (artistId === 'custom' && !isPro) {
      onUpgrade?.();
      return;
    }
    setArtistPreset(artistId);
  };

  const handleEventTypeSelect = (typeId: string) => {
    if (typeId === 'custom' && !isPro) {
      onUpgrade?.();
      return;
    }
    setEventType(typeId);
  };

  const isCustomArtist = artistPreset === 'custom';
  const isCustomEvent = eventType === 'custom';

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
            <Text style={styles.headerTitle}>
              {editingEvent ? '이벤트 수정' : '새 이벤트'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            <View style={styles.section}>
              <Text style={styles.label}>아티스트</Text>
              <View style={styles.grid3}>
                {ARTIST_PRESETS.map((artist) => {
                  const isLocked = artist.isPro && !isPro;
                  const isSelected = artistPreset === artist.id;
                  return (
                    <TouchableOpacity
                      key={artist.id}
                      activeOpacity={0.8}
                      onPress={() => handleArtistPresetSelect(artist.id)}
                      style={[
                        styles.presetButton,
                        isSelected && {
                          backgroundColor: `${artist.color}30`,
                          borderColor: artist.color,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.presetText,
                          isSelected && { color: artist.color },
                        ]}
                      >
                        {artist.name}
                      </Text>
                      {isLocked && (
                        <View style={styles.lockBadge}>
                          <Ionicons name="lock-closed" size={10} color="#FF6B9D" />
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {isCustomArtist && isPro && (
              <View style={styles.section}>
                <Text style={styles.label}>아티스트 이름</Text>
                <TextInput
                  value={customArtistName}
                  onChangeText={setCustomArtistName}
                  placeholder="예: 아이유"
                  style={styles.input}
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            )}

            <View style={styles.section}>
              <Text style={styles.label}>이벤트 타입</Text>
              <View style={styles.grid2}>
                {EVENT_TYPE_PRESETS.map((type) => {
                  const isLocked = type.isPro && !isPro;
                  const isSelected = eventType === type.id;
                  return (
                    <TouchableOpacity
                      key={type.id}
                      activeOpacity={0.8}
                      onPress={() => handleEventTypeSelect(type.id)}
                      style={[
                        styles.presetButton,
                        isSelected && {
                          backgroundColor: `${type.color}20`,
                          borderColor: type.color,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.presetText,
                          isSelected && { color: type.color },
                        ]}
                      >
                        {type.label}
                      </Text>
                      {isLocked && (
                        <View style={styles.lockBadge}>
                          <Ionicons name="lock-closed" size={10} color="#FF6B9D" />
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {isCustomEvent && isPro && (
              <View style={styles.section}>
                <Text style={styles.label}>이벤트 이름</Text>
                <TextInput
                  value={customEventName}
                  onChangeText={setCustomEventName}
                  placeholder="예: 단독 콘서트"
                  style={styles.input}
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            )}

            <View style={styles.section}>
              <Text style={styles.label}>날짜 및 시간</Text>
              
              <View style={styles.dateTimeContainer}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setShowDatePicker(true)}
                  style={styles.dateTimeButton}
                >
                  <Ionicons name="calendar" size={20} color="#6B7280" />
                  <Text style={styles.dateTimeText}>
                    {selectedDate.toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setShowTimePicker(true)}
                  style={styles.dateTimeButton}
                >
                  <Ionicons name="time" size={20} color="#6B7280" />
                  <Text style={styles.dateTimeText}>
                    {selectedDate.toLocaleTimeString('ko-KR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                </TouchableOpacity>
              </View>

              {showDatePicker && (
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleDateChange}
                />
              )}

              {showTimePicker && (
                <DateTimePicker
                  value={selectedDate}
                  mode="time"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleTimeChange}
                />
              )}
            </View>

            <TouchableOpacity
              activeOpacity={0.9}
              onPress={handleSubmit}
              style={styles.submitButton}
            >
              <Text style={styles.submitText}>
                {editingEvent ? '수정' : '추가'}
              </Text>
            </TouchableOpacity>
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
  grid3: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  grid2: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  presetButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    minWidth: '30%',
    position: 'relative',
  },
  presetText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
    textAlign: 'center',
  },
  lockBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#fff',
    fontSize: 14,
    color: '#111827',
  },
  dateTimeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  dateTimeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#fff',
  },
  dateTimeText: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#FF6B9D',
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 24,
  },
  submitText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
});
