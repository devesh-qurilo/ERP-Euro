import * as T from './types';

const initial = {
  loading: false,
  saving: false,
  items: [],
  page: 0,
  size: 200000,
  total: 0,
  error: null,

  query: {
    page: 0,
    size: 200000,
    search: '',
    category: 'All',
    status: 'All',
    country: 'All',
  },
  modalVisible: false,
  modalMode: 'view', // view | edit | create
  selected: null,
};

export default function adminClientsReducer(state = initial, action) {
  switch (action.type) {
    case T.SET_CLIENT_QUERY:
      return { ...state, query: { ...state.query, ...action.query } };

    case T.SET_CLIENT_MODAL:
      return {
        ...state,
        modalVisible: action.visible,
        modalMode: action.mode ?? state.modalMode,
      };

    case T.SET_SELECTED_CLIENT:
      return { ...state, selected: action.client };

    case T.FETCH_CLIENTS_REQUEST:
      return { ...state, loading: true, error: null };
    case T.FETCH_CLIENTS_SUCCESS: {
      const d = action.payload;
      const content = Array.isArray(d) ? d : d?.content || [];
      const page = d?.page ?? 0;
      const size = d?.size ?? content.length;
      const total = d?.totalElements ?? content.length;
      return { ...state, loading: false, items: content, page, size, total };
    }
    case T.FETCH_CLIENTS_FAILURE:
      return { ...state, loading: false, error: action.error };

    case T.CREATE_CLIENT_REQUEST:
    case T.UPDATE_CLIENT_REQUEST:
    case T.DELETE_CLIENT_REQUEST:
      return { ...state, saving: true };

    case T.CREATE_CLIENT_SUCCESS:
      return {
        ...state,
        saving: false,
        items: [action.payload, ...state.items],
      };
    // case T.UPDATE_CLIENT_SUCCESS:
    //   return {
    //     ...state,
    //     saving: false,
    //     items: state.items.map(x =>
    //       x.id === action.payload.id ? action.payload : x,
    //     ),
    //     selected:
    //       state.selected?.id === action.payload.id
    //         ? action.payload
    //         : state.selected,
    //   };

    case T.UPDATE_CLIENT_SUCCESS: {
      const { id } = action.payload || {};
      // we immediately refresh list after, so just noop/mark saving=false
      return { ...state, saving: false };
    }
    case T.DELETE_CLIENT_SUCCESS:
      return {
        ...state,
        saving: false,
        items: state.items.filter(x => x.id !== action.id),
      };

    case T.CREATE_CLIENT_FAILURE:
    case T.UPDATE_CLIENT_FAILURE:
    case T.DELETE_CLIENT_FAILURE:
      return { ...state, saving: false, error: action.error };

    default:
      return state;
  }
}
