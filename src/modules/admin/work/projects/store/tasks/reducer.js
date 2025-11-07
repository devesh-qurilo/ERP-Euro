import { TASKS_SET, TASKS_BUSY, TASKS_ERROR } from './types';

const initial = {
  byProject: {}, // { [projectId]: Task[] }
  busy: false,
  error: null,
};

export default function tasksReducer(state = initial, action) {
  switch (action.type) {
    case TASKS_BUSY:
      return { ...state, busy: !!action.busy };
    case TASKS_ERROR:
      return { ...state, error: action.error || null };
    case TASKS_SET: {
      const { projectId, items } = action;
      return {
        ...state,
        byProject: {
          ...state.byProject,
          [projectId]: Array.isArray(items) ? items : [],
        },
        busy: false,
        error: null,
      };
    }
    default:
      return state;
  }
}
