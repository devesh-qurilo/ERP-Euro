import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import DashboardStatCards from '../components/DashboardStatCards';
import DashboardStatCardsFancy from '../components/DashboardStatCardsFancy';

const AdminDashboardScreen = () => {
  return (
    <View>
      <DashboardStatCards />
      <DashboardStatCardsFancy />
    </View>
  );
};

export default AdminDashboardScreen;

const styles = StyleSheet.create({});
