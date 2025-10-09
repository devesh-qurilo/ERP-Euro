// src/modules/employee/hr/components/ApplyLeaveModal.js
import React, { useMemo, useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { pick, types, isCancel } from '@react-native-documents/picker';
import { useDispatch, useSelector } from 'react-redux';
import { applyLeave } from '../store/actions';
import {
  selectApplyLoading,
  selectApplyError,
  selectApplyCreated,
} from '../store/selectors';

const TYPES = ['CASUAL', 'SICK', 'EARNED'];
const DURATIONS = ['FULL_DAY', 'MULTIPLE']; // keep simple for now

function Chip({ selected, onPress, children }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, selected ? styles.chipOn : styles.chipOff]}
    >
      <Text
        style={[
          styles.chipTxt,
          selected ? styles.chipTxtOn : styles.chipTxtOff,
        ]}
      >
        {children}
      </Text>
    </Pressable>
  );
}

export default function ApplyLeaveModal({ visible, onClose }) {
  const dispatch = useDispatch();
  const loading = useSelector(selectApplyLoading);
  const error = useSelector(selectApplyError);
  const created = useSelector(selectApplyCreated);

  const [leaveType, setLeaveType] = useState('CASUAL');
  const [durationType, setDurationType] = useState('FULL_DAY');
  const [singleDate, setSingleDate] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [files, setFiles] = useState([]);

  // close after success
  useEffect(() => {
    if (visible && created) {
      Alert.alert('Submitted', 'Your leave request has been submitted.');
      onClose?.();
      // reset
      setSingleDate('');
      setStartDate('');
      setEndDate('');
      setReason('');
      setFiles([]);
    }
  }, [created, visible, onClose]);

  const canSubmit = useMemo(() => {
    if (!reason.trim()) return false;
    if (durationType === 'FULL_DAY') return !!singleDate;
    if (durationType === 'MULTIPLE') return !!startDate && !!endDate;
    return false;
  }, [durationType, singleDate, startDate, endDate, reason]);

  const pickDocs = async () => {
    try {
      const res = await pick({
        allowMultiSelection: true,
        // restrict as you prefer:
        // type: [types.pdf, types.images, types.doc, types.docx],
        type: [types.allFiles],
      });
      // res is an array: [{ uri, name, size, mimeType, lastModified, fileCopyUri? }, ...]
      setFiles(res);
    } catch (e) {
      if (!isCancel(e)) {
        Alert.alert('Picker error', String(e?.message || e));
      }
    }
  };

  const onSubmit = () => {
    const payload = {
      leaveData:
        durationType === 'FULL_DAY'
          ? { leaveType, durationType, singleDate, reason }
          : { leaveType, durationType, startDate, endDate, reason },

      // optional; your backend can use uri/name/mimeType/size
      documents: files,
    };
    dispatch(applyLeave(payload));
  };

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Apply for Leave</Text>
            <Pressable onPress={onClose} style={styles.close}>
              <Text style={styles.closeTxt}>✕</Text>
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={{ paddingBottom: 12 }}>
            {/* Leave Type */}
            <Text style={styles.label}>Leave Type</Text>
            <View style={styles.rowWrap}>
              {TYPES.map(t => (
                <Chip
                  key={t}
                  selected={leaveType === t}
                  onPress={() => setLeaveType(t)}
                >
                  {t[0] + t.slice(1).toLowerCase()}
                </Chip>
              ))}
            </View>

            {/* Duration */}
            <Text style={[styles.label, { marginTop: 12 }]}>Duration</Text>
            <View style={styles.rowWrap}>
              {DURATIONS.map(d => (
                <Chip
                  key={d}
                  selected={durationType === d}
                  onPress={() => setDurationType(d)}
                >
                  {d === 'FULL_DAY' ? 'Full Day' : 'Multiple Days'}
                </Chip>
              ))}
            </View>

            {/* Dates */}
            {durationType === 'FULL_DAY' ? (
              <View style={{ marginTop: 12 }}>
                <Text style={styles.label}>Date (YYYY-MM-DD)</Text>
                <TextInput
                  placeholder="2025-02-25"
                  value={singleDate}
                  onChangeText={setSingleDate}
                  autoCapitalize="none"
                  style={styles.input}
                />
              </View>
            ) : (
              <View style={[styles.row, { marginTop: 12 }]}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Start (YYYY-MM-DD)</Text>
                  <TextInput
                    placeholder="2025-02-01"
                    value={startDate}
                    onChangeText={setStartDate}
                    autoCapitalize="none"
                    style={styles.input}
                  />
                </View>
                <View style={{ width: 12 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>End (YYYY-MM-DD)</Text>
                  <TextInput
                    placeholder="2025-02-05"
                    value={endDate}
                    onChangeText={setEndDate}
                    autoCapitalize="none"
                    style={styles.input}
                  />
                </View>
              </View>
            )}

            {/* Reason */}
            <View style={{ marginTop: 12 }}>
              <Text style={styles.label}>Reason</Text>
              <TextInput
                placeholder="Family function"
                value={reason}
                onChangeText={setReason}
                multiline
                style={[styles.input, { height: 96, textAlignVertical: 'top' }]}
              />
            </View>

            {/* Documents */}
            <View style={{ marginTop: 12 }}>
              <Text style={styles.label}>Documents (optional)</Text>
              <View
                style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
              >
                <Pressable onPress={pickDocs} style={styles.fileBtn}>
                  <Text style={styles.fileBtnTxt}>Pick Files</Text>
                </Pressable>
                <Text style={{ color: '#6b7280' }}>
                  {files.length ? `${files.length} selected` : 'None'}
                </Text>
              </View>
            </View>

            {error ? (
              <Text style={styles.err}>Error: {String(error)}</Text>
            ) : null}

            {/* Submit */}
            <Pressable
              disabled={!canSubmit || loading}
              onPress={onSubmit}
              style={[
                styles.submitBtn,
                (!canSubmit || loading) && { opacity: 0.6 },
              ]}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitTxt}>Submit</Text>
              )}
            </Pressable>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.28)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '88%',
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  title: { fontSize: 18, fontWeight: '900', color: '#0b0b0c' },
  close: { padding: 6 },
  closeTxt: { fontSize: 18 },
  label: { fontSize: 13, fontWeight: '800', color: '#374151', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#111827',
  },
  row: { flexDirection: 'row' },
  rowWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
  },
  chipOn: { backgroundColor: '#eef2ff', borderColor: '#c7d2fe' },
  chipOff: { backgroundColor: '#fff', borderColor: '#e5e7eb' },
  chipTxt: { fontSize: 13, fontWeight: '800' },
  chipTxtOn: { color: '#4338ca' },
  chipTxtOff: { color: '#374151' },
  fileBtn: {
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  fileBtnTxt: { color: '#111827', fontWeight: '800' },
  err: { color: '#b00020', marginTop: 8 },
  submitBtn: {
    marginTop: 16,
    backgroundColor: '#2c7be5',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitTxt: { color: '#fff', fontWeight: '900' },
});
