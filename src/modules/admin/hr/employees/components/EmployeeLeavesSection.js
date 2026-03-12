// import React, { useEffect } from 'react';
// import { View, ScrollView } from 'react-native';
// import { useDispatch, useSelector } from 'react-redux';

// import LeavesTable from '../../leaves/components/LeavesTable';

// import { patchLeaveStatus, deleteLeave } from '../../leaves/store/actions';

// import { fetchEmployeeLeaves } from '../store/actions';

// import { selectLeavesBusyIds } from '../../leaves/store/selectors';
// import {
//   selectEmployeeLeaves,
//   selectEmployeeLeavesLoading,
// } from '../store/selectors';

// export default function EmployeeLeavesSection({ employeeId }) {
//   const dispatch = useDispatch();

//   const leaves = useSelector(selectEmployeeLeaves);
//   const loading = useSelector(selectEmployeeLeavesLoading);
//   const busyIds = useSelector(selectLeavesBusyIds);

//   useEffect(() => {
//     if (!employeeId) return;

//     dispatch(fetchEmployeeLeaves(employeeId));
//   }, [employeeId]);

//   const onApprove = row =>
//     dispatch(patchLeaveStatus(row.id, { status: 'APPROVED' }));

//   const onReject = row =>
//     dispatch(
//       patchLeaveStatus(row.id, {
//         status: 'REJECTED',
//         rejectionReason: 'Rejected by admin',
//       }),
//     );

//   const onDelete = row => dispatch(deleteLeave(row.id));

//   return (
//     <ScrollView horizontal>
//       <LeavesTable
//         data={leaves}
//         loading={loading}
//         busyIds={busyIds}
//         onApprove={onApprove}
//         onReject={onReject}
//         onDelete={onDelete}
//       />
//     </ScrollView>
//   );
// }

import React, { useEffect } from 'react';
import { View, ScrollView, Text, Pressable, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import LeavesTable from '../../leaves/components/LeavesTable';
import LeaveApplyModal from '../../leaves/components/LeaveApplyModal';

import {
  patchLeaveStatus,
  deleteLeave,
  openLeaveModal,
  closeLeaveModal,
  applyLeaves,
} from '../../leaves/store/actions';
import { fetchEmployeeLeaves } from '../store/actions';
import {
  selectLeavesBusyIds,
  selectLeaveModalOpen,
  selectLeavesApplying,
} from '../../leaves/store/selectors';

import {
  selectEmployeeLeaves,
  selectEmployeeLeavesLoading,
} from '../store/selectors';

import { selectEmpList } from '../../employees/store/selectors';

export default function EmployeeLeavesSection({ employeeId }) {
  const dispatch = useDispatch();

  const leaves = useSelector(selectEmployeeLeaves);
  const loading = useSelector(selectEmployeeLeavesLoading);
  const busyIds = useSelector(selectLeavesBusyIds);

  const modalOpen = useSelector(selectLeaveModalOpen);
  const applying = useSelector(selectLeavesApplying);

  const employees = useSelector(selectEmpList);

  useEffect(() => {
    if (!employeeId) return;
    dispatch(fetchEmployeeLeaves(employeeId));
  }, [employeeId]);

  const onApprove = row =>
    dispatch(patchLeaveStatus(row.id, { status: 'APPROVED' }));

  const onReject = row =>
    dispatch(
      patchLeaveStatus(row.id, {
        status: 'REJECTED',
        rejectionReason: 'Rejected by admin',
      }),
    );

  const onDelete = row => dispatch(deleteLeave(row.id));

  const handleApply = payload => {
    dispatch(applyLeaves(payload));
  };

  return (
    <View style={styles.card}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Employee Leaves</Text>

        <Pressable
          style={styles.addBtn}
          onPress={() => dispatch(openLeaveModal())}
        >
          <Text style={styles.addTxt}>+ Add Leave</Text>
        </Pressable>
      </View>

      <ScrollView horizontal>
        <LeavesTable
          data={leaves}
          loading={loading}
          busyIds={busyIds}
          onApprove={onApprove}
          onReject={onReject}
          onDelete={onDelete}
        />
      </ScrollView>

      {/* APPLY MODAL */}
      <LeaveApplyModal
        visible={modalOpen}
        onClose={() => dispatch(closeLeaveModal())}
        onSave={handleApply}
        employees={employees}
        applying={applying}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    // borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 12,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    alignItems: 'center',
  },

  title: {
    fontSize: 18,
    fontWeight: '800',
  },

  addBtn: {
    backgroundColor: '#1d4ed8',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },

  addTxt: {
    color: '#fff',
    fontWeight: '700',
  },
});
