import {
  FETCH_PROJECT_NOTES_REQUEST,
  FETCH_PROJECT_NOTES_SUCCESS,
  FETCH_PROJECT_NOTES_FAILURE,
} from './types';

const initial = {
  byProjectId: {}, // id -> note[]
  loadingById: {}, // id -> bool
  errorById: {}, // id -> string|null
};

export default function projectNotesReducer(state = initial, action) {
  switch (action.type) {
    case FETCH_PROJECT_NOTES_REQUEST: {
      const id = action.projectId;
      return {
        ...state,
        loadingById: { ...state.loadingById, [id]: true },
        errorById: { ...state.errorById, [id]: null },
      };
    }
    case FETCH_PROJECT_NOTES_SUCCESS: {
      const { projectId, payload } = action;
      // Backend sometimes returns nested array accidentally (e.g. [[{…}]]) — normalize:
      const list =
        Array.isArray(payload) &&
        payload.length === 1 &&
        Array.isArray(payload[0])
          ? payload[0]
          : payload || [];
      return {
        ...state,
        byProjectId: { ...state.byProjectId, [projectId]: list },
        loadingById: { ...state.loadingById, [projectId]: false },
      };
    }
    case FETCH_PROJECT_NOTES_FAILURE: {
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
