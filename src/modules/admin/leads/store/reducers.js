// src/modules/admin/leads/store/reducer.js
import * as T from './types';

const initial = {
  list: [],
  loading: false,
  error: null,
  filters: {
    q: '',
    source: 'All',
    owner: 'All',
    status: 'All',
    start: '',
    end: '',
  },
  busyIds: {}, // per-row spinners for destructive ops
};

export default function adminLeadsReducer(state = initial, action) {
  switch (action.type) {
    case T.FETCH_ADMIN_LEADS_REQUEST:
      return { ...state, loading: true, error: null };
    case T.FETCH_ADMIN_LEADS_SUCCESS:
      return { ...state, loading: false, list: action.payload };
    case T.FETCH_ADMIN_LEADS_FAILURE:
      return { ...state, loading: false, error: action.error };

    case T.SET_ADMIN_LEADS_FILTERS:
      return { ...state, filters: { ...state.filters, ...action.filters } };

    case T.DELETE_ADMIN_LEAD_REQUEST:
    case T.UPDATE_LEAD_REQUEST:
      return { ...state, busyIds: { ...state.busyIds, [action.id]: true } };

    case T.DELETE_ADMIN_LEAD_SUCCESS:
      return {
        ...state,
        list: state.list.filter(x => x.id !== action.id),
        busyIds: { ...state.busyIds, [action.id]: false },
      };

    case T.UPDATE_LEAD_SUCCESS:
      return {
        ...state,
        list: state.list.map(x =>
          x.id === action.payload.id ? action.payload : x,
        ),
        busyIds: { ...state.busyIds, [action.payload.id]: false },
      };

    case T.DELETE_ADMIN_LEAD_FAILURE:
    case T.UPDATE_LEAD_FAILURE:
      return {
        ...state,
        busyIds: { ...state.busyIds, [action.id]: false },
        error: action.error || 'Action failed',
      };

    default:
      return state;
  }
}
