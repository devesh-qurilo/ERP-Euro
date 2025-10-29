// src/modules/employee/works/timesheets/store/weekly/selectors.js
export const selectWeekly = s =>
  s.employee?.works?.timesheetsWeekly?.weekly || null;
export const selectWeeklyLoad = s =>
  !!s.employee?.works?.timesheetsWeekly?.loading;
export const selectWeeklyError = s =>
  s.employee?.works?.timesheetsWeekly?.error || null;
