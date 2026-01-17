import * as T from './types';

const initial = {
  source: { kind: 'all', id: null }, // 👈 controls which API to call
  list: [],
  myList: [],
  busy: false,
  error: null,
  filters: { hideCompleted: false, status: '', duration: '' },
  q: '',
  view: 'list',
  modal: { visible: false, mode: 'add', record: null },
  total: 0,
};

export default function reducer(state = initial, action) {
  switch (action.type) {
    case T.SET_SOURCE:
      return { ...state, source: action.source };
    case T.SET_FILTERS:
      return { ...state, filters: { ...state.filters, ...action.filters } };
    case T.SET_SEARCH:
      return { ...state, q: action.q };
    case T.SET_VIEW:
      return { ...state, view: action.view };
    case T.SET_MODAL:
      return { ...state, modal: { ...state.modal, ...action.modal } };
    case T.SET_BUSY:
      return { ...state, busy: action.busy };

    case T.FETCH_OK: {
      const rows = Array.isArray(action.data)
        ? action.data
        : action.data?.content ?? action.data?.items ?? [];
      const total =
        action.data?.totalElements ?? action.data?.total ?? rows.length;
      return { ...state, list: rows, total, busy: false, error: null };
    }
    case T.FETCH_FAIL:
      return { ...state, busy: false, error: action.error };

    case T.CREATE_OK:
      return { ...state, list: [action.created, ...state.list] };
    case T.UPDATE_OK:
      return {
        ...state,
        list: state.list.map(x =>
          x.id === action.updated.id ? action.updated : x,
        ),
      };
    case T.DELETE_OK:
      return { ...state, list: state.list.filter(x => x.id !== action.taskId) };

    case T.PIN_OK:
      return {
        ...state,
        list: state.list.map(x =>
          x.id === action.taskId ? { ...x, pinned: true } : x,
        ),
      };
    case T.UNPIN_OK:
      return {
        ...state,
        list: state.list.map(x =>
          x.id === action.taskId ? { ...x, pinned: false, pinnedAt: null } : x,
        ),
      };
    case T.FETCH_MY_TASKS_REQUEST:
      return { ...state, loading: true, error: null };

    case T.FETCH_MY_TASKS_SUCCESS:
      return { ...state, loading: false, myList: action.payload || [] };

    case T.FETCH_MY_TASKS_FAILURE:
      return { ...state, loading: false, error: action.error };

    default:
      return state;
  }
}
