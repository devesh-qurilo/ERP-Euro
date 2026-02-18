// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   TextInput,
//   Pressable,
//   FlatList,
//   StyleSheet,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
// } from 'react-native';
// import { useDispatch, useSelector } from 'react-redux';
// import DateTimePicker from '@react-native-community/datetimepicker';

// import { fetchFollowups, addFollowup } from '../../deals/view/store/actions';

// import { selectDealFollowups } from '../../deals/view/store/selectors';

// export default function FollowupsTab({ dealId }) {
//   const dispatch = useDispatch();
//   const list = useSelector(selectDealFollowups);

//   const [form, setForm] = useState({
//     nextDate: null,
//     startTime: null,
//     remarks: '',
//     sendReminder: true,
//     remindBefore: 1,
//     remindUnit: 'DAYS',
//   });

//   const [showDate, setShowDate] = useState(false);
//   const [showTime, setShowTime] = useState(false);

//   useEffect(() => {
//     if (dealId) {
//       dispatch(fetchFollowups(dealId));
//     }
//   }, [dealId]);

//   const handleCreate = () => {
//     if (!form.nextDate || !form.startTime) return;

//     dispatch(
//       addFollowup(dealId, {
//         ...form,
//         nextDate: form.nextDate.toISOString().slice(0, 10),
//         startTime: form.startTime.toTimeString().slice(0, 5),
//       }),
//     );

//     // reset form
//     setForm({
//       nextDate: null,
//       startTime: null,
//       remarks: '',
//       sendReminder: true,
//       remindBefore: 1,
//       remindUnit: 'DAYS',
//     });
//   };

//   //   return (
//   // <View style={styles.container}>
//   //   {/* ADD FOLLOWUP */}
//   //   <Text style={styles.sectionTitle}>Add Followup</Text>

//   //   <Text style={styles.label}>Next Date</Text>
//   //   <Pressable style={styles.input} onPress={() => setShowDate(true)}>
//   //     <Text>
//   //       {form.nextDate
//   //         ? form.nextDate.toISOString().slice(0, 10)
//   //         : 'Select date'}
//   //     </Text>
//   //   </Pressable>

//   //   {showDate && (
//   //     <DateTimePicker
//   //       value={form.nextDate || new Date()}
//   //       mode="date"
//   //       onChange={(_, d) => {
//   //         setShowDate(false);
//   //         if (d) setForm({ ...form, nextDate: d });
//   //       }}
//   //     />
//   //   )}

//   //   <Text style={[styles.label, { marginTop: 10 }]}>Start Time</Text>
//   //   <Pressable style={styles.input} onPress={() => setShowTime(true)}>
//   //     <Text>
//   //       {form.startTime
//   //         ? form.startTime.toLocaleTimeString([], {
//   //             hour: '2-digit',
//   //             minute: '2-digit',
//   //           })
//   //         : 'Select time'}
//   //     </Text>
//   //   </Pressable>

//   //   {showTime && (
//   //     <DateTimePicker
//   //       value={form.startTime || new Date()}
//   //       mode="time"
//   //       onChange={(_, t) => {
//   //         setShowTime(false);
//   //         if (t) setForm({ ...form, startTime: t });
//   //       }}
//   //     />
//   //   )}

//   //   <Field
//   //     label="Remarks"
//   //     value={form.remarks}
//   //     onChange={v => setForm({ ...form, remarks: v })}
//   //   />

//   //   <Field
//   //     label="Remind Before"
//   //     value={String(form.remindBefore)}
//   //     keyboardType="numeric"
//   //     onChange={v => setForm({ ...form, remindBefore: Number(v) || 0 })}
//   //   />

//   //   <Field
//   //     label="Remind Unit"
//   //     value={form.remindUnit}
//   //     onChange={v => setForm({ ...form, remindUnit: v })}
//   //   />

//   //   <TouchableOpacity style={styles.primaryBtn} onPress={handleCreate}>
//   //     <Text style={styles.primaryBtnText}>Save Followup</Text>
//   //   </TouchableOpacity>

//   //   {/* LIST */}
//   //   <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
//   //     All Followups
//   //   </Text>

