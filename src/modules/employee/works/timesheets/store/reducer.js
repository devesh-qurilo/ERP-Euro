import {
  FETCH_MY_TIMESHEETS_REQUEST,
  FETCH_MY_TIMESHEETS_SUCCESS,
  FETCH_MY_TIMESHEETS_FAILURE,
} from './types';

const initialState = { list: [], loading: false, error: null };

export default function employeeTimesheetsReducer(
  state = initialState,
  action,
) {
  switch (action.type) {
    case FETCH_MY_TIMESHEETS_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_MY_TIMESHEETS_SUCCESS:
      return { ...state, loading: false, list: action.payload, error: null };
    case FETCH_MY_TIMESHEETS_FAILURE:
      return { ...state, loading: false, error: action.error || 'Failed' };
    default:
      return state;
  }
}
