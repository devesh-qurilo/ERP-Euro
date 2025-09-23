// src/modules/employee/hr/components/HolidaysListTable.js
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native';

const COLS = [
  { key: 'date', label: 'Date', width: 220 },
  { key: 'occasion', label: 'Occasion', width: 520 },
];
const TABLE_WIDTH = COLS.reduce((s, c) => s + c.width, 0);

function fmt(d) {
  const x = new Date(d);
  const dd = String(x.getDate()).padStart(2, '0');
  const mm = String(x.getMonth() + 1);
  const yy = String(x.getFullYear()).slice(-2);
  const top = `${dd}.${mm}.${yy}`;
  const bottom = x.toLocaleDateString(undefined, { weekday: 'long' });
  return { top, bottom };
}

export default function HolidaysListTable({ rows = [] }) {
  const data = useMemo(
    () =>
      rows.map(r => {
        const { top, bottom } = fmt(r.date);
        return { id: String(r.id), top, bottom, occasion: r.occasion || '—' };
      }),
    [rows],
  );

  const renderRow = ({ item, index }) => (
    <View style={[styles.row, index % 2 ? styles.alt : null]}>
      <View style={[styles.cell, { width: COLS[0].width }]}>
        <Text style={styles.dateTop}>{item.top}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeTxt}>{item.bottom}</Text>
        </View>
      </View>
      <View style={[styles.cell, { width: COLS[1].width }]}>
        <Text style={styles.occasion}>{item.occasion}</Text>
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
                <Text style={[styles.head]}>{c.label}</Text>
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
    minHeight: 64,
    paddingHorizontal: 6,
  },
  headRow: {
    backgroundColor: '#e8f1ff',
    borderBottomWidth: 0,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    minHeight: 48,
  },
  alt: { backgroundColor: '#fafbfc' },
  cell: { justifyContent: 'center', paddingVertical: 12, paddingRight: 8 },

  head: { fontSize: 18, fontWeight: '900', color: '#374151' },
  dateTop: { fontSize: 20, fontWeight: '900', color: '#111827' },
  badge: {
    marginTop: 6,
    alignSelf: 'flex-start',
    backgroundColor: '#9ca3af',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  badgeTxt: { color: '#fff', fontWeight: '900' },
  occasion: { fontSize: 22, fontWeight: '900', color: '#2b2d31' },
});
