// ChatRow.js
import React, { useMemo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Avatar from './Avatar';

export default function ChatRow({ room, onPress }) {
  // derive participant (other)
  const participant = useMemo(() => {
    const p1 = room.participant1Details || {};
    const p2 = room.participant2Details || {};
    if (p2.employeeId && p2.employeeId !== p1.employeeId) return p2;
    return p1;
  }, [room]);

  const last = room.lastMessage || {};
  const unreadCount = Number(room.unreadCount || 0);
  const unread = unreadCount > 0;
  const preview =
    last.messageType === 'TEXT'
      ? last.content || ''
      : `[${last.messageType || 'FILE'}]`;
  const time = last.createdAt
    ? new Date(last.createdAt)
    : room.updatedAt
    ? new Date(room.updatedAt)
    : null;
  const timeStr = time
    ? new Date().toDateString() === time.toDateString()
      ? time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : time.toLocaleDateString()
    : '';

  return (
    <Pressable
      style={[styles.row, unread ? styles.unread : styles.read]}
      onPress={() => onPress && onPress(room)}
    >
      <View
        style={[
          styles.accent,
          unread ? styles.accentUnread : styles.accentRead,
        ]}
      />
      <Avatar
        uri={participant.profileUrl || participant.profilePictureUrl}
        name={participant.name}
        size={48}
        style={{ marginHorizontal: 10 }}
      />
      <View style={styles.body}>
        <View style={styles.header}>
          <Text
            style={[styles.name, unread && styles.nameUnread]}
            numberOfLines={1}
          >
            {participant.name || participant.employeeId}
          </Text>
          <Text style={styles.time}>{timeStr}</Text>
        </View>

        <View style={styles.previewRow}>
          <Text
            style={[styles.preview, unread && styles.previewUnread]}
            numberOfLines={1}
          >
            {preview || 'No messages yet chatRow file'}
          </Text>
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{String(unreadCount)}</Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  unread: { backgroundColor: '#FBFDFF' },
  read: { backgroundColor: '#fff' },
  accent: { width: 6, height: '100%' },
  accentUnread: { backgroundColor: '#2563EB' },
  accentRead: { backgroundColor: '#F1F5F9' },
  body: { flex: 1, paddingVertical: 10, paddingRight: 12 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: { fontSize: 14, fontWeight: '700', color: '#0F172A', flex: 1 },
  nameUnread: { color: '#0B5FFF' },
  time: { fontSize: 12, color: '#94A3B8', marginLeft: 8 },
  previewRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  preview: { flex: 1, color: '#64748B' },
  previewUnread: { color: '#0F172A', fontWeight: '700' },
  badge: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
    minWidth: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { color: '#fff', fontWeight: '800', fontSize: 12 },
});
