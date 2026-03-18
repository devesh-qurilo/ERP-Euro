// import React, { useEffect, useState, useMemo } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   FlatList,
//   TouchableOpacity,
//   ActivityIndicator,
//   StyleSheet,
//   Image,
//   TextInput,
// } from 'react-native';

// import DraggableFlatList from 'react-native-draggable-flatlist';
// import { useDispatch, useSelector } from 'react-redux';
// import {
//   fetchKanban,
//   moveCard,
//   createStage,
//   updateStage,
//   deleteStage,
// } from '../store/actions';

// import getLatestFollowup, { getSortDate } from '../../../components/followup';
// import {
//   selectKanbanBusy,
//   selectKanbanStages,
//   selectKanbanColumns,
// } from '../store/selectors';
// import { useNavigation } from '@react-navigation/native';
// import { selectPriorities } from '../../priorities/selectors';
// import api from '../../../../../../services/api';

// /**
//  * Fancy Kanban screen (drop-in)
//  * - soft shadows, rounded columns
//  * - card shows: title, leadName, leadMobile, colored tags, avatar stack
//  * - Open button is a pill
//  * - Move menu remains simple (keeps behavior)
//  */

// export default function AdminDealKanbanScreen() {
//   const [stageModalVisible, setStageModalVisible] = useState(false);
//   const [stageName, setStageName] = useState('');
//   const [editingStage, setEditingStage] = useState(null);
//   const [deleteConfirm, setDeleteConfirm] = useState(null);

//   const [stageMenuOpen, setStageMenuOpen] = useState(null);
//   const dispatch = useDispatch();
//   const nav = useNavigation();

//   const busy = useSelector(selectKanbanBusy);
//   const stages = useSelector(selectKanbanStages);
//   const columns = useSelector(selectKanbanColumns);

//   useEffect(() => {
//     dispatch(fetchKanban());
//   }, [dispatch]);

//   if (busy && !stages.length)
//     return <ActivityIndicator style={{ marginTop: 20 }} />;

//   return (
//     <View style={styles.container}>
//       <View style={styles.headerRow}>
//         <Text style={styles.title}>Deals Kanban</Text>
//         <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
//           <TouchableOpacity
//             onPress={() => nav.navigate('PriorityScreen')}
//             style={styles.createStageBtn}
//           >
//             <Text style={styles.createStageText}>Priorities</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             onPress={() => setStageModalVisible(true)}
//             style={styles.createStageBtn}
//           >
//             <Text style={styles.createStageText}>+ Stage</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             onPress={() => dispatch(fetchKanban())}
//             style={styles.refreshBtn}
//           >
//             <Text style={styles.refreshText}>Refresh</Text>
//           </TouchableOpacity>
//         </View>
//       </View>

//       <ScrollView
//         horizontal
//         contentContainerStyle={styles.columnsContainer}
//         showsHorizontalScrollIndicator={false}
//       >
//         {stages.map(stage => {
//           const list = columns[stage.name] || [];
//           const now = new Date();

//           const sortedData = [...list].sort((a, b) => {
//             const da = getSortDate(a);
//             const db = getSortDate(b);

//             if (!da && !db) return 0;
//             if (!da) return 1;
//             if (!db) return -1;

//             const aOverdue = da < now;
//             const bOverdue = db < now;

//             // overdue first
//             if (aOverdue && !bOverdue) return -1;
//             if (!aOverdue && bOverdue) return 1;

//             // earliest first
//             return da - db;
//           });

//           return (
//             <View key={stage.id} style={styles.column}>
//               <View style={styles.columnHeader}>
//                 <Text style={styles.columnTitle}>{stage.name}</Text>

//                 <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//                   <View style={styles.countBadge}>
//                     <Text style={styles.countText}>{sortedData.length}</Text>
//                   </View>

//                   <TouchableOpacity
//                     onPress={() =>
//                       setStageMenuOpen(
//                         stageMenuOpen === stage.id ? null : stage.id,
//                       )
//                     }
//                     style={{ marginLeft: 8 }}
//                   >
//                     <Text style={{ fontSize: 18 }}>⋮</Text>
//                   </TouchableOpacity>
//                 </View>
//               </View>

//               {/* ✅ STAGE MENU (NOW CORRECT POSITION) */}
//               {stageMenuOpen === stage.id && (
//                 <View style={styles.stageMenu}>
//                   <TouchableOpacity
//                     onPress={() => {
//                       setEditingStage(stage);
//                       setStageName(stage.name);
//                       setStageModalVisible(true);
//                       setStageMenuOpen(null);
//                     }}
//                     style={styles.stageMenuItem}
//                   >
//                     <Text>Edit</Text>
//                   </TouchableOpacity>

//                   <TouchableOpacity
//                     onPress={() => {
//                       setDeleteConfirm(stage);
//                       setStageMenuOpen(null);
//                     }}
//                     style={styles.stageMenuItem}
//                   >
//                     <Text style={{ color: 'red' }}>Delete</Text>
//                   </TouchableOpacity>
//                 </View>
//               )}

