import React, { useMemo, useState } from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  TextInput,
  ScrollView,
} from 'react-native';

export default function BottomSheetSelect({
  visible,
  title = 'Select',
  options = [], // [{ value, label, group }]
  value,
  onSelect,
  onClose,
  placeholder = 'Select option',
}) {
  const [q, setQ] = useState('');

  const filtered = useMemo(() => {
    if (!q.trim()) return options;
    return options.filter(o => o.label.toLowerCase().includes(q.toLowerCase()));
  }, [q, options]);

  const grouped = useMemo(() => {
    const map = {};
    filtered.forEach(o => {
      const g = o.group || 'Others';
      if (!map[g]) map[g] = [];
      map[g].push(o);
    });
    return map;
  }, [filtered]);

  const selected = options.find(o => o.value === value);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.sheet}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <Pressable onPress={onClose}>
            <Text style={styles.close}>✕</Text>
          </Pressable>
        </View>

        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder="Search..."
          placeholderTextColor="#9ca3af"
          style={styles.search}
        />

        <ScrollView>
          {Object.keys(grouped).map(group => (
            <View key={group}>
              <Text style={styles.group}>{group}</Text>
              {grouped[group].map(o => (
                <Pressable
                  key={o.value}
                  style={[styles.item, o.value === value && styles.itemActive]}
                  onPress={() => {
                    onSelect(o);
                    onClose();
                  }}
                >
                  <Text
                    style={[
                      styles.itemTxt,
                      o.value === value && styles.itemTxtActive,
                    ]}
                  >
                    {o.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          ))}
          {!filtered.length && (
            <Text style={styles.empty}>No results found</Text>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 12,
  },
  header: {
    padding: 14,
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: { fontSize: 16, fontWeight: '900' },
  close: { fontWeight: '900', fontSize: 18 },

  search: {
    margin: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    padding: 10,
    color: '#111827',
  },

  group: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    fontSize: 12,
    fontWeight: '800',
    color: '#6b7280',
  },
  item: {
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  itemActive: {
    backgroundColor: '#eef2ff',
  },
  itemTxt: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  itemTxtActive: {
    fontWeight: '900',
  },
  empty: {
    padding: 20,
    textAlign: 'center',
    color: '#6b7280',
  },
});
