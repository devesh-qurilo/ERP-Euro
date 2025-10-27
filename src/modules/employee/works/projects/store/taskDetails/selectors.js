// src/modules/employee/works/projects/store/taskDetails/selectors.js

const IL = { data: [], loading: false, error: null };

// Works if taskDetails is mounted at either:
//   state.employee.works.projects.taskDetails   (inside projects)
// or
//   state.employee.works.taskDetails            (sibling slice)
const tdSlice = s => {
  const withinProjects = s?.employee?.works?.projects?.taskDetails;
  if (withinProjects) return withinProjects;

  const sibling = s?.employee?.works?.taskDetails;
  if (sibling) return sibling;

  // fallback prevents "Cannot read property 'files' of undefined"
  return { files: IL, subtasks: IL, timesheets: IL, notes: IL };
};

export const selectTaskFiles = s => tdSlice(s).files.data;
export const selectTaskFilesLoading = s => tdSlice(s).files.loading;

export const selectSubtasks = s => tdSlice(s).subtasks.data;
export const selectSubtasksLoading = s => tdSlice(s).subtasks.loading;

export const selectTimesheets = s => tdSlice(s).timesheets.data;
export const selectTimesheetsLoading = s => tdSlice(s).timesheets.loading;

export const selectNotes = s => tdSlice(s).notes.data;
export const selectNotesLoading = s => tdSlice(s).notes.loading;
