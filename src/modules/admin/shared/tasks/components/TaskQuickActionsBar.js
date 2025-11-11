import React from 'react';
import { View, TextInput } from 'react-native';
import { Button } from './ui';

export default function TaskQuickActionsBar({
  view,
  setView, // 'list'|'calendar'|'kanban'|'pin'|'approval'
  sourceKind,
  setSourceKind, // 'all'|'my'|'project'|'employee'
  onAdd,
  onSearchChange,
  searchValue,
}) {
  const active = m => view === m;
  const Btn = ({ label, mode }) => (
    <Button
      title={label}
      onPress={() => {
        // 'List' should show ALL by default
        if (mode === 'list') setSourceKind('all');
        setView(mode);
      }}
      bg={active(mode) ? '#111827' : '#E5E7EB'}
      color={active(mode) ? '#fff' : '#111827'}
      style={{ paddingHorizontal: 12, paddingVertical: 8 }}
    />
  );

  return (
    <View
      style={{
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 10,
        marginBottom: 10,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-start',
          gap: 10,
          marginBottom: 10,
        }}
      >
        <Button title="+ Add Task" onPress={onAdd} />
        <Button
          title="My Tasks"
          onPress={() => {
            setSourceKind('my');
            setView('list');
          }}
          bg="#E5E7EB"
          color="#111827"
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 3,
          marginBottom: 10,
        }}
      >
        <Btn label="List" mode="list" />
        <Btn label="Calender" mode="calendar" />
        <Btn label="Kanban" mode="kanban" />
        <Btn label="Pin" mode="pin" />
        <Btn label="Approval" mode="approval" />

        <View style={{ flex: 1, alignItems: 'flex-end' }}>
          <View
            style={{
              width: 50,
              height: 36,
              backgroundColor: '#fff',
              borderRadius: 8,
              borderWidth: 1,
              borderColor: '#E5E7EB',
              paddingHorizontal: 12,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <TextInput
              value={searchValue}
              onChangeText={onSearchChange}
              placeholder="Search"
              style={{ flex: 1 }}
            />
          </View>
        </View>
      </View>
    </View>
  );
}
