// // /src/modules/admin/messages/screens/AdminMessageRoomScreen.js
// import React, { useEffect, useMemo, useState, useCallback } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   ActivityIndicator,
//   KeyboardAvoidingView,
//   Platform,
//   TouchableOpacity,
//   TextInput,
//   Alert,
//   RefreshControl,
// } from 'react-native';
// import { useDispatch, useSelector } from 'react-redux';
// import Icon from 'react-native-vector-icons/Feather';
// import { SafeAreaView } from 'react-native-safe-area-context';

// import Avatar from '../components/Avatar';
// import MessageBubble from '../components/MessageBubble';

// import {
//   fetchAdminHistory,
//   sendAdminMessage,
//   setActiveAdminRoom,
//   markMessagesAsRead,
// } from '../store/actions';

// import {
//   selectAdminHistory,
//   selectAdminHistoryMeta,
//   selectAdminSending,
//   selectMessagesState,
//   selectAdminRooms,
// } from '../store/selectors';

// /* helper to derive other id from chatRoomId */
// function getOtherFromRoomId(chatRoomId, myEmployeeId) {
//   if (!chatRoomId) return null;
//   if (chatRoomId.includes('_NEW')) {
//     const parts = chatRoomId.split('_');
//     if (parts.length >= 2) return parts[0];
//     return null;
//   }
//   const parts = chatRoomId.split('_');
//   if (parts.length !== 2) return null;
//   const [a, b] = parts;
//   if (!myEmployeeId) return a === b ? a : a;
//   if (String(a) === String(myEmployeeId)) return b;
//   if (String(b) === String(myEmployeeId)) return a;
//   return a;
// }

// export default function AdminMessageRoomScreen({ route, navigation }) {
//   const dispatch = useDispatch();

//   const { participant: participantParam, chatRoomId: routeChatRoomId } =
//     route.params || {};

//   const myEmployeeId = useSelector(s => s?.auth?.user?.employeeId) || null;
//   const messagesState = useSelector(selectMessagesState);
//   const rooms = useSelector(selectAdminRooms) || [];

//   const derivedOtherId = useMemo(() => {
//     if (participantParam && participantParam.employeeId)
//       return participantParam.employeeId;

//     if (routeChatRoomId) {
//       const other = getOtherFromRoomId(routeChatRoomId, myEmployeeId);
//       if (other) return other;
//       if (!routeChatRoomId.includes('_')) return routeChatRoomId;
//     }

//     return messagesState?.activeRoomId || null;
//   }, [participantParam, routeChatRoomId, myEmployeeId, messagesState]);

//   const participant = useMemo(() => {
//     if (participantParam && participantParam.employeeId)
//       return participantParam;

//     const found = rooms.find(r => {
//       const p1 = (r.participant1Details || {}).employeeId;
//       const p2 = (r.participant2Details || {}).employeeId;
//       return p1 === derivedOtherId || p2 === derivedOtherId;
//     });

//     if (found) {
//       const p1 = found.participant1Details || {};
//       const p2 = found.participant2Details || {};
//       const chosen = p1.employeeId === derivedOtherId ? p1 : p2;
//       return {
//         employeeId: chosen.employeeId,
//         name: chosen.name,
//         profileUrl: chosen.profileUrl || chosen.profilePictureUrl || null,
//         designation: chosen.designation,
//         department: chosen.department,
//       };
//     }

//     if (derivedOtherId) {
//       return {
//         employeeId: derivedOtherId,
//         name: derivedOtherId,
//         profileUrl: null,
//       };
//     }

//     return null;
//   }, [participantParam, rooms, derivedOtherId]);

//   // selectors for history
//   const history =
//     useSelector(state => selectAdminHistory(state, derivedOtherId)) || [];
//   const historyMeta =
//     useSelector(state => selectAdminHistoryMeta(state, derivedOtherId)) || {};
//   const sending = useSelector(selectAdminSending);

//   // set active room + fetch history when derivedOtherId appears
//   useEffect(() => {
//     if (!derivedOtherId) return;
//     dispatch(setActiveAdminRoom(derivedOtherId));
//     dispatch(fetchAdminHistory(derivedOtherId));
//   }, [derivedOtherId, dispatch]);

//   // header: back button + avatar + refresh icon
//   useEffect(() => {
//     navigation.setOptions({
//       headerTitle: participant?.name || 'Chat',
//       headerLeft: () => (
//         <TouchableOpacity
//           onPress={() => {
//             // mark read before going back
//             if (derivedOtherId) dispatch(markMessagesAsRead(derivedOtherId));
//             navigation.goBack();
//           }}
//           style={{ paddingHorizontal: 12 }}
//         >
//           <Icon name="arrow-left" size={20} color="#0F172A" />
//         </TouchableOpacity>
//       ),
//       headerRight: () => (
//         <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//           <TouchableOpacity
//             onPress={() => {
//               // manual refresh from header
//               if (derivedOtherId) dispatch(fetchAdminHistory(derivedOtherId));
//             }}
//             style={{ paddingHorizontal: 8 }}
//           >
//             <Icon name="refresh-cw" size={18} color="#0F172A" />
//           </TouchableOpacity>

//           <Avatar
//             uri={participant?.profileUrl}
//             name={participant?.name}
//             size={36}
//           />
//         </View>
//       ),
//       headerStyle: {
//         backgroundColor: '#fff',
//         borderBottomWidth: 1,
//         borderBottomColor: '#F1F5F9',
//       },
//     });
//   }, [navigation, participant, derivedOtherId, dispatch]);

//   // send message
//   const [text, setText] = useState('');
//   const onSend = useCallback(() => {
//     const trimmed = (text || '').trim();
//     if (!trimmed || !derivedOtherId) return;
//     const clientId = `c_${Date.now()}`;
//     dispatch(
//       sendAdminMessage({
//         chatRoomId: derivedOtherId,
//         receiverId: derivedOtherId,
//         content: trimmed,
//         messageType: 'TEXT',
//         clientId,
//       }),
//     );
//     setText('');
//   }, [text, dispatch, derivedOtherId]);

//   // pull-to-refresh handler
//   const onRefresh = useCallback(() => {
//     if (!derivedOtherId) return;
//     dispatch(fetchAdminHistory(derivedOtherId));
//   }, [derivedOtherId, dispatch]);

//   // render message
//   const renderItem = ({ item }) => {
//     const mine =
//       String(item.senderId) === String(myEmployeeId) ||
//       !!item.temp ||
//       !!item.clientId;
//     return <MessageBubble msg={item} mine={mine} />;
//   };

