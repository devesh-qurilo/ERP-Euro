import * as T from './types';

const initial = {
  items: [],
  loading: false,
  creating: false,
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

    case T.CREATE_REQUEST:
      return { ...state, creating: true, error: null };
    case T.CREATE_SUCCESS:
      return {
        ...state,
        creating: false,
        // append created
        items: [...(state.items || []), action.payload],
      };
    case T.CREATE_FAILURE:
      return { ...state, creating: false, error: action.payload };

    case T.DELETE_REQUEST:
      return { ...state, deleting: true, error: null };
    case T.DELETE_SUCCESS:
      return {
        ...state,
        deleting: false,
        items: (state.items || []).filter(
          i => String(i.id) !== String(action.payload.id),
        ),
      };
    case T.DELETE_FAILURE:
      return { ...state, deleting: false, error: action.payload };

    default:
      return state;
  }
}
