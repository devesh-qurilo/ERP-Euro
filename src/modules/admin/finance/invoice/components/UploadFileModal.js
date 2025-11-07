import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
// 👉 use ONLY this picker (no react-native-image-picker)
import * as DocumentPicker from '@react-native-documents/picker';

function toRNFile(doc) {
  // Some pickers return fileCopyUri or uri; prefer fileCopyUri if present.
  const uri = doc.fileCopyUri || doc.uri;
  return {
    uri,
    name: doc.name || 'upload.bin',
    type: doc.type || 'application/octet-stream',
  };
}

export default function UploadFileModal({ visible, onClose, onSubmit }) {
  const [picked, setPicked] = useState(null);

  async function handlePick() {
    try {
      const res = await DocumentPicker.pick({
        // Allow images + pdf + common docs
        type: [
          DocumentPicker.types.images,
          DocumentPicker.types.pdf,
          DocumentPicker.types.plainText,
          DocumentPicker.types.doc,
          DocumentPicker.types.docx,
          DocumentPicker.types.xlsx,
          DocumentPicker.types.ppt,
          DocumentPicker.types.pptx,
        ],
        copyTo: 'cachesDirectory', // ensures we get a stable fileCopyUri
      });
      // If API returns single item directly, normalize to array-like
      const doc = Array.isArray(res) ? res[0] : res;
      setPicked(toRNFile(doc));
    } catch (e) {
      if (DocumentPicker.isCancel && DocumentPicker.isCancel(e)) {
        // user cancelled, ignore
      } else {
        console.log('[UploadFileModal] picker error:', e?.message);
      }
    }
  }

  function handleUpload() {
    if (!picked) return;
    onSubmit(picked); // parent dispatches A.uploadFile(...)
    setPicked(null);
    onClose();
  }

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View
        style={{ flex: 1, backgroundColor: '#fff', padding: 16, marginTop: 50 }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 12,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: '700' }}>Upload File</Text>
          <TouchableOpacity onPress={onClose}>
            <Text>Close</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={handlePick}
          style={{
            backgroundColor: '#111827',
            padding: 14,
            borderRadius: 10,
            marginBottom: 12,
          }}
          activeOpacity={0.9}
        >
          <Text
            style={{ color: '#fff', textAlign: 'center', fontWeight: '700' }}
          >
            Choose document / image
          </Text>
        </TouchableOpacity>

        {picked ? (
          <View
            style={{
              borderWidth: 1,
              borderColor: '#e5e7eb',
              borderRadius: 10,
              padding: 12,
            }}
          >
            <Text style={{ fontWeight: '600', marginBottom: 4 }}>
              Selected:
            </Text>
            <Text numberOfLines={1}>Name: {picked.name}</Text>
            <Text numberOfLines={1}>Type: {picked.type}</Text>
            <Text numberOfLines={1}>URI: {picked.uri}</Text>
          </View>
        ) : (
          <Text style={{ color: '#6b7280' }}>No file selected.</Text>
        )}

        <TouchableOpacity
          onPress={handleUpload}
          disabled={!picked}
          style={{
            marginTop: 16,
            backgroundColor: picked ? '#111827' : '#9ca3af',
            padding: 14,
            borderRadius: 10,
          }}
          activeOpacity={picked ? 0.9 : 1}
        >
          <Text
            style={{ color: '#fff', textAlign: 'center', fontWeight: '700' }}
          >
            Upload
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}
