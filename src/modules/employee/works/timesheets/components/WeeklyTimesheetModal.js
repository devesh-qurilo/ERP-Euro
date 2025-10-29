// import React, { useEffect, useMemo, useState } from 'react';
// import {
//   Modal,
//   View,
//   Text,
//   StyleSheet,
//   Pressable,
//   TextInput,
//   ScrollView,
// } from 'react-native';

// const days = [
//   { key: 'day1Hours', label: 'Mon' },
//   { key: 'day2Hours', label: 'Tue' },
//   { key: 'day3Hours', label: 'Wed' },
//   { key: 'day4Hours', label: 'Thu' },
//   { key: 'day5Hours', label: 'Fri' },
//   { key: 'day6Hours', label: 'Sat' },
//   { key: 'day7Hours', label: 'Sun' },
// ];

// // Tiny dropdown (no external deps)
// function Select({ value, options = [], onChange, placeholder = 'Select' }) {
//   const [open, setOpen] = useState(false);
//   const current = options.find(o => o.value === value)?.label || placeholder;
//   return (
//     <View style={{ position: 'relative' }}>
//       <Pressable style={styles.selectBtn} onPress={() => setOpen(o => !o)}>
//         <Text style={styles.value}>{current}</Text>
//         <Text style={styles.caret}>{open ? '▴' : '▾'}</Text>
//       </Pressable>
//       {open && (
//         <View style={styles.menu}>
//           <ScrollView style={{ maxHeight: 240 }}>
//             {options.map(opt => (
//               <Pressable
//                 key={String(opt.value)}
//                 style={styles.menuItem}
//                 onPress={() => {
//                   onChange(opt.value);
//                   setOpen(false);
//                 }}
//               >
//                 <Text style={styles.menuTxt}>{opt.label}</Text>
//               </Pressable>
//             ))}
//           </ScrollView>
//         </View>
//       )}
//     </View>
//   );
// }

// export default function WeeklyTimesheetModal({
//   visible,
//   onClose,
//   tasks = [], // <-- /me/tasks (array)
//   weekly, // <-- GET /weekly-timesheets/me result
//   loading = false,
//   onFetch, // (weekStartDate: string) => void
//   onCreate, // (payload) => void
// }) {
//   const taskOptions = useMemo(
//     () => tasks.map(t => ({ value: t.id, label: t.title || `Task #${t.id}` })),
//     [tasks],
//   );

//   const [taskId, setTaskId] = useState(null);
//   const [weekStartDate, setWeekStartDate] = useState('');
//   const [hours, setHours] = useState({
//     day1Hours: 0,
//     day2Hours: 0,
//     day3Hours: 0,
//     day4Hours: 0,
//     day5Hours: 0,
//     day6Hours: 0,
//     day7Hours: 0,
//   });

//   // When weekStartDate changes, fetch existing weekly timesheet (API is user-scoped)
//   useEffect(() => {
//     if (visible && weekStartDate) onFetch?.(weekStartDate);
//   }, [visible, weekStartDate, onFetch]);

//   // When weekly data arrives, prefill hours
//   useEffect(() => {
//     if (!weekly) return;
//     const next = { ...hours };
//     for (const d of days) {
//       const v = weekly?.[d.key];
//       if (typeof v === 'number') next[d.key] = v;
//     }
//     setHours(next);
//     // If modal opened without choosing a task, default to weekly.taskId
//     if (!taskId && weekly?.taskId) setTaskId(weekly.taskId);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [weekly]);

//   const total = useMemo(
//     () => days.reduce((sum, d) => sum + Number(hours[d.key] || 0), 0),
//     [hours],
//   );

//   const setHour = (key, raw) => {
//     const n = Math.max(
//       0,
//       Math.min(24, Number(String(raw).replace(/[^\d.]/g, '')) || 0),
//     );
//     setHours(h => ({ ...h, [key]: n }));
//   };

//   const handleSave = () => {
//     if (!taskId || !weekStartDate) return;
//     onCreate?.({ taskId, weekStartDate, ...hours });
//   };

//   return (
//     <Modal
//       visible={visible}
//       transparent
//       animationType="fade"
//       onRequestClose={onClose}
//     >
//       <View style={styles.backdrop}>
//         <View style={styles.sheet}>
//           {/* Header */}
//           <View style={styles.header}>
//             <Text style={styles.title}>Weekly Timesheet</Text>
//             <Pressable onPress={onClose} style={styles.close}>
//               <Text style={{ fontWeight: '900' }}>✕</Text>
//             </Pressable>
//           </View>

//           {/* Grid */}
//           <ScrollView
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             contentContainerStyle={{ padding: 12 }}
//           >
//             <View style={styles.grid}>
//               {/* Top header row: Task + dates */}
//               <View style={[styles.row, styles.topRow]}>
//                 <View style={[styles.cell, { width: 220 }]}>
//                   <Text style={styles.headTiny}>Task</Text>
//                 </View>
//                 {days.map((d, idx) => (
//                   <View
//                     key={d.key}
//                     style={[styles.cell, styles.dateHead, { width: 120 }]}
//                   >
//                     <Text style={styles.dateBig}>
//                       {/* day number filled by UX? */}
//                     </Text>
//                     <Text style={styles.dateSmall}>
//                       {/* Show weekday labels only; actual date formatting can be added later */}
//                       {d.label}
//                     </Text>
//                   </View>
//                 ))}
//               </View>

