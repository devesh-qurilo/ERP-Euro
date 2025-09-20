// src/modules/employee/dashboard/components/AppreciationsTable.js
import React, { useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Image,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAppreciations } from '../store/actions';
import {
  selectAppreciationsData,
  selectAppreciationsLoading,
  selectAppreciationsError,
} from '../store/selectors';

const COLS = [
  { key: 'photo', label: 'Photo', width: 120 },
  { key: 'givenToEmployeeName', label: 'Name', width: 200 },
  { key: 'givenToEmployeeId', label: 'Emp ID', width: 140 },
  { key: 'awardTitle', label: 'Award Title', width: 220 },
  { key: 'date', label: 'Date', width: 140 },
  { key: 'summary', label: 'Summary', width: 300 },
  { key: 'isActive', label: 'Status', width: 140 },
];
const TABLE_WIDTH = COLS.reduce((s, c) => s + c.width, 0);

const formatDate = iso => {
  if (!iso) return '-';
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });
  } catch {
    return iso;
  }
};

export default function AppreciationsTable() {
  const dispatch = useDispatch();
  const data = useSelector(selectAppreciationsData);
  const loading = useSelector(selectAppreciationsLoading);
  const error = useSelector(selectAppreciationsError);

  const rows = useMemo(
    () =>
      (data || []).map(r => ({
        ...r,
        date: formatDate(r.date),
        givenToEmployeeId: r.givenToEmployeeId || r.givenToEmployeeID || '-', // tolerance
      })),
    [data],
  );

  const load = useCallback(() => dispatch(fetchAppreciations()), [dispatch]);

  useEffect(() => {
    load();
  }, [load]);

  const renderStatus = isActive => (
    <View
      style={[
        styles.pill,
        { backgroundColor: isActive ? '#e8f7ef' : '#f7e8e8' },
      ]}
    >
      <Text
        style={[styles.pillText, { color: isActive ? '#0f9d58' : '#d93025' }]}
      >
        {isActive ? 'Active' : 'Inactive'}
      </Text>
    </View>
  );

  const renderPhoto = (url, name) => {
    if (url) {
      return (
        <Image source={{ uri: url }} style={styles.avatar} resizeMode="cover" />
      );
    }
    const initials = (name || '?')
      .split(' ')
      .map(n => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
    return (
      <View style={[styles.avatar, styles.avatarFallback]}>
        <Text style={{ color: '#fff', fontWeight: '700' }}>{initials}</Text>
      </View>
    );
  };

  const renderRow = ({ item, index }) => (
    <View style={[styles.row, index % 2 ? styles.altRow : null]}>
      {COLS.map(col => {
        const w = { width: col.width };
        switch (col.key) {
          case 'photo':
            return (
              <View key={col.key} style={[styles.cellBox, w]}>
                {renderPhoto(item.photoUrl, item.givenToEmployeeName)}
              </View>
            );
          case 'summary':
            return (
              <View key={col.key} style={[styles.cellBox, w]}>
                <Text style={styles.cellText} numberOfLines={2}>
                  {item.summary || '-'}
                </Text>
              </View>
            );
          case 'isActive':
            return (
              <View key={col.key} style={[styles.cellBox, w]}>
                {renderStatus(item.isActive)}
              </View>
            );
          default:
            return (
              <View key={col.key} style={[styles.cellBox, w]}>
                <Text style={styles.cellText}>
                  {String(item[col.key] ?? '-')}
                </Text>
              </View>
            );
        }
      })}
    </View>
  );

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Appreciations</Text>

      {loading && rows.length === 0 ? (
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
              data={rows}
              keyExtractor={it => String(it.id)}
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
    minHeight: 56,
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
  center: { alignItems: 'center', justifyContent: 'center' },
  subtle: { marginTop: 6, color: '#6b7280' },
  error: { color: '#b00020', textAlign: 'center', marginBottom: 6 },
  link: { color: '#2563eb', textDecorationLine: 'underline' },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e5e7eb',
  },
  avatarFallback: {
    backgroundColor: '#6b7280',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  pillText: { fontSize: 13, fontWeight: '700' },
});
