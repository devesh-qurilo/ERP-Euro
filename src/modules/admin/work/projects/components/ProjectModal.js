// src/modules/admin/work/projects/components/ProjectModal.js
import React, { useEffect, useMemo, useRef, useState } from 'react';
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
// import { launchImageLibrary } from 'react-native-image-picker';
import { pickImageOrDoc } from '../../../clients/components/fileHelpers';

import {
  fetchProjectCategories,
  createProjectCategory,
  deleteProjectCategory,
} from '../store/actions';
import {
  selectAWPCategories,
  selectAWPCategoriesLoading,
} from '../store/selectors';

import { selectDepartments } from '../../../hr/departments/store/selectors';
import { selectClients } from '../../../clients/store/selectors';
import { selectEmpList } from '../../../hr/employees/store/selectors';

import * as ClientsActions from '../../../clients/store/actions';
import { fetchEmployees } from '../../../hr/employees/store/actions';
import { FETCH_DEPT_REQ } from '../../../hr/departments/store/types';

/**
 * Helper: stable employee key used across UI and payload
 * Priority:
 *  - employee.employeeId (e.g. "EMP-015")
 *  - employee.employee_id
 *  - employee.employeeID
 *  - String(employee.id)
 */
function empKeyOf(emp) {
  if (!emp) return '';
  return (
    emp.employeeId ?? emp.employee_id ?? emp.employeeID ?? String(emp.id ?? '')
  );
}

