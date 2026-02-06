import React, { useState } from 'react';
import { Modal, View, Text, TextInput, Pressable } from 'react-native';

export default function AddOptionModal({
  visible,
  title,
  placeholder,
  onSave,
  onClose,
}) {
  const [value, setValue] = useState('');

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={{ flex: 1, justifyContent: 'center', padding: 16 }}>
        <View
          style={{ backgroundColor: '#fff', borderRadius: 14, padding: 16 }}
        >
          <Text style={{ fontWeight: '900', marginBottom: 8 }}>{title}</Text>

          <TextInput
            placeholder={placeholder}
            value={value}
            onChangeText={setValue}
            style={{
              borderWidth: 1,
              borderColor: '#e5e7eb',
              borderRadius: 10,
              padding: 10,
            }}
          />

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              gap: 8,
              marginTop: 12,
            }}
          >
            <Pressable onPress={onClose}>
              <Text>Cancel</Text>
            </Pressable>
            <Pressable
              onPress={async () => {
                await onSave(value.trim());
                setValue('');
                onClose();
              }}
            >
              <Text style={{ fontWeight: '900' }}>Save</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
