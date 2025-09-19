import React from 'react';
import { View, StyleSheet } from 'react-native';
import EmployeeProfile from '../components/EmployeeProfile';

const EmployeeProfileScreen = () => {
  return (
    <View style={styles.container}>
      <EmployeeProfile />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
});

export default EmployeeProfileScreen;
