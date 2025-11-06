import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Modal,
  Pressable,
  ActivityIndicator,
} from 'react-native';

export default function ProjectModal({
  visible,
  editing,
  onClose,
  onSave,
  busy = false,
}) {
  const [v, setV] = useState(() =>
    editing
      ? {
          shortCode: editing.shortCode || '',
          projectName: editing.name || '',
          startDate: editing.startDate || '',
          deadline: editing.deadline || '',
          noDeadline: !!editing.noDeadline,
          projectCategory: editing.category || '',
          departmentId: editing.departmentId || '',
          clientId: editing.clientId || '',
          projectSummary: editing.summary || '',
          tasksNeedAdminApproval: !!editing.tasksNeedAdminApproval,
          currency: editing.currency || 'USD',
          projectBudget: editing.budget ?? '',
          hoursEstimate: editing.hoursEstimate ?? '',
          allowManualTimeLogs: !!editing.allowManualTimeLogs,
          assignedEmployeeIds: (editing.assignedEmployeeIds || []).join(','),
          companyFile: null,
        }
      : {
          shortCode: '',
          projectName: '',
          startDate: '',
          deadline: '',
          noDeadline: false,
          projectCategory: '',
          departmentId: '',
          clientId: '',
          projectSummary: '',
          tasksNeedAdminApproval: true,
          currency: 'USD',
          projectBudget: '',
          hoursEstimate: '',
          allowManualTimeLogs: true,
          assignedEmployeeIds: '',
          companyFile: null,
        },
  );

  // simple setter
  const patch = (k, val) => setV(s => ({ ...s, [k]: val }));

  const disabled = useMemo(() => {
    return (
      !v.shortCode ||
      !v.projectName ||
      !v.startDate ||
      (!v.noDeadline && !v.deadline)
    );
  }, [v]);

  const handleSave = () => {
    const payload = {
      ...v,
      departmentId: v.departmentId ? Number(v.departmentId) : '',
      projectBudget: v.projectBudget === '' ? null : Number(v.projectBudget),
      hoursEstimate: v.hoursEstimate === '' ? null : Number(v.hoursEstimate),
      assignedEmployeeIds: v.assignedEmployeeIds
        ? v.assignedEmployeeIds
            .split(',')
            .map(s => s.trim())
            .filter(Boolean)
        : [],
    };
    onSave?.(payload);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>
            {editing ? 'Edit Project' : 'Add Project'}
          </Text>

          <View style={styles.row}>
            <Field
              label="Short Code"
              value={v.shortCode}
              onChange={t => patch('shortCode', t)}
            />
            <Field
              label="Project Name"
              value={v.projectName}
              onChange={t => patch('projectName', t)}
            />
          </View>

          <View style={styles.row}>
            <Field
              label="Start Date (YYYY-MM-DD)"
              value={v.startDate}
              onChange={t => patch('startDate', t)}
            />
            <Field
              label="Deadline (YYYY-MM-DD)"
              value={v.deadline}
              onChange={t => patch('deadline', t)}
            />
          </View>

          <View style={styles.row}>
            <Field
              label="Category"
              value={v.projectCategory}
              onChange={t => patch('projectCategory', t)}
            />
            <Field
              label="Department Id"
              value={String(v.departmentId)}
              onChange={t => patch('departmentId', t)}
            />
          </View>

          <View style={styles.row}>
            <Field
              label="Client Id"
              value={v.clientId}
              onChange={t => patch('clientId', t)}
            />
            <Field
              label="Currency"
              value={v.currency}
              onChange={t => patch('currency', t)}
            />
          </View>

          <Field
            label="Summary"
            value={v.projectSummary}
            onChange={t => patch('projectSummary', t)}
            multiline
          />

          <Field
            label="Members (comma-separated employeeIds)"
            value={v.assignedEmployeeIds}
            onChange={t => patch('assignedEmployeeIds', t)}
          />

          <View style={styles.row}>
            <Field
              label="Budget"
              value={String(v.projectBudget)}
              onChange={t => patch('projectBudget', t)}
            />
            <Field
              label="Hours Est."
              value={String(v.hoursEstimate)}
              onChange={t => patch('hoursEstimate', t)}
            />
          </View>

          <View style={styles.actions}>
            <Pressable onPress={onClose} style={[styles.btn, styles.outline]}>
              <Text style={styles.btnTxt}>Cancel</Text>
            </Pressable>
            <Pressable
              disabled={disabled || busy}
              onPress={handleSave}
              style={[
                styles.btn,
                disabled || busy ? styles.btnDisabled : styles.primary,
              ]}
            >
              {busy ? (
                <ActivityIndicator />
              ) : (
                <Text style={[styles.btnTxt, { color: '#fff' }]}>
                  {editing ? 'Save' : 'Create'}
                </Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function Field({ label, value, onChange, multiline = false }) {
  return (
    <View style={{ flex: 1, marginBottom: 10, marginRight: 8 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        style={[
          styles.input,
          multiline && { height: 90, textAlignVertical: 'top' },
        ]}
        multiline={multiline}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  title: { fontSize: 18, fontWeight: '900', marginBottom: 10 },
  row: { flexDirection: 'row', gap: 8 },
  label: { fontSize: 12, fontWeight: '800', color: '#374151', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
    color: '#111827',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 10,
  },
  btn: {
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  outline: { backgroundColor: '#fff' },
  primary: { backgroundColor: '#1d4ed8', borderColor: '#1d4ed8' },
  btnDisabled: { backgroundColor: '#93c5fd', borderColor: '#93c5fd' },
  btnTxt: { fontWeight: '800', color: '#111827' },
});
