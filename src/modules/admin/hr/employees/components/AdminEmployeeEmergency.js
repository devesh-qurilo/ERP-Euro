import { StyleSheet, Text, View, ScrollView } from 'react-native';
import React from 'react';
import EmergencyContactCreate from '../../../../employee/settings/components/EmergencyContactCreate';
import EmergencyContactsTable from '../../../../employee/settings/components/EmergencyContactsTable';

const AdminEmployeeEmergency = ({ employeeId }) => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* <Text style={styles.title}>Emergency Contacts</Text> */}

      {/* Create Contact Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Add Emergency Contact</Text>
        <EmergencyContactCreate employeeId={employeeId} />
      </View>

      {/* Contacts Table Card */}
      {/* <View style={styles.card}> */}
      <Text style={styles.cardTitle}>Saved Contacts</Text>
      <EmergencyContactsTable employeeId={employeeId} />
      {/* </View> */}
    </ScrollView>
  );
};

export default AdminEmployeeEmergency;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
    padding: 16,
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
    color: '#111',
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,

    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },

    elevation: 3,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
});