//   const keyExtractor = item =>
//     item.clientId ? `c_${item.clientId}` : `m_${item.id}`;

//   const flatData = history ? [...history].slice().reverse() : [];

//   return (
//     <SafeAreaView style={styles.screen}>
//       <KeyboardAvoidingView
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         style={{ flex: 1 }}
//         keyboardVerticalOffset={150}
//       >
//         {/* <View style={styles.topBar}>
//           <View style={styles.topLeft}>
//             <Avatar
//               uri={participant?.profileUrl}
//               name={participant?.name}
//               size={44}
//             />
//             <View style={{ marginLeft: 12 }}>
//               <Text style={styles.participantName}>{participant?.name}</Text>
//               <Text style={styles.participantMeta}>
//                 {participant?.designation || participant?.department || ''}
//               </Text>
//             </View>
//           </View>

//           <View style={styles.topActions}>
//             <TouchableOpacity
//               style={styles.iconAction}
//               onPress={() => Alert.alert('Details', participant?.name || '')}
//             >
//               <Icon name="more-vertical" size={18} />
//             </TouchableOpacity>
//           </View>
//         </View> */}

//         {/* <View style={styles.divider} /> */}

//         <View style={styles.messagesContainer}>
//           {!derivedOtherId || (historyMeta.loading && flatData.length === 0) ? (
//             <ActivityIndicator style={{ marginTop: 30 }} color="#2563EB" />
//           ) : (
//             <FlatList
//               inverted
//               data={flatData}
//               keyExtractor={keyExtractor}
//               renderItem={renderItem}
//               contentContainerStyle={{
//                 paddingVertical: 12,
//                 paddingHorizontal: 16,
//               }}
//               refreshControl={
//                 <RefreshControl
//                   refreshing={!!historyMeta.loading}
//                   onRefresh={onRefresh}
//                   tintColor="#2563EB"
//                 />
//               }
//               ListEmptyComponent={() => (
//                 <View style={styles.emptyContainer}>
//                   <Text style={styles.emptyTitle}>No messages yet</Text>
//                   <Text style={styles.emptySub}>Say hi 👋</Text>
//                 </View>
//               )}
//             />
//           )}
//         </View>

//         <View style={styles.inputWrap}>
//           <View style={styles.inputInner}>
//             <TextInput
//               placeholder="Type a message..."
//               placeholderTextColor="#94A3B8"
//               value={text}
//               onChangeText={setText}
//               style={styles.input}
//               multiline
//               editable={!!derivedOtherId}
//             />
//           </View>

//           <TouchableOpacity
//             onPress={onSend}
//             style={[styles.sendBtn, !derivedOtherId ? { opacity: 0.5 } : null]}
//             disabled={sending || !derivedOtherId}
//           >
//             {sending ? (
//               <ActivityIndicator size="small" color="#fff" />
//             ) : (
//               <Icon name="send" size={18} color="#fff" />
//             )}
//           </TouchableOpacity>
//         </View>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   screen: { flex: 1, backgroundColor: '#a7c8e9ff' },
//   topBar: {
//     paddingHorizontal: 16,
//     backgroundColor: '#be2020ff',
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingVertical: 12,
//   },
//   topLeft: { flexDirection: 'row', alignItems: 'center' },
//   participantName: { fontWeight: '800', fontSize: 16 },
//   participantMeta: { fontSize: 12, color: '#64748B', marginTop: 2 },
//   topActions: { flexDirection: 'row', alignItems: 'center' },
//   iconAction: { padding: 8, marginLeft: 8, borderRadius: 8 },
//   divider: { height: 1, backgroundColor: '#0d2e4fff' },
//   messagesContainer: { flex: 1, marginTop: 0, backgroundColor: '#a7c8e9ff' },
//   emptyContainer: {
//     // flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     // paddingTop: 40,
//   },
//   emptyTitle: { fontSize: 18, fontWeight: '700', color: '#94A3B8' },
//   emptySub: { color: '#94A3B8', marginTop: 8 },
//   inputWrap: {
//     flexDirection: 'row',
//     padding: 12,
//     backgroundColor: '#fff',
//     alignItems: 'flex-end',
//     borderTopWidth: 1,
//     borderTopColor: '#F1F5F9',
//   },
//   inputInner: {
//     flex: 1,
//     borderRadius: 28,
//     borderWidth: 1,
//     borderColor: '#E6EEF8',
//     backgroundColor: '#F8FAFC',
//     paddingHorizontal: 14,
//     paddingVertical: 8,
//     marginRight: 8,
//     minHeight: 44,
//     maxHeight: 140,
//   },
//   input: { fontSize: 15, color: '#0F172A', padding: 0, margin: 0 },
//   sendBtn: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     backgroundColor: '#2563EB',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });

// // /src/modules/admin/messages/screens/AdminMessageRoomScreen.js
// import React, { useEffect, useMemo, useState, useCallback } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   ActivityIndicator,
//   KeyboardAvoidingView,
//   Platform,
//   TouchableOpacity,
//   TextInput,
//   Alert,
//   RefreshControl,
//   ActionSheetIOS,
// } from 'react-native';
// import { useDispatch, useSelector } from 'react-redux';
// import Icon from 'react-native-vector-icons/Feather';
// import { SafeAreaView } from 'react-native-safe-area-context';

// import ImagePicker from 'react-native-image-crop-picker';
// import * as DocumentPicker from 'expo-document-picker';

// import Avatar from '../components/Avatar';
// import MessageBubble from '../components/MessageBubble';

// import {
//   fetchAdminHistory,
//   sendAdminMessage,
//   setActiveAdminRoom,
//   markMessagesAsRead,
// } from '../store/actions';

// import {
//   selectAdminHistory,
//   selectAdminHistoryMeta,
//   selectAdminSending,
//   selectMessagesState,
//   selectAdminRooms,
// } from '../store/selectors';

// /* helper to derive other id from chatRoomId */
// function getOtherFromRoomId(chatRoomId, myEmployeeId) {
//   if (!chatRoomId) return null;
//   if (chatRoomId.includes('_NEW')) {
//     const parts = chatRoomId.split('_');
//     if (parts.length >= 2) return parts[0];
//     return null;
//   }
//   const parts = chatRoomId.split('_');
//   if (parts.length !== 2) return null;
//   const [a, b] = parts;
//   if (!myEmployeeId) return a === b ? a : a;
//   if (String(a) === String(myEmployeeId)) return b;
//   if (String(b) === String(myEmployeeId)) return a;
//   return a;
// }

