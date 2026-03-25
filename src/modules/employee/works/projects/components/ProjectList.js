// src/modules/employee/works/projects/components/ProjectList.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  FlatList,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { togglePinProject } from '../store/actions';
import { selectPinnedIds } from '../store/selectors';

const fmtDate = d => (d ? new Date(d).toLocaleDateString() : '—');

function AssignedAvatars({ list = [] }) {
  const shown = list.slice(0, 5);
  return (
    <View style={{ flexDirection: 'row' }}>
      {shown.map((e, idx) => (
        <View
          key={e.employeeId || idx}
          style={[styles.avatarWrap, { marginLeft: idx === 0 ? 0 : -10 }]}
        >
          {e.profileUrl ? (
            <Image source={{ uri: e.profileUrl }} style={styles.avatar} />
          ) : (
            <View
              style={[
                styles.avatar,
                {
                  backgroundColor: '#0744bfff',
                  alignItems: 'center',
                  justifyContent: 'center',
                },
              ]}
            >
              <Text>👤</Text>
            </View>
          )}
        </View>
      ))}
      {list.length > 5 && (
        <View style={[styles.avatar, styles.more]}>
          <Text style={{ fontSize: 12, fontWeight: '900' }}>
            +{list.length - 5}
          </Text>
        </View>
      )}
    </View>
  );
}

function ProjectCard({ item, pinned, onPinToggle }) {
  const status = item.projectStatus || 'OPEN';
  const progress = item.progressPercent ?? null;

  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <Text style={styles.name} numberOfLines={1}>
          {item.name}
        </Text>
        <Pressable
          onPress={() => onPinToggle(item.id)}
          style={[styles.pinBtn, pinned && styles.pinActive]}
        >
          <Text style={[styles.pinTxt, pinned && styles.pinTxtActive]}>
            {pinned ? '📌 Pinned' : '📍 Pin'}
          </Text>
        </Pressable>
      </View>

      <Text style={styles.meta} numberOfLines={1}>
        {item.shortCode} • {item.category || '—'} • Client:{' '}
        {item.client?.name || '—'}
      </Text>

      <View style={styles.rows}>
        <View style={styles.row}>
          <Text style={styles.k}>Start</Text>
          <Text style={styles.v}>{fmtDate(item.startDate)}</Text>
          <Text style={[styles.k, { marginLeft: 16 }]}>Deadline</Text>
          <Text style={styles.v}>
            {item.noDeadline ? 'No deadline' : fmtDate(item.deadline)}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.k}>Budget</Text>
          <Text style={styles.v}>
            {item.currency || ''} {item.budget ?? '—'}
          </Text>
          <Text style={[styles.k, { marginLeft: 16 }]}>Status</Text>
          <Text style={[styles.badge, badgeColor(status)]}>{status}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.k}>Progress</Text>
          <Text style={styles.v}>
            {progress !== null ? `${progress}%` : '—'}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <AssignedAvatars list={item.assignedEmployees || []} />
        {!!item.companyFiles?.length && (
          <Text style={styles.files} numberOfLines={1}>
            {item.companyFiles.length} file(s) attached
          </Text>
        )}
      </View>
    </View>
  );
}

export default function ProjectList({ data }) {
  const dispatch = useDispatch();
  const pinnedIds = useSelector(selectPinnedIds);

  return (
    <FlatList
      data={data}
      keyExtractor={p => String(p.id)}
      renderItem={({ item }) => (
        <ProjectCard
          item={item}
          pinned={pinnedIds.includes(item.id)}
          onPinToggle={id => dispatch(togglePinProject(id))}
        />
      )}
      contentContainerStyle={{ paddingBottom: 20, gap: 10 }}
    />
  );
}

function badgeColor(status) {
  switch (status) {
    case 'ON_HOLD':
      return {
        backgroundColor: '#fff7ed',
        color: '#9a3412',
        borderColor: '#fed7aa',
      };
    case 'CANCELLED':
      return {
        backgroundColor: '#fee2e2',
        color: '#991b1b',
        borderColor: '#fecaca',
      };
    case 'COMPLETED':
      return {
        backgroundColor: '#e9fbe7',
        color: '#166534',
        borderColor: '#bbf7d0',
      };
    default:
      return {
        backgroundColor: '#e0f2fe',
        color: '#075985',
        borderColor: '#bae6fd',
      }; // OPEN / null
  }
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  cardTop: { flexDirection: 'row', alignItems: 'center' },
  name: {
    flex: 1,
    minWidth: 0,
    fontSize: 18,
    fontWeight: '900',
    color: '#0b0b0c',
  },
  pinBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#f3f4f6',
  },
  pinActive: { backgroundColor: '#1d4ed8' },
  pinTxt: { fontWeight: '800', color: '#111827' },
  pinTxtActive: { color: '#fff' },

  meta: { color: '#374151', marginTop: 2 },

  rows: { marginTop: 8, gap: 6 },
  row: { flexDirection: 'row', alignItems: 'center' },
  k: { color: '#6b7280', fontWeight: '800', marginRight: 6 },
  v: { color: '#111827', fontWeight: '800' },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    overflow: 'hidden',
  },

  footer: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatarWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#fff',
    overflow: 'hidden',
  },
  avatar: { width: 32, height: 32, borderRadius: 16 },
  more: {
    backgroundColor: '#e5e7eb',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
    marginLeft: -10,
  },

  files: { color: '#6b7280', fontWeight: '800' },
});
