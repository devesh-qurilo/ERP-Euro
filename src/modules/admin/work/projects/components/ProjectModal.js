// ProjectModal.js (defensive & fixed)
import React, { useEffect, useMemo, useState } from 'react';
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
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Feather';
import { Picker } from '@react-native-picker/picker';

import {
  fetchProjectCategories,
  createProjectCategory,
  deleteProjectCategory,
} from '../store/actions';
import {
  selectAWPCategories,
  selectAWPCategoriesLoading,
} from '../store/selectors';

// selectors and actions for departments/clients/employees
import { selectDepartments } from '../../../hr/departments/store/selectors';
import { selectClients } from '../../../clients/store/selectors';
import { selectEmpList } from '../../../hr/employees/store/selectors';

import * as ClientsActions from '../../../clients/store/actions';
import { fetchEmployees } from '../../../hr/employees/store/actions';
import { FETCH_DEPT_REQ } from '../../../hr/departments/store/types';

export default function ProjectModal({
  visible,
  editing,
  onClose,
  onSave,
  busy = false,
}) {
  // defensive: early return if not visible
  if (!visible) return null;

  const dispatch = useDispatch();

  const categories = useSelector(selectAWPCategories) || [];
  const categoriesLoading = useSelector(selectAWPCategoriesLoading);

  const departments = useSelector(selectDepartments) || [];
  const clients = useSelector(selectClients) || [];
  const employees = useSelector(selectEmpList) || [];

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
          clientId: editing.clientId ? String(editing.clientId) : '',
          projectSummary: editing.summary || '',
          tasksNeedAdminApproval: !!editing.tasksNeedAdminApproval,
          currency: editing.currency || 'USD',
          projectBudget: editing.budget?.toString() ?? '',
          hoursEstimate: editing.hoursEstimate?.toString() ?? '',
          allowManualTimeLogs: !!editing.allowManualTimeLogs,
          assignedEmployeeIds: (editing.assignedEmployeeIds || []).map(String),
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
          assignedEmployeeIds: [],
          companyFile: null,
        },
  );

  // fetch only when modal opens AND lists are empty
  useEffect(() => {
    // always fetch categories
    dispatch(fetchProjectCategories());

    if (!clients || clients.length === 0) {
      dispatch(ClientsActions.list({}));
    }
    if (!employees || employees.length === 0) {
      dispatch(fetchEmployees({}));
    }
    if (!departments || departments.length === 0) {
      // if departments action creator exists in your project replace with that
      dispatch({ type: FETCH_DEPT_REQ });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  useEffect(() => {
    if (editing) {
      setV(prev => ({
        ...prev,
        shortCode: editing.shortCode || prev.shortCode,
        projectName: editing.name || prev.projectName,
        startDate: editing.startDate || prev.startDate,
        deadline: editing.deadline || prev.deadline,
        noDeadline: !!editing.noDeadline,
        projectCategory: editing.category || prev.projectCategory,
        departmentId: String(editing.departmentId ?? prev.departmentId),
        clientId: editing.clientId ? String(editing.clientId) : prev.clientId,
        projectSummary: editing.summary || prev.projectSummary,
        tasksNeedAdminApproval: !!editing.tasksNeedAdminApproval,
        currency: editing.currency || prev.currency,
        projectBudget: editing.budget?.toString() ?? prev.projectBudget,
        hoursEstimate: editing.hoursEstimate?.toString() ?? prev.hoursEstimate,
        allowManualTimeLogs: !!editing.allowManualTimeLogs,
        assignedEmployeeIds: (editing.assignedEmployeeIds || []).map(String),
      }));
    }
  }, [editing]);

  const patch = (k, val) => setV(s => ({ ...s, [k]: val }));

  const disabled = useMemo(() => {
    return (
      !v.shortCode ||
      !v.projectName ||
      !v.startDate ||
      (!v.noDeadline && !v.deadline)
    );
  }, [v]);

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showDeadlinePicker, setShowDeadlinePicker] = useState(false);

  function onStartDateChange(event, selectedDate) {
    if (Platform.OS !== 'ios') setShowStartPicker(false);
    if (selectedDate) {
      const iso = selectedDate.toISOString().slice(0, 10);
      patch('startDate', iso);
    }
  }
  function onDeadlineChange(event, selectedDate) {
    if (Platform.OS !== 'ios') setShowDeadlinePicker(false);
    if (selectedDate) {
      const iso = selectedDate.toISOString().slice(0, 10);
      patch('deadline', iso);
    }
  }

  // categories mgmt
  const [manageCatOpen, setManageCatOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');

  function handleAddCategory() {
    if (!newCatName.trim()) return Alert.alert('Enter category name');
    dispatch(createProjectCategory({ name: newCatName.trim() }));
    setNewCatName('');
  }
  function handleDeleteCategory(id) {
    Alert.alert('Delete', 'Delete this category?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => dispatch(deleteProjectCategory(id)),
      },
    ]);
  }

  // members modal
  const [membersModalOpen, setMembersModalOpen] = useState(false);
  function toggleMember(id) {
    setV(prev => {
      const ids = new Set(prev.assignedEmployeeIds.map(String));
      if (ids.has(String(id))) ids.delete(String(id));
      else ids.add(String(id));
      return { ...prev, assignedEmployeeIds: Array.from(ids) };
    });
  }

  function handleSave() {
    const payload = {
      shortCode: v.shortCode,
      name: v.projectName,
      startDate: v.startDate,
      deadline: v.noDeadline ? null : v.deadline,
      noDeadline: !!v.noDeadline,
      category: v.projectCategory,
      departmentId: v.departmentId ? Number(v.departmentId) : null,
      clientId: v.clientId ? Number(v.clientId) : null,
      summary: v.projectSummary,
      tasksNeedAdminApproval: !!v.tasksNeedAdminApproval,
      currency: v.currency,
      budget: v.projectBudget === '' ? null : Number(v.projectBudget),
      hoursEstimate: v.hoursEstimate === '' ? null : Number(v.hoursEstimate),
      allowManualTimeLogs: !!v.allowManualTimeLogs,
      assignedEmployeeIds: (v.assignedEmployeeIds || []).map(id => Number(id)),
    };
    onSave?.(payload);
  }

  const currencies = ['USD', 'INR', 'EUR', 'GBP', 'AED'];

  return (
    <Modal
      visible={true}
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

          <ScrollView
            contentContainerStyle={styles.formWrap}
            keyboardShouldPersistTaps="handled"
          >
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

              {/* Start Date */}
              <View style={styles.field}>
                <Text style={styles.label}>Start Date</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <TextInput
                    value={v.startDate}
                    placeholder="YYYY-MM-DD"
                    onChangeText={t => patch('startDate', t)}
                    style={[styles.input, { flex: 1 }]}
                  />
                  <TouchableOpacity
                    onPress={() => setShowStartPicker(true)}
                    style={{ marginLeft: 8 }}
                  >
                    <Icon name="calendar" size={20} />
                  </TouchableOpacity>
                </View>
                {showStartPicker && (
                  <DateTimePicker
                    value={v.startDate ? new Date(v.startDate) : new Date()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'inline' : 'default'}
                    onChange={onStartDateChange}
                  />
                )}
              </View>

              {/* Deadline */}
              {!v.noDeadline && (
                <View style={styles.field}>
                  <Text style={styles.label}>Deadline</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TextInput
                      value={v.deadline}
                      placeholder="YYYY-MM-DD"
                      onChangeText={t => patch('deadline', t)}
                      style={[styles.input, { flex: 1 }]}
                    />
                    <TouchableOpacity
                      onPress={() => setShowDeadlinePicker(true)}
                      style={{ marginLeft: 8 }}
                    >
                      <Icon name="calendar" size={20} />
                    </TouchableOpacity>
                  </View>
                  {showDeadlinePicker && (
                    <DateTimePicker
                      value={v.deadline ? new Date(v.deadline) : new Date()}
                      mode="date"
                      display={Platform.OS === 'ios' ? 'inline' : 'default'}
                      onChange={onDeadlineChange}
                    />
                  )}
                </View>
              )}

              <Toggle
                label="No Deadline"
                value={v.noDeadline}
                onChange={val => patch('noDeadline', val)}
              />

              {/* Category */}
              <View style={styles.field}>
                <Text style={styles.label}>Project Category</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View
                    style={{
                      flex: 1,
                      borderWidth: 1,
                      borderColor: '#e5e7eb',
                      borderRadius: 8,
                      overflow: 'hidden',
                    }}
                  >
                    {categoriesLoading ? (
                      <View style={{ padding: 12, alignItems: 'center' }}>
                        <ActivityIndicator />
                      </View>
                    ) : (
                      <Picker
                        selectedValue={v.projectCategory || ''}
                        onValueChange={val => patch('projectCategory', val)}
                      >
                        <Picker.Item label="Select category" value="" />
                        {(categories || []).map(c => (
                          <Picker.Item
                            key={c.id}
                            label={c.name || c.categoryName}
                            value={c.name || c.categoryName}
                          />
                        ))}
                      </Picker>
                    )}
                  </View>
                  <TouchableOpacity
                    onPress={() => setManageCatOpen(true)}
                    style={{
                      marginLeft: 8,
                      padding: 8,
                      borderWidth: 1,
                      borderColor: '#e5e7eb',
                      borderRadius: 8,
                    }}
                  >
                    <Icon name="plus" size={16} />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Department */}
              <View style={styles.field}>
                <Text style={styles.label}>Department</Text>
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: '#e5e7eb',
                    borderRadius: 8,
                    overflow: 'hidden',
                  }}
                >
                  <Picker
                    selectedValue={v.departmentId || ''}
                    onValueChange={val => patch('departmentId', val)}
                  >
                    <Picker.Item label="Select department" value="" />
                    {(departments || []).map(d => (
                      <Picker.Item
                        key={d.id}
                        label={d.name || d.departmentName}
                        value={String(d.id)}
                      />
                    ))}
                  </Picker>
                </View>
              </View>

              {/* Client */}
              <View style={styles.field}>
                <Text style={styles.label}>Client</Text>
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: '#e5e7eb',
                    borderRadius: 8,
                    overflow: 'hidden',
                  }}
                >
                  <Picker
                    selectedValue={v.clientId || ''}
                    onValueChange={val => patch('clientId', val)}
                  >
                    <Picker.Item label="Select client" value="" />
                    {(clients || []).map(c => (
                      <Picker.Item
                        key={c.id}
                        label={c.name || c.company?.companyName}
                        value={String(c.id)}
                      />
                    ))}
                  </Picker>
                </View>
              </View>

              {/* Members */}
              <View style={styles.field}>
                <Text style={styles.label}>Members</Text>
                <TouchableOpacity
                  onPress={() => setMembersModalOpen(true)}
                  style={[styles.input, { justifyContent: 'center' }]}
                >
                  <Text>
                    {v.assignedEmployeeIds.length
                      ? `${v.assignedEmployeeIds.length} selected`
                      : 'Select members'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Currency */}
              <View style={styles.field}>
                <Text style={styles.label}>Currency</Text>
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: '#e5e7eb',
                    borderRadius: 8,
                    overflow: 'hidden',
                  }}
                >
                  <Picker
                    selectedValue={v.currency}
                    onValueChange={val => patch('currency', val)}
                  >
                    {currencies.map(cur => (
                      <Picker.Item key={cur} label={cur} value={cur} />
                    ))}
                  </Picker>
                </View>
              </View>

              <Field
                label="Summary"
                value={v.projectSummary}
                onChange={t => patch('projectSummary', t)}
                multiline
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
            </View>
          </ScrollView>

          {/* Actions */}
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

      {/* Manage Category Modal */}
      <Modal
        visible={manageCatOpen}
        animationType="slide"
        onRequestClose={() => setManageCatOpen(false)}
      >
        <View style={{ padding: 16, flex: 1, backgroundColor: '#fff' }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: '700' }}>
              Manage Project Categories
            </Text>
            <TouchableOpacity onPress={() => setManageCatOpen(false)}>
              <Text>Close</Text>
            </TouchableOpacity>
          </View>

          <View style={{ marginTop: 12 }}>
            <Text style={{ marginBottom: 6 }}>Add new category</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TextInput
                value={newCatName}
                onChangeText={setNewCatName}
                placeholder="Category name"
                style={{
                  flex: 1,
                  borderWidth: 1,
                  borderColor: '#e5e7eb',
                  borderRadius: 8,
                  padding: 8,
                }}
              />
              <TouchableOpacity
                onPress={handleAddCategory}
                style={{
                  marginLeft: 8,
                  padding: 10,
                  backgroundColor: '#111827',
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: '#fff' }}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ marginTop: 16, flex: 1 }}>
            <Text style={{ fontWeight: '700', marginBottom: 8 }}>Existing</Text>
            {categoriesLoading ? (
              <ActivityIndicator />
            ) : (
              <FlatList
                data={categories}
                keyExtractor={item => String(item.id)}
                renderItem={({ item }) => (
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingVertical: 10,
                    }}
                  >
                    <Text>{item.name || item.categoryName}</Text>
                    <View
                      style={{ flexDirection: 'row', alignItems: 'center' }}
                    >
                      <TouchableOpacity
                        onPress={() =>
                          setV(prev => ({
                            ...prev,
                            projectCategory: item.name || item.categoryName,
                          }))
                        }
                      >
                        <Text style={{ color: '#2563eb', marginRight: 12 }}>
                          Use
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleDeleteCategory(item.id)}
                      >
                        <Text style={{ color: '#dc2626' }}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              />
            )}
          </View>
        </View>
      </Modal>

      {/* Members modal */}
      <Modal
        visible={membersModalOpen}
        animationType="slide"
        onRequestClose={() => setMembersModalOpen(false)}
      >
        <View style={{ padding: 16, flex: 1, backgroundColor: '#fff' }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: '700' }}>
              Select Members
            </Text>
            <TouchableOpacity onPress={() => setMembersModalOpen(false)}>
              <Text>Close</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={employees}
            keyExtractor={item => String(item.id)}
            renderItem={({ item }) => {
              const checked = v.assignedEmployeeIds.includes(String(item.id));
              return (
                <TouchableOpacity
                  onPress={() => toggleMember(item.id)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingVertical: 10,
                  }}
                >
                  <View>
                    <Text style={{ fontWeight: '700' }}>
                      {item.name ||
                        `${item.firstName || ''} ${item.lastName || ''}`}
                    </Text>
                    <Text style={{ color: '#6b7280' }}>
                      {item.designation || item.email || ''}
                    </Text>
                  </View>
                  <View
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 6,
                      borderWidth: 1,
                      borderColor: '#e5e7eb',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {checked ? <Icon name="check" size={16} /> : null}
                  </View>
                </TouchableOpacity>
              );
            }}
          />

          <View
            style={{
              marginTop: 12,
              flexDirection: 'row',
              justifyContent: 'flex-end',
            }}
          >
            <TouchableOpacity
              onPress={() => setMembersModalOpen(false)}
              style={{
                padding: 12,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: '#e5e7eb',
              }}
            >
              <Text>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Modal>
  );
}

/* helper components Field & Toggle (unchanged) */
function Field({
  label,
  value,
  onChange,
  multiline = false,
  full = false,
  keyboardType = 'default',
}) {
  return (
    <View style={[styles.field, full && { flexBasis: '100%' }]}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={String(value ?? '')}
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
    maxHeight: '90%',
  },
  title: { fontSize: 18, fontWeight: '900', marginBottom: 8, color: '#0b0b0c' },
  formWrap: { paddingBottom: 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', columnGap: 10, rowGap: 10 },
  field: { flexGrow: 1, flexBasis: '48%', minWidth: 240 },
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
