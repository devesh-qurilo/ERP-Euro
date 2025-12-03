import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Image,
  ScrollView,
  Switch,
  ActivityIndicator,
} from 'react-native';
import DocumentPicker from '@react-native-documents/picker';
import { useSelector } from 'react-redux';

// Selectors you gave:
import { selectDesignations } from '../../designations/store/selectors';
import { selectDepartments } from '../../departments/store/selectors';

// Fallback employee list selector (flat array of employees).
// If you already have a specific selector, replace this with it.
const selectAllEmployees = s =>
  s.admin?.hr?.employees?.list ||
  s.admin?.hr?.employees?.content || // if your reducer stores paginated
  [];

const RoleOptions = ['ROLE_EMPLOYEE', 'ROLE_ADMIN'];

/** Light dropdown with searchless menu **/
const SimpleSelect = ({ value, options, onChange, placeholder }) => {
  const [open, setOpen] = useState(false);
  return (
    <View style={{ zIndex: open ? 9999 : 1 }}>
      <Pressable style={styles.select} onPress={() => setOpen(o => !o)}>
        <Text style={styles.value} numberOfLines={1}>
          {options.find(o => o.value === value)?.label ||
            placeholder ||
            'Select'}
        </Text>
        <Text style={styles.caret}>{open ? '▴' : '▾'}</Text>
      </Pressable>
      {open && (
        <View style={styles.menu}>
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
        </View>
      )}
    </View>
  );
};

export default function EmployeeModal({
  visible,
  onClose,
  onSave,
  editing, // row object if editing, else undefined
  saving, // <-- pass from store to show loader
}) {
  // Store lists
  const designations = useSelector(selectDesignations);
  const departments = useSelector(selectDepartments);
  const employees = useSelector(selectAllEmployees);

  // Options for dropdowns
  const designationOptions = (designations || []).map(d => ({
    label: d.designationName,
    value: d.id,
  }));
  const departmentOptions = (departments || []).map(d => ({
    label: d.departmentName,
    value: d.id,
  }));
  const employeeOptions = (employees || []).map(e => ({
    label: `${e.name || e.employeeId} (${e.employeeId})`,
    value: e.employeeId,
  }));

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
    country: 'country',
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
        country: editing.country || 'country',
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
    } else {
      // reset for create
      setF(prev => ({
        ...prev,
        employeeId: '',
        name: '',
        email: '',
        password: '',
      }));
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
    } catch (e) {}
  };

  const submit = () => {
    if (!f.name.trim() || !f.email.trim()) {
      return;
    }
    if (!editing && !f.employeeId.trim()) {
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
              placeholder="John Doe"
              placeholderTextColor="#9ca3af"
            />

            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={styles.input}
              value={f.email}
              onChangeText={v => setF({ ...f, email: v })}
              placeholder="john@example.com"
              autoCapitalize="none"
              keyboardType="email-address"
              placeholderTextColor="#9ca3af"
            />

            {!editing && (
              <>
                <Text style={styles.label}>Password *</Text>
                <TextInput
                  style={styles.input}
                  value={f.password}
                  onChangeText={v => setF({ ...f, password: v })}
                  placeholder="••••••••"
                  secureTextEntry
                />
              </>
            )}

            <Text style={styles.label}>Mobile</Text>
            <TextInput
              style={styles.input}
              value={f.mobile}
              onChangeText={v => setF({ ...f, mobile: v })}
              placeholder="+370-XXXXXXXXXX"
              placeholderTextColor="#9ca3af"
            />

            <Text style={styles.label}>Role</Text>
            <SimpleSelect
              value={f.role}
              options={RoleOptions.map(r => ({ label: r, value: r }))}
              onChange={v => setF({ ...f, role: v })}
              placeholder="Select role"
            />

            {/* NEW: Department dropdown */}
            <Text style={styles.label}>Department</Text>
            <SimpleSelect
              value={f.departmentId}
              options={departmentOptions}
              onChange={v => setF({ ...f, departmentId: v })}
              placeholder="Select department"
            />

            {/* NEW: Designation dropdown */}
            <Text style={styles.label}>Designation</Text>
            <SimpleSelect
              value={f.designationId}
              options={designationOptions}
              onChange={v => setF({ ...f, designationId: v })}
              placeholder="Select designation"
            />

            {/* NEW: Reporting To (Employee) */}
            <Text style={styles.label}>Reporting To</Text>
            <SimpleSelect
              value={f.reportingToId}
              options={employeeOptions}
              onChange={v => setF({ ...f, reportingToId: v })}
              placeholder="Select employee"
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

            {/* Optional fields (keep as in your previous modal) */}
            <Text style={styles.label}>About</Text>
            <TextInput
              style={[styles.input, { height: 80 }]}
              multiline
              value={f.about}
              onChangeText={v => setF({ ...f, about: v })}
            />

            <View style={{ height: 8 }} />
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
              style={[styles.primaryBtn, saving && { opacity: 0.7 }]}
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

  // select
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
    top: 44,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    overflow: 'hidden',
    zIndex: 9999,
    elevation: 24,
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
  switchLabel: { color: '#111827', fontWeight: '600' },

  uploadBtn: {
    borderWidth: 1,
    borderColor: '#1d4ed8',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignSelf: 'flex-start',
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
  },
  primaryTxt: { fontWeight: '900', color: '#111827' },
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
