import React from 'react';
import {
  View,
  ScrollView,
  FlatList,
  ActivityIndicator,
  Text,
} from 'react-native';
import { HeaderCol } from './ui';
import TaskRow from './TaskRow';

export default function TaskListTable({
  data,
  busy,
  total,
  onView,
  onEdit,
  onDelete,
  onTogglePin,
}) {
  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 10,
        overflow: 'hidden',
      }}
    >
      <ScrollView horizontal>
        <View style={{ minWidth: 1000 }}>
          {/* Header */}
          <View style={{ flexDirection: 'row' }}>
            <HeaderCol style={{ minWidth: 100 }}>Code</HeaderCol>
            <HeaderCol style={{ minWidth: 260 }}>Task Name</HeaderCol>
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
              keyExtractor={(item, idx) => String(item.id ?? idx)}
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
      <View style={{ padding: 10, alignItems: 'center' }}>
        <Text>Total: {total}</Text>
      </View>
    </View>
  );
}
