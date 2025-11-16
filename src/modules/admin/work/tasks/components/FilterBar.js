// import React from 'react';
// import { View, Text, TextInput } from 'react-native';
// import { Chip } from './ui';

// export default function FilterBar({
//   hideCompleted,
//   onToggleHide,
//   search,
//   onSearch,
// }) {
//   return (
//     <View
//       style={{
//         flexDirection: 'row',
//         alignItems: 'center',
//         gap: 10,
//         marginBottom: 8,
//       }}
//     >
//       <Chip
//         active={hideCompleted}
//         label={
//           hideCompleted ? 'Showing: Without Completed' : 'Hide Completed Task'
//         }
//         onPress={onToggleHide}
//       />
//       <View style={{ flex: 1, alignItems: 'flex-end' }}>
//         <View
//           style={{
//             flexDirection: 'row',
//             alignItems: 'center',
//             borderWidth: 1,
//             borderColor: '#e5e5e5',
//             borderRadius: 8,
//             paddingHorizontal: 10,
//             height: 36,
//             width: 240,
//           }}
//         >
//           <Text style={{ marginRight: 6 }}>🔎</Text>
//           <TextInput
//             value={search}
//             onChangeText={onSearch}
//             placeholder="Search"
//             style={{ flex: 1 }}
//           />
//         </View>
//       </View>
//     </View>
//   );
// }
