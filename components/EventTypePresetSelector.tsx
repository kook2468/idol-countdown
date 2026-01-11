/**
 * 이벤트 타입 프리셋 선택기 컴포넌트 (편집 통합 버전)
 * 
 * - 모든 프리셋 이름 수정 가능
 * - Custom 이벤트 타입 최대 5개 추가 가능
 * - 프리셋/Custom 구분 없이 동일한 편집 UI
 */

import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { CUSTOM_ICONS, EVENT_TYPE_PRESETS } from '../constants/types';

export interface CustomEventType {
  id: string;
  label: string;
  icon: string;
  color: string;
  isCustom: boolean;
}

export interface EventTypePreset {
  id: string;
  label: string;
  icon: string;
  color: string;
}

interface EventTypePresetSelectorProps {
  selectedTypeId: string;
  customEventTypes?: CustomEventType[]; // 사용자가 추가한 Custom 이벤트 타입
  onSelect: (typeId: string) => void;
  onUpdateCustomEventTypes: (types: CustomEventType[]) => void;
}

const MAX_CUSTOM_TYPES = 10; // Custom 최대 10개

export function EventTypePresetSelector({
  selectedTypeId,
  customEventTypes = [],
  onSelect,
  onUpdateCustomEventTypes,
}: EventTypePresetSelectorProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState<CustomEventType | EventTypePreset | null>(null);
  const [tempName, setTempName] = useState('');
  const [tempIcon, setTempIcon] = useState('star');

  // 전체 이벤트 타입 목록 (프리셋 + Custom)
  const allEventTypes: (EventTypePreset | CustomEventType)[] = [
    ...EVENT_TYPE_PRESETS,
    ...customEventTypes,
  ];

  const handlePressItem = (item: EventTypePreset | CustomEventType) => {
    onSelect(item.id);
  };

  const handleEditItem = (item: EventTypePreset | CustomEventType, e: any) => {
    e.stopPropagation();
    setEditingItem(item);
    setTempName(item.label);
    setTempIcon(item.icon);
    setShowEditModal(true);
  };

  const handleAddCustom = () => {
    if (customEventTypes.length >= MAX_CUSTOM_TYPES) {
      Alert.alert('최대 개수 초과', `커스텀 이벤트 타입은 최대 ${MAX_CUSTOM_TYPES}개까지 추가할 수 있습니다.`);
      return;
    }

    setEditingItem(null);
    setTempName('');
    setTempIcon('star');
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (!tempName.trim()) {
      Alert.alert('알림', '이벤트 타입 이름을 입력해주세요.');
      return;
    }

    // 컬러는 기본값 '#FF6B9D' 사용 (이벤트는 아이콘만 선택)
    const defaultColor = '#FF6B9D';

    if (editingItem && 'isCustom' in editingItem && editingItem.isCustom) {
      // Custom 이벤트 타입 수정
      const updated = customEventTypes.map((t) =>
        t.id === editingItem.id
          ? { ...t, label: tempName, icon: tempIcon, color: defaultColor }
          : t
      );
      onUpdateCustomEventTypes(updated);
    } else if (!editingItem) {
      // 새로운 Custom 이벤트 타입 추가
      const newCustom: CustomEventType = {
        id: `custom-${Date.now()}`,
        label: tempName,
        icon: tempIcon,
        color: defaultColor,
        isCustom: true,
      };
      onUpdateCustomEventTypes([...customEventTypes, newCustom]);
      onSelect(newCustom.id);
    }

    setShowEditModal(false);
  };

  const handleDeleteCustom = (customId: string) => {
    const updated = customEventTypes.filter((t) => t.id !== customId);
    onUpdateCustomEventTypes(updated);
    if (selectedTypeId === customId) {
      onSelect(EVENT_TYPE_PRESETS[0].id);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.presetGrid}>
          {allEventTypes.map((type) => {
            const isSelected = selectedTypeId === type.id;
            const isCustom = 'isCustom' in type && type.isCustom;
            
            return (
              <TouchableOpacity
                key={type.id}
                activeOpacity={0.8}
                onPress={() => handlePressItem(type)}
                style={[
                  styles.presetButton,
                  isSelected && {
                    backgroundColor: '#F3F4F6',
                    borderColor: '#9CA3AF',
                  },
                ]}
              >
                <View style={styles.presetContent}>
                  <View style={styles.presetMain}>
                    <Ionicons 
                      name={type.icon as any} 
                      size={16} 
                      color="#6B7280"
                    />
                    <Text
                      style={[
                        styles.presetText,
                        isSelected && { fontWeight: '600' },
                      ]}
                      numberOfLines={1}
                    >
                      {type.label}
                    </Text>
                  </View>
                  
                  {/* Custom 이벤트 타입만 편집 버튼 표시 */}
                  {isCustom && (
                    <View style={styles.presetActions}>
                      <TouchableOpacity
                        onPress={(e) => handleEditItem(type, e)}
                        style={styles.iconButton}
                      >
                        <Ionicons name="create-outline" size={16} color="#6B7280" />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}

          {/* 추가 버튼 */}
          {customEventTypes.length < MAX_CUSTOM_TYPES && (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleAddCustom}
              style={[styles.presetButton, styles.addButton]}
            >
              <Ionicons name="add-circle" size={20} color="#6B7280" />
              <Text style={styles.addButtonText}>추가</Text>
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.hint}>
          • 커스텀 이벤트 타입은 최대 {MAX_CUSTOM_TYPES}개까지 추가 가능합니다
        </Text>
      </View>

      {/* 편집/추가 모달 */}
      <Modal
        visible={showEditModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <TouchableOpacity
            style={styles.modalBackdropTouch}
            onPress={() => setShowEditModal(false)}
          />
          
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingItem ? '이벤트 타입 편집' : '새 이벤트 타입 추가'}
              </Text>
              <View style={styles.modalHeaderActions}>
                {editingItem && 'isCustom' in editingItem && editingItem.isCustom && (
                  <TouchableOpacity 
                    onPress={() => {
                      if (editingItem && 'isCustom' in editingItem) {
                        handleDeleteCustom(editingItem.id);
                        setShowEditModal(false);
                      }
                    }}
                    style={styles.deleteIconButton}
                  >
                    <Ionicons name="trash-outline" size={20} color="#EF4444" />
                  </TouchableOpacity>
                )}
                <TouchableOpacity onPress={() => setShowEditModal(false)}>
                  <Ionicons name="close" size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView style={styles.modalBody}>
              {/* 아이콘 선택 */}
              <Text style={styles.label}>아이콘</Text>
              <View style={styles.iconGrid}>
                {CUSTOM_ICONS.map((icon) => (
                  <TouchableOpacity
                    key={icon}
                    onPress={() => setTempIcon(icon)}
                    style={[
                      styles.iconButton2,
                      tempIcon === icon && {
                        backgroundColor: '#FF6B9D20',
                        borderColor: '#FF6B9D',
                      },
                    ]}
                  >
                    <Ionicons 
                      name={icon as any} 
                      size={20} 
                      color={tempIcon === icon ? '#FF6B9D' : '#6B7280'} 
                    />
                  </TouchableOpacity>
                ))}
              </View>

              {/* 이름 입력 */}
              <Text style={styles.label}>이름</Text>
              <TextInput
                value={tempName}
                onChangeText={setTempName}
                placeholder="이벤트 타입 이름"
                style={styles.input}
                placeholderTextColor="#9CA3AF"
              />
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                onPress={() => setShowEditModal(false)}
                style={[styles.modalButton, styles.cancelButton]}
              >
                <Text style={styles.cancelButtonText}>취소</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSaveEdit}
                disabled={!tempName.trim()}
                style={[
                  styles.modalButton, 
                  styles.saveButton,
                  !tempName.trim() && styles.saveButtonDisabled
                ]}
              >
                <Text style={[
                  styles.saveButtonText,
                  !tempName.trim() && styles.saveButtonTextDisabled
                ]}>
                  {editingItem ? '수정' : '추가'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  presetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  presetButton: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    minHeight: 40,
    width: '48%',
  },
  presetContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  presetMain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  presetText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#374151',
    flex: 1,
  },
  presetActions: {
    flexDirection: 'row',
    gap: 4,
  },
  iconButton: {
    padding: 0,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    borderStyle: 'dashed',
  },
  addButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
  },
  hint: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: -6,
  },

  // Modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 16,
  },
  modalBackdropTouch: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  modalHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  deleteIconButton: {
    padding: 4,
  },
  modalBody: {
    padding: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    marginTop: 12,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  iconButton2: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  iconButtonActive: {
    backgroundColor: '#FFF1F5',
    borderColor: '#FF6B9D',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: '#1F2937',
    backgroundColor: '#F9FAFB',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  colorButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
  },
  colorButtonActive: {
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 8,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F9FAFB',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  saveButton: {
    backgroundColor: '#FF6B9D',
  },
  saveButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  saveButtonTextDisabled: {
    color: '#9CA3AF',
  },
});
