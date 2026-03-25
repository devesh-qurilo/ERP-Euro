import React, { useEffect, useMemo, useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
  Platform,
} from 'react-native';
import { useSelector } from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker';

import { selectList as selectMyTasks } from '../../../shared/tasks/store/selectors';
import { selectMyTimesheets } from '../store/selectors';
import BottomSheetSelect from '../components/BottomSheetSelect';
import Icon from 'react-native-vector-icons/Ionicons';

/* ---------------- helpers ---------------- */

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
  const mm = Number(m[2]);
  if (h > 23 || mm > 59) return null;
  return h * 60 + mm;
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

/* ---------------- main ---------------- */

export default function AddTimeLogModal({
  visible,
  onClose,
  onSubmit,
  saving = false,
  editData = null,
}) {
  const tasks = useSelector(selectMyTasks);
  const timesheets = useSelector(selectMyTimesheets);
  const employeeId = timesheets?.[0]?.employeeId;

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
  const [projectOpen, setProjectOpen] = useState(false);
  const [taskOpen, setTaskOpen] = useState(false);

  /* ---------- derived options ---------- */

  const projectOptions = useMemo(() => {
    const map = new Map();
    tasks.forEach(t => {
      if (!map.has(t.projectId)) {
        map.set(t.projectId, {
          value: t.projectId,
          label: t.projectName || `Project #${t.projectId}`,
        });
      }
    });
    return Array.from(map.values());
  }, [tasks]);

  const taskOptions = useMemo(() => {
    return tasks
      .filter(t => t.projectId === projectId)
      .map(t => ({
        value: t.id,
        label: t.title,
        group: t.projectName,
      }));
  }, [tasks, projectId]);

  const selectedProject = useMemo(
    () => projectOptions.find(p => p.value === projectId),
    [projectOptions, projectId],
  );

  const selectedTask = useMemo(
    () => taskOptions.find(t => t.value === taskId),
    [taskOptions, taskId],
  );

  const totalHours = useMemo(
    () => diffHours(startDate, startTime, endDate, endTime),
    [startDate, startTime, endDate, endTime],
  );

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

  const handleSave = async () => {
    if (!projectId) return setError('Select project');
    if (!taskId) return setError('Select task');
    if (!startDate || !startTime || !endDate || !endTime)
      return setError('Select start & end date/time');
    if (totalHours <= 0) return setError('End must be after start');
    if (!memo.trim()) return setError('Memo required');

    setError('');

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

    try {
      await onSubmit(payload); // ✅ wait till API success
      onClose(); // ✅ CLOSE MODAL AFTER SUCCESS
    } catch (e) {
      setError(e?.message || 'Failed to save');
    }
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
            <Pressable onPress={onClose} hitSlop={10} style={styles.closeBtn}>
              <Icon name="close" size={26} color="#111827" />
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={styles.body}>
            {/* Project */}
            <FieldLabel required>Project</FieldLabel>
            <Pressable
              style={styles.input}
              onPress={() => setProjectOpen(true)}
            >
              <Text style={{ color: selectedProject ? '#111' : '#9ca3af' }}>
                {selectedProject?.label || 'Select Project'}
              </Text>
            </Pressable>

            <BottomSheetSelect
              visible={projectOpen}
              title="Select Project"
              value={projectId}
              options={projectOptions}
              onSelect={o => {
                setProjectId(o.value);
                setTaskId(null);
              }}
              onClose={() => setProjectOpen(false)}
            />

            {/* Task */}
            <FieldLabel required>Task</FieldLabel>
            <Pressable
              style={[
                styles.input,
                !projectId && { backgroundColor: '#f3f4f6' },
              ]}
              disabled={!projectId}
              onPress={() => setTaskOpen(true)}
            >
              <Text style={{ color: selectedTask ? '#111' : '#9ca3af' }}>
                {selectedTask?.label ||
                  (projectId ? 'Select Task' : 'Select project first')}
              </Text>
            </Pressable>

            <BottomSheetSelect
              visible={taskOpen}
              title="Select Task"
              value={taskId}
              options={taskOptions}
              onSelect={o => setTaskId(o.value)}
              onClose={() => setTaskOpen(false)}
            />

            {/* Dates / Times */}
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

            {picker.mode && (
              <DateTimePicker
                value={pickerValue}
                mode={picker.mode}
                is24Hour
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onPickerChange}
              />
            )}

            {/* Memo */}
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

/* ---------------- styles ---------------- */

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
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

  total: { marginTop: 10, fontWeight: '900' },
  err: { color: '#b00020', marginTop: 6 },

  saveBtn: {
    backgroundColor: '#1d4ed8',
    padding: 14,
    borderRadius: 12,
    marginTop: 12,
    alignItems: 'center',
  },
  saveTxt: { color: '#fff', fontWeight: '900' },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
  },
});
