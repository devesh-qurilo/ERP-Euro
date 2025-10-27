export const selectProjectActivity = id => s =>
  s.employee?.works?.projectActivity?.byProjectId?.[id] || [];
export const selectProjectActivityLoading = id => s =>
  !!s.employee?.works?.projectActivity?.loadingById?.[id];
export const selectProjectActivityError = id => s =>
  s.employee?.works?.projectActivity?.errorById?.[id] || null;
