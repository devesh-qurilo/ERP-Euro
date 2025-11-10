import React from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { HeaderCol } from './ui';
import TaskRow from '../../../work/tasks/components/TaskRow';

export default function TaskTable({
  data,
  busy,
  total,
  onView,
  onEdit,
  onDelete,
  onTogglePin,
  titleSlot,
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
      {/* optional header slot (e.g., "Task Details" + Hide Completed chip) */}
      {titleSlot}

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

        {/* <View
          style={{
            paddingVertical: 8,
            alignItems: 'center',
            backgroundColor: '#fff',
          }}
        >
          <Text>Prev | 1 | 2 | 3 | 4 | ….. Next</Text>
        </View> */}
      </View>

      <View style={{ paddingTop: 10, alignItems: 'center' }}>
        <Text>Total: {total}</Text>
      </View>
    </View>
  );
}
