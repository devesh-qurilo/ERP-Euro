export const FETCH_LEAVE_QUOTA_REQUEST =
  'employee/dashboard/FETCH_LEAVE_QUOTA_REQUEST';
export const FETCH_LEAVE_QUOTA_SUCCESS =
  'employee/dashboard/FETCH_LEAVE_QUOTA_SUCCESS';
export const FETCH_LEAVE_QUOTA_FAILURE =
  'employee/dashboard/FETCH_LEAVE_QUOTA_FAILURE';

// appreciation types
export const FETCH_APPRECIATIONS_REQUEST =
  'employee/dashboard/FETCH_APPRECIATIONS_REQUEST';
export const FETCH_APPRECIATIONS_SUCCESS =
  'employee/dashboard/FETCH_APPRECIATIONS_SUCCESS';
export const FETCH_APPRECIATIONS_FAILURE =
  'employee/dashboard/FETCH_APPRECIATIONS_FAILURE';

export const fetchLeaveQuota = () => ({ type: FETCH_LEAVE_QUOTA_REQUEST });

// appreciation action

export const fetchAppreciations = () => ({ type: FETCH_APPRECIATIONS_REQUEST });
