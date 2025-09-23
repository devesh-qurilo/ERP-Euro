// src/modules/employee/hr/components/AttendanceLegend.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AttendanceLegend() {
  return (
    <View style={styles.wrap}>
      <Text style={styles.note}>Note :</Text>
      <Text style={styles.item}>
        <Text style={styles.star}>★</Text> → Holiday
      </Text>
      <Text style={styles.item}>
        <Text style={styles.dayoff}>🎁</Text> → Day Off
      </Text>
      <Text style={styles.item}>
        <Text style={styles.tick}>✔</Text> → Present
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  note: { fontWeight: '900', color: '#111827' },
  item: { color: '#374151', fontWeight: '700' },
  star: { color: '#ef4444' },
  dayoff: { color: '#ef4444' },
  tick: { color: '#16a34a' },
});
