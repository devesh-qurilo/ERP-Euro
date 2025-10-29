// src/modules/employee/works/timesheets/screens/EmployeeTimesheetsScreen.js
import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  Image,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import {
  fetchMyTimesheets,
  createWeeklyTimesheet,
  getWeeklyTimesheet,
} from '../store/actions';
import {
  selectMyTimesheets,
  selectMyTimesheetsLoad,
  selectMyTimesheetsError,
  selectWeeklyTimesheet,
  selectWeeklyTimesheetLoad,
} from '../store/selectors';
// import {
//   selectMyTimesheets,
//   selectMyTimesheetsLoad,
//   selectWeeklyAll,
//   selectWeeklyAllLoading,
//   selectWeeklyCreateLoading,
// } from '../store/selectors';

import { getWeeklyTimesheetsAll } from '../store/actions';
//  import { selectTasks } from '../../tasks/store/selectors';

// ✅ pull “my tasks” for the Weekly modal dropdown
import { fetchMyTasks } from '../../tasks/store/actions';
import { selectTasks } from '../../tasks/store/selectors';

import TimesheetViewModal from '../components/TimesheetViewModal';
import WeeklyTimesheetModal from '../components/WeeklyTimesheetModal';
import TimesheetCalendarModal from '../components/TimesheetCalendarModal';
// const weeklyAll = useSelector(selectWeeklyAll);
// const weeklyAllLoading = useSelector(selectWeeklyAllLoading);
// const weeklyCreateLoading = useSelector(selectWeeklyCreateLoading);
// const myTasks = useSelector(selectTasks);

const Pill = ({ active, label, onPress }) => (
  <Pressable
    onPress={onPress}
    style={[styles.pill, active && styles.pillActive]}
  >
    <Text style={[styles.pillTxt, active && styles.pillTxtActive]}>
      {label}
    </Text>
  </Pressable>
);

const RowHead = ({ cols, widths }) => (
  <View style={styles.trHead}>
    {cols.map((c, i) => (
      <View key={c} style={[styles.th, { width: widths[i] }]}>
        <Text style={styles.thTxt}>{c}</Text>
      </View>
    ))}
  </View>
);
const Row = ({ children }) => <View style={styles.tr}>{children}</View>;
const Cell = ({ w, children, text }) => (
  <View style={[styles.cell, { width: w }]}>
    {children ?? (
      <Text style={styles.body} numberOfLines={2}>
        {text}
      </Text>
    )}
  </View>
);

const fmtDate = d => (d ? new Date(d).toLocaleDateString() : '—');
const fmtTime = t => (t ? t.slice(0, 5) : '—');

