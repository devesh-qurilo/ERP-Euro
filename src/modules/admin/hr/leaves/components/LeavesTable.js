// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   StyleSheet,
//   Pressable,
//   ActivityIndicator,
// } from 'react-native';

// const COLS = [
//   { key: 'employee', label: 'Employee', w: 220 },
//   { key: 'date', label: 'Leave Date', w: 220 },
//   { key: 'duration', label: 'Duration', w: 140 },
//   { key: 'status', label: 'Leave Status', w: 160 },
//   { key: 'type', label: 'Leave Type', w: 140 },
//   { key: 'paid', label: 'Paid', w: 120 },
//   { key: 'actions', label: 'actions', w: 80 }, // kebab only
// ];

// const TABLE_MIN_WIDTH = COLS.reduce((s, c) => s + c.w, 0) + 24;

// export default function LeavesTable({
//   data,
//   loading,
//   busyIds,
//   onApprove,
//   onReject,
//   onDelete,
// }) {
//   const [openRowId, setOpenRowId] = useState(null);

//   const toggleMenu = id => setOpenRowId(prev => (prev === id ? null : id));

//   const closeMenu = () => setOpenRowId(null);

//   return (
//     <View style={styles.card}>
//       <Text style={styles.title}>Leaves</Text>

//       <ScrollView
//         horizontal
//         showsHorizontalScrollIndicator
//         contentContainerStyle={{ minWidth: TABLE_MIN_WIDTH }}
//         style={{ overflow: 'visible' }}
//       >
//         <View>
//           {/* HEADER */}
//           <View style={[styles.row, styles.header]}>
//             {COLS.map(c => (
//               <Text key={c.key} style={[styles.cell, styles.h, { width: c.w }]}>
//                 {c.label}
//               </Text>
//             ))}
//           </View>

//           {/* BODY */}
//           <ScrollView>
//             {loading ? (
//               <ActivityIndicator style={{ margin: 16 }} />
//             ) : (
//               data.map((row, index) => {
//                 const busy = busyIds.includes(row.id);
//                 const date =
//                   row.singleDate ||
//                   `${row.startDate || '--'} - ${row.endDate || '--'}`;

//                 return (
//                   <View key={row.id} style={styles.row}>
//                     {/* Employee */}
//                     <View style={[styles.cell, { width: COLS[0].w }]}>
//                       <Text style={styles.name}>{row.employeeName}</Text>
//                       <Text style={styles.sub}>#{row.employeeId}</Text>
//                     </View>

//                     {/* Date */}
//                     <View style={[styles.cell, { width: COLS[1].w }]}>
//                       <Text>{date}</Text>
//                     </View>

//                     {/* Duration */}
//                     <Text style={[styles.cell, { width: COLS[2].w }]}>
//                       {row.durationType?.replace('_', ' ')}
//                     </Text>

//                     {/* Status */}
//                     <View style={[styles.cell, { width: COLS[3].w }]}>
//                       <Text style={styles.badge}>{row.status}</Text>
//                     </View>

//                     {/* Type */}
//                     <View style={[styles.cell, { width: COLS[4].w }]}>
//                       <Text style={styles.badgeWarn}>{row.leaveType}</Text>
//                     </View>

//                     {/* Paid */}
//                     <View style={[styles.cell, { width: COLS[5].w }]}>
//                       <Text style={styles.badgeOk}>
//                         {row.isPaid ? 'Paid' : 'Unpaid'}
//                       </Text>
//                     </View>

//                     {/* ACTIONS */}
//                     <View
//                       style={[
//                         styles.cell,
//                         { width: COLS[6].w, position: 'relative' },
//                       ]}
//                     >
//                       <Pressable
//                         disabled={busy}
//                         onPress={() => toggleMenu(row.id)}
//                         style={styles.kebabBtn}
//                       >
//                         <Text style={styles.kebabTxt}>⋮</Text>
//                       </Pressable>

//                       {openRowId === row.id && (
//                         <View
//                           style={[
//                             styles.menu,
//                             index >= data.length - 2
//                               ? styles.menuUp
//                               : styles.menuDown,
//                           ]}
//                         >
//                           <Pressable
//                             onPress={() => {
//                               closeMenu();
//                               onApprove(row);
//                             }}
//                             style={styles.menuItem}
//                           >
//                             <Text style={styles.menuApprove}>Approve</Text>
//                           </Pressable>