// /* normalize DocumentPicker / ImagePicker item to RN file object expected by your saga */
// function normalizePickedFile(item) {
//   // DocumentPicker returns: { uri, name / fileName, type, size }
//   // ImageCropPicker returns: { path, mime, filename? } (Android may have path)
//   if (!item) return null;

//   // image-crop-picker result has `path`
//   if (item.path || item.sourceURL) {
//     const uri = item.path || item.sourceURL;
//     const name =
//       item.filename ||
//       (uri && uri.split('/').pop()) ||
//       `photo_${Date.now()}.jpg`;
//     const type = item.mime || 'image/jpeg';
//     return { uri, name, type };
//   }

//   // DocumentPicker result typical
//   const uri = item.uri || item.fileCopyUri;
//   const name = item.name || item.fileName || (uri && uri.split('/').pop());
//   const type = item.type || 'application/octet-stream';
//   return { uri, name, type };
// }

// export default function AdminMessageRoomScreen({ route, navigation }) {
//   const dispatch = useDispatch();

//   const { participant: participantParam, chatRoomId: routeChatRoomId } =
//     route.params || {};

//   const myEmployeeId = useSelector(s => s?.auth?.user?.employeeId) || null;
//   const messagesState = useSelector(selectMessagesState);
//   const rooms = useSelector(selectAdminRooms) || [];

//   const derivedOtherId = useMemo(() => {
//     if (participantParam && participantParam.employeeId)
//       return participantParam.employeeId;

//     if (routeChatRoomId) {
//       const other = getOtherFromRoomId(routeChatRoomId, myEmployeeId);
//       if (other) return other;
//       if (!routeChatRoomId.includes('_')) return routeChatRoomId;
//     }

//     return messagesState?.activeRoomId || null;
//   }, [participantParam, routeChatRoomId, myEmployeeId, messagesState]);

//   const participant = useMemo(() => {
//     if (participantParam && participantParam.employeeId)
//       return participantParam;

//     const found = rooms.find(r => {
//       const p1 = (r.participant1Details || {}).employeeId;
//       const p2 = (r.participant2Details || {}).employeeId;
//       return p1 === derivedOtherId || p2 === derivedOtherId;
//     });

//     if (found) {
//       const p1 = found.participant1Details || {};
//       const p2 = found.participant2Details || {};
//       const chosen = p1.employeeId === derivedOtherId ? p1 : p2;
//       return {
//         employeeId: chosen.employeeId,
//         name: chosen.name,
//         profileUrl: chosen.profileUrl || chosen.profilePictureUrl || null,
//         designation: chosen.designation,
//         department: chosen.department,
//       };
//     }

//     if (derivedOtherId) {
//       return {
//         employeeId: derivedOtherId,
//         name: derivedOtherId,
//         profileUrl: null,
//       };
//     }

//     return null;
//   }, [participantParam, rooms, derivedOtherId]);

//   // selectors for history
//   const history =
//     useSelector(state => selectAdminHistory(state, derivedOtherId)) || [];
//   const historyMeta =
//     useSelector(state => selectAdminHistoryMeta(state, derivedOtherId)) || {};
//   const sending = useSelector(selectAdminSending);

//   // set active room + fetch history when derivedOtherId appears
//   useEffect(() => {
//     if (!derivedOtherId) return;
//     dispatch(setActiveAdminRoom(derivedOtherId));
//     dispatch(fetchAdminHistory(derivedOtherId));
//   }, [derivedOtherId, dispatch]);

//   // header: back button + avatar + refresh icon
//   useEffect(() => {
//     navigation.setOptions({
//       headerTitle: participant?.name || 'Chat',
//       headerLeft: () => (
//         <TouchableOpacity
//           onPress={() => {
//             if (derivedOtherId) dispatch(markMessagesAsRead(derivedOtherId));
//             navigation.goBack();
//           }}
//           style={{ paddingHorizontal: 12 }}
//         >
//           <Icon name="arrow-left" size={20} color="#0F172A" />
//         </TouchableOpacity>
//       ),
//       headerRight: () => (
//         <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//           <TouchableOpacity
//             onPress={() => {
//               if (derivedOtherId) dispatch(fetchAdminHistory(derivedOtherId));
//             }}
//             style={{ paddingHorizontal: 8 }}
//           >
//             <Icon name="refresh-cw" size={18} color="#0F172A" />
//           </TouchableOpacity>

//           <Avatar
//             uri={participant?.profileUrl}
//             name={participant?.name}
//             size={36}
//           />
//         </View>
//       ),
//       headerStyle: {
//         backgroundColor: '#fff',
//         borderBottomWidth: 1,
//         borderBottomColor: '#F1F5F9',
//       },
//     });
//   }, [navigation, participant, derivedOtherId, dispatch]);

//   // send message (text)
//   const [text, setText] = useState('');
//   const onSend = useCallback(() => {
//     const trimmed = (text || '').trim();
//     if (!trimmed || !derivedOtherId) return;
//     const clientId = `c_${Date.now()}`;
//     dispatch(
//       sendAdminMessage({
//         chatRoomId: derivedOtherId,
//         receiverId: derivedOtherId,
//         content: trimmed,
//         messageType: 'TEXT',
//         clientId,
//       }),
//     );
//     setText('');
//   }, [text, dispatch, derivedOtherId]);

//   // pull-to-refresh handler
//   const onRefresh = useCallback(() => {
//     if (!derivedOtherId) return;
//     dispatch(fetchAdminHistory(derivedOtherId));
//   }, [derivedOtherId, dispatch]);

//   // --- Attachment handling ---
//   const openAttachmentSheet = useCallback(() => {
//     // iOS ActionSheet
//     if (Platform.OS === 'ios') {
//       ActionSheetIOS.showActionSheetWithOptions(
//         {
//           options: ['Cancel', 'Camera', 'Gallery', 'Document'],
//           cancelButtonIndex: 0,
//         },
//         buttonIndex => {
//           if (buttonIndex === 1) pickFromCamera();
//           if (buttonIndex === 2) pickFromGallery();
//           if (buttonIndex === 3) pickDocument();
//         },
//       );
//       return;
//     }

//     // Android simple prompt
//     Alert.alert(
//       'Attach',
//       'Choose source',
//       [
//         { text: 'Camera', onPress: pickFromCamera },
//         { text: 'Gallery', onPress: pickFromGallery },
//         { text: 'Document', onPress: pickDocument },
//         { text: 'Cancel', style: 'cancel' },
//       ],
//       { cancelable: true },
//     );
//   }, [derivedOtherId]);

