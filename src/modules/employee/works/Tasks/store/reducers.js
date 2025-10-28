// src/modules/employee/works/tasks/store/reducers.js
import * as T from './types';

const initialState = {
  list: [],
  loading: false,
  error: null,
};

export default function employeeTasksReducer(state = initialState, action) {
  switch (action.type) {
    case T.FETCH_MY_TASKS_REQUEST:
      return { ...state, loading: true, error: null };
    case T.FETCH_MY_TASKS_SUCCESS:
      return { ...state, loading: false, list: action.payload, error: null };
    case T.FETCH_MY_TASKS_FAILURE:
      return { ...state, loading: false, error: action.error };

    // local-only pin toggle
    case T.TOGGLE_PIN_TASK:
      return {
        ...state,
        list: state.list.map(t =>
          t.id === action.taskId ? { ...t, pinned: !t.pinned } : t,
        ),
      };

    default:
      return state;
  }
}
