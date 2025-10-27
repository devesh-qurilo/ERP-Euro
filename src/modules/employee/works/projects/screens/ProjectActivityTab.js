import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjectActivity } from '../store/projectActivity/actions';
import {
  selectProjectActivity,
  selectProjectActivityLoading,
  selectProjectActivityError,
} from '../store/projectActivity/selectors';

const fmtDT = s => (s ? new Date(s).toLocaleString() : '—');

const ActionBadge = ({ action }) => {
  const colorMap = {
    PROJECT_CREATED: ['#dcfce7', '#065f46'],
    PROJECT_DELETED: ['#fee2e2', '#991b1b'],
    FILE_UPLOADED: ['#e0e7ff', '#1e3a8a'],
    FILE_DELETED: ['#fee2e2', '#991b1b'],
  };
  const [bg, fg] = colorMap[action] || ['#f3f4f6', '#374151'];
  return (
    <Text
      style={{
        backgroundColor: bg,
        color: fg,
        fontWeight: '900',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
      }}
    >
      {action}
    </Text>
  );
};

export default function ProjectActivityTab({ route }) {
  const { projectId } = route.params || {};
  const dispatch = useDispatch();
  const list = useSelector(selectProjectActivity(projectId));
  const loading = useSelector(selectProjectActivityLoading(projectId));
  const error = useSelector(selectProjectActivityError(projectId));

  useEffect(() => {
    if (projectId) dispatch(fetchProjectActivity(projectId));
  }, [projectId, dispatch]);

  return (
    <ScrollView
      contentContainerStyle={styles.wrap}
      refreshControl={
        <RefreshControl
          refreshing={!!loading}
          onRefresh={() => dispatch(fetchProjectActivity(projectId))}
        />
      }
    >
      {error ? <Text style={styles.err}>Error: {String(error)}</Text> : null}

      {(!list || list.length === 0) && !loading ? (
        <Text style={styles.dim}>No activity recorded.</Text>
      ) : null}

      {(list || []).map(ev => (
        <View key={ev.id} style={styles.row}>
          <ActionBadge action={ev.action} />
          <View style={{ flex: 1 }}>
            <Text style={styles.meta}>
              By {ev.actorEmployeeId || '—'} • {fmtDT(ev.createdAt)}
            </Text>
            {ev.metadata ? (
              <Text style={styles.body}>{String(ev.metadata)}</Text>
            ) : null}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 12, gap: 10 },
  row: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
  },
  meta: { color: '#6b7280', marginTop: 2, marginBottom: 6 },
  body: { color: '#111827' },
  dim: { color: '#6b7280', padding: 12 },
  err: { color: '#b00020', padding: 12 },
});
