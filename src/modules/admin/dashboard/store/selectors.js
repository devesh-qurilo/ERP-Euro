// src/modules/admin/dashboard/store/selectors.js
export const selectAdminDashboardState = state => state.admin?.dashboard || {};

export const selectDashboardLoading = state =>
  selectAdminDashboardState(state).loading;

export const selectDashboardError = state =>
  selectAdminDashboardState(state).error;

export const selectProjectsCounts = state =>
  selectAdminDashboardState(state).projects || {
    pendingCount: 0,
    overdueCount: 0,
  };

export const selectTasksCounts = state =>
  selectAdminDashboardState(state).tasks || {
    pendingCount: 0,
    overdueCount: 0,
  };

export const selectDealsStats = state =>
  selectAdminDashboardState(state).deals || {
    totalDeals: 0,
    convertedDeals: 0,
  };

export const selectFollowupsSummary = state =>
  selectAdminDashboardState(state).followups || {
    pendingCount: 0,
    upcomingCount: 0,
  };
