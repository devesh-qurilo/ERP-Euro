import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export default function InvoiceToolbar({ onAdd }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
      }}
    >
      <Text style={{ fontSize: 20, fontWeight: '800' }}>Invoice Details</Text>
      <TouchableOpacity
        onPress={onAdd}
        style={{
          backgroundColor: '#1d4ed8',
          paddingVertical: 12,
          paddingHorizontal: 16,
          borderRadius: 12,
        }}
      >
        <Text style={{ color: '#fff', fontWeight: '600' }}>+ Add Invoice</Text>
      </TouchableOpacity>
    </View>
  );
}
