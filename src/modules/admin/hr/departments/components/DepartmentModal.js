import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  Pressable,
  Alert,
} from 'react-native';
import { useSelector } from 'react-redux';
import {
  selectDepartments,
  selectDepartmentsBusyIds,
} from '../store/selectors';

const Select = ({ label, value, options, onChange }) => {
  const [open, setOpen] = useState(false);
  return (
    <View style={{ marginBottom: 10 }}>
      <Text style={styles.label}>{label}</Text>
      <Pressable style={styles.select} onPress={() => setOpen(o => !o)}>
        <Text style={styles.value} numberOfLines={1}>
          {String(value ?? 'None')}
        </Text>
        <Text style={styles.caret}>{open ? '▴' : '▾'}</Text>
      </Pressable>
      {open && (
        <View style={styles.menu}>
          {options.map(opt => (
            <Pressable
              key={String(opt.value)}
              style={styles.menuItem}
              onPress={() => {
                onChange(opt.value);
                setOpen(false);
              }}
            >
              <Text style={styles.menuTxt}>{opt.label}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
};

export default function DepartmentModal({ visible, onClose, onSave, editing }) {
  const list = useSelector(selectDepartments);
  const busyIds = useSelector(selectDepartmentsBusyIds);
  const saving =
    busyIds.includes('__create__') || busyIds.includes(editing?.id);

  const [name, setName] = useState('');
  const [parentId, setParentId] = useState(null);

  useEffect(() => {
    if (editing) {
      setName(editing.departmentName || '');
      setParentId(editing.parentDepartmentId ?? null);
    } else {
      setName('');
      setParentId(null);
    }
  }, [editing, visible]);

  const parentOptions = useMemo(() => {
    const opts = [{ label: '— None —', value: null }];
    list
      .filter(x => x.id !== editing?.id)
      .forEach(x =>
        opts.push({ label: `${x.departmentName} (#${x.id})`, value: x.id }),
      );
    return opts;
  }, [list, editing]);

  const submit = () => {
    if (!name.trim()) {
      Alert.alert('Missing', 'Department name is required');
      return;
    }
    onSave({
      departmentName: name.trim(),
      parentDepartmentId: parentId ?? null,
    });
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
          <Text style={styles.title}>
            {editing ? 'Edit Department' : 'Add Department'}
          </Text>

          <Text style={styles.label}>Department Name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Finance / Sales / Operations"
            placeholderTextColor="#9ca3af"
            style={styles.input}
          />

          <Select
            label="Parent Department"
            value={
              parentId == null
                ? 'None'
                : parentOptions.find(o => o.value === parentId)?.label ||
                  parentId
            }
            options={parentOptions}
            onChange={setParentId}
          />

          <View style={styles.row}>
            <Pressable
              style={styles.secondaryBtn}
              onPress={onClose}
              disabled={saving}
            >
              <Text style={styles.secondaryTxt}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[styles.primaryBtn, saving && { opacity: 0.6 }]}
              onPress={submit}
              disabled={saving}
            >
              <Text style={[styles.primaryTxt, { color: '#fff' }]}>
                {saving ? 'Saving…' : 'Save'}
              </Text>
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
    justifyContent: 'center',
    padding: 16,
  },
  sheet: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  title: { fontSize: 18, fontWeight: '900', color: '#111827', marginBottom: 8 },
  label: { fontSize: 12, fontWeight: '800', color: '#374151', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#111827',
    backgroundColor: '#fff',
    marginBottom: 10,
  },

  select: {
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
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    overflow: 'hidden',
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#f1f5f9',
  },
  menuTxt: { color: '#111827' },

  row: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 6,
  },
  primaryBtn: {
    borderWidth: 1,
    borderColor: '#1d4ed8',
    backgroundColor: '#1d4ed8',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  primaryTxt: { fontWeight: '900', color: '#111827' },
  secondaryBtn: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  secondaryTxt: { fontWeight: '800', color: '#111827' },
});
