// src/modules/employee/hr/components/LeavesTable.js
import React, { useCallback, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Pressable,
  Linking,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyLeaves } from '../store/actions';
import {
  selectMyLeavesData,
  selectMyLeavesLoading,
  selectMyLeavesError,
} from '../store/selectors';

const COLS = [
  { key: 'name', label: 'Name', width: 260 },
  { key: 'leaveDate', label: 'Leave Date', width: 220 },
  { key: 'duration', label: 'Duration', width: 140 },
  { key: 'status', label: 'Leave Status', width: 200 },
  { key: 'leaveType', label: 'Leave Type', width: 140 },
  { key: 'paid', label: 'Paid', width: 120 },
  { key: 'actions', label: 'Actions', width: 120 },
];
const TABLE_WIDTH = COLS.reduce((s, c) => s + c.width, 0);

const fmtDate = iso => {
  if (!iso) return '-';
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
};
const weekday = iso => {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString(undefined, { weekday: 'long' });
  } catch {
    return '';
  }
};

const durationLabel = v =>
  ({
    FULL_DAY: 'Full Day',
    HALF_DAY: 'Half Day',
    MULTIPLE: 'Multiple Days',
  }[v] ||
  v ||
  '-');

const statusColors = {
  APPROVED: { dot: '#16a34a', text: '#374151' },
  PENDING: { dot: '#f59e0b', text: '#374151' },
  REJECTED: { dot: '#ef4444', text: '#374151' },
  DEFAULT: { dot: '#9ca3af', text: '#374151' },
};

const typeColors = {
  SICK: { bg: '#fee2e2', fg: '#ef4444' },
  CASUAL: { bg: '#dcfce7', fg: '#16a34a' },
  EARNED: { bg: '#ede9fe', fg: '#7c3aed' },
  DEFAULT: { bg: '#e5e7eb', fg: '#374151' },
};

const paidColors = {
  TRUE: { bg: '#22c55e', fg: '#fff', label: 'Paid' },
  FALSE: { bg: '#9ca3af', fg: '#fff', label: 'Unpaid' },
};

