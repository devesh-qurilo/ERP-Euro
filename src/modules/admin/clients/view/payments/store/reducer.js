import * as T from './types';

const initial = {
  clientId: null,
  items: [],
  loading: false,
  error: null,

  viewOpen: false,
  viewing: null,

  editOpen: false,
  editing: null,

  busy: false,
  busyIds: [],

  createOpen: false,
  creatingPreset: null,
  createBusy: false,
};

export default function clientsViewPaymentsReducer(state = initial, action) {
  switch (action.type) {
    case T.LIST_BY_CLIENT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        clientId: action.payload.clientId,
      };
    case T.LIST_BY_CLIENT_SUCCESS:
      return {
        ...state,
        loading: false,
        items: Array.isArray(action.payload) ? action.payload : [],
      };
    case T.LIST_BY_CLIENT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload || 'Failed to load payments',
      };

    case T.VIEW_OPEN:
      return { ...state, viewOpen: true, viewing: action.payload };
    case T.VIEW_CLOSE:
      return { ...state, viewOpen: false, viewing: null };

    case T.EDIT_OPEN:
      return { ...state, editOpen: true, editing: action.payload };
    case T.EDIT_CLOSE:
      return { ...state, editOpen: false, editing: null };

    case T.UPDATE_REQUEST:
      return {
        ...state,
        busy: true,
        busyIds: [...state.busyIds, action.payload.paymentId],
      };
    case T.UPDATE_SUCCESS:
      return {
        ...state,
        busy: false,
        busyIds: state.busyIds.filter(id => id !== action.payload.id),
        editOpen: false,
        editing: null,
      };
    case T.UPDATE_FAILURE:
      return {
        ...state,
        busy: false,
        busyIds: state.busyIds.filter(id => id !== action.meta?.paymentId),
        error: action.payload || 'Update failed',
      };

    case T.DELETE_REQUEST:
      return {
        ...state,
        busy: true,
        busyIds: [...state.busyIds, action.payload.paymentId],
      };
    case T.DELETE_SUCCESS:
      return {
        ...state,
        busy: false,
        busyIds: state.busyIds.filter(id => id !== action.meta?.paymentId),
      };
    case T.DELETE_FAILURE:
      return {
        ...state,
        busy: false,
        busyIds: state.busyIds.filter(id => id !== action.meta?.paymentId),
        error: action.payload || 'Delete failed',
      };
    case T.CREATE_OPEN:
      return {
        ...state,
        createOpen: true,
        creatingPreset: action.payload || null,
      };
    case T.CREATE_CLOSE:
      return { ...state, createOpen: false, creatingPreset: null };

    case T.CREATE_REQUEST:
      return { ...state, createBusy: true, error: null };
    case T.CREATE_SUCCESS:
      return {
        ...state,
        createBusy: false,
        createOpen: false,
        creatingPreset: null,
      };
    case T.CREATE_FAILURE:
      return {
        ...state,
        createBusy: false,
        error: action.payload || 'Create failed',
      };

    default:
      return state;
  }
}
