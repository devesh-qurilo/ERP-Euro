// import React, { useEffect } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   StyleSheet,
//   Pressable,
//   ActivityIndicator,
//   Alert,
// } from 'react-native';
// import { useDispatch, useSelector } from 'react-redux';
// import { listByClient, openForm, openView, deleteOne } from './store/actions';
// import {
//   selectCVNList,
//   selectCVNLoading,
//   selectCVNBusyIds,
//   selectCVNFormOpen,
//   selectCVNEditing,
//   selectCVNSubmitting,
//   selectCVNViewOpen,
//   selectCVNViewItem,
// } from './store/selectors';
// import NoteFormModal from './components/NoteFormModal';
// import NoteViewModal from './components/NoteViewModal';

// export default function ClientNotesTab({ route }) {
//   // const clientId = route?.params?.clientId || route?.clientId;
//   const clientId = route;
//   const dispatch = useDispatch();
//   const list = useSelector(selectCVNList);
//   const loading = useSelector(selectCVNLoading);
//   const busyIds = useSelector(selectCVNBusyIds);
//   const formOpen = useSelector(selectCVNFormOpen);
//   const editing = useSelector(selectCVNEditing);
//   const submitting = useSelector(selectCVNSubmitting);
//   const viewOpen = useSelector(selectCVNViewOpen);
//   const viewItem = useSelector(selectCVNViewItem);

//   useEffect(() => {
//     // console.log('client id devesh', clientId);
//     if (clientId) dispatch(listByClient(clientId));
//   }, [clientId, dispatch]);

//   const onDelete = item => {
//     Alert.alert('Delete Note', `Remove "${item.title}"?`, [
//       { text: 'Cancel' },
//       {
//         text: 'Delete',
//         style: 'destructive',
//         onPress: () => dispatch(deleteOne(clientId, item.id)),
//       },
//     ]);
//   };

//   const header = [
//     'Title',
//     'Type',
//     'Detail',
//     'Created By',
//     'Created At',
//     'Actions',
//   ];

//   return (
//     <ScrollView contentContainerStyle={{ padding: 12 }}>
//       {/* Top */}
//       <View style={styles.headerRow}>
//         <Text style={styles.title}>Notes</Text>
//         <Pressable
//           style={[styles.btn, styles.primary]}
//           onPress={() => dispatch(openForm(null))}
//         >
//           <Text style={[styles.btnTxt, { color: '#fff' }]}>+ Add Note</Text>
//         </Pressable>
//       </View>

//       {/* Table */}
//       <ScrollView horizontal style={styles.hscroll}>
//         <View style={styles.table}>
//           {/* Head */}
//           <View style={[styles.row, styles.head]}>
//             {header.map(h => (
//               <Text key={h} style={[styles.cell, styles.hcell]}>
//                 {h}
//               </Text>
//             ))}
//           </View>

//           {/* Body */}
//           {loading ? (
//             <ActivityIndicator style={{ margin: 16 }} />
//           ) : list.length === 0 ? (
//             <View style={{ padding: 16 }}>
//               <Text style={{ color: '#6b7280' }}>No notes.</Text>
//             </View>
//           ) : (
//             list.map(item => {
//               const busy = busyIds.includes(item.id);
//               return (
//                 <View key={item.id} style={styles.row}>
//                   <Text
//                     style={[styles.cell, { minWidth: 220 }]}
//                     numberOfLines={1}
//                   >
//                     {item.title}
//                   </Text>
//                   <Text style={styles.cell}>{item.type || '—'}</Text>
//                   <Text
//                     style={[styles.cell, { minWidth: 280 }]}
//                     numberOfLines={1}
//                   >
//                     {item.detail}
//                   </Text>
//                   <Text style={styles.cell}>{item.createdBy || '—'}</Text>
//                   <Text style={styles.cell}>
//                     {item.createdAt?.replace('T', ' ').replace('Z', '') || '—'}
//                   </Text>

//                   <View style={[styles.cell, styles.actions]}>
//                     <Pressable
//                       style={styles.dotBtn}
//                       onPress={() => dispatch(openView(item))}
//                     >
//                       <Text>👁️ View</Text>
//                     </Pressable>
//                     <Pressable
//                       style={styles.dotBtn}
//                       onPress={() => dispatch(openForm(item))}
//                     >
//                       <Text>✏️ Edit</Text>
//                     </Pressable>
//                     <Pressable
//                       style={styles.dotBtn}
//                       disabled={busy}
//                       onPress={() => onDelete(item)}
//                     >
//                       <Text>{busy ? '…' : '🗑️ Delete'}</Text>
//                     </Pressable>
//                   </View>
//                 </View>
//               );
//             })
//           )}
//         </View>
//       </ScrollView>

