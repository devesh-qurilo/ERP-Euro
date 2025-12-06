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
} from '../store/actions';

import {
  selectAdminHistory,
  selectAdminHistoryMeta,
  selectAdminSending,
  selectMessagesState,
  selectAdminRooms,
  //   selectMessagesState,
} from '../store/selectors';

/**
 * Helper: given chatRoomId like "EMP-003_EMP-009" and myEmployeeId,
 * return the other participant's employeeId. If one side equals myEmployeeId,
 * return the other. If neither equals (or parsing fails), return null.
 */
function getOtherFromRoomId(chatRoomId, myEmployeeId) {
  if (!chatRoomId) return null;
  // if chatRoomId contains _NEW or similar: handle simple case "EMP-123_NEW"
  if (chatRoomId.includes('_NEW')) {
    const parts = chatRoomId.split('_');
    // EMP-123_NEW -> we assume EMP-123 is the other id
    if (parts.length >= 2) return parts[0];
    return null;
  }

  const parts = chatRoomId.split('_');
  if (parts.length !== 2) return null;
  const [a, b] = parts;
  if (!myEmployeeId) {
    // no my id known — default to return the one that isn't equal to a==b? fallback to a
    return a === b ? a : a;
  }
  if (String(a) === String(myEmployeeId)) return b;
  if (String(b) === String(myEmployeeId)) return a;
  // if my id not present choose the first
  return a;
}

export default function AdminMessageRoomScreen({ route, navigation }) {
  const dispatch = useDispatch();

  const { participant: participantParam, chatRoomId: routeChatRoomId } =
    route.params || {};

  const myEmployeeId = useSelector(s => s?.auth?.user?.employeeId) || null;
  const messagesState = useSelector(selectMessagesState);
  const rooms = useSelector(selectAdminRooms) || [];

  // derive otherEmployeeId robustly
  const derivedOtherId = useMemo(() => {
    // 1) if participant passed
    if (participantParam && participantParam.employeeId)
      return participantParam.employeeId;

    // 2) if chatRoomId passed and myEmployeeId known
    if (routeChatRoomId) {
      const other = getOtherFromRoomId(routeChatRoomId, myEmployeeId);
      if (other) return other;
      // if routeChatRoomId might be just an employeeId string (somewhere used)
      if (!routeChatRoomId.includes('_')) return routeChatRoomId;
    }

    // 3) fallback: use activeRoomId from messages state
    return messagesState?.activeRoomId || null;
  }, [participantParam, routeChatRoomId, myEmployeeId, messagesState]);

  // Ensure participant object exists for header: try param -> rooms lookup -> minimal fallback
  const participant = useMemo(() => {
    if (participantParam && participantParam.employeeId)
      return participantParam;

    // try find in rooms where either participant1 or participant2 matches derivedOtherId
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

    // last resort: create from derivedOtherId with minimal fields
    if (derivedOtherId) {
      return {
        employeeId: derivedOtherId,
        name: derivedOtherId,
        profileUrl: null,
      };
    }

    return null;
  }, [participantParam, rooms, derivedOtherId]);

  // use selectors for history + meta + sending
  const history =
    useSelector(state => selectAdminHistory(state, derivedOtherId)) || [];
  const historyMeta =
    useSelector(state => selectAdminHistoryMeta(state, derivedOtherId)) || {};
  const sending = useSelector(selectAdminSending);
  const devesh = useSelector(selectMessagesState);

  console.log('history dev', history, devesh);
  // when derivedOtherId becomes available, set active room and fetch history
  useEffect(() => {
    if (!derivedOtherId) return;
    dispatch(setActiveAdminRoom(derivedOtherId));
    dispatch(fetchAdminHistory(derivedOtherId));
  }, [derivedOtherId, dispatch]);

  // set header options with participant (if exists)
  useEffect(() => {
    navigation.setOptions({
      headerTitle: participant?.name || 'Chat',
      headerRight: () => (
        <Avatar
          uri={participant?.profileUrl}
          name={participant?.name}
          size={36}
        />
      ),
      headerStyle: {
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
      },
    });
  }, [navigation, participant]);

  // send message
  const [text, setText] = useState('');
  const onSend = useCallback(() => {
    const trimmed = (text || '').trim();
    if (!trimmed || !derivedOtherId) return;
    const clientId = `c_${Date.now()}`;
    dispatch(
      sendAdminMessage({
        chatRoomId: derivedOtherId, // we keep consistent with your sagas expecting otherEmployeeId
        receiverId: derivedOtherId,
        content: trimmed,
        messageType: 'TEXT',
        clientId,
      }),
    );
    setText('');
  }, [text, dispatch, derivedOtherId]);

  // render a single message
  const renderItem = ({ item }) => {
    const mine =
      String(item.senderId) === String(myEmployeeId) ||
      !!item.temp ||
      !!item.clientId;
    return <MessageBubble msg={item} mine={mine} />;
  };

  // key extractor - handle optimistic messages without id
  const keyExtractor = item =>
    item.clientId ? `c_${item.clientId}` : `m_${item.id}`;

  // prepare data for FlatList: our history stored as oldest-first; we want to invert.
  const flatData = history ? [...history].slice().reverse() : [];

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={90}
      >
        <View style={styles.topBar}>
          <View style={styles.topLeft}>
            <Avatar
              uri={participant?.profileUrl}
              name={participant?.name}
              size={44}
            />
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.participantName}>{participant?.name}</Text>
              <Text style={styles.participantMeta}>
                {participant?.designation || participant?.department || ''}
              </Text>
            </View>
          </View>

          <View style={styles.topActions}>
            <TouchableOpacity
              style={styles.iconAction}
              onPress={() => Alert.alert('Details', participant?.name || '')}
            >
              <Icon name="more-vertical" size={18} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.divider} />

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
              ListEmptyComponent={() => (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyTitle}>
                    No messages yet Admin message room screen
                  </Text>
                  <Text style={styles.emptySub}>Say hi 👋</Text>
                </View>
              )}
            />
          )}
        </View>

        <View style={styles.inputWrap}>
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
    paddingVertical: 12,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topLeft: { flexDirection: 'row', alignItems: 'center' },
  participantName: { fontWeight: '800', fontSize: 16 },
  participantMeta: { fontSize: 12, color: '#64748B', marginTop: 2 },
  topActions: { flexDirection: 'row', alignItems: 'center' },
  iconAction: { padding: 8, marginLeft: 8, borderRadius: 8 },
  divider: { height: 1, backgroundColor: '#F1F5F9' },
  messagesContainer: { flex: 1, backgroundColor: '#F8FAFC' },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
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
