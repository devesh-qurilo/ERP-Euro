import React from 'react';
import { View, Text, TextInput } from 'react-native';

export default function TopFilters({
  status,
  onStatusChange,
  duration,
  onDurationChange,
}) {
  return (
    <View
      style={{
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#eee',
      }}
    >
      <Text style={{ color: '#374151', width: 70 }}>Duration</Text>
      <TextInput
        value={duration}
        onChangeText={onDurationChange}
        placeholder="Start Date to End Date"
        style={inputBox()}
      />
      <Text style={{ color: '#374151', marginLeft: 12 }}>Status</Text>
      <TextInput
        value={status}
        onChangeText={onStatusChange}
        placeholder="Sales / Waiting / Doing..."
        style={[inputBox(), { width: 150 }]}
      />
    </View>
  );
}

const inputBox = () => ({
  flex: 1,
  minWidth: 220,
  height: 38,
  backgroundColor: '#F9FAFB',
  borderWidth: 1,
  borderColor: '#E5E7EB',
  borderRadius: 8,
  paddingHorizontal: 10,
});
