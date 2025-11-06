import * as T from './types';

const initial = {
  list: [],
  loading: false,
  error: null,
  busyIds: [],
  mode: 'list', // list | calendar | pinned | archived
  filters: { q: '', status: 'All' },
  modalOpen: false,
  editing: null,
};

export default function reducer(state = initial, action) {
  switch (action.type) {
    case T.AWP_SET_MODE:
      return { ...state, mode: action.mode };

    case T.AWP_SET_FILTERS:
      return { ...state, filters: { ...state.filters, ...action.patch } };

    case T.AWP_FETCH_ALL:
      return { ...state, loading: true, error: null };

    case T.AWP_SET_ALL:
      return { ...state, loading: false, list: action.list };

    case T.AWP_ERROR:
      return { ...state, loading: false, error: action.error, busyIds: [] };

    case T.AWP_BUSY: {
      const { id, on } = action;
      return {
        ...state,
        busyIds: on
          ? Array.from(new Set([...state.busyIds, id]))
          : state.busyIds.filter(x => x !== id),
      };
    }

    case T.AWP_OPEN_MODAL:
      return { ...state, modalOpen: true, editing: action.editing || null };

    case T.AWP_CLOSE_MODAL:
      return { ...state, modalOpen: false, editing: null };

    default:
      return state;
  }
}
