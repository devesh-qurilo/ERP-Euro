// src/modules/admin/work/Task/screens/AdminWorkTaskScreen.js
import React from 'react';
import { View } from 'react-native';
import TaskListContainer from '../../../shared/containers/TaskListContainer';
import { useNavigation } from '@react-navigation/native';

export default function AdminWorkTaskScreen() {
  const nav = useNavigation();
  return (
    <View style={{ flex: 1, backgroundColor: '#F6F7F9', padding: 14 }}>
      <TaskListContainer
        initialSource={{ kind: 'all' }}
        onNavigateView={rec =>
          nav.navigate('AdminTaskDetail', { taskId: rec.id })
        }
      />
    </View>
  );
}
