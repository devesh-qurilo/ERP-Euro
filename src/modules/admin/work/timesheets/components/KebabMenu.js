import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Modal } from 'react-native';

export default function KebabMenu({ onView, onEdit, onDelete }) {
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  return (
    <>
      <Pressable onPress={() => setOpen(true)} style={styles.kebab}>
        <Text style={styles.kebabTxt}>⋮</Text>
      </Pressable>

      <Modal transparent visible={open} animationType="fade">
        <Pressable style={styles.backdrop} onPress={close}>
          <View style={styles.menu}>
            <Action
              label="View"
              onPress={() => {
                close();
                onView?.();
              }}
            />
            <Action
              label="Edit"
              onPress={() => {
                close();
                onEdit?.();
              }}
            />
            <Action
              label="Delete"
              danger
              onPress={() => {
                close();
                onDelete?.();
              }}
            />
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

function Action({ label, onPress, danger }) {
  return (
    <Pressable onPress={onPress} style={styles.action}>
      <Text style={[styles.actionTxt, danger && styles.danger]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  kebab: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  kebabTxt: {
    fontSize: 18,
    fontWeight: '900',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menu: {
    width: 160,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 6,
    paddingVertical: 6,
  },
  action: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  actionTxt: {
    fontWeight: '800',
    color: '#111827',
  },
  danger: {
    color: '#b00020',
  },
});
