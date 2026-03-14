import React from 'react';
import { Modal, View, Text, Pressable, StyleSheet } from 'react-native';

export default function ActionModal({
  visible,
  onClose,
  onApprove,
  onReject,
  onDelete,
}) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <Pressable style={styles.overlay} onPress={onClose} />

      <View style={styles.container}>
        <Pressable style={styles.item} onPress={onApprove}>
          <Text style={styles.approve}>Approve</Text>
        </Pressable>

        <Pressable style={styles.item} onPress={onReject}>
          <Text style={styles.reject}>Reject</Text>
        </Pressable>

        <Pressable style={styles.item} onPress={onDelete}>
          <Text style={styles.delete}>Delete</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },

  container: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 10,
    width: 200,
  },

  item: {
    paddingVertical: 12,
    alignItems: 'center',
  },

  approve: {
    color: '#16a34a',
    fontWeight: '700',
  },

  reject: {
    color: '#ef4444',
    fontWeight: '700',
  },

  delete: {
    color: '#111827',
    fontWeight: '700',
  },
});
