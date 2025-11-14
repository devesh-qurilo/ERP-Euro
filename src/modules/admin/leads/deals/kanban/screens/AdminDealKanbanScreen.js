import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchKanban,
  moveCard,
  createStage,
  updateStage,
  deleteStage,
} from '../store/actions';
import {
  selectKanbanBusy,
  selectKanbanStages,
  selectKanbanColumns,
} from '../store/selectors';
import { useNavigation } from '@react-navigation/native';

export default function AdminDealKanbanScreen() {
  const dispatch = useDispatch();
  const nav = useNavigation();

  const busy = useSelector(selectKanbanBusy);
  const stages = useSelector(selectKanbanStages);
  const columns = useSelector(selectKanbanColumns);

  useEffect(() => {
    dispatch(fetchKanban());
  }, [dispatch]);

  if (busy && !stages.length)
    return <ActivityIndicator style={{ marginTop: 20 }} />;

  return (
    <View style={{ flex: 1, padding: 12 }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 10,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: '700' }}>Deals Kanban</Text>
        <TouchableOpacity onPress={() => dispatch(fetchKanban())}>
          <Text style={{ color: '#3F6AE1' }}>Refresh</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal contentContainerStyle={{ paddingBottom: 40 }}>
        {stages.map(stage => (
          <View
            key={stage.id}
            style={{
              width: 320,
              marginRight: 12,
              borderWidth: 1,
              borderRadius: 10,
              padding: 10,
              backgroundColor: '#fff',
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: '700' }}>
                {stage.name}
              </Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <TouchableOpacity
                  onPress={() => {
                    /* stage menu: update/delete */
                  }}
                >
                  <Text>⋯</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Text style={{ color: '#777', marginTop: 6 }}>
              {(columns[stage.name] || []).length}
            </Text>

            <FlatList
              data={columns[stage.name] || []}
              keyExtractor={item => String(item.id)}
              renderItem={({ item }) => (
                <KanbanCard
                  item={item}
                  stage={stage}
                  stages={stages}
                  dispatch={dispatch}
                  navigation={nav}
                />
              )}
              style={{ marginTop: 10 }}
            />
          </View>
        ))}

        {/* Optional: column for Unassigned if present */}
        {columns['Unassigned'] && columns['Unassigned'].length > 0 && (
          <View
            style={{
              width: 320,
              marginRight: 12,
              borderWidth: 1,
              borderRadius: 10,
              padding: 10,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: '700' }}>Unassigned</Text>
            <FlatList
              data={columns['Unassigned']}
              keyExtractor={i => String(i.id)}
              renderItem={({ item }) => (
                <KanbanCard
                  item={item}
                  stage={{ name: 'Unassigned' }}
                  stages={stages}
                  dispatch={dispatch}
                />
              )}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function KanbanCard({ item, stage, stages, dispatch, navigation }) {
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <View
      style={{
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        marginBottom: 12,
        backgroundColor: '#fafafa',
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View>
          <Text style={{ fontWeight: '700' }}>{item.title}</Text>
          <Text style={{ color: '#777', marginTop: 6 }}>
            {item.dealCategory || ''}
          </Text>
        </View>

        <View style={{ alignItems: 'flex-end' }}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('AdminDealView', { dealId: item.id })
            }
          >
            <Text style={{ color: '#3F6AE1' }}>Open</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setOpenMenu(!openMenu)}
            style={{ marginTop: 8 }}
          >
            <Text>⋯</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* footer: agent, value, date */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 10,
        }}
      >
        <Text style={{ color: '#555' }}>
          {item.dealAgentMeta?.name || item.dealAgent}
        </Text>
        <Text style={{ fontWeight: '600' }}>
          {item.value != null ? String(item.value) : ''}
        </Text>
      </View>

      {openMenu && (
        <View style={{ marginTop: 8, borderTopWidth: 1, paddingTop: 8 }}>
          <Text style={{ marginBottom: 6, color: '#333', fontWeight: '600' }}>
            Move to:
          </Text>
          {stages.map(s => (
            <TouchableOpacity
              key={s.id}
              onPress={() => {
                setOpenMenu(false);
                if (s.name === stage.name) return;
                dispatch(moveCard(item.id, s.name));
              }}
              style={{ paddingVertical: 6 }}
            >
              <Text>{s.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}
