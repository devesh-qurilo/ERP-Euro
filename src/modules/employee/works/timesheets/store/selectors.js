export const selectMyTimesheets = s =>
  s.employee?.works?.timesheets?.list || [];
export const selectMyTimesheetsLoading = s =>
  !!s.employee?.works?.timesheets?.loading;
export const selectMyTimesheetsError = s =>
  s.employee?.works?.timesheets?.error || null;
