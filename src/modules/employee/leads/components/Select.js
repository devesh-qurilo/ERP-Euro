// src/modules/employee/leads/components/Select.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

export default function Select({ label, value, options, onChange, style }) {
  const [open, setOpen] = useState(false);
  return (
    <View style={[styles.wrap, style]}>
      {!!label && <Text style={styles.label}>{label}</Text>}
      <Pressable onPress={() => setOpen(v => !v)} style={styles.btn}>
        <Text style={styles.value} numberOfLines={1}>
          {value}
        </Text>
        <Text style={styles.caret}>{open ? '▴' : '▾'}</Text>
      </Pressable>
      {open && (
        <View style={styles.menu}>
          {options.map(opt => (
            <Pressable
              key={String(opt)}
              onPress={() => {
                onChange(opt);
                setOpen(false);
              }}
              style={styles.item}
            >
              <Text style={styles.itemTxt}>{opt}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  wrap: { position: 'relative' },
  label: { fontSize: 12, fontWeight: '800', color: '#374151', marginBottom: 4 },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    minWidth: 120,
  },
  value: { fontSize: 15, color: '#111827', flexGrow: 1, marginRight: 8 },
  caret: { fontSize: 14, color: '#6b7280' },
  menu: {
    position: 'absolute',
    top: 64,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
    zIndex: 30,
  },
  item: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#f1f5f9',
  },
  itemTxt: { fontSize: 15, color: '#111827' },
});
