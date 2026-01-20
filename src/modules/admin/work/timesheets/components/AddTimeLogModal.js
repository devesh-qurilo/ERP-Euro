import React, { useEffect, useMemo, useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Image,
  Platform,
  TextInput,
} from 'react-native';
import { useSelector } from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker';

import { selectList as selectMyTasks } from '../../../shared/tasks/store/selectors';
import { selectMyTimesheets } from '../store/selectors';

/* ----------------------------- helpers ----------------------------- */

const FieldLabel = ({ children, required }) => (
  <Text style={styles.label}>
    {children} {required && <Text style={{ color: '#ef4444' }}>*</Text>}
  </Text>
);

const parseHM = s => {
  if (!s) return null;
  const m = s.match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return null;
  const h = Number(m[1]);
  const mnt = Number(m[2]);
  if (h > 23 || mnt > 59) return null;
  return h * 60 + mnt;
};

const diffHours = (sd, st, ed, et) => {
  const d1 = sd ? new Date(sd) : null;
  const d2 = ed ? new Date(ed) : null;
  const m1 = parseHM(st);
  const m2 = parseHM(et);
  if (!d1 || !d2 || m1 == null || m2 == null) return 0;

  const start = new Date(
    d1.getFullYear(),
    d1.getMonth(),
    d1.getDate(),
    Math.floor(m1 / 60),
    m1 % 60,
  );
  const end = new Date(
    d2.getFullYear(),
    d2.getMonth(),
    d2.getDate(),
    Math.floor(m2 / 60),
    m2 % 60,
  );

  const ms = end - start;
  return ms > 0 ? +(ms / 3600000).toFixed(2) : 0;
};

/* ----------------------------- main ----------------------------- */

