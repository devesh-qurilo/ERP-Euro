// components/DealActionsBar.js

import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function DealActionsBar({ onAdd }) {
  const navigation = useNavigation();

  return (
    <View style={styles.row}>
      <TouchableOpacity style={styles.addBtn} onPress={onAdd}>
        <Text style={{ color: '#fff', fontWeight: '700' }}>+ Add Deal</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.simpleBtn}
        onPress={() => navigation.navigate('AdminDealKanban')}
      >
        <Text style={{ color: '#3F6AE1' }}>Kanban</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', paddingHorizontal: 12, gap: 12 },
  addBtn: {
    backgroundColor: '#3F6AE1',
    padding: 10,
    borderRadius: 8,
  },
  simpleBtn: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
});
