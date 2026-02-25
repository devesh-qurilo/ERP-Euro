// import React from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   Pressable,
//   ActivityIndicator,
//   Linking,
// } from 'react-native';

// export default function CreditNotesTable({
//   data = [],
//   loading,
//   busyIds = [],
//   onView,
//   onEdit,
//   onDelete,
// }) {
//   if (loading) return <ActivityIndicator style={{ marginTop: 20 }} />;

//   return (
//     <ScrollView horizontal style={s.hscroll}>
//       <View style={s.table}>
//         <View style={[s.row, s.head]}>
//           {[
//             'CN No.',
//             'Date',
//             'Currency',
//             'Amount',
//             'Tax %',
//             'Adj.',
//             'Client',
//             'Project',
//             'Actions',
//           ].map(h => (
//             <Text key={h} style={[s.cell, s.hcell]}>
//               {h}
//             </Text>
//           ))}
//         </View>
//         {data.map(item => {
//           const busy = busyIds.includes(item.id);
//           return (
//             <View key={item.id} style={s.row}>
//               <Text style={s.cell}>{item.creditNoteNumber}</Text>
//               <Text style={s.cell}>{item.creditNoteDate}</Text>
//               <Text style={s.cell}>{item.currency}</Text>
//               <Text style={s.cell}>{Number(item.amount).toFixed(2)}</Text>
//               <Text style={s.cell}>{item.tax ?? '—'}</Text>
//               <Text style={s.cell}>
//                 {item.adjustmentPositive ? '+' : '-'}
//                 {Number(item.adjustment || 0).toFixed(2)}
//               </Text>
//               <Text style={[s.cell, { minWidth: 180 }]} numberOfLines={1}>
//                 {item.client?.name || '—'}
//               </Text>
//               <Text style={[s.cell, { minWidth: 180 }]} numberOfLines={1}>
//                 {item.project?.projectName || '—'}
//               </Text>

//               <View style={[s.cell, s.actions]}>
//                 <Pressable onPress={() => onView?.(item)} style={s.btn}>
//                   <Text>👁️</Text>
//                 </Pressable>
//                 <Pressable onPress={() => onEdit?.(item)} style={s.btn}>
//                   <Text>✏️</Text>
//                 </Pressable>
//                 <Pressable
//                   disabled={busy}
//                   onPress={() => onDelete?.(item)}
//                   style={s.btn}
//                 >
//                   <Text>🗑️</Text>
//                 </Pressable>
//                 {item.fileUrl ? (
//                   <Pressable
//                     onPress={() => Linking.openURL(item.fileUrl)}
//                     style={s.btn}
//                   >
//                     <Text>⬇️</Text>
//                   </Pressable>
//                 ) : null}
//               </View>
//             </View>
//           );
//         })}
//       </View>
//     </ScrollView>
//   );
// }

// const s = StyleSheet.create({
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
//   cell: { paddingVertical: 12, paddingHorizontal: 12, minWidth: 140 },
//   hcell: { fontWeight: '800', color: '#111827' },
//   actions: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//     minWidth: 220,
//   },
//   btn: {
//     paddingHorizontal: 8,
//     paddingVertical: 6,
//     borderWidth: 1,
//     borderColor: '#e5e7eb',
//     borderRadius: 8,
//     backgroundColor: '#fff',
//   },
// });

// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   Pressable,
//   ActivityIndicator,
//   Linking,
// } from 'react-native';

// export default function CreditNotesTable({
//   data = [],
//   loading,
//   busyIds = [],
//   onView,
//   onEdit,
//   onDelete,
// }) {
//   const [openMenuId, setOpenMenuId] = useState(null);

//   if (loading) {
//     return <ActivityIndicator style={{ marginTop: 20 }} />;
//   }

//   return (
//     <View style={s.wrapper}>
//       <ScrollView horizontal showsHorizontalScrollIndicator>
//         <View style={{ minWidth: 1100 }}>
//           {/* HEADER */}
//           <View style={[s.row, s.head]}>
//             {[
//               'CN No.',
//               'Date',
//               'Currency',
//               'Amount',
//               'Tax %',
//               'Adj.',
//               'Client',
//               'Project',
//               'Actions',
//             ].map(h => (
//               <Text key={h} style={[s.cell, s.hcell]}>
//                 {h}
//               </Text>
//             ))}
//           </View>

//           {/* ROWS */}
//           {data.map((item, index) => {
//             const busy = busyIds.includes(item.id);
//             const menuOpen = openMenuId === item.id;

