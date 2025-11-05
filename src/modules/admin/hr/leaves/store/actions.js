import * as T from './types';

export const setLeavesMode = mode => ({ type: T.SET_LEAVES_MODE, mode });
export const setLeavesFilters = filters => ({
  type: T.SET_LEAVES_FILTERS,
  filters,
});

export const fetchLeaves = () => ({ type: T.FETCH_LEAVES_REQUEST });
export const fetchQuota = () => ({ type: T.FETCH_QUOTA_REQUEST });

export const openLeaveModal = () => ({ type: T.OPEN_LEAVE_MODAL });
export const closeLeaveModal = () => ({ type: T.CLOSE_LEAVE_MODAL });

export const applyLeaves = payload => ({
  type: T.APPLY_LEAVES_REQUEST,
  payload,
});

export const patchLeaveStatus = (leaveId, payload) => ({
  type: T.PATCH_STATUS_REQUEST,
  leaveId,
  payload, // { status: 'APPROVED' } or { status:'REJECTED', rejectionReason:'...' }
});

export const deleteLeave = leaveId => ({
  type: T.DELETE_LEAVE_REQUEST,
  leaveId,
});
