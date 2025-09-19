import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../modules/auth/screens/LoginScreen';
import MainAppScreen from './MainAppScreen';
import EmployeeProfileScreen from '../modules/employee/profile/screens/EmployeeProfileScreen';

const Stack = createStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Main" component={MainAppScreen} />
      <Stack.Screen name="EmployeeProfile" component={EmployeeProfileScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
