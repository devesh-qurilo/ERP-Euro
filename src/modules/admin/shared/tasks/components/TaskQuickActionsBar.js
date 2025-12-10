// src/modules/admin/work/tasks/components/TaskQuickActionsBar.js
import React from 'react';
import { View, TextInput } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';
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
  const active = mode => view === mode;

  const IconButton = ({ mode, icon }) => (
    <Button
      onPress={() => {
        if (mode === 'list') setSourceKind('all');
        setView(mode);
      }}
      bg={active(mode) ? '#111827' : '#E5E7EB'}
      color={active(mode) ? '#fff' : '#111827'}
      style={{
        paddingHorizontal: 12,
        paddingVertical: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      title=""
      icon={icon}
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
      {/* ADD + MY TASKS */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          marginBottom: 10,
        }}
      >
        <Button
          onPress={onAdd}
          bg="#4f46e5"
          color="#fff"
          title="Add Task"
          icon={<Feather name="plus" size={18} color="#fff" />}
        />

        <Button
          title="My Tasks"
          onPress={() => {
            setSourceKind('my');
            setView('list');
          }}
          bg="#E5E7EB"
          color="#111827"
          icon={<Feather name="user" size={18} color="#111827" />}
        />
      </View>

      {/* VIEW SWITCH BUTTONS + SEARCH */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          width: '100%',
        }}
      >
        {/* LIST */}
        <IconButton
          mode="list"
          icon={
            <Feather
              name="list"
              size={18}
              color={active('list') ? '#fff' : '#111827'}
            />
          }
        />

        {/* CALENDAR */}
        <IconButton
          mode="calendar"
          icon={
            <Feather
              name="calendar"
              size={18}
              color={active('calendar') ? '#fff' : '#111827'}
            />
          }
        />

        {/* KANBAN */}
        <IconButton
          mode="kanban"
          icon={
            <Material
              name="view-column"
              size={20}
              color={active('kanban') ? '#fff' : '#111827'}
            />
          }
        />

        {/* PIN */}
        <IconButton
          mode="pin"
          icon={
            <Feather
              name="bookmark"
              size={18}
              color={active('pin') ? '#fff' : '#6d7991ff'}
            />
          }
        />

        {/* APPROVAL */}
        <IconButton
          mode="approval"
          icon={
            <Feather
              name="alert-triangle"
              size={18}
              color={active('approval') ? '#fff' : '#111827'}
            />
          }
        />

        {/* SEARCH */}
        <View style={{ flex: 1, alignItems: 'flex-end' }}>
          <View
            style={{
              width: 160,
              height: 40,
              backgroundColor: '#fff',
              borderRadius: 8,
              borderWidth: 1,
              borderColor: '#E5E7EB',
              paddingHorizontal: 10,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Feather name="search" size={18} color="#6b7280" />
            <TextInput
              value={searchValue}
              onChangeText={onSearchChange}
              placeholder="Search"
              placeholderTextColor="#9ca3af"
              style={{
                flex: 1,
                color: '#688ee2ff',
              }}
            />
          </View>
        </View>
      </View>
    </View>
  );
}
