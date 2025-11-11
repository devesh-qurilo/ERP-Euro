export const selectMyTimesheets = s =>
  s.employee?.works?.timesheets?.list || [];
export const selectMyTimesheetsLoad = s =>
  !!s.employee?.works?.timesheets?.loading;
export const selectMyTimesheetsError = s =>
  s.employee?.works?.timesheets?.error || null;

export const selectCreateTimesheetLoading = s =>
  !!s.employee?.works?.timesheets?.create?.loading;
export const selectCreateTimesheetError = s =>
  s.employee?.works?.timesheets?.create?.error;

export const selectWeeklyTimesheet = s =>
  s.employee?.works?.timesheets?.weekly || null;
export const selectWeeklyTimesheetLoad = s =>
  !!s.employee?.works?.timesheets?.weeklyLoading;
export const selectWeeklyTimesheetError = s =>
  s.employee?.works?.timesheets?.weeklyError || null;
