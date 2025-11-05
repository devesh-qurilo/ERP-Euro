// modules/admin/hr/employees/view/work/projects/components/ProjectModal.js
import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import DocumentPicker from '@react-native-documents/picker';

export default function ProjectModal({
  visible,
  editing, // project or null
  defaultEmployeeId, // the employee we are viewing; auto-include into assigned list
  loading, // show loader on Save
  onClose,
  onSave, // (payload) => void
}) {
  const [v, setV] = React.useState({
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
    assignedEmployeeIds: [],
    companyFile: null,
  });

  React.useEffect(() => {
    if (editing) {
      setV({
        shortCode: editing.shortCode || '',
        projectName: editing.name || '',
        startDate: editing.startDate || '',
        deadline: editing.deadline || '',
        noDeadline: !!editing.noDeadline,
        projectCategory: editing.category || '',
        departmentId: String(editing.departmentId || ''),
        clientId: editing.clientId || '',
        projectSummary: editing.summary || '',
        tasksNeedAdminApproval: !!editing.tasksNeedAdminApproval,
        currency: editing.currency || 'USD',
        projectBudget: editing.budget != null ? String(editing.budget) : '',
        hoursEstimate:
          editing.hoursEstimate != null ? String(editing.hoursEstimate) : '',
        allowManualTimeLogs: !!editing.allowManualTimeLogs,
        assignedEmployeeIds: editing.assignedEmployeeIds || [],
        companyFile: null,
      });
    } else {
      setV(p => ({
        ...p,
        assignedEmployeeIds: defaultEmployeeId ? [defaultEmployeeId] : [],
      }));
    }
  }, [editing, defaultEmployeeId, visible]);

  const pickFile = async () => {
    try {
      const res = await DocumentPicker.pickSingle();
      setV(prev => ({ ...prev, companyFile: res }));
    } catch (_) {}
  };

  const save = () => {
    const payload = {
      ...v,
      departmentId: v.departmentId ? Number(v.departmentId) : undefined,
      projectBudget: v.projectBudget ? Number(v.projectBudget) : undefined,
      hoursEstimate: v.hoursEstimate ? Number(v.hoursEstimate) : undefined,
    };
    onSave(payload, editing?.id);
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
              onChange={t => setV({ ...v, shortCode: t })}
            />
            <Field
              label="Project Name"
              value={v.projectName}
              onChange={t => setV({ ...v, projectName: t })}
            />
          </View>

          <View style={styles.row}>
            <Field
              label="Start Date (YYYY-MM-DD)"
              value={v.startDate}
              onChange={t => setV({ ...v, startDate: t })}
            />
            <Field
              label="Deadline (YYYY-MM-DD)"
              value={v.deadline}
              onChange={t => setV({ ...v, deadline: t })}
            />
          </View>

          <View style={styles.row}>
            <Field
              label="Category"
              value={v.projectCategory}
              onChange={t => setV({ ...v, projectCategory: t })}
            />
            <Field
              label="Department ID"
              value={String(v.departmentId || '')}
              onChange={t => setV({ ...v, departmentId: t })}
            />
          </View>

          <View style={styles.row}>
            <Field
              label="Client ID"
              value={v.clientId}
              onChange={t => setV({ ...v, clientId: t })}
            />
            <Field
              label="Currency"
              value={v.currency}
              onChange={t => setV({ ...v, currency: t })}
            />
          </View>

          <View style={styles.row}>
            <Field
              label="Budget"
              value={String(v.projectBudget)}
              onChange={t => setV({ ...v, projectBudget: t })}
              keyboardType="numeric"
            />
            <Field
              label="Hours Estimate"
              value={String(v.hoursEstimate)}
              onChange={t => setV({ ...v, hoursEstimate: t })}
              keyboardType="numeric"
            />
          </View>

          <Field
            label="Summary"
            value={v.projectSummary}
            onChange={t => setV({ ...v, projectSummary: t })}
            multiline
          />

          <Field
            label="Assigned Employees (comma separated)"
            value={(v.assignedEmployeeIds || []).join(',')}
            onChange={t =>
              setV({
                ...v,
                assignedEmployeeIds: t
                  .split(',')
                  .map(s => s.trim())
                  .filter(Boolean),
              })
            }
          />

          <Pressable style={styles.fileBtn} onPress={pickFile}>
            <Text style={styles.fileTxt}>
              {v.companyFile?.name
                ? `File: ${v.companyFile.name}`
                : 'Attach Company File'}
            </Text>
          </Pressable>

          <View style={styles.footer}>
            <Pressable
              style={styles.cancel}
              onPress={onClose}
              disabled={loading}
            >
              <Text style={styles.cancelTxt}>Cancel</Text>
            </Pressable>
            <Pressable style={styles.save} onPress={save} disabled={loading}>
              {loading ? (
                <ActivityIndicator />
              ) : (
                <Text style={styles.saveTxt}>Save</Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const Field = ({ label, value, onChange, multiline, keyboardType }) => (
  <View style={{ marginBottom: 10, flex: 1, marginRight: 8 }}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      value={value}
      onChangeText={onChange}
      style={[styles.input, multiline && { height: 80 }]}
      placeholder="---"
      placeholderTextColor="#9ca3af"
      multiline={multiline}
      keyboardType={keyboardType}
    />
  </View>
);

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 12,
    color: '#111827',
  },
  row: { flexDirection: 'row', flexWrap: 'wrap' },
  label: { fontSize: 12, fontWeight: '800', color: '#374151', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#111827',
    backgroundColor: '#fff',
  },
  fileBtn: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    padding: 12,
    marginTop: 6,
  },
  fileTxt: { color: '#111827', fontWeight: '600' },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 12,
  },
  cancel: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  cancelTxt: { color: '#111827', fontWeight: '800' },
  save: {
    borderWidth: 1,
    borderColor: '#1d4ed8',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#1d4ed8',
  },
  saveTxt: { color: '#fff', fontWeight: '900' },
});
