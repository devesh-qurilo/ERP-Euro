// src/modules/employee/settings/components/EmergencyContactsTable.js
import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  Pressable,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmergencyContacts } from '../store/actions';
import {
  selectEmergencyContacts,
  selectEmergencyContactsLoading,
  selectEmergencyContactsError,
} from '../store/selectors';

const COLS = [
  { key: 'name', label: 'Name', width: 280 },
  { key: 'email', label: 'Email', width: 340 },
  { key: 'mobile', label: 'Mob. Number', width: 240 },
  { key: 'rel', label: 'Relationship', width: 200 },
  { key: 'act', label: 'Actions', width: 140 },
];
const TABLE_WIDTH = COLS.reduce((s, c) => s + c.width, 0);

export default function EmergencyContactsTable({ employeeId }) {
  const dispatch = useDispatch();
  const rows = useSelector(selectEmergencyContacts);
  const loading = useSelector(selectEmergencyContactsLoading);
  const error = useSelector(selectEmergencyContactsError);

  useEffect(() => {
    if (employeeId) dispatch(fetchEmergencyContacts(employeeId));
  }, [dispatch, employeeId]);

  const renderRow = ({ item, index }) => (
    <View style={[styles.row, index % 2 ? styles.alt : null]}>
      <View style={[styles.cell, { width: COLS[0].width }]}>
        <Text style={styles.text}>{item.name}</Text>
      </View>
      <View style={[styles.cell, { width: COLS[1].width }]}>
        <Text style={styles.text}>{item.email || '—'}</Text>
      </View>
      <View style={[styles.cell, { width: COLS[2].width }]}>
        <Text style={styles.text}>{item.mobile || '—'}</Text>
      </View>
      <View style={[styles.cell, { width: COLS[3].width }]}>
        <Text style={styles.text}>{item.relationship || '—'}</Text>
      </View>
      <View style={[styles.cell, { width: COLS[4].width }]}>
        <Pressable
          onPress={() =>
            Alert.alert('Actions', `Contact: ${item.name}\n(coming soon)`)
          }
          style={styles.kebab}
        >
          <Text style={{ fontSize: 18 }}>⋮</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={styles.card}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator
        contentContainerStyle={{ minWidth: TABLE_WIDTH }}
      >
        <View style={{ width: TABLE_WIDTH }}>
          <View style={[styles.row, styles.headRow]}>
            {COLS.map(c => (
              <View key={c.key} style={[styles.cell, { width: c.width }]}>
                <Text style={[styles.text, styles.head]}>{c.label}</Text>
              </View>
            ))}
          </View>
          {error ? (
            <Text style={styles.err}>Error: {String(error)}</Text>
          ) : null}
          <FlatList
            data={rows}
            keyExtractor={it => String(it.id)}
            renderItem={renderRow}
            nestedScrollEnabled
            contentContainerStyle={{ paddingBottom: 10 }}
          />
          {loading ? <Text style={styles.note}>Loading…</Text> : null}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e7eb',
    minHeight: 60,
    paddingHorizontal: 6,
  },
  headRow: {
    backgroundColor: '#eef5ff',
    borderBottomWidth: 0,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  alt: { backgroundColor: '#fafbfc' },
  cell: { justifyContent: 'center', paddingVertical: 12, paddingRight: 8 },
  text: { fontSize: 16, color: '#1f2328' },
  head: { fontWeight: '900', color: '#374151' },
  kebab: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#f3f4f6',
  },
  note: { color: '#6b7280', padding: 8 },
  err: { color: '#b00020', padding: 8 },
});
