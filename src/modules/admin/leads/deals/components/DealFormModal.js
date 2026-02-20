import React, { useEffect, useMemo, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

import { selectEmpList } from '../../../hr/employees/store/selectors';
import { fetchEmployees } from '../../../hr/employees/store/actions';
import { selectAdminLeads } from '../../../leads/store/selectors';
import { fetchAdminLeads } from '../../store/actions';

export default function DealFormModal({ open, editing, onClose }) {
  const dispatch = useDispatch();

  const employees = useSelector(selectEmpList) || [];
  const leads = useSelector(selectAdminLeads) || [];

  const [showDate, setShowDate] = useState(false);

  const emptyForm = {
    title: '',
    leadId: null,
    pipeline: 'Default Pipeline',
    dealStage: 'Generated',
    dealCategory: 'Corporate',
    dealAgent: '',
    dealWatchers: [],
    value: '',
    expectedCloseDate: null,
    dealContact: '',
  };

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    dispatch(fetchEmployees());
    dispatch(fetchAdminLeads());
  }, [dispatch]);

  /* ================= Dropdown Options ================= */

  const empOptions = useMemo(
    () =>
      employees.map(e => ({
        label: `${e.name} (${e.employeeId})`,
        value: e.employeeId,
      })),
    [employees],
  );

  const leadOptions = useMemo(
    () =>
      leads.map(l => ({
        label: `${l.name} (${l.email})`,
        value: l.id,
      })),
    [leads],
  );

  /* ================= Editing Mode ================= */

  useEffect(() => {
    if (editing) {
      setForm({
        ...editing,
        expectedCloseDate: editing.expectedCloseDate
          ? new Date(editing.expectedCloseDate)
          : null,
      });
    } else {
      setForm(emptyForm);
    }
  }, [editing, open]);

  //   if (!open) return null;

  useEffect(() => {
    if (!open) {
      setForm(emptyForm);
    }
  }, [open]);

  /* ================= Save ================= */

  const handleSave = () => {
    const payload = {
      title: form.title,
      leadId: form.leadId,
      pipeline: form.pipeline,
      dealStage: form.dealStage,
      dealCategory: form.dealCategory,
      dealAgent: form.dealAgent,
      dealWatchers: form.dealWatchers,
      value: Number(form.value) || 0,
      expectedCloseDate: form.expectedCloseDate
        ? form.expectedCloseDate.toISOString().slice(0, 10)
        : null,
      dealContact: form.dealContact,
    };

    if (editing?.id) {
      dispatch({
        type: 'admin/deals/UPDATE_REQUEST',
        id: editing.id,
        payload,
      });
    } else {
      dispatch({
        type: 'admin/deals/CREATE_REQUEST',
        payload,
      });
    }
    onClose?.();
  };

  return (
    <Modal transparent visible={open} animationType="fade">
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.card} onPress={() => {}}>
          <ScrollView>
            <Text style={styles.title}>
              {editing ? 'Edit Deal' : 'Add Deal'}
            </Text>

            {/* Title */}
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              value={form.title}
              onChangeText={v => setForm({ ...form, title: v })}
            />

            {/* Lead Dropdown */}
            <Text style={styles.label}>Lead</Text>
            <View style={styles.pickerBox}>
              <Picker
                selectedValue={form.leadId}
                onValueChange={v => setForm({ ...form, leadId: v })}
              >
                <Picker.Item label="Select Lead" value={null} />
                {leadOptions.map(opt => (
                  <Picker.Item
                    key={opt.value}
                    label={opt.label}
                    value={opt.value}
                  />
                ))}
              </Picker>
            </View>

            {/* Agent Dropdown */}
            <Text style={styles.label}>Deal Agent</Text>
            <View style={styles.pickerBox}>
              <Picker
                selectedValue={form.dealAgent}
                onValueChange={v => setForm({ ...form, dealAgent: v })}
              >
                <Picker.Item label="Select Agent" value="" />
                {empOptions.map(opt => (
                  <Picker.Item
                    key={opt.value}
                    label={opt.label}
                    value={opt.value}
                  />
                ))}
              </Picker>
            </View>

            {/* Value */}
            <Text style={styles.label}>Value</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={String(form.value)}
              onChangeText={v => setForm({ ...form, value: v })}
            />

            {/* Expected Close Date */}
            <Text style={styles.label}>Expected Close Date</Text>
            <Pressable style={styles.input} onPress={() => setShowDate(true)}>
              <Text>
                {form.expectedCloseDate
                  ? form.expectedCloseDate.toISOString().slice(0, 10)
                  : 'Select Date'}
              </Text>
            </Pressable>

            {showDate && (
              <DateTimePicker
                value={form.expectedCloseDate || new Date()}
                mode="date"
                onChange={(_, d) => {
                  setShowDate(false);
                  if (d)
                    setForm({
                      ...form,
                      expectedCloseDate: d,
                    });
                }}
              />
            )}

            {/* Category */}
            <Text style={styles.label}>Category</Text>
            <View style={styles.pickerBox}>
              <Picker
                selectedValue={form.dealCategory}
                onValueChange={v => setForm({ ...form, dealCategory: v })}
              >
                <Picker.Item label="Corporate" value="Corporate" />
                <Picker.Item label="Premium" value="Premium" />
              </Picker>
            </View>

            {/* Stage */}
            <Text style={styles.label}>Stage</Text>
            <View style={styles.pickerBox}>
              <Picker
                selectedValue={form.dealStage}
                onValueChange={v => setForm({ ...form, dealStage: v })}
              >
                <Picker.Item label="Generated" value="Generated" />
                <Picker.Item label="Negotiation" value="Negotiation" />
                <Picker.Item label="Won" value="Won" />
                <Picker.Item label="Lost" value="Lost" />
              </Picker>
            </View>

            {/* Save Button */}
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveText}>
                {editing ? 'Update' : 'Create'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.saveBtn,
                { backgroundColor: '#ccc', marginTop: 8 },
              ]}
              onPress={onClose}
            >
              <Text style={{ color: '#000', fontWeight: '700' }}>Cancel</Text>
            </TouchableOpacity>
          </ScrollView>
        </Pressable>
      </Pressable>
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
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  pickerBox: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    marginBottom: 12,
  },
  saveBtn: {
    backgroundColor: '#3F6AE1',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontWeight: '700',
  },
});
