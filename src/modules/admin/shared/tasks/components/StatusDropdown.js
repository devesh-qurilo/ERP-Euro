import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, Modal, FlatList } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useSelector, useDispatch } from 'react-redux';
import { selectStages } from '../../taskStages/store/selectors';
import { updateTaskStage } from '../store/actions';
import { stagesFetch } from '../../taskStages/store/actions';

export default function StatusDropdown({ item }) {
  const [open, setOpen] = useState(false);
  const stages = useSelector(selectStages);
  const dispatch = useDispatch();

  const current = item?.taskStage?.name || '—';

  const onSelect = stage => {
    setOpen(false);
    dispatch(updateTaskStage(item.id, stage.id));
  };

  useEffect(() => {
    dispatch(stagesFetch());
  }, []);

  return (
    <>
      {/* Trigger Button */}
      <Pressable
        onPress={() => setOpen(true)}
        style={{
          width: 150,
          height: 38,
          backgroundColor: '#fff',
          borderRadius: 8,
          borderWidth: 1,
          borderColor: '#E5E7EB',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 12,
        }}
      >
        <Text>{current}</Text>
        <Feather name="chevron-down" size={16} color="#111" />
      </Pressable>

      {/* Modal Dropdown */}
      <Modal transparent visible={open} animationType="fade">
        <Pressable
          onPress={() => setOpen(false)}
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.2)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
          }}
        >
          <View
            style={{
              backgroundColor: '#fff',
              width: 250,
              maxHeight: 300,
              borderRadius: 10,
              paddingVertical: 10,
              paddingHorizontal: 10,
            }}
          >
            <FlatList
              data={stages}
              keyExtractor={i => String(i.id)}
              renderItem={({ item: stage }) => (
                <Pressable
                  onPress={() => onSelect(stage)}
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 12,
                    borderBottomWidth: 1,
                    borderColor: '#F2F2F2',
                  }}
                >
                  <Text style={{ fontSize: 16 }}>{stage.name}</Text>
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </>
  );
}
