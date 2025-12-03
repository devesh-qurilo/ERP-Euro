// src/modules/admin/hr/attendance/components/MarkAttendanceModal.js
import React, { useMemo, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useSelector } from 'react-redux';
import { selectDepartments } from '../../departments/store/selectors';
import { selectEmpList } from '../../employees/store/selectors';
import { selectAttSaving } from '../store/selectors';

const Select = ({ label, value, options, onChange, style }) => {
  const [open, setOpen] = useState(false);
  return (
    <View style={[{ minWidth: 160, marginRight: 8, marginBottom: 8 }, style]}>
      <Text style={styles.label}>{label}</Text>
      <Pressable style={styles.selectBtn} onPress={() => setOpen(o => !o)}>
        <Text style={styles.value} numberOfLines={1}>
          {value ?? '—'}
        </Text>
        <Text style={styles.caret}>{open ? '▴' : '▾'}</Text>
      </Pressable>
      {open && (
        <View style={styles.menu}>
          {options.map(opt => (
            <Pressable
              key={String(opt.value ?? opt)}
              onPress={() => {
                onChange(opt.value ?? opt);
                setOpen(false);
              }}
              style={styles.menuItem}
            >
              <Text style={styles.menuTxt}>{String(opt.label ?? opt)}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
};

export default function MarkAttendanceModal({ visible, onClose, onSave }) {
  const departments = useSelector(selectDepartments);
  const employees = useSelector(selectEmpList);
  const saving = useSelector(selectAttSaving);

  // form state
  const [mode, setMode] = useState('date'); // 'date' | 'month'
  const [departmentId, setDept] = useState('');
  const [empIds, setEmpIds] = useState([]);
  const [datesCSV, setDatesCSV] = useState('');
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [month, setMonth] = useState(String(new Date().getMonth() + 1)); // 1..12

  const [clockInTime, setIn] = useState('09:00:00');
  const [clockOutTime, setOut] = useState('17:00:00');
  const [location, setLoc] = useState('Office');
  const [workingFrom, setWF] = useState('Office');
  const [late, setLate] = useState(false);
  const [halfDay, setHalf] = useState(false);
  const [overwrite, setOverwrite] = useState(false);

  const deptOptions = useMemo(
    () => [
      { label: 'All', value: '' },
      ...departments.map(d => ({
        label: d.departmentName,
        value: String(d.id),
      })),
    ],
    [departments],
  );
  const empOptions = useMemo(
    () =>
      employees.map(e => ({
        label: `${e.name} (${e.employeeId})`,
        value: e.employeeId,
      })),
    [employees],
  );

  const toggleEmp = id => {
    setEmpIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id],
    );
  };

  const submit = () => {
    const payloadCore = {
      payload: {
        clockInTime,
        clockInLocation: location,
        clockInWorkingFrom: workingFrom,
        clockOutTime,
        clockOutLocation: location,
        clockOutWorkingFrom: workingFrom,
        late,
        halfDay,
      },
      overwrite,
      markedBy: empIds[0], // fallback to current admin if you store it
    };

    if (mode === 'date') {
      const dates = datesCSV
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);
      onSave({
        type: 'dates',
        body: { employeeIds: empIds, dates, ...payloadCore },
      });
    } else {
      onSave({
        type: 'month',
        body: {
          year: Number(year),
          month: Number(month),
          employeeIds: empIds,
          ...payloadCore,
        },
      });
    }
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
          <Text style={styles.title}>Mark Attendance</Text>

          {/* Mode pills */}
          <View style={{ flexDirection: 'row', marginBottom: 10, gap: 8 }}>
            {['date', 'month'].map(m => (
              <Pressable
                key={m}
                onPress={() => setMode(m)}
                style={[styles.pill, mode === m && styles.pillActive]}
              >
                <Text
                  style={[styles.pillTxt, mode === m && styles.pillTxtActive]}
                >
                  {m === 'date' ? 'By Date(s)' : 'By Month'}
                </Text>
              </Pressable>
            ))}
          </View>

          <ScrollView
            style={{ maxHeight: 420 }}
            contentContainerStyle={{ paddingBottom: 8 }}
          >
            <Select
              label="Department"
              value={departmentId}
              options={deptOptions}
              onChange={setDept}
            />
            {/* Multi-select employees (simple badges) */}
            <Text style={styles.label}>Employees *</Text>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 8,
                marginBottom: 8,
              }}
            >
              {empOptions.map(opt => (
                <Pressable
                  key={opt.value}
                  onPress={() => toggleEmp(opt.value)}
                  style={[
                    styles.tag,
                    empIds.includes(opt.value) && styles.tagActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.tagTxt,
                      empIds.includes(opt.value) && styles.tagTxtActive,
                    ]}
                  >
                    {opt.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            {mode === 'date' ? (
              <View style={{ marginBottom: 8 }}>
                <Text style={styles.label}>
                  Dates (comma separated YYYY-MM-DD)
                </Text>
                <TextInput
                  value={datesCSV}
                  onChangeText={setDatesCSV}
                  placeholder="2025-09-01, 2025-09-02, ..."
                  style={styles.input}
                  placeholderTextColor="#9ca3af"
                />
              </View>
            ) : (
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Year</Text>
                  <TextInput
                    value={year}
                    onChangeText={setYear}
                    keyboardType="numeric"
                    style={styles.input}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Month (1-12)</Text>
                  <TextInput
                    value={month}
                    onChangeText={setMonth}
                    keyboardType="numeric"
                    style={styles.input}
                  />
                </View>
              </View>
            )}

            <View style={{ flexDirection: 'row', gap: 8, marginTop: 6 }}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Clock In</Text>
                <TextInput
                  value={clockInTime}
                  onChangeText={setIn}
                  style={styles.input}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Clock Out</Text>
                <TextInput
                  value={clockOutTime}
                  onChangeText={setOut}
                  style={styles.input}
                />
              </View>
            </View>

            <View style={{ flexDirection: 'row', gap: 8 }}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Location</Text>
                <TextInput
                  value={location}
                  onChangeText={setLoc}
                  style={styles.input}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Working From</Text>
                <TextInput
                  value={workingFrom}
                  onChangeText={setWF}
                  style={styles.input}
                />
              </View>
            </View>

            <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
              <Pressable
                onPress={() => setLate(v => !v)}
                style={[styles.chk, late && styles.chkOn]}
              >
                <Text style={styles.chkTxt}>Late</Text>
              </Pressable>
              <Pressable
                onPress={() => setHalf(v => !v)}
                style={[styles.chk, halfDay && styles.chkOn]}
              >
                <Text style={styles.chkTxt}>Half Day</Text>
              </Pressable>
              <Pressable
                onPress={() => setOverwrite(v => !v)}
                style={[styles.chk, overwrite && styles.chkOn]}
              >
                <Text style={styles.chkTxt}>Attendance Overwrite</Text>
              </Pressable>
            </View>
          </ScrollView>

          <View style={styles.rowEnd}>
            <Pressable onPress={onClose} style={styles.btn}>
              <Text style={styles.btnTxt}>Cancel</Text>
            </Pressable>
            <Pressable
              onPress={submit}
              style={[styles.btn, styles.btnPrimary]}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={[styles.btnTxt, { color: '#fff' }]}>Save</Text>
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheet: {
    width: '94%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    maxHeight: '90%',
  },
  title: { fontSize: 18, fontWeight: '900', marginBottom: 8, color: '#0b0b0c' },
  label: { fontSize: 12, fontWeight: '800', color: '#374151', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#111827',
    backgroundColor: '#fff',
  },
  selectBtn: {
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
    top: 64,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    zIndex: 30,
  },
  menuItem: {
    padding: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#f1f5f9',
  },
  menuTxt: { color: '#111827' },
  tag: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  tagActive: { backgroundColor: '#1d4ed8', borderColor: '#1d4ed8' },
  tagTxt: { color: '#111827', fontSize: 12 },
  tagTxtActive: { color: '#fff' },
  pill: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  pillActive: { backgroundColor: '#111827', borderColor: '#111827' },
  pillTxt: { color: '#111827', fontWeight: '800' },
  pillTxtActive: { color: '#fff' },
  chk: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  chkOn: { backgroundColor: '#e0f2fe', borderColor: '#38bdf8' },
  chkTxt: { color: '#0b0b0c', fontWeight: '700' },
  rowEnd: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 10,
  },
  btn: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  btnPrimary: { backgroundColor: '#1d4ed8', borderColor: '#1d4ed8' },
  btnTxt: { fontWeight: '900', color: '#111827' },
});
