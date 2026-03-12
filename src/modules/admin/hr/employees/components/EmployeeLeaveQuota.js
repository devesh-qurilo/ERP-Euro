import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { fetchEmployeeLeaveQuota } from '../store/actions';
import { selectEmpLeaveQuota } from '../store/selectors';

export default function EmployeeLeaveQuota({ employeeId }) {
  const dispatch = useDispatch();
  const quota = useSelector(selectEmpLeaveQuota);

  useEffect(() => {
    if (!employeeId) return;

    dispatch(fetchEmployeeLeaveQuota(employeeId));
  }, [employeeId]);

  return (
    <View style={styles.row}>
      {quota.map(q => (
        <View key={q.id} style={styles.card}>
          <Text style={styles.type}>{q.leaveType} LEAVE</Text>

          <View style={styles.line}>
            <Text>Total</Text>
            <Text>{q.totalLeaves}</Text>
          </View>

          <View style={styles.line}>
            <Text>Taken</Text>
            <Text>{q.totalTaken}</Text>
          </View>

          <View style={styles.line}>
            <Text>Remaining</Text>
            <Text style={styles.remaining}>{q.remainingLeaves}</Text>
          </View>

          <View style={styles.line}>
            <Text>Monthly Limit</Text>
            <Text>{q.monthlyLimit}</Text>
          </View>

          <View style={styles.line}>
            <Text>Overused</Text>
            <Text style={styles.over}>{q.overUtilized}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  card: {
    flex: 1,
    minWidth: 110,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    padding: 10,
  },

  type: {
    fontWeight: '800',
    marginBottom: 4,
  },

  stat: {
    fontSize: 12,
  },

  bold: {
    fontWeight: '700',
  },

  remaining: {
    fontWeight: '800',
    color: '#16a34a',
  },
  line: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
  },

  over: {
    color: '#dc2626',
    fontWeight: '700',
  },
});
