// src/modules/employee/hr/store/selectors.js
export const selectMyLeavesData = s => s.employee?.hr?.myLeaves?.data || [];
export const selectMyLeavesLoading = s =>
  s.employee?.hr?.myLeaves?.loading || false;
export const selectMyLeavesError = s => s.employee?.hr?.myLeaves?.error || null;
