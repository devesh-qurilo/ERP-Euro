import React, { useEffect, useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { fetchProjects } from '../store/actions';
import {
  selectProjects,
  selectProjectsError,
  selectProjectsLoading,
  selectPinnedIds,
} from '../store/selectors';

import ProjectsTable from '../components/ProjectTable';
import ProjectsCalendarModal from '../components/ProjectsCalendarModal';

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

export default function EmployeeProjectsScreen() {
  const dispatch = useDispatch();
  const list = useSelector(selectProjects);
  const loading = useSelector(selectProjectsLoading);
  const error = useSelector(selectProjectsError);
  const pinnedIds = useSelector(selectPinnedIds);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  // filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');
  const [client, setClient] = useState('All');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  const categoryOpts = useMemo(
    () => [
      'All',
      ...Array.from(new Set(list.map(x => x.category).filter(Boolean))),
    ],
    [list],
  );
  const statusOpts = useMemo(
    () => [
      'All',
      ...Array.from(new Set(list.map(x => x.projectStatus || 'OPEN'))),
    ],
    [list],
  );
  const clientOpts = useMemo(
    () => [
      'All',
      ...Array.from(new Set(list.map(x => x.client?.name).filter(Boolean))),
    ],
    [list],
  );

  const hasFilters = useMemo(
    () =>
      Boolean(
        search.trim() ||
          category !== 'All' ||
          status !== 'All' ||
          client !== 'All' ||
          start ||
          end,
      ),
    [search, category, status, client, start, end],
  );

  const [mode, setMode] = useState('list'); // list | calendar | pinned
  const [calendarOpen, setCalendarOpen] = useState(false);

  const filtered = useMemo(() => {
    let data = list;
    if (mode === 'pinned') data = data.filter(p => pinnedIds.includes(p.id));

    if (!hasFilters) return data;

    const norm = (v = '') => String(v).toLowerCase();
    return data.filter(p => {
      if (search.trim()) {
        const hay = `${p.shortCode} ${p.name} ${p.client?.name}`.toLowerCase();
        if (!hay.includes(norm(search))) return false;
      }
      if (category !== 'All' && p.category !== category) return false;
      if (status !== 'All' && (p.projectStatus || 'OPEN') !== status)
        return false;
      if (client !== 'All' && (p.client?.name || '') !== client) return false;

      const sd = p.startDate ? new Date(p.startDate) : null;
      const dl = p.deadline ? new Date(p.deadline) : null;
      if (start && sd && new Date(start) > sd) return false;
      if (end && dl && new Date(end) < dl) return false;

      return true;
    });
  }, [
    list,
    pinnedIds,
    mode,
    hasFilters,
    search,
    category,
    status,
    client,
    start,
    end,
  ]);

  const clearFilters = () => {
    setSearch('');
    setCategory('All');
    setStatus('All');
    setClient('All');
    setStart('');
    setEnd('');
  };

  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      {/* top filters card */}
      <View style={styles.card}>
        {/* view switcher */}
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
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
        </View>

        {/* search + date range */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          <View style={{ flexBasis: '60%', minWidth: 220, paddingRight: 8 }}>
            <Text style={styles.label}>Search</Text>
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search by code, name, or client"
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
            label="Category"
            value={category}
            options={categoryOpts}
            onChange={setCategory}
          />
          <Select
            label="Status"
            value={status}
            options={statusOpts}
            onChange={setStatus}
          />
          <Select
            label="Client"
            value={client}
            options={clientOpts}
            onChange={setClient}
          />
        </View>

        {/* clear */}
        {hasFilters && (
          <Pressable onPress={clearFilters} style={styles.clearBtn}>
            <Text style={styles.clearTxt}>Clear All</Text>
          </Pressable>
        )}
      </View>

      {/* content */}
      <Text style={styles.sectionTitle}>
        {mode === 'pinned' ? 'Pinned Projects' : 'Projects'}
      </Text>
      <ProjectsTable data={filtered} />

      {loading ? <Text style={styles.note}>Loading…</Text> : null}
      {error ? <Text style={styles.err}>Error: {String(error)}</Text> : null}

      {/* Calendar modal (uses API dates) */}
      <ProjectsCalendarModal
        visible={calendarOpen}
        onClose={() => setCalendarOpen(false)}
        projects={filtered}
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

  note: { color: '#6b7280', textAlign: 'center', marginTop: 10 },
  err: { color: '#b00020', textAlign: 'center', marginTop: 10 },
});
