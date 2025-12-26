import React, { useEffect, useState } from 'react';
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
import DateTimePicker from '@react-native-community/datetimepicker';

/* ---------- helpers ---------- */
const formatDate = d => {
  if (!d) return '';
  const dt = d instanceof Date ? d : new Date(d);
  if (Number.isNaN(dt.getTime())) return '';
  return dt.toISOString().slice(0, 10);
};

/* ---------- component ---------- */
export default function HolidayModal({ visible, onClose, onSave, loading }) {
  const [rows, setRows] = useState([
    { date: '', occasion: '' },
    { date: '', occasion: '' },
  ]);

  const [pickerRow, setPickerRow] = useState(null); // index of row whose date picker is open

  useEffect(() => {
    if (!visible) setPickerRow(null);
  }, [visible]);

  const addRow = () => setRows(r => [...r, { date: '', occasion: '' }]);
  const removeRow = idx => setRows(r => r.filter((_, i) => i !== idx));
  const patchRow = (idx, patch) =>
    setRows(r => r.map((row, i) => (i === idx ? { ...row, ...patch } : row)));

  const handleDateChange = (event, selectedDate) => {
    if (Platform.OS !== 'ios') setPickerRow(null);
    if (event?.type === 'dismissed' || !selectedDate) return;
    patchRow(pickerRow, { date: formatDate(selectedDate) });
    if (Platform.OS === 'ios') setPickerRow(null);
  };

  const handleSave = () => {
    const holidays = rows
      .map(r => ({
        date: r.date?.trim(),
        occasion: r.occasion?.trim(),
      }))
      .filter(r => r.date && r.occasion);

    if (!holidays.length) return;
    onSave({ holidays });
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={s.backdrop}>
        <View style={s.card}>
          <Text style={s.title}>Create Holidays (Bulk)</Text>

          <ScrollView
            style={{ maxHeight: 360 }}
            showsVerticalScrollIndicator={false}
          >
            {rows.map((r, idx) => (
              <View key={idx} style={s.row}>
                {/* DATE */}
                <View style={s.col}>
                  <Text style={s.label}>Date</Text>
                  <Pressable onPress={() => setPickerRow(idx)} style={s.input}>
                    <Text style={{ color: r.date ? '#111827' : '#9ca3af' }}>
                      {r.date || 'Select date'}
                    </Text>
                  </Pressable>
                </View>

                {/* OCCASION */}
                <View style={s.col}>
                  <Text style={s.label}>Occasion</Text>
                  <TextInput
                    value={r.occasion}
                    onChangeText={v => patchRow(idx, { occasion: v })}
                    placeholder="Children's Day"
                    placeholderTextColor="#9ca3af"
                    style={s.input}
                  />
                </View>

                <Pressable onPress={() => removeRow(idx)} style={s.removeBtn}>
                  <Text style={s.removeTxt}>✕</Text>
                </Pressable>
              </View>
            ))}
          </ScrollView>

          {/* ACTIONS */}
          <View style={s.actions}>
            <Pressable onPress={addRow} style={s.grayBtn}>
              <Text style={s.grayTxt}>+ Add Row</Text>
            </Pressable>

            <View style={{ flex: 1 }} />

            <Pressable onPress={onClose} style={s.cancelBtn}>
              <Text style={s.cancelTxt}>Cancel</Text>
            </Pressable>

            <Pressable
              onPress={handleSave}
              style={s.saveBtn}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={s.saveTxt}>Save</Text>
              )}
            </Pressable>
          </View>

          {/* DATE PICKER OVERLAY */}
          {pickerRow !== null && (
            <View style={s.dateOverlay}>
              <View style={s.dateBox}>
                <DateTimePicker
                  value={new Date()}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'inline' : 'default'}
                  onChange={handleDateChange}
                />
                {Platform.OS === 'ios' && (
                  <Pressable
                    style={s.doneBtn}
                    onPress={() => setPickerRow(null)}
                  >
                    <Text style={s.doneTxt}>Done</Text>
                  </Pressable>
                )}
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

/* ---------- styles ---------- */
const s = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  title: { fontSize: 18, fontWeight: '800', marginBottom: 8 },

  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    marginBottom: 8,
  },
  col: { flex: 1 },

  label: { fontSize: 12, fontWeight: '800', marginBottom: 6 },

  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },

  removeBtn: {
    backgroundColor: '#fee2e2',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
  },
  removeTxt: { color: '#991b1b', fontWeight: '800' },

  actions: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },

  grayBtn: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  grayTxt: { fontWeight: '800' },

  cancelBtn: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
  },

  saveBtn: {
    backgroundColor: '#1d4ed8',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  saveTxt: { color: '#fff', fontWeight: '900' },

  /* date picker */
  dateOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  dateBox: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  doneBtn: {
    backgroundColor: '#1d4ed8',
    paddingVertical: 12,
    alignItems: 'center',
  },
  doneTxt: { color: '#fff', fontWeight: '800' },
});