//               {/* Input row */}
//               <View style={styles.row}>
//                 <View style={[styles.cell, { width: 220 }]}>
//                   <Select
//                     value={taskId}
//                     options={taskOptions}
//                     onChange={setTaskId}
//                     placeholder="Select"
//                   />
//                   <View style={{ marginTop: 8 }}>
//                     <Text style={styles.headTiny}>Week start (YYYY-MM-DD)</Text>
//                     <TextInput
//                       value={weekStartDate}
//                       onChangeText={setWeekStartDate}
//                       placeholder="2025-01-15"
//                       placeholderTextColor="#9ca3af"
//                       style={styles.input}
//                       autoCapitalize="none"
//                     />
//                   </View>
//                 </View>

//                 {days.map(d => (
//                   <View
//                     key={d.key}
//                     style={[styles.cell, { width: 120, alignItems: 'center' }]}
//                   >
//                     <TextInput
//                       keyboardType="numeric"
//                       value={String(hours[d.key] ?? 0)}
//                       onChangeText={v => setHour(d.key, v)}
//                       style={styles.hourBox}
//                     />
//                   </View>
//                 ))}
//               </View>

//               {/* Totals row */}
//               <View style={[styles.row, styles.totalRow]}>
//                 <View style={[styles.cell, { width: 220 }]}>
//                   <Text style={styles.totalLabel}>Total</Text>
//                 </View>
//                 {days.map(d => (
//                   <View
//                     key={d.key}
//                     style={[styles.cell, { width: 120, alignItems: 'center' }]}
//                   >
//                     <Text style={styles.totalCell}>
//                       {Number(hours[d.key] || 0)}hrs
//                     </Text>
//                   </View>
//                 ))}
//               </View>
//             </View>
//           </ScrollView>

//           {/* Footer actions */}
//           <View style={styles.actions}>
//             <Pressable style={styles.secondaryBtn}>
//               <Text style={styles.secondaryTxt}>+ Add More</Text>
//             </Pressable>
//             <Pressable
//               disabled={loading || !taskId || !weekStartDate}
//               onPress={handleSave}
//               style={[
//                 styles.primaryBtn,
//                 (loading || !taskId || !weekStartDate) && styles.btnDisabled,
//               ]}
//             >
//               <Text style={styles.primaryTxt}>
//                 {loading ? 'Saving…' : 'Save'}
//               </Text>
//             </Pressable>
//             {/* <Pressable
//               disabled
//               style={[styles.primaryBtn, styles.approveBtn, { opacity: 0.6 }]}
//             >
//               <Text style={[styles.primaryTxt, { color: '#fff' }]}>
//                 Submit For Approval
//               </Text>
//             </Pressable> */}
//             <View style={{ flex: 1 }} />
//             <Text style={styles.totalBig}>{total} hrs</Text>
//           </View>
//         </View>
//       </View>
//     </Modal>
//   );
// }

// const styles = StyleSheet.create({
//   backdrop: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.25)',
//     justifyContent: 'center',
//     padding: 16,
//   },
//   sheet: { backgroundColor: '#fff', borderRadius: 14, overflow: 'hidden' },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     padding: 12,
//     borderBottomWidth: 1,
//     borderColor: '#e5e7eb',
//   },
//   title: { fontSize: 18, fontWeight: '900', color: '#0b0b0c' },
//   close: { padding: 6 },

//   grid: {
//     borderWidth: 1,
//     borderColor: '#e5e7eb',
//     borderRadius: 12,
//     overflow: 'hidden',
//   },
//   row: { flexDirection: 'row', borderTopWidth: 1, borderColor: '#f1f5f9' },
//   topRow: { backgroundColor: '#e8f0ff', borderTopWidth: 0 },
//   totalRow: { backgroundColor: '#fafafa' },

//   cell: { padding: 12, borderRightWidth: 1, borderColor: '#f1f5f9' },
//   headTiny: { fontSize: 12, fontWeight: '800', color: '#374151' },
//   dateHead: { alignItems: 'center' },
//   dateBig: { fontSize: 18, fontWeight: '900', color: '#111827' },
//   dateSmall: { color: '#6b7280' },

//   input: {
//     marginTop: 6,
//     borderWidth: 1,
//     borderColor: '#e5e7eb',
//     borderRadius: 10,
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     color: '#111827',
//     backgroundColor: '#fff',
//   },
//   hourBox: {
//     width: 56,
//     textAlign: 'center',
//     borderWidth: 1,
//     borderColor: '#e5e7eb',
//     borderRadius: 10,
//     paddingVertical: 8,
//     color: '#111827',
//     backgroundColor: '#fff',
//   },