//               <DraggableFlatList
//                 activationDistance={10}
//                 autoscrollSpeed={50}
//                 autoscrollThreshold={60}
//                 data={sortedData}
//                 keyExtractor={item => String(item.id)}
//                 onDragEnd={({ data, from, to }) => {
//                   // reorder inside stage
//                 }}
//                 renderItem={({ item, drag, isActive }) => (
//                   <TouchableOpacity
//                     onLongPress={drag}
//                     disabled={isActive}
//                     style={{ opacity: isActive ? 0.7 : 1 }}
//                   >
//                     <KanbanCard
//                       item={item}
//                       stage={stage}
//                       stages={stages}
//                       dispatch={dispatch}
//                       navigation={nav}
//                     />
//                   </TouchableOpacity>
//                 )}
//               />
//             </View>
//           );
//         })}

//         {/* Unassigned column if any */}
//         {columns['Unassigned'] && columns['Unassigned'].length > 0 && (
//           <View style={styles.column} key="unassigned">
//             <View style={styles.columnHeader}>
//               <Text style={styles.columnTitle}>Unassigned</Text>
//               <View style={styles.countBadge}>
//                 <Text style={styles.countText}>
//                   {columns['Unassigned'].length}
//                 </Text>
//               </View>
//             </View>

//             <FlatList
//               data={columns['Unassigned']}
//               keyExtractor={i => String(i.id)}
//               renderItem={({ item }) => (
//                 <KanbanCard
//                   item={item}
//                   stage={{ name: 'Unassigned' }}
//                   stages={stages}
//                   dispatch={dispatch}
//                 />
//               )}
//               contentContainerStyle={{ paddingBottom: 40 }}
//             />
//           </View>
//         )}
//       </ScrollView>
//       {stageModalVisible && (
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalBox}>
//             <Text style={styles.modalTitle}>
//               {editingStage ? 'Update Stage' : 'Create Stage'}
//             </Text>

//             <TextInput
//               placeholder="Stage name"
//               value={stageName}
//               onChangeText={setStageName}
//               style={styles.input}
//             />

//             <View style={styles.modalActions}>
//               <TouchableOpacity
//                 onPress={() => {
//                   setStageModalVisible(false);
//                   setStageName('');
//                   setEditingStage(null);
//                 }}
//                 style={styles.cancelBtn}
//               >
//                 <Text style={styles.cancelText}>Cancel</Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 onPress={() => {
//                   if (!stageName.trim()) return;

//                   if (editingStage) {
//                     dispatch(
//                       updateStage(editingStage.id, {
//                         name: stageName.trim(),
//                       }),
//                     );
//                   } else {
//                     dispatch(createStage({ name: stageName.trim() }));
//                   }

//                   setStageModalVisible(false);
//                   setStageName('');
//                   setEditingStage(null);
//                 }}
//                 style={styles.saveBtn}
//               >
//                 <Text style={styles.saveText}>
//                   {editingStage ? 'Update' : 'Create'}
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       )}

//       {deleteConfirm && (
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalBox}>
//             <Text style={styles.modalTitle}>
//               Delete "{deleteConfirm.name}"?
//             </Text>

//             <Text style={{ marginTop: 10, color: '#666' }}>
//               All deals in this stage may be affected.
//             </Text>

//             <View style={styles.modalActions}>
//               <TouchableOpacity
//                 onPress={() => setDeleteConfirm(null)}
//                 style={styles.cancelBtn}
//               >
//                 <Text style={styles.cancelText}>Cancel</Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 onPress={() => {
//                   dispatch(deleteStage(deleteConfirm.id));
//                   setDeleteConfirm(null);
//                 }}
//                 style={[styles.saveBtn, { backgroundColor: '#E53935' }]}
//               >
//                 <Text style={styles.saveText}>Delete</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       )}
//     </View>
//   );
// }

// /* ---------------- Kanban Card (fancy) ---------------- */
// function KanbanCard({ item, stage, stages, dispatch, navigation }) {
//   const [openMenu, setOpenMenu] = useState(false);
//   const priorities = useSelector(selectPriorities);
//   const [priorityOpen, setPriorityOpen] = useState(false);

//   // minimal required fields
//   const leadName =
//     item.leadName || item.assignedEmployeesMeta?.[0]?.name || '--';
//   const leadMobile = item.leadMobile || '--';
//   const tags = Array.isArray(item.tags) ? item.tags : [];
//   // const calend = item.followups[0]?.nextDate || '--';

//   // avatars from assignedEmployeesMeta (max 3)
//   const avatars = (item.assignedEmployeesMeta || []).slice(0, 3);

//   // first 2 tags to show
//   const visibleTags = tags.slice(0, 2);
//   const overflow = tags.length - visibleTags.length;

//   const latestFollowup = useMemo(
//     () => getLatestFollowup(item.followups),
//     [item.followups],
//   );

//   const calend = latestFollowup ? `${latestFollowup.nextDate}` : '--';

