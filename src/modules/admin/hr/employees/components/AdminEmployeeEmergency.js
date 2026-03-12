import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import EmergencyContactCreate from '../../../../employee/settings/components/EmergencyContactCreate';
import EmergencyContactsTable from '../../../../employee/settings/components/EmergencyContactsTable';

const AdminEmployeeEmergency = ({ employeeId }) => {
  return (
    <View>
      <EmergencyContactCreate employeeId={employeeId} />
      <EmergencyContactsTable employeeId={employeeId} />
    </View>
  );
};

export default AdminEmployeeEmergency;

const styles = StyleSheet.create({});
