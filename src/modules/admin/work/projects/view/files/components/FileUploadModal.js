// FileUploadModal.js
import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Platform,
} from 'react-native';
import { pick, types } from '@react-native-documents/picker';

export default function FileUploadModal({ visible, busy, onClose, onUpload }) {
  const [uri, setUri] = useState('');
  const [name, setName] = useState('');
  const [mime, setMime] = useState('');

  const handlePick = async () => {
    try {
      const res = await pick({
        allowMultiSelection: false,
        type: [types.allFiles, types.images, types.pdf],
      });
      const file = Array.isArray(res) ? res[0] : res;
      if (!file) return;

      const fUri = file.uri || file.fileCopyUri || file.fileUri || '';
      const fName =
        file.name || file.filename || guessName(fUri) || 'upload.bin';
      const fType =
        file.type ||
        file.mimeType ||
        guessType(fName) ||
        'application/octet-stream';

      setUri(fUri);
      setName(fName);
      setMime(fType);
    } catch (e) {
      // user cancelled or error — ignore silently
    }
  };

  const submit = () => {
    if (!uri) return;
    onUpload &&
      onUpload({
        uri,
        name: name || guessName(uri),
        type: mime || guessType(name || uri),
      });
    setUri('');
    setName('');
    setMime('');
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={s.overlay}>
        <View style={s.card}>
          <Text style={s.title}>Upload file</Text>

          <Pressable style={[s.btn, s.secondary]} onPress={handlePick}>
            <Text style={s.btnTxt}>Pick from device</Text>
          </Pressable>

          <Text style={s.label}>File URI or URL</Text>
          <TextInput
            value={uri}
            onChangeText={setUri}
            placeholder={
              Platform.OS === 'android'
                ? 'content://…  or  file://…  or  https://…'
                : 'file://… or https://…'
            }
            placeholderTextColor="#9ca3af"
            style={s.input}
          />

          <View style={{ flexDirection: 'row', gap: 8 }}>
            <View style={{ flex: 1 }}>
              <Text style={s.label}>Name (optional)</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="document.pdf"
                placeholderTextColor="#9ca3af"
                style={s.input}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.label}>MIME (optional)</Text>
              <TextInput
                value={mime}
                onChangeText={setMime}
                placeholder="application/pdf"
                placeholderTextColor="#9ca3af"
                style={s.input}
              />
            </View>
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
              disabled={busy || !uri}
              onPress={submit}
            >
              <Text style={[s.btnTxt, { color: '#fff' }]}>
                {busy ? 'Uploading…' : 'Upload'}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function guessName(u) {
  if (!u) return 'upload.bin';
  try {
    const p = new URL(u);
    return p.pathname.split('/').pop() || 'upload.bin';
  } catch (e) {
    return u.split('/').pop() || 'upload.bin';
  }
}

function guessType(nameOrUri) {
  const n = (nameOrUri || '').toLowerCase();
  if (n.endsWith('.png')) return 'image/png';
  if (n.endsWith('.jpg') || n.endsWith('.jpeg')) return 'image/jpeg';
  if (n.endsWith('.pdf')) return 'application/pdf';
  if (n.endsWith('.doc')) return 'application/msword';
  if (n.endsWith('.docx'))
    return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  if (n.endsWith('.xls')) return 'application/vnd.ms-excel';
  if (n.endsWith('.xlsx'))
    return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  if (n.endsWith('.zip')) return 'application/zip';
  return '';
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
  secondary: { borderColor: '#94a3b8' },
  btnTxt: { color: '#111827', fontWeight: '600' },
});
