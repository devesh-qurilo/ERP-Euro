import {
  FETCH_PROJECTS_REQUEST,
  FETCH_PROJECTS_SUCCESS,
  FETCH_PROJECTS_FAILURE,
  TOGGLE_PIN_PROJECT_REQUEST,
  TOGGLE_PIN_PROJECT_SUCCESS,
  TOGGLE_PIN_PROJECT_FAILURE,
  FETCH_PROJECT_METRICS_REQUEST,
  FETCH_PROJECT_METRICS_SUCCESS,
  FETCH_PROJECT_METRICS_FAILURE,
} from './actions';

const initialState = {
  list: [],
  loading: false,
  error: null,
  // metrics keyed by projectId
  metricsById: {}, // { [id]: { hoursEstimate, totalTimeLoggedMinutes, ...fullPayload } }
  metricsLoadingById: {}, // { [id]: boolean }
  metricsErrorById: {}, // { [id]: string|null }
};

export default function employeeProjectsReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_PROJECTS_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_PROJECTS_SUCCESS:
      // the API already returns "pinned": true/false
      return { ...state, loading: false, list: action.payload, error: null };
    case FETCH_PROJECTS_FAILURE:
      return { ...state, loading: false, error: action.error };

    // 🔁 optimistic update
    case TOGGLE_PIN_PROJECT_REQUEST: {
      const { projectId, desiredPinned } = action;
      return {
        ...state,
        list: state.list.map(p =>
          p.id === projectId
            ? {
                ...p,
                pinned: desiredPinned,
                pinnedAt: desiredPinned ? new Date().toISOString() : null,
              }
            : p,
        ),
      };
    }
    case TOGGLE_PIN_PROJECT_SUCCESS:
      return state; // nothing else; server already accepted

    case TOGGLE_PIN_PROJECT_FAILURE: {
      const { projectId, prevPinned } = action;
      // rollback
      return {
        ...state,
        list: state.list.map(p =>
          p.id === projectId
            ? {
                ...p,
                pinned: prevPinned,
                pinnedAt: prevPinned
                  ? p.pinnedAt || new Date().toISOString()
                  : null,
              }
            : p,
        ),
        error: action.error || null,
      };
    }

    case FETCH_PROJECT_METRICS_REQUEST: {
      const id = action.projectId;
      return {
        ...state,
        metricsLoadingById: { ...state.metricsLoadingById, [id]: true },
        metricsErrorById: { ...state.metricsErrorById, [id]: null },
      };
    }
    case FETCH_PROJECT_METRICS_SUCCESS: {
      const { projectId, payload } = action;
      return {
        ...state,
        metricsById: { ...state.metricsById, [projectId]: payload },
        metricsLoadingById: { ...state.metricsLoadingById, [projectId]: false },
      };
    }
    case FETCH_PROJECT_METRICS_FAILURE: {
      const { projectId, error } = action;
      return {
        ...state,
        metricsLoadingById: { ...state.metricsLoadingById, [projectId]: false },
        metricsErrorById: {
          ...state.metricsErrorById,
          [projectId]: error || 'Failed to load',
        },
      };
    }

    default:
      return state;
  }
}