//   const handlePriorityChange = async priority => {
//     console.log('priority.id', priority.id, item.id);
//     try {
//       await api.put(`/deals/${item.id}/priority`, {
//         priorityId: priority.id,
//       });

//       setPriorityOpen(false);

//       dispatch(fetchKanban());
//     } catch (err) {
//       console.log('Priority update error', err);
//     }
//   };

//   return (
//     <View
//       style={[
//         styles.card,
//         {
//           borderLeftWidth: 4,
//           borderLeftColor: item.priority?.color || '#b5c1d9',
//         },
//       ]}
//     >
//       <View style={styles.cardTop}>
//         {/* <Text style={styles.cardTitle} numberOfLines={1}>
//           {item.title}
//         </Text> */}
//         {/* <Text style={styles.cardTitle} numberOfLines={1}>
//           {calend}
//         </Text> */}

//         <View style={{ flex: 1 }}>
//           <Text style={styles.cardTitle} numberOfLines={1}>
//             {item.title}
//           </Text>

//           <TouchableOpacity
//             onPress={() => setPriorityOpen(!priorityOpen)}
//             style={[
//               styles.priorityBadgeKanban,
//               { backgroundColor: item.priority?.color || '#9CA3AF' },
//             ]}
//           >
//             <Text style={styles.priorityTextKanban}>
//               {item.priority?.status || 'Set Priority'}
//             </Text>
//           </TouchableOpacity>
//         </View>

//         <View style={{ alignItems: 'flex-end' }}>
//           <TouchableOpacity
//             onPress={() =>
//               navigation?.navigate?.('AdminDealView', { dealId: item.id })
//             }
//             style={styles.openPill}
//           >
//             <Text style={styles.openPillText}>Open</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             onPress={() => setOpenMenu(!openMenu)}
//             style={styles.menuBtn}
//           >
//             <Text style={styles.openPillText}>Stages</Text>
//           </TouchableOpacity>
//         </View>
//       </View>

//       <View style={styles.cardBody}>
//         <View style={{ flex: 1 }}>
//           <Text style={styles.leadName}>{leadName}</Text>
//           <Text style={styles.leadMobile}>{leadMobile}</Text>
//           <Text style={styles.leadCalender}>{calend}</Text>
//           <View style={styles.tagsRow}>
//             {visibleTags.length === 0 && (
//               <Text style={styles.noTagsText}>No tags</Text>
//             )}
//             {visibleTags.map((t, i) => (
//               <TagChip key={`${t}-${i}`} text={t} index={i} />
//             ))}
//             {overflow > 0 && <TagChip text={`+${overflow}`} compact />}
//           </View>
//         </View>

//         {/* avatar stack on right */}
//         <View style={styles.avatarStack}>
//           {avatars.map((a, i) => (
//             <Image
//               key={i}
//               source={{ uri: a.profileUrl }}
//               style={[styles.avatar, { marginLeft: i === 0 ? 0 : -8 }]}
//             />
//           ))}
//           {(item.assignedEmployeesMeta || []).length > avatars.length && (
//             <View
//               style={[styles.avatar, styles.avatarMore, { marginLeft: -8 }]}
//             >
//               <Text style={styles.avatarMoreText}>
//                 +{(item.assignedEmployeesMeta || []).length - avatars.length}
//               </Text>
//             </View>
//           )}
//         </View>
//       </View>

//       {/* move menu */}
//       {openMenu && (
//         <View style={styles.menu}>
//           <Text style={styles.menuLabel}>Move to</Text>
//           {stages.map(s => (
//             <TouchableOpacity
//               key={s.id}
//               onPress={() => {
//                 setOpenMenu(false);
//                 if (s.name === stage.name) return;
//                 dispatch(moveCard(item.id, s.name));
//               }}
//               style={styles.menuItem}
//             >
//               <Text style={styles.menuItemText}>{s.name}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//       )}
//       {priorityOpen && (
//         <View style={styles.priorityMenu}>
//           {priorities.map(p => (
//             <TouchableOpacity
//               key={p.id}
//               style={styles.priorityMenuItem}
//               onPress={() => handlePriorityChange(p)}
//             >
//               <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//                 <View
//                   style={{
//                     width: 10,
//                     height: 10,
//                     borderRadius: 5,
//                     backgroundColor: p.color,
//                     marginRight: 8,
//                   }}
//                 />
//                 <Text>{p.status}</Text>
//               </View>
//             </TouchableOpacity>
//           ))}
//         </View>
//       )}
//     </View>
//   );
// }

// /* ---------------- Tag chip ---------------- */
// function TagChip({ text, index = 0, compact = false }) {
//   // pick soft color by index (rotate)
//   const colors = ['#E9F5FF', '#EAF7EE', '#FFF4E6', '#F5E7FF', '#FDEEEE'];
//   const bg = colors[index % colors.length];
//   return (
//     <View
//       style={[
//         styles.tagChip,
//         compact ? styles.tagChipCompact : null,
//         { backgroundColor: bg },
//       ]}
//     >
//       <Text style={styles.tagText}>{text}</Text>
//     </View>
//   );
// }

