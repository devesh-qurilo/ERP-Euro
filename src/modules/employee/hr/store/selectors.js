// src/modules/employee/hr/store/selectors.js
export const selectMyLeavesData = s => s.employee?.hr?.myLeaves?.data || [];
export const selectMyLeavesLoading = s =>
  s.employee?.hr?.myLeaves?.loading || false;
export const selectMyLeavesError = s => s.employee?.hr?.myLeaves?.error || null;

export const selectApplyLoading = s => s.employee?.hr?.apply?.loading || false;
export const selectApplyError = s => s.employee?.hr?.apply?.error || null;
export const selectApplyCreated = s =>
  s.employee?.hr?.apply?.lastCreated || null;
