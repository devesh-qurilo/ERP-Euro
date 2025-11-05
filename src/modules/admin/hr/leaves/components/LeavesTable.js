import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from 'react-native';

const COLS = [
  { key: 'employee', label: 'Employee', w: 220 },
  { key: 'date', label: 'Leave Date', w: 220 },
  { key: 'duration', label: 'Duration', w: 140 },
  { key: 'status', label: 'Leave Status', w: 160 },
  { key: 'type', label: 'Leave Type', w: 140 },
  { key: 'paid', label: 'Paid', w: 120 },
  { key: 'actions', label: 'Actions', w: 260 },
];

// 👇 this width guarantees a wide table; horizontal ScrollView kicks in
const TABLE_MIN_WIDTH = COLS.reduce((sum, c) => sum + c.w, 0) + 24; // padding buffer

export default function LeavesTable({
  data,
  loading,
  busyIds,
  onApprove,
  onReject,
  onDelete,
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Leaves</Text>

      {/* HORIZONTAL SCROLL ONLY FOR THE TABLE */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator
        contentContainerStyle={{ minWidth: TABLE_MIN_WIDTH }}
      >
        <View style={{ flex: 1 }}>
          {/* header */}
          <View style={[styles.row, styles.header]}>
            {COLS.map(c => (
              <Text key={c.key} style={[styles.cell, styles.h, { width: c.w }]}>
                {c.label}
              </Text>
            ))}
          </View>

          {/* body (vertical scroll) */}
          <ScrollView showsVerticalScrollIndicator>
            {loading ? (
              <ActivityIndicator style={{ margin: 16 }} />
            ) : (
              data.map(row => {
                const busy = busyIds.includes(row.id);
                const date =
                  row.singleDate ||
                  `${row.startDate || '--'} → ${row.endDate || '--'}`;
                return (
                  <View key={row.id} style={styles.row}>
                    <View style={[styles.cell, { width: COLS[0].w }]}>
                      <Text style={styles.name}>{row.employeeName}</Text>
                      <Text style={styles.sub}>#{row.employeeId}</Text>
                    </View>

                    <View style={[styles.cell, { width: COLS[1].w }]}>
                      <Text style={styles.main}>{date}</Text>
                    </View>

                    <Text style={[styles.cell, { width: COLS[2].w }]}>
                      {row.durationType?.replace('_', ' ')}
                    </Text>

                    <Text style={[styles.cell, { width: COLS[3].w }]}>
                      <Text style={[styles.badge]}>{row.status}</Text>
                    </Text>

                    <Text style={[styles.cell, { width: COLS[4].w }]}>
                      <Text style={[styles.badgeWarn]}>{row.leaveType}</Text>
                    </Text>

                    <Text style={[styles.cell, { width: COLS[5].w }]}>
                      <Text style={[styles.badgeOk]}>
                        {row.isPaid ? 'Paid' : 'Unpaid'}
                      </Text>
                    </Text>

                    <View
                      style={[
                        styles.cell,
                        { width: COLS[6].w, flexDirection: 'row', gap: 8 },
                      ]}
                    >
                      <Pressable
                        disabled={busy}
                        onPress={() => onApprove(row)}
                        style={[
                          styles.actionBtn,
                          { backgroundColor: '#16a34a' },
                        ]}
                      >
                        <Text style={styles.actionTxt}>
                          {busy ? '...' : 'Approve'}
                        </Text>
                      </Pressable>

                      <Pressable
                        disabled={busy}
                        onPress={() => onReject(row)}
                        style={[
                          styles.actionBtn,
                          { backgroundColor: '#ef4444' },
                        ]}
                      >
                        <Text style={styles.actionTxt}>
                          {busy ? '...' : 'Reject'}
                        </Text>
                      </Pressable>

                      <Pressable
                        disabled={busy}
                        onPress={() => onDelete(row)}
                        style={[
                          styles.actionBtn,
                          { backgroundColor: '#111827' },
                        ]}
                      >
                        <Text style={styles.actionTxt}>
                          {busy ? '...' : 'Delete'}
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                );
              })
            )}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
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
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingVertical: 10,
  },
  cell: { paddingHorizontal: 8, color: '#111827' },
  h: { fontWeight: '800', color: '#374151' },
  name: { fontWeight: '700', color: '#111827' },
  sub: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  main: { color: '#111827' },
  badge: {
    backgroundColor: '#e5e7eb',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 2,
    overflow: 'hidden',
  },
  badgeWarn: {
    backgroundColor: 'rgba(251,191,36,0.25)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 2,
    overflow: 'hidden',
  },
  badgeOk: {
    backgroundColor: 'rgba(16,185,129,0.2)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 2,
    overflow: 'hidden',
  },
  actionBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  actionTxt: { color: '#fff', fontWeight: '700' },
});