// /* ---------------- FancyTable stub (for future use) ----------------
//    Reuse styles.card and TagChip to keep consistent look.
// */
// export function FancyTable({ rows = [] }) {
//   return (
//     <View style={{ padding: 12 }}>
//       {rows.map(r => (
//         <View key={r.id} style={[styles.card, { marginBottom: 12 }]}>
//           <View
//             style={{ flexDirection: 'row', justifyContent: 'space-between' }}
//           >
//             <Text style={{ fontWeight: '700' }}>{r.title}</Text>
//             <Text style={{ color: '#777' }}>{r.leadMobile || '--'}</Text>
//           </View>

//           <View style={{ marginTop: 8 }}>
//             <Text style={{ color: '#333' }}>{r.leadName || '--'}</Text>
//             <View style={{ flexDirection: 'row', marginTop: 8 }}>
//               {(r.tags || []).slice(0, 3).map((t, i) => (
//                 <TagChip key={i} text={t} index={i} />
//               ))}
//               {(r.tags || []).length === 0 && (
//                 <Text style={{ color: '#999' }}>No tags</Text>
//               )}
//             </View>
//           </View>
//         </View>
//       ))}
//     </View>
//   );
// }

// /* ---------------- Styles ---------------- */
// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 12, backgroundColor: '#F6F7FB' },
//   headerRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   title: { fontSize: 20, fontWeight: '800', color: '#222' },
//   refreshBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
//   refreshText: { color: '#3F6AE1', fontWeight: '600' },

//   columnsContainer: { paddingBottom: 40, paddingLeft: 2, paddingRight: 12 },
//   column: {
//     width: 340,
//     marginRight: 14,
//     borderRadius: 12,
//     padding: 12,
//     backgroundColor: '#ffffff',
//     borderWidth: 1,
//     borderColor: '#eef0f3',
//     shadowColor: '#000',
//     shadowOpacity: 0.03,
//     shadowRadius: 8,
//     elevation: 2,
//   },
//   columnHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   columnTitle: { fontSize: 16, fontWeight: '800', color: '#222' },
//   countBadge: {
//     backgroundColor: '#F0F3F8',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 8,
//     minWidth: 28,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   countText: { color: '#333', fontWeight: '700' },
//   stageMenu: {
//     backgroundColor: '#fff',
//     borderWidth: 1,
//     borderColor: '#eef0f3',
//     borderRadius: 8,
//     marginTop: 6,
//     paddingVertical: 6,
//   },

//   stageMenuItem: {
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//   },

//   card: {
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 12,
//     borderWidth: 1,
//     borderColor: '#eef0f3',
//     marginBottom: 12,

//     // soft shadow (iOS + Android)
//     shadowColor: '#000',
//     shadowOpacity: 0.03,
//     shadowRadius: 8,
//     elevation: 2,
//   },
//   cardTop: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 6,
//   },
//   cardTitle: { fontWeight: '800', fontSize: 15, color: '#222', maxWidth: 220 },

//   openPill: {
//     backgroundColor: '#E9F2FF',
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     borderRadius: 18,
//     marginBottom: 8,
//   },
//   openPillText: { color: '#2B6BD8', fontWeight: '700' },

//   menuBtn: { paddingHorizontal: 6, paddingVertical: 4 },
//   menuText: { fontSize: 20, color: '#666' },

//   cardBody: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
//   leadName: { fontSize: 14, fontWeight: '700', color: '#222' },
//   leadMobile: { color: '#666', marginTop: 4 },
//   leadCalender: {
//     color: '#843838ff',
//     marginTop: 4,
//     // backgroundColor: '#b4d2deff',
//     padding: 10,
//     alignItems: 'center',
//     // borderWidth: 1,
//     borderRadius: 20,
//   },

//   tagsRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10, gap: 6 },
//   noTagsText: { color: '#999', fontSize: 12 },
//   tagChip: {
//     borderRadius: 16,
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     marginRight: 6,
//     marginTop: 6,
//     borderWidth: 0.5,
//     borderColor: '#e6e9ef',
//   },
//   tagChipCompact: { paddingHorizontal: 8, paddingVertical: 4 },
//   tagText: { fontSize: 12, color: '#333' },

//   avatarStack: {
//     marginLeft: 12,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   avatar: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     borderWidth: 1,
//     borderColor: '#fff',
//   },
//   avatarMore: {
//     backgroundColor: '#eef2ff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   avatarMoreText: { color: '#2B6BD8', fontWeight: '700' },

//   menu: {
//     marginTop: 12,
//     borderTopWidth: 1,
//     borderTopColor: '#f0f0f0',
//     paddingTop: 8,
//   },
//   menuLabel: { color: '#333', fontWeight: '700', marginBottom: 6 },
//   menuItem: { paddingVertical: 8 },
//   menuItemText: { color: '#333' },
//   createStageBtn: {
//     backgroundColor: '#2B6BD8',
//     paddingHorizontal: 14,
//     paddingVertical: 8,
//     borderRadius: 10,
//   },
//   createStageText: {
//     color: '#fff',
//     fontWeight: '700',
//   },

