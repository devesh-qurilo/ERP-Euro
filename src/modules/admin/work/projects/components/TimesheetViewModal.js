import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const Row = ({ label, value }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value || '—'}</Text>
  </View>
);

export default function TimesheetViewModal({ visible, data, onClose }) {
  if (!visible || !data) return null;

  const emp = data.employees?.[0];

  return (
    <Modal visible transparent animationType="slide">
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Timesheet Details</Text>
            <Pressable onPress={onClose} hitSlop={10}>
              <Icon name="close" size={26} />
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={styles.body}>
            <Row label="Employee" value={emp?.name} />
            <Row label="Designation" value={emp?.designation} />
            <Row label="Project" value={data.projectName} />
            <Row label="Task" value={data.taskName} />

            <Row label="Start" value={`${data.startDate} ${data.startTime}`} />
            <Row label="End" value={`${data.endDate} ${data.endTime}`} />

            <Row label="Duration" value={`${data.durationHours} hrs`} />
            <Row label="Memo" value={data.memo} />
            <Row label="Created By" value={data.createdBy} />
            <Row label="Created At" value={data.createdAt} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '90%',
  },
  header: {
    padding: 14,
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: { fontSize: 18, fontWeight: '900' },
  body: { padding: 14 },
  row: { marginBottom: 12 },
  label: { fontSize: 12, fontWeight: '800', color: '#6b7280' },
  value: { fontSize: 14, fontWeight: '600', color: '#111827' },
});
