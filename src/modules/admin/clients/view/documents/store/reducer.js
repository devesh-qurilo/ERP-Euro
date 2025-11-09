import * as T from './types';

const initial = {
  list: [],
  loading: false,
  uploading: false,
  busyIds: [], // deleting ids
  error: null,
  clientId: null,
};

export default function reducer(state = initial, action) {
  switch (action.type) {
    case T.LIST_BY_CLIENT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        clientId: action.payload.clientId,
      };
    case T.LIST_BY_CLIENT_SUCCESS:
      return { ...state, loading: false, list: action.payload };
    case T.LIST_BY_CLIENT_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case T.UPLOAD_REQUEST:
      return { ...state, uploading: true, error: null };
    case T.UPLOAD_SUCCESS:
      return { ...state, uploading: false };
    case T.UPLOAD_FAILURE:
      return { ...state, uploading: false, error: action.payload };

    case T.DELETE_REQUEST:
      return { ...state, busyIds: [...state.busyIds, action.payload.docId] };
    case T.DELETE_SUCCESS:
      return {
        ...state,
        busyIds: state.busyIds.filter(id => id !== action.meta.docId),
      };
    case T.DELETE_FAILURE:
      return {
        ...state,
        busyIds: state.busyIds.filter(id => id !== action.meta.docId),
        error: action.payload,
      };

    default:
      return state;
  }
}
