import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import TabNavigator from './TabNavigator';

// Import admin screens
import AdminDashboardScreen from '../modules/admin/dashboard/screens/AdminDashboardScreen';
import AdminLeadsScreen from '../modules/admin/leads/screens/AdminLeadsScreen';
import AdminClientsScreen from '../modules/admin/clients/screens/AdminClientsScreen';
import AdminWorksScreen from '../modules/admin/works/screens/AdminWorksScreen';
import AdminHRMScreen from '../modules/admin/hrms/screens/AdminHRMScreen';
import AdminFinanceScreen from '../modules/admin/finance/screens/AdminFinanceScreen';

// Import common screens
import MessagesScreen from '../modules/common/screens/MessagesScreen';
import NotificationsScreen from '../modules/common/screens/NotificationsScreen';
import ProfileScreen from '../modules/common/screens/ProfileScreen';
import SettingsScreen from '../modules/common/screens/SettingsScreen';

const Drawer = createDrawerNavigator();

const AdminNavigator = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#2c3e50' },
        headerTintColor: '#fff',
        drawerActiveTintColor: '#2c3e50',
      }}
    >
      <Drawer.Screen name="Dashboard" component={AdminDashboardScreen} />
      <Drawer.Screen name="Leads" component={AdminLeadsScreen} />
      <Drawer.Screen name="Clients" component={AdminClientsScreen} />
      <Drawer.Screen name="Works" component={AdminWorksScreen} />
      <Drawer.Screen name="HRMS" component={AdminHRMScreen} />
      <Drawer.Screen name="Finance" component={AdminFinanceScreen} />
      <Drawer.Screen name="Messages" component={MessagesScreen} />
      <Drawer.Screen name="Notifications" component={NotificationsScreen} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
    </Drawer.Navigator>
  );
};

export default AdminNavigator;
