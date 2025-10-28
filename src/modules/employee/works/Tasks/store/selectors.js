// src/modules/employee/works/tasks/store/selectors.js
export const selectTasks = s => s.employee?.works?.tasks?.list || [];
export const selectTasksLoading = s =>
  s.employee?.works?.tasks?.loading || false;
export const selectTasksError = s => s.employee?.works?.tasks?.error || null;

export const selectPinnedTasks = s =>
  (s.employee?.works?.tasks?.list || []).filter(t => t.pinned);

export const selectWaitingTasks = s =>
  (s.employee?.works?.tasks?.list || []).filter(
    t =>
      (t.taskStage?.name || '').toLowerCase().includes('incomplete') ||
      (t.taskStage?.name || '').toLowerCase().includes('waiting'),
  );