export default function LeavesTable() {
  const dispatch = useDispatch();
  const raw = useSelector(selectMyLeavesData);
  const loading = useSelector(selectMyLeavesLoading);
  const error = useSelector(selectMyLeavesError);

  const rows = useMemo(
    () =>
      (raw || []).map(r => {
        const single = r.singleDate;
        const start = r.startDate;
        const end = r.endDate;
        const top = single
          ? fmtDate(single)
          : start || end
          ? `${fmtDate(start)} – ${fmtDate(end)}`
          : '-';
        const bottom = single
          ? weekday(single)
          : start || end
          ? `${weekday(start)} → ${weekday(end)}`
          : '';

        return {
          id: r.id,
          name: r.employeeName || r.employeeId || '-',
          subTitle: r.employeeId || '',
          leaveDate: { top, bottom },
          duration: durationLabel(r.durationType),
          status: r.status,
          leaveType: r.leaveType,
          isPaid: !!r.isPaid,
          documents: r.documentUrls || [],
          raw: r,
        };
      }),
    [raw],
  );

  const load = useCallback(() => dispatch(fetchMyLeaves()), [dispatch]);
  useEffect(() => {
    load();
  }, [load]);

  const onView = row => {
    // default action: open first document if exists, else show alert
    const first = row.documents?.[0];
    if (first) Linking.openURL(first).catch(() => {});
    else
      Alert.alert(
        'Leave Details',
        `${row.name}\n${row.leaveDate.top}\n${row.duration}\nStatus: ${row.status}`,
      );
  };

  const renderRow = ({ item, index }) => {
    const sCol = statusColors[item.status] || statusColors.DEFAULT;
    const tCol = typeColors[item.leaveType] || typeColors.DEFAULT;
    const pCol = item.isPaid ? paidColors.TRUE : paidColors.FALSE;

    return (
      <View style={[styles.row, index % 2 ? styles.altRow : null]}>
        {/* Name */}
        <View style={[styles.cellBox, { width: COLS[0].width }]}>
          <View style={styles.nameWrap}>
            <View style={styles.avatar}>
              <Text style={styles.avatarTxt}>
                {(item.name || '?')
                  .split(' ')
                  .map(n => n[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()}
              </Text>
            </View>
            <View>
              <Text style={styles.nameText} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.subText} numberOfLines={1}>
                {item.subTitle || '—'}
              </Text>
            </View>
          </View>
        </View>

        {/* Leave Date */}
        <View style={[styles.cellBox, { width: COLS[1].width }]}>
          <Text style={styles.dateTop} numberOfLines={1}>
            {item.leaveDate.top}
          </Text>
          {!!item.leaveDate.bottom && (
            <Text style={styles.dateBottom} numberOfLines={1}>
              {item.leaveDate.bottom}
            </Text>
          )}
        </View>

        {/* Duration */}
        <View style={[styles.cellBox, { width: COLS[2].width }]}>
          <Text style={styles.cellText}>{item.duration}</Text>
        </View>

        {/* Status */}
        <View style={[styles.cellBox, { width: COLS[3].width }]}>
          <View style={styles.statusWrap}>
            <View style={[styles.dot, { backgroundColor: sCol.dot }]} />
            <Text style={[styles.cellText, { color: sCol.text }]}>
              {item.status}
            </Text>
          </View>
        </View>

        {/* Leave Type */}
        <View style={[styles.cellBox, { width: COLS[4].width }]}>
          <View style={[styles.pillSolid, { backgroundColor: tCol.bg }]}>
            <Text style={[styles.pillSolidText, { color: tCol.fg }]}>
              {item.leaveType?.[0] + item.leaveType?.slice(1)?.toLowerCase() ||
                '-'}
            </Text>
          </View>
        </View>

        {/* Paid */}
        <View style={[styles.cellBox, { width: COLS[5].width }]}>
          <View style={[styles.pillSolid, { backgroundColor: pCol.bg }]}>
            <Text style={[styles.pillSolidText, { color: pCol.fg }]}>
              {pCol.label}
            </Text>
          </View>
        </View>

        {/* Actions */}
        <View
          style={[
            styles.cellBox,
            { width: COLS[6].width, alignItems: 'flex-start' },
          ]}
        >
          <Pressable
            onPress={() => onView(item)}
            style={styles.eyeBtn}
            android_ripple={{ color: '#e5e7eb', borderless: true }}
          >
            <Text style={styles.eyeTxt}>👁️</Text>
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Leaves</Text>

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
    minHeight: 64,
    paddingHorizontal: 6,
  },
  headerRow: {
    backgroundColor: '#f7f8fa',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomWidth: 0,
  },
  altRow: { backgroundColor: '#fafbfc' },

  cellBox: { justifyContent: 'center', paddingVertical: 12, paddingRight: 8 },
  cellText: { fontSize: 16, color: '#111827' },
  head: { fontWeight: '700' },

  // Name cell
  nameWrap: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarTxt: { fontWeight: '800', color: '#374151' },
  nameText: { fontSize: 16, fontWeight: '800', color: '#222' },
  subText: { fontSize: 13, color: '#6b7280' },

  // Date cell
  dateTop: { fontSize: 16, fontWeight: '700', color: '#111827' },
  dateBottom: { marginTop: 2, fontSize: 13, color: '#6b7280' },

  // Status cell
  statusWrap: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dot: { width: 10, height: 10, borderRadius: 5 },

  // Pills
  pillSolid: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  pillSolidText: { fontSize: 15, fontWeight: '800' },

  // Action
  eyeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  eyeTxt: { fontSize: 16 },

  // Misc
  center: { alignItems: 'center', justifyContent: 'center' },
  subtle: { marginTop: 6, color: '#6b7280' },
  error: { color: '#b00020', textAlign: 'center', marginBottom: 6 },
  link: { color: '#2563eb', textDecorationLine: 'underline' },
});
