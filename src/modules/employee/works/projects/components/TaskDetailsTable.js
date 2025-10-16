import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjectTasks } from '../../projects/store/actions';
import {
  selectProjectTasks,
  selectProjectTasksError,
  selectProjectTasksLoading,
} from '../../projects/store/selectors';
import TaskDetailsModal from './TaskDetailsModal';

const columns = [
  { key: 'code', title: 'Code', width: 110 },
  { key: 'title', title: 'Task Name', width: 320 },
  { key: 'start', title: 'Start Date', width: 150 },
  { key: 'due', title: 'Due Date', width: 150 },
  { key: 'est', title: 'Estimated Time', width: 150 },
  { key: 'comp', title: 'Completed On', width: 150 },
  { key: 'log', title: 'Hours Logged', width: 130 },
  { key: 'mile', title: 'Milestone', width: 180 },
  { key: 'assignee', title: 'Assigned To', width: 120 },
  { key: 'status', title: 'Status', width: 160 },
  { key: 'act', title: 'Actions', width: 90 },
];

export default function TaskDetailsTable({ projectId }) {
  const dispatch = useDispatch();
  const raw = useSelector(selectProjectTasks(projectId));
  const loading = useSelector(selectProjectTasksLoading(projectId));
  const error = useSelector(selectProjectTasksError(projectId));

  const [hideCompleted, setHideCompleted] = useState(true);
  const [milestoneOnly, setMilestoneOnly] = useState(false);
  const [sortKey, setSortKey] = useState('due'); // due | start | priority | status | title
  const [sortDir, setSortDir] = useState('asc'); // asc | desc
  const [open, setOpen] = useState(false);
  const [sel, setSel] = useState(null);

  useEffect(() => {
    if (projectId) dispatch(fetchProjectTasks(projectId));
  }, [dispatch, projectId]);

  const data = useMemo(() => {
    let list = raw || [];
    if (hideCompleted)
      list = list.filter(
        t => (t.taskStage?.name || '').toLowerCase() !== 'completed',
      );
    if (milestoneOnly) list = list.filter(t => !!t.milestone);

    const by =
      {
        title: (a, b) => (a.title || '').localeCompare(b.title || ''),
        start: (a, b) => cmpDate(a.startDate, b.startDate),
        due: (a, b) =>
          cmpDate(
            a.noDueDate ? null : a.dueDate,
            b.noDueDate ? null : b.dueDate,
          ),
        priority: (a, b) => rank(a.priority) - rank(b.priority),
        status: (a, b) =>
          (a.taskStage?.name || '').localeCompare(b.taskStage?.name || ''),
      }[sortKey] || (() => 0);

    const sorted = [...list].sort(by);
    if (sortDir === 'desc') sorted.reverse();
    return sorted;
  }, [raw, hideCompleted, milestoneOnly, sortKey, sortDir]);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Task Details</Text>

      {/* Filters */}
      <View style={styles.filters}>
        <Pill
          label={hideCompleted ? 'Hide Completed Task' : 'Show Completed Task'}
          active={hideCompleted}
          onPress={() => setHideCompleted(v => !v)}
        />
        <Pill
          label={milestoneOnly ? 'Milestones' : 'All Tasks'}
          active={milestoneOnly}
          onPress={() => setMilestoneOnly(v => !v)}
        />
      </View>

      {/* Sorter */}
      <View style={styles.sortRow}>
        {['title', 'start', 'due', 'priority', 'status'].map(k => (
          <Pressable
            key={k}
            onPress={() => {
              if (sortKey === k)
                setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
              else {
                setSortKey(k);
                setSortDir('asc');
              }
            }}
            style={[styles.sortBtn, sortKey === k && styles.sortBtnActive]}
          >
            <Text
              style={[styles.sortTxt, sortKey === k && styles.sortTxtActive]}
            >
              Sort by {cap(k)}{' '}
              {sortKey === k ? (sortDir === 'asc' ? '▴' : '▾') : ''}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Table */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator
        style={{ marginTop: 8 }}
      >
        <View>
          {/* header */}
          <View style={styles.trHead}>
            {columns.map(c => (
              <View key={c.key} style={[styles.th, { width: c.width }]}>
                <Text style={styles.thTxt}>{c.title}</Text>
              </View>
            ))}
          </View>

          {/* rows */}
          {data.map((t, idx) => (
            <View
              key={t.id || idx}
              style={[styles.tr, idx % 2 ? styles.striped : null]}
            >
              <Cell
                w={columns[0].width}
                text={`#${String(t.projectId).padStart(6, '0')}`}
              />
              <View style={[styles.td, { width: columns[1].width }]}>
                <Text numberOfLines={2} style={styles.titleCell}>
                  {t.title || '—'}
                </Text>
                {(t.labels || []).map(l => (
                  <View
                    key={l.id}
                    style={[
                      styles.badge,
                      { backgroundColor: '#eef2ff', borderColor: '#c7d2fe' },
                    ]}
                  >
                    <Text style={[styles.badgeTxt, { color: '#374151' }]}>
                      {l.name}
                    </Text>
                  </View>
                ))}
              </View>
              <Cell w={columns[2].width} text={fmt(t.startDate)} />
              <Cell
                w={columns[3].width}
                text={t.noDueDate ? '—' : fmt(t.dueDate)}
              />
              <Cell
                w={columns[4].width}
                text={minsToH(t.timeEstimateMinutes)}
              />
              <Cell w={columns[5].width} text={'—'} />
              <Cell w={columns[6].width} text={'0s'} />
              <Cell w={columns[7].width} text={t.milestone?.title || '—'} />
              <View
                style={[
                  styles.td,
                  { width: columns[8].width, flexDirection: 'row', gap: 6 },
                ]}
              >
                {(t.assignedEmployees || []).slice(0, 1).map((m, i) =>
                  m.profileUrl ? (
                    <Image
                      key={i}
                      source={{ uri: m.profileUrl }}
                      style={styles.avatar}
                    />
                  ) : (
                    <View key={i} style={[styles.avatar, styles.avatarEmpty]}>
                      <Text>👤</Text>
                    </View>
                  ),
                )}
              </View>
              <View
                style={[
                  styles.td,
                  {
                    width: columns[9].width,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 8,
                  },
                ]}
              >
                <View
                  style={[
                    styles.dot,
                    { backgroundColor: dotColor(t.taskStage?.labelColor) },
                  ]}
                />
                <Text style={styles.body}>{t.taskStage?.name || '—'}</Text>
              </View>
              <View style={[styles.td, { width: columns[10].width }]}>
                <Pressable
                  onPress={() => {
                    setSel(t);
                    setOpen(true);
                  }}
                  style={styles.moreBtn}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: '900',
                      color: '#6b7280',
                    }}
                  >
                    ⋮
                  </Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {loading ? <Text style={styles.dim}>Loading…</Text> : null}
      {error ? (
        <Text style={[styles.dim, { color: '#b00020' }]}>
          Error: {String(error)}
        </Text>
      ) : null}

      <TaskDetailsModal
        visible={open}
        task={sel}
        onClose={() => setOpen(false)}
      />
    </View>
  );
}

/* helpers */
const fmt = d => (d ? new Date(d).toLocaleDateString() : '—');
const minsToH = m => (m == null ? '—' : `${(m / 60).toFixed(1)} hrs`);
const cmpDate = (a, b) =>
  (a ? new Date(a).getTime() : 0) - (b ? new Date(b).getTime() : 0);
const rank = p => ({ HIGH: 0, MEDIUM: 1, LOW: 2 }[p || ''] ?? 9);
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
const dotColor = hex => hex || '#60a5fa';

const Cell = ({ w, text }) => (
  <View style={[styles.td, { width: w }]}>
    <Text style={styles.body} numberOfLines={1}>
      {text}
    </Text>
  </View>
);
const Pill = ({ label, active, onPress }) => (
  <Pressable
    onPress={onPress}
    style={[styles.pill, active && styles.pillActive]}
  >
    <Text style={[styles.pillTxt, active && styles.pillTxtActive]}>
      {label}
    </Text>
  </Pressable>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 12,
  },
  title: { fontSize: 20, fontWeight: '900', color: '#0b0b0c' },

  filters: { flexDirection: 'row', gap: 8, marginTop: 10, flexWrap: 'wrap' },
  pill: {
    backgroundColor: '#f3f4f6',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  pillActive: { backgroundColor: '#111827' },
  pillTxt: { color: '#111827', fontWeight: '900' },
  pillTxtActive: { color: '#fff' },

  sortRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  sortBtn: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  sortBtnActive: { backgroundColor: '#111827' },
  sortTxt: { color: '#111827', fontWeight: '800' },
  sortTxtActive: { color: '#fff' },

  trHead: {
    flexDirection: 'row',
    backgroundColor: '#eef2ff',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  th: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRightWidth: 1,
    borderColor: '#e5e7eb',
  },
  thTxt: { fontSize: 14, fontWeight: '900', color: '#374151' },

  tr: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#eef2ff',
  },
  striped: { backgroundColor: '#fafafa' },
  td: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRightWidth: 1,
    borderColor: '#f1f5f9',
    justifyContent: 'center',
  },
  titleCell: { fontWeight: '900', color: '#111827' },
  body: { color: '#111827' },
  dim: { color: '#6b7280', marginTop: 8 },

  avatar: { width: 36, height: 36, borderRadius: 18 },
  avatarEmpty: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
  },
  dot: { width: 10, height: 10, borderRadius: 5 },
  badge: {
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    marginTop: 6,
    alignSelf: 'flex-start',
  },
  badgeTxt: { fontWeight: '800', fontSize: 12 },

  moreBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
