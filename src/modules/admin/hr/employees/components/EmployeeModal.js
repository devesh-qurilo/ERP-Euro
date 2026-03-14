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
  Keyboard,
} from 'react-native';
import DocumentPicker from '@react-native-documents/picker';
import { useDispatch, useSelector } from 'react-redux';
import { KeyboardAvoidingView, Platform } from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';

// Selectors you gave:
import { selectDesignations } from '../../designations/store/selectors';
import { selectDepartments } from '../../departments/store/selectors';
import { fetchDesignations } from '../../designations/store/actions';
import { fetchDepartments } from '../../departments/store/actions';

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
        <ScrollView style={styles.menu}>
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
  error,
}) {
  const dispatch = useDispatch();
  // Store lists
  const designations = useSelector(selectDesignations);
  const departments = useSelector(selectDepartments);
  const employees = useSelector(selectAllEmployees);

  useEffect(() => {
    dispatch(fetchDesignations());
    dispatch(fetchDepartments());
  }, []);

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
    birthday: '1999-01-09',
    bloodGroup: 'O+',
    joiningDate: '2023-01-09',
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
    probationEndDate: '2026-01-09',
    noticePeriodStartDate: '2026-01-09',
    noticePeriodEndDate: '2026-01-09',
    employmentType: 'Full Time',
    maritalStatus: 'Single',
    businessAddress: '',
    officeShift: '9AM-5PM',
  });
  const [file, setFile] = useState(null);
  const [showBirthday, setShowBirthday] = useState(false);
  const [showJoining, setShowJoining] = useState(false);
  const [showProbation, setShowProbation] = useState(false);
  const [showNoticeStart, setShowNoticeStart] = useState(false);
  const [showNoticeEnd, setShowNoticeEnd] = useState(false);
  const [showOfficeShift, setShowOfficeShift] = useState(false);
  const [shiftStart, setShiftStart] = useState(null);
  const [shiftEnd, setShiftEnd] = useState(null);

  const officeShift =
    shiftStart && shiftEnd
      ? `${formatTime(shiftStart)}-${formatTime(shiftEnd)}`
      : f.officeShift;

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

  const formatDate = date => {
    return date.toISOString().split('T')[0];
  };

  const formatTime = date => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12;

    minutes = minutes < 10 ? '0' + minutes : minutes;

    return `${hours}:${minutes}${ampm}`;
  };

  const GenderOptions = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Other', value: 'Other' },
  ];

  const BloodOptions = [
    { label: 'O+', value: 'O+' },
    { label: 'O-', value: 'O-' },
    { label: 'A+', value: 'A+' },
    { label: 'A-', value: 'A-' },
    { label: 'B+', value: 'B+' },
    { label: 'B-', value: 'B-' },
    { label: 'AB+', value: 'AB+' },
    { label: 'AB-', value: 'AB-' },
  ];

  const EmploymentOptions = [
    { label: 'Full Time', value: 'Full Time' },
    { label: 'Part Time', value: 'Part Time' },
    { label: 'Contract', value: 'Contract' },
  ];

  console.log('error', error);

  const MaritalOptions = [
    { label: 'Single', value: 'Single' },
    { label: 'Married', value: 'Married' },
  ];

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
      officeShift: officeShift,
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
    console.log(employee, file);
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
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <View style={styles.sheet}>
            <View style={styles.btnRow}>
              <Text style={styles.title}>
                {editing ? 'Edit Employee' : 'Add Employee'}
              </Text>
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

            {error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>
                  Require unique Email, ID, Contact No
                </Text>
              </View>
            ) : null}

            <ScrollView
              style={{ maxHeight: 520 }}
              contentContainerStyle={{ paddingBottom: 8 }}
            >
              <Text style={styles.section}>Basic Info</Text>
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
                keyboardType="phone-pad"
                style={styles.input}
                value={f.mobile}
                onChangeText={v => setF({ ...f, mobile: v })}
                placeholder="+370-XXXXXXXXXX"
                placeholderTextColor="#9ca3af"
              />
              <Text style={styles.section}>Work Info</Text>

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
                  onValueChange={v =>
                    setF({ ...f, receiveEmailNotification: v })
                  }
                />
              </View>
              <Text style={styles.section}>Personal Info</Text>

              <Text style={styles.label}>Gender</Text>
              <SimpleSelect
                value={f.gender}
                options={GenderOptions}
                onChange={v => setF({ ...f, gender: v })}
              />

              <Text style={styles.label}>Birthday</Text>

              <Pressable
                style={styles.input}
                onPress={() => setShowBirthday(true)}
              >
                <Text>{f.birthday}</Text>
              </Pressable>

              {showBirthday && (
                <DateTimePicker
                  value={new Date(f.birthday)}
                  mode="date"
                  display="default"
                  onChange={(e, date) => {
                    setShowBirthday(false);

                    if (date) {
                      setF({
                        ...f,
                        birthday: date.toISOString().split('T')[0],
                      });
                    }
                  }}
                />
              )}

              <Text style={styles.label}>Blood Group</Text>
              <SimpleSelect
                value={f.bloodGroup}
                options={BloodOptions}
                onChange={v => setF({ ...f, bloodGroup: v })}
              />

              <Text style={styles.label}>Joining Date</Text>

              <Pressable
                style={styles.input}
                onPress={() => setShowJoining(true)}
              >
                <Text>{f.joiningDate}</Text>
              </Pressable>

              {showJoining && (
                <DateTimePicker
                  value={new Date(f.joiningDate)}
                  mode="date"
                  onChange={(e, date) => {
                    setShowJoining(false);

                    if (date) {
                      setF({
                        ...f,
                        joiningDate: date.toISOString().split('T')[0],
                      });
                    }
                  }}
                />
              )}

              <Text style={styles.label}>Language</Text>
              <TextInput
                style={styles.input}
                value={f.language}
                onChangeText={v => setF({ ...f, language: v })}
              />

              <Text style={styles.label}>Country</Text>
              <TextInput
                style={styles.input}
                value={f.country}
                onChangeText={v => setF({ ...f, country: v })}
                onSubmitEditing={() => Keyboard.dismiss()}
              />

              <Text style={styles.label}>Address</Text>
              <TextInput
                style={[styles.input, { height: 60 }]}
                multiline
                returnKeyType="done"
                submitBehavior="blurAndSubmit"
                value={f.address}
                onChangeText={v => setF({ ...f, address: v })}
              />

              <Text style={styles.label}>Hourly Rate</Text>
              <TextInput
                keyboardType="phone-pad"
                style={styles.input}
                value={String(f.hourlyRate)}
                onChangeText={v => setF({ ...f, hourlyRate: v })}
              />

              <Text style={styles.label}>Skills (comma separated)</Text>
              <TextInput
                style={styles.input}
                value={f.skillsCsv}
                onChangeText={v => setF({ ...f, skillsCsv: v })}
                placeholder="React, Node, Mongo"
                onSubmitEditing={() => Keyboard.dismiss()}
              />

              <Text style={styles.label}>Probation End Date</Text>

              <Pressable
                style={styles.input}
                onPress={() => setShowProbation(true)}
              >
                <Text>{f.probationEndDate}</Text>
              </Pressable>

              {showProbation && (
                <DateTimePicker
                  value={new Date(f.probationEndDate)}
                  mode="date"
                  onChange={(e, date) => {
                    setShowProbation(false);

                    if (date) {
                      setF({
                        ...f,
                        probationEndDate: date.toISOString().split('T')[0],
                      });
                    }
                  }}
                />
              )}

              <Text style={styles.label}>Employment Type</Text>

              <SimpleSelect
                value={f.employmentType}
                options={EmploymentOptions}
                onChange={v => setF({ ...f, employmentType: v })}
              />

              <Text style={styles.label}>Marital Status</Text>

              <SimpleSelect
                value={f.maritalStatus}
                options={MaritalOptions}
                onChange={v => setF({ ...f, maritalStatus: v })}
              />

              <Text style={styles.label}>Business Address</Text>
              <TextInput
                style={styles.input}
                value={f.businessAddress}
                onChangeText={v => setF({ ...f, businessAddress: v })}
              />

              <Text style={styles.label}>Office Shift</Text>

              <Pressable
                style={styles.input}
                onPress={() => setShowOfficeShift(true)}
              >
                <Text>{f.officeShift}</Text>
              </Pressable>

              {showOfficeShift && (
                <DateTimePicker
                  mode="time"
                  value={new Date()}
                  onChange={(event, date) => {
                    setShowOfficeShift(false);

                    if (date) {
                      const time =
                        date.getHours().toString().padStart(2, '0') +
                        ':' +
                        date.getMinutes().toString().padStart(2, '0');

                      setF({
                        ...f,
                        officeShift: time,
                      });
                    }
                  }}
                />
              )}

              <Text style={styles.label}>Notice Period Start</Text>

              <Pressable
                style={styles.input}
                onPress={() => setShowNoticeStart(true)}
              >
                <Text>{f.noticePeriodStartDate}</Text>
              </Pressable>

              {showNoticeStart && (
                <DateTimePicker
                  mode="datetime"
                  value={new Date(f.noticePeriodStartDate)}
                  onChange={(event, date) => {
                    setShowNoticeStart(false);

                    if (date) {
                      setF({
                        ...f,
                        noticePeriodStartDate: formatDate(date),
                      });
                    }
                  }}
                />
              )}

              <Text style={styles.label}>Notice Period End</Text>

              <Pressable
                style={styles.input}
                onPress={() => setShowNoticeEnd(true)}
              >
                <Text>{f.noticePeriodEndDate}</Text>
              </Pressable>

              {showNoticeEnd && (
                <DateTimePicker
                  mode="datetime"
                  value={new Date(f.noticePeriodEndDate)}
                  onChange={(event, date) => {
                    setShowNoticeEnd(false);

                    if (date) {
                      setF({
                        ...f,
                        noticePeriodEndDate: formatDate(date),
                      });
                    }
                  }}
                />
              )}

              {/* Optional fields (keep as in your previous modal) */}
              <Text style={styles.label}>About</Text>
              <TextInput
                style={[styles.input, { height: 80 }]}
                multiline
                value={f.about}
                onChangeText={v => setF({ ...f, about: v })}
                returnKeyType="done"
                submitBehavior="blurAndSubmit"
                onSubmitEditing={() => Keyboard.dismiss()}
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
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(159, 189, 241, 0.35)',
    justifyContent: 'center',
    marginTop: 12,
    padding: 16,
  },
  section: {
    fontSize: 14,
    fontWeight: '900',
    marginTop: 16,
    color: '#111827',
  },
  sheet: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    maxHeight: 580,
  },
  title: { fontSize: 18, fontWeight: '700', color: '#111827', margin: 8 },
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
    height: 100,
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
  errorBox: {
    backgroundColor: '#fee2e2',
    borderColor: '#ef4444',
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },

  errorText: {
    color: '#b91c1c',
    fontWeight: '600',
  },
});
