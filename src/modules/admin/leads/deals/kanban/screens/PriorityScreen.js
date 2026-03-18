import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Modal,
  Pressable,
} from 'react-native';
import ColorPicker from 'react-native-wheel-color-picker';

import { useDispatch, useSelector } from 'react-redux';
import {
  fetchPriorities,
  createPriority,
  updatePriority,
  deletePriority,
} from '../../priorities/actions';

import {
  selectPriorities,
  selectPriorityLoading,
} from '../../priorities/selectors';

/* 🎨 PRESET COLORS */
const COLORS = [
  '#EF4444',
  '#F59E0B',
  '#10B981',
  '#3B82F6',
  '#8B5CF6',
  '#EC4899',
  '#14B8A6',
  '#F97316',
];

export default function PriorityScreen() {
  const dispatch = useDispatch();
  const priorities = useSelector(selectPriorities);
  const loading = useSelector(selectPriorityLoading);

  const [modalOpen, setModalOpen] = useState(false);
  const [status, setStatus] = useState('');
  const [color, setColor] = useState('#3B82F6');
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchPriorities());
  }, []);

  /* ================= SAVE ================= */
  const handleSave = () => {
    if (!status || submitting) return;

    setSubmitting(true);

    if (editing) {
      dispatch(updatePriority(editing.id, { status, color }));
    } else {
      dispatch(createPriority({ status, color }));
    }

    resetForm();
  };

  const resetForm = () => {
    setStatus('');
    setColor('#3B82F6');
    setEditing(null);
    setModalOpen(false);
    setTimeout(() => setSubmitting(false), 500);
  };

  /* ================= UI ================= */
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Deal Priorities</Text>

      {/* LIST */}
      <FlatList
        data={priorities}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={[styles.colorDot, { backgroundColor: item.color }]} />

            <Text style={styles.priorityText}>{item.status}</Text>

            <TouchableOpacity
              onPress={() => {
                setEditing(item);
                setStatus(item.status);
                setColor(item.color);
                setModalOpen(true);
              }}
            >
              <Text style={styles.edit}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => dispatch(deletePriority(item.id))}>
              <Text style={styles.delete}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* ➕ FLOATING BUTTON */}
      <TouchableOpacity style={styles.fab} onPress={() => setModalOpen(true)}>
        <Text style={{ color: '#fff', fontSize: 20 }}>＋</Text>
      </TouchableOpacity>

      {/* 🔥 MODAL (FORM) */}
      <Modal transparent animationType="slide" visible={modalOpen}>
        <Pressable style={styles.overlay} onPress={resetForm}>
          <Pressable style={styles.modalBox}>
            <Text style={styles.modalTitle}>
              {editing ? 'Update Priority' : 'Create Priority'}
            </Text>

            <TextInput
              placeholder="Priority name"
              value={status}
              onChangeText={setStatus}
              style={styles.input}
            />

            {/* QUICK COLORS */}
            <View style={styles.colorRow}>
              {COLORS.map(c => (
                <TouchableOpacity
                  key={c}
                  onPress={() => setColor(c)}
                  style={[
                    styles.colorCircle,
                    { backgroundColor: c },
                    color === c && styles.selectedColor,
                  ]}
                />
              ))}
            </View>

            {/* COLOR PICKER */}
            <ColorPicker
              style={{ height: 180 }}
              color={color}
              onColorChangeComplete={setColor}
              thumbSize={28}
              sliderSize={28}
              noSnap
              row={false}
            />

            {/* PREVIEW */}
            <View style={styles.preview}>
              <View
                style={[styles.previewCircle, { backgroundColor: color }]}
              />
              <Text>{color}</Text>
            </View>

            {/* ACTIONS */}
            <View style={styles.actions}>
              <TouchableOpacity
                onPress={resetForm}
                style={{
                  backgroundColor: '#b8b0b0',
                  paddingHorizontal: 20,
                  paddingVertical: 8,
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: '#3a3636', fontWeight: '700' }}>
                  Cancel
                </Text>
              </TouchableOpacity>

              {/* <TouchableOpacity
                style={styles.saveBtn}
                onPress={handleSave}
                disabled={submitting || loading}
              > */}
              <TouchableOpacity
                disabled={loading}
                style={[styles.saveBtn, loading && { opacity: 0.5 }]}
                onPress={handleSave}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={{ color: '#fff', fontWeight: '700' }}>Save</Text>
                )}
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F6F7FB' },

  title: { fontSize: 20, fontWeight: '800', marginBottom: 16 },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#fff',
    marginBottom: 10,
    elevation: 2,
  },

  colorDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 10,
  },

  priorityText: { flex: 1, fontWeight: '700' },

  edit: { color: '#2563EB', marginRight: 12 },
  delete: { color: '#DC2626' },

  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#2B6BD8',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },

  overlay: {
    flex: 1,
    backgroundColor: 'rgb(255, 255, 255)',
    justifyContent: 'flex-start',
    marginTop: 100,
    borderTopRadius: 30,
  },

  modalBox: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },

  modalTitle: { fontSize: 18, fontWeight: '800', marginBottom: 10 },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },

  colorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },

  colorCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    marginRight: 8,
    marginBottom: 8,
  },

  selectedColor: {
    borderWidth: 2,
    borderColor: '#000',
  },

  preview: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },

  previewCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    marginRight: 8,
  },

  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 300,
  },

  saveBtn: {
    backgroundColor: '#2B6BD8',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
});
