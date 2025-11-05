// src/modules/admin/hr/attendance/store/reducers.js
import {
  ATT_SET_FILTERS,
  ATT_SET_MODE,
  ATT_OPEN_MODAL,
  ATT_CLOSE_MODAL,
  ATT_FETCH_LIST,
  ATT_FETCH_LIST_SUCCESS,
  ATT_FETCH_LIST_ERROR,
  ATT_FETCH_MEMBER,
  ATT_FETCH_MEMBER_SUCCESS,
  ATT_FETCH_MEMBER_ERROR,
  ATT_MARK_DATES,
  ATT_MARK_MONTH,
  ATT_MARK_SUCCESS,
  ATT_MARK_ERROR,
} from './actions';

const initial = {
  list: [], // big table
  member: [], // single employee table
  loading: false,
  memberLoading: false,
  saving: false, // modal loader
  error: null,
  memberError: null,
  modalOpen: false,
  filters: { q: '', month: '', year: '' },
  mode: 'list', // 'list' | 'member'
};

export default function reducer(state = initial, action) {
  switch (action.type) {
    case ATT_SET_FILTERS:
      return { ...state, filters: { ...state.filters, ...action.patch } };
    case ATT_SET_MODE:
      return { ...state, mode: action.mode };
    case ATT_OPEN_MODAL:
      return { ...state, modalOpen: true };
    case ATT_CLOSE_MODAL:
      return { ...state, modalOpen: false };

    case ATT_FETCH_LIST:
      return { ...state, loading: true, error: null };
    case ATT_FETCH_LIST_SUCCESS:
      return { ...state, loading: false, list: action.items };
    case ATT_FETCH_LIST_ERROR:
      return { ...state, loading: false, error: action.error };

    case ATT_FETCH_MEMBER:
      return {
        ...state,
        memberLoading: true,
        memberError: null,
        mode: 'member',
      };
    case ATT_FETCH_MEMBER_SUCCESS:
      return { ...state, memberLoading: false, member: action.items };
    case ATT_FETCH_MEMBER_ERROR:
      return { ...state, memberLoading: false, memberError: action.error };

    case ATT_MARK_DATES:
    case ATT_MARK_MONTH:
      return { ...state, saving: true, error: null };
    case ATT_MARK_SUCCESS:
      return { ...state, saving: false, modalOpen: false };
    case ATT_MARK_ERROR:
      return { ...state, saving: false, error: action.error };
    default:
      return state;
  }
}
