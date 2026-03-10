import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

export default function MemberAttendanceTable({ data = [] }) {
  const { employees, days } = useMemo(() => {
    const map = {};

    data.forEach(r => {
      if (!map[r.employeeId]) {
        map[r.employeeId] = {
          name: r.employeeName,
          days: {},
          total: 0,
        };
      }

      const day = Number(r.date.split('-')[2]);

      map[r.employeeId].days[day] = r;

      if (r.isPresent) map[r.employeeId].total += 1;
    });

    return {
      employees: Object.entries(map),
      days: Array.from({ length: 31 }, (_, i) => i + 1),
    };
  }, [data]);

  const renderStatus = r => {
    if (!r) return '—';

    if (r.holiday) return '⭐';
    if (r.leave) return '🛫';
    if (r.halfDay) return '☆';
    if (r.late) return '!';
    if (r.isPresent) return '✔';

    return '—';
  };

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator>
      <View style={styles.table}>
        {/* HEADER */}
        <View style={[styles.row, styles.head]}>
          <Text style={[styles.empHead]}>Employee</Text>

          {days.map(d => (
            <Text key={d} style={styles.dayHead}>
              {d}
            </Text>
          ))}

          <Text style={styles.totalHead}>Total</Text>
        </View>

        {/* ROWS */}
        {employees.map(([empId, emp]) => (
          <View key={empId} style={styles.row}>
            <View style={styles.empCell}>
              <Text style={styles.empName}>{emp.name}</Text>
              <Text style={styles.empId}>{empId}</Text>
            </View>

            {days.map(d => (
              <Text key={d} style={styles.dayCell}>
                {renderStatus(emp.days[d])}
              </Text>
            ))}

            <Text style={styles.totalCell}>{emp.total}/31</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  table: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
  },

  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },

  head: {
    backgroundColor: '#e2e8f0',
  },

  empHead: {
    width: 180,
    padding: 10,
    fontWeight: '900',
  },

  empCell: {
    width: 180,
    padding: 10,
  },

  empName: {
    fontWeight: '700',
  },

  empId: {
    fontSize: 12,
    color: '#6b7280',
  },

  dayHead: {
    width: 34,
    textAlign: 'center',
    paddingVertical: 8,
    fontWeight: '800',
  },

  dayCell: {
    width: 34,
    textAlign: 'center',
    paddingVertical: 8,
    fontSize: 14,
  },

  totalHead: {
    width: 60,
    textAlign: 'center',
    fontWeight: '900',
  },

  totalCell: {
    width: 60,
    textAlign: 'center',
    fontWeight: '700',
  },
});
