import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';

export default function EmployeeSelect({
  label,
  value,
  options,
  onChange,
  placeholder = 'Select employee',
}) {
  const [open, setOpen] = useState(false);

  const selected = options.find(o => o.value === value);

  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={styles.label}>{label}</Text>

      <Pressable style={styles.select} onPress={() => setOpen(o => !o)}>
        <Text style={styles.valueTxt}>{selected?.label || placeholder}</Text>
        <Text style={styles.caret}>▾</Text>
      </Pressable>

      {open && (
        <View style={styles.menu}>
          <ScrollView
            style={{ maxHeight: 220 }}
            showsVerticalScrollIndicator={true}
          >
            {options.map(opt => (
              <Pressable
                key={opt.value}
                style={styles.menuItem}
                onPress={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
              >
                <Text>{opt.label}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 12, fontWeight: '800', marginBottom: 6 },
  select: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  valueTxt: { color: '#111827' },
  caret: { color: '#6b7280' },
  menu: {
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    backgroundColor: '#fff',
    // maxHeight: 220,
  },
  menu: {
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    backgroundColor: '#fff',
    overflow: 'hidden', // 🔥 important for rounded corners
  },

  menuItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
});
