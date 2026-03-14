import React from 'react';
import {
  Modal,
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
} from 'react-native';

export default function FilterModal({
  visible,
  title,
  options,
  value,
  onSelect,
  onClose,
}) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <Pressable onPress={onClose}>
              <Text style={styles.close}>Close</Text>
            </Pressable>
          </View>

          <ScrollView>
            {options.map(opt => (
              <Pressable
                key={String(opt)}
                style={[styles.item, value === opt && styles.itemActive]}
                onPress={() => {
                  onSelect(opt);
                  onClose();
                }}
              >
                <Text
                  style={[
                    styles.itemText,
                    value === opt && styles.itemTextActive,
                  ]}
                >
                  {opt}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },

  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '70%',
    padding: 16,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
  },

  close: {
    color: '#2563eb',
    fontWeight: '600',
  },

  item: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  itemActive: {
    backgroundColor: '#eff6ff',
  },

  itemText: {
    fontSize: 15,
  },

  itemTextActive: {
    color: '#2563eb',
    fontWeight: '600',
  },
});
