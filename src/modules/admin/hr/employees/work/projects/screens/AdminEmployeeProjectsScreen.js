import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import {
  fetchAll,
  openModal,
  closeModal,
  createProject,
  updateProject,
  deleteProject,
  patchStatus,
  patchProgress,
  pinProject,
  unpinProject,
  archiveProject,
  unarchiveProject,
} from '../../../../../work/projects/store/actions';

import {
  selectAWPList,
  selectAWPLoading,
  selectAWPBusyIds,
  selectAWPModalOpen,
  selectAWPEditing,
} from '../../../../../work/projects/store/selectors';

import ProjectsTable from '../../../../../work/projects/components/ProjectsTable';
import ProjectModal from '../../../../../work/projects/components/ProjectModal';

export default function EmployeeProjectsTab({ emp }) {
  const employeeId = emp?.employeeId;

  const dispatch = useDispatch();

  const list = useSelector(selectAWPList);
  const loading = useSelector(selectAWPLoading);
  const busyIds = useSelector(selectAWPBusyIds);

  const modalOpen = useSelector(selectAWPModalOpen);
  const editing = useSelector(selectAWPEditing);

  useEffect(() => {
    dispatch(fetchAll());
  }, []);

  /* FILTER PROJECTS BY EMPLOYEE */

  const projects = useMemo(() => {
    if (!employeeId) return [];

    return (list || []).filter(p =>
      (p.assignedEmployees || []).some(e => e.employeeId === employeeId),
    );
  }, [list, employeeId]);

  const onSave = payload => {
    if (editing) dispatch(updateProject(editing.id, payload));
    else dispatch(createProject(payload));
  };

  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      <View style={styles.header}>
        <Text style={styles.title}>{emp?.name}'s Projects</Text>
      </View>

      <ProjectsTable
        data={projects}
        loading={loading}
        busyIds={busyIds}
        onView={() => {}}
        onEdit={p => dispatch(openModal(p))}
        onDelete={id => dispatch(deleteProject(id))}
        onStatus={(id, s) => dispatch(patchStatus(id, s))}
        onProgress={(id, p) => dispatch(patchProgress(id, p))}
        onPin={id => dispatch(pinProject(id))}
        onUnpin={id => dispatch(unpinProject(id))}
        onArchive={id => dispatch(archiveProject(id))}
        onUnarchive={id => dispatch(unarchiveProject(id))}
      />

      <ProjectModal
        visible={modalOpen}
        editing={editing}
        onClose={() => dispatch(closeModal())}
        onSave={onSave}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: {
    padding: 12,
  },

  header: {
    marginBottom: 10,
  },

  title: {
    fontSize: 18,
    fontWeight: '900',
  },
});
