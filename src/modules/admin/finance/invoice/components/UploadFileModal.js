import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, TextInput } from 'react-native';

export default function UploadFileModal({ visible, onClose, onSubmit }) {
  // RN picker integration can be added; for now take a URI/name/type quickly
  const [uri, setUri] = useState('');
  const [name, setName] = useState('');
  const [type, setType] = useState('application/octet-stream');

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: '#fff', padding: 16 }}>
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

        <Text>File URI</Text>
        <TextInput
          value={uri}
          onChangeText={setUri}
          placeholder="file:///..."
          style={{
            borderWidth: 1,
            borderColor: '#e5e7eb',
            borderRadius: 10,
            padding: 10,
            marginBottom: 10,
          }}
        />
        <Text>Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="receipt.pdf"
          style={{
            borderWidth: 1,
            borderColor: '#e5e7eb',
            borderRadius: 10,
            padding: 10,
            marginBottom: 10,
          }}
        />
        <Text>MIME Type</Text>
        <TextInput
          value={type}
          onChangeText={setType}
          placeholder="application/pdf"
          style={{
            borderWidth: 1,
            borderColor: '#e5e7eb',
            borderRadius: 10,
            padding: 10,
            marginBottom: 12,
          }}
        />

        <TouchableOpacity
          onPress={() => onSubmit({ uri, name, type })}
          style={{ backgroundColor: '#111827', padding: 14, borderRadius: 10 }}
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