//   totalLabel: { fontWeight: '900', color: '#0b0b0c' },
//   totalCell: { fontWeight: '900', color: '#111827' },
//   totalBig: { fontWeight: '900', color: '#111827', paddingRight: 12 },

//   actions: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 12,
//     gap: 8,
//     borderTopWidth: 1,
//     borderColor: '#e5e7eb',
//   },
//   secondaryBtn: {
//     borderWidth: 1,
//     borderColor: '#e5e7eb',
//     borderRadius: 10,
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     backgroundColor: '#fff',
//   },
//   secondaryTxt: { fontWeight: '800', color: '#111827' },
//   primaryBtn: {
//     borderWidth: 1,
//     borderColor: '#1d4ed8',
//     borderRadius: 10,
//     paddingHorizontal: 14,
//     paddingVertical: 10,
//     backgroundColor: '#fff',
//   },
//   approveBtn: { backgroundColor: '#111827', borderColor: '#111827' },
//   primaryTxt: { fontWeight: '900', color: '#111827' },
//   btnDisabled: { opacity: 0.6 },
//   selectBtn: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#e5e7eb',
//     backgroundColor: '#fff',
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     borderRadius: 10,
//   },
//   value: { flex: 1, color: '#111827' },
//   caret: { color: '#6b7280' },
//   menu: {
//     position: 'absolute',
//     top: 48,
//     left: 0,
//     right: 0,
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: '#e5e7eb',
//     zIndex: 50,
//   },
//   menuItem: {
//     paddingVertical: 10,
//     paddingHorizontal: 12,
//     borderBottomWidth: StyleSheet.hairlineWidth,
//     borderBottomColor: '#f1f5f9',
//   },
//   menuTxt: { color: '#111827' },
// });

// import React, { useEffect, useMemo, useRef, useState } from 'react';
// import {
//   Modal,
//   View,
//   Text,
//   StyleSheet,
//   Pressable,
//   TextInput,
//   ScrollView,
// } from 'react-native';

// const days = [
//   { key: 'day1Hours', label: 'Mon' },
//   { key: 'day2Hours', label: 'Tue' },
//   { key: 'day3Hours', label: 'Wed' },
//   { key: 'day4Hours', label: 'Thu' },
//   { key: 'day5Hours', label: 'Fri' },
//   { key: 'day6Hours', label: 'Sat' },
//   { key: 'day7Hours', label: 'Sun' },
// ];

// function Select({ value, options = [], onChange, placeholder = 'Select' }) {
//   const [open, setOpen] = useState(false);
//   const current = options.find(o => o.value === value)?.label || placeholder;
//   return (
//     <View style={{ position: 'relative' }}>
//       <Pressable style={styles.selectBtn} onPress={() => setOpen(o => !o)}>
//         <Text style={styles.value}>{current}</Text>
//         <Text style={styles.caret}>{open ? '▴' : '▾'}</Text>
//       </Pressable>
//       {open && (
//         <View style={styles.menu}>
//           <ScrollView style={{ maxHeight: 240 }}>
//             {options.map(opt => (
//               <Pressable
//                 key={String(opt.value)}
//                 style={styles.menuItem}
//                 onPress={() => {
//                   onChange(opt.value);
//                   setOpen(false);
//                 }}
//               >
//                 <Text style={styles.menuTxt}>{opt.label}</Text>
//               </Pressable>
//             ))}
//           </ScrollView>
//         </View>
//       )}
//     </View>
//   );
// }

// export default function WeeklyTimesheetModal({
//   visible,
//   onClose,
//   tasks = [], // /me/tasks
//   weekly, // store -> last GET/POST result
//   loading = false, // store -> weekly loading
//   onFetch, // (weekStartDate: string)
//   onCreate, // (payload) => void (dispatch)
// }) {
//   const taskOptions = useMemo(
//     () => tasks.map(t => ({ value: t.id, label: t.title || `Task #${t.id}` })),
//     [tasks],
//   );

//   const [taskId, setTaskId] = useState(null);
//   const [weekStartDate, setWeekStartDate] = useState('');
//   const [hours, setHours] = useState({
//     day1Hours: 0,
//     day2Hours: 0,
//     day3Hours: 0,
//     day4Hours: 0,
//     day5Hours: 0,
//     day6Hours: 0,
//     day7Hours: 0,
//   });

//   // bottom table rows (local)
//   const [rows, setRows] = useState([]);
//   const [saving, setSaving] = useState(false);
//   const lastSubmitRef = useRef(null); // {taskId, weekStartDate}

//   useEffect(() => {
//     if (!visible) {
//       // reset only UI flags; keep rows so user sees the history while open
//       setSaving(false);
//       return;
//     }
//   }, [visible]);

//   // Fetch existing for given week (user-scoped)
//   useEffect(() => {
//     if (visible && weekStartDate) onFetch?.(weekStartDate);
//   }, [visible, weekStartDate, onFetch]);