//   const pickFromCamera = useCallback(async () => {
//     try {
//       const img = await ImagePicker.openCamera({
//         mediaType: 'photo',
//         cropping: false,
//         includeExif: false,
//       });

//       const file = {
//         uri: img.path,
//         name: img.filename || `photo_${Date.now()}.jpg`,
//         type: img.mime,
//       };

//       dispatch(
//         sendAdminMessage({
//           chatRoomId: derivedOtherId,
//           receiverId: derivedOtherId,
//           messageType: 'IMAGE',
//           file,
//           clientId: `c_${Date.now()}`,
//         }),
//       );
//     } catch (err) {
//       if (err?.code === 'E_PICKER_CANCELLED') return;
//       console.log('camera error', err);
//       Alert.alert('Error', 'Unable to open camera');
//     }
//   }, [derivedOtherId]);

//   // pick image from gallery (document-picker can also pick images)
//   const pickFromGallery = useCallback(async () => {
//     try {
//       const img = await ImagePicker.openPicker({
//         mediaType: 'photo',
//         multiple: false,
//         includeExif: false,
//       });

//       const file = {
//         uri: img.path,
//         name: img.filename || `image_${Date.now()}.jpg`,
//         type: img.mime,
//       };

//       dispatch(
//         sendAdminMessage({
//           chatRoomId: derivedOtherId,
//           receiverId: derivedOtherId,
//           messageType: 'IMAGE',
//           file,
//           clientId: `c_${Date.now()}`,
//         }),
//       );
//     } catch (err) {
//       if (err?.code === 'E_PICKER_CANCELLED') return;
//       console.log('gallery error', err);
//       Alert.alert('Error', 'Unable to pick image');
//     }
//   }, [derivedOtherId]);

//   // ---- PICK FILE (SAFE) ----
//   const pickDocument = useCallback(async () => {
//     if (!derivedOtherId) {
//       Alert.alert('Error', 'No conversation selected');
//       return;
//     }

//     try {
//       const res = await DocumentPicker.getDocumentAsync({
//         type: '*/*', // pdf, docx, xlsx, zip, images, videos
//         multiple: false,
//         copyToCacheDirectory: true,
//       });

//       if (res.type === 'cancel') return;

//       const file = {
//         uri: res.uri,
//         name: res.name ?? `file_${Date.now()}`,
//         type: res.mimeType ?? 'application/octet-stream',
//       };

//       dispatch(
//         sendAdminMessage({
//           chatRoomId: derivedOtherId,
//           receiverId: derivedOtherId,
//           content: null,
//           messageType: 'FILE',
//           file,
//           clientId: `c_${Date.now()}`,
//         }),
//       );
//     } catch (err) {
//       console.log('document error', err);
//       Alert.alert('Error', 'Unable to pick document.');
//     }
//   }, [derivedOtherId, dispatch]);

//   // render message
//   const renderItem = ({ item }) => {
//     const mine =
//       String(item.senderId) === String(myEmployeeId) ||
//       !!item.temp ||
//       !!item.clientId;
//     return <MessageBubble msg={item} mine={mine} />;
//   };

//   const keyExtractor = item =>
//     item.clientId ? `c_${item.clientId}` : `m_${item.id}`;

//   const flatData = history ? [...history].slice().reverse() : [];

//   return (
//     <SafeAreaView style={styles.screen}>
//       <KeyboardAvoidingView
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         style={{ flex: 1 }}
//         keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 150}
//       >
//         <View style={styles.topBar}>
//           <View style={styles.topLeft}>
//             <Avatar
//               uri={participant?.profileUrl}
//               name={participant?.name}
//               size={44}
//             />
//             <View style={{ marginLeft: 12 }}>
//               <Text style={styles.participantName}>{participant?.name}</Text>
//               <Text style={styles.participantMeta}>
//                 {participant?.designation || participant?.department || ''}
//               </Text>
//             </View>
//           </View>

//           <View style={styles.topActions}>
//             <TouchableOpacity
//               style={styles.iconAction}
//               onPress={() => Alert.alert('Details', participant?.name || '')}
//             >
//               <Icon name="more-vertical" size={18} />
//             </TouchableOpacity>
//           </View>
//         </View>

//         <View style={styles.divider} />

//         <View style={styles.messagesContainer}>
//           {!derivedOtherId || (historyMeta.loading && flatData.length === 0) ? (
//             <ActivityIndicator style={{ marginTop: 30 }} color="#2563EB" />
//           ) : (
//             <FlatList
//               inverted
//               data={flatData}
//               keyExtractor={keyExtractor}
//               renderItem={renderItem}
//               contentContainerStyle={{
//                 paddingVertical: 12,
//                 paddingHorizontal: 16,
//               }}
//               refreshControl={
//                 <RefreshControl
//                   refreshing={!!historyMeta.loading}
//                   onRefresh={onRefresh}
//                   tintColor="#2563EB"
//                 />
//               }
//               ListEmptyComponent={() => (
//                 <View style={styles.emptyContainer}>
//                   <Text style={styles.emptyTitle}>No messages yet</Text>
//                   <Text style={styles.emptySub}>Say hi 👋</Text>
//                 </View>
//               )}
//             />
//           )}
//         </View>

//         <View style={styles.inputWrap}>
//           <TouchableOpacity
//             onPress={openAttachmentSheet}
//             style={styles.attachBtn}
//             disabled={!derivedOtherId}
//           >
//             <Icon name="paperclip" size={20} color="#0F172A" />
//           </TouchableOpacity>

//           <View style={styles.inputInner}>
//             <TextInput
//               placeholder="Type a message..."
//               placeholderTextColor="#94A3B8"
//               value={text}
//               onChangeText={setText}
//               style={styles.input}
//               multiline
//               editable={!!derivedOtherId}
//             />
//           </View>

