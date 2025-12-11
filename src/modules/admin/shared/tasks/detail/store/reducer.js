import * as T from './types';

const initial = {
  taskId: null,
  tab: 'files',

  files: { list: [], busy: false, error: null },
  subs: { list: [], busy: false, error: null },
  notes: { list: [], busy: false, error: null },
  timesheet: { list: [], busy: false, error: null },
};

export default function reducer(state = initial, action) {
  switch (action.type) {
    case T.SET_TASK_ID:
      return { ...state, taskId: action.taskId };
    case T.SET_TAB:
      return { ...state, tab: action.tab };

    /* Files */
    case T.FILES_FETCH_REQ:
      return { ...state, files: { ...state.files, busy: true, error: null } };
    case T.FILES_FETCH_OK:
      return {
        ...state,
        files: { list: action.data || [], busy: false, error: null },
      };
    case T.FILES_FETCH_ERR:
      return {
        ...state,
        files: { ...state.files, busy: false, error: action.error },
      };

    /* Subtasks */
    case T.SUBS_FETCH_REQ:
      return { ...state, subs: { ...state.subs, busy: true, error: null } };
    case T.SUBS_FETCH_OK:
      return {
        ...state,
        subs: { list: action.data || [], busy: false, error: null },
      };
    case T.SUBS_FETCH_ERR:
      return {
        ...state,
        subs: { ...state.subs, busy: false, error: action.error },
      };
    /* Timesheet */
    case T.TIMESHEET_FETCH_REQ:
      return {
        ...state,
        timesheet: { ...state.timesheet, busy: true, error: null },
      };

    case T.TIMESHEET_FETCH_OK:
      return {
        ...state,
        timesheet: { list: action.data || [], busy: false, error: null },
      };

    case T.TIMESHEET_FETCH_ERR:
      return {
        ...state,
        timesheet: { ...state.timesheet, busy: false, error: action.error },
      };

    /* Notes */
    case T.NOTES_FETCH_REQ:
      return { ...state, notes: { ...state.notes, busy: true, error: null } };
    case T.NOTES_FETCH_OK:
      return {
        ...state,
        notes: { list: action.data || [], busy: false, error: null },
      };
    case T.NOTES_FETCH_ERR:
      return {
        ...state,
        notes: { ...state.notes, busy: false, error: action.error },
      };

    default:
      return state;
  }
}
