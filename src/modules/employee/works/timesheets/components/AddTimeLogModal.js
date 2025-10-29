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
import { selectTasks } from '../../tasks/store/selectors';
import api from '../../../../../services/api'; // uses your axios instance

// Optional convenience if you prefer a tiny wrapper:
async function createTimesheet(payload) {
  // POST /timesheets
  const res = await api.post('/timesheets', payload);
  return res.data;
}

const Input = props => (
  <View style={{ marginBottom: 10 }}>
    <Text style={styles.label}>
      {props.label}{' '}
      {props.required ? <Text style={{ color: '#dc2626' }}>*</Text> : null}
    </Text>
    <TextInput
      {...props}
      style={[styles.input, props.style]}
      placeholderTextColor="#9ca3af"
      autoCapitalize="none"
    />
  </View>
);

export default function AddTimeLogModal({ visible, onClose, onSaved }) {
  // Pull *my tasks* to derive Project + Task options
  const myTasks = useSelector(selectTasks) || [];

  const projectOptions = useMemo(() => {
    const map = new Map();
    myTasks.forEach(t => {
      if (!map.has(t.projectId)) {
        map.set(t.projectId, {
          id: t.projectId,
          name: t.projectName || `Project #${t.projectId}`,
        });
      }
    });
    return Array.from(map.values());
  }, [myTasks]);

  const [projectId, setProjectId] = useState(null);
  const taskOptions = useMemo(
    () => myTasks.filter(t => (projectId ? t.projectId === projectId : true)),
    [myTasks, projectId],
  );

  // Form state
  const [taskId, setTaskId] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [memo, setMemo] = useState('');
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  // Clear form when closing/opening
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
      setSaving(false);
    }
  }, [visible]);

  // Basic validation
  const validate = () => {
    if (!projectId) return 'Please select a Project.';
    if (!taskId) return 'Please select a Task.';
    if (!startDate) return 'Please enter Start Date (YYYY-MM-DD).';
    if (!startTime) return 'Please enter Start Time (HH:mm:ss).';
    if (!endDate) return 'Please enter End Date (YYYY-MM-DD).';
    if (!endTime) return 'Please enter End Time (HH:mm:ss).';
    if (!memo.trim()) return 'Please add a Memo.';
    return '';
  };

  const handleSave = async () => {
    const v = validate();
    if (v) {
      setErr(v);
      return;
    }
    setErr('');
    setSaving(true);

    try {
      const payload = {
        projectId,
        taskId,
        // backend derives employeeId from token; if required, add here:
        // employeeId: 'EMP-010',
        startDate,
        startTime,
        endDate,
        endTime,
        memo: memo.trim(),
      };
      const created = await createTimesheet(payload);
      onSaved?.(created); // let parent refresh list (or push row)
      onClose?.();
    } catch (e) {
      setErr(e?.message || 'Failed to save time log.');
    } finally {
      setSaving(false);
    }
  };

  // simple dropdowns without 3rd-party libs
  const [openProj, setOpenProj] = useState(false);
  const [openTask, setOpenTask] = useState(false);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          {/* header */}
          <View style={styles.header}>
            <Text style={styles.title}>TimeLog Details</Text>
            <Pressable onPress={onClose} style={styles.close}>
              <Text style={{ fontWeight: '900' }}>✕</Text>
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={{ padding: 12 }}>
            {/* Project */}
            <Text style={styles.label}>
              Project <Text style={{ color: '#dc2626' }}>*</Text>
            </Text>
            <Pressable
              style={styles.selectBtn}
              onPress={() => setOpenProj(o => !o)}
            >
              <Text style={styles.value}>
                {projectId
                  ? projectOptions.find(p => p.id === projectId)?.name ||
                    `Project #${projectId}`
                  : 'Project Name'}
              </Text>
              <Text style={styles.caret}>{openProj ? '▴' : '▾'}</Text>
            </Pressable>
            {openProj && (
              <View style={styles.menu}>
                <ScrollView style={{ maxHeight: 220 }}>
                  {projectOptions.map(p => (
                    <Pressable
                      key={p.id}
                      style={styles.menuItem}
                      onPress={() => {
                        setProjectId(p.id);
                        setTaskId(null);
                        setOpenProj(false);
                      }}
                    >
                      <Text style={styles.menuTxt}>{p.name}</Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Task */}
            <Text style={[styles.label, { marginTop: 10 }]}>
              Task <Text style={{ color: '#dc2626' }}>*</Text>
            </Text>
            <Pressable
              style={styles.selectBtn}
              onPress={() => setOpenTask(o => !o)}
            >
              <Text style={styles.value}>
                {taskId
                  ? taskOptions.find(t => t.id === taskId)?.title ||
                    `#${taskId}`
                  : 'Task Name'}
              </Text>
              <Text style={styles.caret}>{openTask ? '▴' : '▾'}</Text>
            </Pressable>
            {openTask && (
              <View style={styles.menu}>
                <ScrollView style={{ maxHeight: 260 }}>
                  {taskOptions.map(t => (
                    <Pressable
                      key={t.id}
                      style={styles.menuItem}
                      onPress={() => {
                        setTaskId(t.id);
                        setOpenTask(false);
                      }}
                    >
                      <Text style={styles.menuTxt} numberOfLines={1}>
                        {t.title}
                      </Text>
                      <Text style={styles.menuHint}>
                        #{String(t.id).padStart(3, '0')} •{' '}
                        {t.taskStage?.name || '—'}
                      </Text>
                    </Pressable>
                  ))}
                  {!taskOptions.length && (
                    <Text
                      style={[
                        styles.menuTxt,
                        { padding: 10, color: '#6b7280' },
                      ]}
                    >
                      Select a project first.
                    </Text>
                  )}
                </ScrollView>
              </View>
            )}

            {/* (optional) employee inline preview from first task assignee */}
            {taskId ? (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                  marginTop: 10,
                }}
              >
                {taskOptions.find(t => t.id === taskId)?.assignedEmployees?.[0]
                  ?.profileUrl ? (
                  <Image
                    source={{
                      uri: taskOptions.find(t => t.id === taskId)
                        .assignedEmployees[0].profileUrl,
                    }}
                    style={{ width: 36, height: 36, borderRadius: 18 }}
                  />
                ) : (
                  <View
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 18,
                      backgroundColor: '#f3f4f6',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text>👤</Text>
                  </View>
                )}
                <View>
                  <Text style={{ fontWeight: '900', color: '#111827' }}>
                    {taskOptions.find(t => t.id === taskId)
                      ?.assignedEmployees?.[0]?.name || '—'}
                  </Text>
                  <Text style={{ color: '#6b7280' }}>Trainee</Text>
                </View>
              </View>
            ) : null}

            {/* Dates/Times */}
            <Input
              label="Start Date"
              required
              placeholder="YYYY-MM-DD"
              value={startDate}
              onChangeText={setStartDate}
            />
            <Input
              label="Start Time"
              required
              placeholder="HH:mm:ss"
              value={startTime}
              onChangeText={setStartTime}
            />
            <Input
              label="End Date"
              required
              placeholder="YYYY-MM-DD"
              value={endDate}
              onChangeText={setEndDate}
            />
            <Input
              label="End Time"
              required
              placeholder="HH:mm:ss"
              value={endTime}
              onChangeText={setEndTime}
            />
            <Input
              label="Memo"
              required
              placeholder="Worked on project tasks"
              value={memo}
              onChangeText={setMemo}
            />

            {!!err && <Text style={styles.err}>Error: {err}</Text>}

            {/* Buttons */}
            <View style={{ flexDirection: 'row', gap: 12, marginTop: 6 }}>
              <Pressable
                onPress={handleSave}
                style={[styles.saveBtn, saving && { opacity: 0.7 }]}
                disabled={saving}
              >
                <Text style={styles.saveTxt}>
                  {saving ? 'Saving…' : 'Save'}
                </Text>
              </Pressable>
              <Pressable onPress={onClose} style={styles.cancelBtn}>
                <Text style={styles.cancelTxt}>Cancel</Text>
              </Pressable>
            </View>
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
    maxHeight: '92%',
  },

  header: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: { fontSize: 22, fontWeight: '900', color: '#111827' },
  close: { padding: 6 },

  label: { fontSize: 14, fontWeight: '900', color: '#374151', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
    color: '#111827',
  },

  selectBtn: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  value: { flex: 1, color: '#111827' },
  caret: { color: '#6b7280' },

  menu: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    backgroundColor: '#fff',
    overflow: 'hidden',
    marginTop: 6,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#f1f5f9',
  },
  menuTxt: { color: '#111827', fontWeight: '900' },
  menuHint: { color: '#6b7280', fontSize: 12 },

  saveBtn: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  saveTxt: { color: '#fff', fontWeight: '900', fontSize: 16 },

  cancelBtn: {
    backgroundColor: '#eef2ff',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#c7d2fe',
  },
  cancelTxt: { color: '#3b82f6', fontWeight: '900', fontSize: 16 },

  err: { color: '#b00020', marginTop: 8 },
});
