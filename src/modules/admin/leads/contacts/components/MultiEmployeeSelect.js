import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';

export default function MultiEmployeeSelect({
  value = [],
  options = [],
  onChange,
  onClose,
}) {
  return (
    <View style={styles.sheet}>
      <ScrollView>
        {options.map(opt => {
          const selected = value.includes(opt.value);

          return (
            <Pressable
              key={opt.value}
              style={styles.row}
              onPress={() => {
                if (selected) {
                  onChange(value.filter(v => v !== opt.value));
                } else {
                  onChange([...value, opt.value]);
                }
              }}
            >
              <Text style={styles.text}>
                {selected ? '✅ ' : '⬜ '} {opt.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <Pressable onPress={onClose} style={styles.doneBtn}>
        <Text style={styles.doneTxt}>Done</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    maxHeight: '70%',
  },
  row: {
    paddingVertical: 10,
  },
  text: {
    fontSize: 14,
    color: '#111827',
  },
  doneBtn: {
    marginTop: 12,
    backgroundColor: '#111827',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  doneTxt: {
    color: '#fff',
    fontWeight: '900',
  },
});
