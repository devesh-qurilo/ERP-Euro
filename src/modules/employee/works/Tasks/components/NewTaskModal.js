import React, { useEffect, useMemo, useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import { useDispatch } from 'react-redux';
import {
  taskCategoriesAPI,
  allProjectsAPI,
  employeesAPI,
  projectLabelsAPI,
  projectMilestonesAPI,
} from '../../../../../services/api';
import { createTaskRequest } from '../store/actions';

const Field = ({ label, children, style }) => (
  <View style={[{ marginBottom: 12 }, style]}>
    <Text style={styles.label}>{label}</Text>
    {children}
  </View>
);

const Select = ({ value, onChange, options, placeholder = '--' }) => {
  const [open, setOpen] = useState(false);
  const selected = options.find(o => o.value === value)?.label || placeholder;
  return (
    <View>
      <Pressable style={styles.input} onPress={() => setOpen(o => !o)}>
        <Text style={{ color: '#111827' }}>{selected}</Text>
        <Text style={{ color: '#6b7280' }}>{open ? '▴' : '▾'}</Text>
      </Pressable>
      {open && (
        <View style={styles.menu}>
          <ScrollView style={{ maxHeight: 240 }}>
            {options.map(opt => (
              <Pressable
                key={String(opt.value)}
                style={styles.menuItem}
                onPress={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
              >
                <Text style={{ color: '#111827' }}>{opt.label}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const MultiSelect = ({ values = [], onChange, options }) => {
  const toggle = val => {
    if (values.includes(val)) onChange(values.filter(v => v !== val));
    else onChange([...values, val]);
  };
  return (
    <View style={styles.msWrap}>
      {options.map(opt => {
        const active = values.includes(opt.value);
        return (
          <Pressable
            key={String(opt.value)}
            onPress={() => toggle(opt.value)}
            style={[styles.msPill, active && styles.msPillActive]}
          >
            <Text
              style={[styles.msTxt, active && styles.msTxtActive]}
              numberOfLines={1}
            >
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

export default function NewTaskModal({ visible, onClose }) {
  const dispatch = useDispatch();

  // form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(null);
  const [projectId, setProjectId] = useState(null);
  const [assigned, setAssigned] = useState([]); // array of EMP-IDs
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [noDueDate, setNoDueDate] = useState(false);
  const [description, setDescription] = useState('');
  const [labelIds, setLabelIds] = useState([]); // numbers
  const [milestoneId, setMilestoneId] = useState(null);
  const [priority, setPriority] = useState(null); // LOW/MEDIUM/HIGH/URGENT
  const [isPrivate, setIsPrivate] = useState(false);
  const [timeEstimateMinutes, setTimeEstimateMinutes] = useState('');
  const [file, setFile] = useState(null);

  // dropdown data
  const [catOpts, setCatOpts] = useState([]);
  const [projOpts, setProjOpts] = useState([]);
  const [empOpts, setEmpOpts] = useState([]);
  const [labelOpts, setLabelOpts] = useState([]);
  const [msOpts, setMsOpts] = useState([]);

  // load base lists
  useEffect(() => {
    if (!visible) return;
    (async () => {
      try {
        const [cats, projs, emps] = await Promise.all([
          taskCategoriesAPI.list(),
          allProjectsAPI.list(),
          employeesAPI.listAll(0, 100),
        ]);
        setCatOpts((cats || []).map(c => ({ label: c.name, value: c.id })));
        setProjOpts((projs || []).map(p => ({ label: p.name, value: p.id })));
        setEmpOpts(
          (emps || []).map(e => ({
            label: `${e.name} (${e.employeeId})`,
            value: e.employeeId,
          })),
        );
      } catch {}
    })();
  }, [visible]);

  // project dependent: labels + milestones
  useEffect(() => {
    if (!projectId) {
      setLabelOpts([]);
      setMsOpts([]);
      return;
    }
    (async () => {
      try {
        const [labels, milestones] = await Promise.all([
          projectLabelsAPI.list(projectId),
          projectMilestonesAPI.list(projectId),
        ]);
        setLabelOpts((labels || []).map(l => ({ label: l.name, value: l.id })));
        setMsOpts(
          (milestones || []).map(m => ({ label: m.title, value: m.id })),
        );
      } catch {}
    })();
  }, [projectId]);

  const pickFile = async () => {
    try {
      const res = await DocumentPicker.pickSingle();
      setFile({
        uri: res.uri,
        name: res.name,
        type: res.type || 'application/octet-stream',
      });
    } catch (e) {
      if (DocumentPicker.isCancel(e)) return;
    }
  };

  const canSubmit = useMemo(
    () => title.trim() && projectId && startDate && (dueDate || noDueDate),
    [title, projectId, startDate, dueDate, noDueDate],
  );

  const submit = () => {
    if (!canSubmit) return;

    const form = new FormData();
    form.append('title', title.trim());
    if (category) form.append('category', String(category));
    form.append('projectId', String(projectId));
    if (startDate) form.append('startDate', startDate); // YYYY-MM-DD
    if (dueDate) form.append('dueDate', dueDate);
    form.append('noDueDate', String(!!noDueDate));
    if (file) form.append('taskFile', file);
    if (assigned.length)
      form.append('assignedEmployeeIds', JSON.stringify(assigned));
    if (description) form.append('description', description);
    if (labelIds.length) form.append('labelIds', JSON.stringify(labelIds));
    if (milestoneId) form.append('milestoneId', String(milestoneId));
    if (priority) form.append('priority', priority);
    form.append('isPrivate', String(!!isPrivate));
    if (timeEstimateMinutes)
      form.append('timeEstimateMinutes', String(timeEstimateMinutes));

    dispatch(createTaskRequest(form));
    onClose?.();
    // optional: reset
    setTitle('');
    setCategory(null);
    setProjectId(null);
    setAssigned([]);
    setStartDate('');
    setDueDate('');
    setNoDueDate(false);
    setDescription('');
    setLabelIds([]);
    setMilestoneId(null);
    setPriority(null);
    setIsPrivate(false);
    setTimeEstimateMinutes('');
    setFile(null);
  };

  if (!visible) return null;

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.h2}>Add Task</Text>
            <Pressable onPress={onClose}>
              <Text style={{ fontWeight: '900' }}>✕</Text>
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={{ padding: 12 }}>
            {/* Task Information */}
            <Text style={styles.h3}>Task Information</Text>
            <Field label="Title *">
              <TextInput
                value={title}
                onChangeText={setTitle}
                style={styles.input}
                placeholder="--"
                placeholderTextColor="#9ca3af"
              />
            </Field>

            <Field label="Task Category">
              <Select
                value={category}
                onChange={setCategory}
                options={catOpts}
              />
            </Field>

            <Field label="Project *">
              <Select
                value={projectId}
                onChange={setProjectId}
                options={projOpts}
              />
            </Field>

            <Field label="Assigned To">
              <MultiSelect
                values={assigned}
                onChange={setAssigned}
                options={empOpts}
              />
            </Field>

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Field label="Start Date *" style={{ flex: 1 }}>
                <TextInput
                  value={startDate}
                  onChangeText={setStartDate}
                  style={styles.input}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#9ca3af"
                />
              </Field>
              <Field label="Due Date *" style={{ flex: 1 }}>
                <TextInput
                  value={dueDate}
                  onChangeText={setDueDate}
                  style={styles.input}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#9ca3af"
                />
              </Field>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 12,
              }}
            >
              <Pressable
                onPress={() => setNoDueDate(v => !v)}
                style={[styles.checkbox, noDueDate && styles.checkboxOn]}
              />
              <Text
                style={{ marginLeft: 8, color: '#111827', fontWeight: '800' }}
              >
                Without Due Date
              </Text>
            </View>

            <Field label="Description">
              <TextInput
                value={description}
                onChangeText={setDescription}
                style={[styles.input, { height: 90, textAlignVertical: 'top' }]}
                multiline
                placeholder="--"
                placeholderTextColor="#9ca3af"
              />
            </Field>

            {/* Other Details */}
            <Text style={styles.h3}>Other Details</Text>
            <Field label="Label">
              <MultiSelect
                values={labelIds}
                onChange={setLabelIds}
                options={labelOpts}
              />
            </Field>

            <Field label="Milestones">
              <Select
                value={milestoneId}
                onChange={setMilestoneId}
                options={msOpts}
              />
            </Field>

            <Field label="Priority">
              <Select
                value={priority}
                onChange={setPriority}
                options={[
                  { label: 'LOW', value: 'LOW' },
                  { label: 'MEDIUM', value: 'MEDIUM' },
                  { label: 'HIGH', value: 'HIGH' },
                  { label: 'URGENT', value: 'URGENT' },
                ]}
              />
            </Field>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 12,
              }}
            >
              <Pressable
                onPress={() => setIsPrivate(v => !v)}
                style={[styles.checkbox, isPrivate && styles.checkboxOn]}
              />
              <Text
                style={{ marginLeft: 8, color: '#111827', fontWeight: '800' }}
              >
                Private
              </Text>
            </View>

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Field label="Time Estimate (minutes)" style={{ flex: 1 }}>
                <TextInput
                  keyboardType="numeric"
                  value={timeEstimateMinutes}
                  onChangeText={setTimeEstimateMinutes}
                  style={styles.input}
                  placeholder="e.g. 480"
                  placeholderTextColor="#9ca3af"
                />
              </Field>
              <Field label="Add File" style={{ flex: 1 }}>
                <Pressable onPress={pickFile} style={styles.fileBox}>
                  <Text style={{ color: '#6b7280', fontWeight: '800' }}>
                    {file?.name || 'Choose a file'}
                  </Text>
                </Pressable>
              </Field>
            </View>

            {/* Actions */}
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 8 }}>
              <Pressable
                onPress={submit}
                disabled={!canSubmit}
                style={[styles.primaryBtn, !canSubmit && { opacity: 0.6 }]}
              >
                <Text style={styles.primaryTxt}>Save</Text>
              </Pressable>
              <Pressable onPress={onClose} style={styles.secondaryBtn}>
                <Text style={styles.secondaryTxt}>Cancel</Text>
              </Pressable>
            </View>
          </ScrollView>
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
    maxHeight: '92%',
  },
  header: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  h2: { fontSize: 18, fontWeight: '900', color: '#0b0b0c' },
  h3: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0b0b0c',
    marginTop: 6,
    marginBottom: 8,
  },

  label: { fontSize: 12, fontWeight: '800', color: '#374151', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menu: {
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  menuItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#f1f5f9',
  },

  msWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  msPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#f3f4f6',
  },
  msPillActive: { backgroundColor: '#111827' },
  msTxt: { color: '#111827', fontWeight: '900' },
  msTxtActive: { color: '#fff' },

  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 6,
    backgroundColor: '#fff',
  },
  checkboxOn: { backgroundColor: '#111827' },

  fileBox: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
  },

  primaryBtn: {
    backgroundColor: '#1d4ed8',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  primaryTxt: { color: '#fff', fontWeight: '900' },
  secondaryBtn: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  secondaryTxt: { color: '#111827', fontWeight: '900' },
});
