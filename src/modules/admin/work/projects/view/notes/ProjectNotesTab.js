import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect, useRoute } from '@react-navigation/native';

import {
  listByProject,
  openCreate,
  closeCreate,
  createNote,
  deleteNote,
} from './store/actions';
import {
  selectProjectNotes,
  selectProjectNotesBusy,
  selectProjectNotesError,
  selectProjectNotesCreateOpen,
  selectProjectNotesCreateBusy,
  selectProjectNotesCreatePreset,
  selectProjectNotesBusyIds,
  rahul,
} from './store/selectors';

import ProjectNoteCreateModal from './ProjectNoteCreateModal';

export default function ProjectNotesTab() {
  const route = useRoute();
  const dispatch = useDispatch();

  const projectId =
    route?.params?.project?.id || route?.params?.projectId || route?.params?.id;

  const rows = useSelector(selectProjectNotes);
  const loading = useSelector(selectProjectNotesBusy);
  const error = useSelector(selectProjectNotesError);
  const createOpen = useSelector(selectProjectNotesCreateOpen);
  const createBusy = useSelector(selectProjectNotesCreateBusy);
  const creatingPreset = useSelector(selectProjectNotesCreatePreset);
  const busyIds = useSelector(selectProjectNotesBusyIds);
  const devii = useSelector(rahul);
  const [q, setQ] = useState('');

  useFocusEffect(
    useCallback(() => {
      if (projectId) dispatch(listByProject(projectId));
    }, [dispatch, projectId]),
  );

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return rows;
    return rows.filter(n =>
      `${n.title} ${n.content} ${n.ownerEmployeeId || ''}`
        .toLowerCase()
        .includes(s),
    );
  }, [rows, q]);

  const onAdd = () => dispatch(openCreate({ isPublic: true }));
  const onCreate = payload => dispatch(createNote(projectId, payload));
  const onDelete = row =>
    Alert.alert('Delete Note?', row.title, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => dispatch(deleteNote(row.id, projectId)),
      },
    ]);

  return (
    <View style={{ padding: 12, gap: 12 }}>
      {/* Filters */}
      <View style={s.card}>
        <Text style={s.title}>Notes</Text>
        <Text style={s.label}>Search</Text>
        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder="title, content, owner…"
          placeholderTextColor="#9ca3af"
          style={s.input}
        />
        {!!error && (
          <Text style={{ color: '#b91c1c', marginTop: 8 }}>
            {String(error)}
          </Text>
        )}
      </View>

      {/* Actions */}
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
        <Pressable style={[s.btn, s.primary]} onPress={onAdd}>
          <Text style={[s.btnTxt, { color: '#fff' }]}>+ Add Note</Text>
        </Pressable>
      </View>

      {/* List */}
      <ScrollView contentContainerStyle={{ gap: 10 }}>
        {loading ? (
          <Text style={{ color: '#6b7280', padding: 8 }}>Loading…</Text>
        ) : filtered.length === 0 ? (
          <Text style={{ color: '#6b7280', padding: 8 }}>No notes yet.</Text>
        ) : (
          filtered.map(n => {
            const busy = busyIds.includes(n.id);
            return (
              <View key={n.id} style={s.rowCard}>
                <View style={s.iconBubble}>
                  <Text>🗒️</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.rowTitle}>{n.title}</Text>
                  <Text style={s.rowMeta}>
                    {n.isPublic ? 'Public' : 'Private'} • Owner:{' '}
                    {n.ownerEmployeeId || '—'}
                  </Text>
                  <Text style={s.rowContent} numberOfLines={3}>
                    {n.content}
                  </Text>
                  <Text style={s.rowTime}>{formatDateTime(n.createdAt)}</Text>
                </View>
                <Pressable
                  disabled={busy}
                  onPress={() => onDelete(n)}
                  style={s.dotBtn}
                >
                  <Text>{busy ? '…' : '🗑️'}</Text>
                </Pressable>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Create Modal */}
      <ProjectNoteCreateModal
        visible={createOpen}
        busy={createBusy}
        preset={creatingPreset}
        onClose={() => dispatch(closeCreate())}
        onSave={onCreate}
      />
    </View>
  );
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
    alignItems: 'flex-start',
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
  rowMeta: { color: '#374151', marginTop: 2 },
  rowContent: { color: '#111827', marginTop: 6 },
  rowTime: { color: '#6b7280', marginTop: 6, fontSize: 12 },
  btn: {
    borderWidth: 1,
    borderColor: '#1d4ed8',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: 'center',
  },
  btnTxt: { color: '#1d4ed8', fontWeight: '600' },
  primary: { backgroundColor: '#1d4ed8', borderColor: '#1d4ed8' },
  dotBtn: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    backgroundColor: '#fff',
  },
});
