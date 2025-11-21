// src/modules/admin/birthdays/store/reducer.js
import {
  FETCH_BIRTHDAYS_REQUEST,
  FETCH_BIRTHDAYS_SUCCESS,
  FETCH_BIRTHDAYS_FAILURE,
} from './actions';

const initialState = {
  loading: false,
  error: null,
  birthdays: [], // array of employee objects
};

export default function birthdaysReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_BIRTHDAYS_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_BIRTHDAYS_SUCCESS:
      return {
        ...state,
        loading: false,
        birthdays: Array.isArray(action.payload) ? action.payload : [],
        error: null,
      };
    case FETCH_BIRTHDAYS_FAILURE:
      return { ...state, loading: false, error: action.error };
    default:
      return state;
  }
}
