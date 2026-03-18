// // modules/admin/hr/employees/view/work/projects/screens/AdminEmployeeProjectsScreen.js
// import React, { useEffect } from 'react';
// import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
// import { useDispatch, useSelector } from 'react-redux';
// import {
//   fetchEmpProjects,
//   openEmpProjModal,
//   closeEmpProjModal,
//   createEmpProject,
//   updateEmpProject,
//   deleteEmpProject,
//   patchEmpProjectStatus,
// } from '../store/actions';
// import {
//   selectEmpProjects,
//   selectEmpProjectsLoading,
//   selectEmpProjModalOpen,
//   selectEmpProjEditing,
// } from '../store/selectors';

// import ProjectsTable from '../components/ProjectsTable';
// import ProjectModal from '../components/ProjectModal';

// export default function AdminEmployeeProjectsScreen({ emp }) {
//   //   const emp = route?.params?.emp; // pass { emp } from parent view screen
//   const employeeId = emp?.employeeId;
//   // console.log('onAdd', emp);

//   const dispatch = useDispatch();
//   const list = useSelector(selectEmpProjects);
//   const loading = useSelector(selectEmpProjectsLoading);
//   const modalOpen = useSelector(selectEmpProjModalOpen);
//   const editing = useSelector(selectEmpProjEditing);
//   // console.log('onAdd list', list);
//   useEffect(() => {
//     if (employeeId) dispatch(fetchEmpProjects(employeeId));
//   }, [dispatch, employeeId]);

//   const onAdd = () => dispatch(openEmpProjModal(null));
//   const onEdit = proj => dispatch(openEmpProjModal(proj));
//   const onDelete = id => dispatch(deleteEmpProject(id, employeeId));
//   const onStatusChange = (id, status) =>
//     dispatch(patchEmpProjectStatus(id, status, employeeId));

//   const handleSave = (payload, editingId) => {
//     if (editingId) {
//       dispatch(
//         updateEmpProject(
//           editingId,
//           {
//             // map create-fields to update-fields
//             projectName: payload.projectName,
//             startDate: payload.startDate,
//             deadline: payload.deadline,
//             noDeadline: payload.noDeadline,
//             category: payload.projectCategory,
//             departmentId: payload.departmentId,
//             summary: payload.projectSummary,
//             tasksNeedAdminApproval: payload.tasksNeedAdminApproval,
//             currency: payload.currency,
//             budget: payload.projectBudget,
//             hoursEstimate: payload.hoursEstimate,
//             allowManualTimeLogs: payload.allowManualTimeLogs,
//             companyFile: payload.companyFile || null,
//             // optional: projectStatus / progress if you add in modal
//           },
//           employeeId,
//         ),
//       );
//     } else {
//       // ensure the viewed employee is included
//       const assigned = Array.from(
//         new Set(
//           [...(payload.assignedEmployeeIds || []), employeeId].filter(Boolean),
//         ),
//       );

//       dispatch(
//         createEmpProject(
//           { ...payload, assignedEmployeeIds: assigned },
//           employeeId,
//         ),
//       );
//     }
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.wrap}>
//       <View style={styles.headerRow}>
//         <Text style={styles.title}>{emp?.name || employeeId}</Text>
//         <Pressable style={styles.addBtn} onPress={onAdd}>
//           <Text style={styles.addTxt}>+ Add Project</Text>
//         </Pressable>
//       </View>

//       <ProjectsTable
//         data={list}
//         loading={loading}
//         onEdit={onEdit}
//         onDelete={onDelete}
//         onStatusChange={onStatusChange}
//       />

//       <ProjectModal
//         visible={modalOpen}
//         editing={editing}
//         defaultEmployeeId={employeeId}
//         loading={loading}
//         onClose={() => dispatch(closeEmpProjModal())}
//         onSave={handleSave}
//       />
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   wrap: { padding: 12, gap: 12 },
//   headerRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   title: { fontSize: 18, fontWeight: '900', color: '#0b0b0c' },
//   addBtn: {
//     borderWidth: 1,
//     borderColor: '#1d4ed8',
//     borderRadius: 10,
//     paddingHorizontal: 14,
//     paddingVertical: 10,
//     backgroundColor: '#1d4ed8',
//   },
//   addTxt: { color: '#fff', fontWeight: '900' },
// });

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
