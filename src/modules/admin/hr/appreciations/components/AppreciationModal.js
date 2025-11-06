import React, { useMemo, useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
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
import { selectEmpList } from '../../employees/store/selectors'; // uses your admin employees list
import * as DocPicker from '@react-native-documents/picker';

const Select = ({ label, value, options, onChange }) => {
  const [open, setOpen] = useState(false);
  return (
    <View style={{ marginBottom: 10 }}>
      <Text style={styles.label}>{label}</Text>
      <Pressable style={styles.selectBtn} onPress={() => setOpen(!open)}>
        <Text style={{ flex: 1 }} numberOfLines={1}>
          {value ? String(value) : '—'}
        </Text>
        <Text>{open ? '▴' : '▾'}</Text>
      </Pressable>
      {open && (
        <View style={styles.menu}>
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
        </View>
      )}
    </View>
  );
};

export default function AppreciationModal() {
  const dispatch = useDispatch();
  const visible = useSelector(selectApprecModalOpen);
  const editing = useSelector(selectApprecEditing);
  const awards = useSelector(selectAwards);
  const employees = useSelector(selectEmpList);

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

  const [form, setForm] = useState(() => {
    if (!editing)
      return { awardId: null, givenToEmployeeId: null, date: '', summary: '' };
    return {
      awardId: editing.awardId,
      givenToEmployeeId: editing.givenToEmployeeId,
      date: editing.date || '',
      summary: editing.summary || '',
    };
  });
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);

  React.useEffect(() => {
    // reset when open closes/opens
    if (visible) {
      if (editing)
        setForm({
          awardId: editing.awardId,
          givenToEmployeeId: editing.givenToEmployeeId,
          date: editing.date || '',
          summary: editing.summary || '',
        });
      else
        setForm({
          awardId: null,
          givenToEmployeeId: null,
          date: '',
          summary: '',
        });
      setFile(null);
    }
  }, [visible, editing]);

  const pickPhoto = async () => {
    try {
      const res = await DocPicker.pick({ allowMultiSelection: false });
      const f = res?.[0];
      if (f) setFile({ uri: f.uri, name: f.name, type: f.type || 'image/*' });
    } catch (e) {
      /* cancelled */
    }
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

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.modal}>
          <Text style={styles.title}>
            {editing ? 'Edit Appreciation' : 'Add Appreciation'}
          </Text>

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
          <Select
            label="Given To"
            value={
              form.givenToEmployeeId
                ? empOpts.find(e => e.value === form.givenToEmployeeId)?.label
                : ''
            }
            options={empOpts}
            onChange={givenToEmployeeId =>
              setForm({ ...form, givenToEmployeeId })
            }
          />

          <Text style={styles.label}>Date</Text>
          <TextInput
            value={form.date}
            onChangeText={date => setForm({ ...form, date })}
            style={styles.input}
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#9ca3af"
          />

          <Text style={styles.label}>Summary</Text>
          <TextInput
            value={form.summary}
            onChangeText={summary => setForm({ ...form, summary })}
            style={styles.input}
            placeholder="summary"
            placeholderTextColor="#9ca3af"
          />

          <Pressable style={styles.pickBtn} onPress={pickPhoto}>
            <Text style={styles.pickTxt}>
              {file ? file.name : 'Pick Photo (optional)'}
            </Text>
          </Pressable>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              gap: 8,
              marginTop: 14,
            }}
          >
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
        </View>
      </View>
    </Modal>
  );
}

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
  title: { fontSize: 18, fontWeight: '900', marginBottom: 8, color: '#0b0b0c' },
  label: { fontSize: 12, fontWeight: '800', color: '#374151', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
    color: '#111827',
    marginBottom: 10,
  },
  selectBtn: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
  },
  menu: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 6,
    backgroundColor: '#fff',
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
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignSelf: 'flex-start',
  },
  pickTxt: { color: '#1d4ed8', fontWeight: '800' },
  btnPlain: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  btnPlainTxt: { fontWeight: '800', color: '#111827' },
  btnPrimary: {
    borderWidth: 1,
    borderColor: '#1d4ed8',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#1d4ed8',
  },
  btnPrimaryTxt: { fontWeight: '900', color: '#fff' },
});
