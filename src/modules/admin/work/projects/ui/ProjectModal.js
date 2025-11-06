import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  Pressable,
} from 'react-native';
import DocumentPicker from '@react-native-documents/picker';

const L = ({ children }) => <Text style={styles.label}>{children}</Text>;
const Input = props => (
  <TextInput
    {...props}
    style={[styles.input, props.style]}
    placeholderTextColor="#9ca3af"
  />
);

export default function ProjectModal({ visible, editing, onClose, onSave }) {
  const [form, setForm] = useState({
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
  });

  useEffect(() => {
    if (editing) {
      setForm({
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
        projectBudget: String(editing.budget ?? ''),
        hoursEstimate: String(editing.hoursEstimate ?? ''),
        allowManualTimeLogs: !!editing.allowManualTimeLogs,
        assignedEmployeeIds: (editing.assignedEmployeeIds || []).join(','),
        companyFile: null,
      });
    } else {
      setForm(f => ({ ...f, companyFile: null }));
    }
  }, [editing]);

  const pickFile = async () => {
    try {
      const res = await DocumentPicker.pickSingle({
        type: DocumentPicker.types.allFiles,
      });
      setForm(f => ({
        ...f,
        companyFile: {
          uri: res.fileCopyUri || res.uri,
          name: res.name,
          type: res.type || 'application/octet-stream',
        },
      }));
    } catch (e) {}
  };

  const submit = () => {
    const payload = {
      ...form,
      departmentId: Number(form.departmentId || 0),
      projectBudget:
        form.projectBudget === '' ? undefined : Number(form.projectBudget),
      hoursEstimate:
        form.hoursEstimate === '' ? undefined : Number(form.hoursEstimate),
      assignedEmployeeIds: form.assignedEmployeeIds
        .split(',')
        .map(s => s.trim())
        .filter(Boolean),
    };
    onSave(payload);
  };

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <Text style={styles.title}>
            {editing ? 'Edit Project' : 'Add Project'}
          </Text>

          <View style={styles.grid}>
            <View style={styles.col}>
              <L>Short Code</L>
              <Input
                value={form.shortCode}
                onChangeText={v => setForm({ ...form, shortCode: v })}
                placeholder="PRJ001"
              />

              <L>Project Name</L>
              <Input
                value={form.projectName}
                onChangeText={v => setForm({ ...form, projectName: v })}
                placeholder="Website Redesign"
              />

              <L>Start Date (YYYY-MM-DD)</L>
              <Input
                value={form.startDate}
                onChangeText={v => setForm({ ...form, startDate: v })}
                placeholder="2025-10-01"
              />

              <L>Deadline</L>
              <Input
                value={form.deadline}
                onChangeText={v => setForm({ ...form, deadline: v })}
                placeholder="2026-01-31"
              />

              <L>Category</L>
              <Input
                value={form.projectCategory}
                onChangeText={v => setForm({ ...form, projectCategory: v })}
                placeholder="Design"
              />

              <L>Department ID</L>
              <Input
                value={form.departmentId}
                onChangeText={v => setForm({ ...form, departmentId: v })}
                placeholder="12"
              />
            </View>

            <View style={styles.col}>
              <L>Client ID</L>
              <Input
                value={form.clientId}
                onChangeText={v => setForm({ ...form, clientId: v })}
                placeholder="CLI001"
              />

              <L>Summary</L>
              <Input
                value={form.projectSummary}
                onChangeText={v => setForm({ ...form, projectSummary: v })}
                placeholder="Short summary"
              />

              <L>Currency</L>
              <Input
                value={form.currency}
                onChangeText={v => setForm({ ...form, currency: v })}
                placeholder="USD"
              />

              <L>Budget</L>
              <Input
                value={form.projectBudget}
                onChangeText={v => setForm({ ...form, projectBudget: v })}
                placeholder="25000"
              />

              <L>Hours Estimate</L>
              <Input
                value={form.hoursEstimate}
                onChangeText={v => setForm({ ...form, hoursEstimate: v })}
                placeholder="400"
              />

              <L>Assigned Employee IDs (comma)</L>
              <Input
                value={form.assignedEmployeeIds}
                onChangeText={v => setForm({ ...form, assignedEmployeeIds: v })}
                placeholder="EMP-010,EMP-009"
              />
            </View>
          </View>

          <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
            <Pressable style={styles.btnGhost} onPress={pickFile}>
              <Text style={styles.btnTxtGhost}>
                {form.companyFile
                  ? form.companyFile.name
                  : 'Attach Company File'}
              </Text>
            </Pressable>
          </View>

          <View style={styles.footer}>
            <Pressable style={styles.btn} onPress={onClose}>
              <Text style={styles.btnTxt}>Cancel</Text>
            </Pressable>
            <Pressable style={[styles.btn, styles.btnPrimary]} onPress={submit}>
              <Text style={[styles.btnTxt, styles.btnTxtPrimary]}>
                {editing ? 'Save Changes' : 'Create Project'}
              </Text>
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
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    maxHeight: '92%',
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0b0b0c',
    marginBottom: 10,
  },
  grid: { flexDirection: 'row', gap: 12 },
  col: { flex: 1, gap: 6 },
  label: { fontSize: 12, fontWeight: '800', color: '#374151', marginTop: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
    color: '#111827',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 16,
  },
  btn: {
    borderWidth: 1,
    borderColor: '#1d4ed8',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  btnTxt: { color: '#111827' },
  btnPrimary: { backgroundColor: '#1d4ed8' },
  btnTxtPrimary: { color: '#fff' },
  btnGhost: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#f8fafc',
  },
  btnTxtGhost: { color: '#334155' },
});