//   //   <FlatList
//   //     data={list}
//   //     keyExtractor={item => String(item.id)}
//   //     renderItem={({ item }) => (
//   //       <View style={styles.card}>
//   //         <Text style={styles.cardTitle}>
//   //           {item.nextDate} {item.startTime}
//   //         </Text>
//   //         <Text style={styles.cardSub}>{item.remarks}</Text>
//   //       </View>
//   //     )}
//   //   />
//   // </View>
//   return (
//     <KeyboardAvoidingView
//       style={{ flex: 1 }}
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//       keyboardVerticalOffset={80} // adjust if header present
//     >
//       <ScrollView
//         contentContainerStyle={{ paddingBottom: 40 }}
//         keyboardShouldPersistTaps="handled"
//       >
//         <View style={styles.container}>
//           {/* ADD FOLLOWUP */}
//           <Text style={styles.sectionTitle}>Add Followup</Text>

//           <Text style={styles.label}>Next Date</Text>
//           <Pressable style={styles.input} onPress={() => setShowDate(true)}>
//             <Text>
//               {form.nextDate
//                 ? form.nextDate.toISOString().slice(0, 10)
//                 : 'Select date'}
//             </Text>
//           </Pressable>

//           {showDate && (
//             <DateTimePicker
//               value={form.nextDate || new Date()}
//               mode="date"
//               onChange={(_, d) => {
//                 setShowDate(false);
//                 if (d) setForm({ ...form, nextDate: d });
//               }}
//             />
//           )}

//           <Text style={[styles.label, { marginTop: 10 }]}>Start Time</Text>
//           <Pressable style={styles.input} onPress={() => setShowTime(true)}>
//             <Text>
//               {form.startTime
//                 ? form.startTime.toLocaleTimeString([], {
//                     hour: '2-digit',
//                     minute: '2-digit',
//                   })
//                 : 'Select time'}
//             </Text>
//           </Pressable>

//           {showTime && (
//             <DateTimePicker
//               value={form.startTime || new Date()}
//               mode="time"
//               onChange={(_, t) => {
//                 setShowTime(false);
//                 if (t) setForm({ ...form, startTime: t });
//               }}
//             />
//           )}

//           <Field
//             label="Remarks"
//             value={form.remarks}
//             onChange={v => setForm({ ...form, remarks: v })}
//           />

//           <Field
//             label="Remind Before"
//             value={String(form.remindBefore)}
//             keyboardType="numeric"
//             onChange={v => setForm({ ...form, remindBefore: Number(v) || 0 })}
//           />

//           <Field
//             label="Remind Unit"
//             value={form.remindUnit}
//             onChange={v => setForm({ ...form, remindUnit: v })}
//           />

//           <TouchableOpacity style={styles.primaryBtn} onPress={handleCreate}>
//             <Text style={styles.primaryBtnText}>Save Followup</Text>
//           </TouchableOpacity>

//           {/* LIST */}
//           <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
//             All Followups
//           </Text>

//           {list.map(item => (
//             <View key={item.id} style={styles.card}>
//               <Text style={styles.cardTitle}>
//                 {item.nextDate} {item.startTime}
//               </Text>
//               <Text style={styles.cardSub}>{item.remarks}</Text>
//             </View>
//           ))}
//         </View>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
//   //   );
// }

// /* ---------------- FIELD ---------------- */

// function Field({ label, value, onChange, keyboardType }) {
//   return (
//     <View style={{ marginTop: 10 }}>
//       <Text style={styles.label}>{label}</Text>
//       <TextInput
//         value={value}
//         onChangeText={onChange}
//         keyboardType={keyboardType}
//         style={styles.input}
//       />
//     </View>
//   );
// }

// /* ---------------- STYLES ---------------- */

// const styles = StyleSheet.create({
//   container: {
//     marginTop: 10,
//   },

//   sectionTitle: {
//     fontWeight: '700',
//     fontSize: 15,
//     marginBottom: 8,
//   },

//   label: {
//     fontSize: 13,
//     color: '#555',
//     marginBottom: 4,
//   },

