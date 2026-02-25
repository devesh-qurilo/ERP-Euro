// import React, { useEffect, useState } from 'react';
// import {
//   Modal,
//   View,
//   Text,
//   TextInput,
//   StyleSheet,
//   Pressable,
// } from 'react-native';

// export default function CreditNoteEditModal({
//   visible,
//   item,
//   busy = false,
//   onClose,
//   onSave,
// }) {
//   const [creditNoteDate, setCreditNoteDate] = useState('');
//   const [adjustment, setAdjustment] = useState('');
//   const [adjustmentPositive, setAdjustmentPositive] = useState(true);
//   const [notes, setNotes] = useState('');

//   useEffect(() => {
//     if (visible && item) {
//       setCreditNoteDate(item.creditNoteDate || '');
//       setAdjustment(String(item.adjustment ?? ''));
//       setAdjustmentPositive(!!item.adjustmentPositive);
//       setNotes(item.notes || '');
//     }
//   }, [visible, item]);

//   if (!visible || !item) return null;

//   const save = () => {
//     onSave?.({
//       creditNoteDate,
//       adjustment: Number(adjustment || 0),
//       adjustmentPositive,
//       notes,
//     });
//   };

//   return (
//     <Modal visible transparent animationType="fade" onRequestClose={onClose}>
//       <View style={s.backdrop}>
//         <View style={s.card}>
//           <Text style={s.ttl}>Edit Credit Note</Text>

//           <Field
//             label="Credit Note Date (YYYY-MM-DD)"
//             value={creditNoteDate}
//             onChangeText={setCreditNoteDate}
//           />
//           <Field
//             label="Adjustment"
//             value={adjustment}
//             onChangeText={setAdjustment}
//             kbType="numeric"
//           />
//           <Field
//             label="Adjustment Positive (true/false)"
//             value={String(adjustmentPositive)}
//             onChangeText={t => setAdjustmentPositive(t === 'true')}
//           />
//           <Field label="Notes" value={notes} onChangeText={setNotes} />

//           <Pressable disabled={busy} style={[s.btn, s.primary]} onPress={save}>
//             <Text style={[s.btnTxt, { color: '#fff' }]}>
//               {busy ? 'Saving…' : 'Save'}
//             </Text>
//           </Pressable>
//           <Pressable disabled={busy} style={s.btn} onPress={onClose}>
//             <Text style={s.btnTxt}>Cancel</Text>
//           </Pressable>
//         </View>
//       </View>
//     </Modal>
//   );
// }

// function Field({ label, value, onChangeText, kbType }) {
//   return (
//     <View style={{ marginBottom: 8 }}>
//       <Text style={{ fontSize: 12, color: '#64748b', marginBottom: 6 }}>
//         {label}
//       </Text>
//       <TextInput
//         value={value}
//         onChangeText={onChangeText}
//         keyboardType={kbType || 'default'}
//         style={{
//           borderWidth: 1,
//           borderColor: '#e5e7eb',
//           borderRadius: 10,
//           paddingHorizontal: 12,
//           paddingVertical: 10,
//           color: '#0f172a',
//         }}
//       />
//     </View>
//   );
// }

// const s = StyleSheet.create({
//   backdrop: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.4)',
//     justifyContent: 'center',
//     padding: 16,
//   },
//   card: { backgroundColor: '#fff', borderRadius: 12, padding: 16 },
//   ttl: { fontSize: 18, fontWeight: '900', color: '#0b0b0c', marginBottom: 8 },
//   btn: {
//     borderWidth: 1,
//     borderColor: '#1d4ed8',
//     borderRadius: 10,
//     paddingVertical: 10,
//     alignItems: 'center',
//     marginTop: 8,
//   },
//   btnTxt: { color: '#1d4ed8', fontWeight: '700' },
//   primary: { backgroundColor: '#1d4ed8', borderColor: '#1d4ed8' },
// });

import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Switch,
  Platform,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function CreditNoteEditModal({
  visible,
  item,
  busy = false,
  onClose,
  onSave,
}) {
  const [creditNoteDate, setCreditNoteDate] = useState(new Date());
  const [adjustment, setAdjustment] = useState('');
  const [adjustmentPositive, setAdjustmentPositive] = useState(true);
  const [notes, setNotes] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (visible && item) {
      setCreditNoteDate(
        item.creditNoteDate ? new Date(item.creditNoteDate) : new Date(),
      );
      setAdjustment(String(item.adjustment ?? ''));
      setAdjustmentPositive(!!item.adjustmentPositive);
      setNotes(item.notes || '');
    }
  }, [visible, item]);

  if (!visible || !item) return null;

  const save = () => {
    Keyboard.dismiss();
    onSave?.({
      creditNoteDate: creditNoteDate.toISOString().slice(0, 10),
      adjustment: Number(adjustment || 0),
      adjustmentPositive,
      notes,
    });
  };

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={s.backdrop}>
            <ScrollView
              contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
              keyboardShouldPersistTaps="handled"
            >
              <View style={s.card}>
                <Text style={s.ttl}>Edit Credit Note</Text>

                {/* DATE */}
                <Text style={s.label}>Credit Note Date</Text>
                <Pressable
                  style={s.input}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text>{creditNoteDate.toISOString().slice(0, 10)}</Text>
                </Pressable>

                {showDatePicker && (
                  <DateTimePicker
                    value={creditNoteDate}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={(event, selectedDate) => {
                      setShowDatePicker(false);
                      if (selectedDate) setCreditNoteDate(selectedDate);
                    }}
                  />
                )}

                {/* ADJUSTMENT */}
                <Text style={s.label}>Adjustment</Text>
                <TextInput
                  value={adjustment}
                  onChangeText={setAdjustment}
                  keyboardType="numeric"
                  style={s.input}
                  returnKeyType="done"
                  onSubmitEditing={Keyboard.dismiss}
                />

                {/* TOGGLE */}
                <View style={s.toggleRow}>
                  <Text style={s.label}>Adjustment Type</Text>
                  <View style={s.toggleInner}>
                    <Text style={{ marginRight: 10 }}>
                      {adjustmentPositive ? 'Positive' : 'Negative'}
                    </Text>
                    <Switch
                      value={adjustmentPositive}
                      onValueChange={setAdjustmentPositive}
                    />
                  </View>
                </View>

                {/* NOTES */}
                <Text style={s.label}>Notes</Text>
                <TextInput
                  value={notes}
                  onChangeText={setNotes}
                  style={[s.input, { height: 100 }]}
                  multiline
                  textAlignVertical="top"
                  returnKeyType="done"
                  blurOnSubmit
                />

                {/* BUTTONS */}
                <Pressable
                  disabled={busy}
                  style={[s.btn, s.primary]}
                  onPress={save}
                >
                  <Text style={[s.btnTxt, { color: '#fff' }]}>
                    {busy ? 'Saving…' : 'Save'}
                  </Text>
                </Pressable>

                <Pressable
                  disabled={busy}
                  style={s.btn}
                  onPress={() => {
                    Keyboard.dismiss();
                    onClose();
                  }}
                >
                  <Text style={s.btnTxt}>Cancel</Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const s = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  ttl: {
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  toggleRow: {
    marginBottom: 12,
  },
  toggleInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  btn: {
    borderWidth: 1,
    borderColor: '#1d4ed8',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  btnTxt: {
    color: '#1d4ed8',
    fontWeight: '700',
  },
  primary: {
    backgroundColor: '#1d4ed8',
    borderColor: '#1d4ed8',
  },
});
