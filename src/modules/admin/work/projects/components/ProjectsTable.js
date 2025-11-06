import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  Pressable,
  ActivityIndicator,
} from 'react-native';

export default function ProjectsTable({
  data = [],
  loading,
  busyIds = [],
  onView,
  onEdit,
  onDelete,
  onStatus,
  onPin,
  onUnpin,
  onArchive,
  onUnarchive,
}) {
  if (loading) return <ActivityIndicator style={{ marginTop: 20 }} />;

  return (
    <ScrollView horizontal style={styles.hscroll}>
      <View style={styles.table}>
        {/* Header */}
        <View style={[styles.row, styles.head]}>
          {[
            'Code',
            'Project Name',
            'Members',
            'Start Date',
            'Deadline',
            'Clients',
            'Status',
            'Actions',
          ].map(h => (
            <Text key={h} style={[styles.cell, styles.hcell]}>
              {h}
            </Text>
          ))}
        </View>

        {/* Rows */}
        {data.map(item => {
          const isBusy = busyIds.includes(item.id);
          return (
            <View key={item.id} style={styles.row}>
              <Text style={styles.cell}>#{item.shortCode || '—'}</Text>
              <Text style={[styles.cell, { minWidth: 220 }]} numberOfLines={1}>
                {item.name}
              </Text>
              <View style={[styles.cell, styles.members]}>
                {(item.assignedEmployees || []).slice(0, 4).map(m => (
                  <Image
                    key={m.employeeId}
                    source={{ uri: m.profileUrl }}
                    style={styles.avatar}
                  />
                ))}
                {item.assignedEmployees?.length > 4 && (
                  <View style={styles.more}>
                    <Text style={styles.moreTxt}>
                      +{item.assignedEmployees.length - 4}
                    </Text>
                  </View>
                )}
              </View>
              <Text style={styles.cell}>{item.startDate || '—'}</Text>
              <Text style={styles.cell}>
                {item.deadline || (item.noDeadline ? 'No deadline' : '—')}
              </Text>
              <View style={[styles.cell, styles.client]}>
                {item.client?.profilePictureUrl ? (
                  <Image
                    source={{ uri: item.client.profilePictureUrl }}
                    style={styles.clientPic}
                  />
                ) : null}
                <Text numberOfLines={1} style={{ maxWidth: 160 }}>
                  {item.client?.name || '—'}
                </Text>
              </View>
              <View style={[styles.cell, styles.progress]}>
                <Text>{item.projectStatus || '—'}</Text>
                {item.progressPercent != null && (
                  <View style={styles.barWrap}>
                    <View
                      style={[
                        styles.barFill,
                        { width: `${Math.min(100, item.progressPercent)}%` },
                      ]}
                    />
                    <Text style={styles.barPct}>{item.progressPercent}%</Text>
                  </View>
                )}
              </View>

              <View style={[styles.cell, styles.actions]}>
                <Pressable onPress={() => onView(item)} style={styles.dotBtn}>
                  <Text>👁️</Text>
                </Pressable>
                <Pressable onPress={() => onEdit?.(p)} style={styles.dotBtn}>
                  <Text>✏️</Text>
                </Pressable>

                {item.pinned ? (
                  <Pressable
                    disabled={isBusy}
                    onPress={() => onUnpin?.(item.id)}
                    style={styles.dotBtn}
                  >
                    <Text>📌×</Text>
                  </Pressable>
                ) : (
                  <Pressable
                    disabled={isBusy}
                    onPress={() => onPin?.(item.id)}
                    style={styles.dotBtn}
                  >
                    <Text>📌</Text>
                  </Pressable>
                )}

                {item.archived ? (
                  <Pressable
                    disabled={isBusy}
                    onPress={() => onUnarchive?.(item.id)}
                    style={styles.dotBtn}
                  >
                    <Text>🗂️↩︎</Text>
                  </Pressable>
                ) : (
                  <Pressable
                    disabled={isBusy}
                    onPress={() => onArchive?.(item.id)}
                    style={styles.dotBtn}
                  >
                    <Text>🗂️</Text>
                  </Pressable>
                )}

                <Pressable
                  disabled={isBusy}
                  onPress={() => onDelete?.(item.id)}
                  style={styles.dotBtn}
                >
                  <Text>🗑️</Text>
                </Pressable>
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  hscroll: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  table: { minWidth: 1000 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  head: { backgroundColor: '#f8fafc' },
  cell: { paddingVertical: 12, paddingHorizontal: 12, minWidth: 140 },
  hcell: { fontWeight: '800', color: '#111827' },
  members: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minWidth: 160,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 4,
    backgroundColor: '#e5e7eb',
  },
  more: {
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  moreTxt: { fontSize: 12, fontWeight: '700' },
  client: { flexDirection: 'row', alignItems: 'center', gap: 8, minWidth: 200 },
  clientPic: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#e5e7eb',
  },
  progress: { minWidth: 200 },
  barWrap: {
    marginTop: 6,
    height: 10,
    backgroundColor: '#e5e7eb',
    borderRadius: 6,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  barFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    backgroundColor: '#1d4ed8',
  },
  barPct: { fontSize: 10, textAlign: 'center', color: '#fff' },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minWidth: 220,
  },
  dotBtn: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
});