//                           <Pressable
//                             onPress={() => {
//                               closeMenu();
//                               onReject(row);
//                             }}
//                             style={styles.menuItem}
//                           >
//                             <Text style={styles.menuReject}>Reject</Text>
//                           </Pressable>

//                           <Pressable
//                             onPress={() => {
//                               closeMenu();
//                               onDelete(row);
//                             }}
//                             style={styles.menuItem}
//                           >
//                             <Text style={styles.menuDelete}>Delete</Text>
//                           </Pressable>
//                         </View>
//                       )}
//                     </View>
//                   </View>
//                 );
//               })
//             )}
//           </ScrollView>
//         </View>
//       </ScrollView>
//     </View>
//   );
// }

// /* ================= STYLES ================= */

// const styles = StyleSheet.create({
//   card: {
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: '#e5e7eb',
//     padding: 12,
//   },
//   title: { fontSize: 18, fontWeight: '800', marginBottom: 8 },

//   header: {
//     borderBottomWidth: 1,
//     borderBottomColor: '#f1f5f9',
//     paddingBottom: 8,
//     backgroundColor: '#e6f1fc',
//     padding: 10,
//     borderRadius: 10,
//   },
//   menuDown: {
//     top: 28,
//   },

//   menuUp: {
//     bottom: 28,
//   },
//   row: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     // borderBottomWidth: 1,
//     // borderBottomColor: '#d7d8d9',
//     paddingVertical: 10,
//     overflow: 'visible',
//     zIndex: 1,
//   },

//   cell: { paddingHorizontal: 8 },
//   h: { fontWeight: '800', color: '#374151' },

//   name: { fontWeight: '700' },
//   sub: { fontSize: 12, color: '#6b7280' },

//   badge: {
//     // backgroundColor: '#e5e7eb',
//     // borderRadius: 999,
//     paddingHorizontal: 10,
//     paddingVertical: 2,
//   },
//   badgeWarn: {
//     // backgroundColor: 'rgba(251,191,36,0.25)',
//     // borderRadius: 999,
//     paddingHorizontal: 10,
//     paddingVertical: 2,
//   },
//   badgeOk: {
//     // backgroundColor: 'rgba(16,185,129,0.2)',
//     // borderRadius: 999,
//     paddingHorizontal: 10,
//     paddingVertical: 2,
//   },

//   kebabBtn: {
//     // padding: 6,
//     alignItems: 'center',
//     // backgroundColor: '#e5e7eb',
//     borderRadius: 9,
//     paddingHorizontal: 2,
//     paddingVertical: 2,
//   },
//   kebabTxt: {
//     fontSize: 22,
//     fontWeight: '900',
//   },

//   menu: {
//     position: 'absolute',
//     right: 0,
//     backgroundColor: '#efeeee',
//     borderWidth: 1,
//     borderColor: '#000000',
//     borderRadius: 8,
//     minWidth: 140,
//     elevation: 20,
//     zIndex: 9999,
//   },

//   menuItem: {
//     paddingVertical: 10,
//     paddingHorizontal: 12,
//     borderBottomWidth: StyleSheet.hairlineWidth,
//     borderBottomColor: '#000000',
//   },

//   menuApprove: { color: '#16a34a', fontWeight: '700' },
//   menuReject: { color: '#ef4444', fontWeight: '700' },
//   menuDelete: { color: '#111827', fontWeight: '700' },
// });

// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   StyleSheet,
//   Pressable,
//   ActivityIndicator,
// } from 'react-native';

// const COLS = [
//   { key: 'employee', label: 'Employee', w: 220 },
//   { key: 'date', label: 'Leave Date', w: 220 },
//   { key: 'duration', label: 'Duration', w: 140 },
//   { key: 'status', label: 'Leave Status', w: 160 },
//   { key: 'type', label: 'Leave Type', w: 140 },
//   { key: 'paid', label: 'Paid', w: 120 },
//   { key: 'actions', label: 'Actions', w: 90 },
// ];

// const TABLE_WIDTH = COLS.reduce((s, c) => s + c.w, 0);

// export default function LeavesTable({
//   data = [],
//   loading = false,
//   busyIds = [],
//   onApprove,
//   onReject,
//   onDelete,
// }) {
//   const [openRowId, setOpenRowId] = useState(null);

//   const toggleMenu = id => setOpenRowId(prev => (prev === id ? null : id));

//   const closeMenu = () => setOpenRowId(null);

