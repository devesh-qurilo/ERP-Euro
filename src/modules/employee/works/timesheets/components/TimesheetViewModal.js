import React from 'react';
import { Modal, View, Text, StyleSheet, Pressable } from 'react-native';

const fmtDate = d => (d ? new Date(d).toLocaleDateString() : '—');
const fmtTime = t => (t ? t.slice(0, 5) : '—');

export default function TimesheetViewModal({ visible, onClose, data }) {
  if (!visible || !data) return null;
  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <View style={s.backdrop}>
        <View style={s.sheet}>
          <View style={s.header}>
            <Text style={s.h2}>Timesheet Details</Text>
            <Pressable onPress={onClose}>
              <Text style={{ fontWeight: '900' }}>✕</Text>
            </Pressable>
          </View>
          <View style={{ padding: 12, gap: 8 }}>
            <Text>
              <Text style={s.k}>Employee: </Text>
              {data.employees?.[0]?.name || data.employeeId}
            </Text>
            <Text>
              <Text style={s.k}>Project: </Text>
              {data.projectId}
            </Text>
            <Text>
              <Text style={s.k}>Task: </Text>
              {data.taskId}
            </Text>
            <Text>
              <Text style={s.k}>Start: </Text>
              {fmtDate(data.startDate)} {fmtTime(data.startTime)}
            </Text>
            <Text>
              <Text style={s.k}>End: </Text>
              {fmtDate(data.endDate)} {fmtTime(data.endTime)}
            </Text>
            <Text>
              <Text style={s.k}>Hours: </Text>
              {data.durationHours ?? 0}h
            </Text>
            <Text>
              <Text style={s.k}>Memo: </Text>
              {data.memo || '—'}
            </Text>
            <Text style={{ color: '#6b7280' }}>
              * Edit flow will come later.
            </Text>
          </View>
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
    maxHeight: '80%',
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
  k: { color: '#6b7280', fontWeight: '800' },
});