//             return (
//               <View
//                 key={item.id}
//                 style={[
//                   s.row,
//                   { backgroundColor: index % 2 === 0 ? '#fff' : '#fafafa' },
//                 ]}
//               >
//                 <Text style={s.cell}>{item.creditNoteNumber}</Text>

//                 <Text style={s.cell}>{item.creditNoteDate || '—'}</Text>

//                 <Text style={s.cell}>{item.currency}</Text>

//                 <Text style={[s.cell, { fontWeight: '600' }]}>
//                   {Number(item.amount).toFixed(2)}
//                 </Text>

//                 <Text style={s.cell}>{item.tax ?? '—'}</Text>

//                 <Text style={s.cell}>
//                   {item.adjustmentPositive ? '+' : '-'}
//                   {Number(item.adjustment || 0).toFixed(2)}
//                 </Text>

//                 <Text style={[s.cell, { minWidth: 200 }]} numberOfLines={1}>
//                   {item.client?.name || '—'}
//                 </Text>

//                 <Text style={[s.cell, { minWidth: 200 }]} numberOfLines={1}>
//                   {item.project?.projectName || '—'}
//                 </Text>

//                 {/* ACTION COLUMN */}
//                 <View
//                   style={[s.cell, { minWidth: 120, alignItems: 'flex-end' }]}
//                 >
//                   {busy ? (
//                     <ActivityIndicator size="small" />
//                   ) : (
//                     <>
//                       <Pressable
//                         style={s.kebabBtn}
//                         onPress={() => setOpenMenuId(menuOpen ? null : item.id)}
//                       >
//                         <Text style={s.kebabText}>⋮</Text>
//                       </Pressable>

//                       {menuOpen && (
//                         <View style={s.menu}>
//                           <Pressable
//                             style={s.menuItem}
//                             onPress={() => {
//                               setOpenMenuId(null);
//                               onView?.(item);
//                             }}
//                           >
//                             <Text>View</Text>
//                           </Pressable>

//                           <Pressable
//                             style={s.menuItem}
//                             onPress={() => {
//                               setOpenMenuId(null);
//                               onEdit?.(item);
//                             }}
//                           >
//                             <Text>Edit</Text>
//                           </Pressable>

//                           <Pressable
//                             style={s.menuItem}
//                             onPress={() => {
//                               setOpenMenuId(null);
//                               onDelete?.(item);
//                             }}
//                           >
//                             <Text style={{ color: '#b91c1c' }}>Delete</Text>
//                           </Pressable>

//                           {item.fileUrl && (
//                             <Pressable
//                               style={s.menuItem}
//                               onPress={() => {
//                                 setOpenMenuId(null);
//                                 Linking.openURL(item.fileUrl);
//                               }}
//                             >
//                               <Text>Download</Text>
//                             </Pressable>
//                           )}
//                         </View>
//                       )}
//                     </>
//                   )}
//                 </View>
//               </View>
//             );
//           })}
//         </View>
//       </ScrollView>
//     </View>
//   );
// }

// const s = StyleSheet.create({
//   wrapper: {
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: '#e5e7eb',
//     backgroundColor: '#fff',
//   },

//   row: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderBottomWidth: 1,
//     borderBottomColor: '#f1f5f9',
//   },

//   head: {
//     backgroundColor: '#f8fafc',
//   },

//   cell: {
//     paddingVertical: 12,
//     paddingHorizontal: 12,
//     minWidth: 140,
//   },

//   hcell: {
//     fontWeight: '700',
//     color: '#111827',
//   },

//   kebabBtn: {
//     padding: 6,
//     borderRadius: 6,
//   },

//   kebabText: {
//     fontSize: 18,
//     fontWeight: '700',
//   },

//   menu: {
//     position: 'absolute',
//     top: 30,
//     right: 0,
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#e5e7eb',
//     width: 150,
//     elevation: 6,
//     zIndex: 999,
//   },

//   menuItem: {
//     paddingVertical: 10,
//     paddingHorizontal: 12,
//   },
// });
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Linking,
  Modal,
} from 'react-native';

const COLUMNS = [
  { key: 'cn', label: 'CN No.', width: 110 },
  { key: 'date', label: 'Date', width: 110 },
  { key: 'currency', label: 'Currency', width: 100 },
  { key: 'amount', label: 'Amount', width: 120 },
  { key: 'tax', label: 'Tax %', width: 80 },
  { key: 'adj', label: 'Adj.', width: 120 },
  { key: 'client', label: 'Client', width: 180 },
  { key: 'project', label: 'Project', width: 180 },
  { key: 'actions', label: 'Actions', width: 80 },
];

