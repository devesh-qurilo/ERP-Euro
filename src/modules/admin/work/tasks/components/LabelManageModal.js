import React, { useEffect, useState } from 'react';
import { Modal, View, Text, TextInput, Pressable } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { createLabel, updateLabel, deleteLabel } from '../components/tasks.api';

export default function LabelManageModal({
  visible,
  onClose,
  projectId, // 🔥 AUTO FROM TASK
  editLabel = null,
  onSuccess,
}) {
  const [name, setName] = useState('');
  const [colorCode, setColorCode] = useState('#6366f1');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (editLabel) {
      setName(editLabel.name);
      setColorCode(editLabel.colorCode);
      setDescription(editLabel.description || '');
    } else {
      setName('');
      setColorCode('#6366f1');
      setDescription('');
    }
  }, [editLabel, visible]);

  const submit = async () => {
    const payload = {
      name,
      colorCode,
      projectId,
      description,
    };

    let res;

    if (editLabel) {
      res = await updateLabel(editLabel.id, payload);
    } else {
      res = await createLabel(payload); // 👈 API se data aayega
    }

    // 🔥 PASS CREATED / UPDATED LABEL BACK
    onSuccess?.(res);
    onClose();
  };

  const remove = async () => {
    await deleteLabel(editLabel.id);
    onSuccess?.({ deleted: true, id: editLabel.id });
    onClose();
  };

  if (!visible) return null;

  return (
    <Modal visible transparent animationType="fade">
      <View style={s.overlay}>
        <View style={s.card}>
          <View style={s.header}>
            <Text style={s.title}>
              {editLabel ? 'Edit Label' : 'Create Label'}
            </Text>
            <Pressable onPress={submit} style={s.save}>
              <Text style={{ color: '#fff' }}>
                {editLabel ? 'Update' : 'Create'}
              </Text>
            </Pressable>
            <Pressable onPress={onClose}>
              <Feather name="x" size={22} />
            </Pressable>
          </View>

          <TextInput
            placeholder="Label name"
            value={name}
            onChangeText={setName}
            style={s.input}
          />

          <TextInput
            placeholder="#Faa890"
            value={colorCode}
            onChangeText={setColorCode}
            style={s.input}
          />

          <TextInput
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            style={[s.input, { height: 80 }]}
            multiline
          />

          <View style={s.actions}>
            {editLabel && (
              <Pressable onPress={remove} style={s.delete}>
                <Text style={{ color: '#fff' }}>Delete</Text>
              </Pressable>
            )}

            {/* <Pressable onPress={submit} style={s.save}>
              <Text style={{ color: '#fff' }}>
                {editLabel ? 'Update' : 'Create'}
              </Text>
            </Pressable> */}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const s = {
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: { fontSize: 18, fontWeight: '700' },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  save: {
    backgroundColor: '#4f46e5',
    padding: 10,
    borderRadius: 8,
  },
  delete: {
    backgroundColor: '#dc2626',
    padding: 10,
    borderRadius: 8,
  },
};