//   // Prefill from GET or POST success
//   useEffect(() => {
//     if (!weekly) return;
//     // If weekly came from GET (or POST), prefill hours and optionally task
//     const next = { ...hours };
//     days.forEach(d => {
//       const v = weekly?.[d.key];
//       if (typeof v === 'number') next[d.key] = v;
//     });
//     setHours(next);
//     if (!taskId && weekly?.taskId) setTaskId(weekly.taskId);

//     // If we're saving and this weekly matches our last submit → append/update table and stop saving
//     const last = lastSubmitRef.current;
//     if (saving && last && weekly.weekStartDate === last.weekStartDate) {
//       setRows(prev => {
//         const idx = prev.findIndex(
//           r =>
//             r.weekStartDate === weekly.weekStartDate &&
//             r.taskId === (weekly.taskId || last.taskId),
//         );
//         const item = {
//           taskId: weekly.taskId || last.taskId,
//           weekStartDate: weekly.weekStartDate,
//           totalHours:
//             weekly.totalHours ??
//             days.reduce((s, d) => s + Number(weekly[d.key] || 0), 0),
//           ...days.reduce(
//             (acc, d) => ({ ...acc, [d.key]: weekly[d.key] ?? 0 }),
//             {},
//           ),
//         };
//         if (idx >= 0) {
//           const copy = [...prev];
//           copy[idx] = item;
//           return copy;
//         }
//         return [item, ...prev];
//       });
//       setSaving(false);
//       lastSubmitRef.current = null;
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [weekly]);

//   const setHour = (key, raw) => {
//     const n = Math.max(
//       0,
//       Math.min(24, Number(String(raw).replace(/[^\d.]/g, '')) || 0),
//     );
//     setHours(h => ({ ...h, [key]: n }));
//   };

//   const total = useMemo(
//     () => days.reduce((sum, d) => sum + Number(hours[d.key] || 0), 0),
//     [hours],
//   );

//   const handleSave = () => {
//     if (!taskId || !weekStartDate) return;
//     const payload = { taskId, weekStartDate, ...hours };
//     lastSubmitRef.current = { taskId, weekStartDate };
//     setSaving(true);
//     onCreate?.(payload);
//   };

//   const resetForNext = () => {
//     // keep the same task to speed up multiple entries for one task,
//     // but reset week date and hours to 0 (tweak as you prefer)
//     setWeekStartDate('');
//     setHours({
//       day1Hours: 0,
//       day2Hours: 0,
//       day3Hours: 0,
//       day4Hours: 0,
//       day5Hours: 0,
//       day6Hours: 0,
//       day7Hours: 0,
//     });
//   };

//   return (
//     <Modal
//       visible={visible}
//       transparent
//       animationType="fade"
//       onRequestClose={onClose}
//     >
//       <View style={styles.backdrop}>
//         <View style={styles.sheet}>
//           {/* Header */}
//           <View style={styles.header}>
//             <Text style={styles.title}>Weekly Timesheet</Text>
//             <Pressable onPress={onClose} style={styles.close}>
//               <Text style={{ fontWeight: '900' }}>✕</Text>
//             </Pressable>
//           </View>

//           {/* Grid */}
//           <ScrollView
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             contentContainerStyle={{ padding: 12 }}
//           >
//             <View style={styles.grid}>
//               {/* top labels */}
//               <View style={[styles.row, styles.topRow]}>
//                 <View style={[styles.cell, { width: 260 }]}>
//                   <Text style={styles.headTiny}>Task / Week</Text>
//                 </View>
//                 {days.map(d => (
//                   <View
//                     key={d.key}
//                     style={[styles.cell, styles.dateHead, { width: 120 }]}
//                   >
//                     <Text style={styles.dateBig}>{d.label}</Text>
//                     <Text style={styles.dateSmall}>Hours</Text>
//                   </View>
//                 ))}
//               </View>

//               {/* inputs */}
//               <View className="row" style={styles.row}>
//                 <View style={[styles.cell, { width: 260 }]}>
//                   <Select
//                     value={taskId}
//                     options={taskOptions}
//                     onChange={setTaskId}
//                     placeholder="Select task"
//                   />
//                   <View style={{ marginTop: 8 }}>
//                     <Text style={styles.headTiny}>Week start (YYYY-MM-DD)</Text>
//                     <TextInput
//                       value={weekStartDate}
//                       onChangeText={setWeekStartDate}
//                       placeholder="2025-01-15"
//                       placeholderTextColor="#9ca3af"
//                       style={styles.input}
//                     />
//                   </View>
//                 </View>

//                 {days.map(d => (
//                   <View
//                     key={d.key}
//                     style={[styles.cell, { width: 120, alignItems: 'center' }]}
//                   >
//                     <TextInput
//                       keyboardType="numeric"
//                       value={String(hours[d.key] ?? 0)}
//                       onChangeText={v => setHour(d.key, v)}
//                       style={styles.hourBox}
//                     />
//                   </View>
//                 ))}
//               </View>

