import * as T from './types';

const initial = {
  list: [],
  loading: false,
  error: null,

  modalOpen: false,
  creating: false,

  editingHoliday: null, // ✅ single source of truth

  filters: { q: '', start: '', end: '' },
  mode: 'list',
};

export default function holidaysReducer(state = initial, action) {
  switch (action.type) {
    /* ---------- FETCH ---------- */
    case T.FETCH_HOLIDAYS_REQUEST:
      return { ...state, loading: true, error: null };

    case T.FETCH_HOLIDAYS_SUCCESS:
      return { ...state, loading: false, list: action.payload || [] };

    case T.FETCH_HOLIDAYS_FAILURE:
      return { ...state, loading: false, error: action.error };

    /* ---------- MODAL ---------- */
    case T.OPEN_HOLIDAY_MODAL:
      return {
        ...state,
        modalOpen: true,
        editingHoliday: null, // create mode
      };

    case T.OPEN_HOLIDAY_EDIT_MODAL:
      return {
        ...state,
        modalOpen: true,
        editingHoliday: action.payload, // edit mode
      };

    case T.CLOSE_HOLIDAY_MODAL:
      return {
        ...state,
        modalOpen: false,
        editingHoliday: null,
      };

    /* ---------- CREATE ---------- */
    case T.CREATE_HOLIDAYS_REQUEST:
      return { ...state, creating: true, error: null };

    case T.CREATE_HOLIDAYS_SUCCESS:
      return {
        ...state,
        creating: false,
        modalOpen: false,
      };

    case T.CREATE_HOLIDAYS_FAILURE:
      return { ...state, creating: false, error: action.error };

    /* ---------- UPDATE / DELETE ---------- */
    case T.UPDATE_HOLIDAY_SUCCESS:
    case T.DELETE_HOLIDAY_SUCCESS:
      return {
        ...state,
        loading: false,
      };

    /* ---------- FILTER / MODE ---------- */
    case T.SET_HOLIDAY_FILTERS:
      return { ...state, filters: { ...state.filters, ...action.patch } };

    case T.OPEN_HOLIDAY_EDIT_MODAL:
      return {
        ...state,
        modalOpen: false, // add modal band
        editingHoliday: action.payload,
      };

    case T.SET_HOLIDAY_MODE:
      return { ...state, mode: action.mode };

    default:
      return state;
  }
}
