import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

/* ---------------- helpers ---------------- */

const fmtDate = d => (d ? new Date(d).toLocaleDateString() : '—');
const fmtTime = t => (t ? t.slice(0, 5) : '—');
const fmtDateTime = d => (d ? new Date(d).toLocaleString() : '—');

const InfoRow = ({ label, value }) => (
  <View style={s.row}>
    <Text style={s.label}>{label}</Text>
    <Text style={s.value}>{value ?? '—'}</Text>
  </View>
);

/* ---------------- main ---------------- */

export default function TimesheetViewModal({ visible, onClose, data }) {
  if (!visible || !data) return null;

  const emp = data.employees?.[0];

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <View style={s.backdrop}>
        <View style={s.sheet}>
          {/* HEADER */}
          <View style={s.header}>
            <View>
              <Text style={s.title}>Timesheet Details</Text>
              <Text style={s.sub}>
                {fmtDate(data.startDate)} {fmtTime(data.startTime)} →{' '}
                {fmtTime(data.endTime)}
              </Text>
            </View>

            <Pressable onPress={onClose} style={s.closeBtn}>
              <Icon name="close" size={22} color="#111827" />
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={s.body}>
            {/* HOURS */}
            <View style={s.hoursCard}>
              <Text style={s.hours}>{data.durationHours ?? 0}</Text>
              <Text style={s.hoursLabel}>Hours Logged</Text>
            </View>

            {/* EMPLOYEE */}
            <View style={s.card}>
              <Text style={s.cardTitle}>Employee</Text>

              <View style={s.empRow}>
                {emp?.profileUrl ? (
                  <Image source={{ uri: emp.profileUrl }} style={s.avatar} />
                ) : (
                  <View style={[s.avatar, s.avatarEmpty]}>
                    <Text>👤</Text>
                  </View>
                )}

                <View style={{ flex: 1 }}>
                  <Text style={s.empName}>{emp?.name || data.employeeId}</Text>
                  <Text style={s.empMeta}>
                    {emp?.designation || '—'} • {emp?.department || '—'}
                  </Text>
                  <Text style={s.empId}>#{data.employeeId}</Text>
                </View>
              </View>
            </View>

            {/* PROJECT & TASK */}
            <View style={s.card}>
              <Text style={s.cardTitle}>Work Details</Text>

              <InfoRow
                label="Project"
                value={`${data.projectName} (${data.projectShortCode})`}
              />
              <InfoRow
                label="Task"
                value={`${data.taskName} (#${data.taskId})`}
              />
            </View>

            {/* TIME */}
            <View style={s.card}>
              <Text style={s.cardTitle}>Time</Text>

              <InfoRow
                label="Start"
                value={`${fmtDate(data.startDate)} ${fmtTime(data.startTime)}`}
              />
              <InfoRow
                label="End"
                value={`${fmtDate(data.endDate)} ${fmtTime(data.endTime)}`}
              />
            </View>

            {/* MEMO */}
            <View style={s.card}>
              <Text style={s.cardTitle}>Work Summary</Text>
              <Text style={s.memo}>{data.memo || '—'}</Text>
            </View>

            {/* META */}
            <View style={s.meta}>
              <Text style={s.metaTxt}>
                Created By: <Text style={s.metaVal}>{data.createdBy}</Text>
              </Text>
              <Text style={s.metaTxt}>
                Created At:{' '}
                <Text style={s.metaVal}>{fmtDateTime(data.createdAt)}</Text>
              </Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

/* ---------------- styles ---------------- */

const s = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },

  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },

  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0b0b0c',
  },

  sub: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },

  closeBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },

  body: {
    padding: 16,
    gap: 14,
  },

  hoursCard: {
    backgroundColor: '#1d4ed8',
    borderRadius: 16,
    paddingVertical: 22,
    alignItems: 'center',
  },

  hours: {
    fontSize: 44,
    fontWeight: '900',
    color: '#fff',
  },

  hoursLabel: {
    color: '#9ca3af',
    fontWeight: '800',
    marginTop: 4,
  },

  card: {
    backgroundColor: '#f9fafb',
    borderRadius: 14,
    padding: 14,
    gap: 10,
  },

  cardTitle: {
    fontWeight: '900',
    color: '#111827',
    marginBottom: 4,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },

  label: {
    color: '#6b7280',
    fontWeight: '800',
  },

  value: {
    fontWeight: '900',
    color: '#111827',
    textAlign: 'right',
    flexShrink: 1,
  },

  empRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },

  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },

  avatarEmpty: {
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },

  empName: {
    fontWeight: '900',
    fontSize: 16,
    color: '#111827',
  },

  empMeta: {
    color: '#6b7280',
    fontSize: 12,
  },

  empId: {
    color: '#9ca3af',
    fontSize: 11,
    marginTop: 2,
  },

  memo: {
    color: '#111827',
    lineHeight: 20,
  },

  meta: {
    alignItems: 'center',
    marginTop: 6,
    gap: 4,
  },

  metaTxt: {
    fontSize: 12,
    color: '#6b7280',
  },

  metaVal: {
    fontWeight: '800',
    color: '#111827',
  },
});