//           <TouchableOpacity
//             onPress={onSend}
//             style={[styles.sendBtn, !derivedOtherId ? { opacity: 0.5 } : null]}
//             disabled={sending || !derivedOtherId}
//           >
//             {sending ? (
//               <ActivityIndicator size="small" color="#fff" />
//             ) : (
//               <Icon name="send" size={18} color="#fff" />
//             )}
//           </TouchableOpacity>
//         </View>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   screen: { flex: 1, backgroundColor: '#F8FAFC' },
//   topBar: {
//     paddingHorizontal: 16,
//     backgroundColor: '#fff',
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingVertical: 12,
//   },
//   topLeft: { flexDirection: 'row', alignItems: 'center' },
//   participantName: { fontWeight: '800', fontSize: 16 },
//   participantMeta: { fontSize: 12, color: '#64748B', marginTop: 2 },
//   topActions: { flexDirection: 'row', alignItems: 'center' },
//   iconAction: { padding: 8, marginLeft: 8, borderRadius: 8 },
//   divider: { height: 1, backgroundColor: '#F1F5F9' },
//   messagesContainer: { flex: 1, backgroundColor: '#F8FAFC' },
//   emptyContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingTop: 40,
//   },
//   emptyTitle: { fontSize: 18, fontWeight: '700', color: '#94A3B8' },
//   emptySub: { color: '#94A3B8', marginTop: 8 },
//   inputWrap: {
//     flexDirection: 'row',
//     padding: 12,
//     backgroundColor: '#fff',
//     alignItems: 'flex-end',
//     borderTopWidth: 1,
//     borderTopColor: '#F1F5F9',
//   },
//   attachBtn: {
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginRight: 8,
//     backgroundColor: '#EEF2FF',
//   },
//   inputInner: {
//     flex: 1,
//     borderRadius: 28,
//     borderWidth: 1,
//     borderColor: '#E6EEF8',
//     backgroundColor: '#F8FAFC',
//     paddingHorizontal: 14,
//     paddingVertical: 8,
//     marginRight: 8,
//     minHeight: 44,
//     maxHeight: 140,
//   },
//   input: { fontSize: 15, color: '#0F172A', padding: 0, margin: 0 },
//   sendBtn: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     backgroundColor: '#2563EB',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });

// // /src/modules/admin/messages/screens/AdminMessageRoomScreen.js
// import React, { useEffect, useMemo, useState, useCallback } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   ActivityIndicator,
//   KeyboardAvoidingView,
//   Platform,
//   TouchableOpacity,
//   TextInput,
//   Alert,
//   RefreshControl,
//   PermissionsAndroid,
// } from 'react-native';
// import { useDispatch, useSelector } from 'react-redux';
// import Icon from 'react-native-vector-icons/Feather';
// import { SafeAreaView } from 'react-native-safe-area-context';

// import Avatar from '../components/Avatar';
// import MessageBubble from '../components/MessageBubble';

// import {
//   fetchAdminHistory,
//   sendAdminMessage,
//   setActiveAdminRoom,
//   markMessagesAsRead,
// } from '../store/actions';

// import {
//   selectAdminHistory,
//   selectAdminHistoryMeta,
//   selectAdminSending,
//   selectMessagesState,
//   selectAdminRooms,
// } from '../store/selectors';

// // ---- Document picker import (package: @react-native-documents/picker) ----
// import DocumentPicker from '@react-native-documents/picker';

// // helper to derive other id from chatRoomId
// function getOtherFromRoomId(chatRoomId, myEmployeeId) {
//   if (!chatRoomId) return null;
//   if (chatRoomId.includes('_NEW')) {
//     const parts = chatRoomId.split('_');
//     if (parts.length >= 2) return parts[0];
//     return null;
//   }
//   const parts = chatRoomId.split('_');
//   if (parts.length !== 2) return null;
//   const [a, b] = parts;
//   if (!myEmployeeId) return a === b ? a : a;
//   if (String(a) === String(myEmployeeId)) return b;
//   if (String(b) === String(myEmployeeId)) return a;
//   return a;
// }

// export default function AdminMessageRoomScreen({ route, navigation }) {
//   const dispatch = useDispatch();

//   const { participant: participantParam, chatRoomId: routeChatRoomId } =
//     route.params || {};

//   const myEmployeeId = useSelector(s => s?.auth?.user?.employeeId) || null;
//   const messagesState = useSelector(selectMessagesState);
//   const rooms = useSelector(selectAdminRooms) || [];

//   const derivedOtherId = useMemo(() => {
//     if (participantParam && participantParam.employeeId)
//       return participantParam.employeeId;

//     if (routeChatRoomId) {
//       const other = getOtherFromRoomId(routeChatRoomId, myEmployeeId);
//       if (other) return other;
//       if (!routeChatRoomId.includes('_')) return routeChatRoomId;
//     }

//     return messagesState?.activeRoomId || null;
//   }, [participantParam, routeChatRoomId, myEmployeeId, messagesState]);

//   const participant = useMemo(() => {
//     if (participantParam && participantParam.employeeId)
//       return participantParam;

//     const found = rooms.find(r => {
//       const p1 = (r.participant1Details || {}).employeeId;
//       const p2 = (r.participant2Details || {}).employeeId;
//       return p1 === derivedOtherId || p2 === derivedOtherId;
//     });

//     if (found) {
//       const p1 = found.participant1Details || {};
//       const p2 = found.participant2Details || {};
//       const chosen = p1.employeeId === derivedOtherId ? p1 : p2;
//       return {
//         employeeId: chosen.employeeId,
//         name: chosen.name,
//         profileUrl: chosen.profileUrl || chosen.profilePictureUrl || null,
//         designation: chosen.designation,
//         department: chosen.department,
//       };
//     }

//     if (derivedOtherId) {
//       return {
//         employeeId: derivedOtherId,
//         name: derivedOtherId,
//         profileUrl: null,
//       };
//     }

//     return null;
//   }, [participantParam, rooms, derivedOtherId]);

//   // selectors for history
//   const history =
//     useSelector(state => selectAdminHistory(state, derivedOtherId)) || [];
//   const historyMeta =
//     useSelector(state => selectAdminHistoryMeta(state, derivedOtherId)) || {};
//   const sending = useSelector(selectAdminSending);

//   // set active room + fetch history when derivedOtherId appears
//   useEffect(() => {
//     if (!derivedOtherId) return;
//     dispatch(setActiveAdminRoom(derivedOtherId));
//     dispatch(fetchAdminHistory(derivedOtherId));
//   }, [derivedOtherId, dispatch]);

