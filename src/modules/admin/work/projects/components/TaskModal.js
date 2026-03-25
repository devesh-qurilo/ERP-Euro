import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Modal,
  ScrollView,
  Pressable,
  Platform,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import DateTimePicker from '@react-native-community/datetimepicker';
import ModalSelector from 'react-native-modal-selector';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import {
  fetchCategories,
  fetchProjects,
  fetchTaskStages,
  fetchEmployees,
  fetchMilestones,
  fetchLabels,
  createTask,
  updateTask,
} from '../../tasks/components/tasks.api';

import { pickSingleDoc } from '../../../../../utils/filePickers';
import CategoryManageModal from '../../tasks/components/CategoryManageModal';
import LabelManageModal from '../../tasks/components/LabelManageModal';

//////////////////////////////////////////////////////////////////////////////////////////
// SIMPLE FIELD
//////////////////////////////////////////////////////////////////////////////////////////
const Field = ({ label, icon, value, onChange, placeholder }) => (
  <View style={{ marginBottom: 18 }}>
    <Text style={{ fontSize: 14, fontWeight: '600', marginBottom: 6 }}>
      {label}
    </Text>

    <View
      style={{
        flexDirection: 'row',
        padding: 10,
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 8,
        alignItems: 'center',
      }}
    >
      {icon && (
        <Feather
          name={icon}
          size={18}
          color="#6b7280"
          style={{ marginRight: 6 }}
        />
      )}
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        style={{ flex: 1, color: '#111827' }}
      />
    </View>
  </View>
);

//////////////////////////////////////////////////////////////////////////////////////////
// TOGGLE ROW
//////////////////////////////////////////////////////////////////////////////////////////
const ToggleRow = ({ label, value, onChange }) => {
  const active = value === 'true';

  return (
    <Pressable
      onPress={() => onChange(active ? 'false' : 'true')}
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        marginBottom: 14,
        alignItems: 'center',
      }}
    >
      <Text style={{ fontSize: 14 }}>{label}</Text>
      <View
        style={{
          width: 42,
          height: 24,
          borderRadius: 12,
          backgroundColor: active ? '#4f46e5' : '#d1d5db',
          justifyContent: 'center',
          paddingHorizontal: 3,
        }}
      >
        <View
          style={{
            width: 18,
            height: 18,
            borderRadius: 9,
            backgroundColor: '#fff',
            marginLeft: active ? 18 : 0,
          }}
        />
      </View>
    </Pressable>
  );
};

