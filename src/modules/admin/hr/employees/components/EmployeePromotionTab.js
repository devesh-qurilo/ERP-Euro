import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { fetchEmployeePromotions, openPromotionModal } from '../store/actions';

import {
  selectEmployeePromotions,
  selectPromotionModalOpen,
} from '../store/selectors';

import PromotionModal from '../components/PromotionModal';

export default function EmployeePromotionTab({ emply }) {
  const dispatch = useDispatch();

  const promotions = useSelector(selectEmployeePromotions);
  const modalOpen = useSelector(selectPromotionModalOpen);

  useEffect(() => {
    if (!emply?.employeeId) return;

    dispatch(fetchEmployeePromotions(emply.employeeId));
  }, [emply]);

  return (
    <View style={{ flex: 1 }}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Promotion History</Text>

        <Pressable
          style={styles.addBtn}
          onPress={() => dispatch(openPromotionModal())}
        >
          <Text style={styles.addTxt}>+ Add Promotion</Text>
        </Pressable>
      </View>

      {/* HISTORY LIST */}
      <ScrollView contentContainerStyle={{ padding: 12 }}>
        {promotions?.map(p => (
          <View key={p.id} style={styles.card}>
            <Text style={styles.date}>
              {new Date(p.createdAt).toDateString()}
            </Text>

            <Text style={styles.row}>
              {p.oldDesignationName} → {p.newDesignationName}
            </Text>

            <Text style={styles.sub}>
              {p.oldDepartmentName} → {p.newDepartmentName}
            </Text>

            {p.remarks && <Text style={styles.remark}>{p.remarks}</Text>}
          </View>
        ))}
      </ScrollView>

      {/* MODAL */}
      <PromotionModal visible={modalOpen} emply={emply} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
  },

  title: {
    fontSize: 18,
    fontWeight: '800',
  },

  addBtn: {
    backgroundColor: '#1d4ed8',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },

  addTxt: {
    color: '#fff',
    fontWeight: '700',
  },

  card: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },

  date: {
    fontSize: 12,
    color: '#6b7280',
  },

  row: {
    fontWeight: '700',
    fontSize: 16,
    marginTop: 4,
  },

  sub: {
    color: '#6b7280',
  },

  remark: {
    marginTop: 6,
    fontStyle: 'italic',
  },
});
