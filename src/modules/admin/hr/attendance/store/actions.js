// src/modules/admin/hr/attendance/store/actions.js
export const ATT_SET_FILTERS = 'ATT/SET_FILTERS';
export const ATT_SET_MODE = 'ATT/SET_MODE'; // 'list' | 'member'
export const ATT_OPEN_MODAL = 'ATT/OPEN_MODAL';
export const ATT_CLOSE_MODAL = 'ATT/CLOSE_MODAL';

export const ATT_FETCH_LIST = 'ATT/FETCH_LIST';
export const ATT_FETCH_LIST_SUCCESS = 'ATT/FETCH_LIST_SUCCESS';
export const ATT_FETCH_LIST_ERROR = 'ATT/FETCH_LIST_ERROR';

export const ATT_FETCH_MEMBER = 'ATT/FETCH_MEMBER';
export const ATT_FETCH_MEMBER_SUCCESS = 'ATT/FETCH_MEMBER_SUCCESS';
export const ATT_FETCH_MEMBER_ERROR = 'ATT/FETCH_MEMBER_ERROR';

export const ATT_MARK_DATES = 'ATT/MARK_DATES';
export const ATT_MARK_MONTH = 'ATT/MARK_MONTH';
export const ATT_MARK_SUCCESS = 'ATT/MARK_SUCCESS';
export const ATT_MARK_ERROR = 'ATT/MARK_ERROR';

// action creators
export const setAttFilters = patch => ({ type: ATT_SET_FILTERS, patch });
export const setAttMode = mode => ({ type: ATT_SET_MODE, mode });
export const openAttModal = () => ({ type: ATT_OPEN_MODAL });
export const closeAttModal = () => ({ type: ATT_CLOSE_MODAL });

export const fetchAttList = () => ({ type: ATT_FETCH_LIST });
export const fetchAttByEmployee = employeeId => ({
  type: ATT_FETCH_MEMBER,
  employeeId,
});

export const markAttByDates = payload => ({ type: ATT_MARK_DATES, payload });
export const markAttByMonth = payload => ({ type: ATT_MARK_MONTH, payload });