//////////////////////////////////////////////////////////////////////////////////////////
// MULTI SELECT CUSTOM SHEET (Option B)
//////////////////////////////////////////////////////////////////////////////////////////
const MultiSelectSheet = ({ title, data, values, onChange }) => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Pressable
        onPress={() => setVisible(true)}
        style={{
          borderWidth: 1,
          borderColor: '#d1d5db',
          padding: 12,
          borderRadius: 8,
          marginBottom: 18,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <Text style={{ color: '#111827', fontWeight: '600' }}>{title}</Text>
        <Feather name="chevron-down" size={16} color="#6b7280" />
      </Pressable>

      <Modal visible={visible} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.45)',
            justifyContent: 'center',
            padding: 18,
          }}
        >
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 12,
              padding: 16,
              maxHeight: '80%',
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 10 }}>
              {title}
            </Text>

            <ScrollView>
              {data.map(item => {
                const id = String(item.value);
                const checked = values.includes(id);

                return (
                  <Pressable
                    key={id}
                    onPress={() => {
                      if (checked) {
                        onChange(values.filter(v => v !== id));
                      } else {
                        onChange([...values, id]);
                      }
                    }}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingVertical: 10,
                    }}
                  >
                    <View
                      style={{
                        height: 20,
                        width: 20,
                        borderRadius: 4,
                        borderWidth: 1,
                        borderColor: '#6b7280',
                        marginRight: 12,
                        backgroundColor: checked ? '#4f46e5' : '#fff',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      {checked && (
                        <Feather name="check" size={14} color="#fff" />
                      )}
                    </View>

                    <Text>{item.label}</Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            <Pressable
              onPress={() => setVisible(false)}
              style={{
                backgroundColor: '#4f46e5',
                padding: 12,
                borderRadius: 8,
                marginTop: 4,
              }}
            >
              <Text
                style={{
                  color: '#fff',
                  textAlign: 'center',
                  fontWeight: '600',
                }}
              >
                Done
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
};

//////////////////////////////////////////////////////////////////////////////////////////
// MAIN COMPONENT
//////////////////////////////////////////////////////////////////////////////////////////

export default function TaskModal({
  modal,
  onClose,
  onSubmit,
  fixedProjectId = null,
  projectMembers = null,
}) {
  const visible = modal?.visible;
  const mode = modal?.mode || 'add';
  const rec = modal?.record || null;

  const recKey = useMemo(() => (rec?.id ? String(rec.id) : 'new'), [rec?.id]);

  const [form, setForm] = useState({
    title: '',
    category: '',
    startDate: '',
    dueDate: '',
    noDueDate: 'false',
    taskStageId: '',
    assignedEmployeeIds: [],
    description: '',
    labelIds: [],
    milestoneId: '',
    priority: 'LOW',
    isPrivate: 'false',
    timeEstimateMinutes: '',
    isDependent: 'false',
    projectId: fixedProjectId ? String(fixedProjectId) : '',
  });

  const [taskFile, setTaskFile] = useState(null);

  // API lists
  const [categories, setCategories] = useState([]);
  const [projects, setProjects] = useState([]);
  const [stages, setStages] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [labels, setLabels] = useState([]);
  const [categoryModal, setCategoryModal] = useState(false);
  const [labelModal, setLabelModal] = useState(false);

  // date pickers
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showDuePicker, setShowDuePicker] = useState(false);

  const formatDate = d => {
    const dt = new Date(d);
    const m = String(dt.getMonth() + 1).padStart(2, '0');
    const dd = String(dt.getDate()).padStart(2, '0');
    return `${dt.getFullYear()}-${m}-${dd}`;
  };

  useEffect(() => {
    if (!visible) return;

    fetchCategories().then(setCategories).catch(console.log);
    fetchProjects().then(setProjects).catch(console.log);
    fetchTaskStages().then(setStages).catch(console.log);

    if (Array.isArray(projectMembers) && projectMembers.length) {
      setEmployees(
        projectMembers.map(e => ({
          employeeId: e.employeeId,
          name: e.name,
        })),
      );
    } else {
      fetchEmployees().then(setEmployees);
    }
  }, [visible, projectMembers]);

  ////////////////////////////////////////////////////////////////////////////
  // LOAD DYNAMIC LISTS WHEN PROJECT CHANGES
  ////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    if (form.projectId) {
      fetchMilestones(form.projectId).then(setMilestones).catch(console.log);
      fetchLabels(form.projectId).then(setLabels).catch(console.log);
    } else {
      setMilestones([]);
      setLabels([]);
    }
  }, [form.projectId]);

  ////////////////////////////////////////////////////////////////////////////
  // SET EDIT MODE DATA
  ////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    if (!visible) return;

    if (mode === 'edit' && rec) {
      setForm({
        title: rec.title || '',
        category: rec.categoryId?.id ? String(rec.categoryId.id) : '',
        startDate: rec.startDate || '',
        dueDate: rec.dueDate || '',
        noDueDate: String(rec.noDueDate),
        taskStageId: String(rec.taskStageId || ''),
        assignedEmployeeIds: rec.assignedEmployeeIds || [],
        description: rec.description || '',
        labelIds: (rec.labels || []).map(l => String(l.id)),
        milestoneId: rec.milestoneId ? String(rec.milestoneId) : '',
        priority: rec.priority || 'LOW',
        isPrivate: String(rec.isPrivate),
        timeEstimateMinutes: rec.timeEstimateMinutes
          ? String(rec.timeEstimateMinutes)
          : '',
        isDependent: String(rec.isDependent),
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
        assignedEmployeeIds: [],
        description: '',
        labelIds: [],
        milestoneId: '',
        priority: 'LOW',
        isPrivate: 'false',
        timeEstimateMinutes: '',
        isDependent: 'false',
        projectId: fixedProjectId ? String(fixedProjectId) : '',
      });
    }

    setTaskFile(null);
  }, [visible, recKey]);

  ////////////////////////////////////////////////////////////////////////////
  // FILE PICK
  ////////////////////////////////////////////////////////////////////////////
  const pickFile = async () => {
    const f = await pickSingleDoc({
      type: ['image/*', 'application/pdf'],
    });
    if (f) setTaskFile(f);
  };

  ////////////////////////////////////////////////////////////////////////////
  // SUBMIT
  ////////////////////////////////////////////////////////////////////////////
  const submit = () => {
    const payload = { ...form };

    payload.noDueDate = payload.noDueDate === 'true';
    payload.isPrivate = payload.isPrivate === 'true';
    payload.isDependent = payload.isDependent === 'true';

    if (taskFile) payload.taskFile = taskFile;

    if (mode === 'add') {
      createTask(payload)
        .then(() => onSubmit?.(payload))
        .catch(console.log);
    } else {
      updateTask(rec.id, payload)
        .then(() => onSubmit?.(payload))
        .catch(console.log);
    }

    onClose();
  };

  if (!visible) return null;

  ////////////////////////////////////////////////////////////////////////////
  // UI START
  ////////////////////////////////////////////////////////////////////////////

  return (
    <Modal visible transparent animationType="fade">
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'flex-start',
          backgroundColor: 'rgba(0,0,0,0.35)',
          padding: 18,
          marginTop: 40,
        }}
      >
        <View
          style={{
            backgroundColor: '#fff',
            borderRadius: 14,
            padding: 16,
            maxHeight: '92%',
          }}
        >
          {/* HEADER */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 12,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: '700' }}>
              {mode === 'add' ? 'Add Task' : 'Edit Task'}
            </Text>

            <Pressable onPress={onClose}>
              <Feather name="x" size={22} color="#111827" />
            </Pressable>
          </View>

          {/* FORM */}
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Title */}
            <Field
              label="Title"
              icon="file-text"
              value={form.title}
              placeholder="Task title"
              onChange={v => setForm({ ...form, title: v })}
            />

            {/* Category */}

            <View style={{ marginBottom: 18 }}>
              <Text style={{ fontWeight: '600', marginBottom: 6 }}>
                Category
              </Text>

              <View style={{ flexDirection: 'row', gap: 8 }}>
                <ModalSelector
                  data={categories.map(c => ({
                    key: c.id,
                    label: c.name,
                    value: String(c.id),
                  }))}
                  initValue={
                    categories.find(c => String(c.id) === form.category)
                      ?.name || 'Select Category'
                  }
                  onChange={opt =>
                    setForm({ ...form, category: String(opt.value) })
                  }
                  style={{ flex: 1 }}
                >
                  <View
                    style={{
                      flex: 1,
                      borderWidth: 1,
                      borderColor: '#d1d5db',
                      paddingVertical: 12,
                      paddingHorizontal: 12,
                      borderRadius: 8,
                      backgroundColor: '#fff',
                      justifyContent: 'center',
                    }}
                  >
                    <Text>
                      {categories.find(c => String(c.id) === form.category)
                        ?.name || 'Select Category'}
                    </Text>
                  </View>
                </ModalSelector>

                {/* MANAGE BUTTON */}
                <Pressable
                  onPress={() => setCategoryModal(true)}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: '#d1d5db',
                    backgroundColor: '#f9fafb',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Feather name="settings" size={18} color="#4f46e5" />
                </Pressable>
              </View>
            </View>

            {/* Project */}
            <Text style={{ fontWeight: '600', marginBottom: 4 }}>Project</Text>

            {fixedProjectId ? (
              <View
                style={{
                  borderWidth: 1,
                  borderColor: '#d1d5db',
                  padding: 12,
                  borderRadius: 8,
                  marginBottom: 18,
                  backgroundColor: '#f3f4f6',
                }}
              >
                <Text>
                  {projects.find(p => String(p.id) === String(fixedProjectId))
                    ?.name || 'Selected Project'}
                </Text>
              </View>
            ) : (
              <ModalSelector
                data={projects.map(p => ({
                  key: p.id,
                  label: p.name,
                  value: String(p.id),
                }))}
                initValue={
                  projects.find(p => String(p.id) === form.projectId)?.name ||
                  'Select Project'
                }
                onChange={opt =>
                  setForm({ ...form, projectId: String(opt.value) })
                }
              >
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: '#d1d5db',
                    padding: 12,
                    borderRadius: 8,
                    marginBottom: 18,
                  }}
                >
                  <Text>
                    {projects.find(p => String(p.id) === form.projectId)
                      ?.name || 'Select Project'}
                  </Text>
                </View>
              </ModalSelector>
            )}

            {/* Milestone */}
            <Text style={{ fontWeight: '600', marginBottom: 4 }}>
              Milestone
            </Text>
            <ModalSelector
              data={milestones.map(m => ({
                key: m.id,
                label: m.title,
                value: String(m.id),
              }))}
              initValue={
                milestones.find(m => String(m.id) === form.milestoneId)
                  ?.title || 'Select Milestone'
              }
              onChange={opt =>
                setForm({ ...form, milestoneId: String(opt.value) })
              }
            >
              <View
                style={{
                  borderWidth: 1,
                  borderColor: '#d1d5db',
                  padding: 12,
                  borderRadius: 8,
                  marginBottom: 18,
                }}
              >
                <Text>
                  {milestones.find(m => String(m.id) === form.milestoneId)
                    ?.title || 'Select Milestone'}
                </Text>
              </View>
            </ModalSelector>

            {/* Task Stage */}
            <Text style={{ fontWeight: '600', marginBottom: 4 }}>
              Task Stage
            </Text>
            <ModalSelector
              data={stages.map(s => ({
                key: s.id,
                label: s.name,
                value: String(s.id),
              }))}
              initValue={
                stages.find(s => String(s.id) === form.taskStageId)?.name ||
                'Select Stage'
              }
              onChange={opt =>
                setForm({ ...form, taskStageId: String(opt.value) })
              }
            >
              <View
                style={{
                  borderWidth: 1,
                  borderColor: '#d1d5db',
                  padding: 12,
                  borderRadius: 8,
                  marginBottom: 18,
                }}
              >
                <Text>
                  {stages.find(s => String(s.id) === form.taskStageId)?.name ||
                    'Select Stage'}
                </Text>
              </View>
            </ModalSelector>

            {/* Priority */}
            <Text style={{ fontWeight: '600', marginBottom: 4 }}>Priority</Text>
            <ModalSelector
              data={[
                { key: 'LOW', label: 'Low', value: 'LOW' },
                { key: 'MEDIUM', label: 'Medium', value: 'MEDIUM' },
                { key: 'HIGH', label: 'High', value: 'HIGH' },
              ]}
              initValue={form.priority || 'Select Priority'}
              onChange={opt =>
                setForm({ ...form, priority: String(opt.value) })
              }
            >
              <View
                style={{
                  borderWidth: 1,
                  borderColor: '#d1d5db',
                  padding: 12,
                  borderRadius: 8,
                  marginBottom: 18,
                }}
              >
                <Text>{form.priority || 'Select Priority'}</Text>
              </View>
            </ModalSelector>

            {/* Assigned Employees */}
            <MultiSelectSheet
              title="Assign Employees"
              data={employees.map(e => ({
                label: e.name,
                value: e.employeeId,
              }))}
              values={form.assignedEmployeeIds}
              onChange={vals => setForm({ ...form, assignedEmployeeIds: vals })}
            />

            <View style={{ marginBottom: 18 }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: 6,
                }}
              >
                <Text style={{ fontWeight: '600' }}>Labels</Text>

                <Pressable
                  onPress={() => {
                    if (!form.projectId) {
                      alert('Select project first');
                      return;
                    }
                    setLabelModal(true);
                  }}
                >
                  <Feather name="plus-circle" size={18} color="#4f46e5" />
                </Pressable>
              </View>

              <MultiSelectSheet
                title="Select Labels"
                data={labels.map(l => ({
                  label: l.name,
                  value: String(l.id),
                }))}
                values={form.labelIds}
                onChange={vals => setForm({ ...form, labelIds: vals })}
              />
            </View>

            {/* Start Date */}
            <Text style={{ fontWeight: '600', marginBottom: 4 }}>
              Start Date
            </Text>

            <Pressable
              onPress={() => setShowStartPicker(true)}
              style={{
                borderWidth: 1,
                borderColor: '#d1d5db',
                padding: 12,
                borderRadius: 8,
                marginBottom: 18,
              }}
            >
              <Text>{form.startDate || 'Select Start Date'}</Text>
            </Pressable>

            {showStartPicker && (
              <DateTimePicker
                value={form.startDate ? new Date(form.startDate) : new Date()}
                mode="date"
                display="default"
                onChange={(_, d) => {
                  if (Platform.OS === 'android') setShowStartPicker(false);
                  if (d) setForm({ ...form, startDate: formatDate(d) });
                }}
              />
            )}

            {/* Due Date */}
            <Text style={{ fontWeight: '600', marginBottom: 4 }}>Due Date</Text>

            <ToggleRow
              label="No Due Date"
              value={form.noDueDate}
              onChange={v =>
                setForm({
                  ...form,
                  noDueDate: v,
                  dueDate: v === 'true' ? '' : form.dueDate,
                })
              }
            />

            {form.noDueDate === 'false' && (
              <>
                <Pressable
                  onPress={() => setShowDuePicker(true)}
                  style={{
                    borderWidth: 1,
                    borderColor: '#d1d5db',
                    padding: 12,
                    borderRadius: 8,
                    marginBottom: 18,
                  }}
                >
                  <Text>{form.dueDate || 'Select Due Date'}</Text>
                </Pressable>

                {showDuePicker && (
                  <DateTimePicker
                    value={form.dueDate ? new Date(form.dueDate) : new Date()}
                    mode="date"
                    display="default"
                    onChange={(_, d) => {
                      if (Platform.OS === 'android') setShowDuePicker(false);
                      if (d) setForm({ ...form, dueDate: formatDate(d) });
                    }}
                  />
                )}
              </>
            )}

            {/* Description */}
            <Field
              label="Description"
              icon="align-left"
              value={form.description}
              placeholder="Description"
              onChange={v => setForm({ ...form, description: v })}
            />

            {/* Time Estimate */}
            <Field
              label="Time Estimate (minutes)"
              icon="clock"
              value={form.timeEstimateMinutes}
              placeholder="e.g. 480"
              onChange={v =>
                setForm({
                  ...form,
                  timeEstimateMinutes: v.replace(/[^0-9]/g, ''),
                })
              }
            />

            {/* Toggles */}
            <ToggleRow
              label="Private Task"
              value={form.isPrivate}
              onChange={v => setForm({ ...form, isPrivate: v })}
            />

            <ToggleRow
              label="Dependent Task"
              value={form.isDependent}
              onChange={v => setForm({ ...form, isDependent: v })}
            />

            {/* File Picker */}
            <Pressable
              onPress={pickFile}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: '#d1d5db',
                padding: 12,
                borderRadius: 8,
                marginBottom: 22,
              }}
            >
              <Feather name="upload" size={20} color="#4f46e5" />
              <Text style={{ marginLeft: 10 }}>
                {taskFile ? taskFile.name : 'Attach File'}
              </Text>
            </Pressable>
          </ScrollView>

          {/* FOOTER */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              marginTop: 6,
            }}
          >
            <Pressable
              onPress={onClose}
              style={{ paddingVertical: 10, paddingHorizontal: 16 }}
            >
              <Text style={{ fontWeight: '600' }}>Cancel</Text>
            </Pressable>

            <Pressable
              onPress={submit}
              style={{
                paddingVertical: 10,
                paddingHorizontal: 16,
                backgroundColor: '#4f46e5',
                borderRadius: 8,
                marginLeft: 6,
              }}
            >
              <Text
                style={{
                  color: '#fff',
                  fontWeight: '700',
                  textAlign: 'center',
                }}
              >
                Save
              </Text>
            </Pressable>
          </View>
          <CategoryManageModal
            visible={categoryModal}
            onClose={() => setCategoryModal(false)}
            onRefresh={() => fetchCategories().then(setCategories)}
          />

          <LabelManageModal
            visible={labelModal}
            projectId={form.projectId}
            onClose={() => setLabelModal(false)}
            onSuccess={async result => {
              // 🔁 always refresh labels
              const fresh = await fetchLabels(form.projectId);
              setLabels(fresh);

              // ✅ auto-select new label
              if (result?.id) {
                setForm(f => ({
                  ...f,
                  labelIds: [...new Set([...f.labelIds, String(result.id)])],
                }));
              }
            }}
          />
        </View>
      </KeyboardAwareScrollView>
    </Modal>
  );
}
