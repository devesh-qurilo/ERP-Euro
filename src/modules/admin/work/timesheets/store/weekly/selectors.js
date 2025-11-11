// src/modules/admin/works/timesheets/store/weekly/selectors.js
export const selectWeekly = s =>
  s.admin?.work?.timesheetsWeekly?.weekly || null;
export const selectWeeklyLoad = s => !!s.admin?.work?.timesheetsWeekly?.loading;
export const selectWeeklyError = s =>
  s.admin?.work?.timesheetsWeekly?.error || null;