export default function ProjectModal({
  visible,
  editing,
  onClose,
  onSave,
  busy = false,
}) {
  const dispatch = useDispatch();

  const categories = useSelector(selectAWPCategories) || [];
  const categoriesLoading = useSelector(selectAWPCategoriesLoading);
  const departments = useSelector(selectDepartments) || [];
  const clients = useSelector(selectClients) || [];
  const employees = useSelector(selectEmpList) || [];

  const fetchedOnceRef = useRef(false);
  const [companyFile, setCompanyFile] = useState(null);
  const [manageCatOpen, setManageCatOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [membersModalOpen, setMembersModalOpen] = useState(false);

  // Build initial state from editing (map assignedEmployeeIds to string keys)
  const initialState = useMemo(() => {
    const assigned =
      (editing &&
        Array.isArray(editing.assignedEmployeeIds) &&
        editing.assignedEmployeeIds.map(String)) ||
      [];

    return {
      shortCode: editing?.shortCode ?? '',
      projectName: editing?.name ?? '',
      startDate: editing?.startDate ?? '',
      deadline: editing?.deadline ?? '',
      noDeadline: !!editing?.noDeadline,
      projectCategory: editing?.category ?? '',
      departmentId: editing?.departmentId ? String(editing.departmentId) : '',
      department: editing?.department ?? '',
      clientId: editing?.clientId ? String(editing.clientId) : '',
      projectSummary: editing?.summary ?? '',
      tasksNeedAdminApproval: !!editing?.tasksNeedAdminApproval,
      currency: editing?.currency ?? 'USD',
      projectBudget: editing?.budget?.toString?.() ?? '',
      hoursEstimate: editing?.hoursEstimate?.toString?.() ?? '',
      allowManualTimeLogs: !!editing?.allowManualTimeLogs,
      assignedEmployeeIds: assigned, // array of strings already
    };
  }, [editing]);

  const [v, setV] = useState(initialState);

  useEffect(() => {
    if (!visible) return;
    // run fetches once per open
    if (!fetchedOnceRef.current) {
      fetchedOnceRef.current = true;
      dispatch(fetchProjectCategories());
      if (!clients || clients.length === 0) dispatch(ClientsActions.list({}));
      if (!employees || employees.length === 0) dispatch(fetchEmployees({}));
      if (!departments || departments.length === 0)
        dispatch({ type: FETCH_DEPT_REQ });
    } else {
      // still refresh categories each open
      dispatch(fetchProjectCategories());
    }

    // initialize form values
    setV(initialState);
    setCompanyFile(null);

    return () => {
      fetchedOnceRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  // keep form updated when editing changes while open
  useEffect(() => {
    if (visible && editing) setV(initialState);
  }, [editing, visible, initialState]);

  // helpers
  const patch = (k, val) => setV(s => ({ ...s, [k]: val }));

  const disabled = useMemo(() => {
    return (
      !v.shortCode ||
      !v.projectName ||
      !v.startDate ||
      (!v.noDeadline && !v.deadline)
    );
  }, [v]);

  // Date pickers
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showDeadlinePicker, setShowDeadlinePicker] = useState(false);

  function onStartDateChange(event, selectedDate) {
    if (Platform.OS !== 'ios') setShowStartPicker(false);
    if (selectedDate)
      patch('startDate', selectedDate.toISOString().slice(0, 10));
  }
  function onDeadlineChange(event, selectedDate) {
    if (Platform.OS !== 'ios') setShowDeadlinePicker(false);
    if (selectedDate)
      patch('deadline', selectedDate.toISOString().slice(0, 10));
  }

  // Category manager
  function handleAddCategory() {
    const name = (newCatName || '').trim();
    if (!name) return Alert.alert('Enter category name');
    dispatch(createProjectCategory({ name }));
    setNewCatName('');
  }
  function handleDeleteCategory(id) {
    Alert.alert('Delete category', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => dispatch(deleteProjectCategory(id)),
      },
    ]);
  }

  // Members toggle - uses stable empKey
  function toggleMemberByKey(key) {
    setV(prev => {
      const setIds = new Set(prev.assignedEmployeeIds.map(String));
      if (setIds.has(String(key))) setIds.delete(String(key));
      else setIds.add(String(key));
      return { ...prev, assignedEmployeeIds: Array.from(setIds) };
    });
  }

  // wrapper used by UI when passing the employee object
  function toggleMember(emp) {
    const key = empKeyOf(emp);
    if (!key) return;
    toggleMemberByKey(key);
  }

  // check if employee selected
  function isMemberSelected(emp) {
    const key = empKeyOf(emp);
    if (!key) return false;
    return v.assignedEmployeeIds.map(String).includes(String(key));
  }

  // File picker (image-picker) - same as before
  // async function pickCompanyFile() {
  //   try {
  //     const res = await launchImageLibrary({
  //       mediaType: 'mixed',
  //       includeBase64: false,
  //     });
  //     if (res && res.assets && res.assets.length > 0) {
  //       const file = res.assets[0];
  //       const payload = {
  //         uri:
  //           Platform.OS === 'ios' && file.uri?.startsWith('file://')
  //             ? file.uri
  //             : file.uri,
  //         name: file.fileName || `file-${Date.now()}`,
  //         type: file.type || 'application/octet-stream',
  //       };
  //       setCompanyFile(payload);
  //     }
  //   } catch (err) {
  //     // console.log('pickCompanyFile error', err);
  //     Alert.alert('File pick failed');
  //   }
  // }

  async function pickCompanyFile() {
    try {
      const file = await pickImageOrDoc();
      setCompanyFile(file);
    } catch (err) {
      if (DocumentPicker.isCancel?.(err)) {
        // user cancelled → silently ignore
        return;
      }
      // console.log('pickCompanyFile error', err);
      Alert.alert('File pick failed');
    }
  }

  function handleSave() {
    // normalize assigned employees -> array of employee keys (EMP-xxx)
    const assigned = Array.isArray(v.assignedEmployeeIds)
      ? v.assignedEmployeeIds.map(String)
      : String(v.assignedEmployeeIds || '')
          .split(',')
          .map(s => s.trim())
          .filter(Boolean);

    // inside handleSave(), change payload to this:
    // find department name from departments list (close to top of file departments is available)
    const deptName =
      (v.departmentId &&
        departments &&
        departments.length &&
        (departments.find(d => String(d.id) === String(v.departmentId))?.name ||
          departments.find(d => String(d.id) === String(v.departmentId))
            ?.departmentName)) ||
      v.department ||
      '';

    // then include department in payload:
    const payload = {
      shortCode: v.shortCode,
      projectName: v.projectName,
      startDate: v.startDate,
      deadline: v.noDeadline ? null : v.deadline,
      noDeadline: !!v.noDeadline,
      projectCategory: v.projectCategory,
      // IMPORTANT: backend expects `department` (string)
      department: deptName || undefined,
      clientId: v.clientId ? String(v.clientId) : undefined,
      projectSummary: v.projectSummary,
      tasksNeedAdminApproval: !!v.tasksNeedAdminApproval,
      currency: v.currency,
      projectBudget: v.projectBudget === '' ? null : Number(v.projectBudget),
      hoursEstimate: v.hoursEstimate === '' ? null : Number(v.hoursEstimate),
      allowManualTimeLogs: !!v.allowManualTimeLogs,
      assignedEmployeeIds: assigned,
      companyFile: companyFile || null,
    };

    // Optional: debug console to inspect exact payload before dispatch
    // console.log('create huu payload ->', payload);

    onSave?.(payload);
  }

  const currencies = ['USD', 'INR', 'EUR', 'GBP', 'AED'];

  return (
    <Modal
      visible={!!visible}
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
                    ) : categories && categories.length > 0 ? (
                      <Picker
                        selectedValue={v.projectCategory || ''}
                        onValueChange={val => patch('projectCategory', val)}
                        itemStyle={{ height: 100 }}
                      >
                        <Picker.Item label="Select category" value="" />
                        {categories.map(c => (
                          <Picker.Item
                            key={c.id}
                            label={c.name || c.categoryName}
                            value={c.name || c.categoryName}
                          />
                        ))}
                      </Picker>
                    ) : (
                      <View style={{ padding: 8 }}>
                        <Text style={{ color: '#6b7280', marginBottom: 6 }}>
                          No categories
                        </Text>
                        <TouchableOpacity
                          onPress={() => dispatch(fetchProjectCategories())}
                          style={styles.smallBtn}
                        >
                          <Text>Retry</Text>
                        </TouchableOpacity>
                      </View>
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
                  {departments && departments.length > 0 ? (
                    <Picker
                      selectedValue={v.departmentId || ''}
                      onValueChange={val => patch('departmentId', val)}
                      itemStyle={{ height: 100 }}
                    >
                      <Picker.Item label="Select department" value="" />
                      {departments.map(d => (
                        <Picker.Item
                          key={d.id}
                          label={d.name || d.departmentName}
                          value={String(d.id)}
                        />
                      ))}
                    </Picker>
                  ) : (
                    <View style={{ padding: 8 }}>
                      <Text style={{ color: '#6b7280', marginBottom: 6 }}>
                        No departments
                      </Text>
                      <TouchableOpacity
                        onPress={() => dispatch({ type: FETCH_DEPT_REQ })}
                        style={styles.smallBtn}
                      >
                        <Text>Retry</Text>
                      </TouchableOpacity>
                    </View>
                  )}
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
                  {clients && clients.length > 0 ? (
                    <Picker
                      selectedValue={v.clientId || ''}
                      onValueChange={val => patch('clientId', val)}
                      itemStyle={{ height: 100 }}
                    >
                      <Picker.Item label="Select client" value="" />
                      {clients.map(c => (
                        <Picker.Item
                          key={c.id}
                          label={c.name || c.company?.companyName}
                          value={c.clientId ? String(c.clientId) : String(c.id)}
                        />
                      ))}
                    </Picker>
                  ) : (
                    <View style={{ padding: 8 }}>
                      <Text style={{ color: '#6b7280', marginBottom: 6 }}>
                        No clients
                      </Text>
                      <TouchableOpacity
                        onPress={() => dispatch(ClientsActions.list({}))}
                        style={styles.smallBtn}
                      >
                        <Text>Retry</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>

              {/* Members (opens modal) */}
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
                    itemStyle={{ height: 100 }}
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

              {/* file */}
              <View style={{ flexBasis: '100%' }}>
                <TouchableOpacity
                  onPress={pickCompanyFile}
                  style={styles.fileBtn}
                >
                  <Icon
                    name="paperclip"
                    size={16}
                    color="#fff"
                    style={{ marginRight: 8 }}
                  />
                  <Text style={{ color: '#fff', fontWeight: '700' }}>
                    {companyFile
                      ? 'Change Project File'
                      : 'Attach Project File (optional)'}
                  </Text>
                </TouchableOpacity>
                {companyFile ? (
                  <Text style={{ marginTop: 6 }}>
                    {companyFile.name || companyFile.uri}
                  </Text>
                ) : null}
              </View>
            </View>
          </ScrollView>

          {/* actions */}
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

      {/* manage categories */}
      <Modal
        visible={manageCatOpen}
        animationType="slide"
        onRequestClose={() => setManageCatOpen(false)}
      >
        <View
          style={{
            padding: 16,
            flex: 1,
            backgroundColor: '#fff',
            marginTop: 40,
          }}
        >
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
                        onPress={() => {
                          patch(
                            'projectCategory',
                            item.name || item.categoryName,
                          );
                          setManageCatOpen(false);
                        }}
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

      {/* members modal */}
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

          {employees && employees.length > 0 ? (
            <FlatList
              data={employees}
              keyExtractor={item => empKeyOf(item) || String(item.id)}
              renderItem={({ item }) => {
                const key = empKeyOf(item);
                const checked = isMemberSelected(item);
                return (
                  <TouchableOpacity
                    onPress={() => toggleMember(item)}
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
                      <Text style={{ color: '#6b7280', fontSize: 12 }}>
                        {key}
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
          ) : (
            <View style={{ padding: 12 }}>
              <Text style={{ color: '#6b7280', marginBottom: 8 }}>
                No employees loaded
              </Text>
              <TouchableOpacity
                onPress={() => dispatch(fetchEmployees({}))}
                style={styles.smallBtn}
              >
                <Text>Retry Employees</Text>
              </TouchableOpacity>
            </View>
          )}

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

/* helper components Field & Toggle */
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

  smallBtn: {
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignSelf: 'flex-start',
  },
  fileBtn: {
    backgroundColor: '#1d4ed8',
    padding: 12,
    borderRadius: 10,
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