//               {/* totals */}
//               <View style={[styles.row, styles.totalRow]}>
//                 <View style={[styles.cell, { width: 260 }]}>
//                   <Text style={styles.totalLabel}>Total</Text>
//                 </View>
//                 {days.map(d => (
//                   <View
//                     key={d.key}
//                     style={[styles.cell, { width: 120, alignItems: 'center' }]}
//                   >
//                     <Text style={styles.totalCell}>
//                       {Number(hours[d.key] || 0)}hrs
//                     </Text>
//                   </View>
//                 ))}
//               </View>
//             </View>
//           </ScrollView>

//           {/* Footer actions */}
//           <View style={styles.actions}>
//             {/* <Pressable style={styles.secondaryBtn}>
//               <Text style={styles.secondaryTxt}>+ Add More</Text>
//             </Pressable> */}
//             <Pressable style={styles.secondaryBtn} onPress={resetForNext}>
//               <Text style={styles.secondaryTxt}>+ Add More</Text>
//             </Pressable>
//             <Pressable
//               disabled={loading || saving || !taskId || !weekStartDate}
//               onPress={handleSave}
//               style={[
//                 styles.primaryBtn,
//                 (loading || saving || !taskId || !weekStartDate) &&
//                   styles.btnDisabled,
//               ]}
//             >
//               <Text style={styles.primaryTxt}>
//                 {saving ? 'Saving…' : 'Save'}
//               </Text>
//             </Pressable>
//             <Pressable
//               disabled
//               style={[styles.primaryBtn, styles.approveBtn, { opacity: 0.6 }]}
//             >
//               <Text style={[styles.primaryTxt, { color: '#fff' }]}>
//                 Submit For Approval
//               </Text>
//             </Pressable>
//             <View style={{ flex: 1 }} />
//             <Text style={styles.totalBig}>{total} hrs</Text>
//           </View>

//           {/* Submitted rows table (inside same modal) */}
//           <View style={{ paddingHorizontal: 12, paddingBottom: 12 }}>
//             <Text style={styles.subTableTitle}>Entries in this session</Text>
//             <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//               <View style={styles.table}>
//                 {/* head */}
//                 <View style={[styles.trow, { backgroundColor: '#e8f0ff' }]}>
//                   <View style={[styles.tcell, { width: 180 }]}>
//                     <Text style={styles.th}>Task</Text>
//                   </View>
//                   <View style={[styles.tcell, { width: 130 }]}>
//                     <Text style={styles.th}>Week Start</Text>
//                   </View>
//                   {days.map(d => (
//                     <View key={d.key} style={[styles.tcell, { width: 90 }]}>
//                       <Text style={styles.th}>{d.label}</Text>
//                     </View>
//                   ))}
//                   <View style={[styles.tcell, { width: 90 }]}>
//                     <Text style={styles.th}>Total</Text>
//                   </View>
//                 </View>
//                 {/* body */}
//                 {(rows.length ? rows : []).map((r, i) => (
//                   <View
//                     key={`${r.taskId}-${r.weekStartDate}-${i}`}
//                     style={styles.trow}
//                   >
//                     <View style={[styles.tcell, { width: 180 }]}>
//                       <Text style={styles.td}>#{r.taskId}</Text>
//                     </View>
//                     <View style={[styles.tcell, { width: 130 }]}>
//                       <Text style={styles.td}>{r.weekStartDate}</Text>
//                     </View>
//                     {days.map(d => (
//                       <View key={d.key} style={[styles.tcell, { width: 90 }]}>
//                         <Text style={styles.td}>{r[d.key] ?? 0}</Text>
//                       </View>
//                     ))}
//                     <View style={[styles.tcell, { width: 90 }]}>
//                       <Text style={styles.td}>{r.totalHours ?? 0}</Text>
//                     </View>
//                   </View>
//                 ))}
//                 {!rows.length && (
//                   <View style={styles.trow}>
//                     <Text
//                       style={[styles.td, { padding: 10, color: '#64748b' }]}
//                     >
//                       No entries yet
//                     </Text>
//                   </View>
//                 )}
//               </View>
//             </ScrollView>
//           </View>
//         </View>
//       </View>
//     </Modal>
//   );
// }

// const styles = StyleSheet.create({
//   backdrop: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.25)',
//     justifyContent: 'center',
//     padding: 16,
//   },
//   sheet: { backgroundColor: '#fff', borderRadius: 14, overflow: 'hidden' },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     padding: 12,
//     borderBottomWidth: 1,
//     borderColor: '#e5e7eb',
//   },
//   title: { fontSize: 18, fontWeight: '900', color: '#0b0b0c' },
//   close: { padding: 6 },

//   grid: {
//     borderWidth: 1,
//     borderColor: '#e5e7eb',
//     borderRadius: 12,
//     overflow: 'hidden',
//   },
//   row: { flexDirection: 'row', borderTopWidth: 1, borderColor: '#f1f5f9' },
//   topRow: { backgroundColor: '#e8f0ff', borderTopWidth: 0 },
//   totalRow: { backgroundColor: '#fafafa' },

