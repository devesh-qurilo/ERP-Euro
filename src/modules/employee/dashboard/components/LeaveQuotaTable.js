// src/modules/employee/dashboard/components/LeaveQuotaTable.js
import React, { useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLeaveQuota } from '../store/actions';
import {
  selectLeaveQuotaData,
  selectLeaveQuotaLoading,
  selectLeaveQuotaError,
} from '../store/selectors';

const COLS = [
  { key: 'leaveType', label: 'Leave Type', width: 200 },
  { key: 'totalLeaves', label: 'No. of leaves', width: 140 },
  { key: 'monthlyLimit', label: 'Monthly leaves', width: 160 },
  { key: 'totalTaken', label: 'Total leaves taken', width: 190 },
  { key: 'remainingLeaves', label: 'Remaining leaves', width: 190 },
  { key: 'overUtilized', label: 'Over utilized', width: 160 },
  { key: 'unusedLeaves', label: 'Unused leaves', width: 160 }, // computed
];
const TABLE_WIDTH = COLS.reduce((s, c) => s + c.width, 0);

const DOT_COLORS = { CASUAL: '#22c55e', SICK: '#ef4444', EARNED: '#8b5cf6' };

export default function LeaveQuotaTable() {
  const dispatch = useDispatch();
  const dataRaw = useSelector(selectLeaveQuotaData);
  const loading = useSelector(selectLeaveQuotaLoading);
  const error = useSelector(selectLeaveQuotaError);

  const data = useMemo(() => {
    // enrich with computed "unusedLeaves"
    return (dataRaw || []).map(row => ({
      ...row,
      unusedLeaves: Math.max(
        (row.totalLeaves ?? 0) -
          (row.totalTaken ?? 0) -
          (row.remainingLeaves ?? 0),
        0,
      ),
    }));
  }, [dataRaw]);

  const load = useCallback(() => dispatch(fetchLeaveQuota()), [dispatch]);

  useEffect(() => {
    load();
  }, [load]);

  const renderLeaveType = type => {
    const label = (type || '')
      .toLowerCase()
      .replace(/\b\w/g, c => c.toUpperCase());
    const dot = DOT_COLORS[type] || '#9ca3af';
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={[styles.dot, { backgroundColor: dot }]} />
        <Text style={styles.leaveTypeText}>{label}</Text>
      </View>
    );
  };

  const renderRow = ({ item, index }) => (
    <View style={[styles.row, index % 2 ? styles.altRow : null]}>
      {COLS.map(col => {
        let value = item[col.key];
        if (col.key === 'leaveType')
          return (
            <View key={col.key} style={[styles.cellBox, { width: col.width }]}>
              {renderLeaveType(item.leaveType)}
            </View>
          );
        if (col.key === 'monthlyLimit' && (!value || value === 0))
          value = '---';
        if (value === null || value === undefined || value === '') value = '-';
        return (
          <View key={col.key} style={[styles.cellBox, { width: col.width }]}>
            <Text style={styles.cellText}>{String(value)}</Text>
          </View>
        );
      })}
    </View>
  );

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Leave Quota</Text>

      {loading && data.length === 0 ? (
        <View style={[styles.center, { paddingVertical: 24 }]}>
          <ActivityIndicator />
          <Text style={styles.subtle}>Loading…</Text>
        </View>
      ) : error ? (
        <View style={[styles.center, { paddingVertical: 16 }]}>
          <Text style={styles.error}>Failed to load: {String(error)}</Text>
          <Text style={styles.link} onPress={load}>
            Try again
          </Text>
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator
          contentContainerStyle={{ minWidth: TABLE_WIDTH }}
        >
          <View style={{ width: TABLE_WIDTH }}>
            {/* Header */}
            <View style={[styles.row, styles.headerRow]}>
              {COLS.map(col => (
                <View
                  key={col.key}
                  style={[styles.cellBox, { width: col.width }]}
                >
                  <Text style={[styles.cellText, styles.head]}>
                    {col.label}
                  </Text>
                </View>
              ))}
            </View>

            {/* Body */}
            <FlatList
              data={data}
              keyExtractor={item => String(item.id)}
              renderItem={renderRow}
              nestedScrollEnabled
              refreshControl={
                <RefreshControl refreshing={loading} onRefresh={load} />
              }
              contentContainerStyle={{ paddingBottom: 6 }}
            />
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
    marginVertical: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 10,
    color: '#0b0b0c',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#e6e8ec',
    borderBottomWidth: StyleSheet.hairlineWidth,
    minHeight: 48,
    paddingHorizontal: 6,
  },
  headerRow: {
    backgroundColor: '#f7f8fa',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomWidth: 0,
  },
  altRow: { backgroundColor: '#fafbfc' },
  cellBox: { justifyContent: 'center', paddingVertical: 10, paddingRight: 8 },
  cellText: { fontSize: 16, color: '#1f2328' },
  head: { fontWeight: '700' },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  leaveTypeText: { fontSize: 16, color: '#1f2328', fontWeight: '600' },
  center: { alignItems: 'center', justifyContent: 'center' },
  subtle: { marginTop: 6, color: '#6b7280' },
  error: { color: '#b00020', textAlign: 'center', marginBottom: 6 },
  link: { color: '#2563eb', textDecorationLine: 'underline' },
});
