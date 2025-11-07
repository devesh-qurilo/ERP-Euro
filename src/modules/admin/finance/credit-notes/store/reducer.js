import * as T from './types';

const initial = {
  items: [],
  loading: false,
  editing: false,
  deleting: false,
  error: null,
};

export default function reducer(state = initial, action) {
  switch (action.type) {
    case T.LIST_REQUEST:
      return { ...state, loading: true, error: null };
    case T.LIST_SUCCESS:
      return { ...state, loading: false, items: action.payload || [] };
    case T.LIST_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case T.UPDATE_REQUEST:
      return { ...state, editing: true, error: null };
    case T.UPDATE_SUCCESS:
      return { ...state, editing: false };
    case T.UPDATE_FAILURE:
      return { ...state, editing: false, error: action.payload };

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
