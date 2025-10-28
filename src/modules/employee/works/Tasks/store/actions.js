// src/modules/employee/works/tasks/store/actions.js
import * as T from './types';

export const fetchStatuses = () => ({ type: T.FETCH_STATUSES_REQUEST });

export const fetchMyTasks = () => ({ type: T.FETCH_MY_TASKS_REQUEST });

// optimistic toggle with rollback info
export const togglePinTaskRequest = (taskId, desiredPinned, prevPinned) => ({
  type: T.TOGGLE_PIN_TASK_REQUEST,
  taskId,
  desiredPinned, // true if we want it pinned after op
  prevPinned, // current real state before optimistic flip
});