//   // header: back button + avatar + refresh icon
//   useEffect(() => {
//     navigation.setOptions({
//       headerTitle: participant?.name || 'Chat',
//       headerLeft: () => (
//         <TouchableOpacity
//           onPress={() => {
//             if (derivedOtherId) dispatch(markMessagesAsRead(derivedOtherId));
//             navigation.goBack();
//           }}
//           style={{ paddingHorizontal: 12 }}
//         >
//           <Icon name="arrow-left" size={20} color="#0F172A" />
//         </TouchableOpacity>
//       ),
//       headerRight: () => (
//         <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//           <TouchableOpacity
//             onPress={() => {
//               if (derivedOtherId) dispatch(fetchAdminHistory(derivedOtherId));
//             }}
//             style={{ paddingHorizontal: 8 }}
//           >
//             <Icon name="refresh-cw" size={18} color="#0F172A" />
//           </TouchableOpacity>

//           <Avatar
//             uri={participant?.profileUrl}
//             name={participant?.name}
//             size={36}
//           />
//         </View>
//       ),
//       headerStyle: {
//         backgroundColor: '#fff',
//         borderBottomWidth: 1,
//         borderBottomColor: '#F1F5F9',
//       },
//     });
//   }, [navigation, participant, derivedOtherId, dispatch]);

//   // send text message
//   const [text, setText] = useState('');
//   const onSend = useCallback(() => {
//     const trimmed = (text || '').trim();
//     if (!trimmed || !derivedOtherId) return;
//     const clientId = `c_${Date.now()}`;
//     dispatch(
//       sendAdminMessage({
//         chatRoomId: derivedOtherId,
//         receiverId: derivedOtherId,
//         content: trimmed,
//         messageType: 'TEXT',
//         clientId,
//       }),
//     );
//     setText('');
//   }, [text, dispatch, derivedOtherId]);

//   // pull-to-refresh handler
//   const onRefresh = useCallback(() => {
//     if (!derivedOtherId) return;
//     dispatch(fetchAdminHistory(derivedOtherId));
//   }, [derivedOtherId, dispatch]);

//   // ------------- file picker helpers -------------
//   const requestAndroidReadPerm = useCallback(async () => {
//     if (Platform.OS !== 'android') return true;

//     try {
//       const sdk = Platform.constants ? Platform.constants.Version : null;
//       // For RN Platform.constants may be undefined on older RN - we'll attempt permission anyway
//       // If SDK >= 33, ask READ_MEDIA_IMAGES (used for images) and fallback to READ_EXTERNAL_STORAGE
//       const permissionsToRequest = [];
//       // add broad storage read for older devices
//       permissionsToRequest.push(
//         PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
//       );

//       // Android 13+ constants may require READ_MEDIA_IMAGES, but PermissionsAndroid supports arbitrary strings too
//       permissionsToRequest.push('android.permission.READ_MEDIA_IMAGES');

//       const granted = await PermissionsAndroid.requestMultiple(
//         permissionsToRequest,
//       );

//       const ok = Object.values(granted).every(
//         v => v === PermissionsAndroid.RESULTS.GRANTED,
//       );
//       console.log('[CHAT] android read permissions:', granted, 'ok=', ok);
//       return ok;
//     } catch (err) {
//       console.warn('[CHAT] requestAndroidReadPerm error', err);
//       return false;
//     }
//   }, []);

//   const onPickAndSendFile = useCallback(async () => {
//     console.log('[CHAT] onPickAndSendFile pressed');
//     if (!derivedOtherId) {
//       Alert.alert('Error', 'No chat participant selected.');
//       return;
//     }

//     // Request Android permission if needed
//     if (Platform.OS === 'android') {
//       const ok = await requestAndroidReadPerm();
//       if (!ok) {
//         Alert.alert('Permission', 'Storage permission required to pick files.');
//         return;
//       }
//     }

//     try {
//       if (!DocumentPicker || typeof DocumentPicker.pick !== 'function') {
//         console.error(
//           '[CHAT] DocumentPicker module missing or API changed',
//           DocumentPicker,
//         );
//         Alert.alert(
//           'File picker module not available',
//           'Make sure you installed and rebuilt the app with the native document picker package.',
//         );
//         return;
//       }

//       // Open picker (allow images + any file). returns array on some implementations.
//       const res = await DocumentPicker.pick({
//         // you can set allowed types here if you want
//         allowMultiSelection: false,
//       });

//       const picked = Array.isArray(res) ? res[0] : res;
//       console.log('[CHAT] picked:', picked);

//       // normalize common fields
//       const uri = picked?.uri || picked?.fileCopyUri || picked?.fileUri;
//       const name = picked?.name || picked?.fileName || `file_${Date.now()}`;
//       const mime =
//         picked?.type ||
//         picked?.mimeType ||
//         picked?.mime ||
//         'application/octet-stream';
//       const size = picked?.size || picked?.fileSize || 0;

//       if (!uri) {
//         console.error('[CHAT] picked object missing uri', picked);
//         Alert.alert(
//           'File Error',
//           'Picked file does not contain uri. See console logs.',
//         );
//         return;
//       }

//       const rnFile = { uri, name, type: mime };
//       console.log('[CHAT] prepared RN file:', rnFile, 'size=', size);

//       // determine messageType
//       const messageType = (mime || '').startsWith('image/') ? 'IMAGE' : 'FILE';
//       const clientId = `c_${Date.now()}`;

//       // dispatch to saga (saga will append FormData)
//       dispatch(
//         sendAdminMessage({
//           chatRoomId: derivedOtherId,
//           receiverId: derivedOtherId,
//           content: null,
//           messageType,
//           file: rnFile,
//           clientId,
//         }),
//       );
//     } catch (err) {
//       console.error('[CHAT] pick/send error', err);
//       // Some pickers throw special cancel error
//       const isCancel =
//         (DocumentPicker &&
//           DocumentPicker.isCancel &&
//           DocumentPicker.isCancel(err)) ||
//         (err &&
//           (err.code === 'DOCUMENT_PICKER_CANCELED' ||
//             err.code === 'USER_CANCELLED' ||
//             err.message === 'User cancelled'));
//       if (isCancel) {
//         console.log('[CHAT] user cancelled picker');
//         return;
//       }
//       Alert.alert(
//         'File Error',
//         err?.message || 'Failed to pick/send file. See console logs.',
//       );
//     }
//   }, [derivedOtherId, dispatch, requestAndroidReadPerm]);

//   // render message
//   const renderItem = ({ item }) => {
//     const mine =
//       String(item.senderId) === String(myEmployeeId) ||
//       !!item.temp ||
//       !!item.clientId;
//     return <MessageBubble msg={item} mine={mine} />;
//   };

//   const keyExtractor = item =>
//     item.clientId ? `c_${item.clientId}` : `m_${item.id}`;

//   const flatData = history ? [...history].slice().reverse() : [];

