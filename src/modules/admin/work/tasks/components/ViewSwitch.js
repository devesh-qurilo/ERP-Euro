// import React from 'react';
// import { View } from 'react-native';
// import { Button } from './ui';

// const Small = ({ label, active, onPress }) => (
//   <Button
//     title={label}
//     onPress={onPress}
//     bg={active ? '#111827' : '#e5e7eb'}
//     color={active ? '#fff' : '#111827'}
//     style={{ paddingHorizontal: 10, paddingVertical: 8 }}
//   />
// );

// export default function ViewSwitch({ onAdd, onMyTask, view, onChangeView }) {
//   return (
//     <View style={{ flexDirection: 'row', gap: 8 }}>
//       <Button title="+ Add Task" onPress={onAdd} />
//       <Button
//         title="👤 My Task"
//         onPress={onMyTask}
//         bg="#e5e7eb"
//         color="#111827"
//       />
//       <View style={{ flexDirection: 'row', gap: 6, marginLeft: 8 }}>
//         <Small
//           label="≡"
//           active={view === 'list'}
//           onPress={() => onChangeView('list')}
//         />
//         <Small
//           label="▦"
//           active={view === 'kanban'}
//           onPress={() => onChangeView('kanban')}
//         />
//         <Small
//           label="🗓️"
//           active={view === 'calendar'}
//           onPress={() => onChangeView('calendar')}
//         />
//         <Small
//           label="⚠️"
//           active={view === 'approval'}
//           onPress={() => onChangeView('approval')}
//         />
//         <Small
//           label="📌"
//           active={view === 'pin'}
//           onPress={() => onChangeView('pin')}
//         />
//       </View>
//     </View>
//   );
// }
