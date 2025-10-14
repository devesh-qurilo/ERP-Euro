import {
  FETCH_PROJECTS_REQUEST,
  FETCH_PROJECTS_SUCCESS,
  FETCH_PROJECTS_FAILURE,
  TOGGLE_PIN_PROJECT_REQUEST,
  TOGGLE_PIN_PROJECT_SUCCESS,
  TOGGLE_PIN_PROJECT_FAILURE,
} from './actions';

const initialState = {
  list: [],
  loading: false,
  error: null,
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

    default:
      return state;
  }
}
