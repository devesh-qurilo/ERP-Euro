import * as T from './types';

const initial = { items: [], loading: false, error: null, clientId: null };

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
      return { ...state, loading: false, items: action.payload || [] };
    case T.LIST_BY_CLIENT_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}
