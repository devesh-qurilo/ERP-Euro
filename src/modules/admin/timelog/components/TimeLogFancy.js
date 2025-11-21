// src/modules/admin/timelog/components/TimeLogFancy.js
import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SvgRing from './SvgRing';
import { fetchTimelogRequest } from '../store/actions';
import {
  selectTimelogLoading,
  selectTimelogEntries,
  selectTimelogSummary,
} from '../store/selectors';

/**
 * Helper: format HH:MM:SS to human time (HH:MM)
 */
function fmtTime(timeStr) {
  if (!timeStr) return '';
  const parts = timeStr.split(':');
  if (parts.length >= 2) return `${parts[0]}:${parts[1]}`;
  return timeStr;
}

/**
 * TimeLogItem - single timeline row
 */
function TimeLogItem({ item }) {
  const employee = (Array.isArray(item.employees) && item.employees[0]) || null;
  const profile = employee?.profileUrl;
  const title = `${item.projectShortCode || ''}${
    item.taskId ? ' • T#' + item.taskId : ''
  }`;
  const duration = `${Math.round(item.durationHours * 100) / 100} hrs`;

  return (
    <View style={styles.row}>
      <View style={styles.left}>
        <View style={styles.avatarWrap}>
          {profile ? (
            <Image source={{ uri: profile }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Icon name="account" size={18} color="#fff" />
            </View>
          )}
        </View>
      </View>

      <View style={styles.middle}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowMeta}>
          {fmtTime(item.startTime)} — {fmtTime(item.endTime)} • {duration}
        </Text>
        {item.memo ? (
          <Text numberOfLines={2} style={styles.memo}>
            {item.memo}
          </Text>
        ) : null}
        <View style={styles.metaRow}>
          <Text style={styles.smallMeta}>By: {item.createdBy}</Text>
          <Text style={styles.smallMetaRight}>
            {new Date(item.createdAt).toLocaleString()}
          </Text>
        </View>
      </View>

      <View style={styles.right}>
        <Text style={styles.durationText}>{duration}</Text>
      </View>
    </View>
  );
}

/**
 * SegmentChip - small pill for each summary segment
 */
function SegmentChip({ seg }) {
  const bg = seg.color || '#6b7280';
  return (
    <View style={[styles.chip, { backgroundColor: bg + '22' }]}>
      <View style={[styles.chipDot, { backgroundColor: bg }]} />
      <Text style={styles.chipText}>{`${seg.projectName || seg.projectId} • ${
        Math.round(seg.hours * 100) / 100
      }h`}</Text>
    </View>
  );
}

/**
 * Main exported TimeLogFancy
 *
 * props:
 *  - date: 'YYYY-MM-DD' (string). If omitted, will request '' — backend may default to today.
 *  - onPressEntry(item) optional
 */
export default function TimeLogFancy({ date, onPressEntry }) {
  const dispatch = useDispatch();
  const loading = useSelector(selectTimelogLoading);
  const entries = useSelector(selectTimelogEntries);
  const summary = useSelector(selectTimelogSummary);

  useEffect(() => {
    dispatch(fetchTimelogRequest(date));
  }, [dispatch, date]);

  const totalHours = Math.round((summary.totalHours || 0) * 100) / 100;
  const totalMinutes = summary.totalMinutes || 0;
  const usedPct =
    summary.usedPct ?? Math.round((totalMinutes / (24 * 60)) * 100);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0f172a', '#111827']}
        style={styles.summaryCard}
      >
        <View style={styles.summaryLeft}>
          <SvgRing
            size={92}
            strokeWidth={8}
            progress={usedPct}
            progressColor="#06b6d4"
            bgColor="rgba(255,255,255,0.08)"
          />
        </View>

        <View style={styles.summaryMiddle}>
          <Text style={styles.summaryDate}>
            {summary.date || date || new Date().toISOString().slice(0, 10)}
          </Text>
          <Text style={styles.summaryHours}>{totalHours} hrs</Text>
          <Text style={styles.summaryMinutes}>{totalMinutes} minutes</Text>

          <View style={styles.chips}>
            {Array.isArray(summary.segments) && summary.segments.length ? (
              summary.segments.map(s => (
                <SegmentChip
                  key={s.projectId + '-' + (s.minutes || 0)}
                  seg={s}
                />
              ))
            ) : (
              <Text style={styles.noSeg}>No segments</Text>
            )}
          </View>
        </View>

        <View style={styles.summaryRight}>
          <TouchableOpacity
            style={styles.refreshBtn}
            onPress={() => dispatch(fetchTimelogRequest(date))}
          >
            <Icon name="refresh" size={18} color="#0f172a" />
            <Text style={styles.refreshText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>Time Logs</Text>
        <Text style={styles.listSub}>{entries.length} entries</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={entries}
          keyExtractor={i => String(i.id)}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => onPressEntry?.(item)}
            >
              <TimeLogItem item={item} />
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={styles.sep} />}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 12 },
  summaryCard: {
    flexDirection: 'row',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 3,
  },
  summaryLeft: { marginRight: 12 },
  summaryMiddle: { flex: 1 },
  summaryRight: { alignItems: 'flex-end' },

  summaryDate: { color: '#d1fae5', fontSize: 12, marginBottom: 4 },
  summaryHours: { color: '#fff', fontSize: 28, fontWeight: '800' },
  summaryMinutes: { color: '#93c5fd', fontSize: 13, marginTop: 2 },

  chips: { marginTop: 10, flexDirection: 'row', flexWrap: 'wrap' },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    alignItems: 'center',
    flexDirection: 'row',
    marginRight: 8,
    marginBottom: 8,
  },
  chipDot: { width: 10, height: 10, borderRadius: 6, marginRight: 8 },
  chipText: { color: '#e6eef8', fontSize: 12 },

  noSeg: { color: '#9ca3af', fontSize: 12 },

  refreshBtn: {
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  refreshText: { marginLeft: 6, fontWeight: '700', color: '#0f172a' },

  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 6,
  },
  listTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },
  listSub: { color: '#6b7280' },

  row: { flexDirection: 'row', paddingVertical: 12, alignItems: 'center' },
  left: { width: 56, alignItems: 'center', justifyContent: 'center' },
  avatarWrap: {
    width: 44,
    height: 44,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#e6eef8',
  },
  avatar: { width: '100%', height: '100%' },
  avatarPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6b7280',
  },

  middle: { flex: 1, paddingHorizontal: 10 },
  rowTitle: { fontSize: 14, fontWeight: '700', color: '#0f172a' },
  rowMeta: { color: '#6b7280', fontSize: 12, marginTop: 4 },
  memo: { marginTop: 6, color: '#374151' },

  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  smallMeta: { color: '#9ca3af', fontSize: 11 },
  smallMetaRight: { color: '#9ca3af', fontSize: 11 },

  right: { width: 80, alignItems: 'flex-end' },
  durationText: { fontWeight: '700', color: '#111827' },

  sep: { height: 1, backgroundColor: '#f3f4f6', marginVertical: 6 },
});
