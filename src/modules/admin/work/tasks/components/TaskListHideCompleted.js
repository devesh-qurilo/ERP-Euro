import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export default function HideCompleted({ active, onToggle }) {
  return (
    <TouchableOpacity onPress={onToggle}>
      <View
        style={{
          backgroundColor: '#fff',
          borderRadius: 8,
          borderWidth: 1,
          borderColor: '#E5E7EB',
          paddingHorizontal: 12,
          paddingVertical: 8,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <Text style={{ color: '#111827' }}>
          {active ? 'Showing: Without Completed' : 'Hide Completed Task'}
        </Text>
        <Text style={{ marginLeft: 6 }}>▾</Text>
      </View>
    </TouchableOpacity>
  );
}
