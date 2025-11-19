// src/modules/admin/dashboard/store/actions.js
export const FETCH_ADMIN_DASHBOARD_COUNTS_REQUEST =
  'admin/dashboard/FETCH_COUNTS_REQUEST';
export const FETCH_ADMIN_DASHBOARD_COUNTS_SUCCESS =
  'admin/dashboard/FETCH_COUNTS_SUCCESS';
export const FETCH_ADMIN_DASHBOARD_COUNTS_FAILURE =
  'admin/dashboard/FETCH_COUNTS_FAILURE';

// action creators
export const fetchAdminDashboardCountsRequest = () => ({
  type: FETCH_ADMIN_DASHBOARD_COUNTS_REQUEST,
});

export const fetchAdminDashboardCountsSuccess = payload => ({
  type: FETCH_ADMIN_DASHBOARD_COUNTS_SUCCESS,
  payload,
});

export const fetchAdminDashboardCountsFailure = error => ({
  type: FETCH_ADMIN_DASHBOARD_COUNTS_FAILURE,
  error,
});
