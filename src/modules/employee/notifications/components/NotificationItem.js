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
      <Text style={styles.icon}>{typeIcon(item.type)}</Text>
      <View style={{ flex: 1 }}>
        <View style={styles.titleRow}>
          <Text
            style={[styles.title, unread && styles.titleUnread]}
            numberOfLines={1}
          >
            {item.title}
          </Text>
          <Text style={styles.time}>{timeAgo(item.createdAt)}</Text>
        </View>
        <Text style={styles.msg} numberOfLines={2}>
          {item.message}
        </Text>
        {unread ? <View style={styles.dot} /> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 10,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  unread: {
    borderWidth: 1,
    borderColor: '#dbeafe',
    backgroundColor: '#f8fbff',
  },
  icon: { fontSize: 20, marginTop: 2 },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: { fontWeight: '800', color: '#1f2328', marginRight: 8 },
  titleUnread: { color: '#0f172a' },
  time: { color: '#6b7280', fontSize: 12 },
  msg: { color: '#374151', marginTop: 4 },
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
