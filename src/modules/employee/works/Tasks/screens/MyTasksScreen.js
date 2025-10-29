import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStatuses } from '../store/actions';
import { selectMyTasks } from '../store/selectors'; // your existing selector
import { selectStatuses, selectStatusesLoading } from '../store/selectors';
import KanbanBoard from '../components/KanbanBoard';
import TasksTable from '../components/TasksTable'; // your list view

export default function MyTasksScreen() {
  const dispatch = useDispatch();
  const tasks = useSelector(selectMyTasks);
  const statuses = useSelector(selectStatuses);
  const stLoading = useSelector(selectStatusesLoading);

  const [view, setView] = useState('list'); // 'list' | 'kanban'

  useEffect(() => {
    if (view === 'kanban') dispatch(fetchStatuses());
  }, [view, dispatch]);

  return (
    <View style={{ flex: 1 }}>
      {/* Top controls */}
      <View style={styles.topBar}>
        <Pressable
          onPress={() => setView('list')}
          style={[styles.tabBtn, view === 'list' && styles.tabBtnActive]}
        >
          <Text style={[styles.tabTxt, view === 'list' && styles.tabTxtActive]}>
            List
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setView('kanban')}
          style={[styles.tabBtn, view === 'kanban' && styles.tabBtnActive]}
        >
          <Text
            style={[styles.tabTxt, view === 'kanban' && styles.tabTxtActive]}
          >
            Kanban
          </Text>
        </Pressable>
      </View>

      {/* Body */}
      {view === 'list' ? (
        <TasksTable data={tasks} onPin={() => {}} onView={() => {}} />
      ) : stLoading ? (
        <Text style={{ padding: 12, color: '#6b7280' }}>Loading stages…</Text>
      ) : (
        <KanbanBoard statuses={statuses} tasks={tasks} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: { flexDirection: 'row', gap: 8, padding: 10 },
  tabBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#f3f4f6',
  },
  tabBtnActive: { backgroundColor: '#111827' },
  tabTxt: { fontWeight: '900', color: '#111827' },
  tabTxtActive: { color: '#fff' },
});
