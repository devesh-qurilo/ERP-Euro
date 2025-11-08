import * as T from './types';

const initial = { item: null, loading: false, error: null };

export default function reducer(state = initial, action) {
  switch (action.type) {
    case T.VIEW_REQUEST:
      return { ...state, loading: true, error: null };
    case T.VIEW_SUCCESS:
      return { ...state, loading: false, item: action.payload };
    case T.VIEW_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}
