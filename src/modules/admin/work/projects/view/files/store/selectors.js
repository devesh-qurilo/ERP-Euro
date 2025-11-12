export const selectProjectFiles = s => s?.admin?.projectsViewFiles?.items || [];
export const selectProjectFilesBusy = s =>
  !!s?.admin?.projectsViewFiles?.loading;
export const selectProjectFilesError = s => s?.admin?.projectsViewFiles?.error;

export const selectProjectFilesUploadOpen = s =>
  !!s?.admin?.projectsViewFiles?.uploadOpen;
export const selectProjectFilesUploadBusy = s =>
  !!s?.admin?.projectsViewFiles?.uploadBusy;
export const selectProjectFilesUploadPreset = s =>
  s?.admin?.projectsViewFiles?.uploadPreset || {};

export const selectProjectFilesBusyIds = s =>
  s?.admin?.projectsViewFiles?.busyIds || [];