//   modalOverlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: 'rgba(0,0,0,0.4)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   modalBox: {
//     width: 320,
//     backgroundColor: '#fff',
//     borderRadius: 16,
//     padding: 20,
//   },

//   modalTitle: {
//     fontSize: 18,
//     fontWeight: '800',
//     marginBottom: 16,
//   },

//   input: {
//     borderWidth: 1,
//     borderColor: '#e6e9ef',
//     borderRadius: 10,
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//   },

//   modalActions: {
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//     marginTop: 20,
//     gap: 12,
//   },

//   cancelBtn: {
//     paddingHorizontal: 14,
//     paddingVertical: 8,
//   },

//   cancelText: {
//     color: '#666',
//     fontWeight: '600',
//   },

//   saveBtn: {
//     backgroundColor: '#2B6BD8',
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 8,
//   },

//   saveText: {
//     color: '#fff',
//     fontWeight: '700',
//   },

//   priorityBadgeKanban: {
//     alignSelf: 'flex-start',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 12,
//     marginTop: 6,
//   },

//   priorityTextKanban: {
//     color: '#fff',
//     fontSize: 11,
//     fontWeight: '700',
//   },

//   priorityMenu: {
//     position: 'absolute',
//     top: 60,
//     right: 10,
//     backgroundColor: '#fff',
//     borderWidth: 1,
//     borderColor: '#eef0f3',
//     borderRadius: 8,
//     paddingVertical: 6,
//     width: 140,
//     zIndex: 999,
//   },

//   priorityMenuItem: {
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//   },
// });

import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Image,
  TextInput,
} from 'react-native';

import DraggableFlatList from 'react-native-draggable-flatlist';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchKanban,
  moveCard,
  createStage,
  updateStage,
  deleteStage,
} from '../store/actions';

import getLatestFollowup, { getSortDate } from '../../../components/followup';
import {
  selectKanbanBusy,
  selectKanbanStages,
  selectKanbanColumns,
} from '../store/selectors';
import { useNavigation } from '@react-navigation/native';
import { selectPriorities } from '../../priorities/selectors';
import api from '../../../../../../services/api';

/**
 * Fancy Kanban screen (drop-in)
 * - soft shadows, rounded columns
 * - card shows: title, leadName, leadMobile, colored tags, avatar stack
 * - Open button is a pill
 * - Move menu remains simple (keeps behavior)
 */