export default function AddTimeLogModal({
  visible,
  onClose,
  onSubmit,
  saving = false,
  editData = null, // 👈 important
}) {
  const tasks = useSelector(selectMyTasks);
  const list = useSelector(selectMyTimesheets);
  const employeeId = list?.[0]?.employeeId;

  /* ---------- state ---------- */
  const [projectId, setProjectId] = useState(null);
  const [taskId, setTaskId] = useState(null);

  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');

  const [memo, setMemo] = useState('');
  const [error, setError] = useState('');

  const [picker, setPicker] = useState({ mode: null, field: null });

  /* ---------- prefill / reset ---------- */
  useEffect(() => {
    if (!visible) return;

    if (editData) {
      setProjectId(editData.projectId ?? null);
      setTaskId(editData.taskId ?? null);
      setStartDate(editData.startDate ?? '');
      setStartTime(editData.startTime?.slice(0, 5) ?? '');
      setEndDate(editData.endDate ?? '');
      setEndTime(editData.endTime?.slice(0, 5) ?? '');
      setMemo(editData.memo ?? '');
    } else {
      setProjectId(null);
      setTaskId(null);
      setStartDate('');
      setStartTime('');
      setEndDate('');
      setEndTime('');
      setMemo('');
    }
    setError('');
  }, [visible, editData]);

  /* ---------- derived ---------- */
  const projects = useMemo(() => {
    const map = new Map();
    tasks.forEach(t => {
      if (!map.has(t.projectId)) {
        map.set(t.projectId, {
          id: t.projectId,
          name: t.projectName || `Project #${t.projectId}`,
        });
      }
    });
    return Array.from(map.values());
  }, [tasks]);

  const filteredTasks = useMemo(
    () => tasks.filter(t => (projectId ? t.projectId === projectId : true)),
    [tasks, projectId],
  );

  const totalHours = useMemo(
    () => diffHours(startDate, startTime, endDate, endTime),
    [startDate, startTime, endDate, endTime],
  );

  /* ---------- picker ---------- */
  const openPicker = (mode, field) => setPicker({ mode, field });
  const closePicker = () => setPicker({ mode: null, field: null });

  const pickerValue = useMemo(() => {
    if (picker.field === 'startDate' && startDate) return new Date(startDate);
    if (picker.field === 'endDate' && endDate) return new Date(endDate);
    if (picker.field === 'startTime' && startTime) {
      const [h, m] = startTime.split(':');
      const d = new Date();
      d.setHours(h, m, 0, 0);
      return d;
    }
    if (picker.field === 'endTime' && endTime) {
      const [h, m] = endTime.split(':');
      const d = new Date();
      d.setHours(h, m, 0, 0);
      return d;
    }
    return new Date();
  }, [picker, startDate, endDate, startTime, endTime]);

  const onPickerChange = (_, d) => {
    if (!d) return closePicker();

    const date = d.toISOString().slice(0, 10);
    const time = d.toTimeString().slice(0, 5);

    if (picker.field === 'startDate') setStartDate(date);
    if (picker.field === 'endDate') setEndDate(date);
    if (picker.field === 'startTime') setStartTime(time);
    if (picker.field === 'endTime') setEndTime(time);

    closePicker();
  };

  /* ---------- submit ---------- */
  const handleSave = () => {
    if (!projectId) return setError('Select project');
    if (!taskId) return setError('Select task');
    if (!startDate || !startTime || !endDate || !endTime)
      return setError('Select start and end date/time');
    if (totalHours <= 0) return setError('End must be after start');
    if (!memo.trim()) return setError('Memo required');

    const payload = {
      projectId,
      taskId,
      startDate,
      startTime,
      endDate,
      endTime,
      employeeId,
      memo: memo.trim(),
    };

    if (editData?.id) payload.id = editData.id;

    onSubmit(payload);
  };

  if (!visible) return null;

  return (
    <Modal visible transparent animationType="slide">
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {editData ? 'Edit Time Log' : 'Add Time Log'}
            </Text>
            <Pressable onPress={onClose}>
              <Text style={{ fontWeight: '900' }}>✕</Text>
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={styles.body}>
            <FieldLabel required>Project</FieldLabel>
            {projects.map(p => (
              <Pressable
                key={p.id}
                style={[
                  styles.option,
                  projectId === p.id && styles.optionActive,
                ]}
                onPress={() => setProjectId(p.id)}
              >
                <Text>{p.name}</Text>
              </Pressable>
            ))}

            <FieldLabel required>Task</FieldLabel>
            {filteredTasks.map(t => (
              <Pressable
                key={t.id}
                style={[styles.option, taskId === t.id && styles.optionActive]}
                onPress={() => setTaskId(t.id)}
              >
                <Text>{t.title}</Text>
              </Pressable>
            ))}

            <FieldLabel required>Start Date</FieldLabel>
            <Pressable
              style={styles.input}
              onPress={() => openPicker('date', 'startDate')}
            >
              <Text>{startDate || 'Select date'}</Text>
            </Pressable>

            <FieldLabel required>Start Time</FieldLabel>
            <Pressable
              style={styles.input}
              onPress={() => openPicker('time', 'startTime')}
            >
              <Text>{startTime || 'Select time'}</Text>
            </Pressable>
            {picker.mode && (
              <DateTimePicker
                value={pickerValue}
                mode={picker.mode}
                is24Hour
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onPickerChange}
              />
            )}

            <FieldLabel required>End Date</FieldLabel>
            <Pressable
              style={styles.input}
              onPress={() => openPicker('date', 'endDate')}
            >
              <Text>{endDate || 'Select date'}</Text>
            </Pressable>

            <FieldLabel required>End Time</FieldLabel>
            <Pressable
              style={styles.input}
              onPress={() => openPicker('time', 'endTime')}
            >
              <Text>{endTime || 'Select time'}</Text>
            </Pressable>

            <FieldLabel required>Memo</FieldLabel>
            <TextInput
              value={memo}
              onChangeText={setMemo}
              style={[styles.input, { height: 90 }]}
              multiline
            />

            <Text style={styles.total}>Total: {totalHours} hrs</Text>
            {!!error && <Text style={styles.err}>{error}</Text>}

            <Pressable
              style={styles.saveBtn}
              onPress={handleSave}
              disabled={saving}
            >
              <Text style={styles.saveTxt}>{saving ? 'Saving…' : 'Save'}</Text>
            </Pressable>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

/* ----------------------------- styles ----------------------------- */

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '92%',
  },
  header: {
    padding: 14,
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: { fontSize: 18, fontWeight: '900' },
  body: { padding: 14 },

  label: { fontSize: 12, fontWeight: '800', marginTop: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
  },

  option: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    marginBottom: 6,
  },
  optionActive: { backgroundColor: '#eef2ff' },

  total: { marginTop: 10, fontWeight: '900' },
  err: { color: '#b00020', marginTop: 6 },

  saveBtn: {
    backgroundColor: '#111827',
    padding: 14,
    borderRadius: 12,
    marginTop: 12,
    alignItems: 'center',
  },
  saveTxt: { color: '#fff', fontWeight: '900' },
});
