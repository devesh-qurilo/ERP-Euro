export const selectProjectFilesState = state =>
  state.employee.works.projects.files;

export const selectProjectFiles = (state, projectId) =>
  selectProjectFilesState(state).byProject[projectId] || [];

export const selectProjectFilesLoading = state =>
  selectProjectFilesState(state).loading;

export const selectProjectFilesUploading = state =>
  selectProjectFilesState(state).uploading;

export const selectProjectFilesError = state =>
  selectProjectFilesState(state).error;
