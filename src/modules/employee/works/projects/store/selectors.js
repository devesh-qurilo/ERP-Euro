// src/modules/employee/works/projects/store/selectors.js
export const selectProjects = s => s.employee?.works?.projects?.list || [];
export const selectProjectsLoading = s =>
  s.employee?.works?.projects?.loading || false;
export const selectProjectsError = s =>
  s.employee?.works?.projects?.error || null;
export const selectPinnedIds = s => s.employee?.works?.projects?.pinned || [];
