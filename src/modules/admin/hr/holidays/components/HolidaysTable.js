import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const dayName = d =>
  new Date(d).toLocaleDateString(undefined, { weekday: 'long' });

export default function HolidaysTable({ data = [], loading }) {
  return (
    <View style={s.card}>
      <ScrollView horizontal showsHorizontalScrollIndicator>
        <View style={{ minWidth: 900 }}>
          {/* header */}
          <View style={[s.row, s.header]}>
            <Text style={[s.cell, s.hcell, { flex: 1 }]}>Date</Text>
            <Text style={[s.cell, s.hcell, { flex: 1 }]}>Day</Text>
            <Text style={[s.cell, s.hcell, { flex: 2 }]}>Occasion</Text>
            <Text style={[s.cell, s.hcell, { width: 120 }]}>Created On</Text>
          </View>

          {loading ? (
            <Text style={{ padding: 12 }}>Loading…</Text>
          ) : (
            data.map((h, idx) => (
              <View key={idx} style={s.row}>
                <Text style={[s.cell, { flex: 1 }]}>{h.date}</Text>
                <Text style={[s.cell, { flex: 1 }]}>{dayName(h.date)}</Text>
                <Text style={[s.cell, { flex: 2 }]} numberOfLines={1}>
                  {h.occasion}
                </Text>
                <Text style={[s.cell, { width: 120 }]}>
                  {(h.createdAt || '').slice(0, 10) || '—'}
                </Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  header: { backgroundColor: '#f8fafc' },
  cell: { paddingVertical: 14, paddingHorizontal: 12, color: '#111827' },
  hcell: { fontWeight: '800', color: '#0b0b0c' },
});
