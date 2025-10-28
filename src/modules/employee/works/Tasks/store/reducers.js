// src/modules/employee/works/tasks/store/reducers.js
import * as T from './types';

const initialState = {
  list: [],
  loading: false,
  error: null,
  statuses: [],
  statusesLoading: false,
  statusesError: null,
};

export default function employeeTasksReducer(state = initialState, action) {
  switch (action.type) {
    case T.FETCH_MY_TASKS_REQUEST:
      return { ...state, loading: true, error: null };
    case T.FETCH_MY_TASKS_SUCCESS:
      return { ...state, loading: false, list: action.payload, error: null };
    case T.FETCH_MY_TASKS_FAILURE:
      return { ...state, loading: false, error: action.error };

    case T.FETCH_STATUSES_REQUEST:
      return { ...state, statusesLoading: true, statusesError: null };
    case T.FETCH_STATUSES_SUCCESS:
      return {
        ...state,
        statusesLoading: false,
        statuses: action.payload || [],
      };
    case T.FETCH_STATUSES_FAILURE:
      return {
        ...state,
        statusesLoading: false,
        statusesError: action.error || 'Failed',
      };

    // 🔁 Optimistic update on request
    case T.TOGGLE_PIN_TASK_REQUEST: {
      const { taskId, desiredPinned } = action;
      return {
        ...state,
        list: state.list.map(t =>
          t.id === taskId
            ? {
                ...t,
                pinned: desiredPinned,
                pinnedAt: desiredPinned ? new Date().toISOString() : null,
              }
            : t,
        ),
      };
    }

    // server ok -> nothing extra required
    case T.TOGGLE_PIN_TASK_SUCCESS:
      return state;

    // rollback on failure
    case T.TOGGLE_PIN_TASK_FAILURE: {
      const { taskId, prevPinned } = action;
      return {
        ...state,
        list: state.list.map(t =>
          t.id === taskId
            ? {
                ...t,
                pinned: prevPinned,
                pinnedAt: prevPinned
                  ? t.pinnedAt || new Date().toISOString()
                  : null,
              }
            : t,
        ),
        error: action.error || null,
      };
    }

    default:
      return state;
  }
}
