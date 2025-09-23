// src/modules/employee/hr/components/AttendanceIcons.js
import React from 'react';
import { Text, StyleSheet } from 'react-native';

export const PresentIcon = () => (
  <Text style={[styles.icon, { color: '#16a34a' }]}>✓</Text>
);
export const LateIcon = () => (
  <Text style={[styles.icon, { color: '#f59e0b' }]}>!</Text>
);
export const HalfDayIcon = () => (
  <Text style={[styles.icon, { color: '#ef4444' }]}>★</Text>
);
export const HolidayIcon = () => (
  <Text style={[styles.icon, { color: '#ef4444' }]}>🎁</Text>
);
export const LeaveIcon = () => (
  <Text style={[styles.icon, { color: '#ef4444' }]}>🏖️</Text>
);
export const AbsentIcon = () => (
  <Text style={[styles.icon, { color: '#ef4444' }]}>×</Text>
);

export const IconForRecord = r => {
  if (!r) return <Text style={[styles.icon, { color: '#cbd5e1' }]}>·</Text>;
  if (r.holiday) return <HolidayIcon />;
  if (r.leave) return <LeaveIcon />;
  if (r.halfDay) return <HalfDayIcon />;
  if (r.isPresent) return r.late ? <LateIcon /> : <PresentIcon />;
  return <AbsentIcon />;
};

const styles = StyleSheet.create({ icon: { fontSize: 16, fontWeight: '900' } });
