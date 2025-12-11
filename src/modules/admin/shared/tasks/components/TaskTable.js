// src/modules/admin/work/tasks/components/TaskTable.js
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
  stages, // ← added
  onChangeStage, // ← added
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
            {/* HEADER ROW */}
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

            {/* BODY */}
            {busy ? (
              <View style={{ padding: 16, alignItems: 'center' }}>
                <ActivityIndicator />
              </View>
            ) : (
              <FlatList
                style={{ maxHeight: 400 }}
                data={data}
                keyExtractor={it => String(it.id)}
                renderItem={({ item }) => (
                  <TaskRow
                    item={item}
                    allStages={stages}
                    onView={() => onView(item)}
                    onEdit={() => onEdit(item)}
                    onDelete={() => onDelete(item.id)}
                    onTogglePin={() => onTogglePin(item)}
                    onChangeStage={onChangeStage}
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