//   input: {
//     borderWidth: 1,
//     borderColor: '#e5e7eb',
//     borderRadius: 8,
//     padding: 10,
//     backgroundColor: '#fff',
//   },

//   primaryBtn: {
//     backgroundColor: '#3F6AE1',
//     padding: 10,
//     borderRadius: 8,
//     marginTop: 12,
//     alignItems: 'center',
//   },

//   primaryBtnText: {
//     color: '#fff',
//     fontWeight: '700',
//   },

//   card: {
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 12,
//     marginTop: 10,
//     elevation: 2,
//   },

//   cardTitle: {
//     fontWeight: '600',
//   },

//   cardSub: {
//     color: '#666',
//     marginTop: 4,
//   },
// });

// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   TextInput,
//   Pressable,
//   StyleSheet,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   Alert,
// } from 'react-native';
// import { useDispatch, useSelector } from 'react-redux';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import { Picker } from '@react-native-picker/picker';

// import {
//   fetchFollowups,
//   addFollowup,
//   updateFollowup,
//   deleteFollowup,
// } from '../../deals/view/store/actions';

// import { selectDealFollowups } from '../../deals/view/store/selectors';

// export default function FollowupsTab({ dealId }) {
//   const dispatch = useDispatch();
//   const list = useSelector(selectDealFollowups);

//   const emptyForm = {
//     nextDate: null,
//     startTime: null,
//     remarks: '',
//     sendReminder: true,
//     remindBefore: 1,
//     remindUnit: 'DAYS',
//     status: 'PENDING',
//   };

//   const [form, setForm] = useState(emptyForm);
//   const [editingId, setEditingId] = useState(null);

//   const [showDate, setShowDate] = useState(false);
//   const [showTime, setShowTime] = useState(false);

//   useEffect(() => {
//     if (dealId) {
//       dispatch(fetchFollowups(dealId));
//     }
//   }, [dealId]);

//   /* ================= CREATE / UPDATE ================= */

//   const handleSave = () => {
//     if (!form.nextDate || !form.startTime) {
//       Alert.alert('Validation', 'Date and time required');
//       return;
//     }

//     const payload = {
//       nextDate: form.nextDate.toISOString().slice(0, 10),
//       startTime: form.startTime.toTimeString().slice(0, 5),
//       remarks: form.remarks,
//       sendReminder: form.sendReminder,
//       remindBefore: form.remindBefore,
//       remindUnit: form.remindUnit,
//       status: form.status,
//     };

//     if (editingId) {
//       dispatch(updateFollowup(dealId, editingId, payload));
//     } else {
//       dispatch(addFollowup(dealId, payload));
//     }

//     setForm(emptyForm);
//     setEditingId(null);
//   };

//   const handleEdit = item => {
//     setEditingId(item.id);
//     setForm({
//       nextDate: new Date(item.nextDate),
//       startTime: new Date(`1970-01-01T${item.startTime}`),
//       remarks: item.remarks,
//       sendReminder: item.sendReminder,
//       remindBefore: item.remindBefore,
//       remindUnit: item.remindUnit,
//       status: item.status,
//     });
//   };

//   const handleDelete = id => {
//     Alert.alert('Delete', 'Delete this followup?', [
//       { text: 'Cancel' },
//       {
//         text: 'Yes',
//         onPress: () => dispatch(deleteFollowup(dealId, id)),
//       },
//     ]);
//   };

//   /* ================= UI ================= */

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//       keyboardVerticalOffset={80}
//       style={{ flex: 1 }}
//     >
//       <ScrollView keyboardShouldPersistTaps="handled">
//         <View style={styles.container}>
//           {/* ================= FORM ================= */}

//           <Text style={styles.sectionTitle}>
//             {editingId ? 'Edit Followup' : 'Add Followup'}
//           </Text>

//           {/* Date */}
//           <Text style={styles.label}>Next Date</Text>
//           <Pressable style={styles.input} onPress={() => setShowDate(true)}>
//             <Text>
//               {form.nextDate
//                 ? form.nextDate.toISOString().slice(0, 10)
//                 : 'Select date'}
//             </Text>
//           </Pressable>

