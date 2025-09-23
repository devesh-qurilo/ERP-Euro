// src/modules/employee/hr/screens/EmployeeHRAttendanceScreen.js
import React, { useMemo, useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyAttendance } from '../store/actions';
import {
  selectAttendanceData,
  selectAttendanceLoading,
  selectAttendanceError,
} from '../store/selectors';

import AttendanceBoard from '../components/AttendanceBoard';
import AttendanceLegend from '../components/AttendanceLegend';
import AttendanceSummary from '../components/AttendanceSummary';
import AttendanceMonthTable from '../components/AttendanceMonthTable';

// --- tiny dropdown ---
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

export default function EmployeeHRAttendanceScreen() {
  const dispatch = useDispatch();
  const records = useSelector(selectAttendanceData);
  const loading = useSelector(selectAttendanceLoading);
  const error = useSelector(selectAttendanceError);

  useEffect(() => {
    dispatch(fetchMyAttendance());
  }, [dispatch]);

  // filters
  const now = new Date();
  const [monthName, setMonthName] = useState(MONTHS[now.getMonth()]);
  const [year, setYear] = useState(now.getFullYear());
  const years = useMemo(() => {
    const y0 = now.getFullYear() - 3;
    return Array.from({ length: 7 }, (_, i) => y0 + i);
  }, [now]);

  const monthIndex = MONTHS.indexOf(monthName);

  // filter to selected month
  const monthRows = useMemo(() => {
    return (records || [])
      .filter(r => {
        const d = new Date(r.date);
        return d.getMonth() === monthIndex && d.getFullYear() === year;
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [records, monthIndex, year]);

  // metrics
  const metrics = useMemo(() => {
    let present = 0,
      absent = 0,
      holidays = 0,
      half = 0,
      working = 0;
    monthRows.forEach(r => {
      const isWork = !r.holiday && !r.leave;
      if (isWork) working++;
      if (r.holiday) holidays++;
      else if (r.leave)
        absent++; // treat leave as day-off count; adjust if you separate absent vs leave
      else if (r.halfDay) {
        half++;
        present += 0.5;
      } else if (r.isPresent) present++;
      else absent++;
    });
    return { working, present, absent, holidays, half };
  }, [monthRows]);

  // view: 'list' | 'profile'
  const [view, setView] = useState('list');

  return (
    <ScrollView
      contentContainerStyle={styles.wrap}
      keyboardShouldPersistTaps="handled"
    >
      {/* filter bar */}
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
          options={years.map(String)}
          onChange={v => setYear(+v)}
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

      {/* view toggles */}
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
            👤
          </Text>
        </Pressable>
      </View>

      {/* Legend + Board (LIST) */}
      {view === 'list' && (
        <View style={styles.card}>
          <AttendanceLegend />
          <View style={{ height: 8 }} />
          <AttendanceBoard
            records={monthRows}
            employeeName={monthRows?.[0]?.employeeName}
            employeeId={monthRows?.[0]?.employeeId}
          />
        </View>
      )}

      {/* Profile view: summary + table */}
      {view === 'profile' && (
        <View style={{ gap: 12 }}>
          <AttendanceSummary
            workingDays={metrics.working}
            presentDays={metrics.present}
            absentDays={metrics.absent}
            holidays={metrics.holidays}
            halfDays={metrics.half}
          />
          <AttendanceMonthTable rows={monthRows} />
        </View>
      )}

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

  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },

  err: { color: '#b00020' },
});
