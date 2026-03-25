// import React from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   StyleSheet,
//   Pressable,
//   ActivityIndicator,
//   Linking,
// } from 'react-native';

// const asArr = v => (Array.isArray(v) ? v : []);

// export default function PaymentsTable({
//   data,
//   loading,
//   busyIds,

//   onView,
//   onEdit,
//   onDelete,
//   onDownload, // uses receiptFileUrl
// }) {
//   const rows = asArr(data);
//   const busy = asArr(busyIds);

//   if (loading) return <ActivityIndicator style={{ marginTop: 16 }} />;

//   return (
//     <ScrollView horizontal style={s.hscroll}>
//       <View style={s.table}>
//         {/* header */}
//         <View style={[s.row, s.head]}>
//           {[
//             'TXN ID',
//             'Status',
//             'Amount',
//             'Currency',
//             'Gateway',
//             'Date',
//             'Project',
//             'Invoice #',
//             'Client',
//             'Actions',
//           ].map(h => (
//             <Text key={h} style={[s.cell, s.hcell]}>
//               {h}
//             </Text>
//           ))}
//         </View>

//         {/* rows */}
//         {rows.map((r, i) => {
//           const disabled = busy.includes(r.id);
//           return (
//             <View key={`${r.id}-${i}`} style={s.row}>
//               <Text style={s.cell}>{r.transactionId || '—'}</Text>
//               <Text style={s.cell}>{r.status || '—'}</Text>
//               <Text style={s.cell}>{Number(r.amount ?? 0).toFixed(2)}</Text>
//               <Text style={s.cell}>{r.currency || '—'}</Text>
//               <Text style={s.cell}>{r.paymentGateway?.name || '—'}</Text>
//               <Text style={s.cell}>{r.paymentDate || '—'}</Text>
//               <Text style={s.cell}>{r.project?.projectName || '—'}</Text>
//               <Text style={s.cell}>{r.invoice?.invoiceNumber || '—'}</Text>
//               <Text style={s.cell}>{r.client?.name || '—'}</Text>

//               <View style={[s.cell, s.actions]}>
//                 <Btn
//                   label="View"
//                   onPress={() => onView?.(r)}
//                   disabled={disabled}
//                 />
//                 <Btn
//                   label="Edit"
//                   onPress={() => onEdit?.(r)}
//                   disabled={disabled}
//                 />
//                 <Btn
//                   label="Delete"
//                   onPress={() => onDelete?.(r)}
//                   danger
//                   disabled={disabled}
//                 />
//                 {!!r.receiptFileUrl && (
//                   <Btn
//                     label="Download"
//                     onPress={() => onDownload?.(r)}
//                     disabled={disabled}
//                   />
//                 )}
//               </View>
//             </View>
//           );
//         })}
//       </View>
//     </ScrollView>
//   );
// }

// function Btn({ label, onPress, disabled, danger }) {
//   return (
//     <Pressable
//       onPress={onPress}
//       disabled={disabled}
//       style={[s.btn, danger && s.btnDanger, disabled && { opacity: 0.6 }]}
//     >
//       <Text style={[s.btnTxt, danger && { color: '#b91c1c' }]}>{label}</Text>
//     </Pressable>
//   );
// }

// const s = StyleSheet.create({
//   hscroll: {
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: '#e5e7eb',
//     backgroundColor: '#fff',
//   },
//   table: { minWidth: 1200 },
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
//     minWidth: 360,
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 8,
//     alignItems: 'center',
//   },
//   btn: {
//     borderWidth: 1,
//     borderColor: '#e5e7eb',
//     borderRadius: 8,
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     backgroundColor: '#fff',
//   },
//   btnDanger: { borderColor: '#fecaca', backgroundColor: '#fff1f2' },
//   btnTxt: { fontSize: 12, color: '#111827' },
// });

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Modal,
  Linking,
} from 'react-native';

const COLUMNS = [
  { key: 'txn', label: 'TXN ID', width: 140 },
  { key: 'status', label: 'Status', width: 110 },
  { key: 'amount', label: 'Amount', width: 120 },
  { key: 'currency', label: 'Currency', width: 100 },
  { key: 'gateway', label: 'Gateway', width: 140 },
  { key: 'date', label: 'Date', width: 120 },
  { key: 'project', label: 'Project', width: 180 },
  { key: 'invoice', label: 'Invoice #', width: 140 },
  { key: 'client', label: 'Client', width: 180 },
  { key: 'actions', label: 'Actions', width: 80 },
];

const TOTAL_WIDTH = COLUMNS.reduce((sum, c) => sum + c.width, 0);

const asArr = v => (Array.isArray(v) ? v : []);

export default function PaymentsTable({
  data,
  loading,
  busyIds,
  onView,
  onEdit,
  onDelete,
  onDownload,
}) {
  const rows = asArr(data);
  const busy = asArr(busyIds);

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
            {/* HEADER */}
            <View style={[s.row, s.head]}>
              {COLUMNS.map(col => (
                <View key={col.key} style={[s.cell, { width: col.width }]}>
                  <Text style={s.hcell}>{col.label}</Text>
                </View>
              ))}
            </View>

            {/* ROWS */}
            {rows.map((r, i) => {
              const disabled = busy.includes(r.id);

              return (
                <View
                  key={`${r.id}-${i}`}
                  style={[
                    s.row,
                    { backgroundColor: i % 2 === 0 ? '#fff' : '#fafafa' },
                  ]}
                >
                  <View style={[s.cell, { width: 140 }]}>
                    <Text numberOfLines={1}>{r.transactionId || '—'}</Text>
                  </View>

                  <View style={[s.cell, { width: 110 }]}>
                    <Text>{r.status || '—'}</Text>
                  </View>

                  <View style={[s.cell, { width: 120 }]}>
                    <Text style={{ fontWeight: '600' }}>
                      {Number(r.amount ?? 0).toFixed(2)}
                    </Text>
                  </View>

                  <View style={[s.cell, { width: 100 }]}>
                    <Text>{r.currency || '—'}</Text>
                  </View>

                  <View style={[s.cell, { width: 140 }]}>
                    <Text numberOfLines={1}>
                      {r.paymentGateway?.name || '—'}
                    </Text>
                  </View>

                  <View style={[s.cell, { width: 120 }]}>
                    <Text>{r.paymentDate.slice(0, 10) || '—'}</Text>
                  </View>

                  <View style={[s.cell, { width: 180 }]}>
                    <Text numberOfLines={1}>
                      {r.project?.projectName || '—'}
                    </Text>
                  </View>

                  <View style={[s.cell, { width: 140 }]}>
                    <Text numberOfLines={1}>
                      {r.invoice?.invoiceNumber || '—'}
                    </Text>
                  </View>

                  <View style={[s.cell, { width: 180 }]}>
                    <Text numberOfLines={1}>{r.client?.name || '—'}</Text>
                  </View>

                  <View style={[s.cell, { width: 80, alignItems: 'center' }]}>
                    {disabled ? (
                      <ActivityIndicator size="small" />
                    ) : (
                      <Pressable onPress={() => setSelectedItem(r)}>
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

      {/* CENTER ACTION MODAL */}
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

            {!!selectedItem?.receiptFileUrl && (
              <Pressable
                style={s.menuItem}
                onPress={() => {
                  closeMenu();
                  onDownload
                    ? onDownload(selectedItem)
                    : Linking.openURL(selectedItem.receiptFileUrl);
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
