import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectStages,
  selectStagesBusy,
} from '../../taskStages/store/selectors';
import {
  stagesFetch,
  stageCreate,
  stageDelete,
} from '../../taskStages/store/actions';
import { tasksFetchAll } from '../store/actions'; // from your shared tasks slice already used on list view
import { selectAllTasks, selectTasksBusy } from '../store/selectors'; // list selector you already have

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

export default function KanbanBoard({ onCardPress }) {
  const dispatch = useDispatch();
  const stages = useSelector(selectStages);
  const tasks = useSelector(selectAllTasks);
  const loading = useSelector(selectStagesBusy) || useSelector(selectTasksBusy);

  React.useEffect(() => {
    dispatch(stagesFetch());
    dispatch(tasksFetchAll());
  }, [dispatch]);

  // group tasks by stageId; if missing, bucket "Unassigned"
  const grouped = useMemo(() => {
    const m = new Map();
    stages.forEach(s => m.set(s.id, []));
    tasks?.forEach(t => {
      const sid = t?.taskStage?.id ?? null;
      if (!m.has(sid)) m.set(sid, []);
      m.get(sid).push(t);
    });
    return m;
  }, [stages, tasks]);

  const [adding, setAdding] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      {/* toolbar for stage actions */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 8,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: '800' }}>Kanban</Text>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <TouchableOpacity onPress={() => dispatch(stagesFetch())}>
            <Text style={{ color: '#2563EB', fontWeight: '700' }}>Refresh</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              if (adding) return;
              setAdding(true);
              dispatch(
                stageCreate({
                  name: 'New Stage',
                  position: (stages?.length || 0) + 1,
                  labelColor: '88aaff11',
                }),
              );
              setAdding(false);
            }}
          >
            <Text style={{ color: '#2563EB', fontWeight: '700' }}>+ Stage</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* horizontal board */}
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
            {/* header */}
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
              <TouchableOpacity onPress={() => dispatch(stageDelete(stage.id))}>
                <Text style={{ color: '#DC2626', fontWeight: '700' }}>⋯</Text>
              </TouchableOpacity>
            </View>

            {/* column list */}
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

        {/* Optional "Unassigned" column if tasks with no stage */}
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
    </View>
  );
}
