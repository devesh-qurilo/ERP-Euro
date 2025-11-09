import * as T from './types';

const initialState = {
  list: [],
  total: 0,
  one: null,
  busy: false,
  error: null,

  params: { page: 0, size: 20, pipeline: '', dateFrom: '', dateTo: '', q: '' },

  formOpen: false,
  editing: null, // when set → edit mode

  followupOpen: false,
  followupDealId: null,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case T.SET_BUSY:
      return { ...state, busy: action.busy };

    case T.SET_PARAMS:
      return { ...state, params: { ...state.params, ...action.params } };

    case T.SET_FORM_OPEN:
      return { ...state, formOpen: action.open };

    case T.SET_EDITING:
      return { ...state, editing: action.deal || null };

    case T.SET_FOLLOWUP_OPEN:
      return {
        ...state,
        followupOpen: action.open,
        followupDealId: action.dealId ?? null,
      };

    case T.FETCH_LIST_REQUEST:
      return { ...state, busy: true, error: null };

    case T.FETCH_LIST_SUCCESS:
      return {
        ...state,
        busy: false,
        list: Array.isArray(action.data)
          ? action.data
          : action.data?.content ?? [],
        total:
          action.data?.totalElements ??
          action.data?.total ??
          (Array.isArray(action.data) ? action.data.length : 0),
      };

    case T.FETCH_LIST_FAILURE:
      return { ...state, busy: false, error: action.error };

    case T.FETCH_ONE_SUCCESS:
      return { ...state, one: action.data };

    case T.CREATE_SUCCESS:
    case T.UPDATE_SUCCESS:
    case T.DELETE_SUCCESS:
    case T.FOLLOWUP_CREATE_SUCCESS:
      return { ...state };

    case T.CREATE_FAILURE:
    case T.UPDATE_FAILURE:
    case T.DELETE_FAILURE:
    case T.FOLLOWUP_CREATE_FAILURE:
    case T.FETCH_ONE_FAILURE:
      return { ...state, error: action.error };

    default:
      return state;
  }
}
