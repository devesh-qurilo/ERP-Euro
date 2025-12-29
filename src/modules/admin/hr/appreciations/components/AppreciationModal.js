import React, { useEffect, useMemo, useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';
import { useDispatch, useSelector } from 'react-redux';

import {
  closeApprecModal,
  createAppreciation,
  updateAppreciation,
} from '../store/actions';

import {
  selectApprecEditing,
  selectApprecModalOpen,
  selectAwards,
} from '../store/selectors';

import { selectEmpList } from '../../employees/store/selectors';
import { fetchEmployees } from '../../employees/store/actions';

import * as DocPicker from '@react-native-documents/picker';

/* ================== SELECT ================== */
const Select = ({ label, value, options, onChange }) => {
  const [open, setOpen] = useState(false);

  return (
    <View style={{ marginBottom: 10 }}>
      <Text style={styles.label}>{label}</Text>

      <Pressable style={styles.selectBtn} onPress={() => setOpen(!open)}>
        <Text style={{ flex: 1 }} numberOfLines={1}>
          {value || '—'}
        </Text>
        <Text>{open ? '▴' : '▾'}</Text>
      </Pressable>

      {open && (
        <ScrollView style={styles.menu}>
          {options.map(o => (
            <Pressable
              key={String(o.value)}
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
      )}
    </View>
  );
};

/* ================== MODAL ================== */
export default function AppreciationModal() {
  const dispatch = useDispatch();

  const visible = useSelector(selectApprecModalOpen);
  const editing = useSelector(selectApprecEditing);
  const awards = useSelector(selectAwards);
  const employees = useSelector(selectEmpList);

  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  const awardOpts = useMemo(
    () => awards.map(a => ({ label: a.title, value: a.id })),
    [awards],
  );

  const empOpts = useMemo(
    () =>
      employees.map(e => ({
        label: `${e.name} (${e.employeeId})`,
        value: e.employeeId,
      })),
    [employees],
  );

  const [form, setForm] = useState({
    awardId: null,
    givenToEmployeeId: null,
    date: '',
    summary: '',
  });

  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (visible) {
      if (editing) {
        setForm({
          awardId: editing.awardId,
          givenToEmployeeId: editing.givenToEmployeeId,
          date: editing.date || '',
          summary: editing.summary || '',
        });
      } else {
        setForm({
          awardId: null,
          givenToEmployeeId: null,
          date: '',
          summary: '',
        });
      }
      setFile(null);
    }
  }, [visible, editing]);

  const pickPhoto = async () => {
    try {
      const res = await DocPicker.pick({ allowMultiSelection: false });
      const f = res?.[0];
      if (f) setFile({ uri: f.uri, name: f.name, type: f.type || 'image/*' });
    } catch {}
  };

  const onSave = async () => {
    if (!form.awardId || !form.givenToEmployeeId || !form.date) {
      Alert.alert('Missing', 'Award, Employee and Date are required.');
      return;
    }

    setSaving(true);

    const payload = { ...form, photoFile: file };

    if (editing) await dispatch(updateAppreciation(editing.id, payload));
    else await dispatch(createAppreciation(payload));

    setSaving(false);
    dispatch(closeApprecModal());
  };

  /* ---------- SAFE DATE (prevents iOS crash) ---------- */
  const safeDate = (() => {
    try {
      return form.date ? new Date(form.date) : new Date();
    } catch {
      return new Date();
    }
  })();

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.modal}>
            <ScrollView
              style={{ maxHeight: 520 }}
              contentContainerStyle={{ paddingBottom: 10 }}
            >
              <Text style={styles.title}>
                {editing ? 'Edit Appreciation' : 'Add Appreciation'}
              </Text>

              {/* Award */}
              <Select
                label="Award"
                value={
                  form.awardId
                    ? awardOpts.find(a => a.value === form.awardId)?.label
                    : ''
                }
                options={awardOpts}
                onChange={awardId => setForm({ ...form, awardId })}
              />

              {/* Employee */}
              <Select
                label="Given To"
                value={
                  form.givenToEmployeeId
                    ? empOpts.find(e => e.value === form.givenToEmployeeId)
                        ?.label
                    : ''
                }
                options={empOpts}
                onChange={givenToEmployeeId =>
                  setForm({ ...form, givenToEmployeeId })
                }
              />

              {/* DATE */}
              <Text style={styles.label}>Date</Text>

              <Pressable
                style={styles.input}
                onPress={() => setShowPicker(true)}
              >
                <Text>{form.date || 'Pick Date'}</Text>
              </Pressable>

              {showPicker && (
                <DateTimePicker
                  value={safeDate} // 👈 ALWAYS VALID DATE
                  mode="date"
                  display={Platform.OS === 'ios' ? 'inline' : 'default'}
                  onChange={(e, selectedDate) => {
                    // iOS: fires twice; ignore cancel
                    if (Platform.OS === 'ios') {
                      if (!selectedDate) return;
                      const iso = selectedDate.toISOString().slice(0, 10);
                      setForm({ ...form, date: iso });
                      return;
                    }

                    // Android: picker closes
                    setShowPicker(false);

                    if (selectedDate) {
                      const iso = selectedDate.toISOString().slice(0, 10);
                      setForm({ ...form, date: iso });
                    }
                  }}
                  onTouchCancel={() => setShowPicker(false)}
                />
              )}

              {/* Summary */}
              <Text style={styles.label}>Summary</Text>
              <TextInput
                value={form.summary}
                onChangeText={summary => setForm({ ...form, summary })}
                style={styles.input}
                multiline
              />

              {/* Photo */}
              <Pressable style={styles.pickBtn} onPress={pickPhoto}>
                <Text style={styles.pickTxt}>
                  {file ? file.name : 'Pick Photo (optional)'}
                </Text>
              </Pressable>

              {/* Buttons */}
              <View style={styles.footer}>
                <Pressable
                  style={styles.btnPlain}
                  onPress={() => dispatch(closeApprecModal())}
                >
                  <Text style={styles.btnPlainTxt}>Cancel</Text>
                </Pressable>

                <Pressable
                  style={styles.btnPrimary}
                  onPress={onSave}
                  disabled={saving}
                >
                  {saving ? (
                    <ActivityIndicator />
                  ) : (
                    <Text style={styles.btnPrimaryTxt}>Save</Text>
                  )}
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

/* ================== STYLES ================== */
const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    width: '92%',
    maxWidth: 520,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  title: { fontSize: 18, fontWeight: '900', marginBottom: 8 },
  label: { fontSize: 12, fontWeight: '800', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
  },
  selectBtn: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  menu: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    marginTop: 6,
    maxHeight: 220,
  },
  menuItem: {
    padding: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#f1f5f9',
  },
  pickBtn: {
    borderWidth: 1,
    borderColor: '#1d4ed8',
    borderRadius: 10,
    padding: 10,
    alignSelf: 'flex-start',
  },
  pickTxt: { color: '#1d4ed8', fontWeight: '800' },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 14,
  },
  btnPlain: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    marginRight: 8,
  },
  btnPlainTxt: { fontWeight: '800' },
  btnPrimary: {
    backgroundColor: '#1d4ed8',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  btnPrimaryTxt: { color: '#fff', fontWeight: '900' },
});
