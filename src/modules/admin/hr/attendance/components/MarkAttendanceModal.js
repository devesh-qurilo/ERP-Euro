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
          <ScrollView style={{ maxHeight: 60 }}>
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
          </ScrollView>
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
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
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

  const empOptions = useMemo(() => {
    let list = employees;

    if (departmentId) {
      list = list.filter(e => String(e.departmentId) === departmentId);
    }

    return list.map(e => ({
      label: `${e.name} (${e.employeeId})`,
      value: e.employeeId,
    }));
  }, [employees, departmentId]);

  const toggleEmp = id =>
    setEmpIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id],
    );

  const buildDates = () => {
    if (!startDate) return [];

    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date(startDate);

    const dates = [];
    const current = new Date(start);

    while (current <= end) {
      dates.push(current.toISOString().slice(0, 10));
      current.setDate(current.getDate() + 1);
    }

    return dates;
  };

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
      const dates = buildDates();

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

            <View style={styles.employeeBox}>
              <ScrollView style={{ maxHeight: 100 }}>
                {empOptions.map(e => (
                  <Pressable
                    key={e.value}
                    onPress={() => toggleEmp(e.value)}
                    style={[
                      styles.employeeRow,
                      empIds.includes(e.value) && styles.employeeRowActive,
                    ]}
                  >
                    <Text
                      style={
                        empIds.includes(e.value)
                          ? styles.employeeTxtActive
                          : styles.employeeTxt
                      }
                    >
                      {e.label}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            {/* DATE MODE */}
            {mode === 'date' ? (
              <>
                <Text style={styles.label}>Dates</Text>

                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <Pressable
                    style={[styles.input, { flex: 1 }]}
                    onPress={() => setShowDatePicker('start')}
                  >
                    <Text>{startDate || 'Start Date'}</Text>
                  </Pressable>

                  <Pressable
                    style={[styles.input, { flex: 1 }]}
                    onPress={() => setShowDatePicker('end')}
                  >
                    <Text>{endDate || 'End Date'}</Text>
                  </Pressable>
                </View>

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
                  placeholder="Year (2026)"
                  keyboardType="numeric"
                />

                <Select
                  label="Month"
                  value={month}
                  options={[
                    { label: 'Jan', value: '1' },
                    { label: 'Feb', value: '2' },
                    { label: 'Mar', value: '3' },
                    { label: 'Apr', value: '4' },
                    { label: 'May', value: '5' },
                    { label: 'Jun', value: '6' },
                    { label: 'Jul', value: '7' },
                    { label: 'Aug', value: '8' },
                    { label: 'Sep', value: '9' },
                    { label: 'Oct', value: '10' },
                    { label: 'Nov', value: '11' },
                    { label: 'Dec', value: '12' },
                  ]}
                  onChange={setMonth}
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
            if (!d) return;
            const iso = d.toISOString().slice(0, 10);

            if (showDatePicker === 'start') setStartDate(iso);
            if (showDatePicker === 'end') setEndDate(iso);

            setShowDatePicker(false);
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
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  sheet: {
    width: '94%',
    maxHeight: '85%',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
  },

  title: {
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 12,
  },

  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 6,
    marginTop: 8,
  },

  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fafafa',
  },

  employeeBox: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    padding: 6,
  },

  employeeRow: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 6,
  },

  employeeRowActive: {
    backgroundColor: '#1d4ed8',
  },

  employeeTxt: {
    fontSize: 13,
  },

  employeeTxtActive: {
    color: '#fff',
    fontWeight: '700',
  },

  selectBtn: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fafafa',
    flexDirection: 'row',
    alignItems: 'center',
  },

  value: {
    flex: 1,
    fontSize: 13,
  },

  caret: {
    opacity: 0.6,
    fontSize: 12,
  },

  menu: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    zIndex: 20,
    elevation: 5,
  },

  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },

  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  tag: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#fff',
  },

  tagActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },

  tagTxt: {
    fontSize: 12,
    color: '#374151',
  },

  tagTxtActive: {
    color: '#fff',
  },

  pill: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#fff',
  },

  pillActive: {
    backgroundColor: '#1d4ed8',
    borderColor: '#1d4ed8',
  },

  pillTxtActive: {
    color: '#fff',
    fontWeight: '700',
  },

  rowEnd: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 12,
  },

  btn: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },

  btnPrimary: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
});
