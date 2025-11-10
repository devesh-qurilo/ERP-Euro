import React from 'react';
import { View, Text, TextInput } from 'react-native';

export default function TaskFiltersPanel({
  duration,
  onDuration,
  status,
  onStatus,
}) {
  const input = {
    flex: 1,
    minWidth: 220,
    height: 38,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 10,
  };
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
        onChangeText={onDuration}
        placeholder="Start Date to End Date"
        style={input}
      />
      <Text style={{ color: '#374151', marginLeft: 12 }}>Status</Text>
      <TextInput
        value={status}
        onChangeText={onStatus}
        placeholder="Waiting / Doing ..."
        style={[input, { width: 150 }]}
      />
    </View>
  );
}
