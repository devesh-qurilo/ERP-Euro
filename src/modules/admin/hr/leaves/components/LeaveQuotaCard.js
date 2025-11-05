import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const COLS = [
  { key: 'type', label: 'Leave Type', w: 180 },
  { key: 'total', label: 'No. of leaves', w: 160 },
  { key: 'monthly', label: 'Monthly leaves', w: 170 },
  { key: 'taken', label: 'Total leaves taken', w: 200 },
  { key: 'remain', label: 'Remaining leaves', w: 200 },
  { key: 'over', label: 'Over utilized', w: 160 },
];
const TABLE_MIN_WIDTH = COLS.reduce((s, c) => s + c.w, 0) + 24;

export default function LeaveQuotaCard({ data = [] }) {
  return (
    <View style={s.card}>
      <Text style={s.title}>Leave Quota</Text>

      {/* Force horizontal scroll for wide quota table */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator
        contentContainerStyle={{ minWidth: TABLE_MIN_WIDTH }}
      >
        <View style={{ flex: 1 }}>
          <View style={[s.row, s.header]}>
            {COLS.map(c => (
              <Text key={c.key} style={[s.cell, s.h, { width: c.w }]}>
                {c.label}
              </Text>
            ))}
          </View>

          <ScrollView>
            {data.map(x => (
              <View key={x.id} style={s.row}>
                <Text style={[s.cell, { width: COLS[0].w }]}>
                  {x.leaveType}
                </Text>
                <Text style={[s.cell, { width: COLS[1].w }]}>
                  {x.totalLeaves}
                </Text>
                <Text style={[s.cell, { width: COLS[2].w }]}>
                  {x.monthlyLimit ?? '---'}
                </Text>
                <Text style={[s.cell, { width: COLS[3].w }]}>
                  {x.totalTaken}
                </Text>
                <Text style={[s.cell, { width: COLS[4].w }]}>
                  {x.remainingLeaves}
                </Text>
                <Text style={[s.cell, { width: COLS[5].w }]}>
                  {x.overUtilized}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 12,
  },
  title: { fontSize: 18, fontWeight: '800', marginBottom: 8, color: '#111827' },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 8,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingVertical: 10,
    alignItems: 'center',
  },
  cell: { paddingHorizontal: 8, color: '#111827' },
  h: { fontWeight: '800', color: '#374151' },
});
