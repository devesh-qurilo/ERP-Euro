import React from 'react';
import { Modal, Pressable, View, TouchableOpacity, Text } from 'react-native';

const getActionsByStatus = status => {
  const S = String(status || '').toUpperCase();
  if (S === 'PAID') {
    return [
      'View',
      'Add receipt',
      'View receipt',
      'Upload file',
      'View payment',
      'Add credit notes',
      'View credit note',
      // 'Create duplicate',
      'Delete',
    ];
  }
  if (S === 'UNPAID') {
    return [
      'View',
      'Edit',
      'Mark as paid',
      'Add payment',
      'View payment',
      'Payment reminder',
      // 'Create duplicate',
      'Delete',
    ];
  }
  if (S.includes('CREDIT')) {
    return [
      'View',
      'Add payment',
      'View payment',
      // 'Create duplicate',
      'Delete',
    ];
  }
  return ['View'];
};

export default function ActionMenu({ visible, row, onSelect, onClose }) {
  if (!visible) return null;
  const options = getActionsByStatus(row?.status);
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.25)',
          justifyContent: 'center',
          padding: 24,
        }}
        onPress={onClose}
      >
        <View
          style={{
            backgroundColor: '#fff',
            borderRadius: 12,
            overflow: 'hidden',
          }}
          onStartShouldSetResponder={() => true}
        >
          {options.map((opt, idx) => (
            <TouchableOpacity
              key={opt}
              onPress={() => onSelect(opt, row)}
              style={{
                padding: 14,
                borderBottomWidth: idx === options.length - 1 ? 0 : 1,
                borderColor: '#eef2f7',
              }}
            >
              <Text style={{ fontSize: 16 }}>{opt}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            onPress={onClose}
            style={{ padding: 14, alignItems: 'center' }}
          >
            <Text style={{ fontWeight: '600' }}>Close</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );
}
