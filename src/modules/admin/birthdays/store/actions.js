// src/modules/admin/birthdays/store/actions.js
export const FETCH_BIRTHDAYS_REQUEST = 'admin/birthdays/FETCH_REQUEST';
export const FETCH_BIRTHDAYS_SUCCESS = 'admin/birthdays/FETCH_SUCCESS';
export const FETCH_BIRTHDAYS_FAILURE = 'admin/birthdays/FETCH_FAILURE';

export const fetchBirthdaysRequest = () => ({ type: FETCH_BIRTHDAYS_REQUEST });
export const fetchBirthdaysSuccess = payload => ({
  type: FETCH_BIRTHDAYS_SUCCESS,
  payload,
});
export const fetchBirthdaysFailure = error => ({
  type: FETCH_BIRTHDAYS_FAILURE,
  error,
});
