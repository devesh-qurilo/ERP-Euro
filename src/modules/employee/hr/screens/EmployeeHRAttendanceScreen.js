// src/modules/employee/hr/screens/EmployeeHRAttendanceScreen.js
import React, { useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyAttendance } from '../store/actions';
import {
  selectAttendanceData,
  selectAttendanceLoading,
  selectAttendanceError,
} from '../store/selectors';
import AttendanceBoard from '../components/AttendanceBoard';

export default function EmployeeHRAttendanceScreen() {
  const dispatch = useDispatch();
  const records = useSelector(selectAttendanceData);
  const loading = useSelector(selectAttendanceLoading);
  const error = useSelector(selectAttendanceError);

  useEffect(() => {
    dispatch(fetchMyAttendance());
  }, [dispatch]);

  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      <Text style={styles.title}>Attendance</Text>

      {loading && records.length === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator />
        </View>
      ) : error ? (
        <Text style={styles.err}>Failed to load: {String(error)}</Text>
      ) : (
        <AttendanceBoard
          records={records}
          employeeName={records?.[0]?.employeeName}
          employeeId={records?.[0]?.employeeId}
          // avatarUri: plug employee photo URL if you have it
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 16, gap: 12 },
  title: { fontSize: 22, fontWeight: '900', color: '#0b0b0c' },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  err: { color: '#b00020' },
});
