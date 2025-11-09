import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  Pressable,
} from 'react-native';
import DocumentPicker from '@react-native-documents/picker';
import { Button } from './ui';

export default function TaskModal({ modal, onClose, onSubmit }) {
  const visible = !!modal?.visible;
  const mode = modal?.mode || 'add';
  const rec = modal?.record || {};

  const [form, setForm] = useState({
    title: rec.title || '',
    category: rec?.categoryId?.name || '',
    startDate: rec.startDate || '',
    dueDate: rec.dueDate || '',
    noDueDate: String(!!rec.noDueDate),
    taskStageId: String(rec.taskStageId || ''),
    assignedEmployeeIds: (rec.assignedEmployeeIds || []).join(','),
    description: rec.description || '',
    labelIds: (rec.labels || []).map(l => l.id).join(','),
    milestoneId: rec.milestoneId ? String(rec.milestoneId) : '',
    priority: rec.priority || 'LOW',
    isPrivate: String(!!rec.isPrivate),
    timeEstimateMinutes: rec.timeEstimateMinutes
      ? String(rec.timeEstimateMinutes)
      : '',
    isDependent: String(!!rec.isDependent),
    projectId: rec.projectId ? String(rec.projectId) : '',
  });
  const [taskFile, setTaskFile] = useState(null);

  useEffect(() => {
    if (!visible) return;
    setForm({
      title: rec.title || '',
      category: rec?.categoryId?.name || '',
      startDate: rec.startDate || '',
      dueDate: rec.dueDate || '',
      noDueDate: String(!!rec.noDueDate),
      taskStageId: String(rec.taskStageId || ''),
      assignedEmployeeIds: (rec.assignedEmployeeIds || []).join(','),
      description: rec.description || '',
      labelIds: (rec.labels || []).map(l => l.id).join(','),
      milestoneId: rec.milestoneId ? String(rec.milestoneId) : '',
      priority: rec.priority || 'LOW',
      isPrivate: String(!!rec.isPrivate),
      timeEstimateMinutes: rec.timeEstimateMinutes
        ? String(rec.timeEstimateMinutes)
        : '',
      isDependent: String(!!rec.isDependent),
      projectId: rec.projectId ? String(rec.projectId) : '',
    });
    setTaskFile(null);
  }, [visible, rec]);

  const disabled = mode === 'view';

  const pickFile = async () => {
    try {
      const f = await DocumentPicker.pickSingle({ copyTo: 'cachesDirectory' });
      setTaskFile({
        uri: f.fileCopyUri || f.uri,
        name: f.name || 'upload.bin',
        type: f.type || 'application/octet-stream',
      });
    } catch {}
  };

  const fields = [
    ['title', 'Title'],
    ['category', 'Category'],
    ['startDate', 'Start Date (YYYY-MM-DD)'],
    ['dueDate', 'Due Date (YYYY-MM-DD)'],
    ['noDueDate', 'No Due Date (true/false)'],
    ['taskStageId', 'Task Stage ID'],
    ['assignedEmployeeIds', 'Assigned Employees (EMP-IDs comma separated)'],
    ['description', 'Description'],
    ['labelIds', 'Label IDs (comma separated)'],
    ['milestoneId', 'Milestone ID'],
    ['priority', 'Priority (LOW|HIGH|URGENT|MEDIUM)'],
    ['isPrivate', 'Is Private (true/false)'],
    ['timeEstimateMinutes', 'Time Estimate (minutes)'],
    ['isDependent', 'Is Dependent (true/false)'],
    ['projectId', 'Project ID'],
  ];

  const submit = () => {
    const payload = { ...form };
    payload.assignedEmployeeIds = (payload.assignedEmployeeIds || '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
    payload.labelIds = (payload.labelIds || '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
    if (taskFile) payload.taskFile = taskFile;
    onSubmit && onSubmit(payload);
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.35)',
          justifyContent: 'center',
          padding: 18,
        }}
      >
        <View
          style={{ backgroundColor: '#fff', borderRadius: 12, padding: 14 }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 10,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: '700' }}>
              {mode === 'add'
                ? 'Add Task'
                : mode === 'edit'
                ? 'Edit Task'
                : 'Task Details'}
            </Text>
            <Pressable onPress={onClose}>
              <Text style={{ fontSize: 18 }}>✖️</Text>
            </Pressable>
          </View>

          <ScrollView style={{ maxHeight: 480 }}>
            {fields.map(([k, label]) => (
              <View key={k} style={{ marginBottom: 10 }}>
                <Text style={{ marginBottom: 4 }}>{label}</Text>
                <TextInput
                  editable={!disabled}
                  value={String(form[k] ?? '')}
                  onChangeText={t => setForm(s => ({ ...s, [k]: t }))}
                  placeholder={label}
                  style={{
                    borderWidth: 1,
                    borderColor: '#e5e5e5',
                    borderRadius: 8,
                    paddingHorizontal: 10,
                    height: 40,
                    backgroundColor: disabled ? '#f9fafb' : '#fff',
                  }}
                />
              </View>
            ))}
            {mode !== 'view' && (
              <View style={{ marginBottom: 12 }}>
                <Button
                  title={
                    taskFile ? `Attached: ${taskFile.name}` : 'Attach File'
                  }
                  onPress={pickFile}
                  bg="#e5e7eb"
                  color="#111827"
                />
              </View>
            )}
          </ScrollView>

          {mode !== 'view' && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                gap: 10,
              }}
            >
              <Button
                title="Cancel"
                onPress={onClose}
                bg="#e5e7eb"
                color="#111827"
              />
              <Button title="Save" onPress={submit} />
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}
