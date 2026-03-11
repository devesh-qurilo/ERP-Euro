import React, { useState, useMemo, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { fetchEmployeeAttendanceCalendar } from '../store/actions';
import { selectEmpAttendanceCalendar } from '../store/selectors';
import { SegBtn } from '../../attendance/screens/AdminAttendanceScreen';
import { openAttModal } from '../../attendance/store/actions';

export default function EmployeeAttendanceCalendar({ employeeId }) {
  const dispatch = useDispatch();
  const data = useSelector(selectEmpAttendanceCalendar);
  const fetchedRef = useRef(false);

  const [month, setMonth] = useState(new Date());

  const year = month.getFullYear();
  const monthIndex = month.getMonth();

  /* LOAD API */

  useEffect(() => {
    if (!employeeId) return;

    if (fetchedRef.current) return;

    fetchedRef.current = true;

    const from = `${year}-${String(monthIndex + 1).padStart(2, '0')}-01`;
    const to = `${year}-${String(monthIndex + 1).padStart(2, '0')}-31`;

    dispatch(
      fetchEmployeeAttendanceCalendar({
        employeeId,
        from,
        to,
      }),
    );
  }, [employeeId, year, monthIndex]);

  /* MAP DATA */

  const map = useMemo(() => {
    const m = {};

    data.forEach(a => {
      m[a.date] = a;
    });

    return m;
  }, [data]);

  /* BUILD CALENDAR */

  const calendar = useMemo(() => {
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

    const firstDay = new Date(year, monthIndex, 1).getDay();

    const cells = [];

    for (let i = 0; i < firstDay; i++) cells.push(null);

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(monthIndex + 1).padStart(
        2,
        '0',
      )}-${String(d).padStart(2, '0')}`;

      cells.push({
        date: dateStr,
        ...(map[dateStr] || {}),
      });
    }

    return cells;
  }, [map, year, monthIndex]);

  const statusColor = r => {
    if (!r) return styles.empty;

    if (r.holiday) return styles.holiday;
    if (r.leave) return styles.leave;
    if (r.isPresent) return styles.present;

    return styles.absent;
  };

  const changeMonth = diff => {
    setMonth(prev => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() + diff);

      fetchedRef.current = false; // allow next fetch

      return d;
    });
  };

  return (
    <View style={styles.card}>
      {/* HEADER */}

      <SegBtn
        label="+ Mark"
        active={false}
        onPress={() => dispatch(openAttModal())}
      />

      <View style={styles.header}>
        <Pressable onPress={() => changeMonth(-1)}>
          <Text style={styles.nav}>‹</Text>
        </Pressable>

        <Text style={styles.title}>
          {month.toLocaleString('default', { month: 'long' })} {year}
        </Text>

        <Pressable onPress={() => changeMonth(1)}>
          <Text style={styles.nav}>›</Text>
        </Pressable>
      </View>

      {/* WEEK HEADER */}

      <View style={styles.weekRow}>
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
          <Text key={d} style={styles.weekDay}>
            {d}
          </Text>
        ))}
      </View>

      {/* GRID */}

      <View style={styles.grid}>
        {calendar.map((c, i) => {
          if (!c) return <View key={i} style={styles.emptyCell} />;

          const day = Number(c.date.split('-')[2]);

          return (
            <View key={i} style={[styles.cell, statusColor(c)]}>
              <Text style={styles.dayText}>{day}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  title: {
    fontSize: 18,
    fontWeight: '800',
  },

  nav: {
    fontSize: 22,
    fontWeight: '800',
  },

  weekRow: {
    flexDirection: 'row',
  },

  weekDay: {
    flex: 1,
    textAlign: 'center',
    fontWeight: '700',
    color: '#6b7280',
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  cell: {
    width: '14.28%',
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },

  emptyCell: {
    width: '14.28%',
    height: 48,
  },

  dayText: {
    fontWeight: '700',
  },

  present: {
    backgroundColor: '#97f5b8',
  },

  absent: {
    backgroundColor: '#f68e8e',
  },

  leave: {
    backgroundColor: '#f5d75e',
  },

  holiday: {
    backgroundColor: '#5b9cf1',
  },

  empty: {
    backgroundColor: '#4c535f',
  },
});