//   return (
//     <SafeAreaView style={styles.screen}>
//       <KeyboardAvoidingView
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         style={{ flex: 1 }}
//         keyboardVerticalOffset={150}
//       >
//         <View style={styles.messagesContainer}>
//           {!derivedOtherId || (historyMeta.loading && flatData.length === 0) ? (
//             <ActivityIndicator style={{ marginTop: 30 }} color="#2563EB" />
//           ) : (
//             <FlatList
//               inverted
//               data={flatData}
//               keyExtractor={keyExtractor}
//               renderItem={renderItem}
//               contentContainerStyle={{
//                 paddingVertical: 12,
//                 paddingHorizontal: 16,
//               }}
//               refreshControl={
//                 <RefreshControl
//                   refreshing={!!historyMeta.loading}
//                   onRefresh={onRefresh}
//                   tintColor="#2563EB"
//                 />
//               }
//               ListEmptyComponent={() => (
//                 <View style={styles.emptyContainer}>
//                   <Text style={styles.emptyTitle}>No messages yet</Text>
//                   <Text style={styles.emptySub}>Say hi 👋</Text>
//                 </View>
//               )}
//             />
//           )}
//         </View>

//         <View style={styles.inputWrap}>
//           <TouchableOpacity
//             style={{ marginRight: 8, padding: 8 }}
//             onPress={onPickAndSendFile}
//             accessible
//             accessibilityLabel="Attach file"
//           >
//             <Icon name="paperclip" size={22} color="#0F172A" />
//           </TouchableOpacity>

//           <View style={styles.inputInner}>
//             <TextInput
//               placeholder="Type a message..."
//               placeholderTextColor="#94A3B8"
//               value={text}
//               onChangeText={setText}
//               style={styles.input}
//               multiline
//               editable={!!derivedOtherId}
//             />
//           </View>

//           <TouchableOpacity
//             onPress={onSend}
//             style={[styles.sendBtn, !derivedOtherId ? { opacity: 0.5 } : null]}
//             disabled={sending || !derivedOtherId}
//           >
//             {sending ? (
//               <ActivityIndicator size="small" color="#fff" />
//             ) : (
//               <Icon name="send" size={18} color="#fff" />
//             )}
//           </TouchableOpacity>
//         </View>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   screen: { flex: 1, backgroundColor: '#F8FAFC' },
//   messagesContainer: { flex: 1, marginTop: 0, backgroundColor: '#F8FAFC' },
//   emptyContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   emptyTitle: { fontSize: 18, fontWeight: '700', color: '#94A3B8' },
//   emptySub: { color: '#94A3B8', marginTop: 8 },
//   inputWrap: {
//     flexDirection: 'row',
//     padding: 12,
//     backgroundColor: '#fff',
//     alignItems: 'flex-end',
//     borderTopWidth: 1,
//     borderTopColor: '#F1F5F9',
//   },
//   inputInner: {
//     flex: 1,
//     borderRadius: 28,
//     borderWidth: 1,
//     borderColor: '#E6EEF8',
//     backgroundColor: '#F8FAFC',
//     paddingHorizontal: 14,
//     paddingVertical: 8,
//     marginRight: 8,
//     minHeight: 44,
//     maxHeight: 140,
//   },
//   input: { fontSize: 15, color: '#0F172A', padding: 0, margin: 0 },
//   sendBtn: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     backgroundColor: '#2563EB',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });

// /src/modules/admin/messages/screens/AdminMessageRoomScreen.js
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  TextInput,
  Alert,
  RefreshControl,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Feather';
import { SafeAreaView } from 'react-native-safe-area-context';

import Avatar from '../components/Avatar';
import MessageBubble from '../components/MessageBubble';

import {
  fetchAdminHistory,
  sendAdminMessage,
  setActiveAdminRoom,
  markMessagesAsRead,
} from '../store/actions';

import {
  selectAdminHistory,
  selectAdminHistoryMeta,
  selectAdminSending,
  selectMessagesState,
  selectAdminRooms,
} from '../store/selectors';

// use your working util
import { pickSingleDoc } from '../../../../utils/filePickers';

/* helper to derive other id from chatRoomId */
function getOtherFromRoomId(chatRoomId, myEmployeeId) {
  if (!chatRoomId) return null;
  if (chatRoomId.includes('_NEW')) {
    const parts = chatRoomId.split('_');
    if (parts.length >= 2) return parts[0];
    return null;
  }
  const parts = chatRoomId.split('_');
  if (parts.length !== 2) return null;
  const [a, b] = parts;
  if (!myEmployeeId) return a === b ? a : a;
  if (String(a) === String(myEmployeeId)) return b;
  if (String(b) === String(myEmployeeId)) return a;
  return a;
}

