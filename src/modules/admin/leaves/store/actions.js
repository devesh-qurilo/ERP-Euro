// src/modules/admin/leaves/store/actions.js
export const FETCH_LEAVES_CALENDAR_REQUEST =
  'admin/leaves/FETCH_CALENDAR_REQUEST';
export const FETCH_LEAVES_CALENDAR_SUCCESS =
  'admin/leaves/FETCH_CALENDAR_SUCCESS';
export const FETCH_LEAVES_CALENDAR_FAILURE =
  'admin/leaves/FETCH_CALENDAR_FAILURE';

export const fetchLeavesCalendarRequest = date => ({
  type: FETCH_LEAVES_CALENDAR_REQUEST,
  payload: { date },
});

export const fetchLeavesCalendarSuccess = payload => ({
  type: FETCH_LEAVES_CALENDAR_SUCCESS,
  payload,
});

export const fetchLeavesCalendarFailure = error => ({
  type: FETCH_LEAVES_CALENDAR_FAILURE,
  error,
});
