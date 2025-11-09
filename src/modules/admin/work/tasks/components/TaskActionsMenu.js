import React, { useState } from 'react';
import { View, TouchableOpacity, Text, Modal, Pressable } from 'react-native';

const Row = ({ label, danger, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      paddingVertical: 12,
      paddingHorizontal: 14,
      borderBottomWidth: 1,
      borderColor: '#F3F4F6',
    }}
  >
    <Text style={{ color: danger ? '#DC2626' : '#111827' }}>{label}</Text>
  </TouchableOpacity>
);

export default function TaskActionsMenu({
  pinned,
  onView,
  onEdit,
  onPin,
  onDelete,
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <TouchableOpacity
        onPress={() => setOpen(true)}
        style={{
          backgroundColor: '#fff',
          borderWidth: 1,
          borderColor: '#E5E7EB',
          paddingHorizontal: 10,
          paddingVertical: 8,
          borderRadius: 8,
        }}
      >
        <Text>⋮</Text>
      </TouchableOpacity>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.25)' }}
          onPress={() => setOpen(false)}
        >
          <View
            style={{
              position: 'absolute',
              right: 20,
              top: 150,
              backgroundColor: '#fff',
              borderRadius: 10,
              width: 200,
              overflow: 'hidden',
              borderWidth: 1,
              borderColor: '#EEE',
            }}
          >
            <Row
              label="View"
              onPress={() => {
                setOpen(false);
                onView();
              }}
            />
            <Row
              label="Edit"
              onPress={() => {
                setOpen(false);
                onEdit();
              }}
            />
            <Row
              label={pinned ? 'Unpin Task' : 'Pin Task'}
              onPress={() => {
                setOpen(false);
                onPin();
              }}
            />
            {/* Archive aayega to yahi add kar denge */}
            <Row
              label="Delete"
              danger
              onPress={() => {
                setOpen(false);
                onDelete();
              }}
            />
          </View>
        </Pressable>
      </Modal>
    </>
  );
}
