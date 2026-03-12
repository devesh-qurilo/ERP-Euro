import React, { useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import LeavesTable from '../../leaves/components/LeavesTable';

import { patchLeaveStatus, deleteLeave } from '../../leaves/store/actions';

import { fetchEmployeeLeaves } from '../store/actions';

import { selectLeavesBusyIds } from '../../leaves/store/selectors';
import {
  selectEmployeeLeaves,
  selectEmployeeLeavesLoading,
} from '../store/selectors';

export default function EmployeeLeavesSection({ employeeId }) {
  const dispatch = useDispatch();

  const leaves = useSelector(selectEmployeeLeaves);
  const loading = useSelector(selectEmployeeLeavesLoading);
  const busyIds = useSelector(selectLeavesBusyIds);

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

  return (
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
  );
}
