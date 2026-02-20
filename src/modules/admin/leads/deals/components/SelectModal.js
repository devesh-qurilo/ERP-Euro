// components/SelectModal.js

import React from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
} from 'react-native';

export default function SelectModal({
  visible,
  options = [],
  onSelect,
  onClose,
}) {
  if (!visible) return null;

  return (
    <Modal transparent animationType="fade">
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.card}>
          <ScrollView>
            {options.map(opt => (
              <Pressable
                key={opt.value}
                style={styles.item}
                onPress={() => {
                  onSelect(opt.value);
                  onClose();
                }}
              >
                <Text>{opt.label}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    maxHeight: '60%',
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
});
