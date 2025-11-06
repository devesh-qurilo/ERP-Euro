import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { closeAwardModal, createAward, updateAward } from '../store/actions';
import { selectAwardEditing, selectAwardModalOpen } from '../store/selectors';
import * as DocPicker from '@react-native-documents/picker';

export default function AwardModal() {
  const dispatch = useDispatch();
  const visible = useSelector(selectAwardModalOpen);
  const editing = useSelector(selectAwardEditing);

  const [form, setForm] = useState({ title: '', summary: '' });
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (visible) {
      if (editing)
        setForm({ title: editing.title || '', summary: editing.summary || '' });
      else setForm({ title: '', summary: '' });
      setFile(null);
    }
  }, [visible, editing]);

  const pickIcon = async () => {
    try {
      const res = await DocPicker.pick({ allowMultiSelection: false });
      const f = res?.[0];
      if (f) setFile({ uri: f.uri, name: f.name, type: f.type || 'image/png' });
    } catch (e) {}
  };

  const onSave = async () => {
    setSaving(true);
    const payload = { ...form, iconFile: file };
    if (editing) await dispatch(updateAward(editing.id, payload));
    else await dispatch(createAward(payload));
    setSaving(false);
    dispatch(closeAwardModal());
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.modal}>
          <Text style={styles.title}>
            {editing ? 'Edit Award' : 'Add Award'}
          </Text>

          <Text style={styles.label}>Title</Text>
          <TextInput
            value={form.title}
            onChangeText={title => setForm({ ...form, title })}
            style={styles.input}
          />
          <Text style={styles.label}>Summary</Text>
          <TextInput
            value={form.summary}
            onChangeText={summary => setForm({ ...form, summary })}
            style={styles.input}
          />

          <Pressable style={styles.pickBtn} onPress={pickIcon}>
            <Text style={styles.pickTxt}>
              {file ? file.name : 'Pick Icon (optional)'}
            </Text>
          </Pressable>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              gap: 8,
              marginTop: 14,
            }}
          >
            <Pressable
              style={styles.btnPlain}
              onPress={() => dispatch(closeAwardModal())}
            >
              <Text style={styles.btnPlainTxt}>Cancel</Text>
            </Pressable>
            <Pressable
              style={styles.btnPrimary}
              onPress={onSave}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator />
              ) : (
                <Text style={styles.btnPrimaryTxt}>Save</Text>
              )}
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
    backgroundColor: 'rgba(0,0,0,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    width: '92%',
    maxWidth: 520,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  title: { fontSize: 18, fontWeight: '900', marginBottom: 8, color: '#0b0b0c' },
  label: { fontSize: 12, fontWeight: '800', color: '#374151', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
    color: '#111827',
    marginBottom: 10,
  },
  pickBtn: {
    borderWidth: 1,
    borderColor: '#1d4ed8',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignSelf: 'flex-start',
  },
  pickTxt: { color: '#1d4ed8', fontWeight: '800' },
  btnPlain: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  btnPlainTxt: { fontWeight: '800', color: '#111827' },
  btnPrimary: {
    borderWidth: 1,
    borderColor: '#1d4ed8',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#1d4ed8',
  },
  btnPrimaryTxt: { fontWeight: '900', color: '#fff' },
});
