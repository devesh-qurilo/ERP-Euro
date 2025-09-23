// src/modules/employee/hr/store/selectors.js
export const selectMyLeavesData = s => s.employee?.hr?.myLeaves?.data || [];
export const selectMyLeavesLoading = s =>
  s.employee?.hr?.myLeaves?.loading || false;
export const selectMyLeavesError = s => s.employee?.hr?.myLeaves?.error || null;

export const selectApplyLoading = s => s.employee?.hr?.apply?.loading || false;
export const selectApplyError = s => s.employee?.hr?.apply?.error || null;
export const selectApplyCreated = s =>
  s.employee?.hr?.apply?.lastCreated || null;

export const selectAttendanceData = s => s.employee?.hr?.attendance?.data || [];
export const selectAttendanceLoading = s =>
  s.employee?.hr?.attendance?.loading || false;
export const selectAttendanceError = s =>
  s.employee?.hr?.attendance?.error || null;

export const selectApprecsData = s => s.employee?.hr?.appreciations?.data || [];
export const selectApprecsLoading = s =>
  s.employee?.hr?.appreciations?.loading || false;
export const selectApprecsError = s =>
  s.employee?.hr?.appreciations?.error || null;

export const selectHolidaysData = s => s.employee?.hr?.holidays?.data || [];
export const selectHolidaysLoading = s =>
  s.employee?.hr?.holidays?.loading || false;
export const selectHolidaysError = s => s.employee?.hr?.holidays?.error || null;
