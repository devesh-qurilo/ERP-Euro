import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Switch,
} from 'react-native';

export default function ProjectNoteCreateModal({
  visible,
  busy,
  preset,
  onClose,
  onSave,
}) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPublic, setIsPublic] = useState(true);

  useEffect(() => {
    if (visible) {
      setTitle(preset?.title || '');
      setContent(preset?.content || '');
      setIsPublic(
        typeof preset?.isPublic === 'boolean' ? preset.isPublic : true,
      );
    }
  }, [visible, preset]);

  const submit = () => {
    if (!title.trim()) return;
    onSave?.({ title: title.trim(), content, isPublic });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={s.overlay}>
        <View style={s.card}>
          <Text style={s.title}>Add Note</Text>

          <Text style={s.label}>Title</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Note title"
            placeholderTextColor="#9ca3af"
            style={s.input}
          />

          <Text style={s.label}>Content</Text>
          <TextInput
            value={content}
            onChangeText={setContent}
            placeholder="Write something…"
            placeholderTextColor="#9ca3af"
            style={[s.input, { height: 120, textAlignVertical: 'top' }]}
            multiline
          />

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 10,
            }}
          >
            <Switch value={isPublic} onValueChange={setIsPublic} />
            <Text style={{ marginLeft: 10 }}>Public</Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              gap: 8,
              marginTop: 12,
            }}
          >
            <Pressable style={s.btn} disabled={busy} onPress={onClose}>
              <Text style={s.btnTxt}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[s.btn, s.primary]}
              disabled={busy || !title.trim()}
              onPress={submit}
            >
              <Text style={[s.btnTxt, { color: '#fff' }]}>
                {busy ? 'Saving…' : 'Save'}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  title: { fontSize: 18, fontWeight: '900', color: '#0b0b0c', marginBottom: 8 },
  label: {
    fontSize: 12,
    fontWeight: '800',
    color: '#374151',
    marginTop: 6,
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
  btn: {
    borderWidth: 1,
    borderColor: '#1d4ed8',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  primary: { backgroundColor: '#1d4ed8', borderColor: '#1d4ed8' },
  btnTxt: { color: '#111827', fontWeight: '600' },
});
