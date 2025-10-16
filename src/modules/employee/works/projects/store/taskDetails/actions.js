// src/modules/employee/works/projects/store/taskDetails/actions.js
import * as T from './types';

// Files
export const fetchTaskFiles = taskId => ({
  type: T.FETCH_TASK_FILES_REQUEST,
  payload: { taskId },
});
export const uploadTaskFile = (taskId, file) => ({
  type: T.UPLOAD_TASK_FILE_REQUEST,
  payload: { taskId, file },
});

// Subtasks
export const fetchSubtasks = taskId => ({
  type: T.FETCH_SUBTASKS_REQUEST,
  payload: { taskId },
});
export const createSubtask = (taskId, data) => ({
  type: T.CREATE_SUBTASK_REQUEST,
  payload: { taskId, data },
});

// Timesheets
export const fetchTimesheets = (projectId, taskId) => ({
  type: T.FETCH_TIMESHEETS_REQUEST,
  payload: { projectId, taskId },
});

// Notes
export const fetchNotes = taskId => ({
  type: T.FETCH_NOTES_REQUEST,
  payload: { taskId },
});
export const createNote = (taskId, data) => ({
  type: T.CREATE_NOTE_REQUEST,
  payload: { taskId, data },
});

export const clearTaskDetails = () => ({ type: T.CLEAR_TASK_DETAILS });
