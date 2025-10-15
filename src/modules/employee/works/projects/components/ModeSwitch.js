import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Btn = ({ icon, label, active, onPress }) => (
  <Pressable onPress={onPress} style={[styles.btn, active && styles.btnActive]}>
    <Ionicons
      name={icon}
      size={18}
      style={[styles.ic, active && styles.icActive]}
    />
    <Text style={[styles.tx, active && styles.txActive]}>{label}</Text>
  </Pressable>
);

export default function ModeSwitch({ viewMode, setViewMode, openCalendar }) {
  return (
    <View style={styles.row}>
      <Btn
        icon="list"
        label="List"
        active={viewMode === 'list'}
        onPress={() => setViewMode('list')}
      />
      <Btn
        icon="calendar"
        label="Calendar"
        active={viewMode === 'calendar'}
        onPress={() => setViewMode('calendar')}
      />
      <Btn
        icon="star"
        label="Pinned"
        active={viewMode === 'pinned'}
        onPress={() => setViewMode('pinned')}
      />
      <View style={{ flex: 1 }} />
      <Pressable style={styles.quick} onPress={openCalendar}>
        <Ionicons name="calendar-outline" size={18} />
        <Text style={styles.quickTx}>Open Calendar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#E2E8F0',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  btnActive: { backgroundColor: '#1D4ED8', borderColor: '#1D4ED8' },
  ic: { color: '#0F172A' },
  icActive: { color: '#fff' },
  tx: { color: '#0F172A', fontWeight: '700' },
  txActive: { color: '#fff' },
  quick: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  quickTx: { fontWeight: '600', color: '#0F172A' },
});
