import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function MemberAttendanceTable({ data }) {
  const calculateHours = (inTime, outTime) => {
    if (!inTime || !outTime) return '—';

    const [h1, m1, s1] = inTime.split(':').map(Number);
    const [h2, m2, s2] = outTime.split(':').map(Number);

    const start = h1 * 3600 + m1 * 60 + s1;
    const end = h2 * 3600 + m2 * 60 + s2;

    const diff = end - start;

    if (diff <= 0) return '—';

    const hours = Math.floor(diff / 3600);
    const minutes = Math.floor((diff % 3600) / 60);

    return `${hours}h ${minutes}m`;
  };
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
            <Text style={styles.cell}>
              {calculateHours(r.clockInTime, r.clockOutTime)}
            </Text>
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
