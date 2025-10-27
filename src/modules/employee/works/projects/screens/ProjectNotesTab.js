import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjectNotes } from '../store/projectNotes/actions';
import {
  selectProjectNotes,
  selectProjectNotesLoading,
  selectProjectNotesError,
} from '../store/projectNotes/selectors';

const fmtDT = s => (s ? new Date(s).toLocaleString() : '—');

export default function ProjectNotesTab({ route }) {
  const { projectId } = route.params || {};
  const dispatch = useDispatch();
  const list = useSelector(selectProjectNotes(projectId));
  const loading = useSelector(selectProjectNotesLoading(projectId));
  const error = useSelector(selectProjectNotesError(projectId));

  useEffect(() => {
    if (projectId) dispatch(fetchProjectNotes(projectId));
  }, [projectId, dispatch]);

  return (
    <ScrollView
      contentContainerStyle={styles.wrap}
      refreshControl={
        <RefreshControl
          refreshing={!!loading}
          onRefresh={() => dispatch(fetchProjectNotes(projectId))}
        />
      }
    >
      {error ? <Text style={styles.err}>Error: {String(error)}</Text> : null}

      {(!list || list.length === 0) && !loading ? (
        <Text style={styles.dim}>No notes yet Devesh.</Text>
      ) : null}

      {(list || []).map(n => (
        <View key={n.id} style={styles.card}>
          <Text style={styles.title}>{n.title || 'Untitled note'}</Text>
          <Text style={styles.body}>{n.content}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.tag}>{n.isPublic ? 'Public' : 'Private'}</Text>
            <Text style={styles.meta}>
              By {n.createdBy || n.ownerEmployeeId || '—'}
            </Text>
            <Text style={styles.meta}>{fmtDT(n.createdAt)}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 12, gap: 12 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 12,
  },
  title: { fontSize: 16, fontWeight: '900', color: '#0b0b0c', marginBottom: 6 },
  body: { color: '#111827', lineHeight: 20 },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  tag: {
    backgroundColor: '#eef2ff',
    color: '#111827',
    fontWeight: '900',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  meta: { color: '#6b7280' },
  dim: { color: '#6b7280', padding: 12 },
  err: { color: '#b00020', padding: 12 },
});
