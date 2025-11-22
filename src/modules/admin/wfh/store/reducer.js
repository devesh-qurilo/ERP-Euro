// src/modules/admin/wfh/store/reducer.js
import {
  FETCH_WFH_REQUEST,
  FETCH_WFH_SUCCESS,
  FETCH_WFH_FAILURE,
} from './actions';

const initialState = {
  loading: false,
  error: null,
  date: null,
  entries: [], // array of attendance objects for the date
};

export default function wfhReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_WFH_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        date: action.payload?.date ?? state.date,
      };
    case FETCH_WFH_SUCCESS:
      return {
        ...state,
        loading: false,
        entries: Array.isArray(action.payload) ? action.payload : [],
        error: null,
      };
    case FETCH_WFH_FAILURE:
      return { ...state, loading: false, error: action.error };
    default:
      return state;
  }
}
