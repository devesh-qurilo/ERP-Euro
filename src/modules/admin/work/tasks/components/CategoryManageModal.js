import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { fetchCategories, createCategory, deleteCategory } from './tasks.api';

export default function CategoryManageModal({ visible, onClose, onRefresh }) {
  const [list, setList] = useState([]);
  const [name, setName] = useState('');

  const load = () => fetchCategories().then(setList);

  useEffect(() => {
    if (visible) load();
  }, [visible]);

  const add = async () => {
    if (!name.trim()) return;
    await createCategory({ name: name.trim() });
    setName('');
    load();
    onRefresh?.();
  };

  const remove = async id => {
    await deleteCategory(id);
    load();
    onRefresh?.();
  };

  if (!visible) return null;

  return (
    <Modal visible transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <Text style={styles.title}>Manage Categories</Text>

          <View style={styles.row}>
            <TextInput
              placeholder="New category"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />
            <Pressable onPress={add}>
              <Feather name="plus" size={22} color="#4f46e5" />
            </Pressable>
          </View>

          <ScrollView>
            {list.map(c => (
              <View key={c.id} style={styles.item}>
                <Text>{c.name}</Text>
                <Pressable onPress={() => remove(c.id)}>
                  <Feather name="trash-2" size={18} color="#ef4444" />
                </Pressable>
              </View>
            ))}
          </ScrollView>

          <Pressable onPress={onClose} style={styles.close}>
            <Text>Done</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = {
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,.4)',
    justifyContent: 'center',
    padding: 20,
  },
  sheet: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    maxHeight: '80%',
  },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  row: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    marginBottom: 12,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    padding: 10,
    borderRadius: 8,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  close: { alignSelf: 'flex-end', marginTop: 10 },
};
