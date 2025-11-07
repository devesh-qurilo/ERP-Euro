import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export default function InvoiceFilters({ onChange }) {
  return (
    <View
      style={{
        marginBottom: 12,
        padding: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#e5e7eb',
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 8 }}>
        Filters
      </Text>
      <View style={{ flexDirection: 'row' }}>
        {[
          { label: 'All', v: null },
          { label: 'Paid', v: 'PAID' },
          { label: 'Unpaid', v: 'UNPAID' },
          { label: 'Credit Notes', v: 'CREDIT_NOTES' },
        ].map(x => (
          <TouchableOpacity
            key={x.label}
            onPress={() => onChange({ status: x.v })}
            style={{ padding: 6, paddingHorizontal: 10 }}
          >
            <Text>{x.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
