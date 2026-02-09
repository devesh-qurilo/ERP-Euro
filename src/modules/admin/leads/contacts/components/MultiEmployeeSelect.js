import React from 'react';
import { View, Text, Pressable } from 'react-native';

export default function MultiEmployeeSelect({ value = [], options, onChange }) {
  const toggle = v => {
    if (value.includes(v)) {
      onChange(value.filter(x => x !== v));
    } else {
      onChange([...value, v]);
    }
  };

  return (
    <View style={{ gap: 6 }}>
      {options.map(o => {
        const active = value.includes(o.value);
        return (
          <Pressable
            key={o.value}
            onPress={() => toggle(o.value)}
            style={{
              padding: 8,
              borderRadius: 8,
              backgroundColor: active ? '#111827' : '#f3f4f6',
            }}
          >
            <Text style={{ color: active ? '#fff' : '#111827' }}>
              {o.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
