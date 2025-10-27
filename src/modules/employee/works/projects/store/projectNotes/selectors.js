export const selectProjectNotes = id => s =>
  s.employee?.works?.projectNotes?.byProjectId?.[id] || [];
export const selectProjectNotesLoading = id => s =>
  !!s.employee?.works?.projectNotes?.loadingById?.[id];
export const selectProjectNotesError = id => s =>
  s.employee?.works?.projectNotes?.errorById?.[id] || null;
