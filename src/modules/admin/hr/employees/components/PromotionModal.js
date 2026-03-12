import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
} from 'react-native';

import { useDispatch, useSelector } from 'react-redux';

import { closePromotionModal, createEmployeePromotion } from '../store/actions';

import { selectDesignations } from '../../designations/store/selectors';
import { selectDepartments } from '../../departments/store/selectors';
import { selectPromotionModalOpen } from '../store/selectors';

export default function PromotionModal({ emp }) {
  const dispatch = useDispatch();

  const designations = useSelector(selectDesignations);
  const departments = useSelector(selectDepartments);

  const modalOpen = useSelector(selectPromotionModalOpen);
  const [remarks, setRemarks] = useState('');

  const save = () => {
    dispatch(
      createEmployeePromotion(emp.employeeId, {
        oldDesignationId: emp.designationId,
        oldDepartmentId: emp.departmentId,
        newDepartmentId: departments[0]?.id,
        newDesignationId: designations[0]?.id,
        isPromotion: true,
        sendNotification: true,
        remarks,
      }),
    );
  };

  return (
    <Modal transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.modal}>
          <Text style={styles.title}>Add Promotion</Text>

          <Text style={styles.label}>Remarks</Text>

          <TextInput
            style={styles.input}
            value={remarks}
            onChangeText={setRemarks}
            placeholder="Promotion reason"
          />

          <View style={styles.footer}>
            <Pressable
              style={styles.btn}
              onPress={() => dispatch(closePromotionModal())}
            >
              <Text>Cancel</Text>
            </Pressable>

            <Pressable style={[styles.btn, styles.primary]} onPress={save}>
              <Text style={{ color: '#fff' }}>Save</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 16,
  },

  modal: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },

  title: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 10,
  },

  label: {
    fontWeight: '700',
    marginBottom: 6,
  },

  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 10,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    gap: 8,
  },

  btn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
  },

  primary: {
    backgroundColor: '#1d4ed8',
    borderColor: '#1d4ed8',
  },
});