//   cell: { padding: 12, borderRightWidth: 1, borderColor: '#f1f5f9' },
//   headTiny: { fontSize: 12, fontWeight: '800', color: '#374151' },
//   dateHead: { alignItems: 'center' },
//   dateBig: { fontSize: 16, fontWeight: '900', color: '#111827' },
//   dateSmall: { color: '#6b7280' },

//   input: {
//     marginTop: 6,
//     borderWidth: 1,
//     borderColor: '#e5e7eb',
//     borderRadius: 10,
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     color: '#111827',
//     backgroundColor: '#fff',
//   },
//   hourBox: {
//     width: 56,
//     textAlign: 'center',
//     borderWidth: 1,
//     borderColor: '#e5e7eb',
//     borderRadius: 10,
//     paddingVertical: 8,
//     color: '#111827',
//     backgroundColor: '#fff',
//   },

//   actions: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 12,
//     gap: 8,
//     borderTopWidth: 1,
//     borderColor: '#e5e7eb',
//   },
//   secondaryBtn: {
//     borderWidth: 1,
//     borderColor: '#e5e7eb',
//     borderRadius: 10,
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     backgroundColor: '#fff',
//   },
//   secondaryTxt: { fontWeight: '800', color: '#111827' },
//   primaryBtn: {
//     borderWidth: 1,
//     borderColor: '#1d4ed8',
//     borderRadius: 10,
//     paddingHorizontal: 14,
//     paddingVertical: 10,
//     backgroundColor: '#fff',
//   },
//   approveBtn: { backgroundColor: '#111827', borderColor: '#111827' },
//   primaryTxt: { fontWeight: '900', color: '#111827' },
//   btnDisabled: { opacity: 0.6 },

//   selectBtn: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#e5e7eb',
//     backgroundColor: '#fff',
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     borderRadius: 10,
//   },
//   value: { flex: 1, color: '#111827' },
//   caret: { color: '#6b7280' },
//   menu: {
//     position: 'absolute',
//     top: 48,
//     left: 0,
//     right: 0,
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: '#e5e7eb',
//     zIndex: 50,
//   },
//   menuItem: {
//     paddingVertical: 10,
//     paddingHorizontal: 12,
//     borderBottomWidth: StyleSheet.hairlineWidth,
//     borderBottomColor: '#f1f5f9',
//   },
//   menuTxt: { color: '#111827' },

//   totalLabel: { fontWeight: '900', color: '#0b0b0c' },
//   totalCell: { fontWeight: '900', color: '#111827' },
//   totalBig: { fontWeight: '900', color: '#111827', paddingRight: 12 },

//   subTableTitle: {
//     fontSize: 16,
//     fontWeight: '900',
//     color: '#0b0b0c',
//     marginBottom: 6,
//   },
//   table: {
//     borderWidth: 1,
//     borderColor: '#e5e7eb',
//     borderRadius: 12,
//     overflow: 'hidden',
//   },
//   trow: { flexDirection: 'row', borderTopWidth: 1, borderColor: '#f1f5f9' },
//   th: { fontWeight: '900', color: '#374151', padding: 10 },
//   td: { color: '#111827', padding: 10 },
//   tcell: {
//     borderRightWidth: 1,
//     borderColor: '#f1f5f9',
//     justifyContent: 'center',
//   },
// });

// src/modules/employee/works/timesheets/components/WeeklyTimesheetModal.js
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
} from 'react-native';
import { useSelector } from 'react-redux';
import { selectTasks } from '../../tasks/store/selectors';

const dayKeys = [
  'day1Hours',
  'day2Hours',
  'day3Hours',
  'day4Hours',
  'day5Hours',
  'day6Hours',
  'day7Hours',
];

const initialHours = () => ({
  day1Hours: 0,
  day2Hours: 0,
  day3Hours: 0,
  day4Hours: 0,
  day5Hours: 0,
  day6Hours: 0,
  day7Hours: 0,
});

const numberOnly = v => {
  if (v === '' || v === null || v === undefined) return '';
  const n = String(v).replace(/[^\d.]/g, '');
  return n;
};

