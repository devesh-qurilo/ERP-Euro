// src/modules/employee/works/tasks/store/actions.js
import * as T from './types';

export const fetchMyTasks = () => ({ type: T.FETCH_MY_TASKS_REQUEST });

export const togglePinTask = taskId => ({
  type: T.TOGGLE_PIN_TASK,
  taskId,
});
