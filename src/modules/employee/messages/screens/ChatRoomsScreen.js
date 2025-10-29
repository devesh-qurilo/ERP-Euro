// ChatRoomsScreen.js
import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import {
  selectChatRooms,
  selectChatRoomsLoading,
  selectChatRoomsError,
} from '../store/selectors';

import {
  fetchChatRooms, // <- action to GET /api/chat/rooms
  setActivePeer, // <- action to set current peer id in store
} from '../store/actions';

const RoomCard = ({ item, onPress }) => {
  // Derive “other” participant & avatar
  const you = item?.participant2Details?.employeeId; // optional, depends on backend
  const p =
    item?.participant1Details?.employeeId === you
      ? item?.participant2Details
      : item?.participant1Details || item?.participant2Details;

  const name = p?.name || p?.employeeId || 'Chat';
  const avatar = p?.profileUrl;

  return (
    <Pressable onPress={onPress} style={styles.card}>
      {avatar ? (
        <Image source={{ uri: avatar }} style={styles.avatar} />
      ) : (
        <View style={[styles.avatar, styles.avatarEmpty]}>
          <Text>👤</Text>
        </View>
      )}
      <View style={{ flex: 1 }}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        <Text style={styles.lastMsg} numberOfLines={1}>
          {item?.lastMessage?.content || 'No messages yet'}
        </Text>
      </View>
      {!!item?.unreadCount && (
        <View style={styles.unread}>
          <Text style={styles.unreadTxt}>{item.unreadCount}</Text>
        </View>
      )}
    </Pressable>
  );
};

export default function ChatRoomsScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const rooms = useSelector(selectChatRooms);
  const loading = useSelector(selectChatRoomsLoading);
  const error = useSelector(selectChatRoomsError);

  useEffect(() => {
    dispatch(fetchChatRooms());
  }, [dispatch]);

  return (
    <View style={styles.wrap}>
      {/* <Text style={styles.h1}>Messages</Text> */}

      {loading && <ActivityIndicator style={{ marginTop: 12 }} />}

      {!!error && (
        <Text style={styles.err}>Failed to load chats: {String(error)}</Text>
      )}

      <FlatList
        data={rooms}
        keyExtractor={(it, i) => String(it.id || i)}
        contentContainerStyle={{ paddingVertical: 8 }}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        renderItem={({ item }) => (
          <RoomCard
            item={item}
            onPress={() => {
              // figure out peer id (the other participant)
              const me = item?.participant2Details?.employeeId;
              const p1 = item?.participant1Details?.employeeId;
              const p2 = item?.participant2Details?.employeeId;

              const peerId = me && p1 === me ? p2 : p1 || p2 || item?.id;

              dispatch(setActivePeer(peerId));
              navigation.navigate('ChatRoomScreen', {
                peerId,
                roomId: item?.id,
                peerDetails:
                  p1 === peerId
                    ? item?.participant1Details
                    : item?.participant2Details,
              });
            }}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: '#fff', padding: 12 },
  h1: { fontSize: 22, fontWeight: '900', color: '#0b0b0c' },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  avatar: { width: 44, height: 44, borderRadius: 22 },
  avatarEmpty: {
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: { fontWeight: '900', color: '#111827' },
  lastMsg: { color: '#6b7280', marginTop: 2, maxWidth: '92%' },
  unread: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    paddingHorizontal: 6,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadTxt: { color: '#fff', fontWeight: '900', fontSize: 12 },
  err: { color: '#b00020', marginTop: 10 },
});
