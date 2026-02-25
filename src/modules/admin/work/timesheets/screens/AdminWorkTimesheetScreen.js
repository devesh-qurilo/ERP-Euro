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
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AddTimeLogModal from '../components/AddTimeLogModal';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  fetchMyTimesheets,
  createWeeklyTimesheet,
  getWeeklyTimesheet,
  createTimesheet,
  VcreateWeeklyTimesheet,
  VgetWeeklyTimesheet,
  deleteTimesheet,
} from '../store/actions';
import {
  selectMyTimesheets,
  selectMyTimesheetsLoad,
  selectMyTimesheetsError,
  selectWeeklyTimesheet,
  selectWeeklyTimesheetLoad,
  selectCreateTimesheetLoading,
} from '../store/selectors';
import { fetchTasks as fetchMyTasks } from '../../../shared/tasks/store/actions';
import { selectList as selectTasks } from '../../../shared/tasks/store/selectors';

import TimesheetViewModal from '../components/TimesheetViewModal';
import WeeklyTimesheetModal from '../components/WeeklyTimesheetModal';
import TimesheetCalendarModal from '../components/TimesheetCalendarModal';
import TimesheetsTable from '../components/TimesheetsTable';

const Pill = ({ active, label, onPress }) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [
      styles.pill,
      active && styles.pillActive,
      active && pressed && styles.pillPressed, // 🔥 ONLY ACTIVE HOVER
    ]}
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

export default function AdminTimesheetsScreen() {
  const dispatch = useDispatch();
  const [picker, setPicker] = useState({ field: null });

  // timesheets
  const list = useSelector(selectMyTimesheets);
  const loading = useSelector(selectMyTimesheetsLoad);
  const error = useSelector(selectMyTimesheetsError);
  // console.log('ggggggggggg', list);

  // weekly
  const weekly = useSelector(selectWeeklyTimesheet);
  const weeklyLoading = useSelector(selectWeeklyTimesheetLoad);
  const creating = useSelector(selectCreateTimesheetLoading);

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

  const openDatePicker = field => setPicker({ field });
  const closeDatePicker = () => setPicker({ field: null });

  const onDateChange = (_, d) => {
    if (!d) return closeDatePicker();
    const v = d.toISOString().slice(0, 10);
    if (picker.field === 'start') setStart(v);
    if (picker.field === 'end') setEnd(v);
    closeDatePicker();
  };

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
  const [addOpen, setAddOpen] = useState(false);

  const openView = ts => {
    setActive(ts);
    setViewOpen(true);
  };

  const handleView = ts => {
    setActive(ts);
    setViewOpen(true);
  };

  const handleEdit = ts => {
    setActive(ts);
    setAddOpen(true); // or Edit modal
  };

  const handleDelete = ts => {
    Alert.alert(
      'Delete Timesheet',
      'Are you sure you want to delete this entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => dispatch(deleteTimesheet(ts.id)),
        },
      ],
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      <View style={styles.toolbar}>
        {/* LEFT: MODE */}
        <View style={styles.modeGroup}>
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

          {/* RIGHT: ACTIONS */}
          <View style={styles.actionGroup}>
            <Pressable
              style={styles.actionBtn}
              onPress={() => setAddOpen(true)}
            >
              <Text style={styles.actionTxt}>＋ Log</Text>
            </Pressable>

            <Pressable
              style={[styles.actionBtn, styles.actionPrimary]}
              onPress={() => setWeeklyOpen(true)}
            >
              <Text style={[styles.actionTxt, { color: '#111827' }]}>
                ＋ Weekly Log
              </Text>
            </Pressable>
          </View>
        </View>

        {/* CENTER: FILTERS */}
        <View style={styles.filterRow}>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search"
            placeholderTextColor="#9ca3af"
            style={[styles.input, styles.search]}
          />

          <Pressable
            style={styles.dateInput}
            onPress={() => openDatePicker('start')}
          >
            <Text style={!start && styles.placeholder}>{start || 'Start'}</Text>
          </Pressable>

          <Pressable
            style={styles.dateInput}
            onPress={() => openDatePicker('end')}
          >
            <Text style={!end && styles.placeholder}>{end || 'End'}</Text>
          </Pressable>

          {(search || start || end) && (
            <Pressable
              onPress={() => {
                setSearch('');
                setStart('');
                setEnd('');
              }}
              style={styles.clearBtnInline}
            >
              <Text style={styles.clearTxt}>✕</Text>
            </Pressable>
          )}
        </View>
      </View>

      {picker.field && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onDateChange}
        />
      )}

      {/* Table */}
      <Text style={styles.sectionTitle}>My Timesheets</Text>

      <TimesheetsTable
        data={filtered}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
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
        onFetch={weekStart => dispatch(VgetWeeklyTimesheet(weekStart))}
        onCreate={payload => dispatch(VcreateWeeklyTimesheet(payload))}
        onClose={() => setWeeklyOpen(false)}
      />

      <AddTimeLogModal
        visible={addOpen}
        onClose={() => setAddOpen(false)}
        saving={creating}
        editData={active}
        // (optional) tasks prop. If you omit, it will use selectTasks from store
        // tasks={useSelector(selectTasks)}
        onSubmit={payload => dispatch(createTimesheet(payload))}
      />
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
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderColor: '#111827',
    borderWidth: 1,
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
  toolbar: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: 10,
  },

  modeGroup: {
    flexDirection: 'row',
    gap: 6,
  },

  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  search: {
    flex: 1,
    minWidth: 120,
    maxWidth: 120,
  },

  dateInput: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minWidth: 90,
    maxWidth: 90,
    backgroundColor: '#fff',
  },

  placeholder: {
    color: '#9ca3af',
  },

  clearBtnInline: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },

  actionGroup: {
    flexDirection: 'row',
    gap: 8,
    alignSelf: 'flex-end',
  },

  actionBtn: {
    borderWidth: 1,
    borderColor: '#1d4ed8',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },

  actionPrimary: {
    backgroundColor: '#ffffff',
    borderColor: '#1c2d53',
    color: '#111827',
  },

  actionTxt: {
    fontWeight: '900',
    color: '#111827',
  },
  pillPressed: {
    backgroundColor: '#0f172a', // slightly darker than active
    transform: [{ scale: 0.96 }],
  },
});
