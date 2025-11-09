import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { createOne, updateOne } from '../store/actions';

export default function NoteFormModal({
  visible,
  onClose,
  editing,
  clientId,
  submitting,
}) {
  const dispatch = useDispatch();
  const [title, setTitle] = useState('');
  const [detail, setDetail] = useState('');
  const [type, setType] = useState('PUBLIC');
  const [typeOpen, setTypeOpen] = useState(false);

  useEffect(() => {
    if (editing) {
      setTitle(editing.title || '');
      setDetail(editing.detail || '');
      setType(editing.type || 'PUBLIC');
    } else {
      setTitle('');
      setDetail('');
      setType('PUBLIC');
    }
  }, [editing, visible]);

  const onSave = () => {
    const payload = { title: title.trim(), detail: detail.trim(), type };
    if (!payload.title) return;
    if (editing) dispatch(updateOne(clientId, editing.id, payload));
    else dispatch(createOne(clientId, payload));
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>{editing ? 'Edit Note' : 'Add Note'}</Text>

          <Text style={styles.label}>Title</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Title"
            placeholderTextColor="#9ca3af"
            style={styles.input}
          />

          <Text style={styles.label}>Detail</Text>
          <TextInput
            value={detail}
            onChangeText={setDetail}
            placeholder="Description"
            placeholderTextColor="#9ca3af"
            style={[styles.input, { height: 96, textAlignVertical: 'top' }]}
            multiline
          />

          <Text style={styles.label}>Type</Text>
          <Pressable style={styles.select} onPress={() => setTypeOpen(v => !v)}>
            <Text style={{ color: '#111827' }}>{type}</Text>
            <Text style={{ color: '#6b7280' }}>{typeOpen ? '▴' : '▾'}</Text>
          </Pressable>
          {typeOpen && (
            <View style={styles.menu}>
              {['PUBLIC', 'PRIVATE'].map(opt => (
                <Pressable
                  key={opt}
                  style={styles.menuItem}
                  onPress={() => {
                    setType(opt);
                    setTypeOpen(false);
                  }}
                >
                  <Text style={{ color: '#111827' }}>{opt}</Text>
                </Pressable>
              ))}
            </View>
          )}

          <View style={styles.row}>
            <Pressable style={styles.btn} onPress={onClose}>
              <Text style={styles.btnTxt}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[styles.btn, styles.primary]}
              onPress={onSave}
              disabled={submitting}
            >
              <Text style={[styles.btnTxt, { color: '#fff' }]}>
                {submitting ? 'Saving…' : 'Save'}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  title: { fontSize: 18, fontWeight: '800', color: '#0b0b0c', marginBottom: 8 },
  label: {
    fontSize: 12,
    fontWeight: '800',
    color: '#374151',
    marginTop: 8,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
    color: '#111827',
  },
  select: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  menu: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 6,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 12,
  },
  btn: {
    borderWidth: 1,
    borderColor: '#1d4ed8',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  primary: { backgroundColor: '#1d4ed8' },
  btnTxt: { fontWeight: '600', color: '#111827' },
});
