import * as T from './types';

const initial = {
  list: [],
  loading: false,
  error: null,
  filters: { q: '' },

  viewOpen: false,
  viewing: null,

  editOpen: false,
  editing: null,
  editBusy: false,

  busyIds: [],
};

export default function clientsViewCreditNotesReducer(state = initial, action) {
  switch (action.type) {
    case T.SET_FILTERS:
      return { ...state, filters: { ...state.filters, ...action.payload } };

    case T.LIST_BY_CLIENT_REQUEST:
      return { ...state, loading: true, error: null };
    case T.LIST_BY_CLIENT_SUCCESS:
      return { ...state, loading: false, list: action.payload || [] };
    case T.LIST_BY_CLIENT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload || 'Failed to load',
      };

    case T.OPEN_VIEW:
      return { ...state, viewOpen: true, viewing: action.payload };
    case T.CLOSE_VIEW:
      return { ...state, viewOpen: false, viewing: null };

    case T.OPEN_EDIT:
      return { ...state, editOpen: true, editing: action.payload };
    case T.CLOSE_EDIT:
      return { ...state, editOpen: false, editing: null };

    case T.UPDATE_REQUEST:
      return { ...state, editBusy: true };
    case T.UPDATE_SUCCESS:
      return { ...state, editBusy: false, editOpen: false, editing: null };
    case T.UPDATE_FAILURE:
      return {
        ...state,
        editBusy: false,
        error: action.payload || 'Update failed',
      };

    case T.DELETE_REQUEST:
      return { ...state, busyIds: [...state.busyIds, action.payload.id] };
    case T.DELETE_SUCCESS:
    case T.DELETE_FAILURE:
      return {
        ...state,
        busyIds: state.busyIds.filter(id => id !== action.meta?.id),
      };

    default:
      return state;
  }
}