//   return (
//     <View style={styles.card}>
//       <Text style={styles.title}>Leaves</Text>

//       {/* Vertical scroll */}
//       <ScrollView style={styles.verticalScroll}>
//         {/* Horizontal scroll */}
//         <ScrollView horizontal showsHorizontalScrollIndicator>
//           <View style={{ width: TABLE_WIDTH }}>
//             {/* HEADER */}
//             <View style={[styles.row, styles.header]}>
//               {COLS.map(col => (
//                 <Text
//                   key={col.key}
//                   style={[styles.cell, styles.headerText, { width: col.w }]}
//                 >
//                   {col.label}
//                 </Text>
//               ))}
//             </View>

//             {/* BODY */}
//             {loading ? (
//               <ActivityIndicator style={{ margin: 20 }} />
//             ) : (
//               data.map((row, index) => {
//                 const busy = busyIds.includes(row.id);

//                 const date =
//                   row.singleDate ||
//                   `${row.startDate || '--'} - ${row.endDate || '--'}`;

//                 const openUp = index >= data.length - 2;

//                 return (
//                   <View key={row.id} style={styles.row}>
//                     {/* Employee */}
//                     <View style={[styles.cell, { width: COLS[0].w }]}>
//                       <Text style={styles.name}>{row.employeeName}</Text>
//                       <Text style={styles.sub}>#{row.employeeId}</Text>
//                     </View>

//                     {/* Date */}
//                     <Text style={[styles.cell, { width: COLS[1].w }]}>
//                       {date}
//                     </Text>

//                     {/* Duration */}
//                     <Text style={[styles.cell, { width: COLS[2].w }]}>
//                       {row.durationType?.replace('_', ' ')}
//                     </Text>

//                     {/* Status */}
//                     <Text style={[styles.cell, { width: COLS[3].w }]}>
//                       {row.status}
//                     </Text>

//                     {/* Type */}
//                     <Text style={[styles.cell, { width: COLS[4].w }]}>
//                       {row.leaveType}
//                     </Text>

//                     {/* Paid */}
//                     <Text style={[styles.cell, { width: COLS[5].w }]}>
//                       {row.isPaid ? 'Paid' : 'Unpaid'}
//                     </Text>

//                     {/* ACTION MENU */}
//                     <View style={[styles.cell, { width: COLS[6].w }]}>
//                       <Pressable
//                         disabled={busy}
//                         onPress={() => toggleMenu(row.id)}
//                         style={styles.kebabBtn}
//                       >
//                         <Text style={styles.kebabTxt}>⋮</Text>
//                       </Pressable>

//                       {openRowId === row.id && (
//                         <View
//                           style={[
//                             styles.menu,
//                             openUp ? styles.menuUp : styles.menuDown,
//                           ]}
//                         >
//                           <Pressable
//                             style={styles.menuItem}
//                             onPress={() => {
//                               closeMenu();
//                               onApprove(row);
//                             }}
//                           >
//                             <Text style={styles.menuApprove}>Approve</Text>
//                           </Pressable>

//                           <Pressable
//                             style={styles.menuItem}
//                             onPress={() => {
//                               closeMenu();
//                               onReject(row);
//                             }}
//                           >
//                             <Text style={styles.menuReject}>Reject</Text>
//                           </Pressable>

