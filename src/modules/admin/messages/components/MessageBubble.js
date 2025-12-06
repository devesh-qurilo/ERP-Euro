// MessageBubble.js
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

export default function MessageBubble({ msg = {}, mine = false }) {
  const isFile =
    msg.messageType && String(msg.messageType).toUpperCase() !== 'TEXT';
  const time = msg.createdAt ? new Date(msg.createdAt) : null;
  const timeStr = time
    ? time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';

  if (isFile) {
    return (
      <View style={[styles.row, mine ? styles.rowRight : styles.rowLeft]}>
        <TouchableOpacity
          style={[
            styles.fileCard,
            mine ? styles.fileCardMine : styles.fileCardTheirs,
          ]}
          onPress={() => {
            const url = msg.fileAttachment?.fileUrl;
            if (url)
              Linking.openURL(url).catch(() => Alert.alert('Cannot open file'));
            else Alert.alert('No file URL');
          }}
        >
          <Icon name="file" size={18} />
          <View style={{ marginLeft: 10, flex: 1 }}>
            <Text style={styles.fileName} numberOfLines={1}>
              {msg.fileAttachment?.fileName || 'Attachment'}
            </Text>
            <Text style={styles.fileMeta}>
              {msg.fileAttachment?.fileType || ''}
            </Text>
          </View>
          <Text style={styles.time}>{timeStr}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.row, mine ? styles.rowRight : styles.rowLeft]}>
      <View
        style={[styles.bubble, mine ? styles.bubbleMine : styles.bubbleTheirs]}
      >
        <Text style={[styles.text, mine && styles.textMine]}>
          {msg.content}
        </Text>
        <View style={styles.footer}>
          <Text style={styles.time}>{timeStr}</Text>
          {mine && <Text style={styles.status}>{msg.status || ''}</Text>}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { marginVertical: 6, flexDirection: 'row', alignItems: 'flex-end' },
  rowLeft: { justifyContent: 'flex-start' },
  rowRight: { justifyContent: 'flex-end' },
  bubble: {
    maxWidth: '78%',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E6EEF8',
    backgroundColor: '#fff',
  },
  bubbleMine: { backgroundColor: '#2563EB', borderColor: '#2563EB' },
  bubbleTheirs: { backgroundColor: '#fff' },
  text: { color: '#0F172A', fontSize: 14 },
  textMine: { color: '#fff' },
  footer: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  time: { fontSize: 11, color: '#94A3B8', marginLeft: 8 },
  status: { fontSize: 11, marginLeft: 6, color: '#94A3B8' },
  fileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
  },
  fileCardMine: { backgroundColor: '#1E40AF', borderRadius: 10, color: '#fff' },
  fileCardTheirs: { backgroundColor: '#fff' },
  fileName: { fontWeight: '700' },
  fileMeta: { color: '#64748B', fontSize: 12 },
});
