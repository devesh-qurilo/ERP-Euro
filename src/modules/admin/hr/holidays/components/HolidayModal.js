import React from 'react';
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

export default function HolidayModal({ visible, onClose, onSave, loading }) {
  const [rows, setRows] = React.useState([
    { date: '', occasion: '' },
    { date: '', occasion: '' },
  ]);

  const addRow = () => setRows(r => [...r, { date: '', occasion: '' }]);
  const removeRow = idx => setRows(r => r.filter((_, i) => i !== idx));
  const patchRow = (idx, patch) =>
    setRows(r => r.map((row, i) => (i === idx ? { ...row, ...patch } : row)));

  const handleSave = () => {
    const holidays = rows
      .map(r => ({
        date: (r.date || '').trim(),
        occasion: (r.occasion || '').trim(),
      }))
      .filter(r => r.date && r.occasion);
    if (!holidays.length) return;
    onSave({ holidays });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={s.backdrop}>
        <View style={s.card}>
          <Text style={s.title}>Create Holidays (Bulk)</Text>

          <ScrollView style={{ maxHeight: 360 }}>
            {rows.map((r, idx) => (
              <View key={idx} style={s.row}>
                <View style={s.col}>
                  <Text style={s.label}>Date (YYYY-MM-DD)</Text>
                  <TextInput
                    value={r.date}
                    onChangeText={v => patchRow(idx, { date: v })}
                    placeholder="2025-11-05"
                    placeholderTextColor="#9ca3af"
                    style={s.input}
                  />
                </View>
                <View style={s.col}>
                  <Text style={s.label}>Occasion</Text>
                  <TextInput
                    value={r.occasion}
                    onChangeText={v => patchRow(idx, { occasion: v })}
                    placeholder="Children Day"
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
        </View>
      </View>
    </Modal>
  );
}

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
  title: { fontSize: 18, fontWeight: '800', color: '#111827', marginBottom: 8 },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    marginBottom: 8,
  },
  col: { flex: 1 },
  label: { fontSize: 12, fontWeight: '800', color: '#374151', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
    color: '#111827',
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
    backgroundColor: '#fff',
  },
  grayTxt: { fontWeight: '800', color: '#111827' },
  cancelBtn: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fff',
    marginRight: 8,
  },
  cancelTxt: { fontWeight: '800', color: '#111827' },
  saveBtn: {
    backgroundColor: '#1d4ed8',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  saveTxt: { color: '#fff', fontWeight: '900' },
});
