// EmployeeRow.js
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Avatar from './Avatar';

export default function EmployeeRow({ employee, onPress }) {
  return (
    <Pressable style={styles.row} onPress={() => onPress && onPress(employee)}>
      <Avatar
        uri={employee.profilePictureUrl || employee.profileUrl}
        name={employee.name}
        size={52}
      />
      <View style={styles.middle}>
        <Text style={styles.name}>{employee.name}</Text>
        <Text style={styles.meta}>
          {employee.designation || employee.department || employee.employeeId}
        </Text>
      </View>
      <View style={styles.right}>
        <Text style={styles.id}>{employee.employeeId}</Text>
        <Icon name="chevron-right" size={18} color="#94A3B8" />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  middle: { flex: 1, marginLeft: 12 },
  name: { fontSize: 15, fontWeight: '700', color: '#0F172A' },
  meta: { fontSize: 12, color: '#64748B', marginTop: 4 },
  right: { alignItems: 'flex-end' },
  id: { fontSize: 12, color: '#94A3B8', marginBottom: 6 },
});
