import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
} from 'react-native';

export default function AwardsTable({ data, onAdd, onEdit, onToggle }) {
  return (
    <View style={{ gap: 8 }}>
      <Pressable style={[styles.addBtn]} onPress={onAdd}>
        <Text style={styles.addTxt}>+ Add Award</Text>
      </Pressable>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator
        style={styles.hScroll}
      >
        <View style={{ minWidth: 900 }}>
          <View style={[styles.row, styles.head]}>
            <Text style={[styles.cell, styles.w80]}>Icon</Text>
            <Text style={[styles.cell, styles.w260]}>Award Name</Text>
            <Text style={[styles.cell, styles.w420]}>Summary</Text>
            <Text style={[styles.cell, styles.w120]}>Status</Text>
            <Text style={[styles.cell, styles.w160, { textAlign: 'center' }]}>
              Action
            </Text>
          </View>
          {data.map(a => (
            <View key={a.id} style={styles.row}>
              <View
                style={[styles.cell, styles.w80, { justifyContent: 'center' }]}
              >
                {a.iconUrl ? (
                  <Image
                    source={{ uri: a.iconUrl }}
                    style={{ width: 28, height: 28 }}
                  />
                ) : (
                  <Text>—</Text>
                )}
              </View>
              <Text style={[styles.cell, styles.w260]} numberOfLines={1}>
                {a.title}
              </Text>
              <Text style={[styles.cell, styles.w420]} numberOfLines={1}>
                {a.summary || '—'}
              </Text>
              <Text
                style={[
                  styles.cell,
                  styles.w120,
                  { color: a.isActive ? '#059669' : '#ef4444' },
                ]}
              >
                {a.isActive ? 'Active' : 'Inactive'}
              </Text>
              <View style={[styles.cell, styles.w160, styles.actionCell]}>
                <Pressable style={styles.smBtn} onPress={() => onEdit(a)}>
                  <Text style={styles.smTxt}>Edit</Text>
                </Pressable>
                <Pressable
                  style={[styles.smBtn, { borderColor: '#111827' }]}
                  onPress={() => onToggle(a)}
                >
                  <Text style={[styles.smTxt, { color: '#111827' }]}>
                    Toggle
                  </Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  addBtn: {
    alignSelf: 'flex-end',
    borderWidth: 1,
    borderColor: '#1d4ed8',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  addTxt: { fontWeight: '800', color: '#1d4ed8' },
  hScroll: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  head: { backgroundColor: '#f8fafc' },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  cell: { paddingHorizontal: 12, paddingVertical: 12, color: '#0f172a' },
  actionCell: { flexDirection: 'row', justifyContent: 'center', gap: 8 },
  smBtn: {
    borderWidth: 1,
    borderColor: '#1d4ed8',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  smTxt: { fontWeight: '800', color: '#1d4ed8' },
  w80: { width: 80 },
  w120: { width: 120 },
  w160: { width: 160 },
  w260: { width: 260 },
  w420: { width: 420 },
});

// import React from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   Pressable,
//   ActivityIndicator,
//   Alert,
// } from 'react-native';

// export default function AppreciationsTable({
//   data,
//   busyIds = [],
//   onEdit,
//   onDelete,
// }) {
//   const confirmDelete = row => {
//     Alert.alert(
//       'Delete Appreciation',
//       `Are you sure you want to delete "${row.awardTitle}" for ${row.givenToEmployeeName}?`,
//       [
//         { text: 'Cancel', style: 'cancel' },
//         { text: 'Delete', style: 'destructive', onPress: () => onDelete(row) },
//       ],
//     );
//   };

//   return (
//     <ScrollView
//       horizontal
//       showsHorizontalScrollIndicator
//       style={styles.hScroll}
//     >
//       <View style={{ minWidth: 1100 }}>
//         <View style={[styles.row, styles.head]}>
//           <Text style={[styles.cell, styles.w200]}>Given To</Text>
//           <Text style={[styles.cell, styles.w220]}>Award</Text>
//           <Text style={[styles.cell, styles.w140]}>Date</Text>
//           <Text style={[styles.cell, styles.w400]}>Summary</Text>
//           <Text style={[styles.cell, styles.w120, { textAlign: 'center' }]}>
//             Action
//           </Text>
//         </View>

//         {data.map(r => (
//           <View key={r.id} style={styles.row}>
//             <Text style={[styles.cell, styles.w200]} numberOfLines={1}>
//               {r.givenToEmployeeName}
//             </Text>
//             <Text style={[styles.cell, styles.w220]} numberOfLines={1}>
//               {r.awardTitle}
//             </Text>
//             <Text style={[styles.cell, styles.w140]}>{r.date}</Text>
//             <Text style={[styles.cell, styles.w400]} numberOfLines={1}>
//               {r.summary || '—'}
//             </Text>

//             <View style={[styles.cell, styles.w120, styles.actionCell]}>
//               <Pressable style={styles.smBtn} onPress={() => onEdit(r)}>
//                 <Text style={styles.smTxt}>Edit</Text>
//               </Pressable>

//               <Pressable
//                 style={[
//                   styles.smBtn,
//                   {
//                     borderColor: '#ef4444',
//                     opacity: busyIds.includes(r.id) ? 0.6 : 1,
//                   },
//                 ]}
//                 disabled={busyIds.includes(r.id)}
//                 onPress={() => confirmDelete(r)}
//               >
//                 {busyIds.includes(r.id) ? (
//                   <ActivityIndicator size="small" color="#ef4444" />
//                 ) : (
//                   <Text style={[styles.smTxt, { color: '#ef4444' }]}>
//                     Delete
//                   </Text>
//                 )}
//               </Pressable>
//             </View>
//           </View>
//         ))}
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   addBtn: {
//     alignSelf: 'flex-end',
//     borderWidth: 1,
//     borderColor: '#1d4ed8',
//     borderRadius: 10,
//     paddingHorizontal: 14,
//     paddingVertical: 10,
//     backgroundColor: '#fff',
//   },
//   addTxt: { fontWeight: '800', color: '#1d4ed8' },
//   hScroll: {
//     borderWidth: 1,
//     borderColor: '#e5e7eb',
//     borderRadius: 12,
//     backgroundColor: '#fff',
//   },
//   head: { backgroundColor: '#f8fafc' },
//   row: {
//     flexDirection: 'row',
//     borderBottomWidth: 1,
//     borderBottomColor: '#f1f5f9',
//   },
//   cell: { paddingHorizontal: 12, paddingVertical: 12, color: '#0f172a' },
//   actionCell: { flexDirection: 'row', justifyContent: 'center', gap: 8 },
//   smBtn: {
//     borderWidth: 1,
//     borderColor: '#1d4ed8',
//     borderRadius: 8,
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//   },
//   smTxt: { fontWeight: '800', color: '#1d4ed8' },
//   w80: { width: 80 },
//   w120: { width: 120 },
//   w160: { width: 160 },
//   w260: { width: 260 },
//   w420: { width: 420 },
// });
