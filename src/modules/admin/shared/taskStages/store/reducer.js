import * as T from './types';

const initial = { list: [], busy: false, error: null };

export default function reducer(state = initial, action) {
  switch (action.type) {
    case T.STAGES_FETCH_REQ:
      return { ...state, busy: true, error: null };
    case T.STAGES_FETCH_OK:
      return { ...state, busy: false, list: action.data || [] };
    case T.STAGES_FETCH_ERR:
      return { ...state, busy: false, error: action.error || 'Failed' };
    default:
      return state;
  }
}
