// src/modules/admin/wfh/store/actions.js
export const FETCH_WFH_REQUEST = 'admin/wfh/FETCH_REQUEST';
export const FETCH_WFH_SUCCESS = 'admin/wfh/FETCH_SUCCESS';
export const FETCH_WFH_FAILURE = 'admin/wfh/FETCH_FAILURE';

export const fetchWfhRequest = date => ({
  type: FETCH_WFH_REQUEST,
  payload: { date },
});
export const fetchWfhSuccess = payload => ({
  type: FETCH_WFH_SUCCESS,
  payload,
});
export const fetchWfhFailure = error => ({ type: FETCH_WFH_FAILURE, error });
