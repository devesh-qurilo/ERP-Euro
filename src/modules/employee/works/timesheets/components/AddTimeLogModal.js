// src/modules/employee/works/timesheets/components/AddTimeLogModal.js
import React, { useEffect, useMemo, useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
  Image,
} from 'react-native';
import { useSelector } from 'react-redux';
import { selectTasks as selectMyTasks } from '../../tasks/store/selectors'; // <- your tasks selector path
import { selectMyTimesheets } from '../store/selectors';

/* ----------------------------- tiny components ---------------------------- */
const FieldLabel = ({ children, required }) => (
  <Text style={styles.label}>
    {children} {required ? <Text style={{ color: '#ef4444' }}>*</Text> : null}
  </Text>
);

const Select = ({ placeholder = 'Select', value, onChange, options = [] }) => {
  const [open, setOpen] = useState(false);
  const current = options.find(o => String(o.value) === String(value));
  return (
    <View style={{ marginBottom: 12 }}>
      <Pressable
        style={styles.selectBtn}
        onPress={() => setOpen(o => !o)}
        accessibilityRole="button"
      >
        <Text style={[styles.value, !current && { color: '#9ca3af' }]}>
          {current ? current.label : placeholder}
        </Text>
        <Text style={styles.caret}>{open ? '▴' : '▾'}</Text>
      </Pressable>
      {open && (
        <View style={styles.menu}>
          <ScrollView style={{ maxHeight: 220 }}>
            {options.map(o => (
              <Pressable
                key={String(o.value)}
                onPress={() => {
                  onChange(o.value, o);
                  setOpen(false);
                }}
                style={styles.menuItem}
              >
                <Text style={styles.menuTxt} numberOfLines={1}>
                  {o.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

/* -------------------------------- utilities ------------------------------- */
const parseHM = s => {
  // "09:00" -> minutes since 00:00  (returns null on bad input)
  if (!s || typeof s !== 'string') return null;
  const m = s.match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return null;
  const hh = Number(m[1]);
  const mm = Number(m[2]);
  if (hh > 23 || mm > 59) return null;
  return hh * 60 + mm;
};

const diffHours = (sd, st, ed, et) => {
  const d1 = sd ? new Date(sd) : null;
  const d2 = ed ? new Date(ed) : null;
  const m1 = parseHM(st);
  const m2 = parseHM(et);
  if (!d1 || !d2 || m1 == null || m2 == null) return 0;
  // build full Date objects with local time
  const start = new Date(
    d1.getFullYear(),
    d1.getMonth(),
    d1.getDate(),
    Math.floor(m1 / 60),
    m1 % 60,
    0,
    0,
  );
  const end = new Date(
    d2.getFullYear(),
    d2.getMonth(),
    d2.getDate(),
    Math.floor(m2 / 60),
    m2 % 60,
    0,
    0,
  );
  const ms = end.getTime() - start.getTime();
  if (Number.isNaN(ms) || ms <= 0) return 0;
  return +(ms / 3600000).toFixed(2);
};

/* ---------------------------------- main ---------------------------------- */
export default function AddTimeLogModal({
  visible,
  onClose,
  onSubmit,
  tasks: tasksProp, // optional; if not passed, we read from store
  employee, // optional {name, profileUrl, roleText}
  saving = false, // optional: show "Saving…" on Save button
}) {
  // tasks source
  const tasksFromStore = useSelector(selectMyTasks);
  const tasks =
    tasksProp && Array.isArray(tasksProp) ? tasksProp : tasksFromStore;

  // project list derived from tasks (unique)
  const projectOptions = useMemo(() => {
    const map = new Map();
    tasks.forEach(t => {
      const pid = t.projectId;
      const label = t.projectName || `Project #${pid}`;
      if (!map.has(pid)) map.set(pid, { value: pid, label });
    });
    return Array.from(map.values());
  }, [tasks]);

  // tasks filtered by selected project
  const taskOptions = useMemo(() => {
    if (!tasks?.length) return [];
    if (!projectOptions.length) return [];
    return tasks
      .filter(t => (projectId ? t.projectId === projectId : true))
      .map(t => ({ value: t.id, label: t.title || `Task #${t.id}` }));
  }, [tasks]); // eslint-disable-line react-hooks/exhaustive-deps

  // form state
  const [projectId, setProjectId] = useState(null);
  const [taskId, setTaskId] = useState(null);
  const [startDate, setStartDate] = useState(''); // YYYY-MM-DD
  const [startTime, setStartTime] = useState(''); // HH:MM
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [memo, setMemo] = useState('');
  const [err, setErr] = useState('');

  // reset when opened/closed
  useEffect(() => {
    if (!visible) {
      setProjectId(null);
      setTaskId(null);
      setStartDate('');
      setStartTime('');
      setEndDate('');
      setEndTime('');
      setMemo('');
      setErr('');
    }
  }, [visible]);

  // when project changes, filter tasks and clear selected task if not in list
  useEffect(() => {
    if (!projectId || !taskId) return;
    const ok = tasks.some(t => t.id === taskId && t.projectId === projectId);
    if (!ok) setTaskId(null);
  }, [projectId, taskId, tasks]);

  const totalHours = useMemo(
    () => diffHours(startDate, startTime, endDate, endTime),
    [startDate, startTime, endDate, endTime],
  );

  const validate = () => {
    if (!projectId) return 'Please select a project.';
    if (!taskId) return 'Please select a task.';
    if (!startDate) return 'Start date is required (YYYY-MM-DD).';
    if (!startTime) return 'Start time is required (HH:MM).';
    if (!endDate) return 'End date is required (YYYY-MM-DD).';
    if (!endTime) return 'End time is required (HH:MM).';
    if (parseHM(startTime) == null)
      return 'Invalid start time. Use HH:MM (24h).';
    if (parseHM(endTime) == null) return 'Invalid end time. Use HH:MM (24h).';
    if (diffHours(startDate, startTime, endDate, endTime) <= 0)
      return 'End must be after start.';
    if (!memo.trim()) return 'Memo is required.';
    return '';
  };

  const list = useSelector(selectMyTimesheets);
  const emp = list[0]?.employeeId;

  const handleSave = () => {
    const v = validate();
    if (v) {
      setErr(v);
      return;
    }
    setErr('');
    const payload = {
      projectId,
      taskId,
      startDate,
      startTime,
      endDate,
      endTime,
      employeeId: emp,
      memo: memo.trim(),
    };
    console.log('[TimeLog][REQUEST] payload ->', payload);
    onSubmit?.(payload);
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.h1}>TimeLog Details</Text>
            <Pressable onPress={onClose} hitSlop={10}>
              <Text style={{ fontWeight: '900' }}>✕</Text>
            </Pressable>
          </View>

          <ScrollView
            contentContainerStyle={{ padding: 14, paddingBottom: 24 }}
            showsVerticalScrollIndicator={false}
          >
            {/* Project */}
            <FieldLabel required>Project</FieldLabel>
            <Select
              placeholder="Project Name"
              value={projectId}
              onChange={v => setProjectId(v)}
              options={projectOptions}
            />

            {/* Task */}
            <FieldLabel required>Task</FieldLabel>
            <Select
              placeholder="Task Name"
              value={taskId}
              onChange={v => setTaskId(v)}
              options={
                projectId
                  ? tasks
                      .filter(t => t.projectId === projectId)
                      .map(t => ({
                        value: t.id,
                        label: t.title || `Task #${t.id}`,
                      }))
                  : taskOptions
              }
            />

            {/* Employee (read-only display if provided) */}
            {employee ? (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                  marginTop: 6,
                }}
              >
                {employee.profileUrl ? (
                  <Image
                    source={{ uri: employee.profileUrl }}
                    style={styles.avatar}
                  />
                ) : (
                  <View style={[styles.avatar, styles.avatarEmpty]}>
                    <Text>👤</Text>
                  </View>
                )}
                <View>
                  <Text style={styles.empName}>{employee.name}</Text>
                  <Text style={styles.dim}>
                    {employee.roleText || 'Trainee'}
                  </Text>
                </View>
              </View>
            ) : null}

            {/* Dates / Times */}
            <View style={{ marginTop: 10 }}>
              <FieldLabel required>Start Date</FieldLabel>
              <TextInput
                value={startDate}
                onChangeText={setStartDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#9ca3af"
                style={styles.input}
              />
              <FieldLabel required>Start Time</FieldLabel>
              <TextInput
                value={startTime}
                onChangeText={setStartTime}
                placeholder="HH:MM:SS (24h)"
                placeholderTextColor="#9ca3af"
                style={styles.input}
                autoCapitalize="none"
              />

              <FieldLabel required>End Date</FieldLabel>
              <TextInput
                value={endDate}
                onChangeText={setEndDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#9ca3af"
                style={styles.input}
              />
              <FieldLabel required>End Time</FieldLabel>
              <TextInput
                value={endTime}
                onChangeText={setEndTime}
                placeholder="HH:MM:SS (24h)"
                placeholderTextColor="#9ca3af"
                style={styles.input}
                autoCapitalize="none"
              />
            </View>

            {/* Memo */}
            <FieldLabel required>Memo</FieldLabel>
            <TextInput
              value={memo}
              onChangeText={setMemo}
              placeholder="What did you work on?"
              placeholderTextColor="#9ca3af"
              style={[styles.input, { height: 92, textAlignVertical: 'top' }]}
              multiline
            />

            {/* total hours */}
            <Text style={styles.totalLabel}>Total Hours</Text>
            <Text style={styles.totalValue}>{totalHours}h</Text>

            {err ? <Text style={styles.err}>{err}</Text> : null}

            {/* actions */}
            <View style={{ flexDirection: 'row', gap: 12, marginTop: 12 }}>
              <Pressable
                onPress={handleSave}
                style={[
                  styles.primaryBtn,
                  { backgroundColor: '#3b82f6', borderColor: '#3b82f6' },
                  saving && { opacity: 0.6 },
                ]}
                disabled={saving}
              >
                <Text style={[styles.primaryTxt, { color: '#fff' }]}>
                  {saving ? 'Saving…' : 'Save'}
                </Text>
              </Pressable>
              <Pressable onPress={onClose} style={styles.secondaryBtn}>
                <Text style={styles.secondaryTxt}>Cancel</Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

/* ---------------------------------- styles -------------------------------- */
const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '92%',
  },
  header: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  h1: { fontSize: 22, fontWeight: '900', color: '#0b0b0c' },

  label: {
    fontSize: 12,
    fontWeight: '800',
    color: '#374151',
    marginBottom: 6,
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#111827',
    marginBottom: 8,
  },

  selectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 10,
  },
  value: { flex: 1, color: '#111827' },
  caret: { color: '#6b7280' },
  menu: {
    position: 'absolute',
    top: 46,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
    zIndex: 50,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#f1f5f9',
  },
  menuTxt: { color: '#111827' },

  avatar: { width: 40, height: 40, borderRadius: 20 },
  avatarEmpty: {
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  empName: { fontWeight: '900', color: '#111827' },
  dim: { color: '#6b7280' },

  totalLabel: { marginTop: 8, color: '#374151', fontWeight: '800' },
  totalValue: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1d4ed8',
    marginTop: 2,
  },

  primaryBtn: {
    borderWidth: 1,
    borderColor: '#1d4ed8',
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  primaryTxt: { fontWeight: '900', color: '#111827' },

  secondaryBtn: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  secondaryTxt: { fontWeight: '900', color: '#111827' },

  err: { color: '#b00020', marginTop: 8, fontWeight: '800' },
});
