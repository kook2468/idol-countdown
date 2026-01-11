import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MotiView } from 'moti';
import { useCallback, useEffect, useState } from 'react';
import {
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ARTIST_PRESETS, CountdownEvent, EVENT_TYPE_PRESETS } from '../constants/types';
import { ArtistPresetSelector, CustomArtist } from './ArtistPresetSelector';
import { CustomEventType, EventTypePresetSelector } from './EventTypePresetSelector';

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Omit<CountdownEvent, 'id'> | CountdownEvent) => void;
  editingEvent?: CountdownEvent | null;
  isPro?: boolean; // Deprecated: Custom은 이제 Free에서도 가능
  onUpgrade?: () => void; // Deprecated: Custom은 이제 Free에서도 가능
  customArtists?: CustomArtist[];
  customEventTypes?: CustomEventType[];
  onUpdateCustomArtists?: (artists: CustomArtist[]) => void;
  onUpdateCustomEventTypes?: (types: CustomEventType[]) => void;
}

export function AddEventModal({
  isOpen,
  onClose,
  onSave,
  editingEvent,
  isPro = false,
  onUpgrade,
  customArtists = [],
  customEventTypes = [],
  onUpdateCustomArtists = () => {},
  onUpdateCustomEventTypes = () => {},
}: AddEventModalProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [eventType, setEventType] = useState('comeback');
  const [artistPreset, setArtistPreset] = useState('bts');

  useEffect(() => {
    if (editingEvent) {
      setSelectedDate(new Date(editingEvent.date));
      setEventType(editingEvent.eventType || 'comeback');
      setArtistPreset(editingEvent.artistPreset || 'bts');
    } else {
      setSelectedDate(new Date());
      setEventType('comeback');
      setArtistPreset('bts');
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
    // Find artist info from presets or custom artists
    const allArtists = [...ARTIST_PRESETS, ...customArtists];
    const selectedArtist = allArtists.find((a) => a.id === artistPreset);
    const artistName = selectedArtist?.name || '';
    const artistColor = selectedArtist?.color || '#FF6B9D';

    // Find event type info from presets or custom event types
    const allEventTypes = [...EVENT_TYPE_PRESETS, ...customEventTypes];
    const selectedEventType = allEventTypes.find((e) => e.id === eventType);
    const eventName = selectedEventType?.label || '';
    const eventIcon = selectedEventType?.icon || 'musical-notes';

    const title = `[${artistName}] ${eventName}`;
    const color = artistColor;
    const emoji = eventIcon;
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
      });
    } else {
      onSave({
        title,
        date,
        color,
        emoji,
        eventType,
        artistPreset,
      });
    }

    onClose();
  };

  const handleDateChange = (event: any, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleTimeChange = (event: any, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }
    if (date) {
      setSelectedDate(date);
    }
  };

  const showDatePickerOnly = useCallback(() => {
    if (!showDatePicker) {
      setShowTimePicker(false);
      setShowDatePicker(true);
    }
  }, [showDatePicker]);

  const showTimePickerOnly = useCallback(() => {
    if (!showTimePicker) {
      setShowDatePicker(false);
      setShowTimePicker(true);
    }
  }, [showTimePicker]);

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

          <ScrollView 
            style={styles.content}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled={false}
            removeClippedSubviews={false}
          >
            <View style={styles.section}>
              <Text style={styles.label}>아티스트</Text>
              <ArtistPresetSelector
                selectedPresetId={artistPreset}
                customArtists={customArtists}
                onSelect={(presetId) => {
                  setArtistPreset(presetId);
                }}
                onUpdateCustomArtist={onUpdateCustomArtists}
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>이벤트 타입</Text>
              <EventTypePresetSelector
                selectedTypeId={eventType}
                customEventTypes={customEventTypes}
                onSelect={(typeId) => {
                  setEventType(typeId);
                }}
                onUpdateCustomEventTypes={onUpdateCustomEventTypes}
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>날짜 및 시간</Text>
              
              <View style={styles.dateTimeContainer}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={showDatePickerOnly}
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
                  onPress={showTimePickerOnly}
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

              <View style={showDatePicker ? styles.pickerContainer : styles.pickerHidden}>
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleDateChange}
                />
              </View>

              <View style={showTimePicker ? styles.pickerContainer : styles.pickerHidden}>
                <DateTimePicker
                  value={selectedDate}
                  mode="time"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleTimeChange}
                />
              </View>
            </View>
          </ScrollView>

          {/* 하단 고정 버튼 */}
          <View style={styles.footer}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={handleSubmit}
              style={styles.submitButton}
            >
              <Text style={styles.submitText}>
                {editingEvent ? '수정' : '추가'}
              </Text>
            </TouchableOpacity>
          </View>
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
    maxHeight: '90%',
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
  pickerContainer: {
    marginTop: 12,
  },
  pickerHidden: {
    height: 0,
    overflow: 'hidden',
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    backgroundColor: '#fff',
  },
  submitButton: {
    backgroundColor: '#FF6B9D',
    paddingVertical: 14,
    borderRadius: 12,
  },
  submitText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
});
