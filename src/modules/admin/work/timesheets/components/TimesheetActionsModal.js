import React from 'react';
import { Modal, View, Text, StyleSheet, Pressable } from 'react-native';

export default function TimesheetActionMenu({
  visible,
  onClose,
  onView,
  onEdit,
  onDelete,
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <View style={styles.menu}>
          <MenuItem label="View" onPress={onView} />
          <MenuItem label="Edit" onPress={onEdit} />
          <MenuItem label="Delete" danger onPress={onDelete} />
        </View>
      </Pressable>
    </Modal>
  );
}

function MenuItem({ label, onPress, danger }) {
  return (
    <Pressable onPress={onPress} style={styles.item}>
      <Text style={[styles.itemTxt, danger && styles.danger]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menu: {
    width: 200,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 5,
  },
  item: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
  },
  itemTxt: {
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
  },
  danger: {
    color: '#b00020',
  },
});
