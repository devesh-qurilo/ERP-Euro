// src/modules/employee/works/projects/store/taskDetails/selectors.js
export const selectTaskFiles = s => s.employee.works.taskDetails.files.data;
export const selectTaskFilesLoading = s =>
  s.employee.works.taskDetails.files.loading;

export const selectSubtasks = s => s.employee.works.taskDetails.subtasks.data;
export const selectSubtasksLoading = s =>
  s.employee.works.taskDetails.subtasks.loading;

export const selectTimesheets = s =>
  s.employee.works.taskDetails.timesheets.data;
export const selectTimesheetsLoading = s =>
  s.employee.works.taskDetails.timesheets.loading;

export const selectNotes = s => s.employee.works.taskDetails.notes.data;
export const selectNotesLoading = s =>
  s.employee.works.taskDetails.notes.loading;
