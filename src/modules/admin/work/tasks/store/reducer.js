import * as T from './types';

const initial = {
  list: [],
  busy: false,
  error: null,
  filters: { hideCompleted: false },
  q: '',
  page: 0,
  size: 200000,
  total: 0,
  view: 'list',
  scope: 'all',
  modal: { visible: false, mode: 'add', record: null },
};

export default function reducer(state = initial, action) {
  switch (action.type) {
    case T.SET_BUSY:
      return { ...state, busy: action.busy };
    case T.SET_FILTERS:
      return { ...state, filters: { ...state.filters, ...action.filters } };
    case T.SET_SEARCH:
      return { ...state, q: action.q };
    case T.SET_PAGINATION:
      return { ...state, page: action.page, size: action.size };
    case T.SET_VIEW_MODE:
      return { ...state, view: action.view };

    case T.SET_SCOPE:
      return { ...state, scope: action.scope };

    case T.FETCH_REQUEST:
      return { ...state, busy: true, error: null };
    case T.FETCH_SUCCESS: {
      const rows = Array.isArray(action.data)
        ? action.data
        : action.data?.content ?? action.data?.items ?? [];
      const total =
        action.data?.totalElements ?? action.data?.total ?? rows.length;
      return { ...state, busy: false, list: rows, total };
    }
    case T.FETCH_FAILURE:
      return { ...state, busy: false, error: action.error };

    case T.CREATE_SUCCESS:
      return { ...state, list: [action.created, ...state.list] };
    case T.UPDATE_SUCCESS:
      return {
        ...state,
        list: state.list.map(x =>
          x.id === action.updated.id ? action.updated : x,
        ),
      };
    case T.DELETE_SUCCESS:
      return { ...state, list: state.list.filter(x => x.id !== action.taskId) };

    case T.PIN_SUCCESS:
      return {
        ...state,
        list: state.list.map(x =>
          x.id === action.taskId ? { ...x, pinned: true } : x,
        ),
      };
    case T.UNPIN_SUCCESS:
      return {
        ...state,
        list: state.list.map(x =>
          x.id === action.taskId ? { ...x, pinned: false } : x,
        ),
      };

    case T.SET_MODAL:
      return { ...state, modal: { ...state.modal, ...action.modal } };

    default:
      return state;
  }
}
