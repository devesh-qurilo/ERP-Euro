import * as T from './types';

const initial = {
  projectId: null,
  items: [],
  loading: false,
  error: null,
};

export default function AdminprojectActivityReducer(state = initial, action) {
  switch (action.type) {
    case T.LIST_BY_PROJECT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        projectId: action.payload.projectId,
      };
    case T.LIST_BY_PROJECT_SUCCESS:
      return {
        ...state,
        loading: false,
        items: Array.isArray(action.payload) ? action.payload : [],
      };
    case T.LIST_BY_PROJECT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload || 'Failed to load activity',
      };
    default:
      return state;
  }
}
