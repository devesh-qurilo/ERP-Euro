import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

// Import employee screens
import EmployeeDashboardScreen from '../modules/employee/dashboard/screens/EmployeeDashboardScreen';
import EmployeeLeadsScreen from '../modules/employee/leads/screens/EmployeeLeadsScreen';
import EmployeeWorksScreen from '../modules/employee/works/screens/EmployeeWorksScreen';
import EmployeeHRScreen from '../modules/employee/hr/screens/EmployeeHRScreen';
import EmployeeProfileScreen from '../modules/employee/profile/screens/EmployeeProfileScreen';

// Import common screens
import MessagesScreen from '../modules/common/screens/MessagesScreen';
import NotificationsScreen from '../modules/common/screens/NotificationsScreen';
import SettingsScreen from '../modules/common/screens/SettingsScreen';

const Drawer = createDrawerNavigator();

const EmployeeNavigator = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#2c3e50' },
        headerTintColor: '#fff',
        drawerActiveTintColor: '#2c3e50',
        drawerInactiveTintColor: '#7f8c8d',
      }}
    >
      <Drawer.Screen
        name="Dashboard"
        component={EmployeeDashboardScreen}
        options={{
          drawerLabel: 'Dashboard',
          title: 'Employee Dashboard',
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={EmployeeProfileScreen}
        options={{
          drawerLabel: 'My Profile',
          title: 'My Profile',
        }}
      />
      <Drawer.Screen
        name="Leads"
        component={EmployeeLeadsScreen}
        options={{
          drawerLabel: 'Leads',
          title: 'Leads Management',
        }}
      />
      <Drawer.Screen
        name="Works"
        component={EmployeeWorksScreen}
        options={{
          drawerLabel: 'Works',
          title: 'Works & Tasks',
        }}
      />
      <Drawer.Screen
        name="HR"
        component={EmployeeHRScreen}
        options={{
          drawerLabel: 'HR',
          title: 'Human Resources',
        }}
      />
      <Drawer.Screen
        name="Messages"
        component={MessagesScreen}
        options={{
          drawerLabel: 'Messages',
          title: 'Messages',
        }}
      />
      <Drawer.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          drawerLabel: 'Notifications',
          title: 'Notifications',
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          drawerLabel: 'Settings',
          title: 'Settings',
        }}
      />
    </Drawer.Navigator>
  );
};

export default EmployeeNavigator;
