import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  ScrollView,
} from 'react-native';

export default function TaskDetailsModal({ visible, task, onClose }) {
  if (!visible || !task) return null;
  const badge = (txt, color = '#111827') => (
    <View style={[styles.badge, { backgroundColor: '#f3f4f6' }]}>
      <Text style={[styles.badgeTxt, { color }]}>{txt}</Text>
    </View>
  );

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
            <Text style={styles.title}>{task.title}</Text>
            <Pressable onPress={onClose} style={styles.close}>
              <Text style={{ fontWeight: '900' }}>✕</Text>
            </Pressable>
          </View>
          <ScrollView contentContainerStyle={{ paddingBottom: 16 }}>
            <Text style={styles.label}>Priority</Text>
            {badge(
              task.priority || '—',
              task.priority === 'HIGH'
                ? '#ef4444'
                : task.priority === 'MEDIUM'
                ? '#f59e0b'
                : '#10b981',
            )}

            <Text style={styles.label}>Stage</Text>
            {badge(task.taskStage?.name || '—', '#2563eb')}

            <Text style={styles.label}>Dates</Text>
            <Text style={styles.rowText}>
              Start: {fmt(task.startDate)} • Due:{' '}
              {task.noDueDate ? 'No due date' : fmt(task.dueDate)}
            </Text>

            <Text style={styles.label}>Estimate</Text>
            <Text style={styles.rowText}>
              {minsToH(task.timeEstimateMinutes)}
            </Text>

            <Text style={styles.label}>Milestone</Text>
            <Text style={styles.rowText}>{task.milestone?.title || '—'}</Text>

            <Text style={styles.label}>Assigned</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {(task.assignedEmployees || []).map((m, i) =>
                m.profileUrl ? (
                  <Image
                    key={i}
                    source={{ uri: m.profileUrl }}
                    style={styles.avatar}
                  />
                ) : (
                  <View key={i} style={[styles.avatar, styles.avatarEmpty]}>
                    <Text>👤</Text>
                  </View>
                ),
              )}
            </View>

            <Text style={styles.label}>Labels</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {(task.labels || []).map(l => (
                <View
                  key={l.id}
                  style={[
                    styles.badge,
                    { backgroundColor: l.colorCode || '#e5e7eb' },
                  ]}
                >
                  <Text style={[styles.badgeTxt, { color: '#111827' }]}>
                    {l.name}
                  </Text>
                </View>
              ))}
              {(!task.labels || task.labels.length === 0) && (
                <Text style={styles.rowText}>—</Text>
              )}
            </View>

            <Text style={styles.label}>Description</Text>
            <Text style={styles.rowText}>{task.description || '—'}</Text>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const fmt = d => (d ? new Date(d).toLocaleDateString() : '—');
const minsToH = m => (m == null ? '—' : `${(m / 60).toFixed(1)} hrs`);

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
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
  },
  close: { padding: 6 },
  title: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0b0b0c',
    flex: 1,
    paddingRight: 8,
  },
  label: {
    marginTop: 12,
    fontWeight: '800',
    color: '#374151',
    paddingHorizontal: 12,
  },
  rowText: { color: '#111827', paddingHorizontal: 12, marginTop: 6 },
  avatar: { width: 36, height: 36, borderRadius: 18 },
  avatarEmpty: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    alignSelf: 'flex-start',
    marginLeft: 12,
    marginTop: 6,
  },
  badgeTxt: { fontWeight: '800' },
});
