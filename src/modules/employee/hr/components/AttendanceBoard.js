// src/modules/employee/hr/components/AttendanceBoard.js
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import AttendanceMonthHeader from './AttendanceMonthHeader'; // default import
import { IconForRecord } from './AttendanceIcons'; // named import

const LEFT_COL_WIDTH = 220;
const DAY_COL_WIDTH = 36;
const TOTAL_COL_WIDTH = 72;

const ymd = d => {
  const dt = new Date(d);
  const m = `${dt.getMonth() + 1}`.padStart(2, '0');
  const day = `${dt.getDate()}`.padStart(2, '0');
  return `${dt.getFullYear()}-${m}-${day}`;
};
const monthKey = d => {
  const dt = new Date(d);
  const m = `${dt.getMonth() + 1}`.padStart(2, '0');
  return `${dt.getFullYear()}-${m}`;
};

export default function AttendanceBoard({
  records,
  employeeName,
  employeeId,
  avatarUri,
}) {
  const baseDate = records?.[0]?.date || new Date();
  const year = new Date(baseDate).getFullYear();
  const monthIndex = new Date(baseDate).getMonth();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const headerWidth =
    LEFT_COL_WIDTH + TOTAL_COL_WIDTH + DAY_COL_WIDTH * daysInMonth;

  const byDate = useMemo(() => {
    const mk = monthKey(new Date(year, monthIndex, 1));
    const map = {};
    (records || [])
      .filter(r => monthKey(r.date) === mk)
      .forEach(r => {
        map[ymd(r.date)] = r;
      });
    return map;
  }, [records, year, monthIndex]);

  const totalPresent = useMemo(() => {
    let sum = 0;
    for (let d = 1; d <= daysInMonth; d++) {
      const key = ymd(new Date(year, monthIndex, d));
      const r = byDate[key];
      if (!r) continue;
      if (r.holiday || r.leave) continue;
      if (r.halfDay) sum += 0.5;
      else if (r.isPresent) sum += 1;
    }
    return sum;
  }, [byDate, daysInMonth, year, monthIndex]);

  return (
    <View style={styles.card}>
      <ScrollView horizontal showsHorizontalScrollIndicator>
        <View style={{ width: headerWidth }}>
          <AttendanceMonthHeader
            year={year}
            monthIndex={monthIndex}
            dayWidth={DAY_COL_WIDTH}
            leftWidth={LEFT_COL_WIDTH}
            totalWidth={TOTAL_COL_WIDTH}
          />

          <View style={styles.row}>
            <View style={[styles.leftCell, { width: LEFT_COL_WIDTH }]}>
              <View style={styles.empWrap}>
                {avatarUri ? (
                  <Image source={{ uri: avatarUri }} style={styles.avatar} />
                ) : (
                  <View style={[styles.avatar, styles.avatarFallback]}>
                    <Text style={{ color: '#fff', fontWeight: '800' }}>
                      {(employeeName || '?')
                        .split(' ')
                        .map(n => n[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()}
                    </Text>
                  </View>
                )}
                <View>
                  <Text style={styles.empName} numberOfLines={1}>
                    {employeeName || '—'}
                  </Text>
                  <Text style={styles.empSub} numberOfLines={1}>
                    {employeeId || '—'}
                  </Text>
                </View>
              </View>
            </View>

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const d = i + 1;
              const key = ymd(new Date(year, monthIndex, d));
              const rec = byDate[key];
              return (
                <View
                  key={d}
                  style={[styles.dayCell, { width: DAY_COL_WIDTH }]}
                >
                  {IconForRecord(rec)}
                </View>
              );
            })}

            <View style={[styles.totalCell, { width: TOTAL_COL_WIDTH }]}>
              <Text
                style={styles.totalTxt}
              >{`${totalPresent}/${daysInMonth}`}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e5e7eb',
  },
  leftCell: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: '#e5e7eb',
  },
  dayCell: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: '#f1f5f9',
    minHeight: 44,
  },
  totalCell: { alignItems: 'center', justifyContent: 'center' },
  empWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    width: 220 - 24,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e5e7eb',
  },
  avatarFallback: {
    backgroundColor: '#7c3aed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  empName: { fontWeight: '800', color: '#111827' },
  empSub: { color: '#6b7280', fontSize: 12 },
  totalTxt: { fontWeight: '800', color: '#111827' },
});
