export const tasksRoot = s => s?.admin?.work?.projects?.tasks || {};
export const selectTasksByProject = (s, projectId) =>
  tasksRoot(s).byProject?.[projectId] || [];
export const selectTasksBusy = s => !!tasksRoot(s).busy;
export const selectTasksError = s => tasksRoot(s).error || null;
