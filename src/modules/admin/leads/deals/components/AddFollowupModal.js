// components/AddFollowupModal.js

import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Pressable,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
} from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

export default function AddFollowupModal({ visible, onClose, onSave }) {
  const emptyForm = {
    nextDate: null,
    startTime: null,
    remarks: '',
    sendReminder: true,
    remindBefore: 1,
    remindUnit: 'DAYS',
    status: 'PENDING',
  };

  const [form, setForm] = useState(emptyForm);

  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);

  if (!visible) return null;

  const handleSave = () => {
    if (!form.nextDate || !form.startTime) {
      Alert.alert('Validation', 'Date and time required');
      return;
    }

    const payload = {
      nextDate: form.nextDate.toISOString().slice(0, 10),
      startTime: form.startTime.toTimeString().slice(0, 5),
      remarks: form.remarks,
      sendReminder: form.sendReminder,
      remindBefore: form.remindBefore,
      remindUnit: form.remindUnit,
      status: form.status,
    };

    onSave(payload);

    setForm(emptyForm);
    onClose();
  };

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        <View style={styles.card}>
          <ScrollView keyboardShouldPersistTaps="handled">
            <Text style={styles.title}>Add Followup</Text>

            {/* Date */}
            <Text style={styles.label}>Next Date</Text>
            <Pressable style={styles.input} onPress={() => setShowDate(true)}>
              <Text>
                {form.nextDate
                  ? form.nextDate.toISOString().slice(0, 10)
                  : 'Select date'}
              </Text>
            </Pressable>

            {showDate && (
              <DateTimePicker
                value={form.nextDate || new Date()}
                mode="date"
                onChange={(_, d) => {
                  setShowDate(false);
                  if (d) setForm({ ...form, nextDate: d });
                }}
              />
            )}

            {/* Time */}
            <Text style={styles.label}>Start Time</Text>
            <Pressable style={styles.input} onPress={() => setShowTime(true)}>
              <Text>
                {form.startTime
                  ? form.startTime.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : 'Select time'}
              </Text>
            </Pressable>

            {showTime && (
              <DateTimePicker
                value={form.startTime || new Date()}
                mode="time"
                onChange={(_, t) => {
                  setShowTime(false);
                  if (t) setForm({ ...form, startTime: t });
                }}
              />
            )}

            {/* Remarks */}
            <Text style={styles.label}>Remarks</Text>
            <TextInput
              style={[styles.input, { height: 80 }]}
              multiline
              value={form.remarks}
              onChangeText={v => setForm({ ...form, remarks: v })}
            />

            {/* Remind Before */}
            <Text style={styles.label}>Remind Before</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={String(form.remindBefore)}
              onChangeText={v =>
                setForm({
                  ...form,
                  remindBefore: Number(v) || 0,
                })
              }
            />

            {/* Remind Unit Dropdown */}
            <Text style={styles.label}>Remind Unit</Text>
            <View style={styles.pickerBox}>
              <Picker
                selectedValue={form.remindUnit}
                onValueChange={v => setForm({ ...form, remindUnit: v })}
                itemStyle={{ height: 100 }}
              >
                <Picker.Item label="Days" value="DAYS" />
                <Picker.Item label="Hours" value="HOURS" />
              </Picker>
            </View>

            {/* Status Dropdown */}
            <Text style={styles.label}>Status</Text>
            <View style={styles.pickerBox}>
              <Picker
                selectedValue={form.status}
                onValueChange={v => setForm({ ...form, status: v })}
                itemStyle={{ height: 100 }}
              >
                <Picker.Item label="Pending" value="PENDING" />
                <Picker.Item label="Completed" value="COMPLETED" />
                <Picker.Item label="Cancelled" value="CANCELLED" />
              </Picker>
            </View>

            {/* Buttons */}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                onPress={onClose}
                style={{
                  backgroundColor: '#979797',
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: 8,
                }}
              >
                <Text
                  style={{
                    color: '#000000',
                    fontWeight: '700',
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

/* ================= STYLES ================= */

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
    maxHeight: '90%',
  },

  title: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 12,
  },

  label: {
    fontSize: 13,
    marginBottom: 4,
    color: '#555',
  },

  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
    marginBottom: 12,
  },

  pickerBox: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    marginBottom: 12,
  },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 20,
    marginTop: 10,
  },

  saveBtn: {
    backgroundColor: '#3F6AE1',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },

  saveText: {
    color: '#fff',
    fontWeight: '700',
  },
});
