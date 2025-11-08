// src/modules/admin/clients/components/ClientsActionSheet.js
import React from 'react';
import { Modal, Pressable, View, TouchableOpacity, Text } from 'react-native';

export default function ClientsActionSheet({
  visible,
  onClose,
  onView,
  onEdit,
  onDelete,
  onMoveToDeal,
}) {
  if (!visible) return null;
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
          backgroundColor: 'rgba(0,0,0,0.2)',
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
          {[
            { label: 'View', fn: onView },
            { label: 'Edit', fn: onEdit },
            { label: 'Move to deal', fn: onMoveToDeal },
            { label: 'Delete', fn: onDelete, danger: true },
          ].map((x, i) => (
            <TouchableOpacity
              key={x.label}
              onPress={x.fn}
              style={{
                padding: 14,
                borderBottomWidth: i === 3 ? 0 : 1,
                borderColor: '#f1f5f9',
              }}
            >
              <Text style={{ color: x.danger ? '#ef4444' : '#111827' }}>
                {x.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Pressable>
    </Modal>
  );
}
