// src/modules/employee/works/projects/store/taskDetails/reducer.js
import * as T from './types';

const initialListState = { data: [], loading: false, error: null };

const initialState = {
  files: { ...initialListState },
  subtasks: { ...initialListState },
  timesheets: { ...initialListState },
  notes: { ...initialListState },
};

export default function taskDetailsReducer(state = initialState, action) {
  switch (action.type) {
    // FILES
    case T.FETCH_TASK_FILES_REQUEST:
      return {
        ...state,
        files: { ...state.files, loading: true, error: null },
      };
    case T.FETCH_TASK_FILES_SUCCESS:
      return {
        ...state,
        files: { data: action.payload, loading: false, error: null },
      };
    case T.FETCH_TASK_FILES_FAILURE:
      return {
        ...state,
        files: { ...state.files, loading: false, error: action.error },
      };

    case T.UPLOAD_TASK_FILE_REQUEST:
      return {
        ...state,
        files: { ...state.files, loading: true, error: null },
      };
    case T.UPLOAD_TASK_FILE_SUCCESS:
      return {
        ...state,
        files: {
          data: [action.payload, ...state.files.data],
          loading: false,
          error: null,
        },
      };
    case T.UPLOAD_TASK_FILE_FAILURE:
      return {
        ...state,
        files: { ...state.files, loading: false, error: action.error },
      };

    // SUBTASKS
    case T.FETCH_SUBTASKS_REQUEST:
      return {
        ...state,
        subtasks: { ...state.subtasks, loading: true, error: null },
      };
    case T.FETCH_SUBTASKS_SUCCESS:
      return {
        ...state,
        subtasks: { data: action.payload, loading: false, error: null },
      };
    case T.FETCH_SUBTASKS_FAILURE:
      return {
        ...state,
        subtasks: { ...state.subtasks, loading: false, error: action.error },
      };

    case T.CREATE_SUBTASK_REQUEST:
      return {
        ...state,
        subtasks: { ...state.subtasks, loading: true, error: null },
      };
    case T.CREATE_SUBTASK_SUCCESS:
      return {
        ...state,
        subtasks: {
          data: [action.payload, ...state.subtasks.data],
          loading: false,
          error: null,
        },
      };
    case T.CREATE_SUBTASK_FAILURE:
      return {
        ...state,
        subtasks: { ...state.subtasks, loading: false, error: action.error },
      };

    // TIMESHEETS
    case T.FETCH_TIMESHEETS_REQUEST:
      return {
        ...state,
        timesheets: { ...state.timesheets, loading: true, error: null },
      };
    case T.FETCH_TIMESHEETS_SUCCESS:
      return {
        ...state,
        timesheets: { data: action.payload, loading: false, error: null },
      };
    case T.FETCH_TIMESHEETS_FAILURE:
      return {
        ...state,
        timesheets: {
          ...state.timesheets,
          loading: false,
          error: action.error,
        },
      };

    // NOTES
    case T.FETCH_NOTES_REQUEST:
      return {
        ...state,
        notes: { ...state.notes, loading: true, error: null },
      };
    case T.FETCH_NOTES_SUCCESS:
      return {
        ...state,
        notes: { data: action.payload, loading: false, error: null },
      };
    case T.FETCH_NOTES_FAILURE:
      return {
        ...state,
        notes: { ...state.notes, loading: false, error: action.error },
      };

    case T.CREATE_NOTE_REQUEST:
      return {
        ...state,
        notes: { ...state.notes, loading: true, error: null },
      };
    case T.CREATE_NOTE_SUCCESS:
      return {
        ...state,
        notes: {
          data: [action.payload, ...state.notes.data],
          loading: false,
          error: null,
        },
      };
    case T.CREATE_NOTE_FAILURE:
      return {
        ...state,
        notes: { ...state.notes, loading: false, error: action.error },
      };

    // CLEAR
    case T.CLEAR_TASK_DETAILS:
      return initialState;

    default:
      return state;
  }
}
