import * as T from './types';

const initial = {
  mode: 'list',
  filters: { q: '', type: 'All', status: 'All' },
  list: [],
  loading: false,
  error: null,

  quota: [],
  quotaLoading: false,
  quotaError: null,

  modalOpen: false,
  applying: false,

  busyIds: [], // approve/reject/delete in-flight
};

export default function reducer(state = initial, action) {
  switch (action.type) {
    case T.SET_LEAVES_MODE:
      return { ...state, mode: action.mode };

    case T.SET_LEAVES_FILTERS:
      return { ...state, filters: { ...state.filters, ...action.filters } };

    case T.FETCH_LEAVES_REQUEST:
      return { ...state, loading: true, error: null };
    case T.FETCH_LEAVES_SUCCESS:
      return { ...state, loading: false, list: action.payload };
    case T.FETCH_LEAVES_FAILURE:
      return { ...state, loading: false, error: action.error };

    case T.FETCH_QUOTA_REQUEST:
      return { ...state, quotaLoading: true, quotaError: null };
    case T.FETCH_QUOTA_SUCCESS:
      return { ...state, quotaLoading: false, quota: action.payload };
    case T.FETCH_QUOTA_FAILURE:
      return { ...state, quotaLoading: false, quotaError: action.error };

    case T.OPEN_LEAVE_MODAL:
      return { ...state, modalOpen: true };
    case T.CLOSE_LEAVE_MODAL:
      return { ...state, modalOpen: false };

    case T.APPLY_LEAVES_REQUEST:
      return { ...state, applying: true };
    case T.APPLY_LEAVES_SUCCESS:
      // backend returns created items array; prepend to list
      return {
        ...state,
        applying: false,
        modalOpen: false,
        list: [...action.payload, ...state.list],
      };
    case T.APPLY_LEAVES_FAILURE:
      return { ...state, applying: false };

    case T.PATCH_STATUS_REQUEST:
    case T.DELETE_LEAVE_REQUEST:
      return { ...state, busyIds: [...state.busyIds, action.leaveId] };

    case T.PATCH_STATUS_SUCCESS:
      return {
        ...state,
        busyIds: state.busyIds.filter(id => id !== action.payload.id),
        list: state.list.map(x =>
          x.id === action.payload.id ? action.payload : x,
        ),
      };

    case T.DELETE_LEAVE_SUCCESS:
      return {
        ...state,
        busyIds: state.busyIds.filter(id => id !== action.leaveId),
        list: state.list.filter(x => x.id !== action.leaveId),
      };

    case T.PATCH_STATUS_FAILURE:
    case T.DELETE_LEAVE_FAILURE:
      return {
        ...state,
        busyIds: state.busyIds.filter(
          id => id !== (action.leaveId || action.id),
        ),
      };

    default:
      return state;
  }
}
