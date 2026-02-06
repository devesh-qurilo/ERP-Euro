import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

export default function OptionSelectWithAdd({
  label,
  value,
  options,
  onChange,
  onAddPress,
}) {
  const [open, setOpen] = useState(false);

  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.row}>
        <Pressable style={styles.select} onPress={() => setOpen(o => !o)}>
          <Text style={styles.valueTxt}>{value || 'Select'}</Text>
          <Text style={styles.caret}>▾</Text>
        </Pressable>

        <Pressable style={styles.addBtn} onPress={onAddPress}>
          <Text style={styles.addTxt}>＋</Text>
        </Pressable>
      </View>

      {open && (
        <View style={styles.menu}>
          {options.map(opt => (
            <Pressable
              key={opt.id}
              style={styles.menuItem}
              onPress={() => {
                onChange(opt);
                setOpen(false);
              }}
            >
              <Text>{opt.name || opt.categoryName}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 12, fontWeight: '800', marginBottom: 6 },
  row: { flexDirection: 'row', gap: 6 },
  select: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  valueTxt: { color: '#111827' },
  caret: { color: '#6b7280' },
  addBtn: {
    width: 40,
    borderRadius: 10,
    backgroundColor: '#1d4ed8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addTxt: { color: '#fff', fontSize: 18, fontWeight: '900' },
  menu: {
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  menuItem: { padding: 10 },
});
