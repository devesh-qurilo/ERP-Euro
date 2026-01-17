export const selectMyTimesheets = s => s.admin?.work?.timesheets?.list || [];
export const selectMyTimesheetsLoad = s => !!s.admin?.work?.timesheets?.loading;
export const selectMyTimesheetsError = s =>
  s.admin?.work?.timesheets?.error || null;

export const selectCreateTimesheetLoading = s =>
  !!s.admin?.work?.timesheets?.create?.loading;
export const selectCreateTimesheetError = s =>
  s.admin?.work?.timesheets?.create?.error;

// export const selectWeeklyTimesheet = s =>
//   s.admin?.work?.timesheets?.weekly || null;
export const selectWeeklyTimesheetLoad = s =>
  !!s.admin?.work?.timesheets?.weeklyLoading;
// export const selectWeeklyTimesheetError = s =>
//   s.admin?.work?.timesheets?.weeklyError || null;

export const selectWeeklyTimesheet = s =>
  s.admin?.work?.timesheets?.weekly?.data || null;

export const selectWeeklyTimesheetLoading = s =>
  !!s.admin?.work?.timesheets?.weekly?.loading;

export const selectWeeklyTimesheetError = s =>
  s.admin?.work?.timesheets?.weekly?.error || null;
