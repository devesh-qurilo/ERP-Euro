// src/modules/employee/hr/components/AwardsProfileTable.js
import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  Pressable,
  Alert,
} from 'react-native';

const COLS = [
  { key: 'icon', label: 'Award Icon', width: 160 },
  { key: 'name', label: 'Award Name', width: 360 },
  { key: 'status', label: 'Status', width: 180 },
  { key: 'action', label: 'Action', width: 120 },
];
const TABLE_WIDTH = COLS.reduce((s, c) => s + c.width, 0);

const awardIconByTitle = (title = '') => {
  const t = title.toLowerCase();
  if (t.includes('sde') || t.includes('developer')) return '🎖️';
  if (t.includes('manager')) return '🏆';
  if (t.includes('tester') || t.includes('qa')) return '⭐';
  if (t.includes('designer') || t.includes('ui') || t.includes('ux'))
    return '🏵️';
  return '🏅';
};

export default function AwardsProfileTable({ rows = [] }) {
  // unique awards by title; status = active if any active
  const data = useMemo(() => {
    const map = new Map();
    rows.forEach(r => {
      const key = r.awardTitle || '—';
      const prev = map.get(key);
      map.set(key, {
        title: key,
        isActive: prev ? prev.isActive || r.isActive : r.isActive,
      });
    });
    return Array.from(map.values()).map((a, idx) => ({
      id: String(idx),
      title: a.title,
      icon: awardIconByTitle(a.title),
      status: a.isActive
        ? { dot: '#16a34a', label: 'Active' }
        : { dot: '#9ca3af', label: 'Inactive' },
    }));
  }, [rows]);

  const renderRow = ({ item, index }) => (
    <View style={[styles.row, index % 2 ? styles.alt : null]}>
      <View style={[styles.cell, { width: COLS[0].width }]}>
        <Text style={styles.icon}>{item.icon}</Text>
      </View>
      <View style={[styles.cell, { width: COLS[1].width }]}>
        <Text style={styles.text}>{item.title}</Text>
      </View>
      <View style={[styles.cell, { width: COLS[2].width }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View
            style={{
              width: 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: item.status.dot,
            }}
          />
          <Text style={styles.text}>{item.status.label}</Text>
        </View>
      </View>
      <View style={[styles.cell, { width: COLS[3].width }]}>
        <Pressable
          style={styles.eyeBtn}
          onPress={() => Alert.alert('Award', item.title)}
        >
          <Text style={styles.eyeTxt}>👁️</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={styles.card}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator
        contentContainerStyle={{ minWidth: TABLE_WIDTH }}
      >
        <View style={{ width: TABLE_WIDTH }}>
          <View style={[styles.row, styles.headRow]}>
            {COLS.map(c => (
              <View key={c.key} style={[styles.cell, { width: c.width }]}>
                <Text style={[styles.text, styles.head]}>{c.label}</Text>
              </View>
            ))}
          </View>
          <FlatList
            data={data}
            keyExtractor={it => it.id}
            renderItem={renderRow}
            nestedScrollEnabled
            contentContainerStyle={{ paddingBottom: 10 }}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e7eb',
    minHeight: 60,
    paddingHorizontal: 6,
  },
  headRow: {
    backgroundColor: '#e8f1ff',
    borderBottomWidth: 0,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  alt: { backgroundColor: '#fafbfc' },
  cell: { justifyContent: 'center', paddingVertical: 12, paddingRight: 8 },

  icon: { fontSize: 22 },
  text: { fontSize: 16, color: '#1f2328' },
  head: { fontWeight: '900', color: '#374151' },

  eyeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  eyeTxt: { fontSize: 16 },
});
