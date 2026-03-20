import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  useFocusEffect,
  useRoute,
  useNavigation,
} from '@react-navigation/native';

import { listByClient } from './store/actions';
import {
  selectClientProjects,
  selectClientProjectsBusy,
} from './store/selectors';

import ProjectsTable from '../../../work/projects/components/ProjectsTable';
import ProjectModal from '../../../work/projects/components/ProjectModal';

// reuse the SAME store/actions you already use on main Projects screen
import {
  openModal,
  closeModal,
  createProject,
  updateProject,
  deleteProject,
  patchStatus,
  pinProject,
  unpinProject,
  archiveProject,
  unarchiveProject,
} from '../../../work/projects/store/actions';

import {
  selectAWPModalOpen,
  selectAWPEditing,
  selectAWPLoading,
} from '../../../work/projects/store/selectors';

export default function ClientProjectsTab() {
  const route = useRoute();
  const nav = useNavigation();
  const dispatch = useDispatch();

  const clientId =
    route?.params?.clientId ||
    route?.params?.client?.clientId ||
    route?.params?.id;

  // list for this client
  const rows = useSelector(selectClientProjects);
  const loading = useSelector(selectClientProjectsBusy);
  console.log('client view  project', clientId, rows);

  // modal state comes from your main projects slice (same as AdminWorkProjectsScreen)
  const modalOpen = useSelector(selectAWPModalOpen);
  const editing = useSelector(selectAWPEditing);
  const saving = useSelector(selectAWPLoading); // or a dedicated saving flag if you have one

  const [search, setSearch] = useState('');

  useFocusEffect(
    useCallback(() => {
      if (clientId) dispatch(listByClient(clientId));
    }, [dispatch, clientId]),
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(p =>
      `${p.shortCode} ${p.name}`.toLowerCase().includes(q),
    );
  }, [rows, search]);

  // —— handlers ——
  const onAdd = () => {
    console.log('add project'), dispatch(openModal(null));
  }; // ProjectModal will be opened; we'll inject clientId on save
  const onSave = payload => {
    // ensure clientId from context is applied on CREATE;
    // (for EDIT it's already inside payload or editing record)
    if (editing) {
      dispatch(updateProject(editing.id, payload));
    } else {
      dispatch(createProject({ ...payload, clientId }));
    }
  };

  const onView = item =>
    nav.navigate('Work', {
      screen: 'AdminProjectView',
      params: { project: item },
    });

  if (!clientId) {
    return (
      <View style={{ padding: 12 }}>
        <Text>No clientId passed.</Text>
      </View>
    );
  }

  return (
    <View style={{ padding: 12, gap: 12 }}>
      {/* Section 1: Filter */}
      <View style={styles.card}>
        <Text style={styles.title}>Filters</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Search</Text>
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="code or project name…"
              placeholderTextColor="#9ca3af"
              style={styles.input}
            />
          </View>
          {/* (optional) add status dropdown later if needed */}
        </View>
      </View>

      {/* Section 2: Actions */}
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
        <Pressable style={[styles.btn, styles.primary]} onPress={onAdd}>
          <Text style={[styles.btnTxt, { color: '#fff' }]}>+ Add Project</Text>
        </Pressable>
      </View>

      {/* Section 3: Table (hide Client column inside client view) */}
      <ProjectsTable
        data={filtered}
        loading={loading}
        busyIds={[]}
        showClientColumn={false}
        onView={onView}
        onEdit={p => dispatch(openModal(p))}
        onDelete={id => dispatch(deleteProject(id))}
        onStatus={(id, status) => dispatch(patchStatus(id, status))}
        onPin={id => dispatch(pinProject(id))}
        onUnpin={id => dispatch(unpinProject(id))}
        onArchive={id => dispatch(archiveProject(id))}
        onUnarchive={id => dispatch(unarchiveProject(id))}
      />

      {/* Reuse the SAME modal; we just inject clientId on Save */}
      <ProjectModal
        visible={modalOpen}
        editing={editing}
        // 👇 pass presetClientId to lock/show the client as read-only (see patch #2)
        presetClientId={clientId}
        onClose={() => dispatch(closeModal())}
        onSave={onSave}
        busy={!!saving}
      />
    </View>
  );
}

const styles = StyleSheet.create({
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
  btn: {
    borderWidth: 1,
    borderColor: '#1d4ed8',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  primary: { backgroundColor: '#1d4ed8' },
  btnTxt: { fontWeight: '500', color: '#111827' },
});
