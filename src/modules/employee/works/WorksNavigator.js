import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import EmployeeProjectsScreen from './projects/screens/EmployeeProjectsScreen';
import ProjectDetailsScreen from './projects/screens/ProjectDetailsScreen';

const Stack = createNativeStackNavigator();

export default function WorksNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Projects"
        component={EmployeeProjectsScreen}
        options={{ title: 'Projects' }}
      />
      <Stack.Screen
        name="ProjectDetails"
        component={ProjectDetailsScreen}
        options={{ title: 'Project Details' }}
      />
    </Stack.Navigator>
  );
}
