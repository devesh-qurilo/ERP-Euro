// src/modules/shared/tasks/components/KanbanBoard.js

import React, { useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

/** STAGES (columns) */
import {
  selectStages,
  selectStagesBusy,
} from '../../taskStages/store/selectors';
import { stagesFetch } from '../../taskStages/store/actions';
import StagesModal from '../../taskStages/components/StagesModal';

/** TASKS */
import { fetchTasks, setSource } from '../store/actions';
import {
  selectList as selectTasks,
  selectBusy as selectTasksBusy,
} from '../store/selectors';

/* ---------- tiny presentational bits ---------- */

const Pill = ({ color = '#9CA3AF', children }) => (
  <View
    style={{
      backgroundColor: '#F3F4F6',
      borderRadius: 999,
      paddingHorizontal: 8,
      paddingVertical: 2,
      alignSelf: 'flex-start',
    }}
  >
    <Text style={{ fontSize: 12, color }}>{children}</Text>
  </View>
);

/* ---------- CARD WITH EMPLOYEE AVATARS ---------- */

const Card = ({ item, onPress }) => {
  const employees = item?.assignedEmployees || [];

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        padding: 10,
        marginBottom: 10,
      }}
    >
      {/* Title */}
      <Text style={{ fontWeight: '700' }}>{item.title}</Text>

      {/* Project Name */}
      {!!item.projectName && (
        <Text numberOfLines={2} style={{ color: '#6B7280', marginTop: 4 }}>
          {item.projectName}
        </Text>
      )}

      {/* Short Code */}
      <Text style={{ fontWeight: '700', color: '#257a73ff' }}>
        #{item.projectShortCode}
      </Text>

      {/* Priority + Due Date */}
      <View
        style={{
          flexDirection: 'row',
          marginTop: 8,
          justifyContent: 'space-between',
        }}
      >
        <Pill color="#EF4444">{item.priority || '—'}</Pill>
        {!!item.dueDate && (
          <Text style={{ color: '#6B7280' }}>{item.dueDate}</Text>
        )}
      </View>

      {/* 🔥 Assigned Employees — Small Circle Avatars */}
      <View style={{ flexDirection: 'row', marginTop: 10 }}>
        {employees.map((emp, idx) => (
          <View
            key={emp.employeeId}
            style={{
              marginLeft: idx === 0 ? 0 : -8,
              borderRadius: 999,
              borderWidth: 1,
              borderColor: '#fff',
              overflow: 'hidden',
            }}
          >
            {emp.profileUrl ? (
              <Image
                source={{ uri: emp.profileUrl }}
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                }}
              />
            ) : (
              <View
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  backgroundColor: '#E5E7EB',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ fontSize: 10, color: '#6B7280' }}>
                  {emp?.name ? emp.name[0].toUpperCase() : '?'}
                </Text>
              </View>
            )}
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );
};

/* ---------- MAIN KANBAN BOARD ---------- */

export default function KanbanBoard({ onCardPress }) {
  const dispatch = useDispatch();

  const stages = useSelector(selectStages) || [];
  const tasks = useSelector(selectTasks) || [];
  const stagesBusy = useSelector(selectStagesBusy) || false;
  const tasksBusy = useSelector(selectTasksBusy) || false;

  const loading = stagesBusy || tasksBusy;
  const [showStages, setShowStages] = useState(false);

  // Initial load
  useEffect(() => {
    dispatch(stagesFetch());
    dispatch(setSource({ kind: 'all' })); // Kanban always shows all
    dispatch(fetchTasks());
  }, [dispatch]);

  // Group tasks by stage
  const grouped = useMemo(() => {
    const map = new Map();

    // create empty bins
    (stages || []).forEach(st => map.set(st.id, []));

    // fill each stage
    (tasks || []).forEach(t => {
      const sid = t?.taskStage?.id ?? null;
      if (!map.has(sid)) map.set(sid, []);
      map.get(sid).push(t);
    });

    return map;
  }, [stages, tasks]);

  return (
    <View style={{ flex: 1 }}>
      {/* Toolbar */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 8,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: '800' }}>Kanban</Text>

        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity onPress={() => dispatch(fetchTasks())}>
            <Text style={{ color: '#2563EB', fontWeight: '700' }}>Refresh</Text>
          </TouchableOpacity>

          <View style={{ width: 12 }} />

          <TouchableOpacity onPress={() => setShowStages(true)}>
            <Text style={{ color: '#2563EB', fontWeight: '700' }}>
              Manage Stages
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Board */}
      <ScrollView horizontal showsHorizontalScrollIndicator style={{ flex: 1 }}>
        {stages.map(stage => (
          <View
            key={stage.id}
            style={{
              width: 280,
              marginRight: 12,
              backgroundColor: '#F9FAFB',
              borderRadius: 12,
              borderWidth: 1,
              borderColor: '#E5E7EB',
              padding: 10,
            }}
          >
            {/* Column Header */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 8,
                justifyContent: 'space-between',
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 999,
                    backgroundColor: stage.labelColor || '#ef4444',
                    marginRight: 6,
                  }}
                />
                <Text style={{ fontWeight: '800' }}>{stage.name}</Text>
                <Text style={{ marginLeft: 6, color: '#6B7280' }}>
                  {(grouped.get(stage.id) || []).length}
                </Text>
              </View>
            </View>

            {/* Cards */}
            <FlatList
              data={grouped.get(stage.id) || []}
              keyExtractor={it => String(it.id)}
              renderItem={({ item }) => (
                <Card item={item} onPress={() => onCardPress?.(item)} />
              )}
              ListEmptyComponent={
                <View style={{ paddingVertical: 10 }}>
                  <Text style={{ color: '#9CA3AF' }}>No tasks</Text>
                </View>
              }
            />
          </View>
        ))}

        {/* Unassigned Column */}
        {(grouped.get(null)?.length || 0) > 0 && (
          <View
            style={{
              width: 280,
              marginRight: 12,
              backgroundColor: '#F9FAFB',
              borderRadius: 12,
              borderWidth: 1,
              borderColor: '#E5E7EB',
              padding: 10,
            }}
          >
            <Text style={{ fontWeight: '800', marginBottom: 8 }}>
              Unassigned ({grouped.get(null).length})
            </Text>

            <FlatList
              data={grouped.get(null)}
              keyExtractor={it => String(it.id)}
              renderItem={({ item }) => (
                <Card item={item} onPress={() => onCardPress?.(item)} />
              )}
            />
          </View>
        )}
      </ScrollView>

      {loading && (
        <Text style={{ marginTop: 8, color: '#6B7280' }}>Loading…</Text>
      )}

      {/* Stages Modal */}
      <StagesModal visible={showStages} onClose={() => setShowStages(false)} />
    </View>
  );
}
