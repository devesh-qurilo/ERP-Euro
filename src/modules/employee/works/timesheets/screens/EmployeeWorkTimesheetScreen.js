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
import { fetchMyTimesheets } from '../store/actions';
import {
  selectMyTimesheets,
  selectMyTimesheetsError,
  selectMyTimesheetsLoading,
} from '../store/selectors';
import TimesheetsTable from '../components/TimesheetsTable';
import TimesheetViewModal from '../components/TimesheetViewModal';

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

export default function EmployeeTimesheetsScreen() {
  const dispatch = useDispatch();
  const list = useSelector(selectMyTimesheets);
  const loading = useSelector(selectMyTimesheetsLoading);
  const error = useSelector(selectMyTimesheetsError);

  // fetch
  useEffect(() => {
    dispatch(fetchMyTimesheets());
  }, [dispatch]);

  // filters
  const [search, setSearch] = useState('');
  const [startFrom, setStartFrom] = useState('');
  const [endTo, setEndTo] = useState('');

  const filtered = useMemo(() => {
    const norm = s => String(s || '').toLowerCase();
    return list.filter(x => {
      if (search.trim()) {
        const hay =
          `${x.memo} ${x.employeeId} ${x.employees?.[0]?.name}`.toLowerCase();
        if (!hay.includes(norm(search))) return false;
      }
      if (
        startFrom &&
        x.startDate &&
        new Date(x.startDate) < new Date(startFrom)
      )
        return false;
      if (endTo && x.endDate && new Date(x.endDate) > new Date(endTo))
        return false;
      return true;
    });
  }, [list, search, startFrom, endTo]);

  const clear = () => {
    setSearch('');
    setStartFrom('');
    setEndTo('');
  };

  // action strip “modes” (placeholders for now)
  const [mode, setMode] = useState('list'); // list | today | week
  const quickSet = m => {
    setMode(m);
    const today = new Date();
    if (m === 'today') {
      const ymd = today.toISOString().slice(0, 10);
      setStartFrom(ymd);
      setEndTo(ymd);
    } else if (m === 'week') {
      const d = new Date(today);
      const day = d.getDay() || 7;
      const start = new Date(d);
      start.setDate(d.getDate() - (day - 1));
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      setStartFrom(start.toISOString().slice(0, 10));
      setEndTo(end.toISOString().slice(0, 10));
    } else {
      clear();
    }
  };

  // view modal
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(null);
  const onView = item => {
    setActive(item);
    setOpen(true);
  };

  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      {/* 1) Filters */}
      <View style={styles.card}>
        <Text style={styles.h2}>Filters</Text>

        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 8,
            marginTop: 8,
          }}
        >
          <View style={{ flexBasis: '60%', minWidth: 220, paddingRight: 8 }}>
            <Text style={styles.label}>Search</Text>
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Memo / employee"
              placeholderTextColor="#9ca3af"
              style={styles.input}
            />
          </View>
          <View style={{ flexBasis: '20%', minWidth: 150, paddingRight: 8 }}>
            <Text style={styles.label}>Start From</Text>
            <TextInput
              value={startFrom}
              onChangeText={setStartFrom}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#9ca3af"
              style={styles.input}
            />
          </View>
          <View style={{ flexBasis: '20%', minWidth: 150 }}>
            <Text style={styles.label}>End To</Text>
            <TextInput
              value={endTo}
              onChangeText={setEndTo}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#9ca3af"
              style={styles.input}
            />
          </View>
        </View>

        {search || startFrom || endTo ? (
          <Pressable onPress={clear} style={styles.clearBtn}>
            <Text style={styles.clearTxt}>Clear All</Text>
          </Pressable>
        ) : null}
      </View>

      {/* 2) Action buttons */}
      <View style={styles.card}>
        <Text style={styles.h2}>Quick Views</Text>
        <View
          style={{
            flexDirection: 'row',
            gap: 8,
            flexWrap: 'wrap',
            marginTop: 8,
          }}
        >
          <Pill
            label="List"
            active={mode === 'list'}
            onPress={() => quickSet('list')}
          />
          <Pill
            label="Today"
            active={mode === 'today'}
            onPress={() => quickSet('today')}
          />
          <Pill
            label="This Week"
            active={mode === 'week'}
            onPress={() => quickSet('week')}
          />
          <Pressable
            onPress={() => {
              /* future: export */
            }}
            style={styles.secondaryBtn}
          >
            <Text style={styles.secondaryTxt}>Export CSV</Text>
          </Pressable>
        </View>
      </View>

      {/* 3) Table */}
      <Text style={styles.sectionTitle}>My Timesheets</Text>
      <TimesheetsTable data={filtered} onView={onView} />
      {loading ? <Text style={styles.note}>Loading…</Text> : null}
      {error ? <Text style={styles.err}>Error: {String(error)}</Text> : null}

      <TimesheetViewModal
        visible={open}
        item={active}
        onClose={() => setOpen(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 12, gap: 12 },
  h2: { fontSize: 18, fontWeight: '900', color: '#0b0b0c' },
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

  secondaryBtn: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  secondaryTxt: { color: '#111827', fontWeight: '900' },

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
