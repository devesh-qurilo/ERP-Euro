// src/modules/admin/timelog/components/TimeLogDetailModal.js
import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function TimeLogDetailModal({ visible, item, onClose, onEdit }) {
  if (!item) return null;

  const employee = (Array.isArray(item.employees) && item.employees[0]) || null;
  const profile = employee?.profileUrl || null;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.backdrop}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Time Log Details</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={22} color="#374151" />
            </TouchableOpacity>
          </View>

          <ScrollView style={{ paddingHorizontal: 12 }}>
            <View style={styles.row}>
              <View style={styles.avatarWrap}>
                {profile ? (
                  <Image source={{ uri: profile }} style={styles.avatar} />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <Icon name="account" size={22} color="#fff" />
                  </View>
                )}
              </View>
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.empName}>
                  {employee?.name || item.createdBy}
                </Text>
                <Text style={styles.empMeta}>
                  {employee?.designation || ''} • {employee?.department || ''}
                </Text>
              </View>
            </View>

            <View style={styles.sep} />

            <View style={styles.info}>
              <Text style={styles.infoLabel}>Project</Text>
              <Text style={styles.infoValue}>
                {item.projectShortCode} (ID: {item.projectId})
              </Text>
            </View>

            <View style={styles.info}>
              <Text style={styles.infoLabel}>Task</Text>
              <Text style={styles.infoValue}>
                {item.taskId ? `T#${item.taskId}` : '—'}
              </Text>
            </View>

            <View style={styles.info}>
              <Text style={styles.infoLabel}>Start</Text>
              <Text style={styles.infoValue}>
                {item.startDate} {item.startTime}
              </Text>
            </View>

            <View style={styles.info}>
              <Text style={styles.infoLabel}>End</Text>
              <Text style={styles.infoValue}>
                {item.endDate} {item.endTime}
              </Text>
            </View>

            <View style={styles.info}>
              <Text style={styles.infoLabel}>Duration</Text>
              <Text style={styles.infoValue}>{item.durationHours} hrs</Text>
            </View>

            <View style={styles.info}>
              <Text style={styles.infoLabel}>Memo</Text>
              <Text style={styles.infoValue}>{item.memo || '—'}</Text>
            </View>

            <View style={styles.info}>
              <Text style={styles.infoLabel}>Created At</Text>
              <Text style={styles.infoValue}>
                {new Date(item.createdAt).toLocaleString()}
              </Text>
            </View>

            <View style={{ height: 24 }} />
          </ScrollView>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: '#fff' }]}
              onPress={onClose}
            >
              <Text style={{ color: '#374151', fontWeight: '700' }}>Close</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: '#06b6d4' }]}
              onPress={() => onEdit?.(item)}
            >
              <Text style={{ color: '#022027', fontWeight: '700' }}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(2,6,23,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  title: { fontSize: 16, fontWeight: '800', color: '#111827' },
  row: { flexDirection: 'row', alignItems: 'center', padding: 12 },
  avatarWrap: {
    width: 56,
    height: 56,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#e6eef8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: { width: '100%', height: '100%' },
  avatarPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6b7280',
  },
  empName: { fontWeight: '800', fontSize: 15 },
  empMeta: { color: '#6b7280', fontSize: 12, marginTop: 4 },
  sep: { height: 1, backgroundColor: '#f3f4f6' },
  info: { padding: 12 },
  infoLabel: { color: '#6b7280', fontSize: 12 },
  infoValue: { color: '#111827', fontWeight: '700', marginTop: 6 },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 6,
  },
});
