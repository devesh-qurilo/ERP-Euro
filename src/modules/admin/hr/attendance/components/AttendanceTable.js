import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

export default function AttendanceTable({ data }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator
      contentContainerStyle={{ minWidth: 900 }}
    >
      <View style={styles.table}>
        <View style={[styles.row, styles.head]}>
          {[
            'Date',
            'Employee',
            'Status',
            'Clock In',
            'Clock Out',
            'Late',
            'Half Day',
            'Present?',
          ].map(h => (
            <Text key={h} style={[styles.cell, styles.th]}>
              {h}
            </Text>
          ))}
        </View>
        {data.map((r, idx) => (
          <View key={idx} style={styles.row}>
            <Text style={styles.cell}>{r.date}</Text>
            <Text style={styles.cell}>{r.employeeName || r.employeeId}</Text>
            <Text style={styles.cell}>{r.status}</Text>
            <Text style={styles.cell}>{r.clockInTime ?? '—'}</Text>
            <Text style={styles.cell}>{r.clockOutTime ?? '—'}</Text>
            <Text style={styles.cell}>{r.late ? 'Yes' : 'No'}</Text>
            <Text style={styles.cell}>{r.halfDay ? 'Yes' : 'No'}</Text>
            <Text style={styles.cell}>{r.isPresent ? '✔' : '—'}</Text>
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
    width: 140,
    paddingVertical: 12,
    paddingHorizontal: 10,
    color: '#0b0b0c',
  },
  th: { fontWeight: '900', color: '#111827' },
});
