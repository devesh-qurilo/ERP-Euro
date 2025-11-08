import * as T from './types';
const initial = {
  items: [],
  loading: false,
  saving: false,
  deleting: false,
  error: null,
  filters: {},
};

export default function reducer(state = initial, action) {
  switch (action.type) {
    case T.LIST_REQUEST:
      return {
        ...state,
        loading: true,
        filters: action.payload?.filters || state.filters,
        error: null,
      };
    case T.LIST_SUCCESS:
      return { ...state, loading: false, items: action.payload || [] };
    case T.LIST_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case T.CREATE_REQUEST:
    case T.UPDATE_REQUEST:
      return { ...state, saving: true, error: null };
    case T.CREATE_SUCCESS:
    case T.UPDATE_SUCCESS:
      return { ...state, saving: false };
    case T.CREATE_FAILURE:
    case T.UPDATE_FAILURE:
      return { ...state, saving: false, error: action.payload };

    case T.DELETE_REQUEST:
      return { ...state, deleting: true, error: null };
    case T.DELETE_SUCCESS:
      return { ...state, deleting: false };
    case T.DELETE_FAILURE:
      return { ...state, deleting: false, error: action.payload };
    default:
      return state;
  }
}
