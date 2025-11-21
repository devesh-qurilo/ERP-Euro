// actions.js
export const FETCH_TIMELOG_REQUEST = 'admin/timelog/FETCH_TIMELOG_REQUEST';
export const FETCH_TIMELOG_SUCCESS = 'admin/timelog/FETCH_TIMELOG_SUCCESS';
export const FETCH_TIMELOG_FAILURE = 'admin/timelog/FETCH_TIMELOG_FAILURE';
export const SET_TIMELOG_SELECTED_DATE = 'admin/timelog/SET_SELECTED_DATE';

// action creators
export const fetchTimelogRequest = date => ({
  type: FETCH_TIMELOG_REQUEST,
  payload: { date },
});

export const fetchTimelogSuccess = payload => ({
  type: FETCH_TIMELOG_SUCCESS,
  payload,
});

export const fetchTimelogFailure = error => ({
  type: FETCH_TIMELOG_FAILURE,
  error,
});

export const setTimelogSelectedDate = date => ({
  type: SET_TIMELOG_SELECTED_DATE,
  payload: { date },
});
