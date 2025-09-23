// src/modules/employee/hr/components/AttendanceMonthTable.js
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native';

const COLS = [
  { key: 'date', label: 'Date', width: 160 },
  { key: 'status', label: 'Status', width: 140 },
  { key: 'clockIn', label: 'Clock In', width: 140 },
  { key: 'clockOut', label: 'Clock Out', width: 140 },
  { key: 'total', label: 'Total', width: 120 },
];
const TABLE_WIDTH = COLS.reduce((s, c) => s + c.width, 0);

const statusColors = {
  PRESENT: { bg: '#dcfce7', fg: '#16a34a', label: 'Present' },
  ABSENT: { bg: '#fee2e2', fg: '#ef4444', label: 'Absent' },
  HOLIDAY: { bg: '#ffe4e6', fg: '#f43f5e', label: 'Holiday' },
  LEAVE: { bg: '#fee2e2', fg: '#ef4444', label: 'Day Off' },
  HALF: { bg: '#fff7ed', fg: '#f59e0b', label: 'Half Day' },
};

function fmtShort(d) {
  const dt = new Date(d);
  const dd = dt.getDate();
  const mm = `${dt.getMonth() + 1}`.toString().padStart(2, '0');
  const yy = `${dt.getFullYear()}`.slice(-2);
  const wk = dt.toLocaleDateString(undefined, { weekday: 'long' });
  return { top: `${dd}.${mm}.${yy}`, bottom: wk };
}
function duration(clockIn, clockOut) {
  if (!clockIn || !clockOut) return '---';
  const [h1, m1] = clockIn.split(':').map(n => +n);
  const [h2, m2] = clockOut.split(':').map(n => +n);
  let mins = h2 * 60 + m2 - (h1 * 60 + m1);
  if (mins < 0) mins += 24 * 60;
  const h = Math.floor(mins / 60),
    m = mins % 60;
  return `${h}h ${m}m`;
}

export default function AttendanceMonthTable({ rows }) {
  const data = useMemo(
    () =>
      (rows || []).map(r => {
        const date = fmtShort(r.date);
        let statusKey = 'ABSENT';
        if (r.holiday) statusKey = 'HOLIDAY';
        else if (r.leave) statusKey = 'LEAVE';
        else if (r.halfDay) statusKey = 'HALF';
        else if (r.isPresent) statusKey = 'PRESENT';
        const col = statusColors[statusKey];

        return {
          id: String(r.attendanceId || r.date),
          dateTop: date.top,
          dateBottom: date.bottom,
          statusPill: { ...col },
          clockIn: r.clockInTime || '---',
          clockOut: r.clockOutTime || '---',
          total: duration(r.clockInTime, r.clockOutTime),
        };
      }),
    [rows],
  );

  const renderRow = ({ item, index }) => (
    <View style={[styles.row, index % 2 ? styles.alt : null]}>
      <View style={[styles.cell, { width: COLS[0].width }]}>
        <Text style={styles.dateTop}>{item.dateTop}</Text>
        <Text style={styles.dateBottom}>{item.dateBottom}</Text>
      </View>

      <View style={[styles.cell, { width: COLS[1].width }]}>
        <View style={[styles.pill, { backgroundColor: item.statusPill.bg }]}>
          <Text style={[styles.pillTxt, { color: item.statusPill.fg }]}>
            {item.statusPill.label}
          </Text>
        </View>
      </View>

      <View style={[styles.cell, { width: COLS[2].width }]}>
        <Text style={styles.text}>{item.clockIn}</Text>
      </View>
      <View style={[styles.cell, { width: COLS[3].width }]}>
        <Text style={styles.text}>{item.clockOut}</Text>
      </View>
      <View style={[styles.cell, { width: COLS[4].width }]}>
        <Text style={styles.text}>{item.total}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Attendance</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator
        contentContainerStyle={{ minWidth: TABLE_WIDTH }}
      >
        <View style={{ width: TABLE_WIDTH }}>
          <View style={[styles.row, styles.headRow]}>
            {COLS.map(c => (
              <View key={c.key} style={[styles.cell, { width: c.width }]}>
                <Text style={[styles.text, styles.head]}>{c.label}</Text>
              </View>
            ))}
          </View>
          <FlatList
            data={data}
            keyExtractor={it => it.id}
            renderItem={renderRow}
            nestedScrollEnabled
            contentContainerStyle={{ paddingBottom: 10 }}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  title: { fontSize: 22, fontWeight: '900', color: '#111827', marginLeft: 4 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e7eb',
    minHeight: 56,
    paddingHorizontal: 6,
  },
  headRow: {
    backgroundColor: '#f7f8fa',
    borderBottomWidth: 0,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  alt: { backgroundColor: '#fafbfc' },
  cell: { justifyContent: 'center', paddingVertical: 10, paddingRight: 8 },
  text: { fontSize: 16, color: '#1f2328' },
  head: { fontWeight: '800', color: '#4b5563' },
  dateTop: { fontSize: 16, fontWeight: '800', color: '#111827' },
  dateBottom: { marginTop: 4, fontSize: 12, color: '#6b7280' },
  pill: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  pillTxt: { fontWeight: '900' },
});
