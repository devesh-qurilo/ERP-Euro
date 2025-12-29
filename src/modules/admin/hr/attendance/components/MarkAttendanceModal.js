// src/modules/admin/hr/attendance/components/MarkAttendanceModal.js
import React, { useEffect, useMemo, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker';

import { fetchEmployees } from '../../employees/store/actions';
import { fetchDepartments } from '../../departments/store/actions';

import { selectDepartments } from '../../departments/store/selectors';
import { selectEmpList } from '../../employees/store/selectors';
import { selectAttSaving } from '../store/selectors';

/* ================== SMALL SELECT ================== */
const Select = ({ label, value, options, onChange }) => {
  const [open, setOpen] = useState(false);

  return (
    <View style={{ minWidth: 160, marginBottom: 8 }}>
      <Text style={styles.label}>{label}</Text>

      <Pressable style={styles.selectBtn} onPress={() => setOpen(v => !v)}>
        <Text style={styles.value}>{value || 'All'}</Text>
        <Text style={styles.caret}>{open ? '▴' : '▾'}</Text>
      </Pressable>

      {open && (
        <View style={styles.menu}>
          {options.map(o => (
            <Pressable
              key={o.value}
              onPress={() => {
                onChange(o.value);
                setOpen(false);
              }}
              style={styles.menuItem}
            >
              <Text>{o.label}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
};

/* ================== MAIN MODAL ================== */
export default function MarkAttendanceModal({ visible, onClose, onSave }) {
  const dispatch = useDispatch();

  /* ---------- redux data ---------- */
  const departments = useSelector(selectDepartments);
  const employees = useSelector(selectEmpList);
  const saving = useSelector(selectAttSaving);

  /* ---------- fetch deps when modal opens ---------- */
  useEffect(() => {
    if (visible) {
      dispatch(fetchEmployees());
      dispatch(fetchDepartments());
    }
  }, [visible, dispatch]);

  /* ---------- form state ---------- */
  const [mode, setMode] = useState('date'); // date | month
  const [departmentId, setDept] = useState('');
  const [empIds, setEmpIds] = useState([]);

  const [datesCSV, setDatesCSV] = useState('');
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [month, setMonth] = useState(String(new Date().getMonth() + 1));

  const [clockInTime, setIn] = useState('09:00:00');
  const [clockOutTime, setOut] = useState('17:00:00');

  const [location, setLoc] = useState('Office');
  const [workingFrom, setWF] = useState('Office');

  const [late, setLate] = useState(false);
  const [halfDay, setHalf] = useState(false);
  const [overwrite, setOverwrite] = useState(false);

  /* ---------- pickers ---------- */
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showInPicker, setShowInPicker] = useState(false);
  const [showOutPicker, setShowOutPicker] = useState(false);

  /* ---------- options ---------- */
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

  const toggleEmp = id =>
    setEmpIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id],
    );

  /* ---------- submit ---------- */
  const submit = () => {
    if (!empIds.length) return;

    const base = {
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
      markedBy: empIds[0],
    };

    if (mode === 'date') {
      const dates = datesCSV
        .split(',')
        .map(d => d.trim())
        .filter(Boolean);

      onSave({
        type: 'dates',
        body: { employeeIds: empIds, dates, ...base },
      });
    } else {
      onSave({
        type: 'month',
        body: {
          year: Number(year),
          month: Number(month),
          employeeIds: empIds,
          ...base,
        },
      });
    }
  };

  /* ================== UI ================== */
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <Text style={styles.title}>Mark Attendance</Text>

          {/* MODE */}
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 10 }}>
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

          <ScrollView style={{ maxHeight: 420 }}>
            <Select
              label="Department"
              value={departmentId}
              options={deptOptions}
              onChange={setDept}
            />

            {/* EMPLOYEES */}
            <Text style={styles.label}>Employees *</Text>
            <View style={styles.tags}>
              {empOptions.map(e => (
                <Pressable
                  key={e.value}
                  onPress={() => toggleEmp(e.value)}
                  style={[
                    styles.tag,
                    empIds.includes(e.value) && styles.tagActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.tagTxt,
                      empIds.includes(e.value) && styles.tagTxtActive,
                    ]}
                  >
                    {e.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* DATE MODE */}
            {mode === 'date' ? (
              <>
                <Text style={styles.label}>Dates</Text>
                <TextInput
                  value={datesCSV}
                  onChangeText={setDatesCSV}
                  placeholder="YYYY-MM-DD, YYYY-MM-DD"
                  style={styles.input}
                />

                <Pressable
                  onPress={() => setShowDatePicker(true)}
                  style={{ marginTop: 6 }}
                >
                  <Text style={{ color: '#1d4ed8', fontWeight: '700' }}>
                    + Pick Date
                  </Text>
                </Pressable>
              </>
            ) : (
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  value={year}
                  onChangeText={setYear}
                  placeholder="Year"
                  keyboardType="numeric"
                />
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  value={month}
                  onChangeText={setMonth}
                  placeholder="Month"
                  keyboardType="numeric"
                />
              </View>
            )}

            {/* TIME */}
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
              <Pressable
                onPress={() => setShowInPicker(true)}
                style={[styles.input, { flex: 1 }]}
              >
                <Text>In: {clockInTime}</Text>
              </Pressable>

              <Pressable
                onPress={() => setShowOutPicker(true)}
                style={[styles.input, { flex: 1 }]}
              >
                <Text>Out: {clockOutTime}</Text>
              </Pressable>
            </View>
          </ScrollView>

          {/* ACTIONS */}
          <View style={styles.rowEnd}>
            <Pressable onPress={onClose} style={styles.btn}>
              <Text>Cancel</Text>
            </Pressable>

            <Pressable
              onPress={submit}
              style={[styles.btn, styles.btnPrimary]}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={{ color: '#fff', fontWeight: '900' }}>Save</Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>

      {/* DATE PICKER */}
      {showDatePicker && (
        <DateTimePicker
          mode="date"
          value={new Date()}
          onChange={(e, d) => {
            setShowDatePicker(false);
            if (!d) return;
            const iso = d.toISOString().slice(0, 10);
            setDatesCSV(p => (p ? `${p}, ${iso}` : iso));
          }}
        />
      )}

      {/* TIME PICKERS */}
      {showInPicker && (
        <DateTimePicker
          mode="time"
          value={new Date()}
          onChange={(e, d) => {
            setShowInPicker(false);
            if (!d) return;
            setIn(d.toTimeString().slice(0, 8));
          }}
        />
      )}

      {showOutPicker && (
        <DateTimePicker
          mode="time"
          value={new Date()}
          onChange={(e, d) => {
            setShowOutPicker(false);
            if (!d) return;
            setOut(d.toTimeString().slice(0, 8));
          }}
        />
      )}
    </Modal>
  );
}

/* ================== STYLES ================== */
const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheet: {
    width: '94%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
  },
  title: { fontSize: 18, fontWeight: '900', marginBottom: 8 },
  label: { fontSize: 12, fontWeight: '800', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    padding: 10,
  },
  selectBtn: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    flexDirection: 'row',
  },
  value: { flex: 1 },
  caret: { opacity: 0.6 },
  menu: {
    position: 'absolute',
    top: 60,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderRadius: 10,
    zIndex: 20,
  },
  menuItem: { padding: 10 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  tagActive: { backgroundColor: '#1d4ed8' },
  tagTxt: { fontSize: 12 },
  tagTxtActive: { color: '#fff' },
  pill: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  pillActive: { backgroundColor: '#111827' },
  pillTxtActive: { color: '#fff' },
  rowEnd: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8 },
  btn: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  btnPrimary: { backgroundColor: '#1d4ed8' },
});
