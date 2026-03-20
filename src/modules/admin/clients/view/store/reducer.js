import * as T from './types';

const initial = {
  item: null,
  loading: false,
  error: null,
  stats: {
    projects: null,
    invoices: null,
  },
  statsLoading: false,
};

export default function reducer(state = initial, action) {
  switch (action.type) {
    case T.VIEW_REQUEST:
      return { ...state, loading: true, error: null };
    case T.VIEW_SUCCESS:
      return { ...state, loading: false, item: action.payload };
    case T.VIEW_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case T.STATS_REQUEST:
      return { ...state, statsLoading: true };

    case T.STATS_SUCCESS:
      return {
        ...state,
        statsLoading: false,
        stats: action.payload,
      };

    case T.STATS_FAILURE:
      return { ...state, statsLoading: false };
    default:
      return state;
  }
}
