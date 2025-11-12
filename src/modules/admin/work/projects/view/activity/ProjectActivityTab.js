import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect, useRoute } from '@react-navigation/native';

import { listByProject } from './store/actions';
import {
  selectProjectActivity,
  selectProjectActivityBusy,
  selectProjectActivityError,
} from './store/selectors';

export default function ProjectActivityTab() {
  const route = useRoute();
  const dispatch = useDispatch();

  const projectId =
    route?.params?.project?.id || route?.params?.projectId || route?.params?.id;

  const rows = useSelector(selectProjectActivity);
  const loading = useSelector(selectProjectActivityBusy);
  const error = useSelector(selectProjectActivityError);

  const [q, setQ] = useState('');

  useFocusEffect(
    useCallback(() => {
      if (projectId) dispatch(listByProject(projectId));
    }, [dispatch, projectId]),
  );

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return rows;
    return rows.filter(r =>
      `${r.action} ${r.actorEmployeeId} ${r.metadata || ''}`
        .toLowerCase()
        .includes(s),
    );
  }, [rows, q]);

  return (
    <View style={{ padding: 12, gap: 12 }}>
      {/* Filters */}
      <View style={s.card}>
        <Text style={s.title}>Activity</Text>
        <Text style={s.label}>Search</Text>
        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder="action, employee id, metadata…"
          placeholderTextColor="#9ca3af"
          style={s.input}
        />
        {!!error && (
          <Text style={{ color: '#b91c1c', marginTop: 8 }}>
            {String(error)}
          </Text>
        )}
      </View>

      {/* List */}
      <ScrollView contentContainerStyle={{ gap: 10 }}>
        {loading ? (
          <Text style={{ color: '#6b7280', padding: 8 }}>Loading…</Text>
        ) : filtered.length === 0 ? (
          <Text style={{ color: '#6b7280', padding: 8 }}>No activity yet.</Text>
        ) : (
          filtered.map(item => <ActivityCard key={item.id} item={item} />)
        )}
      </ScrollView>
    </View>
  );
}

function ActivityCard({ item }) {
  const title = mapActionToTitle(item.action, item.metadata);
  const subtitle = `By ${item.actorEmployeeId || '—'}`;
  const when = formatDateTime(item.createdAt);

  return (
    <View style={s.rowCard}>
      <View style={s.iconBubble}>
        <Text style={{ fontSize: 16 }}>📝</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={s.rowTitle}>{title}</Text>
        <Text style={s.rowSub}>{subtitle}</Text>
        {!!item.metadata && (
          <Text style={[s.rowMeta, { marginTop: 2 }]}>
            Meta: {String(item.metadata)}
          </Text>
        )}
        <Text style={s.rowTime}>{when}</Text>
      </View>
      {/* reserved for future actions */}
      <Pressable style={s.dotBtn}>
        <Text>⋮</Text>
      </Pressable>
    </View>
  );
}

function mapActionToTitle(action, meta) {
  switch (action) {
    case 'PROJECT_ASSIGNED_EMPLOYEES_ADDED':
      return `Assigned employee added${meta ? ` (${meta})` : ''}`;
    case 'PROJECT_ASSIGNED_EMPLOYEE_REMOVED':
      return `Assigned employee removed${meta ? ` (${meta})` : ''}`;
    case 'TASK_CREATED':
      return `Task created${meta ? ` (#${meta})` : ''}`;
    case 'TIMELOG_CREATED':
      return `Time log added${meta ? ` (#${meta})` : ''}`;
    default:
      return action?.replace(/_/g, ' ') || 'Activity';
  }
}

function formatDateTime(iso) {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    const dd = `${pad(d.getDate())}-${pad(
      d.getMonth() + 1,
    )}-${d.getFullYear()}`;
    const tt = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
    return `${dd} ${tt}`;
  } catch {
    return String(iso);
  }
}
function pad(n) {
  return n < 10 ? `0${n}` : `${n}`;
}

const s = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  title: { fontSize: 18, fontWeight: '900', color: '#0b0b0c', marginBottom: 8 },
  label: { fontSize: 12, fontWeight: '800', color: '#374151', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
    color: '#111827',
  },

  rowCard: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
  },
  iconBubble: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  rowTitle: { fontWeight: '800', color: '#0b0b0c' },
  rowSub: { color: '#374151', marginTop: 2 },
  rowMeta: { color: '#6b7280' },
  rowTime: { color: '#6b7280', marginTop: 6, fontSize: 12 },
  dotBtn: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    backgroundColor: '#fff',
  },
});
