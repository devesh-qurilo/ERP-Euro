import * as T from './types';

export const fetchMyTimesheets = (params = {}) => ({
  type: T.FETCH_MY_TIMESHEETS_REQUEST,
  params,
});

export const createWeeklyTimesheet = payload => ({
  type: T.CREATE_WEEKLY_TS_REQUEST,
  payload,
});
export const getWeeklyTimesheet = weekStartDate => ({
  type: T.GET_WEEKLY_TS_REQUEST,
  weekStartDate,
});
