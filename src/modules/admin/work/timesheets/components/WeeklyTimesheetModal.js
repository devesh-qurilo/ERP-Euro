import React, { useEffect, useMemo, useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useDispatch, useSelector } from 'react-redux';

import Icon from 'react-native-vector-icons/Ionicons';
import {
  selectFilters,
  selectMyTasks,
  selectList as selectTasks,
} from '../../../shared/tasks/store/selectors';
import {
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { fetchMyTasks } from '../../../shared/tasks/store/actions';

// const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const dayKeys = ['day1', 'day2', 'day3', 'day4', 'day5', 'day6', 'day7'];

const formatDay = date =>
  date.toLocaleDateString(undefined, { weekday: 'short' });

const formatDate = date =>
  date.toLocaleDateString(undefined, {
    day: '2-digit',
    month: 'short',
  });

const initialHours = () => dayKeys.reduce((a, k) => ({ ...a, [k]: '' }), {});

const numberOnly = v => String(v || '').replace(/[^\d.]/g, '');

export default function WeeklyTimesheetModal({
  visible,
  loading = false,
  onCreate,
  onClose,
}) {
  const dispatch = useDispatch();
  const tasks = useSelector(selectMyTasks);

  const [taskId, setTaskId] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [hours, setHours] = useState(initialHours());
  const [showPicker, setShowPicker] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (!visible) {
      setTaskId(null);
      setStartDate(null);
      setHours(initialHours());
      setSaving(false);
      setError('');
      setToast('');
    }
  }, [visible]);

  useEffect(() => {
    dispatch(fetchMyTasks());
  }, [visible]);

  const weekDates = useMemo(() => {
    if (!startDate) return [];
    return dayKeys.map((_, i) => {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      return d;
    });
  }, [startDate]);

  const total = useMemo(
    () => Object.values(hours).reduce((s, h) => s + (parseFloat(h) || 0), 0),
    [hours],
  );

  const setHour = (k, v) => {
    if (v === '') {
      setHours(h => ({ ...h, [k]: '' }));
      return;
    }

    const n = Math.min(24, Math.max(0, Number(numberOnly(v)) || 0));
    setHours(h => ({ ...h, [k]: String(n) }));
  };

  const buildDaysPayload = () =>
    weekDates
      .map((d, i) => {
        const h = Number(hours[dayKeys[i]] || 0);
        if (!h) return null;
        return { date: d.toISOString().slice(0, 10), hours: h };
      })
      .filter(Boolean);

  // const handleSave = async () => {
  //   setError('');
  //   setToast('');

  //   if (!taskId) return setError('Please select a task');
  //   if (!startDate) return setError('Please select week start date');

  //   const days = buildDaysPayload();
  //   if (!days.length) return setError('Enter hours for at least one day');

  //   try {
  //     setSaving(true);
  //     await onCreate({ taskId, days });
  //     setToast('Weekly timesheet saved successfully');
  //     setHours(initialHours());
  //   } catch (e) {
  //     setError(e?.message || 'Failed to save weekly timesheet');
  //   } finally {
  //     setSaving(false);
  //   }
  // };

  const handleSave = async () => {
    setError('');
    setToast('');

    if (!taskId) return setError('Please select a task');
    if (!startDate) return setError('Please select week start date');

    const days = buildDaysPayload();
    if (!days.length) return setError('Enter hours for at least one day');

    try {
      setSaving(true);
      await onCreate({ taskId, days });

      setToast('Weekly timesheet saved successfully');

      // ⏱ Small delay for UX, then close
      setTimeout(() => {
        onClose();
      }, 600);
    } catch (e) {
      setError(e?.message || 'Failed to save weekly timesheet');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.backdrop}>
            <View style={styles.sheet}>
              <ScrollView
                contentContainerStyle={styles.body}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                {/* Header */}
                <View style={styles.header}>
                  <Text style={styles.title}>Weekly Timesheet</Text>
                  <Pressable
                    onPress={onClose}
                    hitSlop={10}
                    style={styles.closeBtn}
                  >
                    <Icon name="close" size={26} color="#111827" />
                  </Pressable>
                </View>

                {/* <ScrollView contentContainerStyle={styles.body}> */}
                {/* Task */}
                <Text style={styles.label}>Task</Text>
                <View style={styles.select}>
                  <ScrollView style={{ maxHeight: 180 }}>
                    {tasks.map(t => (
                      <Pressable
                        key={t.id}
                        style={[
                          styles.option,
                          taskId === t.id && styles.optionActive,
                        ]}
                        onPress={() => setTaskId(t.id)}
                      >
                        <Text style={styles.optionTxt}>
                          #{t.id} — {t.title}
                        </Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                </View>

                {/* Week Picker */}
                <Text style={styles.label}>Week Start</Text>
                <Pressable
                  style={styles.dateBtn}
                  onPress={() => setShowPicker(true)}
                >
                  <Text style={styles.dateTxt}>
                    {startDate
                      ? startDate.toISOString().slice(0, 10)
                      : 'Select start date'}
                  </Text>
                </Pressable>

                {showPicker && (
                  <DateTimePicker
                    value={startDate || new Date()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={(_, d) => {
                      setShowPicker(false);
                      if (d) setStartDate(d);
                    }}
                  />
                )}

                {/* Week Grid */}
                <View style={styles.weekGrid}>
                  {dayKeys.map((k, i) => {
                    const d = weekDates[i];

                    return (
                      <View key={k} style={styles.dayCard}>
                        <Text style={styles.dayName}>
                          {d ? formatDay(d) : '--'}
                        </Text>

                        <Text style={styles.dayDate}>
                          {d ? formatDate(d) : '--'}
                        </Text>

                        <TextInput
                          editable={!!startDate}
                          keyboardType="numeric"
                          maxLength={2}
                          value={hours[k]}
                          onChangeText={v => setHour(k, v)}
                          style={[
                            styles.hourInput,
                            !startDate && styles.disabled,
                          ]}
                          placeholder="0"
                        />
                      </View>
                    );
                  })}
                </View>

                <Text style={styles.total}>Total: {total} hrs</Text>

                {!!error && <Text style={styles.error}>{error}</Text>}
                {!!toast && <Text style={styles.toast}>{toast}</Text>}

                <Pressable
                  disabled={saving || loading}
                  onPress={handleSave}
                  style={styles.primaryBtn}
                >
                  <Text style={styles.primaryTxt}>
                    {saving ? 'Saving…' : 'Save Weekly Timesheet'}
                  </Text>
                </Pressable>
              </ScrollView>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    maxHeight: '92%',
  },
  header: {
    padding: 14,
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: { fontSize: 18, fontWeight: '700' },
  close: { fontSize: 18, fontWeight: '700' },

  body: { padding: 14 },

  label: { fontSize: 12, fontWeight: '700', marginBottom: 6 },

  select: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    marginBottom: 12,
  },
  option: { padding: 12 },
  optionActive: { backgroundColor: '#eef2ff' },
  optionTxt: { fontWeight: '700' },

  dateBtn: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
  },
  dateTxt: { fontWeight: '700' },

  weekGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  dayCard: {
    width: '30%',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
  },
  dayName: { fontWeight: '700' },
  dayDate: { fontSize: 12, color: '#6b7280', marginBottom: 4 },
  hourInput: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    width: '100%',
    textAlign: 'center',
  },
  disabled: { backgroundColor: '#f3f4f6' },

  total: { marginTop: 12, fontWeight: '700' },
  error: { color: '#b00020', marginTop: 6 },
  toast: { color: '#065f46', marginTop: 6, fontWeight: '700' },

  primaryBtn: {
    backgroundColor: '#1d4ed8',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 14,
  },
  primaryTxt: { color: '#fff', fontWeight: '700' },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
  },
});
