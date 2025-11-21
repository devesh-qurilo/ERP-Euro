// src/modules/admin/leaves/store/reducer.js
import {
  FETCH_LEAVES_CALENDAR_REQUEST,
  FETCH_LEAVES_CALENDAR_SUCCESS,
  FETCH_LEAVES_CALENDAR_FAILURE,
} from './actions';

const initialState = {
  loading: false,
  error: null,
  date: null,
  entries: [], // array of { date, employeesOnLeave: [...] }
};

export default function leavesReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_LEAVES_CALENDAR_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        date: action.payload?.date ?? state.date,
      };
    case FETCH_LEAVES_CALENDAR_SUCCESS:
      return {
        ...state,
        loading: false,
        entries: Array.isArray(action.payload) ? action.payload : [],
        error: null,
      };
    case FETCH_LEAVES_CALENDAR_FAILURE:
      return { ...state, loading: false, error: action.error };
    default:
      return state;
  }
}
