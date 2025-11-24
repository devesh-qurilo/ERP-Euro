import * as T from './types';

const initial = {
  list: [],
  loading: false,
  error: null,
  busyIds: [],
  mode: 'list',
  filters: { q: '', status: 'All' },
  modalOpen: false,
  editing: null,
  metricsById: {},

  // categories for projects
  categories: [],
  categoriesLoading: false,
  categoryBusy: false,
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

    case T.AWP_SET_METRICS:
      return {
        ...state,
        metricsById: {
          ...state.metricsById,
          [action.projectId]: action.metrics,
        },
      };

    /* --- Category handling --- */
    case T.AWP_CAT_LIST:
      return { ...state, categoriesLoading: true };
    case T.AWP_CAT_SET:
      return {
        ...state,
        categoriesLoading: false,
        categories: action.categories || [],
      };
    case T.AWP_CAT_ERROR:
      return { ...state, categoriesLoading: false, error: action.error };

    case T.AWP_CAT_CREATE:
    case T.AWP_CAT_DELETE:
      return { ...state, categoryBusy: true };
    case T.AWP_CAT_CREATE_SUCCESS:
    case T.AWP_CAT_DELETE_SUCCESS:
      return { ...state, categoryBusy: false };
    case T.AWP_CAT_CREATE_FAILURE:
    case T.AWP_CAT_DELETE_FAILURE:
      return { ...state, categoryBusy: false, error: action.error };

    default:
      return state;
  }
}