//           {showDate && (
//             <DateTimePicker
//               value={form.nextDate || new Date()}
//               mode="date"
//               onChange={(_, d) => {
//                 setShowDate(false);
//                 if (d) setForm({ ...form, nextDate: d });
//               }}
//             />
//           )}

//           {/* Time */}
//           <Text style={styles.label}>Start Time</Text>
//           <Pressable style={styles.input} onPress={() => setShowTime(true)}>
//             <Text>
//               {form.startTime
//                 ? form.startTime.toLocaleTimeString([], {
//                     hour: '2-digit',
//                     minute: '2-digit',
//                   })
//                 : 'Select time'}
//             </Text>
//           </Pressable>

//           {showTime && (
//             <DateTimePicker
//               value={form.startTime || new Date()}
//               mode="time"
//               onChange={(_, t) => {
//                 setShowTime(false);
//                 if (t) setForm({ ...form, startTime: t });
//               }}
//             />
//           )}

//           {/* Remarks */}
//           <Text style={styles.label}>Remarks</Text>
//           <TextInput
//             style={[styles.input, { height: 80 }]}
//             multiline
//             value={form.remarks}
//             onChangeText={v => setForm({ ...form, remarks: v })}
//           />

//           {/* Remind Before */}
//           <Text style={styles.label}>Remind Before</Text>
//           <TextInput
//             style={styles.input}
//             keyboardType="numeric"
//             value={String(form.remindBefore)}
//             onChangeText={v =>
//               setForm({ ...form, remindBefore: Number(v) || 0 })
//             }
//           />

//           {/* Remind Unit */}
//           <Text style={styles.label}>Remind Unit</Text>
//           <View style={styles.pickerBox}>
//             <Picker
//               selectedValue={form.remindUnit}
//               onValueChange={v => setForm({ ...form, remindUnit: v })}
//             >
//               <Picker.Item label="Days" value="DAYS" />
//               <Picker.Item label="Hours" value="HOURS" />
//             </Picker>
//           </View>

//           {/* Status */}
//           <Text style={styles.label}>Status</Text>
//           <View style={styles.pickerBox}>
//             <Picker
//               selectedValue={form.status}
//               onValueChange={v => setForm({ ...form, status: v })}
//             >
//               <Picker.Item label="Pending" value="PENDING" />
//               <Picker.Item label="Completed" value="COMPLETED" />
//               <Picker.Item label="Cancelled" value="Cancelled" />
//             </Picker>
//           </View>

//           <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
//             <Text style={styles.saveText}>{editingId ? 'Update' : 'Save'}</Text>
//           </TouchableOpacity>

//           {/* ================= TABLE ================= */}

//           <Text style={[styles.sectionTitle, { marginTop: 30 }]}>
//             All Followups
//           </Text>

//           <View style={styles.tableHeader}>
//             <Text style={styles.th}>Date</Text>
//             <Text style={styles.th}>Remarks</Text>
//             <Text style={styles.th}>Status</Text>
//             <Text style={styles.th}>Action</Text>
//           </View>

//           {list.map(item => (
//             <View key={item.id} style={styles.row}>
//               <Text style={styles.td}>
//                 {item.nextDate} {item.startTime}
//               </Text>

//               <Text style={styles.td} numberOfLines={1}>
//                 {item.remarks}
//               </Text>

//               <Text style={styles.td}>{item.status}</Text>

//               <View style={styles.actionRow}>
//                 <TouchableOpacity onPress={() => handleEdit(item)}>
//                   <Text style={styles.edit}>Edit</Text>
//                 </TouchableOpacity>

//                 <TouchableOpacity onPress={() => handleDelete(item.id)}>
//                   <Text style={styles.delete}>Delete</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           ))}
//         </View>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// }

// /* ================= STYLES ================= */

// const styles = StyleSheet.create({
//   container: { paddingVertical: 10 },

//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: '700',
//     marginBottom: 10,
//   },

//   label: {
//     fontSize: 13,
//     marginBottom: 4,
//     color: '#555',
//   },

//   input: {
//     borderWidth: 1,
//     borderColor: '#e5e7eb',
//     borderRadius: 8,
//     padding: 10,
//     backgroundColor: '#fff',
//     marginBottom: 10,
//   },

