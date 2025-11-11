import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
} from 'react-native';

export default function WeeklyTimesheetModal({
  visible,
  onClose,
  loading,
  weekly,
  onFetch,
  onCreate,
}) {
  const [taskId, setTaskId] = useState('');
  const [weekStart, setWeekStart] = useState('');
  const [h, setH] = useState([0, 0, 0, 0, 0, 0, 0]);

  useEffect(() => {
    if (!visible) {
      setTaskId('');
      setWeekStart('');
      setH([0, 0, 0, 0, 0, 0, 0]);
    }
  }, [visible]);

  const submit = () => {
    if (!taskId || !weekStart) return;
    onCreate({
      taskId: Number(taskId),
      weekStartDate: weekStart,
      day1Hours: +h[0],
      day2Hours: +h[1],
      day3Hours: +h[2],
      day4Hours: +h[3],
      day5Hours: +h[4],
      day6Hours: +h[5],
      day7Hours: +h[6],
    });
    onClose?.();
  };

  return !visible ? null : (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <View style={s.backdrop}>
        <View style={s.sheet}>
          <View style={s.header}>
            <Text style={s.h2}>Weekly Timesheet</Text>
            <Pressable onPress={onClose}>
              <Text style={{ fontWeight: '900' }}>✕</Text>
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={{ padding: 12, gap: 10 }}>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Field label="Task ID">
                <TextInput
                  style={s.input}
                  keyboardType="numeric"
                  value={taskId}
                  onChangeText={setTaskId}
                  placeholder="e.g. 5"
                  placeholderTextColor="#9ca3af"
                />
              </Field>
              <Field label="Week Start (YYYY-MM-DD)">
                <TextInput
                  style={s.input}
                  value={weekStart}
                  onChangeText={setWeekStart}
                  placeholder="2025-01-15"
                  placeholderTextColor="#9ca3af"
                />
              </Field>
              <Pressable
                onPress={() => weekStart && onFetch(weekStart)}
                style={s.secondaryBtn}
              >
                <Text style={s.secondaryTxt}>
                  {loading ? 'Loading…' : 'Fetch My Weekly'}
                </Text>
              </Pressable>
            </View>

            <Text style={s.sub}>Enter hours (Mon..Sun)</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => (
                <View key={d} style={{ width: 88 }}>
                  <Text style={s.small}>{d}</Text>
                  <TextInput
                    style={s.input}
                    keyboardType="numeric"
                    value={String(h[i])}
                    onChangeText={v => {
                      const x = [...h];
                      x[i] = v.replace(/[^0-9.]/g, '');
                      setH(x);
                    }}
                  />
                </View>
              ))}
            </View>

            {weekly && weekStart === weekly.weekStartDate && (
              <Text style={{ color: '#065f46', fontWeight: '900' }}>
                Existing total for {weekly.weekStartDate}: {weekly.totalHours}h
              </Text>
            )}

            <View style={{ flexDirection: 'row', gap: 10, marginTop: 8 }}>
              <Pressable onPress={submit} style={s.primaryBtn}>
                <Text style={s.primaryTxt}>Save Weekly</Text>
              </Pressable>
              <Pressable onPress={onClose} style={s.secondaryBtn}>
                <Text style={s.secondaryTxt}>Cancel</Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const Field = ({ label, children }) => (
  <View style={{ flex: 1 }}>
    <Text style={s.small}>{label}</Text>
    {children}
  </View>
);

const s = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '90%',
  },
  header: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  h2: { fontSize: 18, fontWeight: '900', color: '#0b0b0c' },
  small: { fontSize: 12, fontWeight: '800', color: '#374151', marginBottom: 6 },
  sub: { fontSize: 12, fontWeight: '900', color: '#111827' },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
    color: '#111827',
  },
  primaryBtn: {
    backgroundColor: '#1d4ed8',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  primaryTxt: { color: '#fff', fontWeight: '900' },
  secondaryBtn: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignSelf: 'flex-end',
  },
  secondaryTxt: { color: '#111827', fontWeight: '900' },
});
