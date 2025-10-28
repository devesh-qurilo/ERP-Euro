// src/modules/employee/works/tasks/screens/EmployeeTasksScreen.js
import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { fetchMyTasks, togglePinTask } from '../store/actions';
import {
  selectTasks,
  selectTasksError,
  selectTasksLoading,
  selectPinnedTasks,
  selectWaitingTasks,
} from '../store/selectors';

import TasksTable from '../components/TasksTable';
import TasksCalendarModal from '../components/TasksCalendarModal';
import TaskDetailsModal from '../../projects/components/TaskDetailsModal'; // ✅ reuse your modal

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

const Select = ({ label, value, options, onChange, style }) => {
  const [open, setOpen] = useState(false);
  return (
    <View style={[{ minWidth: 150, marginRight: 8, marginBottom: 8 }, style]}>
      <Text style={styles.label}>{label}</Text>
      <Pressable style={styles.selectBtn} onPress={() => setOpen(o => !o)}>
        <Text style={styles.value} numberOfLines={1}>
          {value}
        </Text>
        <Text style={styles.caret}>{open ? '▴' : '▾'}</Text>
      </Pressable>
      {open && (
        <View style={styles.menu}>
          {options.map(opt => (
            <Pressable
              key={String(opt)}
              onPress={() => {
                onChange(opt);
                setOpen(false);
              }}
              style={styles.menuItem}
            >
              <Text style={styles.menuTxt}>{String(opt)}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
};

export default function EmployeeTasksScreen() {
  const dispatch = useDispatch();
  const list = useSelector(selectTasks);
  const loading = useSelector(selectTasksLoading);
  const error = useSelector(selectTasksError);
  const pinned = useSelector(selectPinnedTasks);
  const waiting = useSelector(selectWaitingTasks);

  useEffect(() => {
    dispatch(fetchMyTasks());
  }, [dispatch]);

  // filters
  const [search, setSearch] = useState('');
  const [priority, setPriority] = useState('All');
  const [stage, setStage] = useState('All');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  const priorityOpts = useMemo(
    () => [
      'All',
      ...Array.from(new Set(list.map(x => x.priority).filter(Boolean))),
    ],
    [list],
  );
  const stageOpts = useMemo(
    () => [
      'All',
      ...Array.from(new Set(list.map(x => x.taskStage?.name).filter(Boolean))),
    ],
    [list],
  );

  const hasFilters = useMemo(
    () =>
      Boolean(
        search.trim() || priority !== 'All' || stage !== 'All' || start || end,
      ),
    [search, priority, stage, start, end],
  );

  const [mode, setMode] = useState('list'); // list | calendar | pinned | waiting
  const [calendarOpen, setCalendarOpen] = useState(false);

  const filtered = useMemo(() => {
    let data = list;
    if (mode === 'pinned') data = pinned;
    if (mode === 'waiting') data = waiting;

    if (!hasFilters) return data;

    const norm = v => String(v || '').toLowerCase();
    return data.filter(t => {
      if (search.trim()) {
        const hay =
          `${t.title} ${t.taskStage?.name} ${t.priority}`.toLowerCase();
        if (!hay.includes(norm(search))) return false;
      }
      if (priority !== 'All' && (t.priority || '') !== priority) return false;
      if (stage !== 'All' && (t.taskStage?.name || '') !== stage) return false;
      const sd = t.startDate ? new Date(t.startDate) : null;
      const dd = t.dueDate ? new Date(t.dueDate) : null;
      if (start && sd && new Date(start) > sd) return false;
      if (end && dd && new Date(end) < dd) return false;
      return true;
    });
  }, [
    list,
    pinned,
    waiting,
    mode,
    hasFilters,
    search,
    priority,
    stage,
    start,
    end,
  ]);

  const clearFilters = () => {
    setSearch('');
    setPriority('All');
    setStage('All');
    setStart('');
    setEnd('');
  };

  // Modals / actions
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [activeTask, setActiveTask] = useState(null);
  const openTask = t => {
    setActiveTask(t);
    setTaskModalOpen(true);
  };

  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      {/* Filters Card */}
      <View style={styles.card}>
        {/* actions strip */}
        <View
          style={{
            flexDirection: 'row',
            gap: 8,
            marginBottom: 8,
            flexWrap: 'wrap',
          }}
        >
          <Pressable
            style={[styles.primaryBtn, { backgroundColor: '#1d4ed8' }]}
            onPress={() => {
              /* future: open create task modal */
            }}
          >
            <Text style={[styles.primaryTxt, { color: '#fff' }]}>
              + New Task
            </Text>
          </Pressable>

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
            label="Pinned"
            active={mode === 'pinned'}
            onPress={() => setMode('pinned')}
          />
          <Pill
            label="Waiting"
            active={mode === 'waiting'}
            onPress={() => setMode('waiting')}
          />
        </View>

        {/* search + date range */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          <View style={{ flexBasis: '60%', minWidth: 220, paddingRight: 8 }}>
            <Text style={styles.label}>Search</Text>
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Title, stage, priority"
              placeholderTextColor="#9ca3af"
              style={styles.input}
              autoCapitalize="none"
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

        {/* selects */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 }}>
          <Select
            label="Priority"
            value={priority}
            options={priorityOpts}
            onChange={setPriority}
          />
          <Select
            label="Stage"
            value={stage}
            options={stageOpts}
            onChange={setStage}
          />
        </View>

        {hasFilters && (
          <Pressable onPress={clearFilters} style={styles.clearBtn}>
            <Text style={styles.clearTxt}>Clear All</Text>
          </Pressable>
        )}
      </View>

      {/* Content */}
      <Text style={styles.sectionTitle}>
        {mode === 'pinned'
          ? 'Pinned Tasks'
          : mode === 'waiting'
          ? 'Waiting Tasks'
          : 'Tasks'}
      </Text>

      <TasksTable
        data={filtered}
        onPin={t => dispatch(togglePinTask(t.id))}
        onView={openTask}
      />

      {loading ? <Text style={styles.note}>Loading…</Text> : null}
      {error ? <Text style={styles.err}>Error: {String(error)}</Text> : null}

      {/* Calendar */}
      <TasksCalendarModal
        visible={calendarOpen}
        onClose={() => setCalendarOpen(false)}
        tasks={filtered}
      />

      {/* Task details (reused) */}
      <TaskDetailsModal
        visible={taskModalOpen}
        task={activeTask}
        onClose={() => setTaskModalOpen(false)}
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
    backgroundColor: '#fff',
    color: '#111827',
  },
  primaryBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1d4ed8',
    backgroundColor: '#fff',
  },
  primaryTxt: { fontWeight: '900', color: '#111827' },
  pill: {
    backgroundColor: '#f3f4f6',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  pillActive: { backgroundColor: '#111827' },
  pillTxt: { color: '#111827', fontWeight: '900' },
  pillTxtActive: { color: '#fff' },
  selectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
  },
  value: { flex: 1, color: '#111827' },
  caret: { color: '#6b7280' },
  menu: {
    position: 'absolute',
    top: 64,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
    zIndex: 20,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#f1f5f9',
  },
  menuTxt: { color: '#111827' },
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
  note: { color: '#6b7280', textAlign: 'center', marginTop: 10 },
  err: { color: '#b00020', textAlign: 'center', marginTop: 10 },
});
