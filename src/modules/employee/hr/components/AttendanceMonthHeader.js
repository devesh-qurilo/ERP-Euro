// src/modules/employee/hr/components/AttendanceMonthHeader.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const WEEK = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];

export default function AttendanceMonthHeader({
  year,
  monthIndex,
  dayWidth,
  leftWidth,
  totalWidth,
}) {
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  return (
    <View style={styles.wrap}>
      <View style={[styles.leftHead, { width: leftWidth }]}>
        <Text style={styles.leftText}>Employee</Text>
      </View>
      {Array.from({ length: daysInMonth }).map((_, i) => {
        const day = i + 1;
        const d = new Date(year, monthIndex, day);
        return (
          <View key={day} style={[styles.dayCell, { width: dayWidth }]}>
            <Text style={styles.dayNum}>{day}</Text>
            <Text style={styles.dayWeek}>{WEEK[d.getDay()]}</Text>
          </View>
        );
      })}
      <View style={[styles.totalHead, { width: totalWidth }]}>
        <Text style={styles.leftText}>Total</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f1ff',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  leftHead: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: '#e5e7eb',
  },
  totalHead: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderLeftColor: '#e5e7eb',
  },
  leftText: { fontWeight: '800', color: '#111827' },
  dayCell: {
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: '#eef2f7',
  },
  dayNum: { fontWeight: '800', color: '#111827' },
  dayWeek: { fontSize: 11, color: '#6b7280' },
});