export default function EmployeeTimesheetsScreen() {
  const dispatch = useDispatch();

  // timesheets
  const list = useSelector(selectMyTimesheets);
  const loading = useSelector(selectMyTimesheetsLoad);
  const error = useSelector(selectMyTimesheetsError);

  // weekly
  const weekly = useSelector(selectWeeklyTimesheet);
  const weeklyLoading = useSelector(selectWeeklyTimesheetLoad);

  // ✅ my tasks for weekly dropdown
  const myTasks = useSelector(selectTasks);

  useEffect(() => {
    dispatch(fetchMyTimesheets());
    dispatch(fetchMyTasks()); // ✅ load /me/tasks for WeeklyTimesheetModal select
  }, [dispatch]);

  // filters
  const [search, setSearch] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const hasFilters = !!(search.trim() || start || end);

  const filtered = useMemo(() => {
    let data = list;
    if (!hasFilters) return data;
    const q = search.toLowerCase();
    return data.filter(ts => {
      if (search) {
        const hay =
          `${ts.memo} ${ts.employeeId} ${ts.projectId} ${ts.taskId}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      const sd = ts.startDate ? new Date(ts.startDate) : null;
      const ed = ts.endDate ? new Date(ts.endDate) : null;
      if (start && sd && new Date(start) > sd) return false;
      if (end && ed && new Date(end) < ed) return false;
      return true;
    });
  }, [list, hasFilters, search, start, end]);

  // modes + modals
  const [mode, setMode] = useState('list'); // list | calendar | weekly
  const [viewOpen, setViewOpen] = useState(false);
  const [active, setActive] = useState(null);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [weeklyOpen, setWeeklyOpen] = useState(false);

  const openView = ts => {
    setActive(ts);
    setViewOpen(true);
  };

  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      {/* Filters / Actions */}
      <View style={styles.card}>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 8,
            marginBottom: 8,
          }}
        >
          <Pill
            label="List"
            active={mode === 'list'}
            onPress={() => setMode('list')}
          />
          <Pill
            label="Calendar"
            active={mode === 'calendar'}
            onPress={() => {
              setMode('calendar');
              setCalendarOpen(true);
            }}
          />
          <Pill
            label="Weekly"
            active={mode === 'weekly'}
            onPress={() => setMode('weekly')}
          />
          <Pressable
            style={[styles.primaryBtn]}
            onPress={() => {
              /* future: Add Log modal */
            }}
          >
            <Text style={styles.primaryTxt}>+ Add Log</Text>
          </Pressable>
          <Pressable
            style={[styles.primaryBtn, { backgroundColor: '#111827' }]}
            onPress={() => setWeeklyOpen(true)}
          >
            <Text style={[styles.primaryTxt, { color: '#fff' }]}>+ Weekly</Text>
          </Pressable>
        </View>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          <View style={{ flexBasis: '60%', minWidth: 220, paddingRight: 8 }}>
            <Text style={styles.label}>Search</Text>
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="memo, employee, task, project"
              placeholderTextColor="#9ca3af"
              style={styles.input}
            />
          </View>
          <View style={{ flexBasis: '20%', minWidth: 150, paddingRight: 8 }}>
            <Text style={styles.label}>Start From</Text>
            <TextInput
              value={start}
              onChangeText={setStart}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#9ca3af"
              style={styles.input}
            />
          </View>
          <View style={{ flexBasis: '20%', minWidth: 150 }}>
            <Text style={styles.label}>End To</Text>
            <TextInput
              value={end}
              onChangeText={setEnd}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#9ca3af"
              style={styles.input}
            />
          </View>
        </View>

        {hasFilters && (
          <Pressable
            onPress={() => {
              setSearch('');
              setStart('');
              setEnd('');
            }}
            style={styles.clearBtn}
          >
            <Text style={styles.clearTxt}>Clear All</Text>
          </Pressable>
        )}
      </View>

      {/* Table */}
      <Text style={styles.sectionTitle}>My Timesheets</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tableWrap}
      >
        <View style={styles.table}>
          <RowHead
            cols={['Employee', 'Start', 'End', 'Memo', 'Hours', 'Action']}
            widths={[220, 180, 180, 260, 100, 120]}
          />
          {(loading ? [] : filtered).map(ts => (
            <Row key={ts.id}>
              <Cell w={220}>
                <View
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
                >
                  {ts.employees?.[0]?.profileUrl ? (
                    <Image
                      source={{ uri: ts.employees[0].profileUrl }}
                      style={styles.avatar}
                    />
                  ) : (
                    <View style={[styles.avatar, styles.avatarEmpty]}>
                      <Text>👤</Text>
                    </View>
                  )}
                  <View>
                    <Text style={styles.body} numberOfLines={1}>
                      {ts.employees?.[0]?.name || ts.employeeId}
                    </Text>
                    <Text style={styles.dim}>#{ts.employeeId}</Text>
                  </View>
                </View>
              </Cell>
              <Cell
                w={180}
                text={`${fmtDate(ts.startDate)}  ${fmtTime(ts.startTime)}`}
              />
              <Cell
                w={180}
                text={`${fmtDate(ts.endDate)}  ${fmtTime(ts.endTime)}`}
              />
              <Cell w={260} text={ts.memo || '—'} />
              <Cell w={100} text={`${ts.durationHours ?? 0}h`} />
              <Cell w={120}>
                <Pressable style={styles.viewBtn} onPress={() => openView(ts)}>
                  <Text style={styles.viewTxt}>View</Text>
                </Pressable>
              </Cell>
            </Row>
          ))}
          {loading && (
            <Text style={[styles.dim, { padding: 10 }]}>Loading…</Text>
          )}
        </View>
      </ScrollView>
      {error && <Text style={styles.err}>Error: {String(error)}</Text>}

      {/* Modals */}
      <TimesheetViewModal
        visible={viewOpen}
        onClose={() => setViewOpen(false)}
        data={active}
      />
      <TimesheetCalendarModal
        visible={calendarOpen}
        onClose={() => setCalendarOpen(false)}
        items={filtered}
      />
      <WeeklyTimesheetModal
        visible={weeklyOpen}
        tasks={myTasks} // from /me/tasks (selectTasks)
        loading={weeklyLoading}
        weekly={weekly}
        onFetch={weekStart => dispatch(getWeeklyTimesheet(weekStart))}
        onCreate={payload => dispatch(createWeeklyTimesheet(payload))}
        onClose={() => setWeeklyOpen(false)}
      />

      {/* <WeeklyTimesheetModal
        visible={weeklyOpen}
        tasks={myTasks}
        loading={weeklyLoading}
        weekly={weekly}
        weeklyAll={weeklyAll}
        createLoading={weeklyCreateLoading}
        onFetch={weekStartDate => dispatch(getWeeklyTimesheet(weekStartDate))}
        onFetchAll={() => dispatch(getWeeklyTimesheetsAll())}
        onCreate={payload => dispatch(createWeeklyTimesheet(payload))}
        onClose={() => setWeeklyOpen(false)}
      /> */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 12, gap: 12 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  label: { fontSize: 12, fontWeight: '800', color: '#374151', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#111827',
    backgroundColor: '#fff',
  },
  pill: {
    backgroundColor: '#f3f4f6',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  pillActive: { backgroundColor: '#111827' },
  pillTxt: { color: '#111827', fontWeight: '900' },
  pillTxtActive: { color: '#fff' },
  primaryBtn: {
    borderWidth: 1,
    borderColor: '#1d4ed8',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  primaryTxt: { fontWeight: '900', color: '#111827' },
  clearBtn: {
    alignSelf: 'flex-start',
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  clearTxt: { fontWeight: '800', color: '#111827' },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0b0b0c',
    marginTop: 4,
  },

  tableWrap: { marginTop: 6 },
  table: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    overflow: 'hidden',
  },
  trHead: { flexDirection: 'row', backgroundColor: '#e8f0ff' },
  th: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRightWidth: 1,
    borderColor: '#e5e7eb',
  },
  thTxt: { fontWeight: '900', color: '#374151' },
  tr: { flexDirection: 'row', borderTopWidth: 1, borderColor: '#f1f5f9' },
  cell: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRightWidth: 1,
    borderColor: '#f1f5f9',
    justifyContent: 'center',
  },
  body: { color: '#111827' },
  dim: { color: '#6b7280' },
  err: { color: '#b00020', textAlign: 'center', marginTop: 10 },

  avatar: { width: 36, height: 36, borderRadius: 18 },
  avatarEmpty: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
  },

  viewBtn: {
    backgroundColor: '#111827',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignSelf: 'flex-start',
  },
  viewTxt: { color: '#fff', fontWeight: '900' },
});
