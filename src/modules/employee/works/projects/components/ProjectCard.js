import React from 'react';
import { View, Text, Pressable, StyleSheet, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const AvatarStack = ({ members = [] }) => {
  const shown = members.slice(0, 4);
  const extra = Math.max(members.length - 4, 0);
  return (
    <View style={{ flexDirection: 'row' }}>
      {shown.map((m, i) => (
        <Image
          key={m.employeeId || i}
          source={
            m.profileUrl
              ? { uri: m.profileUrl }
              : require('../../../../../assets/icons/awards.png')
          }
          style={[styles.av, { marginLeft: i === 0 ? 0 : -10 }]}
        />
      ))}
      {extra > 0 && (
        <View
          style={[
            styles.av,
            styles.extra,
            { marginLeft: shown.length ? -10 : 0 },
          ]}
        >
          <Text style={{ color: '#111827', fontWeight: '700', fontSize: 12 }}>
            +{extra}
          </Text>
        </View>
      )}
    </View>
  );
};

export default function ProjectCard({ item, pinned, onTogglePin }) {
  return (
    <Pressable style={styles.card}>
      <View style={styles.head}>
        <Text style={styles.code}>#{item.shortCode || item.id}</Text>
        <Pressable onPress={() => onTogglePin(item.id)} hitSlop={8}>
          <Ionicons
            name={pinned ? 'star' : 'star-outline'}
            size={18}
            color={pinned ? '#EAB308' : '#64748B'}
          />
        </Pressable>
      </View>
      <Text numberOfLines={1} style={styles.title}>
        {item.name}
      </Text>
      <Text numberOfLines={2} style={styles.sum}>
        {item.summary || '—'}
      </Text>
      <View style={styles.row}>
        <Text style={styles.meta}>
          Client: <Text style={styles.bold}>{item?.client?.name || '—'}</Text>
        </Text>
        <Text style={styles.meta}>
          Cat: <Text style={styles.bold}>{item?.category || '—'}</Text>
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.meta}>
          Start: <Text style={styles.bold}>{item.startDate || '—'}</Text>
        </Text>
        <Text style={styles.meta}>
          Due:{' '}
          <Text style={styles.bold}>
            {item.noDeadline ? 'No deadline' : item.deadline || '—'}
          </Text>
        </Text>
      </View>
      <View style={{ marginTop: 10 }}>
        <AvatarStack members={item.assignedEmployees || []} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 260,
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  head: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  code: { fontWeight: '800', color: '#1F2937', letterSpacing: 0.2 },
  title: { marginTop: 4, fontWeight: '700', fontSize: 16, color: '#0F172A' },
  sum: { marginTop: 4, color: '#475569' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  meta: { color: '#334155' },
  bold: { fontWeight: '700', color: '#0F172A' },
  av: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: '#E5E7EB',
  },
  extra: { alignItems: 'center', justifyContent: 'center' },
});
