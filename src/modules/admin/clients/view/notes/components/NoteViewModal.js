import React from 'react';
import { Modal, View, Text, Pressable, StyleSheet } from 'react-native';

export default function NoteViewModal({ visible, onClose, item }) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>Note</Text>
          <Row k="Title" v={item?.title} />
          <Row k="Type" v={item?.type} />
          <Row k="Detail" v={item?.detail} big />
          <Row k="Created By" v={item?.createdBy} />
          <Row
            k="Created At"
            v={item?.createdAt?.replace('T', ' ').replace('Z', '')}
          />
          <View style={{ alignItems: 'flex-end', marginTop: 8 }}>
            <Pressable onPress={onClose} style={styles.btn}>
              <Text style={styles.btnTxt}>Close</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const Row = ({ k, v, big = false }) => (
  <View style={{ marginBottom: 8 }}>
    <Text style={{ color: '#6b7280', fontSize: 12, marginBottom: 2 }}>{k}</Text>
    <Text style={[{ color: '#111827' }, big && { lineHeight: 20 }]}>
      {v ?? '—'}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  title: { fontSize: 18, fontWeight: '800', color: '#0b0b0c', marginBottom: 8 },
  btn: {
    borderWidth: 1,
    borderColor: '#1d4ed8',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  btnTxt: { fontWeight: '600', color: '#111827' },
});
