import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Linking,
  ActivityIndicator,
} from 'react-native';

export default function FilesTable({
  data = [],
  loading,
  busyIds = [],
  onDelete,
}) {
  if (loading) return <ActivityIndicator style={{ marginTop: 20 }} />;

  return (
    <ScrollView horizontal style={s.hscroll}>
      <View style={s.table}>
        <View style={[s.row, s.head]}>
          {['File name', 'Task', 'Type', 'Size', 'Uploaded By', 'Actions'].map(
            h => (
              <Text key={h} style={[s.cell, s.hcell]}>
                {h}
              </Text>
            ),
          )}
        </View>

        {data.map(row => {
          const busy = busyIds.includes(row.id);
          return (
            <View key={row.id} style={s.row}>
              <Text style={[s.cell, { minWidth: 220 }]} numberOfLines={1}>
                {row.filename}
              </Text>
              <Text style={s.cell}>{row.taskId ?? '—'}</Text>
              <Text style={s.cell}>{row.mimeType || '—'}</Text>
              <Text style={s.cell}>
                {row.size != null ? `${row.size} B` : '—'}
              </Text>
              <Text style={s.cell}>{row.uploadedBy || '—'}</Text>
              <View style={[s.cell, s.actions]}>
                <Pressable
                  style={s.btn}
                  onPress={() => row.url && Linking.openURL(row.url)}
                >
                  <Text>⬇️</Text>
                </Pressable>
                <Pressable
                  style={s.btn}
                  disabled={busy}
                  onPress={() => onDelete?.(row)}
                >
                  <Text>{busy ? '…' : '🗑️'}</Text>
                </Pressable>
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  hscroll: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  table: { minWidth: 900 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  head: { backgroundColor: '#f8fafc' },
  cell: { paddingVertical: 12, paddingHorizontal: 12, minWidth: 140 },
  hcell: { fontWeight: '800', color: '#111827' },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minWidth: 160,
  },
  btn: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
});
