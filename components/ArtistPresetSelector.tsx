/**
 * 아티스트 프리셋 선택기 컴포넌트 (편집 통합 버전)
 * 
 * - 모든 프리셋 이름/컬러 수정 가능
 * - Custom 아티스트 최대 5개 추가 가능
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
import { ARTIST_PRESETS, PRESET_COLORS } from '../constants/types';

export interface CustomArtist {
  id: string;
  name: string;
  color: string;
  emoji: string;
  isCustom: boolean;
}

export interface ArtistPreset {
  id: string;
  name: string;
  color: string;
  emoji: string;
}

interface ArtistPresetSelectorProps {
  selectedPresetId: string;
  customArtists?: CustomArtist[]; // 사용자가 추가한 Custom 아티스트
  onSelect: (presetId: string) => void;
  onUpdateCustomArtist: (artists: CustomArtist[]) => void;
}

const MAX_CUSTOM_ARTISTS = 10; // Custom 최대 10개

export function ArtistPresetSelector({
  selectedPresetId,
  customArtists = [],
  onSelect,
  onUpdateCustomArtist,
}: ArtistPresetSelectorProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState<CustomArtist | ArtistPreset | null>(null);
  const [tempName, setTempName] = useState('');
  const [tempColor, setTempColor] = useState('#FF6B9D');

  // 전체 아티스트 목록 (프리셋 + Custom)
  const allArtists: (ArtistPreset | CustomArtist)[] = [
    ...ARTIST_PRESETS,
    ...customArtists,
  ];

  const handlePressItem = (item: ArtistPreset | CustomArtist) => {
    onSelect(item.id);
  };

  const handleEditItem = (item: ArtistPreset | CustomArtist, e: any) => {
    e.stopPropagation();
    setEditingItem(item);
    setTempName(item.name);
    setTempColor(item.color);
    setShowEditModal(true);
  };

  const handleAddCustom = () => {
    if (customArtists.length >= MAX_CUSTOM_ARTISTS) {
      Alert.alert('최대 개수 초과', `커스텀 아티스트는 최대 ${MAX_CUSTOM_ARTISTS}개까지 추가할 수 있습니다.`);
      return;
    }

    setEditingItem(null);
    setTempName('');
    setTempColor('#FF6B9D');
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (!tempName.trim()) {
      Alert.alert('알림', '아티스트 이름을 입력해주세요.');
      return;
    }

    // 아이콘은 기본값 'star' 사용 (아티스트는 컬러만 선택)
    const defaultIcon = 'star';

    if (editingItem && 'isCustom' in editingItem && editingItem.isCustom) {
      // Custom 아티스트 수정
      const updated = customArtists.map((a) =>
        a.id === editingItem.id
          ? { ...a, name: tempName, color: tempColor, emoji: defaultIcon }
          : a
      );
      onUpdateCustomArtist(updated);
    } else if (!editingItem) {
      // 새로운 Custom 아티스트 추가
      const newCustom: CustomArtist = {
        id: `custom-${Date.now()}`,
        name: tempName,
        color: tempColor,
        emoji: defaultIcon,
        isCustom: true,
      };
      onUpdateCustomArtist([...customArtists, newCustom]);
      onSelect(newCustom.id);
    }

    setShowEditModal(false);
  };

  const handleDeleteCustom = (customId: string) => {
    const updated = customArtists.filter((a) => a.id !== customId);
    onUpdateCustomArtist(updated);
    if (selectedPresetId === customId) {
      onSelect(ARTIST_PRESETS[0].id);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.presetGrid}>
          {allArtists.map((artist) => {
            const isSelected = selectedPresetId === artist.id;
            const isCustom = 'isCustom' in artist && artist.isCustom;
            
            return (
              <TouchableOpacity
                key={artist.id}
                activeOpacity={0.8}
                onPress={() => handlePressItem(artist)}
                style={[
                  styles.presetButton,
                  isSelected && {
                    backgroundColor: `${artist.color}30`,
                    borderColor: artist.color,
                  },
                ]}
              >
                <View style={styles.presetContent}>
                  <View style={styles.presetMain}>
                    {/* 동그라미로 컬러 표시 */}
                    <View 
                      style={[
                        styles.colorCircle, 
                        { backgroundColor: artist.color }
                      ]} 
                    />
                    <Text
                      style={[
                        styles.presetText,
                        isSelected && { color: artist.color, fontWeight: '600' },
                      ]}
                      numberOfLines={1}
                    >
                      {artist.name}
                    </Text>
                  </View>
                  
                  {/* Custom 아티스트만 편집 버튼 표시 */}
                  {isCustom && (
                    <View style={styles.presetActions}>
                      <TouchableOpacity
                        onPress={(e) => handleEditItem(artist, e)}
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
          {customArtists.length < MAX_CUSTOM_ARTISTS && (
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
          • 커스텀 아티스트는 최대 {MAX_CUSTOM_ARTISTS}개까지 추가 가능합니다
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
                {editingItem ? '아티스트 편집' : '새 아티스트 추가'}
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
              {/* 이름 입력 */}
              <Text style={styles.label}>이름</Text>
              <TextInput
                value={tempName}
                onChangeText={setTempName}
                placeholder="아티스트 이름"
                style={styles.input}
                placeholderTextColor="#9CA3AF"
              />

              {/* 컬러 선택 */}
              <Text style={styles.label}>컬러</Text>
              <View style={styles.colorGrid}>
                {PRESET_COLORS.map((color) => (
                  <TouchableOpacity
                    key={color}
                    onPress={() => setTempColor(color)}
                    style={[
                      styles.colorButton,
                      { backgroundColor: color },
                      tempColor === color && styles.colorButtonActive,
                    ]}
                  >
                    {tempColor === color && (
                      <Ionicons name="checkmark" size={16} color="#fff" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
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
  colorCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
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
