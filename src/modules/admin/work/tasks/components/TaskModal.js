// src/modules/admin/work/tasks/components/TaskModal.js
import React, { useEffect, useMemo, useState } from 'react';
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

const toCSV = arr => (Array.isArray(arr) ? arr.join(',') : String(arr || ''));

export default function TaskModal({ modal, onClose, onSubmit }) {
  const visible = !!modal?.visible;
  const mode = modal?.mode || 'add';
  const rec = modal?.record || null;

  // ✅ Stable key (prevents effect from firing on every new object reference)
  const recKey = useMemo(() => (rec?.id ? String(rec.id) : 'new'), [rec?.id]);

  const [form, setForm] = useState({
    title: '',
    category: '',
    startDate: '',
    dueDate: '',
    noDueDate: 'false',
    taskStageId: '',
    assignedEmployeeIds: '',
    description: '',
    labelIds: '',
    milestoneId: '',
    priority: 'LOW',
    isPrivate: 'false',
    timeEstimateMinutes: '',
    isDependent: 'false',
    projectId: '',
  });

  const [taskFile, setTaskFile] = useState(null);

  // ✅ Initialize/reset ONLY when modal opens or record id changes
  useEffect(() => {
    if (!visible) return;

    if (mode === 'edit' && rec) {
      setForm({
        title: rec.title || '',
        category: rec?.categoryId?.name || '',
        startDate: rec.startDate || '',
        dueDate: rec.dueDate || '',
        noDueDate: String(!!rec.noDueDate),
        taskStageId: String(rec.taskStageId || ''),
        assignedEmployeeIds: toCSV(rec.assignedEmployeeIds || []),
        description: rec.description || '',
        labelIds: toCSV((rec.labels || []).map(l => l.id)),
        milestoneId: rec.milestoneId ? String(rec.milestoneId) : '',
        priority: rec.priority || 'LOW',
        isPrivate: String(!!rec.isPrivate),
        timeEstimateMinutes: rec.timeEstimateMinutes
          ? String(rec.timeEstimateMinutes)
          : '',
        isDependent: String(!!rec.isDependent),
        projectId: rec.projectId ? String(rec.projectId) : '',
      });
    } else {
      setForm({
        title: '',
        category: '',
        startDate: '',
        dueDate: '',
        noDueDate: 'false',
        taskStageId: '',
        assignedEmployeeIds: '',
        description: '',
        labelIds: '',
        milestoneId: '',
        priority: 'LOW',
        isPrivate: 'false',
        timeEstimateMinutes: '',
        isDependent: 'false',
        projectId: '',
      });
    }

    setTaskFile(null);
  }, [visible, mode, recKey]); // ← not `rec`

  const disabled = mode === 'view';

  const pickFile = async () => {
    try {
      const f = await DocumentPicker.pickSingle({ copyTo: 'cachesDirectory' });
      setTaskFile({
        uri: f.fileCopyUri || f.uri,
        name: f.name || 'upload.bin',
        type: f.type || 'application/octet-stream',
      });
    } catch {
      // cancelled
    }
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
    console.log('[TaskModal] Save clicked, payload =', form);
    const payload = { ...form };

    // normalize arrays
    payload.assignedEmployeeIds = String(payload.assignedEmployeeIds || '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    payload.labelIds = String(payload.labelIds || '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    // normalize booleans
    payload.noDueDate = String(payload.noDueDate).toLowerCase() === 'true';
    payload.isPrivate = String(payload.isPrivate).toLowerCase() === 'true';
    payload.isDependent = String(payload.isDependent).toLowerCase() === 'true';

    // number-ish fields (keep as strings if backend expects text; otherwise cast)
    // payload.taskStageId = Number(payload.taskStageId) || undefined;
    // payload.milestoneId = Number(payload.milestoneId) || undefined;
    // payload.timeEstimateMinutes = Number(payload.timeEstimateMinutes) || 0;

    if (taskFile) payload.taskFile = taskFile;

    onSubmit && onSubmit(payload);
    if (onSubmit) onSubmit(payload);
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
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
          {/* Header */}
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

          {/* Form */}
          <ScrollView
            style={{ maxHeight: 480 }}
            keyboardShouldPersistTaps="handled"
          >
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

          {/* Footer */}
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
