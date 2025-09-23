// src/modules/employee/hr/components/AttendanceSummary.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function AttendanceSummary({
  workingDays = 0,
  presentDays = 0,
  holidays = 0,
  absentDays = 0,
  halfDays = 0,
}) {
  const items = [
    { title: 'Working Days', value: workingDays, icon: '💼' },
    { title: 'Day Present', value: presentDays, icon: '👤' },
    { title: 'Holidays', value: holidays, icon: '⭐' },
    { title: 'Absent', value: absentDays, icon: '🚫' },
    { title: 'Half Day', value: halfDays, icon: '🌓' },
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator
      contentContainerStyle={styles.row}
    >
      {items.map(it => (
        <View key={it.title} style={styles.card}>
          <Text style={styles.cardTitle}>{it.title}</Text>
          <Text style={styles.big}>{String(it.value)}</Text>
          <Text style={styles.iconRight}>{it.icon}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: 4,
    paddingVertical: 6,
    // If your RN version is older than 0.71, replace gap with marginRight on children
    gap: 12,
  },
  card: {
    width: 180,
    height: 96,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  cardTitle: { color: '#374151', fontWeight: '800', marginBottom: 8 },
  big: { fontSize: 28, fontWeight: '900', color: '#2b2d31' },
  iconRight: {
    position: 'absolute',
    right: 12,
    bottom: 10,
    fontSize: 18,
    color: '#9aa0a6',
  },
});