//                           <Pressable
//                             style={styles.menuItem}
//                             onPress={() => {
//                               closeMenu();
//                               onDelete(row);
//                             }}
//                           >
//                             <Text style={styles.menuDelete}>Delete</Text>
//                           </Pressable>
//                         </View>
//                       )}
//                     </View>
//                   </View>
//                 );
//               })
//             )}
//           </View>
//         </ScrollView>
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   card: {
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: '#e5e7eb',
//     padding: 12,
//   },

//   title: {
//     fontSize: 18,
//     fontWeight: '700',
//     marginBottom: 10,
//   },

//   verticalScroll: {
//     maxHeight: 600,
//   },

//   header: {
//     backgroundColor: '#f1f5f9',
//   },

//   headerText: {
//     fontWeight: '700',
//     color: '#374151',
//   },

//   row: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderBottomWidth: 1,
//     borderBottomColor: '#f1f5f9',
//     paddingVertical: 10,
//   },

//   cell: {
//     paddingHorizontal: 8,
//   },

//   name: {
//     fontWeight: '700',
//   },

//   sub: {
//     fontSize: 12,
//     color: '#6b7280',
//   },

//   kebabBtn: {
//     paddingHorizontal: 6,
//   },

//   kebabTxt: {
//     fontSize: 20,
//     fontWeight: '800',
//   },

//   menu: {
//     position: 'absolute',
//     right: 0,
//     backgroundColor: '#fff',
//     borderWidth: 1,
//     borderColor: '#e5e7eb',
//     borderRadius: 8,
//     minWidth: 130,
//     elevation: 20,
//     zIndex: 9999,
//   },

//   menuDown: {
//     top: 28,
//   },

//   menuUp: {
//     bottom: 28,
//   },

//   menuItem: {
//     paddingVertical: 10,
//     paddingHorizontal: 12,
//   },

//   menuApprove: {
//     color: '#16a34a',
//     fontWeight: '700',
//   },

//   menuReject: {
//     color: '#ef4444',
//     fontWeight: '700',
//   },

//   menuDelete: {
//     color: '#111827',
//     fontWeight: '700',
//   },
// });
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import ActionModal from './ActionModal';

const COLS = [
  { key: 'employee', label: 'Employee', w: 220 },
  { key: 'date', label: 'Leave Date', w: 220 },
  { key: 'duration', label: 'Duration', w: 140 },
  { key: 'status', label: 'Leave Status', w: 160 },
  { key: 'type', label: 'Leave Type', w: 140 },
  { key: 'paid', label: 'Paid', w: 120 },
  { key: 'actions', label: 'Actions', w: 90 },
];

const TABLE_WIDTH = COLS.reduce((s, c) => s + c.w, 0);

export default function LeavesTable({
  data = [],
  loading,
  busyIds = [],
  onApprove,
  onReject,
  onDelete,
}) {
  const [selectedRow, setSelectedRow] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const renderRow = ({ item }) => {
    const busy = busyIds.includes(item.id);

    const date =
      item.singleDate || `${item.startDate || '--'} - ${item.endDate || '--'}`;

    return (
      <View style={styles.row}>
        <View style={[styles.cell, { width: COLS[0].w }]}>
          <Text style={styles.name}>{item.employeeName}</Text>
          <Text style={styles.sub}>#{item.employeeId}</Text>
        </View>

        <Text style={[styles.cell, { width: COLS[1].w }]}>{date}</Text>

        <Text style={[styles.cell, { width: COLS[2].w }]}>
          {item.durationType?.replace('_', ' ')}
        </Text>

        <Text style={[styles.cell, { width: COLS[3].w }]}>{item.status}</Text>

        <Text style={[styles.cell, { width: COLS[4].w }]}>
          {item.leaveType}
        </Text>

        <Text style={[styles.cell, { width: COLS[5].w }]}>
          {item.isPaid ? 'Paid' : 'Unpaid'}
        </Text>

        <View style={[styles.cell, { width: COLS[6].w }]}>
          <Pressable
            disabled={busy}
            onPress={() => {
              setSelectedRow(item);
              setModalVisible(true);
            }}
          >
            <Text style={{ fontSize: 22 }}>⋮</Text>
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Leaves</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator>
        <View style={{ width: TABLE_WIDTH }}>
          {/* HEADER */}
          <View style={[styles.row, styles.header]}>
            {COLS.map(col => (
              <Text
                key={col.key}
                style={[styles.cell, styles.headerText, { width: col.w }]}
              >
                {col.label}
              </Text>
            ))}
          </View>

          {loading ? (
            <ActivityIndicator style={{ margin: 20 }} />
          ) : (
            <FlatList
              data={data}
              keyExtractor={item => String(item.id)}
              renderItem={renderRow}
              style={{ maxHeight: 600 }}
            />
          )}
        </View>
      </ScrollView>

      {/* GLOBAL ACTION MODAL */}
      <ActionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onApprove={() => {
          onApprove(selectedRow);
          setModalVisible(false);
        }}
        onReject={() => {
          onReject(selectedRow);
          setModalVisible(false);
        }}
        onDelete={() => {
          onDelete(selectedRow);
          setModalVisible(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 12,
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
  },

  header: {
    backgroundColor: '#f1f5f9',
  },

  headerText: {
    fontWeight: '700',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingVertical: 10,
  },

  cell: {
    paddingHorizontal: 8,
  },

  name: {
    fontWeight: '700',
  },

  sub: {
    fontSize: 12,
    color: '#6b7280',
  },
});
