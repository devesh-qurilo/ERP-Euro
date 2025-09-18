import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import TabNavigator from './TabNavigator';

// Import employee screens
import EmployeeDashboardScreen from '../modules/employee/dashboard/screens/EmployeeDashboardScreen';
import EmployeeLeadsScreen from '../modules/employee/leads/screens/EmployeeLeadsScreen';
import EmployeeWorksScreen from '../modules/employee/works/screens/EmployeeWorksScreen';
import EmployeeHRScreen from '../modules/employee/hr/screens/EmployeeHRScreen';

// Import common screens
import MessagesScreen from '../modules/common/screens/MessagesScreen';
import NotificationsScreen from '../modules/common/screens/NotificationsScreen';
import ProfileScreen from '../modules/common/screens/ProfileScreen';
import SettingsScreen from '../modules/common/screens/SettingsScreen';

const Drawer = createDrawerNavigator();

const EmployeeNavigator = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#2c3e50' },
        headerTintColor: '#fff',
        drawerActiveTintColor: '#2c3e50',
      }}
    >
      <Drawer.Screen name="Dashboard" component={EmployeeDashboardScreen} />
      <Drawer.Screen name="Leads" component={EmployeeLeadsScreen} />
      <Drawer.Screen name="Works" component={EmployeeWorksScreen} />
      <Drawer.Screen name="HR" component={EmployeeHRScreen} />
      <Drawer.Screen name="Messages" component={MessagesScreen} />
      <Drawer.Screen name="Notifications" component={NotificationsScreen} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
    </Drawer.Navigator>
  );
};

export default EmployeeNavigator;