//       {/* Modals */}
//       <NoteFormModal
//         visible={formOpen}
//         editing={editing}
//         submitting={submitting}
//         clientId={clientId}
//         onClose={() => dispatch({ type: 'admin/clientsViewNotes/CLOSE_FORM' })}
//       />
//       <NoteViewModal
//         visible={viewOpen}
//         item={viewItem}
//         onClose={() => dispatch({ type: 'admin/clientsViewNotes/CLOSE_VIEW' })}
//       />
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   headerRow: {
//     marginBottom: 10,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   title: { fontSize: 18, fontWeight: '800', color: '#0b0b0c' },
//   btn: {
//     borderWidth: 1,
//     borderColor: '#1d4ed8',
//     borderRadius: 10,
//     paddingHorizontal: 14,
//     paddingVertical: 10,
//     backgroundColor: '#fff',
//   },
//   primary: { backgroundColor: '#1d4ed8' },
//   btnTxt: { fontWeight: '500', color: '#111827' },

//   hscroll: {
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: '#e5e7eb',
//     backgroundColor: '#fff',
//   },
//   table: { minWidth: 1000 },
//   row: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderBottomWidth: 1,
//     borderBottomColor: '#f1f5f9',
//   },
//   head: { backgroundColor: '#f8fafc' },
//   cell: { paddingVertical: 12, paddingHorizontal: 12, minWidth: 160 },
//   hcell: { fontWeight: '800', color: '#111827' },
//   actions: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//     minWidth: 260,
//   },
//   dotBtn: {
//     paddingHorizontal: 8,
//     paddingVertical: 6,
//     borderWidth: 1,
//     borderColor: '#e5e7eb',
//     borderRadius: 8,
//     backgroundColor: '#fff',
//     marginRight: 8,
//   },
// });

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { listByClient, openForm, openView, deleteOne } from './store/actions';
import {
  selectCVNList,
  selectCVNLoading,
  selectCVNBusyIds,
  selectCVNFormOpen,
  selectCVNEditing,
  selectCVNSubmitting,
  selectCVNViewOpen,
  selectCVNViewItem,
} from './store/selectors';
import NoteFormModal from './components/NoteFormModal';
import NoteViewModal from './components/NoteViewModal';

export default function ClientNotesTab({ route }) {
  const clientId = route;
  const dispatch = useDispatch();

  const list = useSelector(selectCVNList);
  const loading = useSelector(selectCVNLoading);
  const busyIds = useSelector(selectCVNBusyIds);
  const formOpen = useSelector(selectCVNFormOpen);
  const editing = useSelector(selectCVNEditing);
  const submitting = useSelector(selectCVNSubmitting);
  const viewOpen = useSelector(selectCVNViewOpen);
  const viewItem = useSelector(selectCVNViewItem);

  const [openMenuId, setOpenMenuId] = useState(null);

  useEffect(() => {
    if (clientId) dispatch(listByClient(clientId));
  }, [clientId, dispatch]);

  const onDelete = item => {
    Alert.alert('Delete Note', `Remove "${item.title}"?`, [
      { text: 'Cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => dispatch(deleteOne(clientId, item.id)),
      },
    ]);
  };

  const formatDate = dateString => {
    if (!dateString) return '—';
    const d = new Date(dateString);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <View style={{ flex: 1, padding: 12 }}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>Notes</Text>
        <Pressable
          style={[styles.btn, styles.primary]}
          onPress={() => dispatch(openForm(null))}
        >
          <Text style={[styles.btnTxt, { color: '#fff' }]}>+ Add Note</Text>
        </Pressable>
      </View>

      {/* Table Container */}
      <View style={styles.tableWrapper}>
        {loading ? (
          <ActivityIndicator style={{ margin: 20 }} />
        ) : list.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={{ fontSize: 32 }}>📝</Text>
            <Text style={{ fontWeight: '700', marginTop: 10 }}>
              No Notes Found
            </Text>
            <Text style={{ color: '#6b7280', marginTop: 4 }}>
              Add your first note for this client.
            </Text>
          </View>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator>
            <View style={{ minWidth: 1100 }}>
              {/* Table Header */}
              <View style={[styles.row, styles.head]}>
                <Text style={[styles.cell, styles.hcell, { width: 220 }]}>
                  Title
                </Text>
                <Text style={[styles.cell, styles.hcell, { width: 140 }]}>
                  Type
                </Text>
                <Text style={[styles.cell, styles.hcell, { width: 300 }]}>
                  Detail
                </Text>
                <Text style={[styles.cell, styles.hcell, { width: 160 }]}>
                  Created By
                </Text>
                <Text style={[styles.cell, styles.hcell, { width: 160 }]}>
                  Created At
                </Text>
                <Text style={[styles.cell, styles.hcell, { width: 120 }]}>
                  Actions
                </Text>
              </View>

              {/* Table Body */}
              {list.map((item, index) => {
                const busy = busyIds.includes(item.id);
                const menuOpen = openMenuId === item.id;

                return (
                  <View
                    key={item.id}
                    style={[
                      styles.row,
                      {
                        backgroundColor: index % 2 === 0 ? '#fff' : '#fafafa',
                      },
                    ]}
                  >
                    <Text
                      style={[styles.cell, { width: 220 }]}
                      numberOfLines={1}
                    >
                      {item.title}
                    </Text>

                    <Text style={[styles.cell, { width: 140 }]}>
                      {item.type || '—'}
                    </Text>

                    <Text
                      style={[styles.cell, { width: 300 }]}
                      numberOfLines={1}
                    >
                      {item.detail}
                    </Text>

                    <Text style={[styles.cell, { width: 160 }]}>
                      {item.createdBy || '—'}
                    </Text>

                    <Text style={[styles.cell, { width: 160 }]}>
                      {formatDate(item.createdAt)}
                    </Text>

                    {/* Actions */}
                    <View
                      style={[
                        styles.cell,
                        { width: 120, alignItems: 'flex-end' },
                      ]}
                    >
                      {busy ? (
                        <ActivityIndicator size="small" />
                      ) : (
                        <>
                          <Pressable
                            style={styles.kebabBtn}
                            onPress={() =>
                              setOpenMenuId(menuOpen ? null : item.id)
                            }
                          >
                            <Text style={styles.kebabTxt}>⋮</Text>
                          </Pressable>

                          {menuOpen && (
                            <View style={styles.menu}>
                              <Pressable
                                style={styles.menuItem}
                                onPress={() => {
                                  setOpenMenuId(null);
                                  dispatch(openView(item));
                                }}
                              >
                                <Text>View</Text>
                              </Pressable>

                              <Pressable
                                style={styles.menuItem}
                                onPress={() => {
                                  setOpenMenuId(null);
                                  dispatch(openForm(item));
                                }}
                              >
                                <Text>Edit</Text>
                              </Pressable>

                              <Pressable
                                style={styles.menuItem}
                                onPress={() => {
                                  setOpenMenuId(null);
                                  onDelete(item);
                                }}
                              >
                                <Text style={{ color: '#b91c1c' }}>Delete</Text>
                              </Pressable>
                            </View>
                          )}
                        </>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          </ScrollView>
        )}
      </View>

      {/* Modals */}
      <NoteFormModal
        visible={formOpen}
        editing={editing}
        submitting={submitting}
        clientId={clientId}
        onClose={() => dispatch({ type: 'admin/clientsViewNotes/CLOSE_FORM' })}
      />

      <NoteViewModal
        visible={viewOpen}
        item={viewItem}
        onClose={() => dispatch({ type: 'admin/clientsViewNotes/CLOSE_VIEW' })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    marginBottom: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: { fontSize: 18, fontWeight: '800', color: '#111827' },

  btn: {
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  primary: { backgroundColor: '#1d4ed8' },
  btnTxt: { fontWeight: '600' },

  tableWrapper: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    backgroundColor: '#fff',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },

  head: {
    backgroundColor: '#f8fafc',
  },

  cell: {
    paddingVertical: 12,
    paddingHorizontal: 12,
  },

  hcell: {
    fontWeight: '700',
    color: '#111827',
  },

  kebabBtn: {
    padding: 6,
    borderRadius: 6,
  },

  kebabTxt: {
    fontSize: 18,
    fontWeight: '700',
  },

  menu: {
    position: 'absolute',
    top: 30,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    width: 140,
    elevation: 6,
    zIndex: 999,
  },

  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },

  emptyState: {
    paddingVertical: 50,
    alignItems: 'center',
  },
});
