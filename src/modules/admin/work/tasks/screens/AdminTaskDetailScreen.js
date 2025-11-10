import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { adminTasksAPI } from '../../../../../services/api';

export default function AdminTaskDetailScreen() {
  const { params } = useRoute();
  const taskId = params?.taskId;
  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState(null);

  useEffect(() => {
    let ok = true;
    (async () => {
      try {
        // If a GET /api/projects/tasks/{id} exists, use it.
        const all = await adminTasksAPI.listAll();
        const found = Array.isArray(all)
          ? all.find(t => String(t.id) === String(taskId))
          : null;
        if (ok) setTask(found || null);
      } finally {
        if (ok) setLoading(false);
      }
    })();
    return () => {
      ok = false;
    };
  }, [taskId]);

  if (loading)
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  if (!task)
    return (
      <View style={{ padding: 16 }}>
        <Text>Task not found.</Text>
      </View>
    );

  return (
    <View style={{ flex: 1, backgroundColor: '#F6F7F9', padding: 16 }}>
      <View
        style={{
          backgroundColor: '#fff',
          borderRadius: 12,
          padding: 14,
          borderWidth: 1,
          borderColor: '#EEE',
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: '700' }}>{task.title}</Text>
        <Text style={{ marginTop: 6, color: '#6B7280' }}>
          Stage: {task?.taskStage?.name || '—'} · Priority:{' '}
          {task?.priority || '—'}
        </Text>
        <Text style={{ marginTop: 10 }}>{task?.description || '—'}</Text>
      </View>
    </View>
  );
}
