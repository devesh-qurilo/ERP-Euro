// src/modules/employee/notifications/components/NotificationItem.js
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

const typeIcon = t => {
  switch (t) {
    case 'EMERGENCY_CONTACT':
      return '📇';
    case 'APPRECIATION':
      return '🏅';
    case 'LEAVE_QUOTA':
      return '🗓️';
    default:
      return '🔔';
  }
};
const timeAgo = iso => {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return `${Math.floor(diff)}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(iso).toLocaleString();
};

export default function NotificationItem({ item, onPress }) {
  const unread = !item.readFlag;

  return (
    <Pressable
      onPress={() => onPress?.(item)}
      style={[styles.row, unread && styles.unread]}
    >
      <Text style={styles.icon} numberOfLines={1}>
        {typeIcon(item.type)}
      </Text>

      {/* IMPORTANT: width:0 + flexGrow and minWidth:0 allow ellipsis inside flex rows */}
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text
            style={[styles.title, unread && styles.titleUnread]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.title || 'Notification'}
          </Text>
          <Text style={styles.time} numberOfLines={1} ellipsizeMode="clip">
            {timeAgo(item.createdAt)}
          </Text>
        </View>

        <Text style={styles.msg} numberOfLines={2} ellipsizeMode="tail">
          {item.message || ''}
        </Text>

        {unread ? <View style={styles.dot} /> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
    overflow: 'hidden', // prevents child overflow on Android
  },
  unread: {
    borderWidth: 1,
    borderColor: '#dbeafe',
    backgroundColor: '#f8fbff',
  },
  icon: { fontSize: 20, marginRight: 10 },
  content: {
    flexDirection: 'column',
    flexGrow: 1,
    width: 0, // 🔑 let text measure against remaining width
    minWidth: 0, // 🔑 allow Text to shrink/ellipsis
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 8,
  },
  title: { fontWeight: '800', color: '#1f2328', flexShrink: 1, minWidth: 0 },
  titleUnread: { color: '#0f172a' },
  time: { color: '#6b7280', fontSize: 12, marginLeft: 8, flexShrink: 0 },
  msg: { color: '#374151', marginTop: 4, lineHeight: 18, minWidth: 0 },
  dot: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2563eb',
  },
});
