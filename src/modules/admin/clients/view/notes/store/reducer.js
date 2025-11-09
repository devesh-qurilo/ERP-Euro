import * as T from './types';

const initial = {
  clientId: null,
  list: [],
  loading: false,
  error: null,
  busyIds: [], // for delete/update row-level busy
  formOpen: false,
  editing: null, // note object when editing
  viewOpen: false,
  viewItem: null,
  submitting: false, // create/update busy
};

export default function reducer(state = initial, action) {
  switch (action.type) {
    case T.LIST_REQ:
      return {
        ...state,
        loading: true,
        error: null,
        clientId: action.payload.clientId,
      };
    case T.LIST_OK:
      return { ...state, loading: false, list: action.payload };
    case T.LIST_ERR:
      return { ...state, loading: false, error: action.payload };

    case T.OPEN_FORM:
      return { ...state, formOpen: true, editing: action.payload || null };
    case T.CLOSE_FORM:
      return { ...state, formOpen: false, editing: null, submitting: false };

    case T.OPEN_VIEW:
      return { ...state, viewOpen: true, viewItem: action.payload };
    case T.CLOSE_VIEW:
      return { ...state, viewOpen: false, viewItem: null };

    case T.CREATE_REQ:
    case T.UPDATE_REQ:
      return { ...state, submitting: true, error: null };

    case T.CREATE_OK:
    case T.UPDATE_OK:
      return { ...state, submitting: false, formOpen: false, editing: null };

    case T.CREATE_ERR:
    case T.UPDATE_ERR:
      return { ...state, submitting: false, error: action.payload };

    case T.DELETE_REQ:
      return { ...state, busyIds: [...state.busyIds, action.payload.noteId] };
    case T.DELETE_OK:
      return {
        ...state,
        busyIds: state.busyIds.filter(id => id !== action.meta.noteId),
      };
    case T.DELETE_ERR:
      return {
        ...state,
        busyIds: state.busyIds.filter(id => id !== action.meta.noteId),
        error: action.payload,
      };

    default:
      return state;
  }
}
