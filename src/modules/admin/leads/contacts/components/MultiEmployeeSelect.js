import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';

export default function MultiEmployeeSelect({
  value = [],
  options = [],
  onChange,
  onClose,
}) {
  return (
    <View style={styles.dropdown}>
      <ScrollView>
        {options.map(opt => {
          const selected = value.includes(opt.value);

          return (
            <Pressable
              key={opt.value}
              onPress={() => {
                if (selected) {
                  onChange(value.filter(v => v !== opt.value));
                } else {
                  onChange([...value, opt.value]);
                }
              }}
            >
              <Text style={styles.container}>
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
  container: {
    backgroundColor: '#fff',
    // maxHeight: '55%',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    padding: 3,
  },
  dropdown: {
    borderWidth: 1,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },

  doneBtn: {
    marginTop: 10,
    backgroundColor: '#1343ad',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },

  doneTxt: {
    color: '#fff',
    fontWeight: '900',
  },
});
