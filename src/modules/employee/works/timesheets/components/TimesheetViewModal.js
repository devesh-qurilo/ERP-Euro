import React from 'react';
import { Modal, View, Text, StyleSheet, Pressable, Image } from 'react-native';

const fmtDate = d => (d ? new Date(d).toLocaleDateString() : '—');
const fmtTime = t => (t ? t.slice(0, 5) : '—');

export default function TimesheetViewModal({ visible, item, onClose }) {
  if (!visible || !item) return null;

  const emp = item.employees?.[0];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.h2}>Timesheet Details</Text>
            <Pressable onPress={onClose}>
              <Text style={{ fontWeight: '900' }}>✕</Text>
            </Pressable>
          </View>

          <View style={{ padding: 12, gap: 8 }}>
            <Row
              k="Employee"
              v={
                <View
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
                >
                  {emp?.profileUrl ? (
                    <Image
                      source={{ uri: emp.profileUrl }}
                      style={styles.avatar}
                    />
                  ) : (
                    <View style={[styles.avatar, styles.avatarEmpty]}>
                      <Text>👤</Text>
                    </View>
                  )}
                  <Text style={styles.v}>{emp?.name || item.employeeId}</Text>
                </View>
              }
            />
            <Row k="Project" v={`#${item.projectId ?? '—'}`} />
            <Row k="Task ID" v={String(item.taskId ?? '—')} />
            <Row
              k="Start"
              v={`${fmtDate(item.startDate)} ${fmtTime(item.startTime)}`}
            />
            <Row
              k="End"
              v={`${fmtDate(item.endDate)} ${fmtTime(item.endTime)}`}
            />
            <Row k="Hours" v={`${item.durationHours ?? 0} h`} />
            <Row k="Memo" v={item.memo || '—'} />
          </View>

          {/* Future: Edit button (disabled for now) */}
          <View style={{ padding: 12, paddingTop: 0 }}>
            <Pressable disabled style={[styles.primaryBtn, { opacity: 0.5 }]}>
              <Text style={styles.primaryTxt}>Edit (coming soon)</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const Row = ({ k, v }) => (
  <View style={{ marginBottom: 6 }}>
    <Text style={styles.k}>{k}</Text>
    {typeof v === 'string' ? <Text style={styles.v}>{v}</Text> : v}
  </View>
);

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '90%',
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
  k: { color: '#6b7280', marginBottom: 2, fontWeight: '800' },
  v: { color: '#111827', fontWeight: '900' },
  primaryBtn: {
    backgroundColor: '#111827',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignSelf: 'flex-start',
  },
  primaryTxt: { color: '#fff', fontWeight: '900' },
  avatar: { width: 36, height: 36, borderRadius: 18 },
  avatarEmpty: {
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
