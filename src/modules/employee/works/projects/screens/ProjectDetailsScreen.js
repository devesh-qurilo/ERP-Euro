import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useRoute } from '@react-navigation/native';
import ProjectOverviewTab from '../tabs/ProjectOverviewTab';
import ProjectFilesTab from '../components/ProjectFilesTab';

const Tab = createMaterialTopTabNavigator();

export default function ProjectDetailsScreen() {
  const route = useRoute();
  const { projectId } = route.params || {};

  return (
    <Tab.Navigator
      initialRouteName="Overview"
      screenOptions={{
        tabBarIndicatorStyle: { backgroundColor: '#111827' },
        tabBarActiveTintColor: '#111827',
        tabBarInactiveTintColor: '#6b7280',
        tabBarLabelStyle: { fontWeight: '900' },
        tabBarStyle: { backgroundColor: '#fff' },
      }}
    >
      <Tab.Screen
        name="Overview"
        component={ProjectOverviewTab}
        initialParams={{ projectId }}
      />
      {/* <Tab.Screen
        name="File"
        component={PlaceholderTab}
        initialParams={{ label: 'Files coming soon' }}
      /> */}
      <Tab.Screen
        name="FilesTab"
        component={ProjectFilesTab}
        options={{ tabBarLabel: 'Files', title: 'Files' }}
        initialParams={{ projectId }}
      />
      <Tab.Screen
        name="Notes"
        component={PlaceholderTab}
        initialParams={{ label: 'Notes coming soon' }}
      />
      <Tab.Screen
        name="Activity"
        component={PlaceholderTab}
        initialParams={{ label: 'Activity coming soon' }}
      />
    </Tab.Navigator>
  );
}

function PlaceholderTab({ route }) {
  return null; // keep clean for now; you’ll add real UIs later
}
