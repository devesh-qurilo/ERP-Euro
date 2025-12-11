// src/modules/shared/tasks/components/KanbanBoard.js
import React, { useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

/** STAGES (columns) */
import {
  selectStages,
  selectStagesBusy,
} from '../../taskStages/store/selectors';
import { stagesFetch } from '../../taskStages/store/actions';
import StagesModal from '../../taskStages/components/StagesModal';

/** TASKS (cards) — reuse your shared tasks slice used on list screen */
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

const Card = ({ item, onPress }) => (
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
    <Text style={{ fontWeight: '700' }}>{item.title}</Text>
    {!!item.description && (
      <Text numberOfLines={2} style={{ color: '#6B7280', marginTop: 4 }}>
        {item.description}
      </Text>
    )}
    <View
      style={{
        flexDirection: 'row',
        marginTop: 8,
        justifyContent: 'space-between',
      }}
    >
      <Pill color="#EF4444">{item.priority || '—'}</Pill>
      {item.dueDate && <Text style={{ color: '#6B7280' }}>{item.dueDate}</Text>}
    </View>
  </TouchableOpacity>
);

/* ---------- main component ---------- */

export default function KanbanBoard({ onCardPress }) {
  const dispatch = useDispatch();

  // Selectors with guards
  const stages = useSelector(selectStages) || [];
  const tasks = useSelector(selectTasks) || [];
  const stagesBusy = useSelector(selectStagesBusy) || false;
  const tasksBusy = useSelector(selectTasksBusy) || false;
  const loading = stagesBusy || tasksBusy;

  const [showStages, setShowStages] = useState(false);

  // Initial load: ensure ALL tasks are fetched for Kanban
  useEffect(() => {
    dispatch(stagesFetch());
    dispatch(setSource({ kind: 'all' })); // ignore per-project filters in kanban
    dispatch(fetchTasks());
  }, [dispatch]);

  // Use primitive deps to avoid deep compares / undefined
  const stagesLen = Array.isArray(stages) ? stages.length : 0;
  const tasksLen = Array.isArray(tasks) ? tasks.length : 0;

  // Group tasks by taskStage.id (null → Unassigned)
  const grouped = useMemo(() => {
    const m = new Map();
    (stages || []).forEach(s => m.set(s.id, []));
    (tasks || []).forEach(t => {
      const sid = t?.taskStage?.id ?? null;
      if (!m.has(sid)) m.set(sid, []);
      m.get(sid).push(t);
    });
    return m;
  }, [stagesLen, tasksLen]);

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
        <Text style={{ fontSize: 18, fontWeight: '800' }}>Kanbankkk</Text>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity onPress={() => dispatch(stagesFetch())}>
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

      {/* Board (Horizontal) */}
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
            {/* Column header */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 8,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 999,
                    backgroundColor: '#ef4444',
                    marginRight: 6,
                  }}
                />
                <Text style={{ fontWeight: '800' }}>{stage.name}</Text>
                <Text style={{ marginLeft: 6, color: '#6B7280' }}>
                  {(grouped.get(stage.id) || []).length}
                </Text>
              </View>
              {/* (Delete/rename handled in Manage Stages modal) */}
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

        {/* Unassigned column (tasks without taskStage) */}
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
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 8,
                justifyContent: 'space-between',
              }}
            >
              <Text style={{ fontWeight: '800' }}>Unassigned</Text>
              <Text style={{ color: '#6B7280' }}>
                {grouped.get(null).length}
              </Text>
            </View>
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

      {/* Stages Add/Edit/Delete modal */}
      <StagesModal visible={showStages} onClose={() => setShowStages(false)} />
    </View>
  );
}