//   pickerBox: {
//     borderWidth: 1,
//     borderColor: '#e5e7eb',
//     borderRadius: 8,
//     marginBottom: 10,
//   },

//   saveBtn: {
//     backgroundColor: '#3F6AE1',
//     paddingVertical: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//   },

//   saveText: {
//     color: '#fff',
//     fontWeight: '700',
//   },

//   tableHeader: {
//     flexDirection: 'row',
//     borderBottomWidth: 1,
//     borderColor: '#e5e7eb',
//     paddingBottom: 6,
//   },

//   th: {
//     flex: 1,
//     fontWeight: '700',
//     fontSize: 12,
//   },

//   row: {
//     flexDirection: 'row',
//     paddingVertical: 10,
//     borderBottomWidth: 1,
//     borderColor: '#f1f5f9',
//     alignItems: 'center',
//   },

//   td: {
//     flex: 1,
//     fontSize: 12,
//   },

//   actionRow: {
//     flex: 1,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },

//   edit: {
//     color: '#3F6AE1',
//     fontWeight: '600',
//   },

//   delete: {
//     color: '#ef4444',
//     fontWeight: '600',
//   },
// });

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

import {
  fetchFollowups,
  addFollowup,
  updateFollowup,
  deleteFollowup,
} from '../../deals/view/store/actions';

import { selectDealFollowups } from '../../deals/view/store/selectors';

