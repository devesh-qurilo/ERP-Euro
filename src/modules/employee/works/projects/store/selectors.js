export const selectProjects = s => s.employee?.works?.projects?.list || [];
export const selectProjectsLoading = s =>
  s.employee?.works?.projects?.loading || false;
export const selectProjectsError = s =>
  s.employee?.works?.projects?.error || null;

export const selectPinnedProjects = s =>
  (s.employee?.works?.projects?.list || []).filter(p => p.pinned);

export const selectProjectMetrics = id => s =>
  s.employee?.works?.projects?.metricsById?.[id] || null;
export const selectProjectMetricsLoading = id => s =>
  !!s.employee?.works?.projects?.metricsLoadingById?.[id];
export const selectProjectMetricsError = id => s =>
  s.employee?.works?.projects?.metricsErrorById?.[id] || null;

// tasks
export const selectProjectTasks = id => s =>
  s.employee?.works?.projects?.tasksById?.[id] || [];
export const selectProjectTasksLoading = id => s =>
  !!s.employee?.works?.projects?.tasksLoadingById?.[id];
export const selectProjectTasksError = id => s =>
  s.employee?.works?.projects?.tasksErrorById?.[id] || null;