const TOTAL_WIDTH = COLUMNS.reduce((sum, c) => sum + c.width, 0);

export default function CreditNotesTable({
  data = [],
  loading,
  busyIds = [],
  onView,
  onEdit,
  onDelete,
}) {
  const [selectedItem, setSelectedItem] = useState(null);

  const closeMenu = () => setSelectedItem(null);

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 20 }} />;
  }

  return (
    <View style={s.wrapper}>
      <ScrollView
        style={{ maxHeight: 500 }} // control vertical height
        showsVerticalScrollIndicator
      >
        <ScrollView horizontal showsHorizontalScrollIndicator>
          <View style={{ width: TOTAL_WIDTH }}>
            {/* ================= HEADER ================= */}
            <View style={[s.row, s.head]}>
              {COLUMNS.map(col => (
                <View key={col.key} style={[s.cell, { width: col.width }]}>
                  <Text style={s.hcell}>{col.label}</Text>
                </View>
              ))}
            </View>

            {/* ================= ROWS ================= */}
            {data.map((item, index) => {
              const busy = busyIds.includes(item.id);

              return (
                <View
                  key={item.id}
                  style={[
                    s.row,
                    { backgroundColor: index % 2 === 0 ? '#fff' : '#fafafa' },
                  ]}
                >
                  <View style={[s.cell, { width: 110 }]}>
                    <Text>{item.creditNoteNumber}</Text>
                  </View>

                  <View style={[s.cell, { width: 110 }]}>
                    <Text>{item.creditNoteDate || '—'}</Text>
                  </View>

                  <View style={[s.cell, { width: 100 }]}>
                    <Text>{item.currency}</Text>
                  </View>

                  <View style={[s.cell, { width: 120 }]}>
                    <Text style={{ fontWeight: '600' }}>
                      {Number(item.amount).toFixed(2)}
                    </Text>
                  </View>

                  <View style={[s.cell, { width: 80 }]}>
                    <Text>{item.tax ?? '—'}</Text>
                  </View>

                  <View style={[s.cell, { width: 120 }]}>
                    <Text>
                      {item.adjustmentPositive ? '+' : '-'}
                      {Number(item.adjustment || 0).toFixed(2)}
                    </Text>
                  </View>

                  <View style={[s.cell, { width: 180 }]}>
                    <Text numberOfLines={1}>{item.client?.name || '—'}</Text>
                  </View>

                  <View style={[s.cell, { width: 180 }]}>
                    <Text numberOfLines={1}>
                      {item.project?.projectName || '—'}
                    </Text>
                  </View>

                  <View style={[s.cell, { width: 80, alignItems: 'flex-end' }]}>
                    {busy ? (
                      <ActivityIndicator size="small" />
                    ) : (
                      <Pressable onPress={() => setSelectedItem(item)}>
                        <Text style={s.kebabText}>⋮</Text>
                      </Pressable>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </ScrollView>

      {/* ================= CENTER ACTION MODAL ================= */}
      <Modal
        visible={!!selectedItem}
        transparent
        animationType="fade"
        onRequestClose={closeMenu}
      >
        <Pressable style={s.modalOverlay} onPress={closeMenu}>
          <View style={s.modalCard}>
            <Pressable
              style={s.menuItem}
              onPress={() => {
                closeMenu();
                onView?.(selectedItem);
              }}
            >
              <Text>View</Text>
            </Pressable>

            <Pressable
              style={s.menuItem}
              onPress={() => {
                closeMenu();
                onEdit?.(selectedItem);
              }}
            >
              <Text>Edit</Text>
            </Pressable>

            <Pressable
              style={s.menuItem}
              onPress={() => {
                closeMenu();
                onDelete?.(selectedItem);
              }}
            >
              <Text style={{ color: '#b91c1c' }}>Delete</Text>
            </Pressable>

            {selectedItem?.fileUrl && (
              <Pressable
                style={s.menuItem}
                onPress={() => {
                  closeMenu();
                  Linking.openURL(selectedItem.fileUrl);
                }}
              >
                <Text>Download</Text>
              </Pressable>
            )}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  wrapper: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
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
    justifyContent: 'center',
  },

  hcell: {
    fontWeight: '700',
    color: '#111827',
  },

  kebabText: {
    fontSize: 20,
    fontWeight: '900',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalCard: {
    width: 240,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 10,
    elevation: 10,
  },

  menuItem: {
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
});
