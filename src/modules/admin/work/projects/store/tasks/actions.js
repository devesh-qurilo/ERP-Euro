import {
  TASKS_FETCH,
  TASKS_SET,
  TASKS_BUSY,
  TASKS_ERROR,
  TASKS_CREATE,
  TASKS_UPDATE,
  TASKS_DELETE,
} from './types';

export const fetchTasksByProject = projectId => ({
  type: TASKS_FETCH,
  projectId,
});

export const setTasks = (projectId, items) => ({
  type: TASKS_SET,
  projectId,
  items,
});

export const setTasksBusy = busy => ({ type: TASKS_BUSY, busy });
export const setTasksError = error => ({ type: TASKS_ERROR, error });

export const createProjectTask = payload => ({
  type: TASKS_CREATE,
  payload, // must include projectId (for refresh)
});

export const updateProjectTask = (taskId, payload) => ({
  type: TASKS_UPDATE,
  taskId,
  payload, // should include projectId (for refresh)
});

export const deleteProjectTask = ({ projectId, taskId }) => ({
  type: TASKS_DELETE,
  projectId,
  taskId,
});