export default function AdminMessageRoomScreen({ route, navigation }) {
  const dispatch = useDispatch();

  const { participant: participantParam, chatRoomId: routeChatRoomId } =
    route.params || {};

  const myEmployeeId = useSelector(s => s?.auth?.user?.employeeId) || null;
  const messagesState = useSelector(selectMessagesState);
  const rooms = useSelector(selectAdminRooms) || [];

  const derivedOtherId = useMemo(() => {
    if (participantParam && participantParam.employeeId)
      return participantParam.employeeId;

    if (routeChatRoomId) {
      const other = getOtherFromRoomId(routeChatRoomId, myEmployeeId);
      if (other) return other;
      if (!routeChatRoomId.includes('_')) return routeChatRoomId;
    }

    return messagesState?.activeRoomId || null;
  }, [participantParam, routeChatRoomId, myEmployeeId, messagesState]);

  const participant = useMemo(() => {
    if (participantParam && participantParam.employeeId)
      return participantParam;

    const found = rooms.find(r => {
      const p1 = (r.participant1Details || {}).employeeId;
      const p2 = (r.participant2Details || {}).employeeId;
      return p1 === derivedOtherId || p2 === derivedOtherId;
    });

    if (found) {
      const p1 = found.participant1Details || {};
      const p2 = found.participant2Details || {};
      const chosen = p1.employeeId === derivedOtherId ? p1 : p2;
      return {
        employeeId: chosen.employeeId,
        name: chosen.name,
        profileUrl: chosen.profileUrl || chosen.profilePictureUrl || null,
        designation: chosen.designation,
        department: chosen.department,
      };
    }

    if (derivedOtherId) {
      return {
        employeeId: derivedOtherId,
        name: derivedOtherId,
        profileUrl: null,
      };
    }

    return null;
  }, [participantParam, rooms, derivedOtherId]);

  // selectors for history
  const history =
    useSelector(state => selectAdminHistory(state, derivedOtherId)) || [];
  const historyMeta =
    useSelector(state => selectAdminHistoryMeta(state, derivedOtherId)) || {};
  const sending = useSelector(selectAdminSending);

  // set active room + fetch history when derivedOtherId appears
  useEffect(() => {
    if (!derivedOtherId) return;
    dispatch(setActiveAdminRoom(derivedOtherId));
    dispatch(fetchAdminHistory(derivedOtherId));
  }, [derivedOtherId, dispatch]);

  // header: back button + avatar + refresh icon
  useEffect(() => {
    navigation.setOptions({
      headerTitle: participant?.name || 'Chat',
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            // mark read before going back
            if (derivedOtherId) dispatch(markMessagesAsRead(derivedOtherId));
            navigation.goBack();
          }}
          style={{ paddingHorizontal: 12 }}
        >
          <Icon name="arrow-left" size={20} color="#0F172A" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() => {
              // manual refresh from header
              if (derivedOtherId) dispatch(fetchAdminHistory(derivedOtherId));
            }}
            style={{ paddingHorizontal: 8 }}
          >
            <Icon name="refresh-cw" size={18} color="#0F172A" />
          </TouchableOpacity>

          <Avatar
            uri={participant?.profileUrl}
            name={participant?.name}
            size={36}
          />
        </View>
      ),
      headerStyle: {
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
      },
    });
  }, [navigation, participant, derivedOtherId, dispatch]);

  // send message (text)
  const [text, setText] = useState('');
  const onSend = useCallback(() => {
    const trimmed = (text || '').trim();
    if (!trimmed || !derivedOtherId) return;
    const clientId = `c_${Date.now()}`;
    dispatch(
      sendAdminMessage({
        chatRoomId: derivedOtherId,
        receiverId: derivedOtherId,
        content: trimmed,
        messageType: 'TEXT',
        clientId,
      }),
    );
    setText('');
  }, [text, dispatch, derivedOtherId]);

  // file picker + send
  const pickAndSendFile = useCallback(async () => {
    if (!derivedOtherId) {
      Alert.alert('Select chat first');
      return;
    }

    try {
      // pick file (uses your working util)
      const file = await pickSingleDoc({
        type: ['*/*'], // allow all - change to ['image/*'] if you want image-only
        copyTo:
          Platform.OS === 'android' ? 'cachesDirectory' : 'cachesDirectory',
      });

      if (!file) {
        console.log('User cancelled or no file returned');
        return;
      }

      // file shape: { uri, name, type }
      console.log('Picked file:', file);

      const messageType = (file.type || '').startsWith('image/')
        ? 'IMAGE'
        : 'FILE';

      const clientId = `c_${Date.now()}`;

      // dispatch optimistic send (sagas will append file in FormData)
      dispatch(
        sendAdminMessage({
          chatRoomId: derivedOtherId,
          receiverId: derivedOtherId,
          content: null,
          messageType,
          file, // { uri, name, type }
          clientId,
        }),
      );
    } catch (err) {
      console.warn('pickAndSendFile error', err);
      Alert.alert('File picker error', err?.message || String(err));
    }
  }, [derivedOtherId, dispatch]);

  // pull-to-refresh handler
  const onRefresh = useCallback(() => {
    if (!derivedOtherId) return;
    dispatch(fetchAdminHistory(derivedOtherId));
  }, [derivedOtherId, dispatch]);

  // render message
  const renderItem = ({ item }) => {
    const mine =
      String(item.senderId) === String(myEmployeeId) ||
      !!item.temp ||
      !!item.clientId;
    return <MessageBubble msg={item} mine={mine} />;
  };

  const keyExtractor = item =>
    item.clientId ? `c_${item.clientId}` : `m_${item.id}`;

  const flatData = history ? [...history].slice().reverse() : [];

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={150}
      >
        <View style={styles.messagesContainer}>
          {!derivedOtherId || (historyMeta.loading && flatData.length === 0) ? (
            <ActivityIndicator style={{ marginTop: 30 }} color="#2563EB" />
          ) : (
            <FlatList
              inverted
              data={flatData}
              keyExtractor={keyExtractor}
              renderItem={renderItem}
              contentContainerStyle={{
                paddingVertical: 12,
                paddingHorizontal: 16,
              }}
              refreshControl={
                <RefreshControl
                  refreshing={!!historyMeta.loading}
                  onRefresh={onRefresh}
                  tintColor="#2563EB"
                />
              }
              ListEmptyComponent={() => (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyTitle}>No messages yet</Text>
                  <Text style={styles.emptySub}>Say hi 👋</Text>
                </View>
              )}
            />
          )}
        </View>

        <View style={styles.inputWrap}>
          <TouchableOpacity
            onPress={pickAndSendFile}
            style={styles.attachBtn}
            accessibilityLabel="Attach file"
          >
            <Icon name="paperclip" size={20} color="#0F172A" />
          </TouchableOpacity>

          <View style={styles.inputInner}>
            <TextInput
              placeholder="Type a message..."
              placeholderTextColor="#94A3B8"
              value={text}
              onChangeText={setText}
              style={styles.input}
              multiline
              editable={!!derivedOtherId}
            />
          </View>

          <TouchableOpacity
            onPress={onSend}
            style={[styles.sendBtn, !derivedOtherId ? { opacity: 0.5 } : null]}
            disabled={sending || !derivedOtherId}
          >
            {sending ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Icon name="send" size={18} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F8FAFC' },
  topBar: {
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  topLeft: { flexDirection: 'row', alignItems: 'center' },
  participantName: { fontWeight: '800', fontSize: 16 },
  participantMeta: { fontSize: 12, color: '#64748B', marginTop: 2 },
  topActions: { flexDirection: 'row', alignItems: 'center' },
  iconAction: { padding: 8, marginLeft: 8, borderRadius: 8 },
  divider: { height: 1, backgroundColor: '#F1F5F9' },
  messagesContainer: { flex: 1, marginTop: 0, backgroundColor: '#F8FAFC' },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#94A3B8' },
  emptySub: { color: '#94A3B8', marginTop: 8 },

  inputWrap: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#fff',
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  attachBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  inputInner: {
    flex: 1,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#E6EEF8',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
    minHeight: 44,
    maxHeight: 140,
  },
  input: { fontSize: 15, color: '#0F172A', padding: 0, margin: 0 },
  sendBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
