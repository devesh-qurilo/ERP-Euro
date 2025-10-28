// src/modules/employee/works/tasks/components/TasksCalendarModal.js
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

export default function TasksCalendarModal({ visible, onClose, tasks = [] }) {
  if (!visible) return null;

  const days = {};
  tasks.forEach(t => {
    const key = t.noDueDate
      ? t.startDate || t.dueDate
      : t.dueDate || t.startDate;
    const k = key ? new Date(key).toDateString() : 'No Date';
    days[k] = days[k] || [];
    days[k].push(t);
  });

  const entries = Object.entries(days).sort(
    (a, b) => new Date(a[0]) - new Date(b[0]),
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
            <Text style={styles.title}>Tasks Calendar</Text>
            <Pressable onPress={onClose} style={styles.close}>
              <Text>✕</Text>
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={{ padding: 12 }}>
            {entries.length === 0 ? (
              <Text style={{ color: '#6b7280' }}>No tasks to show.</Text>
            ) : (
              entries.map(([day, list]) => (
                <View key={day} style={styles.card}>
                  <Text style={styles.day}>{day}</Text>
                  {list.map(t => (
                    <View key={t.id} style={styles.item}>
                      <Text style={styles.name} numberOfLines={1}>
                        {t.title}
                      </Text>
                      <Text style={styles.meta}>
                        {t.noDueDate ? 'No due' : fmt(t.dueDate)} •{' '}
                        {t.taskStage?.name || '—'} • {t.priority || '—'}
                      </Text>
                    </View>
                  ))}
                </View>
              ))
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
  },
  title: { fontSize: 18, fontWeight: '900', color: '#111827' },
  close: { padding: 6 },
  card: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 10,
  },
  day: { fontWeight: '900', color: '#111827', marginBottom: 8 },
  item: { marginBottom: 8 },
  name: { fontWeight: '900', color: '#111827' },
  meta: { color: '#6b7280' },
});
