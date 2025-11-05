import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function MemberAttendanceTable({ data }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator
      contentContainerStyle={{ minWidth: 660 }}
    >
      <View style={styles.table}>
        <View style={[styles.row, styles.head]}>
          {['Date', 'Status', 'Clock In', 'Clock Out', 'Total'].map(h => (
            <Text key={h} style={[styles.cell, styles.th]}>
              {h}
            </Text>
          ))}
        </View>
        {data.map((r, i) => (
          <View key={i} style={styles.row}>
            <Text style={styles.cell}>{r.date}</Text>
            <Text style={styles.cell}>{r.status}</Text>
            <Text style={styles.cell}>{r.clockInTime ?? '—'}</Text>
            <Text style={styles.cell}>{r.clockOutTime ?? '—'}</Text>
            <Text style={styles.cell}>{r.isPresent ? '8h' : '—'}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  table: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    overflow: 'hidden',
  },
  head: { backgroundColor: '#f8fafc' },
  row: {
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eef2f7',
  },
  cell: {
    width: 130,
    paddingVertical: 12,
    paddingHorizontal: 10,
    color: '#0b0b0c',
  },
  th: { fontWeight: '900', color: '#111827' },
});
