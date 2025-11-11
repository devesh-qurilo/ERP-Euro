import React, { useEffect, useMemo, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  stagesFetch,
  stageCreate,
  stageUpdate,
  stageDelete,
} from '../store/actions';
import { selectStages, selectStagesBusy } from '../store/selectors';

const Field = ({ label, children }) => (
  <View style={{ marginBottom: 10 }}>
    <Text style={{ fontWeight: '700', marginBottom: 6 }}>{label}</Text>
    {children}
  </View>
);

const Input = props => (
  <TextInput
    {...props}
    style={[
      {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        paddingHorizontal: 10,
        height: 42,
        backgroundColor: '#fff',
      },
      props.style,
    ]}
  />
);

export default function StagesModal({ visible, onClose }) {
  const dispatch = useDispatch();
  const stages = useSelector(selectStages);
  const busy = useSelector(selectStagesBusy);

  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [labelColor, setLabelColor] = useState('88aaff11');
  const [editing, setEditing] = useState(null); // {id, name, position, labelColor}

  useEffect(() => {
    if (visible) {
      dispatch(stagesFetch());
    }
  }, [visible, dispatch]);

  const sorted = useMemo(() => {
    const s = [...(stages || [])];
    s.sort((a, b) => (a.position || 0) - (b.position || 0) || a.id - b.id);
    return s;
  }, [stages]);

  const resetForm = () => {
    setName('');
    setPosition('');
    setLabelColor('88aaff11');
    setEditing(null);
  };

  const onSubmit = () => {
    const payload = {
      name: (editing ? editing.name : name).trim(),
      position: Number(editing ? editing.position : position) || 1,
      labelColor: (editing ? editing.labelColor : labelColor) || '88aaff11',
    };
    if (!payload.name) return;

    if (editing) {
      dispatch(stageUpdate(editing.id, payload));
    } else {
      dispatch(stageCreate(payload));
    }
    resetForm();
  };

  const startEdit = s => {
    setEditing({
      id: s.id,
      name: s.name || '',
      position: s.position || 1,
      labelColor: s.labelColor || '88aaff11',
    });
  };

  const renderRow = ({ item }) => (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderColor: '#F3F4F6',
      }}
    >
      <View style={{ flex: 1 }}>
        <Text style={{ fontWeight: '700' }}>{item.name}</Text>
        <Text style={{ color: '#6B7280' }}>
          Pos: {item.position} • Color: {item.labelColor}
        </Text>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity
          onPress={() => startEdit(item)}
          style={{ marginRight: 12 }}
        >
          <Text style={{ color: '#2563EB', fontWeight: '700' }}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => dispatch(stageDelete(item.id))}>
          <Text style={{ color: '#DC2626', fontWeight: '700' }}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const editingMode = !!editing;

  return (
    <Modal
      visible={!!visible}
      transparent
      animation="slide"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.35)',
          justifyContent: 'center',
          padding: 16,
        }}
      >
        <View
          style={{
            backgroundColor: '#fff',
            borderRadius: 12,
            padding: 16,
            maxHeight: '85%',
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 12,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: '800' }}>
              Manage Stages
            </Text>
            <TouchableOpacity
              onPress={() => {
                resetForm();
                onClose?.();
              }}
            >
              <Text style={{ fontWeight: '800' }}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Form */}
          <View
            style={{
              borderWidth: 1,
              borderColor: '#E5E7EB',
              borderRadius: 10,
              padding: 12,
              marginBottom: 12,
            }}
          >
            <Field label={editingMode ? 'Edit Stage Name' : 'Stage Name'}>
              <Input
                value={editingMode ? String(editing.name) : name}
                onChangeText={t =>
                  editingMode ? setEditing({ ...editing, name: t }) : setName(t)
                }
                placeholder="e.g. In Progress"
              />
            </Field>
            <Field label="Position (number)">
              <Input
                value={String(editingMode ? editing.position : position)}
                onChangeText={t =>
                  editingMode
                    ? setEditing({
                        ...editing,
                        position: t.replace(/[^0-9]/g, ''),
                      })
                    : setPosition(t.replace(/[^0-9]/g, ''))
                }
                keyboardType="number-pad"
                placeholder="1"
              />
            </Field>
            <Field label="Label Color (hex-like token)">
              <Input
                value={editingMode ? String(editing.labelColor) : labelColor}
                onChangeText={t =>
                  editingMode
                    ? setEditing({ ...editing, labelColor: t })
                    : setLabelColor(t)
                }
                placeholder="88aaff11"
              />
            </Field>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                marginTop: 8,
              }}
            >
              {editingMode && (
                <TouchableOpacity
                  onClick={resetForm}
                  onPress={resetForm}
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 14,
                    marginRight: 8,
                  }}
                >
                  <Text>Cancel</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={onSubmit}
                disabled={busy}
                style={{
                  backgroundColor: '#2563EB',
                  paddingVertical: 10,
                  paddingHorizontal: 14,
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: '#fff', fontWeight: '800' }}>
                  {editingMode ? 'Update' : 'Add Stage'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* List */}
          <FlatList
            data={sorted}
            keyExtractor={it => String(it.id)}
            renderItem={renderRow}
            style={{ minWidth: 320 }}
            ListEmptyComponent={
              <Text style={{ color: '#6B7280' }}>No stages yet.</Text>
            }
            refreshing={!!busy}
            onRefresh={() => dispatch(stagesFetch())}
          />
        </View>
      </View>
    </Modal>
  );
}
