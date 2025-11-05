import React, { useMemo, useState } from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import DocumentPicker from '@react-native-documents/picker';

const Select = ({ label, value, options, onChange, style }) => {
  const [open, setOpen] = useState(false);
  return (
    <View style={[{ minWidth: 150, marginRight: 8, marginBottom: 8 }, style]}>
      <Text style={styles.label}>{label}</Text>
      <Pressable style={styles.selectBtn} onPress={() => setOpen(o => !o)}>
        <Text style={styles.value} numberOfLines={1}>
          {String(value)}
        </Text>
        <Text style={styles.caret}>{open ? '▴' : '▾'}</Text>
      </Pressable>
      {open && (
        <View style={styles.menu}>
          {options.map(opt => (
            <Pressable
              key={String(opt)}
              style={styles.menuItem}
              onPress={() => {
                onChange(opt);
                setOpen(false);
              }}
            >
              <Text style={styles.menuTxt}>{String(opt)}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
};

export default function LeaveApplyModal({
  visible,
  onClose,
  onSave,
  employees,
  applying,
}) {
  const empOptions = useMemo(
    () => employees.map(e => `${e.employeeId} • ${e.name}`),
    [employees],
  );

  const [selectedEmpIds, setSelectedEmpIds] = useState([]);
  const [leaveType, setLeaveType] = useState('SICK');
  const [durationType, setDurationType] = useState('FULL_DAY');
  const [singleDate, setSingleDate] = useState('');
  const [reason, setReason] = useState('');
  const [status, setStatus] = useState('APPROVED');
  const [docs, setDocs] = useState([]);

  const toggleEmp = el => {
    const id = el.split('•')[0].trim();
    setSelectedEmpIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id],
    );
  };

  const pickDocs = async () => {
    try {
      const res = await DocumentPicker.pick({ allowMultiSelection: true });
      setDocs(res);
    } catch (_) {}
  };

  const handleSave = () => {
    const payload = {
      leaveData: {
        employeeIds: selectedEmpIds,
        leaveType,
        durationType,
        singleDate,
        reason,
        status,
      },
      documents: docs,
    };
    onSave(payload);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.modal}>
          <Text style={styles.title}>Apply Leave (Admin)</Text>

          {/* Employees multi-select */}
          <Text style={styles.label}>Employees (tap to toggle)</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {empOptions.map(opt => {
              const id = opt.split('•')[0].trim();
              const active = selectedEmpIds.includes(id);
              return (
                <Pressable
                  key={opt}
                  onPress={() => toggleEmp(opt)}
                  style={[styles.chip, active && styles.chipActive]}
                >
                  <Text
                    style={[styles.chipTxt, active && styles.chipTxtActive]}
                  >
                    {opt}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View
            style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 }}
          >
            <Select
              label="Leave Type"
              value={leaveType}
              options={['SICK', 'CASUAL', 'EARNED']}
              onChange={setLeaveType}
            />
            <Select
              label="Duration"
              value={durationType}
              options={['FULL_DAY', 'HALF_DAY', 'MULTIPLE']}
              onChange={setDurationType}
            />
            <Select
              label="Status"
              value={status}
              options={['APPROVED', 'PENDING', 'REJECTED']}
              onChange={setStatus}
            />
          </View>

          <Text style={styles.label}>Single Date (YYYY-MM-DD)</Text>
          <TextInput
            value={singleDate}
            onChangeText={setSingleDate}
            style={styles.input}
            placeholder="2024-01-20"
          />

          <Text style={styles.label}>Reason</Text>
          <TextInput
            value={reason}
            onChangeText={setReason}
            style={styles.input}
            placeholder="Team health day"
          />

          <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
            <Pressable style={styles.secondaryBtn} onPress={pickDocs}>
              <Text style={styles.secondaryTxt}>
                {docs.length
                  ? `+ ${docs.length} file(s)`
                  : '+ Attach Documents'}
              </Text>
            </Pressable>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              gap: 8,
              marginTop: 12,
            }}
          >
            <Pressable style={styles.btn} onPress={onClose}>
              <Text style={styles.btnTxt}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[styles.btn, styles.btnPrimary]}
              onPress={handleSave}
              disabled={applying}
            >
              <Text style={[styles.btnTxt, { color: '#fff' }]}>
                {applying ? 'Saving…' : 'Save'}
              </Text>
            </Pressable>
          </View>
          {applying ? <ActivityIndicator style={{ marginTop: 8 }} /> : null}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 16,
  },
  modal: { backgroundColor: '#fff', borderRadius: 16, padding: 16 },
  title: { fontSize: 18, fontWeight: '800', marginBottom: 8 },
  label: {
    fontSize: 12,
    fontWeight: '800',
    color: '#374151',
    marginTop: 8,
    marginBottom: 6,
  },
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
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
  },
  value: { flex: 1, color: '#111827' },
  caret: { color: '#6b7280' },
  menu: {
    position: 'absolute',
    top: 64,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
    zIndex: 20,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#f1f5f9',
  },
  menuTxt: { color: '#111827' },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 999,
    marginRight: 6,
    marginBottom: 6,
  },
  chipActive: { backgroundColor: '#1d4ed8', borderColor: '#1d4ed8' },
  chipTxt: { color: '#111827' },
  chipTxtActive: { color: '#fff', fontWeight: '700' },
  secondaryBtn: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  secondaryTxt: { fontWeight: '800', color: '#111827' },
  btn: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  btnPrimary: { backgroundColor: '#1d4ed8', borderColor: '#1d4ed8' },
  btnTxt: { fontWeight: '800', color: '#111827' },
});
