// src/modules/employee/messages/screens/ChatRoomScreen.js
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Pressable,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchChatHistory,
  setActivePeer,
  connectChatWS,
  disconnectChatWS,
  sendChatMessage,
} from '../store/actions';
import {
  selectActivePeerId,
  selectChatHistory,
  selectChatHistoryLoading,
  selectChatSending,
} from '../store/selectors';

const MessageBubble = ({ meId, m }) => {
  const isMine = m.senderId === meId;
  return (
    <View
      style={[
        styles.bubbleWrap,
        isMine ? styles.bubbleRight : styles.bubbleLeft,
      ]}
    >
      {!isMine && (
        <Image
          source={{ uri: m.senderDetails?.profileUrl }}
          style={styles.avatar}
        />
      )}
      <View style={[styles.bubble, isMine ? styles.mine : styles.theirs]}>
        {m.content ? <Text style={styles.msgTxt}>{m.content}</Text> : null}
        <Text style={styles.timeTxt}>
          {new Date(m.createdAt).toLocaleTimeString()}
        </Text>
      </View>
    </View>
  );
};

export default function ChatRoomScreen({ route, navigation }) {
  // Expect peer info passed from rooms list
  const peerIdFromNav = route?.params?.peerId; // receiverId (e.g., "EMP-008")
  const myEmployeeId = route?.params?.myEmployeeId; // OPTIONAL if you pass it

  const dispatch = useDispatch();
  const activePeerId = useSelector(selectActivePeerId);
  const history = useSelector(selectChatHistory(activePeerId));
  const loading = useSelector(selectChatHistoryLoading(activePeerId));
  const sending = useSelector(selectChatSending);

  const [text, setText] = useState('');
  const listRef = useRef(null);
  const [didSendAtLeastOnce, setDidSendAtLeastOnce] = useState(false);

  // Mount: set active peer, connect “WS”, fetch history
  useEffect(() => {
    const peerId = peerIdFromNav;
    if (!peerId) return;
    dispatch(setActivePeer(peerId));
    dispatch(connectChatWS());
    dispatch(fetchChatHistory(peerId));

    return () => {
      dispatch(disconnectChatWS());
      // do not clear activePeer to keep last context if you navigate back and forth rapidly
    };
  }, [dispatch, peerIdFromNav]);

  // After sending completes, clear input
  useEffect(() => {
    if (didSendAtLeastOnce && !sending) {
      setText('');
      setDidSendAtLeastOnce(false);
    }
  }, [sending, didSendAtLeastOnce]);

  // Auto-scroll to bottom when history grows
  useEffect(() => {
    if (listRef.current && history?.length) {
      setTimeout(() => listRef.current?.scrollToEnd?.({ animated: true }), 0);
    }
  }, [history?.length]);

  const canSend = useMemo(
    () => Boolean(activePeerId && text.trim().length && !sending),
    [activePeerId, text, sending],
  );

  const onSend = () => {
    if (!canSend) return;
    const payload = {
      receiverId: activePeerId,
      content: text.trim(),
      messageType: 'TEXT',
    };
    // console.log('[CHAT] sendChatMessage payload ->', payload);
    dispatch(sendChatMessage(payload));
    setDidSendAtLeastOnce(true);
  };

  const renderItem = ({ item }) => (
    <MessageBubble meId={myEmployeeId} m={item} />
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#fff' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View style={styles.header}>
        {/* <Pressable onPress={() => navigation.goBack()} style={{ padding: 6 }}>
          <Text style={{ fontSize: 18 }}>←</Text>
        </Pressable> */}
        <Text style={styles.title} numberOfLines={1}>
          {activePeerId || 'Chat'}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Messages */}
      <FlatList
        ref={listRef}
        data={history}
        keyExtractor={m => String(m.id)}
        renderItem={renderItem}
        contentContainerStyle={{ paddingVertical: 8, paddingHorizontal: 10 }}
        ListEmptyComponent={
          <Text style={styles.empty}>
            {loading ? 'Loading…' : 'Say hello 👋'}
          </Text>
        }
        onContentSizeChange={() =>
          listRef.current?.scrollToEnd?.({ animated: true })
        }
      />

      {/* Composer */}
      <View style={styles.composer}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="Type a message…"
          placeholderTextColor="#9ca3af"
          autoCapitalize="sentences"
          onSubmitEditing={onSend}
          returnKeyType="send"
        />
        <Pressable
          onPress={onSend}
          disabled={!canSend}
          style={[styles.sendBtn, !canSend && { opacity: 0.6 }]}
        >
          <Text style={styles.sendTxt}>{sending ? '...' : 'Send'}</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 52,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    backgroundColor: '#fff',
  },
  title: { flex: 1, textAlign: 'center', fontWeight: '900', color: '#111827' },
  empty: { textAlign: 'center', color: '#6b7280', marginTop: 10 },

  bubbleWrap: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: 6,
  },
  bubbleLeft: { justifyContent: 'flex-start' },
  bubbleRight: { justifyContent: 'flex-end', alignSelf: 'flex-end' },

  bubble: {
    maxWidth: '78%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  mine: { backgroundColor: '#dcfce7', marginLeft: 8 },
  theirs: { backgroundColor: '#f3f4f6', marginLeft: 8 },

  msgTxt: { color: '#111827' },
  timeTxt: { color: '#6b7280', fontSize: 11, marginTop: 4 },

  avatar: { width: 28, height: 28, borderRadius: 14 },

  composer: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    flexDirection: 'row',
    padding: 8,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#111827',
    backgroundColor: '#fff',
    marginRight: 8,
  },
  sendBtn: {
    backgroundColor: '#1d4ed8',
    borderRadius: 18,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendTxt: { color: '#fff', fontWeight: '900' },
});
