// components/FollowupModal.js

import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

export default function FollowupModal() {
  const dispatch = useDispatch();

  const open = useSelector(s => s.admin?.deals?.followupOpen);
  const dealId = useSelector(s => s.admin?.deals?.followupDealId);

  const [form, setForm] = useState({
    nextDate: '',
    startTime: '',
    remarks: '',
    remindBefore: 1,
    remindUnit: 'DAYS',
  });

  useEffect(() => {
    if (!open) {
      setForm({
        nextDate: '',
        startTime: '',
        remarks: '',
        remindBefore: 1,
        remindUnit: 'DAYS',
      });
    }
  }, [open]);

  if (!open) return null;

  const closeModal = () => {
    dispatch({
      type: 'admin/deals/SET_FOLLOWUP_OPEN',
      open: false,
      dealId: null,
    });
  };

  const handleSave = () => {
    dispatch({
      type: 'admin/deals/FOLLOWUP_CREATE_REQUEST',
      dealId,
      payload: form,
    });

    closeModal();
  };

  return (
    <Modal
      transparent
      animationType="fade"
      visible={open}
      onRequestClose={closeModal}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>Add Follow-up</Text>

          <TextInput
            placeholder="Next Date (YYYY-MM-DD)"
            value={form.nextDate}
            onChangeText={v => setForm({ ...form, nextDate: v })}
            style={styles.input}
          />

          <TextInput
            placeholder="Start Time (HH:mm)"
            value={form.startTime}
            onChangeText={v => setForm({ ...form, startTime: v })}
            style={styles.input}
          />

          <TextInput
            placeholder="Remarks"
            value={form.remarks}
            onChangeText={v => setForm({ ...form, remarks: v })}
            style={styles.input}
          />

          <TextInput
            placeholder="Remind Before"
            keyboardType="numeric"
            value={String(form.remindBefore)}
            onChangeText={v =>
              setForm({
                ...form,
                remindBefore: Number(v) || 0,
              })
            }
            style={styles.input}
          />

          <TextInput
            placeholder="Remind Unit (DAYS/HOURS)"
            value={form.remindUnit}
            onChangeText={v => setForm({ ...form, remindUnit: v })}
            style={styles.input}
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={closeModal}>
              <Text>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.primaryBtn} onPress={handleSave}>
              <Text style={{ color: '#fff', fontWeight: '700' }}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#eef0f3',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    gap: 16,
  },
  primaryBtn: {
    backgroundColor: '#3F6AE1',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
  },
});