export default function FollowupsTab({ dealId }) {
  const dispatch = useDispatch();
  const list = useSelector(selectDealFollowups);

  const emptyForm = {
    nextDate: null,
    startTime: null,
    remarks: '',
    sendReminder: true,
    remindBefore: 1,
    remindUnit: 'DAYS',
    status: 'PENDING',
  };

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);

  useEffect(() => {
    if (dealId) {
      dispatch(fetchFollowups(dealId));
    }
  }, [dealId]);

  /* ================= CREATE / UPDATE ================= */

  const handleSave = () => {
    if (!form.nextDate || !form.startTime) {
      Alert.alert('Validation', 'Date and time required');
      return;
    }

    const payload = {
      nextDate: form.nextDate.toISOString().slice(0, 10),
      startTime: form.startTime.toTimeString().slice(0, 5),
      remarks: form.remarks,
      sendReminder: form.sendReminder,
      remindBefore: form.remindBefore,
      remindUnit: form.remindUnit,
      status: form.status,
    };

    if (editingId) {
      dispatch(updateFollowup(dealId, editingId, payload));
    } else {
      dispatch(addFollowup(dealId, payload));
    }

    setForm(emptyForm);
    setEditingId(null);
  };

  const handleEdit = item => {
    setEditingId(item.id);
    setForm({
      nextDate: new Date(item.nextDate),
      startTime: new Date(`1970-01-01T${item.startTime}`),
      remarks: item.remarks,
      sendReminder: item.sendReminder,
      remindBefore: item.remindBefore,
      remindUnit: item.remindUnit,
      status: item.status,
    });
  };

  const handleDelete = id => {
    Alert.alert('Delete', 'Delete this followup?', [
      { text: 'Cancel' },
      {
        text: 'Yes',
        onPress: () => dispatch(deleteFollowup(dealId, id)),
      },
    ]);
  };

  /* ================= UI ================= */

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}
      style={{ flex: 1 }}
    >
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          {/* ================= FORM ================= */}

          <Text style={styles.sectionTitle}>
            {editingId ? 'Edit Followup' : 'Add Followup'}
          </Text>

          {/* Date */}
          <Text style={styles.label}>Next Date</Text>
          <Pressable style={styles.input} onPress={() => setShowDate(true)}>
            <Text>
              {form.nextDate
                ? form.nextDate.toISOString().slice(0, 10)
                : 'Select date'}
            </Text>
          </Pressable>

          {showDate && (
            <DateTimePicker
              value={form.nextDate || new Date()}
              mode="date"
              onChange={(_, d) => {
                setShowDate(false);
                if (d) setForm({ ...form, nextDate: d });
              }}
            />
          )}

          {/* Time */}
          <Text style={styles.label}>Start Time</Text>
          <Pressable style={styles.input} onPress={() => setShowTime(true)}>
            <Text>
              {form.startTime
                ? form.startTime.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : 'Select time'}
            </Text>
          </Pressable>

          {showTime && (
            <DateTimePicker
              value={form.startTime || new Date()}
              mode="time"
              onChange={(_, t) => {
                setShowTime(false);
                if (t) setForm({ ...form, startTime: t });
              }}
            />
          )}

          {/* Remarks */}
          <Text style={styles.label}>Remarks</Text>
          <TextInput
            style={[styles.input, { height: 80 }]}
            multiline
            value={form.remarks}
            onChangeText={v => setForm({ ...form, remarks: v })}
          />

          {/* Remind Before */}
          <Text style={styles.label}>Remind Before</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={String(form.remindBefore)}
            onChangeText={v =>
              setForm({ ...form, remindBefore: Number(v) || 0 })
            }
          />

          {/* Remind Unit */}
          <Text style={styles.label}>Remind Unit</Text>
          <View style={styles.pickerBox}>
            <Picker
              selectedValue={form.remindUnit}
              onValueChange={v => setForm({ ...form, remindUnit: v })}
            >
              <Picker.Item label="Days" value="DAYS" />
              <Picker.Item label="Hours" value="HOURS" />
            </Picker>
          </View>

          {/* Status */}
          <Text style={styles.label}>Status</Text>
          <View style={styles.pickerBox}>
            <Picker
              selectedValue={form.status}
              onValueChange={v => setForm({ ...form, status: v })}
            >
              <Picker.Item label="Pending" value="PENDING" />
              <Picker.Item label="Completed" value="COMPLETED" />
              <Picker.Item label="Cancelled" value="Cancelled" />
            </Picker>
          </View>

          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveText}>{editingId ? 'Update' : 'Save'}</Text>
          </TouchableOpacity>

          {/* ================= TABLE ================= */}

          {/* ================= TABLE ================= */}

          <Text style={[styles.sectionTitle, { marginTop: 30 }]}>
            All Followups
          </Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View>
              {/* Header */}
              <View style={styles.tableHeader}>
                <Text style={[styles.th, { width: 130 }]}>Date</Text>
                <Text style={[styles.th, { width: 200 }]}>Remarks</Text>
                <Text style={[styles.th, { width: 110 }]}>Status</Text>
                <Text style={[styles.th, { width: 140 }]}>Reminder</Text>
                <Text style={[styles.th, { width: 120 }]}>Actions</Text>
              </View>

              {/* Rows */}
              {list.map(item => (
                <View key={item.id} style={styles.row}>
                  <Text style={[styles.td, { width: 130 }]}>
                    {item.nextDate} {item.startTime}
                  </Text>

                  <Text style={[styles.td, { width: 200 }]} numberOfLines={1}>
                    {item.remarks}
                  </Text>

                  <Text style={[styles.td, { width: 110 }]}>{item.status}</Text>

                  <Text style={[styles.td, { width: 140 }]}>
                    {item.remindBefore} {item.remindUnit}
                  </Text>

                  <View style={[styles.actionRow, { width: 120 }]}>
                    <TouchableOpacity onPress={() => handleEdit(item)}>
                      <Text style={styles.edit}>Edit</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => handleDelete(item.id)}>
                      <Text style={styles.delete}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { paddingVertical: 10 },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },

  label: {
    fontSize: 13,
    marginBottom: 4,
    color: '#555',
  },

  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
    marginBottom: 10,
  },

  pickerBox: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    marginBottom: 10,
  },

  saveBtn: {
    backgroundColor: '#3F6AE1',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },

  saveText: {
    color: '#fff',
    fontWeight: '700',
  },

  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
    paddingBottom: 6,
  },

  th: {
    flex: 1,
    fontWeight: '700',
    fontSize: 12,
  },

  row: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#f1f5f9',
    alignItems: 'center',
  },

  td: {
    flex: 1,
    fontSize: 12,
  },

  actionRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  edit: {
    color: '#3F6AE1',
    fontWeight: '600',
  },

  delete: {
    color: '#ef4444',
    fontWeight: '600',
  },
});
