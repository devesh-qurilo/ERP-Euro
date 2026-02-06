import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function DateFilterField({ label, value, onChange }) {
  const [open, setOpen] = useState(false);

  const displayValue = value ? (
    new Date(value).toLocaleDateString()
  ) : (
    <Text style={{ fontSize: 13 }}>{label}</Text>
  );

  return (
    <View style={{ marginBottom: 10 }}>
      {/* <Text style={{ fontSize: 11, fontWeight: '700', color: '#6b7280' }}>
        {label}
      </Text> */}

      <Pressable
        onPress={() => setOpen(true)}
        style={{
          marginTop: 4,
          paddingVertical: 10,
          paddingHorizontal: 12,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: '#e5e7eb',
          backgroundColor: '#fff',
        }}
      >
        <Text style={{ fontSize: 13, color: '#111827' }}>{displayValue}</Text>
      </Pressable>

      {open && (
        <DateTimePicker
          value={value ? new Date(value) : new Date()}
          mode="date"
          display="default"
          onChange={(e, selectedDate) => {
            setOpen(false);
            if (selectedDate) {
              onChange(
                selectedDate.toISOString().slice(0, 10), // YYYY-MM-DD
              );
            }
          }}
        />
      )}
    </View>
  );
}