export default function WeeklyTimesheetModal({
  visible,
  loading = false,
  weekly, // result of GET /weekly-timesheets/me (single object)
  onFetch, // (weekStartDate) => dispatch(getWeeklyTimesheet(...))
  onCreate, // (payload) => dispatch(createWeeklyTimesheet(...))
  onClose,
}) {
  // Pull "my tasks" right here (so we don't touch the parent screen)
  const myTasks = useSelector(selectTasks) || [];

  const [taskId, setTaskId] = useState(null);
  const [weekStartDate, setWeekStartDate] = useState('');
  const [hours, setHours] = useState(initialHours());
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');
  const [toast, setToast] = useState('');

  // local table of created/fetched rows (within this modal session)
  const [rows, setRows] = useState([]);
  const lastFetchedWeek = useRef(null);

  const total = useMemo(
    () => dayKeys.reduce((acc, k) => acc + (parseFloat(hours[k]) || 0), 0),
    [hours],
  );

  // Reset state when modal opens
  useEffect(() => {
    if (visible) {
      setErr('');
      setToast('');
      setSaving(false);
      setRows([]);
      // keep previously chosen task to speed up multiple entries
      setWeekStartDate('');
      setHours(initialHours());
    } else {
      // fully reset when closing
      setTaskId(null);
      setWeekStartDate('');
      setHours(initialHours());
      setRows([]);
      setErr('');
      setToast('');
      setSaving(false);
    }
  }, [visible]);

  // If parent fetches one weekly object, merge it into our rows
  useEffect(() => {
    if (weekly && visible) {
      setRows(prev => {
        const exists = prev.find(
          r =>
            r.id === weekly.id ||
            (r.taskId === weekly.taskId &&
              r.weekStartDate === weekly.weekStartDate),
        );
        if (exists) {
          // replace existing
          return prev.map(r =>
            r.id === weekly.id ||
            (r.taskId === weekly.taskId &&
              r.weekStartDate === weekly.weekStartDate)
              ? weekly
              : r,
          );
        }
        return [weekly, ...prev];
      });
    }
  }, [weekly, visible]);

  const setHour = (k, v) => {
    const clean = numberOnly(v);
    setHours(h => ({ ...h, [k]: clean === '' ? 0 : parseFloat(clean) || 0 }));
  };

  const validate = () => {
    if (!taskId) return 'Please select a task.';
    if (!weekStartDate) return 'Please enter Week Start Date (YYYY-MM-DD).';
    // Optional: basic ISO date check
    if (!/^\d{4}-\d{2}-\d{2}$/.test(weekStartDate)) {
      return 'Invalid Week Start Date format. Use YYYY-MM-DD.';
    }
    return '';
  };

  const handleSave = async () => {
    setErr('');
    setToast('');
    const v = validate();
    if (v) {
      setErr(v);
      return;
    }
    const payload = {
      taskId,
      weekStartDate,
      ...hours,
    };

    try {
      setSaving(true);
      // 1) POST /weekly-timesheets
      const created = await onCreate(payload); // should return created object

      // 2) Immediately refresh for that week using your GET /weekly-timesheets/me
      if (onFetch) {
        lastFetchedWeek.current = weekStartDate;
        await onFetch(weekStartDate);
      } else {
        // If no fetch provided (shouldn't happen), at least push created locally
        setRows(prev => [created, ...prev]);
      }

      setToast('Saved!');
    } catch (e) {
      setErr(e?.message || 'Failed to save weekly timesheet.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddMore = () => {
    // Keep same task, clear week + hours
    setWeekStartDate('');
    setHours(initialHours());
    setErr('');
    setToast('');
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Weekly Timesheet</Text>
            <Pressable onPress={onClose} style={styles.close}>
              <Text style={{ fontWeight: '900' }}>✕</Text>
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={{ padding: 12 }}>
            {/* Task select */}
            <View style={{ marginBottom: 10 }}>
              <Text style={styles.label}>Task</Text>
              <View style={styles.select}>
                <ScrollView style={{ maxHeight: 160 }}>
                  {myTasks.length ? (
                    myTasks.map(t => (
                      <Pressable
                        key={t.id}
                        style={[
                          styles.option,
                          taskId === t.id && styles.optionActive,
                        ]}
                        onPress={() => setTaskId(t.id)}
                      >
                        <Text
                          style={[
                            styles.optionTxt,
                            taskId === t.id && styles.optionTxtActive,
                          ]}
                          numberOfLines={1}
                        >
                          #{String(t.id).padStart(3, '0')} — {t.title}
                        </Text>
                        {t.taskStage?.name ? (
                          <Text style={styles.dim}>
                            {t.taskStage.name} • {t.priority || '—'}
                          </Text>
                        ) : null}
                      </Pressable>
                    ))
                  ) : (
                    <Text style={styles.dim}>No tasks found.</Text>
                  )}
                </ScrollView>
              </View>
            </View>

            {/* Week start date */}
            <View style={{ marginBottom: 10 }}>
              <Text style={styles.label}>Week Start Date (YYYY-MM-DD)</Text>
              <TextInput
                value={weekStartDate}
                onChangeText={setWeekStartDate}
                placeholder="2025-01-15"
                placeholderTextColor="#9ca3af"
                style={styles.input}
                autoCapitalize="none"
              />
            </View>

            {/* Hours grid */}
            <View style={styles.grid}>
              {dayKeys.map((k, i) => (
                <View key={k} style={{ flex: 1, minWidth: 120 }}>
                  <Text style={styles.subLabel}>Day {i + 1} Hours</Text>
                  <TextInput
                    keyboardType="numeric"
                    value={String(hours[k] ?? 0)}
                    onChangeText={v => setHour(k, v)}
                    style={styles.input}
                    placeholder="0"
                    placeholderTextColor="#9ca3af"
                  />
                </View>
              ))}
            </View>

            {/* Totals */}
            <Text style={styles.totalTxt}>Total: {total} h</Text>

            {/* Buttons */}
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
              <Pressable
                onPress={handleAddMore}
                style={[styles.secondaryBtn]}
                disabled={saving || loading}
              >
                <Text style={styles.secondaryTxt}>+ Add More</Text>
              </Pressable>

              <Pressable
                onPress={handleSave}
                style={[
                  styles.primaryBtn,
                  (saving || loading) && { opacity: 0.7 },
                ]}
                disabled={saving || loading}
              >
                <Text style={styles.primaryTxt}>
                  {saving ? 'Saving…' : 'Save'}
                </Text>
              </Pressable>

              {/* <Pressable style={[styles.disabledBtn]} disabled>
                <Text style={styles.disabledTxt}>Submit for Approval</Text>
              </Pressable> */}
            </View>

            {/* Status */}
            {!!err && <Text style={styles.err}>Error: {err}</Text>}
            {!!toast && <Text style={styles.toast}>{toast}</Text>}

            {/* Divider */}
            <View style={styles.hr} />

            {/* Bottom table: rows created / refreshed for that week */}
            <Text style={styles.tableTitle}>Saved Weekly Entries</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.table}>
                <View style={styles.trHead}>
                  {[
                    'Week',
                    'Task',
                    'Day1',
                    'Day2',
                    'Day3',
                    'Day4',
                    'Day5',
                    'Day6',
                    'Day7',
                    'Total',
                  ].map((h, i) => (
                    <View
                      key={h}
                      style={[styles.th, { width: i === 1 ? 220 : 100 }]}
                    >
                      <Text style={styles.thTxt}>{h}</Text>
                    </View>
                  ))}
                </View>

                {(loading ? [] : rows).map(r => (
                  <View
                    key={r.id || `${r.taskId}-${r.weekStartDate}`}
                    style={styles.tr}
                  >
                    <Cell w={100} text={r.weekStartDate} />
                    <Cell
                      w={220}
                      text={
                        myTasks.find(t => t.id === r.taskId)?.title ||
                        `#${r.taskId}`
                      }
                    />
                    <Cell w={100} text={String(r.day1Hours ?? 0)} />
                    <Cell w={100} text={String(r.day2Hours ?? 0)} />
                    <Cell w={100} text={String(r.day3Hours ?? 0)} />
                    <Cell w={100} text={String(r.day4Hours ?? 0)} />
                    <Cell w={100} text={String(r.day5Hours ?? 0)} />
                    <Cell w={100} text={String(r.day6Hours ?? 0)} />
                    <Cell w={100} text={String(r.day7Hours ?? 0)} />
                    <Cell w={100} text={String(r.totalHours ?? 0)} />
                  </View>
                ))}

                {!loading && rows.length === 0 && (
                  <Text style={{ color: '#6b7280', padding: 10 }}>
                    Nothing saved yet.
                  </Text>
                )}
              </View>
            </ScrollView>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

/* ---- tiny table cell ---- */
function Cell({ w, text }) {
  return (
    <View style={[styles.cell, { width: w }]}>
      <Text style={styles.body} numberOfLines={2}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.28)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '92%',
  },
  header: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  close: { padding: 6 },
  title: { fontSize: 18, fontWeight: '900', color: '#0b0b0c' },

  label: { fontSize: 12, fontWeight: '800', color: '#374151', marginBottom: 6 },
  subLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#6b7280',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#111827',
    backgroundColor: '#fff',
  },

  select: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  option: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#f1f5f9',
  },
  optionActive: { backgroundColor: '#eef2ff' },
  optionTxt: { color: '#111827', fontWeight: '900' },
  optionTxtActive: { color: '#111827', textDecorationLine: 'underline' },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },

  totalTxt: { marginTop: 8, fontWeight: '900', color: '#111827' },

  secondaryBtn: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  secondaryTxt: { color: '#111827', fontWeight: '900' },

  primaryBtn: {
    backgroundColor: '#111827',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  primaryTxt: { color: '#fff', fontWeight: '900' },

  disabledBtn: {
    backgroundColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  disabledTxt: { color: '#6b7280', fontWeight: '900' },

  err: { color: '#b00020', marginTop: 8 },
  toast: { color: '#065f46', marginTop: 8, fontWeight: '900' },

  hr: { height: 1, backgroundColor: '#e5e7eb', marginVertical: 12 },

  tableTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0b0b0c',
    marginBottom: 6,
  },

  table: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 14,
  },
  trHead: { flexDirection: 'row', backgroundColor: '#e8f0ff' },
  th: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRightWidth: 1,
    borderColor: '#e5e7eb',
  },
  thTxt: { fontWeight: '900', color: '#374151' },
  tr: { flexDirection: 'row', borderTopWidth: 1, borderColor: '#f1f5f9' },
  cell: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRightWidth: 1,
    borderColor: '#f1f5f9',
    justifyContent: 'center',
  },
  body: { color: '#111827' },
});
