// ...imports SAME as before
import React, { useMemo, useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as DocumentPicker from '@react-native-documents/picker';

/* helpers SAME */
const toRNFile = d => ({
  uri: d.fileCopyUri || d.uri,
  name: d.name || 'leave-doc.bin',
  type: d.type || 'application/octet-stream',
});
const formatDate = d => {
  if (!d) return '';
  const dt = d instanceof Date ? d : new Date(d);
  if (Number.isNaN(dt.getTime())) return '';
  return dt.toISOString().slice(0, 10);
};

/* Select SAME as before */
const Select = ({ label, value, options, onChange }) => {
  const [open, setOpen] = useState(false);
  return (
    <View style={{ minWidth: 150, marginRight: 8, marginBottom: 8 }}>
      <Text style={styles.label}>{label}</Text>
      <Pressable style={styles.selectBtn} onPress={() => setOpen(o => !o)}>
        <Text style={styles.value}>{value}</Text>
        <Text style={styles.caret}>{open ? '▴' : '▾'}</Text>
      </Pressable>
      {open && (
        <View style={styles.menu}>
          {options.map(opt => (
            <Pressable
              key={opt}
              style={styles.menuItem}
              onPress={() => {
                onChange(opt);
                setOpen(false);
              }}
            >
              <Text>{opt}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
};

export default function LeaveApplyModal({
  visible,
  onClose,
  onSave,
  employees,
  applying,
}) {
  const empOptions = useMemo(
    () => employees.map(e => `${e.employeeId} • ${e.name}`),
    [employees],
  );

  const [selectedEmpIds, setSelectedEmpIds] = useState([]);
  const [empOpen, setEmpOpen] = useState(false);

  const [leaveType, setLeaveType] = useState('SICK');
  const [durationType, setDurationType] = useState('FULL_DAY');
  const [status, setStatus] = useState('APPROVED');
  const [reason, setReason] = useState('');

  const [singleDate, setSingleDate] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [docs, setDocs] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(null);

  useEffect(() => {
    if (visible) {
      setSelectedEmpIds([]);
      setEmpOpen(false);
      setLeaveType('SICK');
      setDurationType('FULL_DAY');
      setStatus('APPROVED');
      setReason('');
      setSingleDate('');
      setStartDate('');
      setEndDate('');
      setDocs([]);
      setShowDatePicker(null);
    }
  }, [visible]);

  /* employee toggle */
  const toggleEmp = opt => {
    const id = opt.split('•')[0].trim();
    setSelectedEmpIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id],
    );
  };

  /* document picker SAME */
  async function pickDocs() {
    try {
      const res = await DocumentPicker.pick({
        type: [
          DocumentPicker.types.images,
          DocumentPicker.types.pdf,
          DocumentPicker.types.doc,
          DocumentPicker.types.docx,
        ],
        allowMultiSelection: true,
        copyTo: 'cachesDirectory',
      });
      const files = (Array.isArray(res) ? res : [res]).map(toRNFile);
      setDocs(prev => [...prev, ...files]);
    } catch (e) {
      if (!(DocumentPicker.isCancel && DocumentPicker.isCancel(e))) {
        Alert.alert('File pick failed');
      }
    }
  }

  function onDateChange(event, selectedDate) {
    if (event?.type === 'dismissed') {
      setShowDatePicker(null);
      return;
    }

    if (!selectedDate) return;

    const v = formatDate(selectedDate);

    if (showDatePicker === 'single') setSingleDate(v);
    if (showDatePicker === 'start') setStartDate(v);
    if (showDatePicker === 'end') setEndDate(v);

    // ✅ CLOSE PICKER IMMEDIATELY AFTER SELECTION (ALL PLATFORMS)
    setShowDatePicker(null);
  }

  function handleSave() {
    if (!selectedEmpIds.length) {
      Alert.alert('Validation', 'Select at least one employee');
      return;
    }
    if (!reason.trim()) {
      Alert.alert('Validation', 'Reason is required');
      return;
    }

    const leaveData =
      durationType === 'MULTIPLE'
        ? {
            employeeIds: selectedEmpIds,
            leaveType,
            durationType,
            startDate,
            endDate,
            reason,
            status,
          }
        : {
            employeeIds: selectedEmpIds,
            leaveType,
            durationType,
            singleDate,
            reason,
            status,
          };

    onSave({ leaveData, documents: docs });
  }

  return (
    <Modal visible={visible} transparent animationType="fade">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.backdrop}
      >
        <View style={styles.modal}>
          <Text style={styles.title}>Apply Leave (Admin)</Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* EMPLOYEE DROPDOWN */}
            <Text style={styles.label}>Employees</Text>
            <Pressable
              style={styles.selectBtn}
              onPress={() => setEmpOpen(o => !o)}
            >
              <Text style={styles.value}>
                {selectedEmpIds.length
                  ? `${selectedEmpIds.length} selected`
                  : 'Select employees'}
              </Text>
              <Text style={styles.caret}>{empOpen ? '▴' : '▾'}</Text>
            </Pressable>
            {empOpen && (
              <View style={styles.empDropdown}>
                <ScrollView nestedScrollEnabled>
                  {empOptions.map(opt => {
                    const id = opt.split('•')[0].trim();
                    const checked = selectedEmpIds.includes(id);
                    return (
                      <Pressable
                        key={opt}
                        onPress={() => toggleEmp(opt)}
                        style={styles.empRow}
                      >
                        <Text style={{ flex: 1 }}>{opt}</Text>
                        <Text>{checked ? '✔' : ''}</Text>
                      </Pressable>
                    );
                  })}
                </ScrollView>
              </View>
            )}

            {/* rest UI UNCHANGED */}
            <View
              style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 }}
            >
              <Select
                label="Leave Type"
                value={leaveType}
                options={['SICK', 'CASUAL', 'EARNED']}
                onChange={setLeaveType}
              />
              <Select
                label="Duration"
                value={durationType}
                options={['FULL_DAY', 'HALF_DAY', 'MULTIPLE']}
                onChange={setDurationType}
              />
              <Select
                label="Status"
                value={status}
                options={['APPROVED', 'PENDING', 'REJECTED']}
                onChange={setStatus}
              />
            </View>
            {durationType === 'MULTIPLE' ? (
              <>
                <Pressable
                  style={styles.dateBtn}
                  onPress={() => setShowDatePicker('start')}
                >
                  <Text>Start Date: {startDate || 'Select'}</Text>
                </Pressable>
                <Pressable
                  style={styles.dateBtn}
                  onPress={() => setShowDatePicker('end')}
                >
                  <Text>End Date: {endDate || 'Select'}</Text>
                </Pressable>
              </>
            ) : (
              <Pressable
                style={styles.dateBtn}
                onPress={() => setShowDatePicker('single')}
              >
                <Text>Date: {singleDate || 'Select'}</Text>
              </Pressable>
            )}
            {/* DATE PICKER OVERLAY (FIXED) */}
            {showDatePicker && (
              <View style={styles.dateOverlay}>
                <View style={styles.datePickerBox}>
                  <DateTimePicker
                    value={new Date()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'inline' : 'default'}
                    onChange={onDateChange}
                  />

                  {Platform.OS === 'ios' && (
                    <Pressable
                      style={styles.dateDoneBtn}
                      onPress={() => setShowDatePicker(null)}
                    >
                      <Text style={{ color: '#fff', fontWeight: '700' }}>
                        Done
                      </Text>
                    </Pressable>
                  )}
                </View>
              </View>
            )}
            <Text style={styles.label}>Reason</Text>
            <TextInput
              value={reason}
              onChangeText={setReason}
              style={styles.input}
              multiline
            />
            <Pressable style={styles.secondaryBtn} onPress={pickDocs}>
              <Text style={styles.secondaryTxt}>
                {docs.length
                  ? `${docs.length} file(s) attached`
                  : '+ Attach Documents'}
              </Text>
            </Pressable>
            {docs.map((d, i) => (
              <Text key={i} numberOfLines={1}>
                • {d.name}
              </Text>
            ))}
          </ScrollView>

          <View style={styles.footer}>
            <Pressable style={styles.btn} onPress={onClose}>
              <Text style={styles.btnTxt}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[styles.btn, styles.btnPrimary]}
              onPress={handleSave}
              disabled={applying}
            >
              <Text style={[styles.btnTxt, { color: '#fff' }]}>
                {applying ? 'Saving…' : 'Save'}
              </Text>
            </Pressable>
          </View>

          {applying && <ActivityIndicator style={{ marginTop: 8 }} />}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

/* styles */
const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 16,
  },
  modal: { backgroundColor: '#fff', borderRadius: 16, padding: 16 },
  title: { fontSize: 18, fontWeight: '800', marginBottom: 8 },
  label: { fontSize: 12, fontWeight: '800', marginTop: 8, marginBottom: 6 },
  selectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(107, 104, 104, 0.4)',
    borderRadius: 10,
    padding: 12,
  },
  value: { flex: 1 },
  caret: { opacity: 0.6 },
  empDropdown: {
    maxHeight: 220,
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 6,
    borderColor: 'rgba(107, 104, 104, 0.4)',
  },
  empRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    minHeight: 80,
    borderColor: 'rgba(107, 104, 104, 0.4)',
  },
  secondaryBtn: {
    borderWidth: 1,
    borderColor: 'rgba(107, 104, 104, 0.4)',
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
  },
  secondaryTxt: { fontWeight: '800' },
  btn: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    borderColor: 'rgba(107, 104, 104, 0.4)',
  },
  btnPrimary: { backgroundColor: '#1d4ed8' },
  btnTxt: { fontWeight: '800' },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 12,
  },
  menuItem: {
    borderWidth: 1,
    padding: 8,
    borderRadius: 8,
    borderColor: 'rgba(107, 104, 104, 0.4)',
    backgroundColor: '#e2dfdf',
  },
  dateBtn: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'rgba(107, 104, 104, 0.4)',
    padding: 12,
    marginTop: 8,
  },
});
