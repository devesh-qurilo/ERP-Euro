import * as T from './types';

const initial = {
  clientId: null,
  items: [],
  loading: false,
  error: null,
};

export default function clientsViewInvoicesReducer(state = initial, action) {
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
        error: action.payload || 'Failed to load invoices',
      };
    default:
      return state;
  }
}
