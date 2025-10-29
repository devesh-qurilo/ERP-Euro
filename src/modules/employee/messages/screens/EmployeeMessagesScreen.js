// import React, { useEffect, useRef, useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   TextInput,
//   Pressable,
// } from 'react-native';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchChatHistory, sendChatMessage } from '../store/actions';
// import {
//   selectChatHistory,
//   selectChatHistoryLoading,
//   selectActivePeerId,
// } from '../store/selectors';

// const MessageBubble = ({ meId, m }) => {
//   const mine = m.senderId === meId;
//   return (
//     <View style={[styles.row, mine ? styles.right : styles.left]}>
//       <View
//         style={[styles.bubble, mine ? styles.bubbleMe : styles.bubbleOther]}
//       >
//         <Text style={styles.msg}>{m.content}</Text>
//         <Text style={styles.time}>
//           {new Date(m.createdAt).toLocaleTimeString([], {
//             hour: '2-digit',
//             minute: '2-digit',
//           })}
//         </Text>
//       </View>
//     </View>
//   );
// };

// export default function EmployeeMessagesScreen({ route }) {
//   const { peerId } = route.params || {};
//   const dispatch = useDispatch();
//   const meId = useSelector(state => state.auth?.user?.employeeId) || 'ME';
//   const data = useSelector(selectChatHistory(peerId));
//   const loading = useSelector(selectChatHistoryLoading(peerId));
//   const [text, setText] = useState('');
//   const listRef = useRef(null);

//   useEffect(() => {
//     if (peerId) dispatch(fetchChatHistory(peerId));
//   }, [peerId, dispatch]);

//   useEffect(() => {
//     if (listRef.current && data?.length) {
//       setTimeout(() => listRef.current.scrollToEnd({ animated: true }), 50);
//     }
//   }, [data?.length]);

//   const send = () => {
//     const msg = text.trim();
//     if (!msg) return;
//     dispatch(sendChatMessage(peerId, msg, 'TEXT'));
//     setText('');
//   };

//   return (
//     <View style={styles.wrap}>
//       <FlatList
//         ref={listRef}
//         data={data}
//         keyExtractor={item => String(item.id)}
//         renderItem={({ item }) => <MessageBubble meId={meId} m={item} />}
//         contentContainerStyle={{ padding: 12, paddingBottom: 80 }}
//         ListEmptyComponent={
//           !loading && <Text style={styles.dim}>No messages</Text>
//         }
//       />

//       <View style={styles.composer}>
//         <TextInput
//           value={text}
//           onChangeText={setText}
//           placeholder="Type a message…"
//           placeholderTextColor="#9ca3af"
//           style={styles.input}
//           multiline
//         />
//         <Pressable style={styles.sendBtn} onPress={send}>
//           <Text style={styles.sendTxt}>Send</Text>
//         </Pressable>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   wrap: { flex: 1, backgroundColor: '#f8fafc' },
//   dim: { textAlign: 'center', color: '#94a3b8', marginTop: 20 },

//   row: { flexDirection: 'row', marginVertical: 6, paddingHorizontal: 8 },
//   left: { justifyContent: 'flex-start' },
//   right: { justifyContent: 'flex-end' },
//   bubble: {
//     maxWidth: '78%',
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 14,
//   },
//   bubbleMe: { backgroundColor: '#111827' },
//   bubbleOther: { backgroundColor: '#e5e7eb' },
//   msg: { color: '#fff' },
//   time: { color: 'rgba(255,255,255,0.7)', fontSize: 10, marginTop: 4 },

//   composer: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     flexDirection: 'row',
//     alignItems: 'flex-end',
//     gap: 8,
//     padding: 10,
//     backgroundColor: '#fff',
//     borderTopWidth: 1,
//     borderColor: '#e5e7eb',
//   },
//   input: {
//     flex: 1,
//     minHeight: 40,
//     maxHeight: 120,
//     borderWidth: 1,
//     borderColor: '#e5e7eb',
//     borderRadius: 12,
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     color: '#111827',
//     backgroundColor: '#fff',
//   },
//   sendBtn: {
//     backgroundColor: '#111827',
//     borderRadius: 12,
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//   },
//   sendTxt: { color: '#fff', fontWeight: '900' },
// });

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ChatRoomsScreen from './ChatRoomsScreen';
import ChatRoomScreen from './ChatRoomScreen';

const Stack = createNativeStackNavigator();

export default function EmployeeMessagesScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ChatRoomsScreen"
        component={ChatRoomsScreen}
        options={{ title: 'Message' }}
      />
      <Stack.Screen
        name="ChatRoomScreen"
        component={ChatRoomScreen}
        options={{ title: 'm Details' }}
      />
    </Stack.Navigator>
  );
}
