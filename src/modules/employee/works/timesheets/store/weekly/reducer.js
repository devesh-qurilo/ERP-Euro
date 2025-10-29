// src/modules/employee/works/timesheets/store/weekly/reducer.js
import * as T from './types';

const initial = { weekly: null, loading: false, error: null };
export default function weeklyReducer(state = initial, action) {
  switch (action.type) {
    case T.FETCH_WEEKLY_REQUEST:
    case T.CREATE_WEEKLY_REQUEST:
      return { ...state, loading: true, error: null };
    case T.FETCH_WEEKLY_SUCCESS:
      return { ...state, loading: false, weekly: action.payload };
    case T.CREATE_WEEKLY_SUCCESS:
      return { ...state, loading: false }; // optionally stash last create
    case T.FETCH_WEEKLY_FAILURE:
    case T.CREATE_WEEKLY_FAILURE:
      return { ...state, loading: false, error: action.error || 'Failed' };
    default:
      return state;
  }
}
