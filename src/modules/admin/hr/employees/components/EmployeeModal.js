// src/modules/admin/hr/employees/components/EmployeeModal.js
import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
  Image,
  ScrollView,
  Switch,
  ActivityIndicator,
} from 'react-native';
import DocumentPicker from '@react-native-documents/picker';

const RoleOptions = ['ROLE_EMPLOYEE', 'ROLE_ADMIN'];

function Dropdown({ label, value, display, options = [], onChange, disabled }) {
  const [open, setOpen] = useState(false);
  const shown = (() => {
    if (display) return display(value);
    const f = options.find(o => o.value === value);
    return f ? f.label : '—';
  })();

  return (
    <View style={{ marginTop: 8, zIndex: 50 }}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <Pressable
        style={[styles.select, disabled && { opacity: 0.5 }]}
        disabled={disabled}
        onPress={() => setOpen(o => !o)}
      >
        <Text style={styles.value} numberOfLines={1}>
          {shown}
        </Text>
        <Text style={styles.caret}>{open ? '▴' : '▾'}</Text>
      </Pressable>

      {open && (
        <View style={styles.menu}>
          <ScrollView style={{ maxHeight: 220 }}>
            {options.map(opt => (
              <Pressable
                key={String(opt.value)}
                style={styles.menuItem}
                onPress={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
              >
                <Text style={styles.menuTxt} numberOfLines={1}>
                  {opt.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

export default function EmployeeModal({
  visible,
  onClose,
  onSave,
  editing, // existing row or null
  saving = false, // <-- show loader while saving
  designations = [], // [{value: id, label: 'Senior Dev'}]
  departments = [], // [{value: id, label: 'Engineering'}]
  employees = [], // [{value: 'EMP-010', label: 'Devesh Singh'}] (for Reporting To)
}) {
  const [f, setF] = useState({
    employeeId: '',
    name: '',
    email: '',
    password: '',
    gender: 'Male',
    birthday: '1990-01-01',
    bloodGroup: 'O+',
    joiningDate: '2023-01-01',
    language: 'English',
    country: 'India',
    mobile: '',
    address: '',
    about: '',
    departmentId: null,
    designationId: null,
    reportingToId: null,
    role: 'ROLE_EMPLOYEE',
    loginAllowed: true,
    receiveEmailNotification: false,
    hourlyRate: 25.0,
    slackMemberId: '',
    skillsCsv: '',
    probationEndDate: '2023-04-01',
    noticePeriodStartDate: '2025-09-20',
    noticePeriodEndDate: '2025-12-20',
    employmentType: 'Full Time',
    maritalStatus: 'Single',
    businessAddress: '',
    officeShift: '9AM-5PM',
  });
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (editing) {
      setF(s => ({
        ...s,
        employeeId: editing.employeeId,
        name: editing.name || '',
        email: editing.email || '',
        password: '',
        gender: editing.gender || 'Male',
        birthday: editing.birthday || '1990-01-01',
        bloodGroup: editing.bloodGroup || 'O+',
        joiningDate: editing.joiningDate || '2023-01-01',
        language: editing.language || 'English',
        country: editing.country || 'India',
        mobile: editing.mobile || '',
        address: editing.address || '',
        about: editing.about || '',
        departmentId: editing.departmentId ?? null,
        designationId: editing.designationId ?? null,
        reportingToId: editing.reportingToId ?? null,
        role: editing.role || 'ROLE_EMPLOYEE',
        loginAllowed: !!editing.loginAllowed,
        receiveEmailNotification: !!editing.receiveEmailNotification,
        hourlyRate: editing.hourlyRate ?? 25.0,
        slackMemberId: editing.slackMemberId || '',
        skillsCsv: Array.isArray(editing.skills)
          ? editing.skills.join(', ')
          : '',
        probationEndDate: editing.probationEndDate || '2023-04-01',
        noticePeriodStartDate: editing.noticePeriodStartDate || '2025-09-20',
        noticePeriodEndDate: editing.noticePeriodEndDate || '2025-12-20',
        employmentType: editing.employmentType || 'Full Time',
        maritalStatus: editing.maritalStatus || 'Single',
        businessAddress: editing.businessAddress || '',
        officeShift: editing.officeShift || '9AM-5PM',
      }));
      setFile(null);
    } else if (visible) {
      // reset when opening for create
      setF({
        employeeId: '',
        name: '',
        email: '',
        password: '',
        gender: 'Male',
        birthday: '1990-01-01',
        bloodGroup: 'O+',
        joiningDate: '2023-01-01',
        language: 'English',
        country: 'India',
        mobile: '',
        address: '',
        about: '',
        departmentId: null,
        designationId: null,
        reportingToId: null,
        role: 'ROLE_EMPLOYEE',
        loginAllowed: true,
        receiveEmailNotification: false,
        hourlyRate: 25.0,
        slackMemberId: '',
        skillsCsv: '',
        probationEndDate: '2023-04-01',
        noticePeriodStartDate: '2025-09-20',
        noticePeriodEndDate: '2025-12-20',
        employmentType: 'Full Time',
        maritalStatus: 'Single',
        businessAddress: '',
        officeShift: '9AM-5PM',
      });
      setFile(null);
    }
  }, [editing, visible]);

  const buildEmployeeJSON = () => {
    const skills = f.skillsCsv
      ? f.skillsCsv
          .split(',')
          .map(s => s.trim())
          .filter(Boolean)
      : [];
    return {
      employeeId: f.employeeId,
      name: f.name,
      email: f.email,
      password: f.password || undefined,
      gender: f.gender,
      birthday: f.birthday,
      bloodGroup: f.bloodGroup,
      joiningDate: f.joiningDate,
      language: f.language,
      country: f.country,
      mobile: f.mobile,
      address: f.address,
      about: f.about,
      departmentId: f.departmentId ? Number(f.departmentId) : null,
      designationId: f.designationId ? Number(f.designationId) : null,
      reportingToId: f.reportingToId || null,
      role: f.role,
      loginAllowed: !!f.loginAllowed,
      receiveEmailNotification: !!f.receiveEmailNotification,
      hourlyRate: Number(f.hourlyRate) || 0,
      slackMemberId: f.slackMemberId || '',
      skills,
      probationEndDate: f.probationEndDate,
      noticePeriodStartDate: f.noticePeriodStartDate,
      noticePeriodEndDate: f.noticePeriodEndDate,
      employmentType: f.employmentType,
      maritalStatus: f.maritalStatus,
      businessAddress: f.businessAddress,
      officeShift: f.officeShift,
    };
  };

  const pickFile = async () => {
    try {
      const res = await DocumentPicker.pickSingle({
        type: ['image/*'],
        copyTo: 'documentDirectory',
      });
      const uri = res.fileCopyUri || res.uri;
      setFile({
        uri,
        name: res.name || 'profile.jpg',
        type: res.type || 'image/jpeg',
      });
    } catch {}
  };

  const submit = () => {
    if (!f.name.trim() || !f.email.trim()) {
      Alert.alert('Missing fields', 'Name and Email are required.');
      return;
    }
    if (!editing && !f.employeeId.trim()) {
      Alert.alert(
        'Missing fields',
        'Employee ID is required for new employee.',
      );
      return;
    }
    const employee = buildEmployeeJSON();
    onSave({ employee, file });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <Text style={styles.title}>
            {editing ? 'Edit Employee' : 'Add Employee'}
          </Text>

          <ScrollView
            style={{ maxHeight: 520 }}
            contentContainerStyle={{ paddingBottom: 8 }}
          >
            {!editing && (
              <>
                <Text style={styles.label}>Employee ID *</Text>
                <TextInput
                  style={styles.input}
                  value={f.employeeId}
                  onChangeText={v => setF({ ...f, employeeId: v })}
                  placeholder="EMP-006"
                  placeholderTextColor="#9ca3af"
                />
              </>
            )}

            <Text style={styles.label}>Name *</Text>
            <TextInput
              style={styles.input}
              value={f.name}
              onChangeText={v => setF({ ...f, name: v })}
            />

            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={styles.input}
              autoCapitalize="none"
              keyboardType="email-address"
              value={f.email}
              onChangeText={v => setF({ ...f, email: v })}
            />

            {!editing && (
              <>
                <Text style={styles.label}>Password *</Text>
                <TextInput
                  style={styles.input}
                  secureTextEntry
                  value={f.password}
                  onChangeText={v => setF({ ...f, password: v })}
                />
              </>
            )}

            <Text style={styles.label}>Mobile</Text>
            <TextInput
              style={styles.input}
              value={f.mobile}
              onChangeText={v => setF({ ...f, mobile: v })}
            />

            <Dropdown
              label="Role"
              value={f.role}
              options={RoleOptions.map(r => ({ value: r, label: r }))}
              onChange={v => setF({ ...f, role: v })}
            />

            <View style={styles.rowSwitch}>
              <Text style={styles.switchLabel}>Login Allowed</Text>
              <Switch
                value={f.loginAllowed}
                onValueChange={v => setF({ ...f, loginAllowed: v })}
              />
            </View>
            <View style={styles.rowSwitch}>
              <Text style={styles.switchLabel}>Email Notifications</Text>
              <Switch
                value={f.receiveEmailNotification}
                onValueChange={v => setF({ ...f, receiveEmailNotification: v })}
              />
            </View>

            {/* NEW: dropdowns fed by lookup lists */}
            <Dropdown
              label="Department"
              value={f.departmentId}
              options={departments}
              onChange={v => setF({ ...f, departmentId: v })}
            />
            <Dropdown
              label="Designation"
              value={f.designationId}
              options={designations}
              onChange={v => setF({ ...f, designationId: v })}
            />
            <Dropdown
              label="Reporting To (Employee)"
              value={f.reportingToId}
              options={employees}
              onChange={v => setF({ ...f, reportingToId: v })}
            />

            <Text style={styles.label}>Address</Text>
            <TextInput
              style={styles.input}
              value={f.address}
              onChangeText={v => setF({ ...f, address: v })}
            />
            <Text style={styles.label}>About</Text>
            <TextInput
              style={[styles.input, { height: 80 }]}
              multiline
              value={f.about}
              onChangeText={v => setF({ ...f, about: v })}
            />

            <Pressable onPress={pickFile} style={styles.uploadBtn}>
              <Text style={styles.uploadTxt}>
                {file ? 'Change Photo' : 'Upload Photo'}
              </Text>
            </Pressable>
            {file?.uri ? (
              <Image
                source={{ uri: file.uri }}
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 36,
                  marginTop: 8,
                }}
              />
            ) : null}
          </ScrollView>

          <View style={styles.btnRow}>
            <Pressable
              style={styles.secondaryBtn}
              onPress={onClose}
              disabled={saving}
            >
              <Text style={styles.secondaryTxt}>Cancel</Text>
            </Pressable>

            <Pressable
              style={styles.primaryBtn}
              onPress={submit}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={[styles.primaryTxt, { color: '#fff' }]}>
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

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    padding: 16,
  },
  sheet: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    maxHeight: 610,
  },
  title: { fontSize: 18, fontWeight: '900', color: '#111827', marginBottom: 8 },
  label: {
    fontSize: 12,
    fontWeight: '800',
    color: '#374151',
    marginTop: 8,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#111827',
    backgroundColor: '#fff',
  },

  select: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  value: { flex: 1, color: '#111827' },
  caret: { color: '#6b7280' },
  menu: {
    position: 'absolute',
    top: 58,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    overflow: 'hidden',
    zIndex: 9999,
    elevation: 20,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#f1f5f9',
  },
  menuTxt: { color: '#111827' },

  rowSwitch: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  switchLabel: { color: '#111827', fontWeight: '700' },

  uploadBtn: {
    borderWidth: 1,
    borderColor: '#1d4ed8',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  uploadTxt: { fontWeight: '900', color: '#111827' },

  btnRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 10,
  },
  primaryBtn: {
    borderWidth: 1,
    borderColor: '#1d4ed8',
    backgroundColor: '#1d4ed8',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    minWidth: 110,
    alignItems: 'center',
  },
  primaryTxt: { fontWeight: '900' },
  secondaryBtn: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  secondaryTxt: { fontWeight: '800', color: '#111827' },
});
