import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';
const fmt = d => (d ? new Date(d).toLocaleDateString() : '—');

export default function TimesheetCalendarModal({
  visible,
  onClose,
  items = [],
}) {
  if (!visible) return null;
  const byDay = items.reduce((acc, t) => {
    const k = t.startDate || '—';
    (acc[k] ||= []).push(t);
    return acc;
  }, {});
  const days = Object.keys(byDay).sort((a, b) => new Date(a) - new Date(b));

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <View style={s.backdrop}>
        <View style={s.sheet}>
          <View style={s.header}>
            <Text style={s.h2}>Calendar (grouped by start date)</Text>
            <Pressable onPress={onClose}>
              <Text style={{ fontWeight: '900' }}>✕</Text>
            </Pressable>
          </View>
          <ScrollView contentContainerStyle={{ padding: 12, gap: 10 }}>
            {days.map(d => (
              <View key={d} style={s.day}>
                <Text style={s.dayTitle}>{fmt(d)}</Text>
                {byDay[d].map(ts => (
                  <Text key={ts.id} style={s.row}>
                    • #{ts.taskId} {ts.memo || ''} ({ts.durationHours ?? 0}h)
                  </Text>
                ))}
              </View>
            ))}
            {!days.length && (
              <Text style={{ color: '#6b7280' }}>No entries.</Text>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
const s = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '85%',
  },
  header: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  h2: { fontSize: 18, fontWeight: '900', color: '#0b0b0c' },
  day: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 10,
  },
  dayTitle: { fontWeight: '900', color: '#111827', marginBottom: 6 },
  row: { color: '#111827' },
});
