import React, { useState } from 'react';
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
  { key: 'actions', label: '', w: 80 }, // kebab only
];

const TABLE_MIN_WIDTH = COLS.reduce((s, c) => s + c.w, 0) + 24;

export default function LeavesTable({
  data,
  loading,
  busyIds,
  onApprove,
  onReject,
  onDelete,
}) {
  const [openRowId, setOpenRowId] = useState(null);

  const toggleMenu = id => setOpenRowId(prev => (prev === id ? null : id));

  const closeMenu = () => setOpenRowId(null);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Leaves</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator
        contentContainerStyle={{ minWidth: TABLE_MIN_WIDTH }}
      >
        <View>
          {/* HEADER */}
          <View style={[styles.row, styles.header]}>
            {COLS.map(c => (
              <Text key={c.key} style={[styles.cell, styles.h, { width: c.w }]}>
                {c.label}
              </Text>
            ))}
          </View>

          {/* BODY */}
          <ScrollView>
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
                    {/* Employee */}
                    <View style={[styles.cell, { width: COLS[0].w }]}>
                      <Text style={styles.name}>{row.employeeName}</Text>
                      <Text style={styles.sub}>#{row.employeeId}</Text>
                    </View>

                    {/* Date */}
                    <View style={[styles.cell, { width: COLS[1].w }]}>
                      <Text>{date}</Text>
                    </View>

                    {/* Duration */}
                    <Text style={[styles.cell, { width: COLS[2].w }]}>
                      {row.durationType?.replace('_', ' ')}
                    </Text>

                    {/* Status */}
                    <View style={[styles.cell, { width: COLS[3].w }]}>
                      <Text style={styles.badge}>{row.status}</Text>
                    </View>

                    {/* Type */}
                    <View style={[styles.cell, { width: COLS[4].w }]}>
                      <Text style={styles.badgeWarn}>{row.leaveType}</Text>
                    </View>

                    {/* Paid */}
                    <View style={[styles.cell, { width: COLS[5].w }]}>
                      <Text style={styles.badgeOk}>
                        {row.isPaid ? 'Paid' : 'Unpaid'}
                      </Text>
                    </View>

                    {/* ACTIONS */}
                    <View
                      style={[
                        styles.cell,
                        { width: COLS[6].w, position: 'relative' },
                      ]}
                    >
                      <Pressable
                        disabled={busy}
                        onPress={() => toggleMenu(row.id)}
                        style={styles.kebabBtn}
                      >
                        <Text style={styles.kebabTxt}>⋮</Text>
                      </Pressable>

                      {openRowId === row.id && (
                        <View style={styles.menu}>
                          <Pressable
                            onPress={() => {
                              closeMenu();
                              onApprove(row);
                            }}
                            style={styles.menuItem}
                          >
                            <Text style={styles.menuApprove}>Approve</Text>
                          </Pressable>

                          <Pressable
                            onPress={() => {
                              closeMenu();
                              onReject(row);
                            }}
                            style={styles.menuItem}
                          >
                            <Text style={styles.menuReject}>Reject</Text>
                          </Pressable>

                          <Pressable
                            onPress={() => {
                              closeMenu();
                              onDelete(row);
                            }}
                            style={styles.menuItem}
                          >
                            <Text style={styles.menuDelete}>Delete</Text>
                          </Pressable>
                        </View>
                      )}
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

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 12,
  },
  title: { fontSize: 18, fontWeight: '800', marginBottom: 8 },

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

  cell: { paddingHorizontal: 8 },
  h: { fontWeight: '800', color: '#374151' },

  name: { fontWeight: '700' },
  sub: { fontSize: 12, color: '#6b7280' },

  badge: {
    backgroundColor: '#e5e7eb',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  badgeWarn: {
    backgroundColor: 'rgba(251,191,36,0.25)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  badgeOk: {
    backgroundColor: 'rgba(16,185,129,0.2)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },

  kebabBtn: {
    padding: 6,
    alignItems: 'center',
  },
  kebabTxt: {
    fontSize: 18,
    fontWeight: '900',
  },

  menu: {
    position: 'absolute',
    right: 0,
    top: 28,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    minWidth: 140,
    zIndex: 100,
    elevation: 5,
  },

  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#f1f5f9',
  },

  menuApprove: { color: '#16a34a', fontWeight: '700' },
  menuReject: { color: '#ef4444', fontWeight: '700' },
  menuDelete: { color: '#111827', fontWeight: '700' },
});
