import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const formatDate = d => new Date(d).toISOString().slice(0, 10);

export default function EditHolidayModal({
  visible,
  holiday,
  onClose,
  onSave,
  loading,
}) {
  const [date, setDate] = useState('');
  const [occasion, setOccasion] = useState('');
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    if (holiday) {
      setDate(holiday.date);
      setOccasion(holiday.occasion);
    }
  }, [holiday]);

  const onDateChange = (_, selectedDate) => {
    setShowPicker(false);
    if (selectedDate) setDate(formatDate(selectedDate));
  };

  const save = () => {
    if (!date || !occasion) return;
    onSave(holiday.id, { date, occasion });
  };

  if (!holiday) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={s.backdrop}>
        <View style={s.card}>
          <Text style={s.title}>Edit Holiday</Text>

          <Text style={s.label}>Date</Text>
          <Pressable style={s.input} onPress={() => setShowPicker(true)}>
            <Text>{date || 'Select date'}</Text>
          </Pressable>

          <Text style={s.label}>Occasion</Text>
          <TextInput
            value={occasion}
            onChangeText={setOccasion}
            style={s.input}
          />

          {showPicker && (
            <DateTimePicker
              value={new Date(date || Date.now())}
              mode="date"
              display={Platform.OS === 'ios' ? 'inline' : 'default'}
              onChange={onDateChange}
            />
          )}

          <View style={s.actions}>
            <Pressable onPress={onClose} style={s.cancelBtn}>
              <Text>Cancel</Text>
            </Pressable>

            <Pressable onPress={save} style={s.saveBtn}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={s.saveTxt}>Update</Text>
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
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
  },
  title: { fontSize: 18, fontWeight: '800', marginBottom: 12 },
  label: { fontSize: 12, fontWeight: '800', marginTop: 8 },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
    gap: 8,
  },
  cancelBtn: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
  },
  saveBtn: {
    backgroundColor: '#1d4ed8',
    padding: 10,
    borderRadius: 10,
  },
  saveTxt: { color: '#fff', fontWeight: '800' },
});
