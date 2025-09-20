// src/modules/employee/dashboard/store/selectors.js
export const selectLeaveQuotaData = s =>
  s.employee?.dashboard?.leaveQuota?.data || [];
export const selectLeaveQuotaLoading = s =>
  s.employee?.dashboard?.leaveQuota?.loading || false;
export const selectLeaveQuotaError = s =>
  s.employee?.dashboard?.leaveQuota?.error || null;