export default function AdminDealKanbanScreen() {
  const [stageModalVisible, setStageModalVisible] = useState(false);
  const [stageName, setStageName] = useState('');
  const [editingStage, setEditingStage] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const [stageMenuOpen, setStageMenuOpen] = useState(null);
  const dispatch = useDispatch();
  const nav = useNavigation();

  const busy = useSelector(selectKanbanBusy);
  const stages = useSelector(selectKanbanStages);
  const columns = useSelector(selectKanbanColumns);

  useEffect(() => {
    dispatch(fetchKanban());
  }, [dispatch]);

  if (busy && !stages.length)
    return <ActivityIndicator style={{ marginTop: 20 }} />;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Deals Kanban</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <TouchableOpacity
            onPress={() => nav.navigate('PriorityScreen')}
            style={styles.createStageBtn}
          >
            <Text style={styles.createStageText}>Priorities</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setStageModalVisible(true)}
            style={styles.createStageBtn}
          >
            <Text style={styles.createStageText}>+ Stage</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => dispatch(fetchKanban())}
            style={styles.refreshBtn}
          >
            <Text style={styles.refreshText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        horizontal
        contentContainerStyle={styles.columnsContainer}
        showsHorizontalScrollIndicator={false}
      >
        {stages.map(stage => {
          const list = columns[stage.name] || [];
          const now = new Date();

          const sortedData = [...list].sort((a, b) => {
            const da = getSortDate(a);
            const db = getSortDate(b);

            if (!da && !db) return 0;
            if (!da) return 1;
            if (!db) return -1;

            const aOverdue = da < now;
            const bOverdue = db < now;

            // overdue first
            if (aOverdue && !bOverdue) return -1;
            if (!aOverdue && bOverdue) return 1;

            // earliest first
            return da - db;
          });

          return (
            <View key={stage.id} style={styles.column}>
              <View style={styles.columnHeader}>
                <Text style={styles.columnTitle}>{stage.name}</Text>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={styles.countBadge}>
                    <Text style={styles.countText}>{sortedData.length}</Text>
                  </View>

                  <TouchableOpacity
                    onPress={() =>
                      setStageMenuOpen(
                        stageMenuOpen === stage.id ? null : stage.id,
                      )
                    }
                    style={{ marginLeft: 8 }}
                  >
                    <Text style={{ fontSize: 18 }}>⋮</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* ✅ STAGE MENU (NOW CORRECT POSITION) */}
              {stageMenuOpen === stage.id && (
                <View style={styles.stageMenu}>
                  <TouchableOpacity
                    onPress={() => {
                      setEditingStage(stage);
                      setStageName(stage.name);
                      setStageModalVisible(true);
                      setStageMenuOpen(null);
                    }}
                    style={styles.stageMenuItem}
                  >
                    <Text>Edit</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      setDeleteConfirm(stage);
                      setStageMenuOpen(null);
                    }}
                    style={styles.stageMenuItem}
                  >
                    <Text style={{ color: 'red' }}>Delete</Text>
                  </TouchableOpacity>
                </View>
              )}

              <DraggableFlatList
                activationDistance={10}
                autoscrollSpeed={50}
                autoscrollThreshold={60}
                data={sortedData}
                keyExtractor={item => String(item.id)}
                onDragEnd={({ data, from, to }) => {
                  // reorder inside stage
                }}
                renderItem={({ item, drag, isActive }) => (
                  <TouchableOpacity
                    onLongPress={drag}
                    disabled={isActive}
                    style={{ opacity: isActive ? 0.7 : 1 }}
                  >
                    <KanbanCard
                      item={item}
                      stage={stage}
                      stages={stages}
                      dispatch={dispatch}
                      navigation={nav}
                    />
                  </TouchableOpacity>
                )}
              />
            </View>
          );
        })}

        {/* Unassigned column if any */}
        {columns['Unassigned'] && columns['Unassigned'].length > 0 && (
          <View style={styles.column} key="unassigned">
            <View style={styles.columnHeader}>
              <Text style={styles.columnTitle}>Unassigned</Text>
              <View style={styles.countBadge}>
                <Text style={styles.countText}>
                  {columns['Unassigned'].length}
                </Text>
              </View>
            </View>

            <FlatList
              data={columns['Unassigned']}
              keyExtractor={i => String(i.id)}
              renderItem={({ item }) => (
                <KanbanCard
                  item={item}
                  stage={{ name: 'Unassigned' }}
                  stages={stages}
                  dispatch={dispatch}
                />
              )}
              contentContainerStyle={{ paddingBottom: 40 }}
            />
          </View>
        )}
      </ScrollView>
      {stageModalVisible && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>
              {editingStage ? 'Update Stage' : 'Create Stage'}
            </Text>

            <TextInput
              placeholder="Stage name"
              value={stageName}
              onChangeText={setStageName}
              style={styles.input}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={() => {
                  setStageModalVisible(false);
                  setStageName('');
                  setEditingStage(null);
                }}
                style={styles.cancelBtn}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  if (!stageName.trim()) return;

                  if (editingStage) {
                    dispatch(
                      updateStage(editingStage.id, {
                        name: stageName.trim(),
                      }),
                    );
                  } else {
                    dispatch(createStage({ name: stageName.trim() }));
                  }

                  setStageModalVisible(false);
                  setStageName('');
                  setEditingStage(null);
                }}
                style={styles.saveBtn}
              >
                <Text style={styles.saveText}>
                  {editingStage ? 'Update' : 'Create'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {deleteConfirm && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>
              Delete "{deleteConfirm.name}"?
            </Text>

            <Text style={{ marginTop: 10, color: '#666' }}>
              All deals in this stage may be affected.
            </Text>

            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={() => setDeleteConfirm(null)}
                style={styles.cancelBtn}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  dispatch(deleteStage(deleteConfirm.id));
                  setDeleteConfirm(null);
                }}
                style={[styles.saveBtn, { backgroundColor: '#E53935' }]}
              >
                <Text style={styles.saveText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

/* ---------------- Kanban Card (fancy) ---------------- */
function KanbanCard({ item, stage, stages, dispatch, navigation }) {
  const [openMenu, setOpenMenu] = useState(false);
  const priorities = useSelector(selectPriorities);
  const [priorityOpen, setPriorityOpen] = useState(false);

  // minimal required fields
  const leadName =
    item.leadName || item.assignedEmployeesMeta?.[0]?.name || '--';
  const leadMobile = item.leadMobile || '--';
  const tags = Array.isArray(item.tags) ? item.tags : [];
  // const calend = item.followups[0]?.nextDate || '--';

  // avatars from assignedEmployeesMeta (max 3)
  const avatars = (item.assignedEmployeesMeta || []).slice(0, 3);

  // first 2 tags to show
  const visibleTags = tags.slice(0, 2);
  const overflow = tags.length - visibleTags.length;

  const latestFollowup = useMemo(
    () => getLatestFollowup(item.followups),
    [item.followups],
  );

  const calend = latestFollowup ? `${latestFollowup.nextDate}` : '--';

  const handlePriorityChange = async priority => {
    try {
      const payload = {
        priorityId: priority.id,
      };

      console.log('Deal:', item.id, 'Priority:', priority.id);

      // 🔥 CASE 1: No priority → ASSIGN FIRST
      if (!item.priority) {
        console.log('Assigning first priority');

        await api.post(`/deals/${item.id}/priority/assign`, payload);
      }
      // 🔥 CASE 2: Already exists → UPDATE
      else {
        console.log('Updating existing priority');

        await api.put(`/deals/${item.id}/priority`, payload);
      }

      setPriorityOpen(false);

      dispatch(fetchKanban());
    } catch (err) {
      console.log('Priority error:', err?.response?.data || err.message);
    }
  };

  const handleRemovePriority = async () => {
    try {
      await api.delete(`/deals/${item.id}/priority`);

      dispatch(fetchKanban());
    } catch (err) {
      console.log(err?.response?.data);
    }
  };

  return (
    <View
      style={[
        styles.card,
        {
          borderLeftWidth: 4,
          borderLeftColor: item.priority?.color || '#b5c1d9',
        },
      ]}
    >
      <View style={styles.cardTop}>
        {/* <Text style={styles.cardTitle} numberOfLines={1}>
          {item.title}
        </Text> */}
        {/* <Text style={styles.cardTitle} numberOfLines={1}>
          {calend}
        </Text> */}

        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.title}
          </Text>

          <TouchableOpacity
            onPress={() => setPriorityOpen(!priorityOpen)}
            style={[
              styles.priorityBadgeKanban,
              { backgroundColor: item.priority?.color || '#9CA3AF' },
            ]}
          >
            <Text style={styles.priorityTextKanban}>
              {item.priority?.status || '+ Set Priority'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ alignItems: 'flex-end' }}>
          <TouchableOpacity
            onPress={() =>
              navigation?.navigate?.('AdminDealView', { dealId: item.id })
            }
            style={styles.openPill}
          >
            <Text style={styles.openPillText}>Open</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setOpenMenu(!openMenu)}
            style={styles.menuBtn}
          >
            <Text style={styles.openPillText}>Stages</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.cardBody}>
        <View style={{ flex: 1 }}>
          <Text style={styles.leadName}>{leadName}</Text>
          <Text style={styles.leadMobile}>{leadMobile}</Text>
          <Text style={styles.leadCalender}>{calend}</Text>
          <View style={styles.tagsRow}>
            {visibleTags.length === 0 && (
              <Text style={styles.noTagsText}>No tags</Text>
            )}
            {visibleTags.map((t, i) => (
              <TagChip key={`${t}-${i}`} text={t} index={i} />
            ))}
            {overflow > 0 && <TagChip text={`+${overflow}`} compact />}
          </View>
        </View>

        {/* avatar stack on right */}
        <View style={styles.avatarStack}>
          {avatars.map((a, i) => (
            <Image
              key={i}
              source={{ uri: a.profileUrl }}
              style={[styles.avatar, { marginLeft: i === 0 ? 0 : -8 }]}
            />
          ))}
          {(item.assignedEmployeesMeta || []).length > avatars.length && (
            <View
              style={[styles.avatar, styles.avatarMore, { marginLeft: -8 }]}
            >
              <Text style={styles.avatarMoreText}>
                +{(item.assignedEmployeesMeta || []).length - avatars.length}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* move menu */}
      {openMenu && (
        <View style={styles.menu}>
          <Text style={styles.menuLabel}>Move to</Text>
          {stages.map(s => (
            <TouchableOpacity
              key={s.id}
              onPress={() => {
                setOpenMenu(false);
                if (s.name === stage.name) return;
                dispatch(moveCard(item.id, s.name));
              }}
              style={styles.menuItem}
            >
              <Text style={styles.menuItemText}>{s.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      {priorityOpen && (
        <View style={styles.priorityModal}>
          <Text style={styles.priorityTitle}>Priority</Text>

          <ScrollView
            style={{ maxHeight: 100 }} // 🔥 important (limit height)
            showsVerticalScrollIndicator={true}
          >
            {/* LIST */}
            {priorities.map(p => (
              <TouchableOpacity
                key={p.id}
                style={styles.priorityItem}
                onPress={() => handlePriorityChange(p)}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: p.color,
                      marginRight: 8,
                    }}
                  />
                  <Text style={styles.priorityItemText}>{p.status}</Text>
                </View>
              </TouchableOpacity>
            ))}

            {/* DIVIDER */}
            <View style={styles.divider} />

            {/* ACTIONS */}
            {item.priority && (
              <TouchableOpacity
                style={styles.priorityAction}
                onPress={handleRemovePriority}
              >
                <Text style={styles.deleteText}>🗑 Remove Priority</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.priorityAction}
              onPress={() => navigation.navigate('PriorityScreen')}
            >
              <Text style={styles.manageText}>⚙ Manage Priorities</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}
    </View>
  );
}

/* ---------------- Tag chip ---------------- */
function TagChip({ text, index = 0, compact = false }) {
  // pick soft color by index (rotate)
  const colors = ['#E9F5FF', '#EAF7EE', '#FFF4E6', '#F5E7FF', '#FDEEEE'];
  const bg = colors[index % colors.length];
  return (
    <View
      style={[
        styles.tagChip,
        compact ? styles.tagChipCompact : null,
        { backgroundColor: bg },
      ]}
    >
      <Text style={styles.tagText}>{text}</Text>
    </View>
  );
}

/* ---------------- FancyTable stub (for future use) ----------------
   Reuse styles.card and TagChip to keep consistent look.
*/
export function FancyTable({ rows = [] }) {
  return (
    <View style={{ padding: 12 }}>
      {rows.map(r => (
        <View key={r.id} style={[styles.card, { marginBottom: 12 }]}>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <Text style={{ fontWeight: '700' }}>{r.title}</Text>
            <Text style={{ color: '#777' }}>{r.leadMobile || '--'}</Text>
          </View>

          <View style={{ marginTop: 8 }}>
            <Text style={{ color: '#333' }}>{r.leadName || '--'}</Text>
            <View style={{ flexDirection: 'row', marginTop: 8 }}>
              {(r.tags || []).slice(0, 3).map((t, i) => (
                <TagChip key={i} text={t} index={i} />
              ))}
              {(r.tags || []).length === 0 && (
                <Text style={{ color: '#999' }}>No tags</Text>
              )}
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}

/* ---------------- Styles ---------------- */
const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, backgroundColor: '#F6F7FB' },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: { fontSize: 20, fontWeight: '800', color: '#222' },
  refreshBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  refreshText: { color: '#3F6AE1', fontWeight: '600' },

  columnsContainer: { paddingBottom: 40, paddingLeft: 2, paddingRight: 12 },
  column: {
    width: 340,
    marginRight: 14,
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#eef0f3',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  columnHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  columnTitle: { fontSize: 16, fontWeight: '800', color: '#222' },
  countBadge: {
    backgroundColor: '#F0F3F8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    minWidth: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: { color: '#333', fontWeight: '700' },
  stageMenu: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eef0f3',
    borderRadius: 8,
    marginTop: 6,
    paddingVertical: 6,
  },

  stageMenuItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#eef0f3',
    marginBottom: 12,

    // soft shadow (iOS + Android)
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardTitle: { fontWeight: '800', fontSize: 15, color: '#222', maxWidth: 220 },

  openPill: {
    backgroundColor: '#E9F2FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 18,
    marginBottom: 8,
  },
  openPillText: { color: '#2B6BD8', fontWeight: '700' },

  menuBtn: { paddingHorizontal: 6, paddingVertical: 4 },
  menuText: { fontSize: 20, color: '#666' },

  cardBody: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  leadName: { fontSize: 14, fontWeight: '700', color: '#222' },
  leadMobile: { color: '#666', marginTop: 4 },
  leadCalender: {
    color: '#843838ff',
    marginTop: 4,
    // backgroundColor: '#b4d2deff',
    padding: 10,
    alignItems: 'center',
    // borderWidth: 1,
    borderRadius: 20,
  },

  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10, gap: 6 },
  noTagsText: { color: '#999', fontSize: 12 },
  tagChip: {
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 6,
    marginTop: 6,
    borderWidth: 0.5,
    borderColor: '#e6e9ef',
  },
  tagChipCompact: { paddingHorizontal: 8, paddingVertical: 4 },
  tagText: { fontSize: 12, color: '#333' },

  avatarStack: {
    marginLeft: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#fff',
  },
  avatarMore: {
    backgroundColor: '#eef2ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarMoreText: { color: '#2B6BD8', fontWeight: '700' },

  menu: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 8,
  },
  menuLabel: { color: '#333', fontWeight: '700', marginBottom: 6 },
  menuItem: { paddingVertical: 8 },
  menuItemText: { color: '#333' },
  createStageBtn: {
    backgroundColor: '#2B6BD8',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  createStageText: {
    color: '#fff',
    fontWeight: '700',
  },

  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalBox: {
    width: 320,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 16,
  },

  input: {
    borderWidth: 1,
    borderColor: '#e6e9ef',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
    gap: 12,
  },

  cancelBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
  },

  cancelText: {
    color: '#666',
    fontWeight: '600',
  },

  saveBtn: {
    backgroundColor: '#2B6BD8',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },

  saveText: {
    color: '#fff',
    fontWeight: '700',
  },

  priorityBadgeKanban: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 6,
  },

  priorityTextKanban: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },

  priorityMenu: {
    position: 'absolute',
    top: 60,
    right: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eef0f3',
    borderRadius: 8,
    paddingVertical: 6,
    width: 140,
    zIndex: 999,
  },

  priorityMenuItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },

  priorityModal: {
    position: 'absolute',
    top: 65,
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    width: 180,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    elevation: 4,
  },

  priorityTitle: {
    fontWeight: '700',
    marginBottom: 8,
    color: '#111827',
  },

  priorityItem: {
    paddingVertical: 8,
  },

  priorityItemText: {
    fontSize: 14,
    color: '#111827',
  },

  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 8,
  },

  priorityAction: {
    paddingVertical: 8,
  },

  deleteText: {
    color: '#dc2626',
    fontWeight: '600',
  },

  manageText: {
    color: '#2563eb',
    fontWeight: '600',
  },
});
