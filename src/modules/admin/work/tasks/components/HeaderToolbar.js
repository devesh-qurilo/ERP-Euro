import React from 'react';
import { View } from 'react-native';
import { Button } from './ui';

export default function HeaderToolbar({
  view,
  onChangeView, // (mode) => void  // 'list' | 'kanban' | 'calendar' | 'pin' | 'approval'
  onAdd, // () => void
  onMyTask, // () => void
  onApprove, // () => void (optional: if you have a separate approvals screen)
}) {
  const is = m => view === m;

  return (
    <View
      style={{
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
        marginBottom: 10,
      }}
    >
      {/* 1) Add Task */}
      <Button title="+ Add Task" onPress={onAdd} />

      {/* 2) My Task */}
      <Button title="My Task" onPress={onMyTask} bg="#E5E7EB" color="#111827" />

      {/* 3) List */}
      <Button
        title="List"
        onPress={() => onChangeView('list')}
        bg={is('list') ? '#111827' : '#E5E7EB'}
        color={is('list') ? '#fff' : '#111827'}
      />

      {/* 4) Calendar */}
      <Button
        title="Calendar"
        onPress={() => onChangeView('calendar')}
        bg={is('calendar') ? '#111827' : '#E5E7EB'}
        color={is('calendar') ? '#fff' : '#111827'}
      />

      {/* 5) Kanban */}
      <Button
        title="Kanban"
        onPress={() => onChangeView('kanban')}
        bg={is('kanban') ? '#111827' : '#E5E7EB'}
        color={is('kanban') ? '#fff' : '#111827'}
      />

      {/* 6) Pin */}
      <Button
        title="Pin"
        onPress={() => onChangeView('pin')}
        bg={is('pin') ? '#111827' : '#E5E7EB'}
        color={is('pin') ? '#fff' : '#111827'}
      />

      {/* 7) Approve */}
      <Button
        title="Approve"
        onPress={onApprove ? onApprove : () => onChangeView('approval')}
        bg={is('approval') ? '#111827' : '#E5E7EB'}
        color={is('approval') ? '#fff' : '#111827'}
      />
    </View>
  );
}
