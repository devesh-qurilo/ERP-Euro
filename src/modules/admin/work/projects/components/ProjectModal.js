import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Modal,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Switch,
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
          departmentId: String(editing.departmentId ?? ''),
          clientId: editing.clientId || '',
          projectSummary: editing.summary || '',
          tasksNeedAdminApproval: !!editing.tasksNeedAdminApproval,
          currency: editing.currency || 'USD',
          projectBudget: editing.budget?.toString() ?? '',
          hoursEstimate: editing.hoursEstimate?.toString() ?? '',
          allowManualTimeLogs: !!editing.allowManualTimeLogs,
          assignedEmployeeIds: (editing.assignedEmployeeIds || []).join(','),
          companyFile: null, // keep for future file picker
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
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.backdrop}
      >
        <View style={styles.card}>
          <Text style={styles.title}>
            {editing ? 'Edit Project' : 'Add Project'}
          </Text>

          {/* CONTENT SCROLLER */}
          <ScrollView
            contentContainerStyle={styles.formWrap}
            keyboardShouldPersistTaps="handled"
          >
            {/* GRID: two columns that wrap */}
            <View style={styles.grid}>
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

              <Field
                label="Start Date (YYYY-MM-DD)"
                value={v.startDate}
                onChange={t => patch('startDate', t)}
              />
              {!v.noDeadline && (
                <Field
                  label="Deadline (YYYY-MM-DD)"
                  value={v.deadline}
                  onChange={t => patch('deadline', t)}
                />
              )}

              <Toggle
                label="No Deadline"
                value={v.noDeadline}
                onChange={val => patch('noDeadline', val)}
              />

              <Field
                label="Category"
                value={v.projectCategory}
                onChange={t => patch('projectCategory', t)}
              />
              <Field
                label="Department Id"
                value={v.departmentId}
                onChange={t => patch('departmentId', t)}
                keyboardType="numeric"
              />
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

              <Field
                label="Summary"
                value={v.projectSummary}
                onChange={t => patch('projectSummary', t)}
                multiline
                full
              />

              <Field
                label="Members (comma-separated employeeIds)"
                value={v.assignedEmployeeIds}
                onChange={t => patch('assignedEmployeeIds', t)}
                full
              />

              <Field
                label="Budget"
                value={v.projectBudget}
                onChange={t => patch('projectBudget', t)}
                keyboardType="numeric"
              />
              <Field
                label="Hours Estimate"
                value={v.hoursEstimate}
                onChange={t => patch('hoursEstimate', t)}
                keyboardType="numeric"
              />

              <Toggle
                label="Allow Manual Time Logs"
                value={v.allowManualTimeLogs}
                onChange={val => patch('allowManualTimeLogs', val)}
              />
              <Toggle
                label="Tasks Need Admin Approval"
                value={v.tasksNeedAdminApproval}
                onChange={val => patch('tasksNeedAdminApproval', val)}
              />

              {/* File picker placeholder (kept simple) */}
              {/* Hook your document picker here and set v.companyFile */}
            </View>
          </ScrollView>

          {/* ACTIONS */}
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
      </KeyboardAvoidingView>
    </Modal>
  );
}

function Field({
  label,
  value,
  onChange,
  multiline = false,
  full = false,
  keyboardType = 'default',
}) {
  return (
    <View
      style={[styles.field, full && { flexBasis: '100%', minWidth: '100%' }]}
    >
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        style={[styles.input, multiline && styles.textarea]}
        multiline={multiline}
        keyboardType={keyboardType}
      />
    </View>
  );
}

function Toggle({ label, value, onChange }) {
  return (
    <View style={[styles.field, styles.toggleRow]}>
      <Text style={styles.label}>{label}</Text>
      <Switch value={value} onValueChange={onChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 12,
    // Crucial: limit height so inside can scroll
    maxHeight: '88%',
  },
  title: { fontSize: 18, fontWeight: '900', marginBottom: 8, color: '#0b0b0c' },

  formWrap: { paddingBottom: 8 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap', // <<< allows wrapping to next line
    columnGap: 10,
    rowGap: 10,
  },
  field: {
    flexGrow: 1,
    flexBasis: '48%', // <<< two columns by default
    minWidth: 240, // <<< prevents tiny columns on narrow widths
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

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
  textarea: { height: 100, textAlignVertical: 'top' },

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
