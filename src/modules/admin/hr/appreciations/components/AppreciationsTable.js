import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';

export default function AppreciationsTable({
  data,
  busyIds = [],
  onEdit,
  onDelete,
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator
      style={styles.hScroll}
    >
      <View style={{ minWidth: 1100 }}>
        <View style={[styles.row, styles.head]}>
          <Text style={[styles.cell, styles.w200]}>Given To</Text>
          <Text style={[styles.cell, styles.w220]}>Award</Text>
          <Text style={[styles.cell, styles.w140]}>Date</Text>
          <Text style={[styles.cell, styles.w400]}>Summary</Text>
          <Text style={[styles.cell, styles.w120, { textAlign: 'center' }]}>
            Action
          </Text>
        </View>

        {data.map(r => (
          <View key={r.id} style={styles.row}>
            <Text style={[styles.cell, styles.w200]} numberOfLines={1}>
              {r.givenToEmployeeName}
            </Text>
            <Text style={[styles.cell, styles.w220]} numberOfLines={1}>
              {r.awardTitle}
            </Text>
            <Text style={[styles.cell, styles.w140]}>{r.date}</Text>
            <Text style={[styles.cell, styles.w400]} numberOfLines={1}>
              {r.summary || '—'}
            </Text>
            <View style={[styles.cell, styles.w120, styles.actionCell]}>
              <Pressable style={styles.smBtn} onPress={() => onEdit(r)}>
                <Text style={styles.smTxt}>Edit</Text>
              </Pressable>
              <Pressable
                style={[styles.smBtn, { borderColor: '#ef4444' }]}
                disabled={busyIds.includes(r.id)}
                onPress={() => onDelete(r)}
              >
                <Text style={[styles.smTxt, { color: '#ef4444' }]}>
                  {busyIds.includes(r.id) ? '...' : 'Delete'}
                </Text>
              </Pressable>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  hScroll: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  head: { backgroundColor: '#f8fafc' },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  cell: { paddingHorizontal: 12, paddingVertical: 12, color: '#0f172a' },
  w120: { width: 120 },
  w140: { width: 140 },
  w200: { width: 200 },
  w220: { width: 220 },
  w400: { width: 400 },
  actionCell: { flexDirection: 'row', justifyContent: 'center', gap: 8 },
  smBtn: {
    borderWidth: 1,
    borderColor: '#1d4ed8',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  smTxt: { fontWeight: '800', color: '#1d4ed8' },
});
