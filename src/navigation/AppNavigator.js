import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import {
  selectIsAuthenticated,
  selectUserRole,
} from '../modules/auth/store/selectors';
import AuthNavigator from './AuthNavigator';
import AdminNavigator from './AdminNavigator';
import EmployeeNavigator from './EmployeeNavigator';

const AppNavigator = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userRole = useSelector(selectUserRole);

  const getNavigator = () => {
    if (!isAuthenticated) {
      return <AuthNavigator />;
    }

    if (userRole === 'admin') {
      return <AdminNavigator />;
    }

    if (userRole === 'employee') {
      return <EmployeeNavigator />;
    }

    return <AuthNavigator />;
  };

  return <NavigationContainer>{getNavigator()}</NavigationContainer>;
};

export default AppNavigator;
