import * as T from './types';

const initial = {
  list: [],
  loading: false,
  error: null,
  modalOpen: false,
  creating: false,
  filters: { q: '', start: '', end: '' },
  mode: 'list', // list | calendar
};

export default function holidaysReducer(state = initial, action) {
  switch (action.type) {
    case T.FETCH_HOLIDAYS_REQUEST:
      return { ...state, loading: true, error: null };
    case T.FETCH_HOLIDAYS_SUCCESS:
      return { ...state, loading: false, list: action.payload || [] };
    case T.FETCH_HOLIDAYS_FAILURE:
      return { ...state, loading: false, error: action.error };

    case T.OPEN_HOLIDAY_MODAL:
      return { ...state, modalOpen: true };
    case T.CLOSE_HOLIDAY_MODAL:
      return { ...state, modalOpen: false };

    case T.CREATE_HOLIDAYS_REQUEST:
      return { ...state, creating: true, error: null };
    case T.CREATE_HOLIDAYS_SUCCESS:
      // append or refresh; we’ll just refresh by replacing
      return {
        ...state,
        creating: false,
        modalOpen: false,
        list: action.payload || state.list,
      };
    case T.CREATE_HOLIDAYS_FAILURE:
      return { ...state, creating: false, error: action.error };

    case T.SET_HOLIDAY_FILTERS:
      return { ...state, filters: { ...state.filters, ...action.patch } };

    case T.SET_HOLIDAY_MODE:
      return { ...state, mode: action.mode };

    default:
      return state;
  }
}
