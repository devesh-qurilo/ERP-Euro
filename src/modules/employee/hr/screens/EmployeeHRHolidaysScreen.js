// src/modules/employee/hr/screens/EmployeeHRHolidaysScreen.js
import React, { useEffect, useMemo, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHolidays } from '../store/actions';
import {
  selectHolidaysData,
  selectHolidaysLoading,
  selectHolidaysError,
} from '../store/selectors';
import HolidaysListTable from '../components/HolidaysListTable';
import HolidaysCalendar from '../components/HolidaysCalendar';

function Select({ label, value, options, onChange }) {
  const [open, setOpen] = useState(false);
  return (
    <View style={styles.selectWrap}>
      <Text style={styles.selectLabel}>{label}</Text>
      <Pressable onPress={() => setOpen(v => !v)} style={styles.selectBtn}>
        <Text style={styles.selectValue}>{value}</Text>
        <Text style={styles.selectCaret}>{open ? '▴' : '▾'}</Text>
      </Pressable>
      {open && (
        <View style={styles.selectMenu}>
          {options.map(x => (
            <Pressable
              key={String(x)}
              onPress={() => {
                onChange(x);
                setOpen(false);
              }}
              style={styles.selectItem}
            >
              <Text style={styles.selectItemText}>{x}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export default function EmployeeHRHolidaysScreen() {
  const dispatch = useDispatch();
  const rows = useSelector(selectHolidaysData);
  const loading = useSelector(selectHolidaysLoading);
  const error = useSelector(selectHolidaysError);

  useEffect(() => {
    dispatch(fetchHolidays());
  }, [dispatch]);

  const now = new Date();
  const [monthName, setMonthName] = useState(MONTHS[now.getMonth()]);
  const [year, setYear] = useState(now.getFullYear());
  const years = useMemo(() => {
    const start = now.getFullYear() - 3;
    return Array.from({ length: 7 }, (_, i) => String(start + i));
  }, [now]);

  const monthIndex = MONTHS.indexOf(monthName);

  const monthRows = useMemo(() => {
    return (rows || [])
      .filter(r => {
        const d = new Date(r.date);
        return d.getMonth() === monthIndex && d.getFullYear() === Number(year);
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [rows, monthIndex, year]);

  const [view, setView] = useState('list'); // 'list' | 'profile'

  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      {/* filters */}
      <View style={styles.toolbar}>
        <Select
          label="Month"
          value={monthName}
          options={MONTHS}
          onChange={setMonthName}
        />
        <View style={{ width: 12 }} />
        <Select
          label="Year"
          value={String(year)}
          options={years}
          onChange={v => setYear(Number(v))}
        />
        <View style={{ width: 12 }} />
        <Pressable
          style={styles.filterBtn}
          onPress={() =>
            Alert.alert('Filters', 'Advanced filters coming soon.')
          }
        >
          <Text style={{ fontSize: 16, marginRight: 8 }}>⚙️</Text>
          <Text style={{ fontWeight: '800', color: '#111827' }}>Filters</Text>
        </Pressable>
      </View>

      {/* toggles */}
      <View style={styles.viewTabs}>
        <Pressable
          onPress={() => setView('list')}
          style={[styles.tabBtn, view === 'list' && styles.tabActive]}
        >
          <Text
            style={[styles.tabIcon, view === 'list' && styles.tabIconActive]}
          >
            ≣
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setView('profile')}
          style={[styles.tabBtn, view === 'profile' && styles.tabActive]}
        >
          <Text
            style={[styles.tabIcon, view === 'profile' && styles.tabIconActive]}
          >
            📅
          </Text>
        </Pressable>
      </View>

      {/* content */}
      {view === 'list' ? (
        <HolidaysListTable rows={monthRows} />
      ) : (
        <HolidaysCalendar
          rows={monthRows}
          year={year}
          monthIndex={monthIndex}
        />
      )}

      {loading ? <Text style={styles.note}>Loading…</Text> : null}
      {error ? <Text style={styles.err}>Error: {String(error)}</Text> : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 16, gap: 12 },
  toolbar: { flexDirection: 'row', alignItems: 'flex-end' },
  selectWrap: { position: 'relative' },
  selectLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#374151',
    marginBottom: 4,
  },
  selectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    minWidth: 120,
  },
  selectValue: { fontSize: 15, color: '#111827', flexGrow: 1, marginRight: 8 },
  selectCaret: { fontSize: 14, color: '#6b7280' },
  selectMenu: {
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
  selectItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#f1f5f9',
  },
  selectItemText: { fontSize: 15, color: '#111827' },

  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
  },

  viewTabs: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  tabBtn: { paddingHorizontal: 16, paddingVertical: 10 },
  tabActive: { backgroundColor: '#f0f2f6' },
  tabIcon: { fontSize: 18, color: '#6b7280' },
  tabIconActive: { color: '#111827' },

  note: { color: '#6b7280' },
  err: { color: '#b00020' },
});
