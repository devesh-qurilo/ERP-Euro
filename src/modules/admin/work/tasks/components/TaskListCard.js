import React from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { HeaderCol } from './ui';
import TaskRow from './TaskRow';
import HideCompleted from './TaskListHideCompleted';

export default function TaskListCard({
  title,
  data,
  busy,
  total,
  hideCompleted,
  onToggleHide,
  onView,
  onEdit,
  onDelete,
  onTogglePin,
}) {
  return (
    <View
      style={{
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#EEE',
        padding: 12,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 8,
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: '700' }}>{title}</Text>
        <HideCompleted active={hideCompleted} onToggle={onToggleHide} />
      </View>

      <View
        style={{
          borderWidth: 1,
          borderColor: '#EEE',
          borderRadius: 10,
          overflow: 'hidden',
        }}
      >
        <ScrollView horizontal>
          <View style={{ minWidth: 1200 }}>
            <View style={{ flexDirection: 'row' }}>
              <HeaderCol style={{ minWidth: 100 }}>Code</HeaderCol>
              <HeaderCol style={{ minWidth: 320 }}>Task Name</HeaderCol>
              <HeaderCol>Start Date</HeaderCol>
              <HeaderCol>Due Date</HeaderCol>
              <HeaderCol>Estimated Time</HeaderCol>
              <HeaderCol>Completed On</HeaderCol>
              <HeaderCol>Hours Logged</HeaderCol>
              <HeaderCol style={{ minWidth: 140 }}>Assigned To</HeaderCol>
              <HeaderCol>Status</HeaderCol>
              <HeaderCol style={{ minWidth: 120 }}>Actions</HeaderCol>
            </View>

            {busy ? (
              <View style={{ padding: 16, alignItems: 'center' }}>
                <ActivityIndicator />
              </View>
            ) : (
              <FlatList
                data={data}
                keyExtractor={(it, i) => String(it.id ?? i)}
                renderItem={({ item }) => (
                  <TaskRow
                    item={item}
                    onView={() => onView(item)}
                    onEdit={() => onEdit(item)}
                    onDelete={() => onDelete(item.id)}
                    onTogglePin={() => onTogglePin(item)}
                  />
                )}
              />
            )}
          </View>
        </ScrollView>
      </View>

      <View style={{ paddingTop: 10, alignItems: 'center' }}>
        <Text>Total: {total}</Text>
      </View>
    </View>
  );
}
