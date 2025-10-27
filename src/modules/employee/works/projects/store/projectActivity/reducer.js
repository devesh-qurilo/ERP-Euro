import {
  FETCH_PROJECT_ACTIVITY_REQUEST,
  FETCH_PROJECT_ACTIVITY_SUCCESS,
  FETCH_PROJECT_ACTIVITY_FAILURE,
} from './types';

const initial = {
  byProjectId: {},
  loadingById: {},
  errorById: {},
};

export default function projectActivityReducer(state = initial, action) {
  switch (action.type) {
    case FETCH_PROJECT_ACTIVITY_REQUEST: {
      const id = action.projectId;
      return {
        ...state,
        loadingById: { ...state.loadingById, [id]: true },
        errorById: { ...state.errorById, [id]: null },
      };
    }
    case FETCH_PROJECT_ACTIVITY_SUCCESS: {
      const { projectId, payload } = action;
      return {
        ...state,
        byProjectId: { ...state.byProjectId, [projectId]: payload || [] },
        loadingById: { ...state.loadingById, [projectId]: false },
      };
    }
    case FETCH_PROJECT_ACTIVITY_FAILURE: {
      const { projectId, error } = action;
      return {
        ...state,
        loadingById: { ...state.loadingById, [projectId]: false },
        errorById: { ...state.errorById, [projectId]: error || 'Failed' },
      };
    }
    default:
      return state;
  }
}
